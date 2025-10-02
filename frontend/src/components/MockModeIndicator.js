import React from 'react';
import styled from 'styled-components';

const MockIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b, #ffa726);
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: pulse 2s infinite;
  cursor: help;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  &:hover {
    animation: none;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const MockModeIndicator = ({ onInfoToggle }) => {
  const handleClick = () => {
    if (onInfoToggle) {
      onInfoToggle();
    } else {
      alert(
        '🧪 MOCK MODE ACTIVE\n\n' +
        'The app is running in testing mode with mock data to avoid API costs.\n\n' +
        'Features:\n' +
        '• 10 realistic Malta grocery stores\n' +
        '• Interactive map simulation\n' +
        '• Search and filter functionality\n' +
        '• No Google API charges\n\n' +
        'To use real data, add your Google Maps API key to the .env file.'
      );
    }
  };

  return (
    <MockIndicator 
      onClick={handleClick}
      title="Click for more information about Mock Mode"
    >
      🧪 MOCK MODE
    </MockIndicator>
  );
};

export default MockModeIndicator;