use tauri::State;
use sqlx::SqlitePool;

use crate::models::movimiento::{Movimiento, CreateMovimiento, UpdateMovimiento};
use crate::services::movimiento_service;

#[tauri::command]
pub async fn create_movimiento(pool: State<'_, SqlitePool>, data: CreateMovimiento) -> Result<i64, String> {
    movimiento_service::create(&pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_movimientos(pool: State<'_, SqlitePool>) -> Result<Vec<Movimiento>, String> {
    movimiento_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_movimiento_by_id(pool: State<'_, SqlitePool>, movimiento_id: i32) -> Result<Option<Movimiento>, String> {
    movimiento_service::get_by_id(&pool, movimiento_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_movimientos_by_factura(pool: State<'_, SqlitePool>, factura_id: i32) -> Result<Vec<Movimiento>, String> {
    movimiento_service::get_by_factura(&pool, factura_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_movimientos_by_producto_proveedor(pool: State<'_, SqlitePool>, prod_prov_id: i32) -> Result<Vec<Movimiento>, String> {
    movimiento_service::get_by_producto_proveedor(&pool, prod_prov_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_movimiento(pool: State<'_, SqlitePool>, movimiento_id: i32, data: UpdateMovimiento) -> Result<bool, String> {
    movimiento_service::update(&pool, movimiento_id, data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_movimiento(pool: State<'_, SqlitePool>, movimiento_id: i32) -> Result<bool, String> {
    movimiento_service::delete(&pool, movimiento_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}