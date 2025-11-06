import { invoke } from '@tauri-apps/api/core';
import type { Product as FrontendProduct } from '@/types/inventory';

export interface Product {
  id_producto: number;
  codigo_interno: string;
  descripcion: string;
  categoria: string | null;
  subcategoria: string | null;
  estado: string | null;
}

export interface NewProduct {
  descripcion: string;
  codigo_interno?: string;
  categoria?: string | null;
  subcategoria?: string | null;
  estado?: string | null;
}

// Mapping functions to convert between database and frontend formats
export function dbProductToFrontend(dbProduct: Product): FrontendProduct {
  return {
    id: dbProduct.id_producto,
    internalCode: dbProduct.codigo_interno,
    description: dbProduct.descripcion,
    category: dbProduct.categoria || null,
    subcategory: dbProduct.subcategoria || null,
    status: dbProduct.estado || 'Activo'
  };
}

export function frontendProductToDb(frontendProduct: Partial<FrontendProduct>): Partial<NewProduct> {
  return {
    codigo_interno: frontendProduct.internalCode || `P-${Date.now()}`,
    descripcion: frontendProduct.description || '',
    categoria: frontendProduct.category || null,
    subcategoria: frontendProduct.subcategory || null,
    estado: frontendProduct.status || null
  };
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  return await invoke('get_products');
}

// Get all products (frontend format)
export async function getAllProductsFrontend(): Promise<FrontendProduct[]> {
  const dbProducts = await getAllProducts();
  return dbProducts.map(dbProductToFrontend);
}

// Create new product
export async function createProduct(newProduct: NewProduct): Promise<Product> {
  // Ensure codigo_interno is provided
  const productData = {
    ...newProduct,
    codigo_interno: newProduct.codigo_interno || `P-${Date.now()}`
  };
  return await invoke('create_product', { productData });
}

// Update product
export async function updateProduct(id: number, updates: NewProduct): Promise<Product> {
  return await invoke('update_product', { id, productData: updates });
}

// Delete product
export async function deleteProduct(id: number): Promise<boolean> {
  return await invoke('delete_product', { id });
}

// Get products with low stock
export async function getLowStockProducts(): Promise<Product[]> {
  return await invoke('get_low_stock_products');
}
