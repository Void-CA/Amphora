use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct StockAlmacen {
    pub id_stock: i32,
    pub id_prod_prov: i32,
    pub id_presentacion: i32,
    pub id_almacen: i32,
    pub stock_actual: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateStockAlmacen {
    pub id_prod_prov: i32,
    pub id_presentacion: i32,
    pub id_almacen: i32,
    pub stock_actual: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateStockAlmacen {
    pub id_prod_prov: Option<i32>,
    pub id_presentacion: Option<i32>,
    pub id_almacen: Option<i32>,
    pub stock_actual: Option<f64>,
}