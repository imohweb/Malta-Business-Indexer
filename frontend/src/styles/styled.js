import styled from 'styled-components';

// Theme colors
export const colors = {
  primary: '#1a73e8',
  primaryHover: '#1557b0',
  secondary: '#34a853',
  error: '#d93025',
  warning: '#fbbc04',
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceHover: '#f1f3f4',
  border: '#e0e0e0',
  text: {
    primary: '#202124',
    secondary: '#5f6368',
    tertiary: '#9aa0a6',
    inverse: '#ffffff'
  }
};

// Breakpoints
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0 16px;
  }
`;

export const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.$variant === 'primary' && `
    background: ${colors.primary};
    color: ${colors.text.inverse};
    
    &:hover:not(:disabled) {
      background: ${colors.primaryHover};
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: ${colors.surface};
    color: ${colors.text.primary};
    border: 1px solid ${colors.border};
    
    &:hover:not(:disabled) {
      background: ${colors.surfaceHover};
    }
  `}

  ${props => props.$variant === 'outline' && `
    background: transparent;
    color: ${colors.primary};
    border: 1px solid ${colors.primary};
    
    &:hover:not(:disabled) {
      background: ${colors.primary};
      color: ${colors.text.inverse};
    }
  `}

  ${props => props.$size === 'small' && `
    padding: 8px 16px;
    font-size: 12px;
  `}

  ${props => props.$size === 'large' && `
    padding: 16px 32px;
    font-size: 16px;
  `}

  @media (max-width: ${breakpoints.mobile}) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }

  &:disabled {
    background: ${colors.background};
    opacity: 0.6;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  background: ${colors.surface};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  &:disabled {
    background: ${colors.background};
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 16px;
  }
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${colors.text.secondary};
  font-size: 16px;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid ${colors.border};
    border-top: 2px solid ${colors.primary};
    border-radius: 50%;
    margin-right: 12px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  background: #ffeaea;
  color: ${colors.error};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 16px;
  }
`;

export const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: ${colors.secondary};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '✅';
    font-size: 16px;
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 20px;
  
  ${props => props.$columns && `
    grid-template-columns: repeat(${props.$columns}, 1fr);
  `}

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  
  ${props => props.$direction && `flex-direction: ${props.$direction};`}
  ${props => props.$justify && `justify-content: ${props.$justify};`}
  ${props => props.$align && `align-items: ${props.$align};`}
  ${props => props.$gap && `gap: ${props.$gap}px;`}
  ${props => props.$wrap && `flex-wrap: wrap;`}

  @media (max-width: ${breakpoints.mobile}) {
    ${props => props.$mobileDirection && `flex-direction: ${props.$mobileDirection};`}
  }
`;

// Map specific styles
export const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.$height || '500px'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: ${breakpoints.mobile}) {
    height: ${props => props.$mobileHeight || '400px'};
    border-radius: 8px;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.$variant === 'success' && `
    background: #e8f5e8;
    color: ${colors.secondary};
  `}
  
  ${props => props.$variant === 'warning' && `
    background: #fff8e1;
    color: #f57c00;
  `}
  
  ${props => props.$variant === 'error' && `
    background: #ffeaea;
    color: ${colors.error};
  `}
  
  ${props => props.$variant === 'info' && `
    background: #e3f2fd;
    color: ${colors.primary};
  `}
`;

export const Tooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
  }

  &:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.8);
  }
`;