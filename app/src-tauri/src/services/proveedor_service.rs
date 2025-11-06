use sqlx::{SqlitePool, Result};
use crate::models::proveedor::{Proveedor, CreateProveedor, UpdateProveedor};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<Proveedor>> {
    sqlx::query_as::<_, Proveedor>("SELECT * FROM proveedor ORDER BY id_proveedor ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<Proveedor>> {
    sqlx::query_as::<_, Proveedor>("SELECT * FROM proveedor WHERE id_proveedor = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn create(pool: &SqlitePool, data: CreateProveedor) -> Result<i64> {
    let estado = data.estado.unwrap_or_else(|| "Activo".to_string());
    let result = sqlx::query!(
        "INSERT INTO proveedor (ruc_ci, nombre, contacto, telefono, email, estado) 
         VALUES (?, ?, ?, ?, ?, ?)",
        data.ruc_ci,
        data.nombre,
        data.contacto,
        data.telefono,
        data.email,
        estado
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateProveedor) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE proveedor SET
            ruc_ci = COALESCE(?, ruc_ci),
            nombre = COALESCE(?, nombre),
            contacto = COALESCE(?, contacto),
            telefono = COALESCE(?, telefono),
            email = COALESCE(?, email),
            estado = COALESCE(?, estado)
         WHERE id_proveedor = ?",
        data.ruc_ci,
        data.nombre,
        data.contacto,
        data.telefono,
        data.email,
        data.estado,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM proveedor WHERE id_proveedor = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
