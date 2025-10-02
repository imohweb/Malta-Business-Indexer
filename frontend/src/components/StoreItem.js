import React from 'react';
import styled from 'styled-components';
import { Card, Badge, colors, breakpoints } from '../styles/styled';

const StoreCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const StoreName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text.primary};
  line-height: 1.3;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const StoreRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${colors.text.secondary};
  margin-left: 12px;
  flex-shrink: 0;

  .star {
    color: #ffa500;
  }
`;

const StoreAddress = styled.p`
  margin: 0 0 12px 0;
  color: ${colors.text.secondary};
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 6px;
`;

const StoreDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const StoreActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${colors.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(26, 115, 232, 0.1);
  }
`;

const Distance = styled.span`
  font-size: 12px;
  color: ${colors.text.tertiary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StoreItem = ({ 
  store, 
  onSelect, 
  onGetDirections,
  distance 
}) => {
  const handleCardClick = () => {
    onSelect(store);
  };

  const handleDirectionsClick = (e) => {
    e.stopPropagation();
    onGetDirections(store);
  };

  const getStatusBadge = () => {
    if (store.permanently_closed) {
      return <Badge $variant="error">Permanently Closed</Badge>;
    }
    if (store.business_status === 'CLOSED_TEMPORARILY') {
      return <Badge $variant="warning">Temporarily Closed</Badge>;
    }
    if (store.business_status === 'OPERATIONAL') {
      return <Badge $variant="success">Open</Badge>;
    }
    return null;
  };

  const getPriceLevelBadge = () => {
    if (store.price_level === null || store.price_level === undefined) return null;
    
    const symbols = ['Free', '€', '€€', '€€€', '€€€€'];
    return symbols[store.price_level] || null;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    // Simple formatting for Malta numbers
    return phone.replace(/(\+356)?\s*(\d{4})\s*(\d{4})/, '+356 $2 $3');
  };

  return (
    <StoreCard onClick={handleCardClick}>
      <StoreHeader>
        <StoreName>{store.name}</StoreName>
        {store.rating && (
          <StoreRating>
            <span className="star">⭐</span>
            <span>{store.rating.toFixed(1)}</span>
            {store.user_ratings_total && (
              <span>({store.user_ratings_total})</span>
            )}
          </StoreRating>
        )}
      </StoreHeader>

      {store.formatted_address && (
        <StoreAddress>
          <i className="fas fa-map-marker-alt" style={{ color: colors.primary, marginTop: '2px' }}></i>
          {store.formatted_address}
        </StoreAddress>
      )}

      <StoreDetails>
        {getStatusBadge()}
        {getPriceLevelBadge() && (
          <Badge $variant="info">{getPriceLevelBadge()}</Badge>
        )}
        {store.types && store.types.includes('convenience_store') && (
          <Badge $variant="info">Convenience Store</Badge>
        )}
        {store.types && store.types.includes('supermarket') && (
          <Badge $variant="info">Supermarket</Badge>
        )}
      </StoreDetails>

      {(store.phone_number || store.website) && (
        <StoreDetails>
          {store.phone_number && (
            <span style={{ fontSize: '14px', color: colors.text.secondary }}>
              <i className="fas fa-phone"></i> {formatPhoneNumber(store.phone_number)}
            </span>
          )}
          {store.website && (
            <a 
              href={store.website} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                fontSize: '14px', 
                color: colors.primary, 
                textDecoration: 'none' 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fas fa-globe"></i> Website
            </a>
          )}
        </StoreDetails>
      )}

      <StoreActions>
        <div>
          <ActionButton onClick={handleCardClick}>
            <i className="fas fa-info-circle"></i>
            View on Map
          </ActionButton>
          {store.latitude && store.longitude && (
            <ActionButton onClick={handleDirectionsClick}>
              <i className="fas fa-route"></i>
              Directions
            </ActionButton>
          )}
        </div>
        
        {distance && (
          <Distance>
            <i className="fas fa-walking"></i>
            {distance < 1000 
              ? `${Math.round(distance)}m` 
              : `${(distance / 1000).toFixed(1)}km`}
          </Distance>
        )}
      </StoreActions>
    </StoreCard>
  );
};

export default StoreItem;