use crate::models::factura::{Factura, FacturaInput, FacturaUpdate};
use sqlx::{SqlitePool, Result};

pub async fn create_factura(pool: &SqlitePool, data: FacturaInput) -> Result<i64> {
    let result = sqlx::query!(
        "INSERT INTO factura (numero, fecha, id_proveedor, total, estado)
         VALUES (?, ?, ?, ?, ?)",
        data.numero,
        data.fecha,
        data.id_proveedor,
        data.total,
        data.estado
    )
        .execute(pool)
        .await?;

    Ok(result.last_insert_rowid())
}

pub async fn update_factura(pool: &SqlitePool, id: i32, data: FacturaUpdate) -> Result<u64> {
    let result = sqlx::query!(
        "UPDATE factura SET
            numero = COALESCE(?, numero),
            fecha = COALESCE(?, fecha),
            id_proveedor = COALESCE(?, id_proveedor),
            total = COALESCE(?, total),
            estado = COALESCE(?, estado)
         WHERE id_factura = ?",
        data.numero,
        data.fecha,
        data.id_proveedor,
        data.total,
        data.estado,
        id
    )
        .execute(pool)
        .await?;

    Ok(result.rows_affected())
}
