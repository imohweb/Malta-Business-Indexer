import React from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/styled';

const HeaderContainer = styled.header`
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0 16px;
    height: 56px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.text.primary};

  .icon {
    font-size: 28px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 20px;
    .icon {
      font-size: 24px;
    }
  }
`;

const Title = styled.span`
  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const Subtitle = styled.span`
  display: none;
  font-size: 16px;
  font-weight: 500;
  color: ${colors.text.primary};

  @media (max-width: ${breakpoints.mobile}) {
    display: block;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatsButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  color: ${colors.text.secondary};

  &:hover {
    background: ${colors.surfaceHover};
    color: ${colors.text.primary};
  }

  i {
    font-size: 18px;
  }
`;

const Header = ({ onStatsClick, stats }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <span className="icon">🏪</span>
          <Title>Malta Grocery Indexer</Title>
          <Subtitle>Malta Groceries</Subtitle>
        </Logo>
        
        <Actions>
          {stats && (
            <StatsButton 
              onClick={onStatsClick}
              title={`${stats.total_stores} stores indexed`}
            >
              <i className="fas fa-chart-bar"></i>
              <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                {stats.total_stores}
              </span>
            </StatsButton>
          )}
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;