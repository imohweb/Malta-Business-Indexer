// Environment Detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.REACT_APP_ENVIRONMENT === 'github-pages';

// API Configuration
const getApiBaseUrl = () => {
  // Check for explicit environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Environment-specific defaults
  if (isDevelopment) {
    return ''; // Use proxy in package.json for development
  }
  
  if (isGitHubPages) {
    // For GitHub Pages, will be set via environment variable in CI/CD
    return process.env.REACT_APP_BACKEND_URL || 'https://iac-infraengine-backend.azurecontainerapps.io';
  }
  
  // Default fallback
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// Maps Service Configuration
export const MAPS_SERVICE = process.env.REACT_APP_MAPS_SERVICE || 'openstreetmap'; // 'openstreetmap', 'google', or 'mock'

// Google Maps Configuration (Optional - only if using Google Maps)
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

// Malta Configuration
export const MALTA_CENTER = {
  lat: parseFloat(process.env.REACT_APP_MALTA_CENTER_LAT) || 35.8989,
  lng: parseFloat(process.env.REACT_APP_MALTA_CENTER_LNG) || 14.5146
};

export const MALTA_BOUNDS = {
  north: 35.95,
  south: 35.8,
  east: 14.58,
  west: 14.18
};

// Map Configuration
export const DEFAULT_ZOOM = parseInt(process.env.REACT_APP_DEFAULT_ZOOM) || 12;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 18;

// OpenStreetMap Tile Servers
export const OSM_TILE_SERVERS = {
  default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  carto_voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  carto_light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
};

// Search Configuration
export const DEFAULT_SEARCH_RADIUS = 5000; // 5km
export const MAX_SEARCH_RADIUS = 25000; // 25km
export const SEARCH_RESULTS_LIMIT = 50;

// UI Configuration
export const DEBOUNCE_DELAY = 300; // milliseconds
export const ANIMATION_DURATION = 300;

// Store Categories
export const STORE_TYPES = {
  SUPERMARKET: 'supermarket',
  GROCERY: 'grocery_or_supermarket',
  CONVENIENCE: 'convenience_store',
  FOOD: 'food',
  STORE: 'store'
};

// Rating Configuration
export const MAX_RATING = 5;
export const MIN_RATING = 0;

// Development/Debug Configuration
export const DEBUG_MODE = isDevelopment && process.env.REACT_APP_DEBUG === 'true';

// Export environment flags for use elsewhere
export const ENVIRONMENT = {
  isDevelopment,
  isProduction,
  isGitHubPages
};