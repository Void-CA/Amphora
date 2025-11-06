use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Factura {
    pub id_factura: i32,
    pub numero: String,
    pub fecha: String,
    pub id_proveedor: i32,
    pub total: Option<f64>,
    pub estado: Option<String>,
}

/// Datos para crear una factura
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FacturaInput {
    pub numero: String,
    pub fecha: String,
    pub id_proveedor: i32,
    pub total: Option<f64>,
    pub estado: Option<String>,
}

/// Datos para actualizar una factura
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct FacturaUpdate {
    pub numero: Option<String>,
    pub fecha: Option<String>,
    pub id_proveedor: Option<i32>,
    pub total: Option<f64>,
    pub estado: Option<String>,
}
