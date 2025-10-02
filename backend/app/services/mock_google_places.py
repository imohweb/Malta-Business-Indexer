import json
import random
from typing import List, Dict, Any, Optional
from datetime import datetime
import time

class MockGooglePlacesService:
    """Mock service that simulates Google Places API responses with realistic Malta grocery store data"""
    
    def __init__(self):
        self.malta_center = (35.8989, 14.5146)
        self.malta_bounds = {
            'north': 35.95,
            'south': 35.8,
            'east': 14.58,
            'west': 14.18
        }
        
        # Mock grocery stores data for Malta
        self.mock_stores = [
            {
                'place_id': 'mock_greens_supermarket_valletta',
                'name': 'Greens Supermarket',
                'latitude': 35.8978,
                'longitude': 14.5125,
                'formatted_address': 'Republic Street, Valletta, Malta',
                'phone_number': '+356 2122 4567',
                'website': 'https://www.greens.com.mt',
                'rating': 4.2,
                'user_ratings_total': 245,
                'price_level': 2,
                'types': ['grocery_or_supermarket', 'supermarket', 'food', 'store'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 7:00 AM – 10:00 PM',
                        'Tuesday: 7:00 AM – 10:00 PM',
                        'Wednesday: 7:00 AM – 10:00 PM',
                        'Thursday: 7:00 AM – 10:00 PM',
                        'Friday: 7:00 AM – 10:00 PM',
                        'Saturday: 7:00 AM – 11:00 PM',
                        'Sunday: 8:00 AM – 9:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_pama_shopping_village',
                'name': 'Pama Shopping Village',
                'latitude': 35.8756,
                'longitude': 14.4892,
                'formatted_address': 'Triq il-Qrendi, Mqabba, Malta',
                'phone_number': '+356 2164 6200',
                'website': 'https://www.pama.com.mt',
                'rating': 4.5,
                'user_ratings_total': 1250,
                'price_level': 2,
                'types': ['grocery_or_supermarket', 'supermarket', 'shopping_mall'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 8:00 AM – 10:00 PM',
                        'Tuesday: 8:00 AM – 10:00 PM',
                        'Wednesday: 8:00 AM – 10:00 PM',
                        'Thursday: 8:00 AM – 10:00 PM',
                        'Friday: 8:00 AM – 10:00 PM',
                        'Saturday: 8:00 AM – 10:00 PM',
                        'Sunday: 8:00 AM – 9:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_valyou_supermarket_sliema',
                'name': 'Valyou Supermarket',
                'latitude': 35.9122,
                'longitude': 14.5019,
                'formatted_address': 'Tower Road, Sliema, Malta',
                'phone_number': '+356 2133 5678',
                'website': None,
                'rating': 3.8,
                'user_ratings_total': 180,
                'price_level': 1,
                'types': ['grocery_or_supermarket', 'supermarket', 'food'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 6:30 AM – 9:00 PM',
                        'Tuesday: 6:30 AM – 9:00 PM',
                        'Wednesday: 6:30 AM – 9:00 PM',
                        'Thursday: 6:30 AM – 9:00 PM',
                        'Friday: 6:30 AM – 9:00 PM',
                        'Saturday: 6:30 AM – 9:00 PM',
                        'Sunday: 7:00 AM – 8:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_welbees_supermarket_gozo',
                'name': 'Welbees Supermarket',
                'latitude': 36.0444,
                'longitude': 14.2406,
                'formatted_address': 'Triq ir-Repubblika, Victoria, Gozo, Malta',
                'phone_number': '+356 2155 1234',
                'website': 'https://www.welbees.com',
                'rating': 4.1,
                'user_ratings_total': 95,
                'price_level': 2,
                'types': ['grocery_or_supermarket', 'supermarket', 'food'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 7:00 AM – 9:00 PM',
                        'Tuesday: 7:00 AM – 9:00 PM',
                        'Wednesday: 7:00 AM – 9:00 PM',
                        'Thursday: 7:00 AM – 9:00 PM',
                        'Friday: 7:00 AM – 9:00 PM',
                        'Saturday: 7:00 AM – 9:00 PM',
                        'Sunday: 8:00 AM – 7:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_lidl_malta_birkirkara',
                'name': 'Lidl Malta',
                'latitude': 35.8972,
                'longitude': 14.4611,
                'formatted_address': 'Triq Dun Karm, Birkirkara, Malta',
                'phone_number': '+356 2144 8800',
                'website': 'https://www.lidl.com.mt',
                'rating': 4.3,
                'user_ratings_total': 567,
                'price_level': 1,
                'types': ['grocery_or_supermarket', 'supermarket', 'food'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 7:00 AM – 10:00 PM',
                        'Tuesday: 7:00 AM – 10:00 PM',
                        'Wednesday: 7:00 AM – 10:00 PM',
                        'Thursday: 7:00 AM – 10:00 PM',
                        'Friday: 7:00 AM – 10:00 PM',
                        'Saturday: 7:00 AM – 10:00 PM',
                        'Sunday: 8:00 AM – 9:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_tower_supermarket_gzira',
                'name': 'Tower Supermarket',
                'latitude': 35.9063,
                'longitude': 14.4947,
                'formatted_address': 'Triq it-Torri, Gzira, Malta',
                'phone_number': '+356 2131 4567',
                'website': None,
                'rating': 3.9,
                'user_ratings_total': 134,
                'price_level': 2,
                'types': ['grocery_or_supermarket', 'convenience_store', 'food'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 6:00 AM – 10:00 PM',
                        'Tuesday: 6:00 AM – 10:00 PM',
                        'Wednesday: 6:00 AM – 10:00 PM',
                        'Thursday: 6:00 AM – 10:00 PM',
                        'Friday: 6:00 AM – 10:00 PM',
                        'Saturday: 6:00 AM – 10:00 PM',
                        'Sunday: 7:00 AM – 9:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_smart_supermarket_hamrun',
                'name': 'Smart Supermarket',
                'latitude': 35.8842,
                'longitude': 14.4956,
                'formatted_address': 'Triq Vilhena, Hamrun, Malta',
                'phone_number': '+356 2122 7890',
                'website': None,
                'rating': 3.6,
                'user_ratings_total': 89,
                'price_level': 1,
                'types': ['grocery_or_supermarket', 'convenience_store'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': False,
                    'weekday_text': [
                        'Monday: 6:30 AM – 9:30 PM',
                        'Tuesday: 6:30 AM – 9:30 PM',
                        'Wednesday: 6:30 AM – 9:30 PM',
                        'Thursday: 6:30 AM – 9:30 PM',
                        'Friday: 6:30 AM – 9:30 PM',
                        'Saturday: 6:30 AM – 9:30 PM',
                        'Sunday: 7:30 AM – 8:30 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_park_towers_supermarket',
                'name': 'Park Towers Supermarket',
                'latitude': 35.9142,
                'longitude': 14.4889,
                'formatted_address': 'Park Towers, Tigne Point, Sliema, Malta',
                'phone_number': '+356 2138 9012',
                'website': None,
                'rating': 4.0,
                'user_ratings_total': 156,
                'price_level': 3,
                'types': ['grocery_or_supermarket', 'supermarket'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 7:30 AM – 9:30 PM',
                        'Tuesday: 7:30 AM – 9:30 PM',
                        'Wednesday: 7:30 AM – 9:30 PM',
                        'Thursday: 7:30 AM – 9:30 PM',
                        'Friday: 7:30 AM – 9:30 PM',
                        'Saturday: 7:30 AM – 9:30 PM',
                        'Sunday: 8:00 AM – 8:00 PM'
                    ]
                }
            },
            {
                'place_id': 'mock_convenience_store_closed',
                'name': 'Corner Shop Express',
                'latitude': 35.8945,
                'longitude': 14.5089,
                'formatted_address': 'Triq San Gwann, Floriana, Malta',
                'phone_number': None,
                'website': None,
                'rating': 2.8,
                'user_ratings_total': 23,
                'price_level': None,
                'types': ['convenience_store', 'store'],
                'business_status': 'CLOSED_TEMPORARILY',
                'permanently_closed': False,
                'opening_hours': None
            },
            {
                'place_id': 'mock_mega_mart_mosta',
                'name': 'Mega Mart',
                'latitude': 35.9089,
                'longitude': 14.4278,
                'formatted_address': 'Triq il-Kbira, Mosta, Malta',
                'phone_number': '+356 2143 5678',
                'website': 'https://www.megamart.com.mt',
                'rating': 4.4,
                'user_ratings_total': 289,
                'price_level': 2,
                'types': ['grocery_or_supermarket', 'supermarket', 'food'],
                'business_status': 'OPERATIONAL',
                'permanently_closed': False,
                'opening_hours': {
                    'open_now': True,
                    'weekday_text': [
                        'Monday: 7:00 AM – 10:30 PM',
                        'Tuesday: 7:00 AM – 10:30 PM',
                        'Wednesday: 7:00 AM – 10:30 PM',
                        'Thursday: 7:00 AM – 10:30 PM',
                        'Friday: 7:00 AM – 10:30 PM',
                        'Saturday: 7:00 AM – 10:30 PM',
                        'Sunday: 8:00 AM – 9:30 PM'
                    ]
                }
            }
        ]
    
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
        Mock search for grocery stores in Malta
        """
        print("🧪 Using MOCK Google Places API - No API costs!")
        time.sleep(1)  # Simulate API delay
        
        # Return all mock stores for simplicity
        return [store.copy() for store in self.mock_stores]
    
    def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific place"""
        print(f"🧪 Getting MOCK place details for: {place_id}")
        
        for store in self.mock_stores:
            if store['place_id'] == place_id:
                return store.copy()
        
        return None
    
    def text_search_grocery_stores(self, query: str) -> List[Dict[str, Any]]:
        """Search for grocery stores using text query"""
        print(f"🧪 MOCK text search for: '{query}'")
        
        query_lower = query.lower()
        results = []
        
        for store in self.mock_stores:
            if (query_lower in store['name'].lower() or 
                (store['formatted_address'] and query_lower in store['formatted_address'].lower()) or
                any(query_lower in store_type for store_type in store['types'])):
                results.append(store.copy())
        
        return results
    
    def filter_by_location(self, stores: List[Dict[str, Any]], 
                          latitude: float, longitude: float, 
                          radius_meters: int) -> List[Dict[str, Any]]:
        """Filter stores by distance from a location"""
        import math
        
        def calculate_distance(lat1, lon1, lat2, lon2):
            R = 6371000  # Earth's radius in meters
            phi1 = math.radians(lat1)
            phi2 = math.radians(lat2)
            delta_phi = math.radians(lat2 - lat1)
            delta_lambda = math.radians(lon2 - lon1)
            
            a = (math.sin(delta_phi / 2) ** 2 + 
                 math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            
            return R * c
        
        filtered_stores = []
        for store in stores:
            distance = calculate_distance(
                latitude, longitude,
                store['latitude'], store['longitude']
            )
            if distance <= radius_meters:
                store_copy = store.copy()
                store_copy['distance'] = round(distance)
                filtered_stores.append(store_copy)
        
        # Sort by distance
        filtered_stores.sort(key=lambda x: x.get('distance', 0))
        return filtered_stores


# Create a singleton instance for mock mode
mock_google_places_service = MockGooglePlacesService()