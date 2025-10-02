import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Select, Flex, Card, colors, breakpoints } from '../styles/styled';
import { useDebounce } from '../hooks/useUtils';

const SearchContainer = styled(Card)`
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: ${colors.text.primary};
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr auto;
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const LocationButton = styled(Button)`
  white-space: nowrap;
  
  @media (max-width: ${breakpoints.mobile}) {
    justify-self: stretch;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: 12px;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${colors.text.primary};
  }
`;

const SearchFilters = ({ 
  onSearch, 
  onLocationSearch,
  categories = [],
  activeCategory = 'grocery',
  onCategoryChange,
  loading = false,
  locationLoading = false 
}) => {
  const [filters, setFilters] = useState({
    query: '',
    category: activeCategory,
    min_rating: '',
    max_price_level: '',
    radius: '5000',
    exclude_closed: true
  });

  const debouncedQuery = useDebounce(filters.query, 500);

  // Sync category when activeCategory changes from parent
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, category: activeCategory }));
  }, [activeCategory]);

  React.useEffect(() => {
    if (debouncedQuery !== filters.query) return;
    
    const searchParams = {
      query: filters.query || undefined,
      category: filters.category || undefined,
      min_rating: filters.min_rating ? parseFloat(filters.min_rating) : undefined,
      max_price_level: filters.max_price_level ? parseInt(filters.max_price_level) : undefined,
      // Convert radius from meters to kilometers for the business API
      radius: parseInt(filters.radius) / 1000
    };

    // Remove undefined values and don't send exclude_closed (not supported by business API)
    Object.keys(searchParams).forEach(key => 
      searchParams[key] === undefined && delete searchParams[key]
    );

    onSearch(searchParams);
  }, [debouncedQuery, filters.query, filters.category, filters.min_rating, filters.max_price_level, filters.radius, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationSearch = () => {
    onLocationSearch(parseInt(filters.radius));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: activeCategory,
      min_rating: '',
      max_price_level: '',
      radius: '5000',
      exclude_closed: true
    });
  };

  const hasFilters = filters.query || filters.min_rating || filters.max_price_level || filters.radius !== '5000' || !filters.exclude_closed;

  return (
    <SearchContainer>
      <FilterRow>
        <FilterGroup>
          <label>Search Stores</label>
          <Input
            type="text"
            placeholder="Search by name or address..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <label>Category</label>
          <Select
            value={filters.category}
            onChange={(e) => {
              handleFilterChange('category', e.target.value);
              if (onCategoryChange) {
                onCategoryChange(e.target.value);
              }
            }}
          >
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.icon} {category.name} ({category.count})
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <label>Min Rating</label>
          <Select
            value={filters.min_rating}
            onChange={(e) => handleFilterChange('min_rating', e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1+ ⭐</option>
            <option value="2">2+ ⭐</option>
            <option value="3">3+ ⭐</option>
            <option value="4">4+ ⭐</option>
            <option value="4.5">4.5+ ⭐</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <label>Max Price</label>
          <Select
            value={filters.max_price_level}
            onChange={(e) => handleFilterChange('max_price_level', e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">€ Budget</option>
            <option value="2">€€ Moderate</option>
            <option value="3">€€€ Expensive</option>
            <option value="4">€€€€ Luxury</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <label>Radius</label>
          <Select
            value={filters.radius}
            onChange={(e) => handleFilterChange('radius', e.target.value)}
          >
            <option value="1000">1 km</option>
            <option value="2000">2 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="25000">25 km</option>
          </Select>
        </FilterGroup>

        <LocationButton
          $variant="primary"
          onClick={handleLocationSearch}
          disabled={locationLoading}
        >
          <i className={locationLoading ? "fas fa-spinner fa-spin" : "fas fa-location-arrow"}></i>
          Near Me
        </LocationButton>
      </FilterRow>

      <Flex $justify="space-between" $align="center" style={{ marginTop: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={filters.exclude_closed}
            onChange={(e) => handleFilterChange('exclude_closed', e.target.checked)}
          />
          Hide closed stores
        </label>

        {hasFilters && (
          <ClearButton onClick={clearFilters}>
            <i className="fas fa-times"></i> Clear filters
          </ClearButton>
        )}
      </Flex>
    </SearchContainer>
  );
};

export default SearchFilters;