import { useState, useCallback, useEffect } from 'react';

// Use relative URLs when in development (proxy is configured) or absolute when specified
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? '' : 'http://localhost:5000');

const useBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch business categories
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/businesses/categories`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
      return data.categories;
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Fetch businesses
  const fetchBusinesses = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        // Only add valid numbers for latitude/longitude
        if ((key === 'latitude' || key === 'longitude')) {
          const num = parseFloat(value);
          if (!isNaN(num)) {
            queryParams.append(key, num);
          }
        } else if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/businesses?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.status}`);
      }

      const data = await response.json();
      
      // If it's a new search (offset 0), replace businesses
      // If it's pagination (offset > 0), append businesses
      if (params.offset === 0 || !params.offset) {
        setBusinesses(data.businesses || []);
      } else {
        setBusinesses(prev => [...prev, ...(data.businesses || [])]);
      }
      
      setTotal(data.total || 0);
      setHasMore(data.has_more || false);
      
      return data;
      
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err.message);
      return { businesses: [], total: 0, has_more: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Search businesses
  const searchBusinesses = useCallback(async (searchParams) => {
    const params = {
      offset: 0, // Reset pagination for new search
      limit: 50,
      ...searchParams
    };
    
    return await fetchBusinesses(params);
  }, [fetchBusinesses]);

  // Get nearby businesses
  const getNearbyBusinesses = useCallback(async (lat, lng, radius = 5, category = null) => {
    const params = {
      latitude: lat,
      longitude: lng,
      radius,
      limit: 100,
      offset: 0
    };
    
    if (category) {
      params.category = category;
    }
    
    return await fetchBusinesses(params);
  }, [fetchBusinesses]);

  // Refresh businesses from API
  const refreshBusinesses = useCallback(async (category) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/businesses/refresh/${category}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh businesses: ${response.status}`);
      }
      
      const data = await response.json();
      
      // After refresh, fetch fresh data
      setTimeout(() => {
        fetchBusinesses({ category, limit: 50, offset: 0 });
      }, 2000); // Wait for background refresh to complete
      
      return data;
      
    } catch (err) {
      console.error('Error refreshing businesses:', err);
      setError(err.message);
      throw err;
    }
  }, [fetchBusinesses]);

  // Get business statistics
  const getBusinessStats = useCallback(async (category = null) => {
    try {
      const queryParams = category ? `?category=${category}` : '';
      const response = await fetch(`${API_BASE_URL}/api/businesses/stats${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch business stats: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      console.error('Error fetching business stats:', err);
      throw err;
    }
  }, []);

  // Load initial categories on hook initialization
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    businesses,
    categories,
    loading,
    error,
    total,
    hasMore,
    fetchBusinesses,
    searchBusinesses,
    getNearbyBusinesses,
    refreshBusinesses,
    getBusinessStats,
    fetchCategories
  };
};

export { useBusinesses };