use tauri::State;
use sqlx::SqlitePool;

use crate::models::proveedor::{Proveedor, CreateProveedor, UpdateProveedor};
use crate::services::proveedor_service;

#[tauri::command]
pub async fn create_proveedor(pool: State<'_, SqlitePool>, proveedor_data: CreateProveedor) -> Result<i64, String> {
    proveedor_service::create(&pool, proveedor_data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_proveedores(pool: State<'_, SqlitePool>) -> Result<Vec<Proveedor>, String> {
    proveedor_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_proveedor_by_id(pool: State<'_, SqlitePool>, proveedor_id: i32) -> Result<Option<Proveedor>, String> {
    proveedor_service::get_by_id(&pool, proveedor_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_proveedor(pool: State<'_, SqlitePool>, proveedor_id: i32, proveedor_data: UpdateProveedor) -> Result<bool, String> {
    proveedor_service::update(&pool, proveedor_id, proveedor_data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_proveedor(pool: State<'_, SqlitePool>, proveedor_id: i32) -> Result<bool, String> {
    proveedor_service::delete(&pool, proveedor_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}