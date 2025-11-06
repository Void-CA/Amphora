#[cfg(test)]
mod almacen_commands_tests {
    use crate::services::almacen_service;
    use crate::models::almacen::CreateAlmacen;
    use sqlx::SqlitePool;

    async fn setup_test_db() -> SqlitePool {
        let pool = SqlitePool::connect(":memory:").await.unwrap();
        
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS almacen (
                id_almacen INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                ubicacion TEXT,
                responsable TEXT
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        pool
    }

    #[tokio::test]
    async fn test_get_almacenes_command() {
        let pool = setup_test_db().await;
        
        // Insertar datos de prueba
        sqlx::query("INSERT INTO almacen (nombre, ubicacion, responsable) VALUES (?, ?, ?)")
            .bind("Almacén 1")
            .bind("Ubicación 1")
            .bind("Responsable 1")
            .execute(&pool)
            .await
            .unwrap();

        sqlx::query("INSERT INTO almacen (nombre, ubicacion, responsable) VALUES (?, ?, ?)")
            .bind("Almacén 2")
            .bind("Ubicación 2")
            .bind("Responsable 2")
            .execute(&pool)
            .await
            .unwrap();

        let result = almacen_service::get_all(&pool).await;
        
        assert!(result.is_ok());
        let almacenes = result.unwrap();
        assert_eq!(almacenes.len(), 2);
        assert_eq!(almacenes[0].nombre, "Almacén 1");
        assert_eq!(almacenes[1].nombre, "Almacén 2");
    }

    #[tokio::test]
    async fn test_get_almacenes_empty() {
        let pool = setup_test_db().await;
        
        let result = almacen_service::get_all(&pool).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap().len(), 0);
    }

    #[tokio::test]
    async fn test_create_almacen_command() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Nuevo Almacén".to_string(),
            ubicacion: Some("Nueva Ubicación".to_string()),
            responsable: Some("Nuevo Responsable".to_string()),
        };

        let result = almacen_service::create(&pool, data).await;
        assert!(result.is_ok());
        
        let id = result.unwrap();
        assert_eq!(id, 1);

        // Verificar que se creó correctamente
        let almacen = sqlx::query_as::<_, crate::models::almacen::Almacen>(
            "SELECT * FROM almacen WHERE id_almacen = ?"
        )
        .bind(id)
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(almacen.nombre, "Nuevo Almacén");
        assert_eq!(almacen.ubicacion, Some("Nueva Ubicación".to_string()));
    }

    #[tokio::test]
    async fn test_create_almacen_minimal() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Almacén Mínimo".to_string(),
            ubicacion: None,
            responsable: None,
        };

        let result = almacen_service::create(&pool, data).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_create_almacen_error_handling() {
        let pool = setup_test_db().await;
        
        // Cerrar el pool para forzar un error
        pool.close().await;
        
        let data = CreateAlmacen {
            nombre: "Test".to_string(),
            ubicacion: None,
            responsable: None,
        };

        let result = almacen_service::create(&pool, data).await;
        assert!(result.is_err());
    }
}

#[cfg(test)]
mod factura_commands_tests {
    use crate::services::factura_service;
    use crate::models::factura::FacturaInput;
    use sqlx::SqlitePool;

