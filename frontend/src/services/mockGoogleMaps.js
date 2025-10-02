// Mock Google Maps service for development/testing without API costs
class MockGoogleMapsService {
  constructor() {
    this.apiKey = null;
    this.isLoaded = true; // Mock service is always "loaded"
    
    // Mock Malta center coordinates
    this.maltaCenter = { lat: 35.8989, lng: 14.5146 };
    
    // Mock stores data that matches backend mock data
    this.mockStores = [
      {
        place_id: 'mock_greens_supermarket_valletta',
        name: 'Greens Supermarket',
        geometry: { location: { lat: 35.8978, lng: 14.5125 } },
        formatted_address: 'Republic Street, Valletta, Malta',
        rating: 4.2,
        user_ratings_total: 245,
        price_level: 2,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_pama_shopping_village',
        name: 'Pama Shopping Village',
        geometry: { location: { lat: 35.8756, lng: 14.4892 } },
        formatted_address: 'Triq il-Qrendi, Mqabba, Malta',
        rating: 4.5,
        user_ratings_total: 1250,
        price_level: 2,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_valyou_supermarket_sliema',
        name: 'Valyou Supermarket',
        geometry: { location: { lat: 35.9122, lng: 14.5019 } },
        formatted_address: 'Tower Road, Sliema, Malta',
        rating: 3.8,
        user_ratings_total: 180,
        price_level: 1,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_welbees_supermarket_gozo',
        name: 'Welbees Supermarket',
        geometry: { location: { lat: 36.0444, lng: 14.2406 } },
        formatted_address: 'Triq ir-Repubblika, Victoria, Gozo, Malta',
        rating: 4.1,
        user_ratings_total: 95,
        price_level: 2,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_lidl_malta_birkirkara',
        name: 'Lidl Malta',
        geometry: { location: { lat: 35.8972, lng: 14.4611 } },
        formatted_address: 'Triq Dun Karm, Birkirkara, Malta',
        rating: 4.3,
        user_ratings_total: 567,
        price_level: 1,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_tower_supermarket_gzira',
        name: 'Tower Supermarket',
        geometry: { location: { lat: 35.9063, lng: 14.4947 } },
        formatted_address: 'Triq it-Torri, Gzira, Malta',
        rating: 3.9,
        user_ratings_total: 134,
        price_level: 2,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_smart_supermarket_hamrun',
        name: 'Smart Supermarket',
        geometry: { location: { lat: 35.8842, lng: 14.4956 } },
        formatted_address: 'Triq Vilhena, Hamrun, Malta',
        rating: 3.6,
        user_ratings_total: 89,
        price_level: 1,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_park_towers_supermarket',
        name: 'Park Towers Supermarket',
        geometry: { location: { lat: 35.9142, lng: 14.4889 } },
        formatted_address: 'Park Towers, Tigne Point, Sliema, Malta',
        rating: 4.0,
        user_ratings_total: 156,
        price_level: 3,
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'mock_mega_mart_mosta',
        name: 'Mega Mart',
        geometry: { location: { lat: 35.9089, lng: 14.4278 } },
        formatted_address: 'Triq il-Kbira, Mosta, Malta',
        rating: 4.4,
        user_ratings_total: 289,
        price_level: 2,
        business_status: 'OPERATIONAL'
      }
    ];
  }

