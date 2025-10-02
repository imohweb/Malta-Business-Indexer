import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Optionally redirect to login
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Grocery Stores endpoints
  async getAllStores(params = {}) {
    const { skip = 0, limit = 50 } = params;
    const response = await api.get('/api/stores', { params: { skip, limit } });
    return response.data;
  }

  async searchStores(searchParams = {}) {
    const response = await api.get('/api/stores/search', { params: searchParams });
    return response.data;
  }

  async getNearbyStores(latitude, longitude, radius = 5000, limit = 20) {
    const response = await api.get('/api/stores/nearby', {
      params: { latitude, longitude, radius, limit }
    });
    return response.data;
  }

  async getStore(storeId) {
    const response = await api.get(`/api/stores/${storeId}`);
    return response.data;
  }

  async createStore(storeData) {
    const response = await api.post('/api/stores', storeData);
    return response.data;
  }

  async updateStore(storeId, storeData) {
    const response = await api.put(`/api/stores/${storeId}`, storeData);
    return response.data;
  }

  async deleteStore(storeId) {
    const response = await api.delete(`/api/stores/${storeId}`);
    return response.data;
  }

  async refreshStoresData(forceRefresh = false) {
    const response = await api.post('/api/stores/refresh', { force_refresh: forceRefresh });
    return response.data;
  }

  async getPlaceDetails(placeId) {
    const response = await api.get(`/api/stores/place/${placeId}/details`);
    return response.data;
  }

  async textSearchPlaces(query) {
    const response = await api.get(`/api/stores/text-search/${encodeURIComponent(query)}`);
    return response.data;
  }

  async getStoreStats() {
    const response = await api.get('/api/stores/stats/overview');
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }

  // API info
  async getApiInfo() {
    const response = await api.get('/');
    return response.data;
  }
}

// Create and export service instance
const apiService = new ApiService();
export default apiService;