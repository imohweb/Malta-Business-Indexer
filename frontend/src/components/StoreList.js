import React from 'react';
import styled from 'styled-components';
import { Loading, ErrorMessage, Grid, colors } from '../styles/styled';
import StoreItem from './StoreItem';

const Container = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${colors.text.primary};
`;

const StoreCount = styled.span`
  font-size: 14px;
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${colors.text.secondary};
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: ${colors.text.primary};
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.surfaceHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StoreList = ({ 
  stores = [], 
  loading = false, 
  error = null,
  total = 0,
  hasMore = false,
  onStoreSelect,
  onGetDirections,
  onLoadMore,
  userLocation = null,
  title = "Grocery Stores"
}) => {
  const calculateDistance = (store) => {
    if (!userLocation || !store.latitude || !store.longitude) return null;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = userLocation.lat * Math.PI / 180;
    const φ2 = parseFloat(store.latitude) * Math.PI / 180;
    const Δφ = (parseFloat(store.latitude) - userLocation.lat) * Math.PI / 180;
    const Δλ = (parseFloat(store.longitude) - userLocation.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  if (error) {
    return (
      <div>
        <Header>
          <Title>{title}</Title>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );
  }

  return (
    <div>
      <Header>
        <Title>{title}</Title>
        <StoreCount>
          <i className="fas fa-store"></i>
          {loading ? 'Loading...' : `${stores.length} of ${total} stores`}
        </StoreCount>
      </Header>

      <Container>
        {loading && stores.length === 0 ? (
          <Loading>Loading stores...</Loading>
        ) : stores.length === 0 ? (
          <EmptyState>
            <div className="icon">🏪</div>
            <h3>No stores found</h3>
            <p>Try adjusting your search filters or search radius.</p>
          </EmptyState>
        ) : (
          <>
            <Grid $columns={1}>
              {stores.map(store => (
                <StoreItem
                  key={store.id}
                  store={store}
                  onSelect={onStoreSelect}
                  onGetDirections={onGetDirections}
                  distance={calculateDistance(store)}
                />
              ))}
            </Grid>
            
            {hasMore && (
              <LoadMoreButton 
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Loading more...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Load more stores
                  </>
                )}
              </LoadMoreButton>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default StoreList;