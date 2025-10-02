import googlemaps
import logging
from typing import List, Dict, Any, Optional
import time
import json
from app.config import settings
from geopy.distance import geodesic

logger = logging.getLogger(__name__)


class GooglePlacesService:
    def __init__(self):
        # Only initialize client if API key is provided
        if settings.google_maps_api_key and len(settings.google_maps_api_key) > 20:
            self.client = googlemaps.Client(key=settings.google_maps_api_key)
            logger.info("Google Places service initialized with real API key")
        else:
            self.client = None
            logger.warning("Google Places service initialized without API key - will use mock data")
            
        self.malta_center = (settings.malta_center_lat, settings.malta_center_lng)
        self.malta_bounds = {
            'north': settings.malta_bounds_north,
            'south': settings.malta_bounds_south,
            'east': settings.malta_bounds_east,
            'west': settings.malta_bounds_west
        }
    
    def is_within_malta(self, latitude: float, longitude: float) -> bool:
        """Check if coordinates are within Malta bounds"""
        return (
            self.malta_bounds['south'] <= latitude <= self.malta_bounds['north'] and
            self.malta_bounds['west'] <= longitude <= self.malta_bounds['east']
        )
    
    def search_grocery_stores(self, 
                            location: Optional[tuple] = None,
                            radius: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Search for grocery stores in Malta using Google Places API
        """
        if location is None:
            location = self.malta_center
        if radius is None:
            radius = settings.search_radius
            
        grocery_types = [
            'grocery_or_supermarket',
            'supermarket',
            'food',
            'store'
        ]
        
        all_stores = []
        seen_place_ids = set()
        
        for place_type in grocery_types:
            try:
                logger.info(f"Searching for {place_type} near {location}")
                
                # Initial search
                places_result = self.client.places_nearby(
                    location=location,
                    radius=radius,
                    type=place_type,
                    language='en'
                )
                
                # Process initial results
                stores = self._process_places_results(places_result.get('results', []))
                for store in stores:
                    if store['place_id'] not in seen_place_ids:
                        all_stores.append(store)
                        seen_place_ids.add(store['place_id'])
                
                # Handle pagination if there are more results
                next_page_token = places_result.get('next_page_token')
                while next_page_token and len(all_stores) < settings.max_results_per_search * len(grocery_types):
                    time.sleep(2)  # Required delay for next_page_token
                    
                    try:
                        places_result = self.client.places_nearby(
                            page_token=next_page_token
                        )
                        
                        stores = self._process_places_results(places_result.get('results', []))
                        for store in stores:
                            if store['place_id'] not in seen_place_ids:
                                all_stores.append(store)
                                seen_place_ids.add(store['place_id'])
                        
                        next_page_token = places_result.get('next_page_token')
                    except Exception as e:
                        logger.error(f"Error fetching next page for {place_type}: {str(e)}")
                        break
                        
            except Exception as e:
                logger.error(f"Error searching for {place_type}: {str(e)}")
                continue
        
        logger.info(f"Found {len(all_stores)} unique grocery stores")
        return all_stores
    
    def _process_places_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process and filter places results"""
        processed_stores = []
        
        for place in results:
            try:
                # Extract location
                location = place.get('geometry', {}).get('location', {})
                latitude = location.get('lat')
                longitude = location.get('lng')
                
                if not latitude or not longitude:
                    continue
                
                # Check if within Malta bounds
                if not self.is_within_malta(latitude, longitude):
                    logger.debug(f"Skipping {place.get('name')} - outside Malta bounds")
                    continue
                
                # Filter out non-grocery related places
                types = place.get('types', [])
                if not self._is_grocery_related(place.get('name', ''), types):
                    continue
                
                store_data = {
                    'place_id': place.get('place_id'),
                    'name': place.get('name'),
                    'latitude': latitude,
                    'longitude': longitude,
                    'formatted_address': place.get('vicinity') or place.get('formatted_address'),
                    'rating': place.get('rating'),
                    'user_ratings_total': place.get('user_ratings_total'),
                    'price_level': place.get('price_level'),
                    'types': types,
                    'business_status': place.get('business_status'),
                    'permanently_closed': place.get('permanently_closed', False),
                    'opening_hours': place.get('opening_hours'),
                }
                
                processed_stores.append(store_data)
                
            except Exception as e:
                logger.error(f"Error processing place {place.get('name', 'Unknown')}: {str(e)}")
                continue
        
        return processed_stores
    
    def _is_grocery_related(self, name: str, types: List[str]) -> bool:
        """Filter to include only grocery-related establishments"""
        name_lower = name.lower()
        
        # Exclude certain types of businesses
        excluded_keywords = [
            'pharmacy', 'bank', 'atm', 'gas station', 'petrol',
            'restaurant', 'cafe', 'bar', 'pub', 'hotel',
            'hospital', 'clinic', 'doctor', 'dentist'
        ]
        
        for keyword in excluded_keywords:
            if keyword in name_lower:
                return False
        
        # Include grocery-related types
        grocery_types = {
            'grocery_or_supermarket', 'supermarket', 'food', 'store',
            'convenience_store', 'shopping_mall'
        }
        
        return bool(set(types) & grocery_types)
    
    def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific place"""
        try:
            fields = [
                'place_id', 'name', 'formatted_address', 'geometry',
                'formatted_phone_number', 'website', 'rating',
                'user_ratings_total', 'price_level', 'opening_hours',
                'types', 'business_status', 'permanently_closed'
            ]
            
            result = self.client.place(place_id=place_id, fields=fields, language='en')
            place_details = result.get('result', {})
            
            if not place_details:
                return None
            
            # Extract location
            location = place_details.get('geometry', {}).get('location', {})
            latitude = location.get('lat')
            longitude = location.get('lng')
            
            if not latitude or not longitude:
                return None
            
            # Check Malta bounds
            if not self.is_within_malta(latitude, longitude):
                return None
            
            return {
                'place_id': place_details.get('place_id'),
                'name': place_details.get('name'),
                'latitude': latitude,
                'longitude': longitude,
                'formatted_address': place_details.get('formatted_address'),
                'phone_number': place_details.get('formatted_phone_number'),
                'website': place_details.get('website'),
                'rating': place_details.get('rating'),
                'user_ratings_total': place_details.get('user_ratings_total'),
                'price_level': place_details.get('price_level'),
                'types': place_details.get('types', []),
                'business_status': place_details.get('business_status'),
                'permanently_closed': place_details.get('permanently_closed', False),
                'opening_hours': place_details.get('opening_hours', {}),
            }
            
        except Exception as e:
            logger.error(f"Error getting place details for {place_id}: {str(e)}")
            return None
    
    def text_search_grocery_stores(self, query: str) -> List[Dict[str, Any]]:
        """Search for grocery stores using text query"""
        try:
            # Add location bias to Malta
            location_bias = f"circle:25000@{settings.malta_center_lat},{settings.malta_center_lng}"
            
            # Enhance query with grocery-related terms
            enhanced_query = f"{query} grocery supermarket food store Malta"
            
            result = self.client.places(
                query=enhanced_query,
                location=(settings.malta_center_lat, settings.malta_center_lng),
                radius=settings.search_radius,
                language='en'
            )
            
            places = result.get('results', [])
            return self._process_places_results(places)
            
        except Exception as e:
            logger.error(f"Error in text search for '{query}': {str(e)}")
            return []


# Create a singleton instance
google_places_service = GooglePlacesService()