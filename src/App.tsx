import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from './hooks/useProducts';
import ProductCard from './components/ProductCard/ProductCard';
import ProductForm from './components/ProductForm/ProductForm';
import SearchFilters from './components/SearchFilters/SearchFilters';
import Header from './components/Header/Header';
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog';
import styles from './App.module.css';
import { type Product } from './types/product';
import "./App.module.css"

const App: React.FC = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    stockStatus: 'All',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory =
        filters.category === 'All' || product.category === filters.category;

      // Price filter
      const matchesMinPrice =
        filters.minPrice === null || product.price >= filters.minPrice;
      const matchesMaxPrice =
        filters.maxPrice === null || product.price <= filters.maxPrice;

      // Stock status filter
      let matchesStockStatus = true;
      if (filters.stockStatus === 'In Stock') {
        matchesStockStatus = product.stockQuantity > 0;
      } else if (filters.stockStatus === 'Out of Stock') {
        matchesStockStatus = product.stockQuantity === 0;
      } else if (filters.stockStatus === 'Low Stock') {
        matchesStockStatus = product.stockQuantity > 0 && product.stockQuantity < 5;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesStockStatus
      );
    });
  }, [products, searchTerm, filters]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilter = useCallback(
    (newFilters: {
      category: string;
      minPrice: number | null;
      maxPrice: number | null;
      stockStatus: string;
    }) => {
      setFilters(newFilters);
    },
    []
  );

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setIsFormOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setProductToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  }, [productToDelete, deleteProduct]);

  const handleBulkDelete = useCallback(() => {
    bulkDeleteProducts(selectedProducts);
    setSelectedProducts([]);
    setShowBulkActions(false);
  }, [selectedProducts, bulkDeleteProducts]);

  const handleProductSelect = useCallback((id: string, isSelected: boolean) => {
    setSelectedProducts((prev) =>
      isSelected ? [...prev, id] : prev.filter((productId) => productId !== id)
    );
  }, []);

  const handleSubmitProduct = useCallback(
    (productData: Omit<Product, 'id'> | Product) => {
      if (editingProduct) {
        updateProduct({ ...productData, id: editingProduct.id } as Product);
      } else {
        addProduct(productData);
      }
      setIsFormOpen(false);
    },
    [addProduct, updateProduct, editingProduct]
  );

  return (
    <div className={styles.app}>
      <Header 
        productCount={filteredProducts.length} 
        onAddProduct={handleAddProduct}
        showBulkActions={showBulkActions || selectedProducts.length > 0}
        onToggleBulkActions={() => setShowBulkActions(!showBulkActions)}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedProducts.length}
      />

      <main className={styles.mainContent}>
        <SearchFilters onSearch={handleSearch} onFilter={handleFilter} />

        {loading && <div className={styles.loading}>Loading products...</div>}
        {error && <div className={styles.error}>Error: {error}</div>}

        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                No products found. Try adjusting your filters.
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteClick}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={showBulkActions ? handleProductSelect : undefined}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmitProduct}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {productToDelete && (
        <ConfirmationDialog
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
};

export default App;