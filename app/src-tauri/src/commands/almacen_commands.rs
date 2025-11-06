use tauri::State;
use sqlx::SqlitePool;

use crate::models::almacen::{Almacen, CreateAlmacen, UpdateAlmacen};
use crate::services::almacen_service;

#[tauri::command]
pub async fn get_almacenes(state: State<'_, SqlitePool>) -> Result<Vec<Almacen>, String> {
    almacen_service::get_all(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_almacen(state: State<'_, SqlitePool>, data: CreateAlmacen) -> Result<i64, String> {
    almacen_service::create(&state, data).await.map_err(|e| e.to_string())
}
