import React, { useState } from 'react';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, isSelected: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const stockStatus = product.stockQuantity === 0 
    ? 'Out of Stock' 
    : product.stockQuantity < 5 
      ? 'Low Stock' 
      : 'In Stock';

  const stockStatusClass = product.stockQuantity === 0 
    ? styles.outOfStock 
    : product.stockQuantity < 5 
      ? styles.lowStock 
      : styles.inStock;

  const truncatedDescription = product.description 
    ? product.description.length > 100 
      ? `${product.description.substring(0, 100)}...` 
      : product.description 
    : 'No description';

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(product.id, e.target.checked)}
          className={styles.selectCheckbox}
        />
      )}
      <div className={styles.imageContainer}>
        {imageError ? (
          <div className={styles.imagePlaceholder}>No Image</div>
        ) : (
          <img
            src={product.imageUrl || '/placeholder-product.png'}
            alt={product.name}
            onError={handleImageError}
            className={styles.productImage}
            loading="lazy"
          />
        )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(product.price)}
        </p>
        <p className={styles.productCategory}>{product.category}</p>
        <p className={`${styles.stockStatus} ${stockStatusClass}`}>
          {stockStatus} {product.stockQuantity > 0 && `(${product.stockQuantity})`}
        </p>
        <p className={styles.productDescription}>{truncatedDescription}</p>
      </div>
      <div className={styles.actions}>
        <button onClick={() => onEdit(product)} className={styles.editButton}>
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
});

export default ProductCard;