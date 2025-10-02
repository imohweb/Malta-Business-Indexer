import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Fix for default Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom store icon
const storeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
      <path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// User location icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <circle cx="12" cy="12" r="8" fill="#2196F3" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="#fff"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
  
  .leaflet-popup-content {
    margin: 8px 12px;
    min-width: 200px;
  }
  
  .store-popup {
    h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 16px;
    }
    
    p {
      margin: 4px 0;
      color: #666;
      font-size: 14px;
    }
    
    .rating {
      color: #f39c12;
      font-weight: bold;
    }
    
    .address {
      color: #888;
      font-size: 13px;
      margin-top: 8px;
    }
    
    .actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      
      button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        background: #4CAF50;
        color: white;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
          background: #45a049;
        }
        
        &.secondary {
          background: #6c757d;
          
          &:hover {
            background: #5a6268;
          }
        }
      }
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 8px;
  
  div {
    text-align: center;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4CAF50;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    
    p {
      color: #666;
      margin: 0;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Component to handle map updates
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}

const OpenStreetMap = ({
  stores = [],
  center = [35.8989, 14.5146], // Malta center
  zoom = 12,
  userLocation = null,
  onStoreSelect = null,
  loading = false,
  height = '400px'
}) => {
  const formatRating = (rating, userRatingsTotal) => {
    if (!rating) return 'No rating';
    return `★ ${rating}${userRatingsTotal ? ` (${userRatingsTotal} reviews)` : ''}`;
  };
  
  const formatPriceLevel = (priceLevel) => {
    if (!priceLevel) return '';
    return '€'.repeat(priceLevel);
  };
  
  const handleDirections = (store) => {
    const url = `https://www.openstreetmap.org/directions?from=&to=${store.latitude}%2C${store.longitude}&engine=fossgis_osrm_car`;
    window.open(url, '_blank');
  };
  
  const handleViewDetails = (store) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };
  
  return (
    <MapWrapper style={{ height }}>
      {loading && (
        <LoadingOverlay>
          <div>
            <div className="spinner"></div>
            <p>Loading stores...</p>
          </div>
        </LoadingOverlay>
      )}
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* Alternative tile layers for better appearance */}
        {/* 
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        */}
        
        <MapController center={center} zoom={zoom} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[
              parseFloat(userLocation.latitude || userLocation.lat), 
              parseFloat(userLocation.longitude || userLocation.lng)
            ]} 
            icon={userIcon}
          >
            <Popup>
              <div className="store-popup">
                <h3>📍 Your Location</h3>
                <p>Current position</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Store markers */}
        {stores.map((store, index) => {
          // Ensure we have valid coordinates
          const lat = parseFloat(store.latitude);
          const lng = parseFloat(store.longitude);
          
          // Skip markers with invalid coordinates
          if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
            console.warn(`Skipping store "${store.name}" - invalid coordinates:`, store.latitude, store.longitude);
            return null;
          }
          
          return (
            <Marker
              key={store.id || `store-${index}`}
              position={[lat, lng]}
              icon={storeIcon}
            >
              <Popup maxWidth={300}>
                <div className="store-popup">
                  <h3>{store.name}</h3>
                  
                  {store.rating && (
                    <p className="rating">
                      {formatRating(store.rating, store.user_ratings_total)}
                    </p>
                  )}
                  
                  {store.price_level && (
                    <p>Price: {formatPriceLevel(store.price_level)}</p>
                  )}
                  
                  {store.business_status && (
                    <p>Status: {store.business_status === 'OPERATIONAL' ? '🟢 Open' : '🔴 Closed'}</p>
                  )}
                  
                  {store.types && store.types.length > 0 && (
                    <p>Type: {store.types.includes('supermarket') ? '🏪 Supermarket' : '🛒 Store'}</p>
                  )}
                  
                  {store.formatted_address && (
                    <p className="address">{store.formatted_address}</p>
                  )}
                  
                  <div className="actions">
                    <button onClick={() => handleDirections(store)}>
                      🗺️ Directions
                    </button>
                    {onStoreSelect && (
                      <button 
                        className="secondary" 
                        onClick={() => handleViewDetails(store)}
                      >
                        ℹ️ Details
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </MapWrapper>
  );
};

export default OpenStreetMap;