  // Mock the Google Maps API loading
  async loadGoogleMaps() {
    console.log('🧪 Using MOCK Google Maps API - No API costs!');
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create mock window.google object
    if (!window.google) {
      window.google = {
        maps: {
          Map: class MockMap {
            constructor(element, options) {
              this.element = element;
              this.options = options;
              this.markers = [];
              this.infoWindows = [];
              
              // Create a visual mock map
              this.createMockMapVisual();
            }
            
            createMockMapVisual() {
              if (this.element) {
                this.element.innerHTML = `
                  <div style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                  ">
                    <div style="
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      background: rgba(255, 255, 255, 0.9);
                      padding: 4px 8px;
                      border-radius: 4px;
                      font-size: 12px;
                      color: #666;
                      font-family: Arial, sans-serif;
                    ">
                      🧪 MOCK MODE
                    </div>
                    <div style="
                      background: rgba(255, 255, 255, 0.9);
                      padding: 20px;
                      border-radius: 8px;
                      text-align: center;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    ">
                      <div style="font-size: 24px; margin-bottom: 10px;">🗺️</div>
                      <div style="font-weight: bold; margin-bottom: 5px; color: #333;">Malta Map (Mock)</div>
                      <div style="font-size: 12px; color: #666;">Testing mode - No API costs</div>
                      <div style="font-size: 10px; color: #888; margin-top: 10px;">
                        ${this.markers.length} grocery stores loaded
                      </div>
                    </div>
                    <div id="mock-markers-container" style="
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      pointer-events: none;
                    "></div>
                  </div>
                `;
              }
            }
            
            setCenter(latLng) {
              console.log('🧪 Mock Map: Setting center to', latLng);
            }
            
            setZoom(zoom) {
              console.log('🧪 Mock Map: Setting zoom to', zoom);
            }
            
            panTo(latLng) {
              console.log('🧪 Mock Map: Panning to', latLng);
            }
            
            fitBounds(bounds) {
              console.log('🧪 Mock Map: Fitting bounds', bounds);
            }
            
            addMarker(marker) {
              this.markers.push(marker);
              this.updateMarkerCount();
            }
            
            removeMarker(marker) {
              const index = this.markers.indexOf(marker);
              if (index > -1) {
                this.markers.splice(index, 1);
                this.updateMarkerCount();
              }
            }
            
            updateMarkerCount() {
              const counter = this.element?.querySelector('.mock-marker-count');
              if (counter) {
                counter.textContent = `${this.markers.length} grocery stores loaded`;
              }
            }
          },
          
          Marker: class MockMarker {
            constructor(options) {
              this.options = options;
              this.map = options.map;
              this.position = options.position;
              this.title = options.title;
              this.visible = true;
              
              if (this.map && this.map.addMarker) {
                this.map.addMarker(this);
              }
            }
            
            setMap(map) {
              if (this.map && this.map.removeMarker) {
                this.map.removeMarker(this);
              }
              this.map = map;
              if (map && map.addMarker) {
                map.addMarker(this);
              }
            }
            
            setPosition(position) {
              this.position = position;
            }
            
            setTitle(title) {
              this.title = title;
            }
            
            setVisible(visible) {
              this.visible = visible;
            }
            
            getPosition() {
              return this.position;
            }
          },
          
          InfoWindow: class MockInfoWindow {
            constructor(options = {}) {
              this.options = options;
              this.isOpen = false;
            }
            
            open(map, marker) {
              console.log('🧪 Mock InfoWindow: Opening for', marker?.title || 'unknown marker');
              this.isOpen = true;
            }
            
            close() {
              this.isOpen = false;
            }
            
            setContent(content) {
              this.content = content;
            }
          },
          
          LatLng: class MockLatLng {
            constructor(lat, lng) {
              this.lat = lat;
              this.lng = lng;
            }
            
            lat() {
              return this.lat;
            }
            
            lng() {
              return this.lng;
            }
          },
          
          LatLngBounds: class MockLatLngBounds {
            constructor() {
              this.bounds = [];
            }
            
            extend(latLng) {
              this.bounds.push(latLng);
            }
            
            isEmpty() {
              return this.bounds.length === 0;
            }
          },
          
          event: {
            addListener: (object, event, handler) => {
              console.log(`🧪 Mock Event: Adding listener for '${event}'`);
              // For click events, we can simulate them
              if (event === 'click' && object.options) {
                // Add a simple click simulation after a delay
                setTimeout(() => {
                  if (Math.random() > 0.7) { // Randomly trigger some clicks for demo
                    console.log('🧪 Mock Event: Simulating click');
                    handler();
                  }
                }, Math.random() * 3000 + 1000);
              }
              return { remove: () => console.log('🧪 Mock Event: Listener removed') };
            }
          },
          
          places: {
            PlacesService: class MockPlacesService {
              constructor(map) {
                this.map = map;
              }
              
              nearbySearch(request, callback) {
                console.log('🧪 Mock PlacesService: Nearby search', request);
                setTimeout(() => {
                  callback(mockGoogleMapsService.mockStores, 'OK');
                }, 1000);
              }
              
              textSearch(request, callback) {
                console.log('🧪 Mock PlacesService: Text search', request);
                const results = mockGoogleMapsService.mockStores.filter(store =>
                  store.name.toLowerCase().includes(request.query.toLowerCase())
                );
                setTimeout(() => {
                  callback(results, 'OK');
                }, 800);
              }
              
              getDetails(request, callback) {
                console.log('🧪 Mock PlacesService: Get details', request);
                const store = mockGoogleMapsService.mockStores.find(s => s.place_id === request.placeId);
                setTimeout(() => {
                  callback(store || null, store ? 'OK' : 'NOT_FOUND');
                }, 600);
              }
            }
          },
          
          Geocoder: class MockGeocoder {
            geocode(request, callback) {
              console.log('🧪 Mock Geocoder: Geocoding', request);
              setTimeout(() => {
                callback([{
                  geometry: {
                    location: new window.google.maps.LatLng(35.8989, 14.5146)
                  },
                  formatted_address: 'Malta'
                }], 'OK');
              }, 500);
            }
          }
        }
      };
    }
    
    return true;
  }

