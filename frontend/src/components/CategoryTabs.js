import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/styled';

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.border};
  background: ${colors.surface};
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? colors.primary : colors.background};
    color: ${props => props.$active ? 'white' : colors.text.primary};
  }
  
  .icon {
    font-size: 16px;
  }
  
  .count {
    background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : colors.primary};
    color: ${props => props.$active ? 'white' : 'white'};
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    min-width: 18px;
    text-align: center;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
  background: ${colors.surface};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${colors.text.secondary};
  font-size: 14px;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${colors.error};
  font-size: 14px;
  text-align: center;
`;

const CategoryTabs = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange, 
  children,
  loading = false,
  error = null 
}) => {
  const [localActiveCategory, setLocalActiveCategory] = useState(activeCategory || 'grocery');

  useEffect(() => {
    if (activeCategory) {
      setLocalActiveCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleTabClick = (categoryKey) => {
    setLocalActiveCategory(categoryKey);
    if (onCategoryChange) {
      onCategoryChange(categoryKey);
    }
  };

  if (loading) {
    return (
      <TabsContainer>
        <LoadingState>Loading categories...</LoadingState>
      </TabsContainer>
    );
  }

  if (error) {
    return (
      <TabsContainer>
        <ErrorState>
          Error loading categories: {error}
          <br />
          <small>Please try refreshing the page</small>
        </ErrorState>
      </TabsContainer>
    );
  }

  return (
    <TabsContainer>
      <TabList>
        {categories.map((category) => (
          <Tab
            key={category.key}
            $active={category.key === localActiveCategory}
            onClick={() => handleTabClick(category.key)}
            title={category.name}
          >
            <span className="icon">{category.icon}</span>
            <span className="name">{category.name}</span>
            {category.count !== undefined && (
              <span className="count">{category.count}</span>
            )}
          </Tab>
        ))}
      </TabList>
      
      <TabContent>
        {children}
      </TabContent>
    </TabsContainer>
  );
};

export default CategoryTabs;