    async fn setup_test_db() -> SqlitePool {
        let pool = SqlitePool::connect(":memory:").await.unwrap();
        
        // Crear tabla proveedor
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS proveedor (
                id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                contacto TEXT,
                telefono TEXT,
                email TEXT
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        sqlx::query("INSERT INTO proveedor (nombre) VALUES ('Proveedor Test')")
            .execute(&pool)
            .await
            .unwrap();

        // Crear tabla factura
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS factura (
                id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
                numero TEXT NOT NULL,
                fecha TEXT NOT NULL,
                id_proveedor INTEGER NOT NULL,
                total REAL,
                estado TEXT,
                FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        pool
    }

    #[tokio::test]
    async fn test_create_factura_command() {
        let pool = setup_test_db().await;
        
        let data = FacturaInput {
            numero: "F-001".to_string(),
            fecha: "2025-01-15".to_string(),
            id_proveedor: 1,
            total: Some(1500.50),
            estado: Some("Pendiente".to_string()),
        };

        let result = factura_service::create_factura(&pool, data).await;
        assert!(result.is_ok());
        
        let id = result.unwrap();
        assert_eq!(id, 1);

        // Verificar que se creó correctamente
        let factura = sqlx::query_as::<_, crate::models::factura::Factura>(
            "SELECT * FROM factura WHERE id_factura = ?"
        )
        .bind(id)
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(factura.numero, "F-001");
        assert_eq!(factura.fecha, "2025-01-15");
        assert_eq!(factura.id_proveedor, 1);
        assert_eq!(factura.total, Some(1500.50));
        assert_eq!(factura.estado, Some("Pendiente".to_string()));
    }

    #[tokio::test]
    async fn test_create_factura_minimal() {
        let pool = setup_test_db().await;
        
        let data = FacturaInput {
            numero: "F-002".to_string(),
            fecha: "2025-01-16".to_string(),
            id_proveedor: 1,
            total: None,
            estado: None,
        };

        let result = factura_service::create_factura(&pool, data).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_create_factura_invalid_proveedor() {
        let pool = setup_test_db().await;
        
        let data = FacturaInput {
            numero: "F-003".to_string(),
            fecha: "2025-01-17".to_string(),
            id_proveedor: 999, // ID que no existe
            total: Some(100.0),
            estado: None,
        };

        let result = factura_service::create_factura(&pool, data).await;
        // Debería fallar por violación de foreign key
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_create_factura_error_handling() {
        let pool = setup_test_db().await;
        pool.close().await;
        
        let data = FacturaInput {
            numero: "F-004".to_string(),
            fecha: "2025-01-18".to_string(),
            id_proveedor: 1,
            total: None,
            estado: None,
        };

        let result = factura_service::create_factura(&pool, data).await;
        assert!(result.is_err());
    }
}

#[cfg(test)]
mod integration_tests {
    use sqlx::SqlitePool;
    use crate::services::{almacen_service, factura_service};
    use crate::models::almacen::CreateAlmacen;
    use crate::models::factura::FacturaInput;

    async fn setup_full_db() -> SqlitePool {
        let pool = SqlitePool::connect(":memory:").await.unwrap();
        
        // Crear todas las tablas necesarias
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS almacen (
                id_almacen INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                ubicacion TEXT,
                responsable TEXT
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS proveedor (
                id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                contacto TEXT,
                telefono TEXT,
                email TEXT
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS factura (
                id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
                numero TEXT NOT NULL,
                fecha TEXT NOT NULL,
                id_proveedor INTEGER NOT NULL,
                total REAL,
                estado TEXT,
                FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
            )"
        )
        .execute(&pool)
        .await
        .unwrap();

        pool
    }

    #[tokio::test]
    async fn test_full_workflow_almacen() {
        let pool = setup_full_db().await;
        
        // 1. Verificar que está vacío
        let almacenes = almacen_service::get_all(&pool).await.unwrap();
        assert_eq!(almacenes.len(), 0);

        // 2. Crear múltiples almacenes
        let data1 = CreateAlmacen {
            nombre: "Almacén Principal".to_string(),
            ubicacion: Some("Centro".to_string()),
            responsable: Some("Juan".to_string()),
        };
        let id1 = almacen_service::create(&pool, data1).await.unwrap();

        let data2 = CreateAlmacen {
            nombre: "Almacén Secundario".to_string(),
            ubicacion: Some("Norte".to_string()),
            responsable: Some("María".to_string()),
        };
        let id2 = almacen_service::create(&pool, data2).await.unwrap();

        // 3. Verificar que se crearon
        assert_eq!(id1, 1);
        assert_eq!(id2, 2);

        // 4. Obtener todos y verificar
        let almacenes = almacen_service::get_all(&pool).await.unwrap();
        assert_eq!(almacenes.len(), 2);
        assert_eq!(almacenes[0].nombre, "Almacén Principal");
        assert_eq!(almacenes[1].nombre, "Almacén Secundario");
    }

    #[tokio::test]
    async fn test_full_workflow_factura() {
        let pool = setup_full_db().await;
        
        // Crear proveedor primero
        sqlx::query("INSERT INTO proveedor (nombre, contacto) VALUES (?, ?)")
            .bind("Proveedor ABC")
            .bind("contacto@abc.com")
            .execute(&pool)
            .await
            .unwrap();

        // Crear facturas
        let data1 = FacturaInput {
            numero: "F-001".to_string(),
            fecha: "2025-01-15".to_string(),
            id_proveedor: 1,
            total: Some(1000.0),
            estado: Some("Pendiente".to_string()),
        };
        let id1 = factura_service::create_factura(&pool, data1).await.unwrap();

        let data2 = FacturaInput {
            numero: "F-002".to_string(),
            fecha: "2025-01-16".to_string(),
            id_proveedor: 1,
            total: Some(2000.0),
            estado: Some("Pagada".to_string()),
        };
        let id2 = factura_service::create_factura(&pool, data2).await.unwrap();

        assert_eq!(id1, 1);
        assert_eq!(id2, 2);

        // Verificar que se crearon correctamente
        let count: i32 = sqlx::query_scalar("SELECT COUNT(*) FROM factura")
            .fetch_one(&pool)
            .await
            .unwrap();
        assert_eq!(count, 2);
    }
}
