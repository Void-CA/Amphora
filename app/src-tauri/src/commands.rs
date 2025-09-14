use crate::database::{Database, Product, NewProduct};
use std::sync::Mutex;
use tauri::State;

pub type DbState = Mutex<Database>;

#[tauri::command]
pub async fn get_all_products(db: State<'_, DbState>) -> Result<Vec<Product>, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.get_all_products().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_product(db: State<'_, DbState>, product: NewProduct) -> Result<Product, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.create_product(product).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_product(db: State<'_, DbState>, id: i64, product: NewProduct) -> Result<Product, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.update_product(id, product).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_product(db: State<'_, DbState>, id: i64) -> Result<bool, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.delete_product(id).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_low_stock_products(db: State<'_, DbState>) -> Result<Vec<Product>, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    db.get_low_stock_products().map_err(|e| e.to_string())
}
