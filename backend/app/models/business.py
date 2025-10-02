"""
Business model for storing various business types
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database import Base

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)  # grocery, companies, government, etc.
    
    # Address information
    formatted_address = Column(String)
    
    # Contact information
    phone_number = Column(String)
    website = Column(String)
    email = Column(String)
    
    # Business details
    business_type = Column(JSON)  # List of types
    amenity = Column(String)
    shop = Column(String)
    office = Column(String)
    government = Column(String)
    healthcare = Column(String)
    religion = Column(String)
    denomination = Column(String)
    operator = Column(String)
    brand = Column(String)
    
    # Hours and availability
    opening_hours = Column(JSON)
    
    # OpenStreetMap data
    osm_id = Column(String, index=True)
    osm_type = Column(String)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_verified = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Business(id={self.id}, name='{self.name}', category='{self.category}')>"