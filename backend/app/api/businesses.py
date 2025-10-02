"""
Business API endpoints
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.business_service import business_service
from app.models.business import Business as BusinessModel
from app.schemas import (
    BusinessList, Business, BusinessSearch, BusinessCategoryList, BusinessCategory
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/categories", response_model=BusinessCategoryList)
async def get_business_categories(db: Session = Depends(get_db)):
    """Get available business categories"""
    try:
        categories_data = business_service.get_categories()
        
        # Get category counts from database
        categories = []
        for key, info in categories_data.items():
            stats = business_service.get_business_stats(db, category=key)
            category = BusinessCategory(
                key=key,
                name=info["name"],
                icon=info["icon"],
                count=stats.get("total_businesses", 0)
            )
            categories.append(category)
        
        return BusinessCategoryList(categories=categories)
        
    except Exception as e:
        logger.error(f"Error getting business categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business categories")

@router.get("", response_model=BusinessList)
async def get_businesses(
    category: Optional[str] = Query(None, description="Business category"),
    query: Optional[str] = Query(None, description="Search query"),
    latitude: Optional[float] = Query(None, ge=-90, le=90, description="User latitude for nearby search"),
    longitude: Optional[float] = Query(None, ge=-180, le=180, description="User longitude for nearby search"),
    radius: Optional[float] = Query(5, ge=0.1, le=50, description="Search radius in kilometers"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of results"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: Session = Depends(get_db)
):
    """Get businesses with optional filtering and nearby search"""
    try:
        # If location provided, do nearby search
        if latitude is not None and longitude is not None:
            businesses_data = business_service.get_nearby_businesses(
                db, latitude, longitude, radius, category, limit
            )
            
            # Convert to Business schema
            businesses = [Business(**business) for business in businesses_data]
            total = len(businesses)
            has_more = False  # For nearby search, we don't paginate
            
        else:
            # Regular search
            businesses_db, total = business_service.get_businesses(
                db, category, query, offset, limit
            )
            
            businesses = [Business.from_orm(business) for business in businesses_db]
            has_more = (offset + limit) < total
        
        return BusinessList(
            businesses=businesses,
            total=total,
            limit=limit,
            offset=offset,
            has_more=has_more,
            category=category
        )
        
    except Exception as e:
        logger.error(f"Error getting businesses: {e}")
        raise HTTPException(status_code=500, detail="Failed to get businesses")

@router.post("/refresh/{category}")
async def refresh_businesses(
    category: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Refresh businesses from OpenStreetMap API for a specific category"""
    try:
        # Validate category
        available_categories = business_service.get_categories()
        if category not in available_categories:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid category. Available: {list(available_categories.keys())}"
            )
        
        # Run refresh in background
        background_tasks.add_task(
            business_service.refresh_businesses_from_api, 
            db, 
            category
        )
        
        return {
            "message": f"Started refreshing {category} businesses in background",
            "category": category
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting business refresh for {category}: {e}")
        raise HTTPException(status_code=500, detail="Failed to start business refresh")

@router.get("/stats")
async def get_business_stats(
    category: Optional[str] = Query(None, description="Category to get stats for"),
    db: Session = Depends(get_db)
):
    """Get business statistics"""
    try:
        stats = business_service.get_business_stats(db, category)
        return stats
        
    except Exception as e:
        logger.error(f"Error getting business stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business statistics")

@router.get("/{business_id}", response_model=Business)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    """Get a specific business by ID"""
    try:
        business = db.query(BusinessModel).filter(BusinessModel.id == business_id).first()
        
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
            
        return Business.from_orm(business)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting business {business_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business")