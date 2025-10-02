from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
import json
from datetime import datetime
import math
import logging

from app.models.grocery_store import GroceryStore
from app.schemas import GroceryStoreCreate, GroceryStoreUpdate, GroceryStoreSearch
from app.config import settings

# Import appropriate service based on configuration
if settings.maps_service == "openstreetmap":
    from app.services.openstreetmap_places import openstreetmap_service as places_service
elif settings.maps_service == "google":
    from app.services.google_places import google_places_service as places_service
else:
    from app.services.mock_google_places import mock_google_places_service as places_service

logger = logging.getLogger(__name__)


class GroceryStoreService:
    @staticmethod
    def create_store(db: Session, store_data: GroceryStoreCreate) -> GroceryStore:
        """Create a new grocery store"""
        db_store = GroceryStore(
            google_place_id=store_data.google_place_id,
            name=store_data.name,
            latitude=store_data.latitude,
            longitude=store_data.longitude,
            formatted_address=store_data.formatted_address,
            phone_number=store_data.phone_number,
            website=store_data.website,
            rating=store_data.rating,
            user_ratings_total=store_data.user_ratings_total,
            price_level=store_data.price_level,
            business_status=store_data.business_status,
            permanently_closed=store_data.permanently_closed,
            opening_hours=json.dumps(store_data.opening_hours) if store_data.opening_hours else None,
            types=json.dumps(store_data.types) if store_data.types else None,
            last_verified=datetime.utcnow()
        )
        db.add(db_store)
        db.commit()
        db.refresh(db_store)
        return db_store

    @staticmethod
    def get_store_by_id(db: Session, store_id: int) -> Optional[GroceryStore]:
        """Get a grocery store by ID"""
        return db.query(GroceryStore).filter(GroceryStore.id == store_id).first()

    @staticmethod
    def get_store_by_place_id(db: Session, place_id: str) -> Optional[GroceryStore]:
        """Get a grocery store by Google Place ID"""
        return db.query(GroceryStore).filter(GroceryStore.google_place_id == place_id).first()

    @staticmethod
    def update_store(db: Session, store_id: int, store_data: GroceryStoreUpdate) -> Optional[GroceryStore]:
        """Update a grocery store"""
        db_store = db.query(GroceryStore).filter(GroceryStore.id == store_id).first()
        if not db_store:
            return None

        update_data = store_data.dict(exclude_unset=True)
        
        # Handle JSON fields
        if 'opening_hours' in update_data and update_data['opening_hours'] is not None:
            update_data['opening_hours'] = json.dumps(update_data['opening_hours'])
        if 'types' in update_data and update_data['types'] is not None:
            update_data['types'] = json.dumps(update_data['types'])
        
        for field, value in update_data.items():
            setattr(db_store, field, value)
        
        db_store.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_store)
        return db_store

    @staticmethod
    def delete_store(db: Session, store_id: int) -> bool:
        """Delete a grocery store"""
        db_store = db.query(GroceryStore).filter(GroceryStore.id == store_id).first()
        if not db_store:
            return False
        
        db.delete(db_store)
        db.commit()
        return True

    @staticmethod
    def search_stores(db: Session, search_params: GroceryStoreSearch) -> tuple[List[GroceryStore], int]:
        """Search grocery stores with filters"""
        query = db.query(GroceryStore)
        
        # Apply filters
        if search_params.exclude_closed:
            query = query.filter(
                and_(
                    GroceryStore.permanently_closed == False,
                    or_(
                        GroceryStore.business_status == 'OPERATIONAL',
                        GroceryStore.business_status.is_(None)
                    )
                )
            )
        
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    GroceryStore.name.ilike(search_term),
                    GroceryStore.formatted_address.ilike(search_term)
                )
            )
        
        if search_params.min_rating is not None:
            query = query.filter(GroceryStore.rating >= search_params.min_rating)
        
        if search_params.max_price_level is not None:
            query = query.filter(
                or_(
                    GroceryStore.price_level <= search_params.max_price_level,
                    GroceryStore.price_level.is_(None)
                )
            )
        
        # Location-based filtering
        if search_params.latitude is not None and search_params.longitude is not None:
            if search_params.radius:
                # Calculate bounding box for initial filtering (more efficient than distance calculation)
                lat_range = search_params.radius / 111320  # degrees per meter (approximate)
                lng_range = search_params.radius / (111320 * math.cos(math.radians(search_params.latitude)))
                
                query = query.filter(
                    and_(
                        GroceryStore.latitude.between(
                            search_params.latitude - lat_range,
                            search_params.latitude + lat_range
                        ),
                        GroceryStore.longitude.between(
                            search_params.longitude - lng_range,
                            search_params.longitude + lng_range
                        )
                    )
                )
        
        # Get total count before pagination
        total = query.count()
        
        # Apply pagination
        stores = query.offset(search_params.offset).limit(search_params.limit).all()
        
        # If radius search, filter by actual distance
        if (search_params.latitude is not None and 
            search_params.longitude is not None and 
            search_params.radius is not None):
            filtered_stores = []
            for store in stores:
                distance = GroceryStoreService.calculate_distance(
                    search_params.latitude, search_params.longitude,
                    store.latitude, store.longitude
                )
                if distance <= search_params.radius:
                    filtered_stores.append(store)
            stores = filtered_stores
        
        return stores, total

    @staticmethod
    def get_stores_near_location(db: Session, latitude: float, longitude: float, 
                               radius: int = 5000, limit: int = 50) -> List[GroceryStore]:
        """Get grocery stores near a specific location"""
        search_params = GroceryStoreSearch(
            latitude=latitude,
            longitude=longitude,
            radius=radius,
            limit=limit,
            exclude_closed=True
        )
        stores, _ = GroceryStoreService.search_stores(db, search_params)
        return stores

    @staticmethod
    def get_all_stores(db: Session, skip: int = 0, limit: int = 100) -> List[GroceryStore]:
        """Get all grocery stores with pagination"""
        return db.query(GroceryStore).filter(
            GroceryStore.permanently_closed == False
        ).offset(skip).limit(limit).all()

    @staticmethod
    def get_stores_count(db: Session) -> int:
        """Get total count of active grocery stores"""
        return db.query(GroceryStore).filter(
            GroceryStore.permanently_closed == False
        ).count()

    @staticmethod
    def upsert_store(db: Session, store_data: GroceryStoreCreate) -> GroceryStore:
        """Create or update a store based on Place ID (works for both Google and OSM)"""
        # Handle both Google place IDs and OSM place IDs
        place_id_field = 'google_place_id'  # Keep the same field for compatibility
        
        existing_store = GroceryStoreService.get_store_by_place_id(
            db, store_data.google_place_id
        )
        
        if existing_store:
            # Update existing store
            update_data = GroceryStoreUpdate(
                name=store_data.name,
                formatted_address=store_data.formatted_address,
                phone_number=store_data.phone_number,
                website=store_data.website,
                rating=store_data.rating,
                user_ratings_total=store_data.user_ratings_total,
                price_level=store_data.price_level,
                business_status=store_data.business_status,
                permanently_closed=store_data.permanently_closed,
                opening_hours=store_data.opening_hours,
                types=store_data.types
            )
            return GroceryStoreService.update_store(db, existing_store.id, update_data)
        else:
            # Create new store
            return GroceryStoreService.create_store(db, store_data)

    @staticmethod
    def refresh_stores_from_api(db: Session) -> dict:
        """Refresh grocery stores data from the configured API service"""
        logger.info(f"Refreshing stores using {settings.maps_service} service...")
        
        try:
            # Get fresh data from the API
            fresh_stores = places_service.search_grocery_stores()
            
            if not fresh_stores:
                logger.warning("No stores returned from API")
                return {"success": False, "message": "No stores found", "count": 0}
            
            # Convert to our schema format
            stores_to_upsert = []
            for store_data in fresh_stores:
                try:
                    store_create = GroceryStoreCreate(
                        google_place_id=store_data['place_id'],  # Use place_id from any service
                        name=store_data['name'],
                        latitude=store_data['latitude'],
                        longitude=store_data['longitude'],
                        formatted_address=store_data.get('formatted_address'),
                        phone_number=store_data.get('phone_number'),
                        website=store_data.get('website'),
                        rating=store_data.get('rating'),
                        user_ratings_total=store_data.get('user_ratings_total'),
                        price_level=store_data.get('price_level'),
                        business_status=store_data.get('business_status', 'OPERATIONAL'),
                        permanently_closed=store_data.get('permanently_closed', False),
                        opening_hours=store_data.get('opening_hours'),
                        types=store_data.get('types', [])
                    )
                    stores_to_upsert.append(store_create)
                except Exception as e:
                    logger.error(f"Error converting store data for {store_data.get('name', 'Unknown')}: {str(e)}")
                    continue
            
            # Bulk upsert
            processed_count = GroceryStoreService.bulk_upsert_stores(db, stores_to_upsert)
            
            logger.info(f"Successfully processed {processed_count} stores from {settings.maps_service}")
            
            return {
                "success": True,
                "message": f"Refreshed {processed_count} stores from {settings.maps_service}",
                "count": processed_count,
                "service": settings.maps_service
            }
            
        except Exception as e:
            logger.error(f"Error refreshing stores from {settings.maps_service}: {str(e)}")
            return {
                "success": False,
                "message": f"Error refreshing stores: {str(e)}",
                "count": 0
            }

    @staticmethod
    def search_stores_by_text(query: str) -> List[dict]:
        """Search stores by text using the configured service"""
        logger.info(f"Text search using {settings.maps_service} service for: {query}")
        try:
            return places_service.text_search_grocery_stores(query)
        except Exception as e:
            logger.error(f"Error in text search: {str(e)}")
            return []

    @staticmethod
    def bulk_upsert_stores(db: Session, stores_data: List[GroceryStoreCreate]) -> int:
        """Bulk insert or update stores"""
        processed_count = 0
        for store_data in stores_data:
            try:
                GroceryStoreService.upsert_store(db, store_data)
                processed_count += 1
            except Exception as e:
                # Log error but continue processing
                print(f"Error processing store {store_data.name}: {str(e)}")
                continue
        
        return processed_count

    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in meters using Haversine formula"""
        R = 6371000  # Earth's radius in meters
        
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_phi / 2) ** 2 + 
             math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c

    @staticmethod
    def get_stores_by_rating_range(db: Session, min_rating: float, max_rating: float) -> List[GroceryStore]:
        """Get stores within a specific rating range"""
        return db.query(GroceryStore).filter(
            and_(
                GroceryStore.rating >= min_rating,
                GroceryStore.rating <= max_rating,
                GroceryStore.permanently_closed == False
            )
        ).all()

    @staticmethod
    def refresh_store_data(db: Session, place_id: str) -> Optional[GroceryStore]:
        """Mark store for data refresh (update last_verified timestamp)"""
        db_store = db.query(GroceryStore).filter(GroceryStore.google_place_id == place_id).first()
        if db_store:
            db_store.last_verified = datetime.utcnow()
            db.commit()
            db.refresh(db_store)
        return db_store


# Create service instance
grocery_store_service = GroceryStoreService()