use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Proveedor {
    pub id_proveedor: i32,
    pub ruc_ci: String,
    pub nombre: String,
    pub contacto: Option<String>,
    pub telefono: Option<String>,
    pub email: Option<String>,
    pub estado: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateProveedor {
    pub ruc_ci: String,
    pub nombre: String,
    pub contacto: Option<String>,
    pub telefono: Option<String>,
    pub email: Option<String>,
    pub estado: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateProveedor {
    pub ruc_ci: Option<String>,
    pub nombre: Option<String>,
    pub contacto: Option<String>,
    pub telefono: Option<String>,
    pub email: Option<String>,
    pub estado: Option<String>,
}