import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProductForm.module.css';
import type { Product, Category } from '../../types/product';

const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Other'
];

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id'> | Product) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: 'Other',
    stockQuantity: 0,
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stockQuantity: product.stockQuantity,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Product name must be less than 50 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
      newErrors.price = 'Price can have max 2 decimal places';
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (formData.imageUrl && !/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : 
              name === 'stockQuantity' ? parseInt(value, 10) || 0 : 
              value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      onSubmit(formData);
      if (!product) {
        setFormData({
          name: '',
          price: 0,
          category: 'Other',
          stockQuantity: 0,
          description: '',
          imageUrl: '',
        });
      }
    }
    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stockQuantity: product.stockQuantity,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        category: 'Other',
        stockQuantity: 0,
        description: '',
        imageUrl: '',
      });
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Product Name*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? styles.errorInput : ''}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.errorMessage}>
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price">Price*</label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className={errors.price ? styles.errorInput : ''}
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? 'price-error' : undefined}
        />
        {errors.price && (
          <span id="price-error" className={styles.errorMessage}>
            {errors.price}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">Category*</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.selectInput}
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="stockQuantity">Stock Quantity*</label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          min="0"
          value={formData.stockQuantity}
          onChange={handleChange}
          className={errors.stockQuantity ? styles.errorInput : ''}
          aria-invalid={!!errors.stockQuantity}
          aria-describedby={errors.stockQuantity ? 'stock-error' : undefined}
        />
        {errors.stockQuantity && (
          <span id="stock-error" className={styles.errorMessage}>
            {errors.stockQuantity}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={200}
          className={errors.description ? styles.errorInput : ''}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'desc-error' : undefined}
        />
        <div className={styles.charCounter}>
          {formData.description.length}/200 characters
        </div>
        {errors.description && (
          <span id="desc-error" className={styles.errorMessage}>
            {errors.description}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={errors.imageUrl ? styles.errorInput : ''}
          placeholder="https://example.com/image.jpg"
          aria-invalid={!!errors.imageUrl}
          aria-describedby={errors.imageUrl ? 'image-error' : undefined}
        />
        {errors.imageUrl && (
          <span id="image-error" className={styles.errorMessage}>
            {errors.imageUrl}
          </span>
        )}
      </div>

      <div className={styles.formActions}>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={styles.submitButton}
          aria-busy={isSubmitting}
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button 
          type="button" 
          onClick={handleReset} 
          className={styles.resetButton}
        >
          Reset
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default React.memo(ProductForm);