import { useReducer, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { type Product } from '../types/product';

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: 'FETCH_PRODUCTS_REQUEST' }
  | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'BULK_DELETE_PRODUCTS'; payload: string[] };

const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_PRODUCTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'BULK_DELETE_PRODUCTS':
      return {
        ...state,
        products: state.products.filter(product => !action.payload.includes(product.id)),
      };
    default:
      return state;
  }
};

export const useProducts = () => {
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>('products', []);
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    try {
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: localProducts });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: error.message });
    }
  }, [localProducts]);

  const addProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      const newProduct = { ...product, id: Date.now().toString() };
      setLocalProducts([...state.products, newProduct]);
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    },
    [state.products, setLocalProducts]
  );

  const updateProduct = useCallback(
    (product: Product) => {
      setLocalProducts(
        state.products.map(p => (p.id === product.id ? product : p))
      );
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    },
    [state.products, setLocalProducts]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setLocalProducts(state.products.filter(product => product.id !== id));
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    },
    [state.products, setLocalProducts]
  );

  const bulkDeleteProducts = useCallback(
    (ids: string[]) => {
      setLocalProducts(state.products.filter(product => !ids.includes(product.id)));
      dispatch({ type: 'BULK_DELETE_PRODUCTS', payload: ids });
    },
    [state.products, setLocalProducts]
  );

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
  };
};