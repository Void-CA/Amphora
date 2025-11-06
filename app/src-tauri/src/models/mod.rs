pub mod producto;
pub mod proveedor;
pub mod producto_proveedor;
pub mod presentacion;
pub mod factura;
pub mod almacen;
pub mod movimiento;
pub mod stock_almacen;

// Re-exportar todos los modelos para fácil acceso
pub use producto::*;
pub use proveedor::*;
pub use producto_proveedor::*;
pub use presentacion::*;
pub use factura::*;
pub use almacen::*;
pub use movimiento::*;
pub use stock_almacen::*;