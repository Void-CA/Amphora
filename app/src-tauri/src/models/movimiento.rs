use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Movimiento {
    pub id_movimiento: i32,
    pub fecha: String,
    pub tipo: String,
    pub subtipo: Option<String>,
    pub id_prod_prov: i32,
    pub id_presentacion: i32,
    pub cantidad: f64,
    pub precio_unit: Option<f64>,
    pub monto_total: Option<f64>,
    pub lote: Option<String>,
    pub fecha_venc: Option<String>,
    pub obs: Option<String>,
    pub id_factura: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateMovimiento {
    pub fecha: String,
    pub tipo: String,
    pub subtipo: Option<String>,
    pub id_prod_prov: i32,
    pub id_presentacion: i32,
    pub cantidad: f64,
    pub precio_unit: Option<f64>,
    pub monto_total: Option<f64>,
    pub lote: Option<String>,
    pub fecha_venc: Option<String>,
    pub obs: Option<String>,
    pub id_factura: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateMovimiento {
    pub fecha: Option<String>,
    pub tipo: Option<String>,
    pub subtipo: Option<String>,
    pub id_prod_prov: Option<i32>,
    pub id_presentacion: Option<i32>,
    pub cantidad: Option<f64>,
    pub precio_unit: Option<f64>,
    pub monto_total: Option<f64>,
    pub lote: Option<String>,
    pub fecha_venc: Option<String>,
    pub obs: Option<String>,
    pub id_factura: Option<i32>,
}