use sqlx::{SqlitePool, Result};

pub async fn init_db() -> Result<SqlitePool> {
    // Ruta de tu base de datos
    let db_url = "sqlite:inventory.db";

    let pool = SqlitePool::connect(db_url).await?;
    
    // Crear tablas si no existen
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS producto (
            id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_interno TEXT NOT NULL UNIQUE,
            descripcion TEXT NOT NULL,
            categoria TEXT,
            subcategoria TEXT,
            estado TEXT DEFAULT 'Activo'
        );

        CREATE TABLE IF NOT EXISTS proveedor (
            id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
            ruc_ci TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            contacto TEXT,
            telefono TEXT,
            email TEXT,
            estado TEXT DEFAULT 'Activo'
        );

        CREATE TABLE IF NOT EXISTS almacen (
            id_almacen INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            ubicacion TEXT,
            responsable TEXT
        );

        CREATE TABLE IF NOT EXISTS presentacion (
            id_presentacion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_producto INTEGER NOT NULL,
            unidad TEXT NOT NULL,
            cantidad REAL NOT NULL,
            descripcion TEXT,
            FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        );

        CREATE TABLE IF NOT EXISTS producto_proveedor (
            id_prod_prov INTEGER PRIMARY KEY AUTOINCREMENT,
            id_producto INTEGER NOT NULL,
            id_proveedor INTEGER NOT NULL,
            codigo_proveedor TEXT NOT NULL,
            estado TEXT DEFAULT 'Activo',
            FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
            FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
        );

        CREATE TABLE IF NOT EXISTS factura (
            id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            fecha TEXT NOT NULL,
            id_proveedor INTEGER NOT NULL,
            total REAL,
            estado TEXT DEFAULT 'Activa',
            FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
        );

        CREATE TABLE IF NOT EXISTS movimiento (
            id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            tipo TEXT NOT NULL,
            subtipo TEXT,
            id_prod_prov INTEGER NOT NULL,
            id_presentacion INTEGER NOT NULL,
            cantidad REAL NOT NULL,
            precio_unit REAL,
            monto_total REAL,
            lote TEXT,
            fecha_venc TEXT,
            obs TEXT,
            id_factura INTEGER,
            FOREIGN KEY (id_prod_prov) REFERENCES producto_proveedor(id_prod_prov),
            FOREIGN KEY (id_presentacion) REFERENCES presentacion(id_presentacion),
            FOREIGN KEY (id_factura) REFERENCES factura(id_factura)
        );

        CREATE TABLE IF NOT EXISTS stock_almacen (
            id_stock INTEGER PRIMARY KEY AUTOINCREMENT,
            id_prod_prov INTEGER NOT NULL,
            id_presentacion INTEGER NOT NULL,
            id_almacen INTEGER NOT NULL,
            stock_actual REAL NOT NULL DEFAULT 0,
            FOREIGN KEY (id_prod_prov) REFERENCES producto_proveedor(id_prod_prov),
            FOREIGN KEY (id_presentacion) REFERENCES presentacion(id_presentacion),
            FOREIGN KEY (id_almacen) REFERENCES almacen(id_almacen)
        );
        "#
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}