  // Mock geocoding
  async geocodeAddress(address) {
    console.log('🧪 Mock Geocoder: Geocoding address:', address);
    
    // Return Malta center for any address
    return {
      lat: this.maltaCenter.lat,
      lng: this.maltaCenter.lng,
      formatted_address: `${address}, Malta`
    };
  }

  // Mock reverse geocoding
  async reverseGeocode(lat, lng) {
    console.log('🧪 Mock Geocoder: Reverse geocoding:', lat, lng);
    
    return {
      formatted_address: `Mock Address near ${lat.toFixed(4)}, ${lng.toFixed(4)}, Malta`,
      address_components: [
        { long_name: 'Malta', types: ['country'] }
      ]
    };
  }

  // Mock nearby search
  async searchNearby(location, radius = 5000, type = 'grocery_or_supermarket') {
    console.log('🧪 Mock Places: Searching nearby', { location, radius, type });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter stores by distance (mock calculation)
    const results = this.mockStores.filter(store => {
      const distance = this.calculateDistance(
        location.lat, location.lng,
        store.geometry.location.lat, store.geometry.location.lng
      );
      return distance <= radius;
    });
    
    return results;
  }

  // Mock text search
  async searchByText(query) {
    console.log('🧪 Mock Places: Text search for:', query);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const queryLower = query.toLowerCase();
    return this.mockStores.filter(store =>
      store.name.toLowerCase().includes(queryLower) ||
      store.formatted_address.toLowerCase().includes(queryLower)
    );
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Mock user location
  async getCurrentLocation() {
    console.log('🧪 Mock Geolocation: Getting current location');
    
    // Simulate getting location near Malta center with some randomness
    const randomOffset = 0.01; // Small random offset
    return {
      lat: this.maltaCenter.lat + (Math.random() - 0.5) * randomOffset,
      lng: this.maltaCenter.lng + (Math.random() - 0.5) * randomOffset,
      accuracy: 100
    };
  }

  // Check if API is loaded (always true for mock)
  isApiLoaded() {
    return true;
  }

  // Mock place details
  async getPlaceDetails(placeId) {
    console.log('🧪 Mock Places: Getting place details for:', placeId);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const store = this.mockStores.find(s => s.place_id === placeId);
    if (store) {
      return {
        ...store,
        opening_hours: {
          open_now: Math.random() > 0.2, // 80% chance of being open
          weekday_text: [
            'Monday: 7:00 AM – 9:00 PM',
            'Tuesday: 7:00 AM – 9:00 PM',
            'Wednesday: 7:00 AM – 9:00 PM',
            'Thursday: 7:00 AM – 9:00 PM',
            'Friday: 7:00 AM – 9:00 PM',
            'Saturday: 7:00 AM – 9:00 PM',
            'Sunday: 8:00 AM – 8:00 PM'
          ]
        },
        photos: [], // No photos in mock mode
        reviews: [], // No reviews in mock mode
        website: `https://example-${placeId.slice(-5)}.com`,
        formatted_phone_number: '+356 2xxx xxxx'
      };
    }
    
    return null;
  }
}

// Create and export the mock service instance
const mockGoogleMapsService = new MockGoogleMapsService();

export default mockGoogleMapsService;