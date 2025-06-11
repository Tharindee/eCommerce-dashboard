export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
}

export type Category = 
  | 'Electronics'
  | 'Clothing'
  | 'Books'
  | 'Home'
  | 'Sports'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Other'
];