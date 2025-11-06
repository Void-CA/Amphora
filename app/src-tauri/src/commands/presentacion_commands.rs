use tauri::State;
use sqlx::SqlitePool;

use crate::models::presentacion::{Presentacion, CreatePresentacion, UpdatePresentacion};
use crate::services::presentacion_service;

#[tauri::command]
pub async fn create_presentacion(pool: State<'_, SqlitePool>, data: CreatePresentacion) -> Result<i64, String> {
    presentacion_service::create(&pool, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_presentaciones(pool: State<'_, SqlitePool>) -> Result<Vec<Presentacion>, String> {
    presentacion_service::get_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_presentacion_by_id(pool: State<'_, SqlitePool>, presentacion_id: i32) -> Result<Option<Presentacion>, String> {
    presentacion_service::get_by_id(&pool, presentacion_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_presentaciones_by_producto(pool: State<'_, SqlitePool>, producto_id: i32) -> Result<Vec<Presentacion>, String> {
    presentacion_service::get_by_producto(&pool, producto_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_presentacion(pool: State<'_, SqlitePool>, presentacion_id: i32, data: UpdatePresentacion) -> Result<bool, String> {
    presentacion_service::update(&pool, presentacion_id, data)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_presentacion(pool: State<'_, SqlitePool>, presentacion_id: i32) -> Result<bool, String> {
    presentacion_service::delete(&pool, presentacion_id)
        .await
        .map(|rows| rows > 0)
        .map_err(|e| e.to_string())
}