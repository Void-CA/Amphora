import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Product } from '../types';

export interface InventoryStats {
  totalProducts: number;
  lowStockProducts: number;
  totalStockValue: number;
  activeProducts: number;
}

export interface UseInventoryReturn {
  products: Product[];
  loading: boolean;
  stats: InventoryStats;
  loadProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export function useInventory(): UseInventoryReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate inventory stats
  const stats: InventoryStats = {
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.currentStock <= p.minStock).length,
    totalStockValue: products.reduce((sum, product) => sum + product.currentStock, 0),
    activeProducts: products.filter(p => p.status === "Activo").length,
  };

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

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await invoke<Product>('create_product', productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: Partial<Product>) => {
    try {
      await invoke('update_product', { id, ...productData });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await invoke('delete_product', { id });
      setProducts(prev => prev.filter(p => p.id !== id));
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
    stats,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
