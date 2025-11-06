use sqlx::{SqlitePool, Result};
use crate::models::producto_proveedor::{ProductoProveedor, CreateProductoProveedor, UpdateProductoProveedor};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<ProductoProveedor>> {
    sqlx::query_as::<_, ProductoProveedor>("SELECT * FROM producto_proveedor ORDER BY id_prod_prov ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<ProductoProveedor>> {
    sqlx::query_as::<_, ProductoProveedor>("SELECT * FROM producto_proveedor WHERE id_prod_prov = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn create(pool: &SqlitePool, data: CreateProductoProveedor) -> Result<i64> {
    let estado = data.estado.unwrap_or_else(|| "Activo".to_string());
    let result = sqlx::query!(
        "INSERT INTO producto_proveedor (id_producto, id_proveedor, codigo_proveedor, estado) 
         VALUES (?, ?, ?, ?)",
        data.id_producto,
        data.id_proveedor,
        data.codigo_proveedor,
        estado
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateProductoProveedor) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE producto_proveedor SET
            id_producto = COALESCE(?, id_producto),
            id_proveedor = COALESCE(?, id_proveedor),
            codigo_proveedor = COALESCE(?, codigo_proveedor),
            estado = COALESCE(?, estado)
         WHERE id_prod_prov = ?",
        data.id_producto,
        data.id_proveedor,
        data.codigo_proveedor,
        data.estado,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM producto_proveedor WHERE id_prod_prov = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
