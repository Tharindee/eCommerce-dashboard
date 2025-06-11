import React from 'react';
import styles from './Filters.module.css';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
  stockStatus: string;
  setStockStatus: (status: string) => void;
}

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  stockStatus,
  setStockStatus,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value ? Number(e.target.value) : null;
    setPriceRange({ ...priceRange, [type]: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setPriceRange({ min: null, max: null });
    setStockStatus('All');
  };

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
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by product category"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="price-range">Price Range</label>
        <div className={styles.priceRange} id="price-range">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min || ''}
            onChange={(e) => handlePriceChange(e, 'min')}
            className={styles.priceInput}
            min="0"
            aria-label="Minimum price"
          />
          <span className={styles.priceSeparator}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max || ''}
            onChange={(e) => handlePriceChange(e, 'max')}
            className={styles.priceInput}
            min="0"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <fieldset className={styles.stockStatus}>
          <legend>Stock Status</legend>
          <div className={styles.radioGroup}>
            {['All', 'In Stock', 'Out of Stock', 'Low Stock (<5)'].map((status) => (
              <label key={status} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="stockStatus"
                  value={status}
                  checked={stockStatus === status}
                  onChange={() => setStockStatus(status)}
                  className={styles.radioInput}
                />
                {status}
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
        Clear Filters
      </button>
    </div>
  );
};

export default React.memo(Filters);