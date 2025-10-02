"""
Business Directory Service for Malta
Handles multiple business categories using OpenStreetMap Overpass API
"""
import requests
import logging
from typing import List, Dict, Optional, Any
from geopy.distance import geodesic
from datetime import datetime

logger = logging.getLogger(__name__)

class BusinessDirectoryService:
    """Service for fetching various business types in Malta using OpenStreetMap"""
    
    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"
        self.base_area = '[out:json][timeout:30];area["name"="Malta"]["admin_level"="2"]->.searchArea;'
        
        # Business categories with their OpenStreetMap query configurations
        self.categories = {
            "grocery": {
                "name": "Grocery Stores & Supermarkets",
                "query": '(node["shop"~"^(supermarket|grocery|convenience)$"]["name"](area.searchArea);way["shop"~"^(supermarket|grocery|convenience)$"]["name"](area.searchArea););',
                "icon": "🛒"
            },
            "education": {
                "name": "Education Institutions",
                "query": '(node["amenity"~"^(university|college|school|kindergarten)$"]["name"](area.searchArea);way["amenity"~"^(university|college|school|kindergarten)$"]["name"](area.searchArea););',
                "icon": "🎓"
            },
            "religion": {
                "name": "Churches & Religious Sites",
                "query": '(node["amenity"="place_of_worship"]["name"](area.searchArea);way["amenity"="place_of_worship"]["name"](area.searchArea););',
                "icon": "⛪"
            },
            "medical": {
                "name": "Hospitals & Medical Centers",
                "query": '(node["amenity"~"^(hospital|clinic|doctors)$"]["name"](area.searchArea);way["amenity"~"^(hospital|clinic|doctors)$"]["name"](area.searchArea);node["healthcare"]["name"](area.searchArea);way["healthcare"]["name"](area.searchArea););',
                "icon": "🏥"
            },
            "pharmacy": {
                "name": "Pharmacies",
                "query": '(node["amenity"="pharmacy"]["name"](area.searchArea);way["amenity"="pharmacy"]["name"](area.searchArea););',
                "icon": "💊"
            }
        }
    
    def get_categories(self) -> Dict[str, Dict]:
        """Get available business categories"""
        return {
            key: {
                "name": info["name"],
                "icon": info["icon"]
            } 
            for key, info in self.categories.items()
        }
    
    def search_businesses(self, category: str = "grocery", limit: int = 100) -> List[Dict[str, Any]]:
        """
        Search for businesses in a specific category
        
        Args:
            category: Business category (grocery, companies, government, etc.)
            limit: Maximum number of results to return
            
        Returns:
            List of business dictionaries with standardized fields
        """
        if category not in self.categories:
            logger.error(f"Unknown category: {category}")
            return []
        
        category_config = self.categories[category]
        
        # Build Overpass QL query
        overpass_query = f"""
        {self.base_area}
        {category_config["query"]}
        out center meta;
        """
        
        try:
            logger.info(f"Fetching {category} businesses from OpenStreetMap...")
            
            response = requests.post(
                self.overpass_url,
                data=overpass_query,
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                timeout=60
            )
            response.raise_for_status()
            
            data = response.json()
            businesses = []
            
            for element in data.get('elements', []):
                business = self._parse_business_element(element, category)
                if business:
                    businesses.append(business)
            
            # Sort by name and limit results
            businesses.sort(key=lambda x: x.get('name', '').lower())
            limited_businesses = businesses[:limit]
            
            logger.info(f"Found {len(limited_businesses)} {category} businesses in Malta")
            return limited_businesses
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {category} businesses: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error while fetching {category} businesses: {e}")
            return []
    
    def _parse_business_element(self, element: Dict, category: str) -> Optional[Dict[str, Any]]:
        """Parse a single business element from OpenStreetMap data"""
        try:
            tags = element.get('tags', {})
            name = tags.get('name', '').strip()
            
            if not name:
                return None
            
            # Get coordinates
            if element['type'] == 'node':
                lat, lon = element['lat'], element['lon']
            elif element['type'] == 'way' and 'center' in element:
                lat, lon = element['center']['lat'], element['center']['lon']
            else:
                return None
            
            # Build standardized business object
            business = {
                'name': name,
                'latitude': lat,
                'longitude': lon,
                'category': category,
                'formatted_address': self._build_address(tags, lat, lon),
                'phone_number': tags.get('phone'),
                'website': tags.get('website') or tags.get('contact:website'),
                'email': tags.get('email') or tags.get('contact:email'),
                'opening_hours': self._parse_opening_hours(tags.get('opening_hours')),
                'business_type': self._get_business_type(tags, category),
                'amenity': tags.get('amenity'),
                'shop': tags.get('shop'),
                'office': tags.get('office'),
                'government': tags.get('government'),
                'healthcare': tags.get('healthcare'),
                'religion': tags.get('religion'),
                'denomination': tags.get('denomination'),
                'operator': tags.get('operator'),
                'brand': tags.get('brand'),
                'osm_id': element.get('id'),
                'osm_type': element.get('type'),
                'created_at': datetime.utcnow().isoformat(),
                'last_verified': datetime.utcnow().isoformat()
            }
            
            return business
            
        except Exception as e:
            logger.error(f"Error parsing business element: {e}")
            return None
    
    def _build_address(self, tags: Dict, lat: float, lon: float) -> str:
        """Build formatted address from OSM tags"""
        address_parts = []
        
        # Add house number and street
        if tags.get('addr:housenumber') and tags.get('addr:street'):
            address_parts.append(f"{tags['addr:housenumber']} {tags['addr:street']}")
        elif tags.get('addr:street'):
            address_parts.append(tags['addr:street'])
        
        # Add city/locality
        if tags.get('addr:city'):
            address_parts.append(tags['addr:city'])
        elif tags.get('addr:locality'):
            address_parts.append(tags['addr:locality'])
        
        # Add postal code
        if tags.get('addr:postcode'):
            address_parts.append(tags['addr:postcode'])
        
        if address_parts:
            return ', '.join(address_parts) + ', Malta'
        else:
            return f"Malta ({lat:.4f}, {lon:.4f})"
    
    def _parse_opening_hours(self, hours_string: Optional[str]) -> Optional[Dict]:
        """Parse opening hours string into structured format"""
        if not hours_string:
            return None
        
        try:
            # Simple parsing for common patterns
            if hours_string == "24/7":
                return {"open_now": True, "is_24_7": True}
            
            return {
                "raw": hours_string,
                "open_now": None  # Would need complex parsing for accurate status
            }
        except Exception:
            return {"raw": hours_string}
    
    def _get_business_type(self, tags: Dict, category: str) -> List[str]:
        """Determine business type from tags"""
        types = []
        
        if category == "grocery":
            if tags.get('shop') == 'supermarket':
                types.append('supermarket')
            elif tags.get('shop') == 'grocery':
                types.append('grocery_store')
            elif tags.get('shop') == 'convenience':
                types.append('convenience_store')
        elif category == "companies":
            if tags.get('amenity') == 'bank':
                types.append('bank')
            elif tags.get('office'):
                types.append(f"office_{tags['office']}")
        elif category == "education":
            if tags.get('amenity') == 'university':
                types.append('university')
            elif tags.get('amenity') == 'school':
                types.append('school')
            elif tags.get('amenity') == 'kindergarten':
                types.append('kindergarten')
        elif category == "medical":
            if tags.get('amenity') == 'hospital':
                types.append('hospital')
            elif tags.get('amenity') == 'clinic':
                types.append('clinic')
            elif tags.get('healthcare'):
                types.append(f"healthcare_{tags['healthcare']}")
        elif category == "religion":
            if tags.get('amenity') == 'place_of_worship':
                if tags.get('religion'):
                    types.append(f"{tags['religion']}_place_of_worship")
                else:
                    types.append('place_of_worship')
        
        return types if types else [category]
    
    def get_nearby_businesses(self, lat: float, lon: float, radius_km: float = 5, 
                            category: str = "grocery", limit: int = 50) -> List[Dict[str, Any]]:
        """Get businesses near a specific location"""
        all_businesses = self.search_businesses(category, limit * 3)  # Get more to filter
        
        if not all_businesses:
            return []
        
        user_location = (lat, lon)
        nearby_businesses = []
        
        for business in all_businesses:
            try:
                business_location = (business['latitude'], business['longitude'])
                distance = geodesic(user_location, business_location).kilometers
                
                if distance <= radius_km:
                    business['distance_km'] = round(distance, 2)
                    nearby_businesses.append(business)
            except Exception as e:
                logger.error(f"Error calculating distance for business {business.get('name')}: {e}")
                continue
        
        # Sort by distance and limit
        nearby_businesses.sort(key=lambda x: x.get('distance_km', float('inf')))
        return nearby_businesses[:limit]

# Global service instance
business_directory_service = BusinessDirectoryService()