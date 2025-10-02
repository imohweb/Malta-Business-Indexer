import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchStores = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getAllStores(params);
      setStores(result.stores);
      setTotal(result.total);
      setHasMore(result.has_more);
    } catch (err) {
      setError(err.message || 'Failed to fetch stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchStores = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.searchStores(searchParams);
      setStores(result.stores);
      setTotal(result.total);
      setHasMore(result.has_more);
    } catch (err) {
      setError(err.message || 'Failed to search stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNearbyStores = useCallback(async (latitude, longitude, radius = 5000, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getNearbyStores(latitude, longitude, radius, limit);
      setStores(result);
      setTotal(result.length);
      setHasMore(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch nearby stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stores,
    loading,
    error,
    total,
    hasMore,
    fetchStores,
    searchStores,
    getNearbyStores
  };
};