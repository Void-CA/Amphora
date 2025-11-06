// hooks/useStocks.ts
import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { 
  StockAlmacen, 
  CreateStockAlmacen, 
  UpdateStockAlmacen, 
  StockActual 
} from '../types/stock';
import type { Product } from '../types';

export interface UseStocksReturn {
  // Estados
  stocks: StockAlmacen[];
  stockActual: StockActual[];
  lowStockProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Operaciones CRUD básicas
  loadStocks: () => Promise<void>;
  createStock: (data: CreateStockAlmacen) => Promise<boolean>;
  updateStock: (stockId: number, data: UpdateStockAlmacen) => Promise<boolean>;
  deleteStock: (stockId: number) => Promise<boolean>;
  
  // Consultas específicas
  loadStockByAlmacen: (almacenId: number) => Promise<StockAlmacen[]>;
  loadStockByProductoProveedor: (prodProvId: number) => Promise<StockAlmacen[]>;
  loadStockActual: () => Promise<void>;
  loadLowStockProducts: () => Promise<void>;
  
  // Utilidades
  getStockByAlmacen: (almacenId: number) => StockAlmacen[];
  getStockByProductoProveedor: (prodProvId: number) => StockAlmacen[];
  getLowStockAlerts: () => StockAlmacen[];
}

export function useStocks(): UseStocksReturn {
  const [stocks, setStocks] = useState<StockAlmacen[]>([]);
  const [stockActual, setStockActual] = useState<StockActual[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los stocks
  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<StockAlmacen[]>('get_stock_almacen');
      setStocks(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading stocks';
      setError(errorMsg);
      console.error('Error loading stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo stock - CORREGIDO
  const createStock = useCallback(async (data: CreateStockAlmacen): Promise<boolean> => {
    try {
      setError(null);
      // Pasar los datos directamente sin envolver en otro objeto
      const newStockId = await invoke<number>('create_stock_almacen', data);
      
      // Recargar la lista de stocks después de crear
      await loadStocks();
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error creating stock';
      setError(errorMsg);
      console.error('Error creating stock:', err);
      return false;
    }
  }, [loadStocks]);

  // Actualizar stock - CORREGIDO
  const updateStock = useCallback(async (stockId: number, data: UpdateStockAlmacen): Promise<boolean> => {
    try {
      setError(null);
      // Combinar stockId con data en un solo objeto
      const updateData = {
        stock_id: stockId,
        ...data
      };
      
      const success = await invoke<boolean>('update_stock_almacen', updateData);
      
      if (success) {
        await loadStocks();
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error updating stock';
      setError(errorMsg);
      console.error('Error updating stock:', err);
      return false;
    }
  }, [loadStocks]);

  // Eliminar stock - CORREGIDO
  const deleteStock = useCallback(async (stockId: number): Promise<boolean> => {
    try {
      setError(null);
      const success = await invoke<boolean>('delete_stock_almacen', { 
        stock_id: stockId 
      });
      
      if (success) {
        await loadStocks();
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error deleting stock';
      setError(errorMsg);
      console.error('Error deleting stock:', err);
      return false;
    }
  }, [loadStocks]);

  // Cargar stock por almacén - CORREGIDO
  const loadStockByAlmacen = useCallback(async (almacenId: number): Promise<StockAlmacen[]> => {
    try {
      setError(null);
      const result = await invoke<StockAlmacen[]>('get_stock_by_almacen', { 
        almacen_id: almacenId 
      });
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading stock by almacen';
      setError(errorMsg);
      console.error('Error loading stock by almacen:', err);
      return [];
    }
  }, []);

  // Cargar stock por producto-proveedor - CORREGIDO
  const loadStockByProductoProveedor = useCallback(async (prodProvId: number): Promise<StockAlmacen[]> => {
    try {
      setError(null);
      const result = await invoke<StockAlmacen[]>('get_stock_by_producto_proveedor', { 
        prod_prov_id: prodProvId 
      });
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading stock by product provider';
      setError(errorMsg);
      console.error('Error loading stock by product provider:', err);
      return [];
    }
  }, []);

  // Cargar stock actual
  const loadStockActual = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<StockActual[]>('get_stock_actual_all');
      setStockActual(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading current stock';
      setError(errorMsg);
      console.error('Error loading current stock:', err);
    }
  }, []);

  // Cargar productos con stock bajo
  const loadLowStockProducts = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<Product[]>('get_low_stock_products');
      setLowStockProducts(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading low stock products';
      setError(errorMsg);
      console.error('Error loading low stock products:', err);
    }
  }, []);

  // Utilidades para filtrar datos en el frontend
  const getStockByAlmacen = useCallback((almacenId: number): StockAlmacen[] => {
    return stocks.filter(stock => stock.id_almacen === almacenId);
  }, [stocks]);

  const getStockByProductoProveedor = useCallback((prodProvId: number): StockAlmacen[] => {
    return stocks.filter(stock => stock.id_prod_prov === prodProvId);
  }, [stocks]);

  const getLowStockAlerts = useCallback((): StockAlmacen[] => {
    return stocks.filter(stock => stock.stock_actual <= stock.stock_minimo);
  }, [stocks]);

  // Cargar datos iniciales
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadStocks(),
          loadStockActual(),
          loadLowStockProducts()
        ]);
      } catch (err) {
        console.error('Error initializing stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [loadStocks, loadStockActual, loadLowStockProducts]);

  return {
    // Estados
    stocks,
    stockActual,
    lowStockProducts,
    loading,
    error,
    
    // Operaciones CRUD
    loadStocks,
    createStock,
    updateStock,
    deleteStock,
    
    // Consultas específicas
    loadStockByAlmacen,
    loadStockByProductoProveedor,
    loadStockActual,
    loadLowStockProducts,
    
    // Utilidades
    getStockByAlmacen,
    getStockByProductoProveedor,
    getLowStockAlerts,
  };
}