use sqlx::{SqlitePool, Result};
use crate::models::almacen::{Almacen, CreateAlmacen, UpdateAlmacen};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<Almacen>> {
    sqlx::query_as::<_, Almacen>("SELECT * FROM almacen")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<Almacen>> {
    sqlx::query_as::<_, Almacen>("SELECT * FROM almacen WHERE id_almacen = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn create(pool: &SqlitePool, data: CreateAlmacen) -> Result<i64> {
    let result = sqlx::query!(
        "INSERT INTO almacen (nombre, ubicacion, responsable) VALUES (?, ?, ?)",
        data.nombre,
        data.ubicacion,
        data.responsable
    )
        .execute(pool)
        .await?;
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateAlmacen) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE almacen SET
            nombre = COALESCE(?, nombre),
            ubicacion = COALESCE(?, ubicacion),
            responsable = COALESCE(?, responsable)
         WHERE id_almacen = ?",
        data.nombre,
        data.ubicacion,
        data.responsable,
        id
    )
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM almacen WHERE id_almacen = ?", id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}
