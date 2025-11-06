use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Almacen {
    pub id_almacen: i32,
    pub nombre: String,
    pub ubicacion: Option<String>,
    pub responsable: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateAlmacen {
    pub nombre: String,
    pub ubicacion: Option<String>,
    pub responsable: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateAlmacen {
    pub nombre: Option<String>,
    pub ubicacion: Option<String>,
    pub responsable: Option<String>,
}
