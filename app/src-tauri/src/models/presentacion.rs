use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Presentacion {
    pub id_presentacion: i32,
    pub id_producto: i32,
    pub unidad: String,
    pub cantidad: f64,
    pub descripcion: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreatePresentacion {
    pub id_producto: i32,
    pub unidad: String,
    pub cantidad: f64,
    pub descripcion: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdatePresentacion {
    pub id_producto: Option<i32>,
    pub unidad: Option<String>,
    pub cantidad: Option<f64>,
    pub descripcion: Option<String>,
}