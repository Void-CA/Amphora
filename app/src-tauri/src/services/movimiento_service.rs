use sqlx::{SqlitePool, Result};
use crate::models::movimiento::{Movimiento, CreateMovimiento, UpdateMovimiento};

pub async fn get_all(pool: &SqlitePool) -> Result<Vec<Movimiento>> {
    sqlx::query_as::<_, Movimiento>("SELECT * FROM movimiento ORDER BY id_movimiento ASC")
        .fetch_all(pool)
        .await
}

pub async fn get_by_id(pool: &SqlitePool, id: i32) -> Result<Option<Movimiento>> {
    sqlx::query_as::<_, Movimiento>("SELECT * FROM movimiento WHERE id_movimiento = ?")
        .bind(id)
        .fetch_optional(pool)
        .await
}

pub async fn get_by_factura(pool: &SqlitePool, factura_id: i32) -> Result<Vec<Movimiento>> {
    sqlx::query_as::<_, Movimiento>(
        "SELECT * FROM movimiento WHERE id_factura = ? ORDER BY fecha ASC"
    )
    .bind(factura_id)
    .fetch_all(pool)
    .await
}

pub async fn get_by_producto_proveedor(pool: &SqlitePool, prod_prov_id: i32) -> Result<Vec<Movimiento>> {
    sqlx::query_as::<_, Movimiento>(
        "SELECT * FROM movimiento WHERE id_prod_prov = ? ORDER BY fecha DESC"
    )
    .bind(prod_prov_id)
    .fetch_all(pool)
    .await
}

pub async fn create(pool: &SqlitePool, data: CreateMovimiento) -> Result<i64> {
    let result = sqlx::query!(
        "INSERT INTO movimiento (fecha, tipo, subtipo, id_prod_prov, id_presentacion, cantidad, 
                                 precio_unit, monto_total, lote, fecha_venc, obs, id_factura) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        data.fecha,
        data.tipo,
        data.subtipo,
        data.id_prod_prov,
        data.id_presentacion,
        data.cantidad,
        data.precio_unit,
        data.monto_total,
        data.lote,
        data.fecha_venc,
        data.obs,
        data.id_factura
    )
    .execute(pool)
    .await?;
    
    Ok(result.last_insert_rowid())
}

pub async fn update(pool: &SqlitePool, id: i32, data: UpdateMovimiento) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE movimiento SET
            fecha = COALESCE(?, fecha),
            tipo = COALESCE(?, tipo),
            subtipo = COALESCE(?, subtipo),
            id_prod_prov = COALESCE(?, id_prod_prov),
            id_presentacion = COALESCE(?, id_presentacion),
            cantidad = COALESCE(?, cantidad),
            precio_unit = COALESCE(?, precio_unit),
            monto_total = COALESCE(?, monto_total),
            lote = COALESCE(?, lote),
            fecha_venc = COALESCE(?, fecha_venc),
            obs = COALESCE(?, obs),
            id_factura = COALESCE(?, id_factura)
         WHERE id_movimiento = ?",
        data.fecha,
        data.tipo,
        data.subtipo,
        data.id_prod_prov,
        data.id_presentacion,
        data.cantidad,
        data.precio_unit,
        data.monto_total,
        data.lote,
        data.fecha_venc,
        data.obs,
        data.id_factura,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(result.rows_affected())
}

pub async fn delete(pool: &SqlitePool, id: i32) -> Result<u64> {
    let result = sqlx::query!("DELETE FROM movimiento WHERE id_movimiento = ?", id)
        .execute(pool)
        .await?;
    
    Ok(result.rows_affected())
}
