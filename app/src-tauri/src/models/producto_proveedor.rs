use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct ProductoProveedor {
    pub id_prod_prov: i32,
    pub id_producto: i32,
    pub id_proveedor: i32,
    pub codigo_proveedor: String,
    pub estado: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateProductoProveedor {
    pub id_producto: i32,
    pub id_proveedor: i32,
    pub codigo_proveedor: String,
    pub estado: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateProductoProveedor {
    pub id_producto: Option<i32>,
    pub id_proveedor: Option<i32>,
    pub codigo_proveedor: Option<String>,
    pub estado: Option<String>,
}