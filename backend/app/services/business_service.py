"""
Business service layer - handles business operations
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, text
from app.models.business import Business
from app.services.business_directory import business_directory_service
from app.schemas import BusinessCreate, Business as BusinessSchema
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class BusinessService:
    """Service layer for business operations"""
    
    def __init__(self):
        self.directory_service = business_directory_service
    
    def get_categories(self) -> Dict[str, Dict]:
        """Get available business categories"""
        return self.directory_service.get_categories()
    
    def get_businesses(
        self, 
        db: Session,
        category: Optional[str] = None,
        query: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
        ) -> tuple[List[Business], int]:
        """Get businesses from database with optional filtering"""
        
        db_query = db.query(Business)
        
        # Filter by category
        if category:
            db_query = db_query.filter(Business.category == category)
        
        # Filter by search query
        if query:
            search_term = f"%{query.lower()}%"
            db_query = db_query.filter(
                Business.name.ilike(search_term)
            )        # Get total count
        total = db_query.count()
        
        # Apply pagination
        businesses = db_query.offset(skip).limit(limit).all()
        
        return businesses, total
    
    def get_nearby_businesses(
        self,
        db: Session,
        latitude: float,
        longitude: float,
        radius_km: float = 5,
        category: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get businesses near a location with distance calculation"""
        
        # Build base query
        db_query = db.query(Business)
        
        if category:
            db_query = db_query.filter(Business.category == category)
        
        # Get all businesses (we'll filter by distance in Python for simplicity)
        all_businesses = db_query.all()
        
        # Calculate distances and filter
        nearby_businesses = []
        
        for business in all_businesses:
            try:
                # Simple distance calculation (not perfect for large distances)
                lat_diff = business.latitude - latitude
                lon_diff = business.longitude - longitude
                distance_km = ((lat_diff ** 2 + lon_diff ** 2) ** 0.5) * 111.32  # Rough conversion to km
                
                if distance_km <= radius_km:
                    business_dict = {
                        'id': business.id,
                        'name': business.name,
                        'latitude': business.latitude,
                        'longitude': business.longitude,
                        'category': business.category,
                        'formatted_address': business.formatted_address,
                        'phone_number': business.phone_number,
                        'website': business.website,
                        'email': business.email,
                        'business_type': business.business_type,
                        'amenity': business.amenity,
                        'shop': business.shop,
                        'office': business.office,
                        'government': business.government,
                        'healthcare': business.healthcare,
                        'religion': business.religion,
                        'denomination': business.denomination,
                        'operator': business.operator,
                        'brand': business.brand,
                        'opening_hours': business.opening_hours,
                        'osm_id': business.osm_id,
                        'osm_type': business.osm_type,
                        'created_at': business.created_at,
                        'updated_at': business.updated_at,
                        'last_verified': business.last_verified,
                        'distance_km': round(distance_km, 2)
                    }
                    nearby_businesses.append(business_dict)
                    
            except Exception as e:
                logger.error(f"Error calculating distance for business {business.name}: {e}")
                continue
        
        # Sort by distance and limit
        nearby_businesses.sort(key=lambda x: x['distance_km'])
        return nearby_businesses[:limit]
    
    def refresh_businesses_from_api(self, db: Session, category: str = "grocery") -> Dict[str, Any]:
        """Refresh businesses from OpenStreetMap API"""
        
        try:
            logger.info(f"Starting refresh of {category} businesses from OpenStreetMap...")
            
            # Get fresh data from API
            api_businesses = self.directory_service.search_businesses(category, limit=500)
            
            if not api_businesses:
                return {
                    "success": False,
                    "message": f"No {category} businesses found from API",
                    "businesses_added": 0,
                    "businesses_updated": 0
                }
            
            businesses_added = 0
            businesses_updated = 0
            
            for api_business in api_businesses:
                try:
                    # Check if business already exists (by OSM ID or name + location)
                    existing_business = None
                    
                    if api_business.get('osm_id'):
                        existing_business = db.query(Business).filter(
                            and_(
                                Business.osm_id == str(api_business['osm_id']),
                                Business.category == category
                            )
                        ).first()
                    
                    if not existing_business:
                        # Check by name and approximate location
                        existing_business = db.query(Business).filter(
                            and_(
                                Business.name == api_business['name'],
                                Business.category == category,
                                func.abs(Business.latitude - api_business['latitude']) < 0.001,
                                func.abs(Business.longitude - api_business['longitude']) < 0.001
                            )
                        ).first()
                    
                    if existing_business:
                        # Update existing business
                        existing_business.name = api_business['name']
                        existing_business.latitude = api_business['latitude']
                        existing_business.longitude = api_business['longitude']
                        existing_business.formatted_address = api_business['formatted_address']
                        existing_business.phone_number = api_business.get('phone_number')
                        existing_business.website = api_business.get('website')
                        existing_business.email = api_business.get('email')
                        existing_business.business_type = api_business.get('business_type', [])
                        existing_business.amenity = api_business.get('amenity')
                        existing_business.shop = api_business.get('shop')
                        existing_business.office = api_business.get('office')
                        existing_business.government = api_business.get('government')
                        existing_business.healthcare = api_business.get('healthcare')
                        existing_business.religion = api_business.get('religion')
                        existing_business.denomination = api_business.get('denomination')
                        existing_business.operator = api_business.get('operator')
                        existing_business.brand = api_business.get('brand')
                        existing_business.opening_hours = api_business.get('opening_hours')
                        existing_business.osm_id = str(api_business.get('osm_id', ''))
                        existing_business.osm_type = api_business.get('osm_type')
                        existing_business.last_verified = datetime.utcnow()
                        existing_business.updated_at = datetime.utcnow()
                        
                        businesses_updated += 1
                    else:
                        # Create new business
                        new_business = Business(
                            name=api_business['name'],
                            latitude=api_business['latitude'],
                            longitude=api_business['longitude'],
                            category=category,
                            formatted_address=api_business['formatted_address'],
                            phone_number=api_business.get('phone_number'),
                            website=api_business.get('website'),
                            email=api_business.get('email'),
                            business_type=api_business.get('business_type', []),
                            amenity=api_business.get('amenity'),
                            shop=api_business.get('shop'),
                            office=api_business.get('office'),
                            government=api_business.get('government'),
                            healthcare=api_business.get('healthcare'),
                            religion=api_business.get('religion'),
                            denomination=api_business.get('denomination'),
                            operator=api_business.get('operator'),
                            brand=api_business.get('brand'),
                            opening_hours=api_business.get('opening_hours'),
                            osm_id=str(api_business.get('osm_id', '')),
                            osm_type=api_business.get('osm_type'),
                            last_verified=datetime.utcnow()
                        )
                        
                        db.add(new_business)
                        businesses_added += 1
                        
                except Exception as e:
                    logger.error(f"Error processing business {api_business.get('name', 'Unknown')}: {e}")
                    continue
            
            db.commit()
            
            logger.info(f"Business refresh completed: {businesses_added} added, {businesses_updated} updated")
            
            return {
                "success": True,
                "message": f"Successfully refreshed {category} businesses",
                "businesses_added": businesses_added,
                "businesses_updated": businesses_updated,
                "total_processed": len(api_businesses)
            }
            
        except Exception as e:
            logger.error(f"Error during {category} business refresh: {e}")
            db.rollback()
            return {
                "success": False,
                "message": f"Error refreshing {category} businesses: {str(e)}",
                "businesses_added": 0,
                "businesses_updated": 0
            }
    
    def get_business_stats(self, db: Session, category: Optional[str] = None) -> Dict[str, Any]:
        """Get statistics for businesses"""
        
        query = db.query(Business)
        
        if category:
            query = query.filter(Business.category == category)
        
        total_businesses = query.count()
        
        # Get businesses with contact info
        businesses_with_phone = query.filter(Business.phone_number.isnot(None)).count()
        businesses_with_website = query.filter(Business.website.isnot(None)).count()
        businesses_with_email = query.filter(Business.email.isnot(None)).count()
        
        # Get category breakdown
        category_stats = db.query(
            Business.category,
            func.count(Business.id).label('count')
        ).group_by(Business.category).all()
        
        return {
            "total_businesses": total_businesses,
            "businesses_with_phone": businesses_with_phone,
            "businesses_with_website": businesses_with_website,
            "businesses_with_email": businesses_with_email,
            "contact_coverage_percentage": round((businesses_with_phone / total_businesses * 100) if total_businesses > 0 else 0, 1),
            "categories": {cat: count for cat, count in category_stats}
        }

# Global service instance
business_service = BusinessService()