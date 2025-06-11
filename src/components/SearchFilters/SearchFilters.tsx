import React, { useState, useEffect, useCallback } from 'react';
import styles from './SearchFilters.module.css';
import type { Category } from '../../types/product';

const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Other'
];

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: {
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
    stockStatus: string;
  }) => void;
  debounceDelay?: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onFilter,
  debounceDelay = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [stockStatus, setStockStatus] = useState<string>('All');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, debounceDelay, onSearch]);

  // Apply filters immediately when they change
  useEffect(() => {
    onFilter({
      category,
      minPrice,
      maxPrice,
      stockStatus,
    });
  }, [category, minPrice, maxPrice, stockStatus, onFilter]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setCategory('All');
    setMinPrice(null);
    setMaxPrice(null);
    setStockStatus('All');
  }, []);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchGroup}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Search products by name or description"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | 'All')}
          className={styles.filterSelect}
          aria-label="Filter by product category"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="priceRange">Price Range</label>
        <div className={styles.priceRange} id="priceRange">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
            min="0"
            className={styles.priceInput}
            aria-label="Minimum price"
          />
          <span className={styles.priceSeparator}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
            min="0"
            className={styles.priceInput}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className={`${styles.filterGroup} ${styles.fullWidth}`}>
        <fieldset className={styles.stockStatusFieldset}>
          <legend>Stock Status</legend>
          <div className={styles.stockStatus}>
            {['All', 'In Stock', 'Out of Stock', 'Low Stock'].map((status) => (
              <label key={status} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="stockStatus"
                  value={status}
                  checked={stockStatus === status}
                  onChange={() => setStockStatus(status)}
                  className={styles.radioInput}
                />
                {status === 'Low Stock' ? 'Low Stock (<5)' : status}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button 
        type="button" 
        onClick={handleClearFilters} 
        className={styles.clearButton}
        aria-label="Clear all filters"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default React.memo(SearchFilters);