import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Product } from '../types';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id_producto'>) => Promise<void>;
  updateProduct: (id: number, productData: Partial<Omit<Product, 'id_producto'>>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await invoke<Product[]>('get_products');
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'id_producto'>) => {
    try {
      const newProduct = await invoke<Product>('create_product', { productData });
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: Partial<Omit<Product, 'id_producto'>>) => {
    try {
      await invoke('update_product', { id, productData });
      setProducts(prev => prev.map(p => p.id_producto === id ? { ...p, ...productData } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await invoke('delete_product', { id });
      setProducts(prev => prev.filter(p => p.id_producto !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
