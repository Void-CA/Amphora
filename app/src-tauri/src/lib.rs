mod database;
mod commands;

use database::Database;
use commands::DbState;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // Initialize database
  let db = Database::new("inventory.db").expect("Failed to initialize database");
  
  tauri::Builder::default()
    .manage(Mutex::new(db))
    .invoke_handler(tauri::generate_handler![
      commands::get_all_products,
      commands::create_product,
      commands::update_product,
      commands::delete_product,
      commands::get_low_stock_products
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
