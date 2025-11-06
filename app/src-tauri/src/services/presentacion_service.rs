use sqlx::{SqlitePool, Result};
use crate::models::presentacion::{Presentacion, CreatePresentacion, UpdatePresentacion};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<Presentacion>> {
    sqlx::query_as::<_, Presentacion>("SELECT * FROM presentacion ORDER BY id_presentacion ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<Presentacion>> {
    sqlx::query_as::<_, Presentacion>("SELECT * FROM presentacion WHERE id_presentacion = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn get_by_producto(pool: &SqlitePool, producto_id: i32) -> Result<Vec<Presentacion>> {
    sqlx::query_as::<_, Presentacion>(
        "SELECT * FROM presentacion WHERE id_producto = ? ORDER BY id_presentacion ASC"
    )
    .bind(producto_id)
    .fetch_all(pool)
    .await
}

pub async fn create(pool: &SqlitePool, data: CreatePresentacion) -> Result<i64> {
    let result = sqlx::query!(
        "INSERT INTO presentacion (id_producto, unidad, cantidad, descripcion) 
         VALUES (?, ?, ?, ?)",
        data.id_producto,
        data.unidad,
        data.cantidad,
        data.descripcion
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdatePresentacion) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE presentacion SET
            id_producto = COALESCE(?, id_producto),
            unidad = COALESCE(?, unidad),
            cantidad = COALESCE(?, cantidad),
            descripcion = COALESCE(?, descripcion)
         WHERE id_presentacion = ?",
        data.id_producto,
        data.unidad,
        data.cantidad,
        data.descripcion,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM presentacion WHERE id_presentacion = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
