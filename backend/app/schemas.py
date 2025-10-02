from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import json


class GroceryStoreBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    formatted_address: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    user_ratings_total: Optional[int] = Field(None, ge=0)
    price_level: Optional[int] = Field(None, ge=0, le=4)
    business_status: Optional[str] = None
    permanently_closed: bool = False


class GroceryStoreCreate(GroceryStoreBase):
    google_place_id: str = Field(..., min_length=1)
    opening_hours: Optional[Dict[str, Any]] = None
    types: Optional[List[str]] = None
    
    @validator('opening_hours', pre=True)
    def validate_opening_hours(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v
    
    @validator('types', pre=True)
    def validate_types(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v if isinstance(v, list) else []


class GroceryStoreUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    formatted_address: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    user_ratings_total: Optional[int] = Field(None, ge=0)
    price_level: Optional[int] = Field(None, ge=0, le=4)
    business_status: Optional[str] = None
    permanently_closed: Optional[bool] = None
    opening_hours: Optional[Dict[str, Any]] = None
    types: Optional[List[str]] = None


class GroceryStore(GroceryStoreBase):
    id: int
    google_place_id: str
    opening_hours: Optional[Dict[str, Any]] = None
    types: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_verified: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
    @validator('opening_hours', pre=True)
    def parse_opening_hours(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v
    
    @validator('types', pre=True)
    def parse_types(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v if isinstance(v, list) else []


class GroceryStoreSearch(BaseModel):
    query: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    radius: Optional[int] = Field(None, ge=100, le=50000)  # meters
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_price_level: Optional[int] = Field(None, ge=0, le=4)
    exclude_closed: bool = True
    limit: int = Field(50, ge=1, le=100)
    offset: int = Field(0, ge=0)


class GroceryStoreList(BaseModel):
    stores: List[GroceryStore]
    total: int
    limit: int
    offset: int
    has_more: bool


# Business Directory Schemas
class BusinessBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    category: str = Field(..., min_length=1)  # grocery, companies, government, etc.
    formatted_address: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None


class BusinessCreate(BusinessBase):
    business_type: Optional[List[str]] = None
    amenity: Optional[str] = None
    shop: Optional[str] = None
    office: Optional[str] = None
    government: Optional[str] = None
    healthcare: Optional[str] = None
    religion: Optional[str] = None
    denomination: Optional[str] = None
    operator: Optional[str] = None
    brand: Optional[str] = None
    opening_hours: Optional[Dict[str, Any]] = None
    osm_id: Optional[str] = None
    osm_type: Optional[str] = None


class Business(BusinessBase):
    id: int
    business_type: Optional[List[str]] = None
    amenity: Optional[str] = None
    shop: Optional[str] = None
    office: Optional[str] = None
    government: Optional[str] = None
    healthcare: Optional[str] = None
    religion: Optional[str] = None
    denomination: Optional[str] = None
    operator: Optional[str] = None
    brand: Optional[str] = None
    opening_hours: Optional[Dict[str, Any]] = None
    osm_id: Optional[str] = None
    osm_type: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_verified: Optional[datetime] = None
    distance_km: Optional[float] = None  # For nearby searches
    
    class Config:
        from_attributes = True


class BusinessSearch(BaseModel):
    category: Optional[str] = None
    query: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    radius: Optional[int] = Field(None, ge=100, le=50000)  # meters
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)


class BusinessList(BaseModel):
    businesses: List[Business]
    total: int
    limit: int
    offset: int
    has_more: bool
    category: Optional[str] = None


class BusinessCategory(BaseModel):
    key: str
    name: str
    icon: str
    count: Optional[int] = None


class BusinessCategoryList(BaseModel):
    categories: List[BusinessCategory]