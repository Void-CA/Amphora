pub mod producto_commands;
pub mod proveedor_commands;
pub mod producto_proveedor_commands;
pub mod presentacion_commands;
pub mod factura_commands;
pub mod almacen_commands;
pub mod movimiento_commands;
pub mod stock_commands;

// Re-exportar todos los comandos
pub use producto_commands::*;
pub use proveedor_commands::*;
pub use producto_proveedor_commands::*;
pub use presentacion_commands::*;
pub use factura_commands::*;
pub use almacen_commands::*;
pub use movimiento_commands::*;
pub use stock_commands::*;

#[cfg(test)]
mod tests;