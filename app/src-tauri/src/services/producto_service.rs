use sqlx::{SqlitePool, Result};
use crate::models::producto::{Producto, CreateProducto, UpdateProducto};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<Producto>> {
    sqlx::query_as::<_, Producto>("SELECT * FROM producto ORDER BY id_producto ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<Producto>> {
    sqlx::query_as::<_, Producto>("SELECT * FROM producto WHERE id_producto = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn create(pool: &SqlitePool, data: CreateProducto) -> Result<i64> {
    let estado = data.estado.unwrap_or_else(|| "Activo".to_string());
    let result = sqlx::query!(
        "INSERT INTO producto (codigo_interno, descripcion, categoria, subcategoria, estado) 
         VALUES (?, ?, ?, ?, ?)",
        data.codigo_interno,
        data.descripcion,
        data.categoria,
        data.subcategoria,
        estado
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateProducto) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE producto SET
            codigo_interno = COALESCE(?, codigo_interno),
            descripcion = COALESCE(?, descripcion),
            categoria = COALESCE(?, categoria),
            subcategoria = COALESCE(?, subcategoria),
            estado = COALESCE(?, estado)
         WHERE id_producto = ?",
        data.codigo_interno,
        data.descripcion,
        data.categoria,
        data.subcategoria,
        data.estado,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM producto WHERE id_producto = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
