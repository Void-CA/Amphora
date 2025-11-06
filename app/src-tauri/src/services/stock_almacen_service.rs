use sqlx::{SqlitePool, Result};
use crate::models::stock_almacen::{StockAlmacen, CreateStockAlmacen, UpdateStockAlmacen};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<StockAlmacen>> {
    sqlx::query_as::<_, StockAlmacen>("SELECT * FROM stock_almacen ORDER BY id_stock ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<StockAlmacen>> {
    sqlx::query_as::<_, StockAlmacen>("SELECT * FROM stock_almacen WHERE id_stock = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn get_by_almacen(pool: &SqlitePool, almacen_id: i32) -> Result<Vec<StockAlmacen>> {
    sqlx::query_as::<_, StockAlmacen>(
        "SELECT * FROM stock_almacen WHERE id_almacen = ? ORDER BY id_prod_prov ASC"
    )
    .bind(almacen_id)
    .fetch_all(pool)
    .await
}

pub async fn get_by_producto_proveedor(pool: &SqlitePool, prod_prov_id: i32) -> Result<Vec<StockAlmacen>> {
    sqlx::query_as::<_, StockAlmacen>(
        "SELECT * FROM stock_almacen WHERE id_prod_prov = ? ORDER BY id_almacen ASC"
    )
    .bind(prod_prov_id)
    .fetch_all(pool)
    .await
}

pub async fn create(pool: &SqlitePool, data: CreateStockAlmacen) -> Result<i64> {
    let result = sqlx::query!(
        "INSERT INTO stock_almacen (id_prod_prov, id_presentacion, id_almacen, stock_actual) 
         VALUES (?, ?, ?, ?)",
        data.id_prod_prov,
        data.id_presentacion,
        data.id_almacen,
        data.stock_actual
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateStockAlmacen) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE stock_almacen SET
            id_prod_prov = COALESCE(?, id_prod_prov),
            id_presentacion = COALESCE(?, id_presentacion),
            id_almacen = COALESCE(?, id_almacen),
            stock_actual = COALESCE(?, stock_actual)
         WHERE id_stock = ?",
        data.id_prod_prov,
        data.id_presentacion,
        data.id_almacen,
        data.stock_actual,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM stock_almacen WHERE id_stock = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
