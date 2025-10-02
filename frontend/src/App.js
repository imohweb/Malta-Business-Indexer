import React, { useState, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Header from './components/Header';
import OpenStreetMap from './components/OpenStreetMap';
import SearchFilters from './components/SearchFilters';
import BusinessList from './components/BusinessList';
import CategoryTabs from './components/CategoryTabs';

import { useBusinesses } from './hooks/useBusinesses';
import { useGeolocation } from './hooks/useGeolocation';
import { useToggle } from './hooks/useUtils';

import apiService from './services/api';
import { colors, breakpoints } from './styles/styled';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.background};
    color: ${colors.text.primary};
  }

  html, body, #root {
    height: 100%;
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const MapSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 50vh;
  }
`;

const SidebarSection = styled.div`
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  background: ${colors.surface};
  border-left: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 50vh;
    border-left: none;
    border-top: 1px solid ${colors.border};
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 16px;
  }
`;

const StatsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const StatsContent = styled.div`
  background: ${colors.surface};
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  
  h2 {
    margin: 0 0 16px 0;
    color: ${colors.text.primary};
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.border};
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: ${colors.text.secondary};
    }
    
    .value {
      font-weight: 600;
      color: ${colors.text.primary};
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${colors.text.secondary};
  
  &:hover {
    color: ${colors.text.primary};
  }
`;

function App() {
  const [stats, setStats] = useState(null);
  const [showStats, toggleStats] = useToggle(false);
  const [mapCenter, setMapCenter] = useState([35.8989, 14.5146]); // Malta center
  const [mapZoom, setMapZoom] = useState(12);
  const [activeCategory, setActiveCategory] = useState('grocery');
  
  // Hooks for businesses (new multi-category system)
  const {
    businesses,
    categories,
    loading: businessLoading,
    error: businessError,
    total: businessTotal,
    hasMore: businessHasMore,
    fetchBusinesses,
    searchBusinesses,
    getNearbyBusinesses
  } = useBusinesses();

  const {
    location: userLocation,
    loading: locationLoading,
    getCurrentLocation
  } = useGeolocation();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load businesses for active category
        await fetchBusinesses({ category: activeCategory, limit: 50 });
        
        // Load legacy grocery stores stats for header (if still needed)
        try {
          const statsData = await apiService.getStoreStats();
          setStats(statsData);
        } catch (error) {
          console.log('Legacy stats not available, skipping...');
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]); // Reload when category changes

  // Handle search
  const handleSearch = useCallback(async (searchParams) => {
    try {
      // Add current category to search params
      const params = { ...searchParams, category: activeCategory };
      await searchBusinesses(params);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [searchBusinesses, activeCategory]);

  // Handle location-based search
  const handleLocationSearch = useCallback(async (radius = 5000) => {
    try {
      await getCurrentLocation();
      if (userLocation) {
        // Convert radius from meters to kilometers
        const radiusKm = radius / 1000;
        await getNearbyBusinesses(userLocation.lat, userLocation.lng, radiusKm, activeCategory);
        
        // Update map center to user location
        setMapCenter([userLocation.lat, userLocation.lng]);
        setMapZoom(14);
      }
    } catch (error) {
      console.error('Location search failed:', error);
    }
  }, [getCurrentLocation, getNearbyBusinesses, userLocation, activeCategory]);

  // Handle business/store selection
  const handleItemSelect = useCallback((item) => {
    setMapCenter([parseFloat(item.latitude), parseFloat(item.longitude)]);
    setMapZoom(16);
  }, []);

  // Handle directions - now using OpenStreetMap
  const handleGetDirections = useCallback((item) => {
    const url = `https://www.openstreetmap.org/directions?from=&to=${item.latitude}%2C${item.longitude}&engine=fossgis_osrm_car`;
    window.open(url, '_blank');
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback(async (category) => {
    setActiveCategory(category);
    // Data will be loaded by useEffect when activeCategory changes
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    fetchBusinesses({ 
      category: activeCategory,
      offset: businesses.length, 
      limit: 50 
    });
  }, [fetchBusinesses, activeCategory, businesses.length]);

  // Get current data - use businesses for all categories
  const currentData = businesses;
  const currentLoading = businessLoading;

  return (
    <AppContainer>
      <GlobalStyle />
      
      <Header 
        onStatsClick={toggleStats}
        stats={stats}
      />

      <MainContent>
        <MapSection>
          <SearchFilters
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            loading={businessLoading}
            locationLoading={locationLoading}
          />
          
          <OpenStreetMap
            stores={currentData}
            center={mapCenter}
            zoom={mapZoom}
            userLocation={userLocation}
            onStoreSelect={handleItemSelect}
            loading={currentLoading}
            height="calc(100% - 140px)"
          />
        </MapSection>

        <SidebarSection>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            loading={!categories.length && businessLoading}
            error={businessError}
          >
            <BusinessList
              businesses={businesses}
              loading={businessLoading}
              error={businessError}
              total={businessTotal}
              hasMore={businessHasMore}
              category={activeCategory}
              onBusinessSelect={handleItemSelect}
              onGetDirections={handleGetDirections}
              onLoadMore={handleLoadMore}
              userLocation={userLocation}
            />
          </CategoryTabs>
        </SidebarSection>
      </MainContent>

      {showStats && stats && (
        <StatsModal onClick={toggleStats}>
          <StatsContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={toggleStats}>&times;</CloseButton>
            <h2>Malta Grocery Stores Statistics</h2>
            
            <div className="stat-item">
              <span className="label">Total Stores</span>
              <span className="value">{stats.total_stores}</span>
            </div>
            
            <div className="stat-item">
              <span className="label">Stores with Ratings</span>
              <span className="value">{stats.stores_with_ratings}</span>
            </div>
            
            {stats.average_rating && (
              <div className="stat-item">
                <span className="label">Average Rating</span>
                <span className="value">⭐ {stats.average_rating}</span>
              </div>
            )}
            
            <div className="stat-item">
              <span className="label">Data Coverage</span>
              <span className="value">{stats.coverage_percentage}%</span>
            </div>
          </StatsContent>
        </StatsModal>
      )}
    </AppContainer>
  );
}

export default App;