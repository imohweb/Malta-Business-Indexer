import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/styled';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 16px 20px 12px;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.surface};

  h3 {
    margin: 0 0 8px 0;
    color: ${colors.text.primary};
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .subtitle {
    color: ${colors.text.secondary};
    font-size: 14px;
    margin: 0;
  }
`;

const BusinessListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const BusinessItem = styled.div`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${colors.primary};
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px;
  }
`;

const BusinessHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const BusinessName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text.primary};
  line-height: 1.4;
  flex: 1;
`;

const BusinessType = styled.span`
  background: ${colors.primary}20;
  color: ${colors.primary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 8px;
  flex-shrink: 0;
`;

const BusinessAddress = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: ${colors.text.secondary};
  line-height: 1.3;
`;

const BusinessDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  font-size: 13px;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${colors.text.secondary};
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Distance = styled.span`
  color: ${colors.primary};
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.surface};
  color: ${colors.text.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${colors.text.secondary};
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${colors.error};
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${colors.text.secondary};

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .message {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .suggestion {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 16px 0;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.surface};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BusinessList = ({ 
  businesses = [], 
  loading = false, 
  error = null,
  total = 0,
  hasMore = false,
  category = 'business',
  onBusinessSelect,
  onGetDirections,
  onLoadMore,
  userLocation
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    if (onBusinessSelect) {
      onBusinessSelect(business);
    }
  };

  const handleDirections = (e, business) => {
    e.stopPropagation();
    if (onGetDirections) {
      onGetDirections(business);
    }
  };

  const formatBusinessType = (businessType) => {
    if (!businessType || !Array.isArray(businessType)) return null;
    return businessType[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPhone = (phone) => {
    if (!phone) return null;
    return phone.startsWith('+') ? phone : `+356 ${phone}`;
  };

  if (loading && businesses.length === 0) {
    return (
      <ListContainer>
        <LoadingState>
          <div>Loading businesses...</div>
        </LoadingState>
      </ListContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <ErrorState>
          <div>
            Error loading businesses: {error}
            <br />
            <small>Please try again</small>
          </div>
        </ErrorState>
      </ListContainer>
    );
  }

  if (!loading && businesses.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <div className="icon">🏢</div>
          <div className="message">No businesses found</div>
          <div className="suggestion">Try adjusting your search criteria</div>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <h3>
          {category === 'grocery' && '🛒 Grocery Stores'}
          {category === 'companies' && '🏢 Private Companies'}
          {category === 'government' && '🏛️ Government Services'}
          {category === 'education' && '🎓 Education'}
          {category === 'religion' && '⛪ Churches & Religious Sites'}
          {category === 'medical' && '🏥 Medical Centers'}
          {category === 'pharmacy' && '💊 Pharmacies'}
        </h3>
        <p className="subtitle">
          {total > 0 ? `${businesses.length} of ${total} results` : `${businesses.length} results`}
        </p>
      </ListHeader>

      <BusinessListContainer>
        {businesses.map((business) => (
          <BusinessItem 
            key={business.id} 
            onClick={() => handleBusinessClick(business)}
            style={{
              borderColor: selectedBusiness?.id === business.id ? colors.primary : colors.border
            }}
          >
            <BusinessHeader>
              <BusinessName>{business.name}</BusinessName>
              {formatBusinessType(business.business_type) && (
                <BusinessType>{formatBusinessType(business.business_type)}</BusinessType>
              )}
            </BusinessHeader>

            <BusinessAddress>{business.formatted_address}</BusinessAddress>

            <BusinessDetails>
              {business.distance_km && (
                <Distance>{business.distance_km} km away</Distance>
              )}
              
              {business.phone_number && (
                <ContactInfo>
                  📞 <a href={`tel:${business.phone_number}`}>
                    {formatPhone(business.phone_number)}
                  </a>
                </ContactInfo>
              )}
              
              {business.website && (
                <ContactInfo>
                  🌐 <a href={business.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </ContactInfo>
              )}
              
              {business.email && (
                <ContactInfo>
                  ✉️ <a href={`mailto:${business.email}`}>
                    Email
                  </a>
                </ContactInfo>
              )}
            </BusinessDetails>

            <ActionButtons>
              <ActionButton
                onClick={(e) => handleDirections(e, business)}
                disabled={!business.latitude || !business.longitude}
              >
                📍 Directions
              </ActionButton>
              
              {business.opening_hours?.raw && (
                <ActionButton disabled>
                  🕒 {business.opening_hours.open_now ? 'Open' : 'Hours'}
                </ActionButton>
              )}
            </ActionButtons>
          </BusinessItem>
        ))}

        {hasMore && (
          <LoadMoreButton 
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Businesses'}
          </LoadMoreButton>
        )}
      </BusinessListContainer>
    </ListContainer>
  );
};

export default BusinessList;