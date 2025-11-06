use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Producto {
    pub id_producto: i32,
    pub codigo_interno: String,
    pub descripcion: String,
    pub categoria: Option<String>,
    pub subcategoria: Option<String>,
    pub estado: Option<String>,
}

// DTOs para las operaciones
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateProducto {
    pub codigo_interno: String,
    pub descripcion: String,
    pub categoria: Option<String>,
    pub subcategoria: Option<String>,
    pub estado: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateProducto {
    pub codigo_interno: Option<String>,
    pub descripcion: Option<String>,
    pub categoria: Option<String>,
    pub subcategoria: Option<String>,
    pub estado: Option<String>,
}