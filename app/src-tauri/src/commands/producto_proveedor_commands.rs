use tauri::State;
use sqlx::SqlitePool;

use crate::models::producto_proveedor::{ProductoProveedor, CreateProductoProveedor, UpdateProductoProveedor};
use crate::services::producto_proveedor_service;

#[tauri::command]
pub async fn create_producto_proveedor(pool: State<'_, SqlitePool>, data: CreateProductoProveedor) -> Result<i64, String> {
    producto_proveedor_service::create(&pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_producto_proveedores(pool: State<'_, SqlitePool>) -> Result<Vec<ProductoProveedor>, String> {
    producto_proveedor_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_producto_proveedor_by_id(pool: State<'_, SqlitePool>, pp_id: i32) -> Result<Option<ProductoProveedor>, String> {
    producto_proveedor_service::get_by_id(&pool, pp_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_producto_proveedor(pool: State<'_, SqlitePool>, pp_id: i32, data: UpdateProductoProveedor) -> Result<bool, String> {
    producto_proveedor_service::update(&pool, pp_id, data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_producto_proveedor(pool: State<'_, SqlitePool>, pp_id: i32) -> Result<bool, String> {
    producto_proveedor_service::delete(&pool, pp_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}