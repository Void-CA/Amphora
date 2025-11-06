use tauri::State;
use sqlx::SqlitePool;

mod db;
mod models;
mod services;
mod commands;

#[tokio::main]
async fn main() {
    let pool = db::init_db().await.expect("Error al conectar con la base de datos");

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            // Almacen commands
            commands::almacen_commands::get_almacenes,
            commands::almacen_commands::create_almacen,
            
            // Producto commands
            commands::producto_commands::create_product,
            commands::producto_commands::get_products,
            commands::producto_commands::get_product_by_id,
            commands::producto_commands::update_product,
            commands::producto_commands::delete_product,
            
            // Proveedor commands
            commands::proveedor_commands::create_proveedor,
            commands::proveedor_commands::get_proveedores,
            commands::proveedor_commands::get_proveedor_by_id,
            commands::proveedor_commands::update_proveedor,
            commands::proveedor_commands::delete_proveedor,
            
            // Presentacion commands
            commands::presentacion_commands::create_presentacion,
            commands::presentacion_commands::get_presentaciones,
            commands::presentacion_commands::get_presentacion_by_id,
            commands::presentacion_commands::get_presentaciones_by_producto,
            commands::presentacion_commands::update_presentacion,
            commands::presentacion_commands::delete_presentacion,
            
            // Producto Proveedor commands
            commands::producto_proveedor_commands::create_producto_proveedor,
            commands::producto_proveedor_commands::get_producto_proveedores,
            commands::producto_proveedor_commands::get_producto_proveedor_by_id,
            commands::producto_proveedor_commands::update_producto_proveedor,
            commands::producto_proveedor_commands::delete_producto_proveedor,
            
            // Movimiento commands
            commands::movimiento_commands::create_movimiento,
            commands::movimiento_commands::get_movimientos,
            commands::movimiento_commands::get_movimiento_by_id,
            commands::movimiento_commands::get_movimientos_by_factura,
            commands::movimiento_commands::get_movimientos_by_producto_proveedor,
            commands::movimiento_commands::update_movimiento,
            commands::movimiento_commands::delete_movimiento,
            
            // Stock Almacen commands
            commands::stock_commands::create_stock_almacen,
            commands::stock_commands::get_stock_almacen,
            commands::stock_commands::get_stock_by_almacen,
            commands::stock_commands::get_stock_by_producto_proveedor,
            commands::stock_commands::update_stock_almacen,
            commands::stock_commands::delete_stock_almacen,
            commands::stock_commands::get_stock_actual_all,
            commands::stock_commands::get_low_stock_products,
            
            // Factura commands
            commands::factura_commands::create_factura,
            commands::factura_commands::get_facturas,
            commands::factura_commands::get_factura_by_id,
            commands::factura_commands::get_facturas_by_proveedor,
            commands::factura_commands::update_factura,
            commands::factura_commands::delete_factura,
        ])
        .run(tauri::generate_context!())
        .expect("Error ejecutando la app Tauri");
}
