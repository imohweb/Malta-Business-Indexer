from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Malta Grocery Stores Indexer API"
    api_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./grocery_stores.db"
    
    # Maps Service Configuration
    # Using OpenStreetMap (free and open source)
    maps_service: str = "openstreetmap"
    
    # OpenStreetMap Configuration
    use_openstreetmap: bool = True
    overpass_api_url: str = "https://overpass-api.de/api/interpreter"
    nominatim_api_url: str = "https://nominatim.openstreetmap.org"
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3004", "http://localhost:3000", "http://localhost:8080"]
    
    # Malta Geographic Bounds (for API searches)
    malta_bounds_north: float = 35.95
    malta_bounds_south: float = 35.8
    malta_bounds_east: float = 14.58
    malta_bounds_west: float = 14.18
    
    # Malta Center Coordinates
    malta_center_lat: float = 35.8989
    malta_center_lng: float = 14.5146
    
    # Search Parameters
    search_radius: int = 25000  # 25km radius to cover all of Malta
    max_results_per_search: int = 60  # Google Places API limit per request
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Allow extra environment variables


settings = Settings()