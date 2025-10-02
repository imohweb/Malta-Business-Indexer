from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Index
from sqlalchemy.sql import func
from app.database import Base


class GroceryStore(Base):
    __tablename__ = "grocery_stores"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Google Places API data
    google_place_id = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    
    # Location data
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    formatted_address = Column(Text)
    
    # Store details
    phone_number = Column(String(50))
    website = Column(String(500))
    rating = Column(Float)
    user_ratings_total = Column(Integer)
    price_level = Column(Integer)  # 0-4 scale from Google
    
    # Business hours and status
    opening_hours = Column(Text)  # JSON string
    permanently_closed = Column(Boolean, default=False)
    business_status = Column(String(50))
    
    # Store types and categories
    types = Column(Text)  # JSON array as string
    
    # Additional metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_verified = Column(DateTime(timezone=True))
    
    # Search optimization indexes
    __table_args__ = (
        Index('idx_location', 'latitude', 'longitude'),
        Index('idx_name_search', 'name'),
        Index('idx_rating', 'rating'),
        Index('idx_status', 'business_status', 'permanently_closed'),
    )