import React from 'react';
import styled from 'styled-components';
import { MapContainer } from '../styles/styled';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 10;
  max-width: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GoogleMap = ({ 
  height = '500px', 
  mobileHeight = '400px', 
  loading = false, 
  error = null,
  children 
}) => {
  return (
    <Container>
      <MapContainer 
        id="google-map" 
        $height={height} 
        $mobileHeight={mobileHeight}
      />
      
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {error && (
        <ErrorOverlay>
          <div style={{ color: '#d93025', marginBottom: '12px' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div style={{ fontWeight: '500', marginBottom: '8px' }}>
            Map Error
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {error}
          </div>
        </ErrorOverlay>
      )}
      
      {children}
    </Container>
  );
};

export default GoogleMap;