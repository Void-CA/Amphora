// types/stock.ts
export interface StockAlmacen {
  id_stock: number;
  id_prod_prov: number;
  id_presentacion: number;
  id_almacen: number;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  created_at?: string;
  updated_at?: string;
}

// Extender los tipos con firma de índice para compatibilidad con Tauri
export type CreateStockAlmacen = {
  id_prod_prov: number;
  id_presentacion: number;
  id_almacen: number;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
} & { [key: string]: unknown };

export type UpdateStockAlmacen = {
  id_prod_prov?: number;
  id_presentacion?: number;
  id_almacen?: number;
  stock_actual?: number;
  stock_minimo?: number;
  stock_maximo?: number;
} & { [key: string]: unknown };

export interface StockActual {
  id_prod_prov: number;
  id_presentacion: number;
  id_almacen: number;
  stock_actual: number;
}

// Tipo para los argumentos de los comandos
export interface StockCommandArgs {
  [key: string]: unknown;
}