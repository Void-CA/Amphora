use tauri::State;
use sqlx::SqlitePool;

use crate::models::factura::{Factura, FacturaInput, FacturaUpdate};
use crate::services::factura_service;

#[tauri::command]
pub async fn create_factura(pool: State<'_, SqlitePool>, data: FacturaInput) -> Result<i64, String> {
    factura_service::create_factura(&pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_facturas(pool: State<'_, SqlitePool>) -> Result<Vec<Factura>, String> {
    sqlx::query_as::<_, Factura>("SELECT * FROM factura ORDER BY id_factura ASC")
        .fetch_all(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_factura_by_id(pool: State<'_, SqlitePool>, factura_id: i32) -> Result<Option<Factura>, String> {
    sqlx::query_as::<_, Factura>("SELECT * FROM factura WHERE id_factura = ?")
        .bind(factura_id)
        .fetch_optional(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_facturas_by_proveedor(pool: State<'_, SqlitePool>, proveedor_id: i32) -> Result<Vec<Factura>, String> {
    sqlx::query_as::<_, Factura>("SELECT * FROM factura WHERE id_proveedor = ? ORDER BY fecha DESC")
        .bind(proveedor_id)
        .fetch_all(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_factura(pool: State<'_, SqlitePool>, factura_id: i32, data: FacturaUpdate) -> Result<bool, String> {
    factura_service::update_factura(&pool, factura_id, data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_factura(pool: State<'_, SqlitePool>, factura_id: i32) -> Result<bool, String> {
    sqlx::query!("DELETE FROM factura WHERE id_factura = ?", factura_id)
        .execute(pool.inner())
        .await
        .map(|result| result.rows_affected() > 0)
        .map_err(|e| e.to_string())
}