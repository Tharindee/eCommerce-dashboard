import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  productCount: number;
  onAddProduct: () => void;
  showBulkActions: boolean;
  onToggleBulkActions: () => void;
  onBulkDelete: () => void;
  selectedCount: number;
}

const Header: React.FC<HeaderProps> = ({
  productCount,
  onAddProduct,
  showBulkActions,
  onToggleBulkActions,
  onBulkDelete,
  selectedCount,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <h1>Product Dashboard</h1>
          <span className={styles.productCount}>
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className={styles.actions}>
          {showBulkActions ? (
            <div className={styles.bulkActions}>
              <span className={styles.selectedCount}>
                {selectedCount} selected
              </span>
              <button
                onClick={onToggleBulkActions}
                className={styles.cancelBulkButton}
                aria-label="Cancel bulk selection"
              >
                Cancel
              </button>
              <button
                onClick={onBulkDelete}
                className={styles.bulkDeleteButton}
                disabled={selectedCount === 0}
                aria-label={`Delete ${selectedCount} selected products`}
              >
                Delete Selected
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onToggleBulkActions}
                className={styles.bulkSelectButton}
                aria-label="Select multiple products for bulk actions"
              >
                Bulk Actions
              </button>
              <button
                onClick={onAddProduct}
                className={styles.addProductButton}
                aria-label="Add new product"
              >
                Add Product
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);