import { invoke } from '@tauri-apps/api/core';

export interface Product {
  id: number;
  description: string;
  category: string | null;
  subcategory: string | null;
  unit: string;
  current_stock: number | null;
  min_stock: number | null;
  max_stock: number | null;
  status: string | null;
}

export interface NewProduct {
  description: string;
  category: string | null;
  subcategory: string | null;
  unit: string;
  current_stock: number | null;
  min_stock: number | null;
  max_stock: number | null;
  status: string | null;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  return await invoke('get_all_products');
}

// Create new product
export async function createProduct(newProduct: NewProduct): Promise<Product> {
  return await invoke('create_product', { product: newProduct });
}

// Update product
export async function updateProduct(id: number, updates: NewProduct): Promise<Product> {
  return await invoke('update_product', { id, product: updates });
}

// Delete product
export async function deleteProduct(id: number): Promise<boolean> {
  return await invoke('delete_product', { id });
}

// Get products with low stock
export async function getLowStockProducts(): Promise<Product[]> {
  return await invoke('get_low_stock_products');
}
