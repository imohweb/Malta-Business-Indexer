import { useState, useEffect, useCallback } from 'react';
import googleMapsService from '../services/googleMaps';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await googleMapsService.getCurrentLocation();
      setLocation(position);
    } catch (err) {
      setError(err.message);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearLocation
  };
};

export const useGoogleMaps = (containerId) => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Container with id "${containerId}" not found`);
        }

        const mapInstance = await googleMapsService.initializeMap(container);
        setMap(mapInstance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (containerId) {
      initializeMap();
    }

    return () => {
      googleMapsService.destroy();
    };
  }, [containerId]);

  const addStoreMarkers = useCallback((stores, onMarkerClick) => {
    if (!map) return;

    googleMapsService.clearMarkers();
    stores.forEach(store => {
      googleMapsService.createStoreMarker(store, onMarkerClick);
    });
  }, [map]);

  const addUserLocationMarker = useCallback((latitude, longitude) => {
    if (!map) return;
    return googleMapsService.addUserLocationMarker(latitude, longitude);
  }, [map]);

  const fitMarkersInView = useCallback((stores) => {
    if (!map || !stores.length) return;
    googleMapsService.fitMarkersInView(stores);
  }, [map]);

  return {
    map,
    loading,
    error,
    addStoreMarkers,
    addUserLocationMarker,
    fitMarkersInView
  };
};