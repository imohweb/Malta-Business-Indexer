from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os

from app.database import get_db
from app.schemas import (
    GroceryStore, GroceryStoreCreate, GroceryStoreUpdate, 
    GroceryStoreSearch, GroceryStoreList
)
from app.models.grocery_store import GroceryStore as GroceryStoreModel
from app.services.grocery_store import grocery_store_service
from app.config import settings

router = APIRouter(prefix="/api/stores", tags=["grocery-stores"])


@router.get("/", response_model=GroceryStoreList)
async def get_stores(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all grocery stores with pagination"""
    if limit > 100:
        limit = 100
    
    stores = grocery_store_service.get_all_stores(db, skip=skip, limit=limit)
    total = grocery_store_service.get_stores_count(db)
    
    return GroceryStoreList(
        stores=stores,
        total=total,
        limit=limit,
        offset=skip,
        has_more=skip + limit < total
    )


@router.get("/search", response_model=GroceryStoreList)
async def search_stores(
    query: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[int] = None,
    min_rating: Optional[float] = None,
    max_price_level: Optional[int] = None,
    exclude_closed: bool = True,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Search grocery stores with various filters"""
    if limit > 100:
        limit = 100
    
    search_params = GroceryStoreSearch(
        query=query,
        latitude=latitude,
        longitude=longitude,
        radius=radius,
        min_rating=min_rating,
        max_price_level=max_price_level,
        exclude_closed=exclude_closed,
        limit=limit,
        offset=offset
    )
    
    stores, total = grocery_store_service.search_stores(db, search_params)
    
    return GroceryStoreList(
        stores=stores,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + limit < total
    )


@router.get("/nearby", response_model=List[GroceryStore])
async def get_nearby_stores(
    latitude: float,
    longitude: float,
    radius: int = 5000,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get grocery stores near a specific location"""
    if limit > 50:
        limit = 50
    if radius > 25000:  # Max 25km
        radius = 25000
    
    stores = grocery_store_service.get_stores_near_location(
        db, latitude, longitude, radius, limit
    )
    return stores


@router.get("/{store_id}", response_model=GroceryStore)
async def get_store(store_id: int, db: Session = Depends(get_db)):
    """Get a specific grocery store by ID"""
    store = grocery_store_service.get_store_by_id(db, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Grocery store not found")
    return store


@router.post("/", response_model=GroceryStore)
async def create_store(
    store: GroceryStoreCreate,
    db: Session = Depends(get_db)
):
    """Create a new grocery store"""
    # Check if store with same Google Place ID already exists
    existing_store = grocery_store_service.get_store_by_place_id(db, store.google_place_id)
    if existing_store:
        raise HTTPException(
            status_code=400, 
            detail=f"Store with Google Place ID {store.google_place_id} already exists"
        )
    
    return grocery_store_service.create_store(db, store)


@router.put("/{store_id}", response_model=GroceryStore)
async def update_store(
    store_id: int,
    store_update: GroceryStoreUpdate,
    db: Session = Depends(get_db)
):
    """Update a grocery store"""
    store = grocery_store_service.update_store(db, store_id, store_update)
    if not store:
        raise HTTPException(status_code=404, detail="Grocery store not found")
    return store


@router.delete("/{store_id}")
async def delete_store(store_id: int, db: Session = Depends(get_db)):
    """Delete a grocery store"""
    success = grocery_store_service.delete_store(db, store_id)
    if not success:
        raise HTTPException(status_code=404, detail="Grocery store not found")
    return {"message": "Store deleted successfully"}


@router.post("/refresh")
async def refresh_stores_data(
    background_tasks: BackgroundTasks,
    force_refresh: bool = False,
    db: Session = Depends(get_db)
):
    """Refresh grocery stores data from the configured service (OpenStreetMap, Google, or Mock)"""
    
    try:
        result = grocery_store_service.refresh_stores_from_api(db)
        return {
            "message": "Store refresh completed",
            "result": result,
            "status": "completed" if result["success"] else "failed",
            "service": settings.maps_service
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to refresh stores data: {str(e)}"
        )


@router.get("/text-search/{query}")
async def text_search_places(query: str):
    """Search for grocery stores using text query via the configured service"""
    try:
        places = grocery_store_service.search_stores_by_text(query)
        return {
            "query": query,
            "results": places,
            "count": len(places),
            "service": settings.maps_service
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching places: {str(e)}")


@router.get("/place/{place_id}/details")
async def get_place_details(place_id: str):
    """Get detailed information for a place from the configured service"""
    try:
        # Import the appropriate service based on configuration
        if settings.maps_service == "openstreetmap":
            from app.services.openstreetmap_places import openstreetmap_service
            place_details = openstreetmap_service.get_place_details(place_id)
        elif settings.maps_service == "google":
            from app.services.google_places import google_places_service
            place_details = google_places_service.get_place_details(place_id)
        else:
            from app.services.mock_google_places import mock_google_places_service
            place_details = mock_google_places_service.get_place_details(place_id)
        
        if not place_details:
            raise HTTPException(status_code=404, detail="Place not found or not in Malta")
        return place_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching place details: {str(e)}")


@router.get("/stats/overview")
async def get_store_stats(db: Session = Depends(get_db)):
    """Get overview statistics of grocery stores"""
    total_stores = grocery_store_service.get_stores_count(db)
    
    # Get stores with ratings
    rated_stores = db.query(GroceryStoreModel).filter(
        GroceryStoreModel.rating.isnot(None),
        GroceryStoreModel.permanently_closed == False
    ).count()
    
    # Average rating
    avg_rating_result = db.query(
        func.avg(GroceryStoreModel.rating)
    ).filter(
        GroceryStoreModel.rating.isnot(None),
        GroceryStoreModel.permanently_closed == False
    ).scalar()
    
    avg_rating = round(avg_rating_result, 2) if avg_rating_result else None
    
    return {
        "total_stores": total_stores,
        "stores_with_ratings": rated_stores,
        "average_rating": avg_rating,
        "coverage_percentage": round((rated_stores / total_stores * 100), 2) if total_stores > 0 else 0
    }