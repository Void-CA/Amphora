use tauri::State;
use sqlx::SqlitePool;

use crate::models::producto::{Producto, CreateProducto, UpdateProducto};
use crate::services::producto_service;

#[tauri::command]
pub async fn create_product(pool: State<'_, SqlitePool>, product_data: CreateProducto) -> Result<i64, String> {
    producto_service::create(&pool, product_data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_products(pool: State<'_, SqlitePool>) -> Result<Vec<Producto>, String> {
    producto_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_product_by_id(pool: State<'_, SqlitePool>, product_id: i32) -> Result<Option<Producto>, String> {
    producto_service::get_by_id(&pool, product_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_product(pool: State<'_, SqlitePool>, product_id: i32, product_data: UpdateProducto) -> Result<bool, String> {
    producto_service::update(&pool, product_id, product_data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_product(pool: State<'_, SqlitePool>, product_id: i32) -> Result<bool, String> {
    producto_service::delete(&pool, product_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}