use tauri::State;
use sqlx::{SqlitePool, FromRow};
use serde::Serialize;

use crate::models::stock_almacen::{StockAlmacen, CreateStockAlmacen, UpdateStockAlmacen};
use crate::services::stock_almacen_service;

#[tauri::command]
pub async fn create_stock_almacen(pool: State<'_, SqlitePool>, data: CreateStockAlmacen) -> Result<i64, String> {
    stock_almacen_service::create(&pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_stock_almacen(pool: State<'_, SqlitePool>) -> Result<Vec<StockAlmacen>, String> {
    stock_almacen_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_stock_by_almacen(pool: State<'_, SqlitePool>, almacen_id: i32) -> Result<Vec<StockAlmacen>, String> {
    stock_almacen_service::get_by_almacen(&pool, almacen_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_stock_by_producto_proveedor(pool: State<'_, SqlitePool>, prod_prov_id: i32) -> Result<Vec<StockAlmacen>, String> {
    stock_almacen_service::get_by_producto_proveedor(&pool, prod_prov_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_stock_almacen(pool: State<'_, SqlitePool>, stock_id: i32, data: UpdateStockAlmacen) -> Result<bool, String> {
    stock_almacen_service::update(&pool, stock_id, data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_stock_almacen(pool: State<'_, SqlitePool>, stock_id: i32) -> Result<bool, String> {
    stock_almacen_service::delete(&pool, stock_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[derive(Serialize, FromRow)]
pub struct StockActual {
    pub id_prod_prov: i32,
    pub id_presentacion: i32,
    pub id_almacen: i32,
    pub stock_actual: f64,
}

#[tauri::command]
pub async fn get_stock_actual_all(pool: State<'_, SqlitePool>) -> Result<Vec<StockActual>, String> {
    sqlx::query_as::<_, StockActual>(
        "SELECT id_prod_prov, id_presentacion, id_almacen, stock_actual 
         FROM stock_almacen 
         ORDER BY id_stock ASC"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_low_stock_products(pool: State<'_, SqlitePool>) -> Result<Vec<crate::models::Producto>, String> {
    // Obtener productos con stock bajo (menos de 10 unidades en cualquier almacén)
    sqlx::query_as::<_, crate::models::Producto>(
        "SELECT DISTINCT p.id_producto, p.codigo_interno, p.descripcion, p.categoria, p.subcategoria, p.estado
         FROM producto p
         INNER JOIN producto_proveedor pp ON p.id_producto = pp.id_producto
         INNER JOIN stock_almacen sa ON pp.id_prod_prov = sa.id_prod_prov
         WHERE sa.stock_actual < 10
         ORDER BY p.id_producto ASC"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}