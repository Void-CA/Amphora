#[cfg(test)]
mod almacen_service_tests {
    use crate::models::almacen::{CreateAlmacen, UpdateAlmacen};
    use crate::services::almacen_service;
    use sqlx::SqlitePool;

    async fn setup_test_db() -> SqlitePool {
        let pool = SqlitePool::connect(":memory:").await.unwrap();
        
        // Crear tabla almacen
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
    async fn test_create_almacen() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Almacén Central".to_string(),
            ubicacion: Some("Av. Principal 123".to_string()),
            responsable: Some("Juan Pérez".to_string()),
        };

        let result = almacen_service::create(&pool, data).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1);
    }

    #[tokio::test]
    async fn test_get_all_almacenes() {
        let pool = setup_test_db().await;
        
        // Insertar datos de prueba
        let data1 = CreateAlmacen {
            nombre: "Almacén A".to_string(),
            ubicacion: Some("Ubicación A".to_string()),
            responsable: Some("Responsable A".to_string()),
        };
        let data2 = CreateAlmacen {
            nombre: "Almacén B".to_string(),
            ubicacion: Some("Ubicación B".to_string()),
            responsable: Some("Responsable B".to_string()),
        };

        almacen_service::create(&pool, data1).await.unwrap();
        almacen_service::create(&pool, data2).await.unwrap();

        let result = almacen_service::get_all(&pool).await;
        assert!(result.is_ok());
        
        let almacenes = result.unwrap();
        assert_eq!(almacenes.len(), 2);
        assert_eq!(almacenes[0].nombre, "Almacén A");
        assert_eq!(almacenes[1].nombre, "Almacén B");
    }

    #[tokio::test]
    async fn test_get_almacen_by_id() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Almacén Test".to_string(),
            ubicacion: Some("Test Location".to_string()),
            responsable: Some("Test Manager".to_string()),
        };

        let id = almacen_service::create(&pool, data).await.unwrap();
        let result = almacen_service::get_by_id(&pool, id as i32).await;
        
        assert!(result.is_ok());
        let almacen = result.unwrap();
        assert!(almacen.is_some());
        
        let almacen = almacen.unwrap();
        assert_eq!(almacen.nombre, "Almacén Test");
        assert_eq!(almacen.ubicacion, Some("Test Location".to_string()));
        assert_eq!(almacen.responsable, Some("Test Manager".to_string()));
    }

    #[tokio::test]
    async fn test_get_almacen_by_id_not_found() {
        let pool = setup_test_db().await;
        
        let result = almacen_service::get_by_id(&pool, 999).await;
        assert!(result.is_ok());
        assert!(result.unwrap().is_none());
    }

    #[tokio::test]
    async fn test_update_almacen() {
        let pool = setup_test_db().await;
        
        // Crear almacén
        let data = CreateAlmacen {
            nombre: "Almacén Original".to_string(),
            ubicacion: Some("Ubicación Original".to_string()),
            responsable: Some("Responsable Original".to_string()),
        };
        let id = almacen_service::create(&pool, data).await.unwrap() as i32;

        // Actualizar almacén
        let update_data = UpdateAlmacen {
            nombre: Some("Almacén Actualizado".to_string()),
            ubicacion: Some("Nueva Ubicación".to_string()),
            responsable: None,
        };
        
        let result = almacen_service::update(&pool, id, update_data).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1);

        // Verificar actualización
        let almacen = almacen_service::get_by_id(&pool, id).await.unwrap().unwrap();
        assert_eq!(almacen.nombre, "Almacén Actualizado");
        assert_eq!(almacen.ubicacion, Some("Nueva Ubicación".to_string()));
        assert_eq!(almacen.responsable, Some("Responsable Original".to_string()));
    }

    #[tokio::test]
    async fn test_update_almacen_partial() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Almacén Test".to_string(),
            ubicacion: Some("Ubicación Test".to_string()),
            responsable: Some("Manager Test".to_string()),
        };
        let id = almacen_service::create(&pool, data).await.unwrap() as i32;

        // Actualizar solo el nombre
        let update_data = UpdateAlmacen {
            nombre: Some("Nuevo Nombre".to_string()),
            ubicacion: None,
            responsable: None,
        };
        
        almacen_service::update(&pool, id, update_data).await.unwrap();

        let almacen = almacen_service::get_by_id(&pool, id).await.unwrap().unwrap();
        assert_eq!(almacen.nombre, "Nuevo Nombre");
        assert_eq!(almacen.ubicacion, Some("Ubicación Test".to_string()));
        assert_eq!(almacen.responsable, Some("Manager Test".to_string()));
    }

    #[tokio::test]
    async fn test_delete_almacen() {
        let pool = setup_test_db().await;
        
        let data = CreateAlmacen {
            nombre: "Almacén a Eliminar".to_string(),
            ubicacion: None,
            responsable: None,
        };
        let id = almacen_service::create(&pool, data).await.unwrap() as i32;

        // Verificar que existe
        let almacen = almacen_service::get_by_id(&pool, id).await.unwrap();
        assert!(almacen.is_some());

        // Eliminar
        let result = almacen_service::delete(&pool, id).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1);

        // Verificar que ya no existe
        let almacen = almacen_service::get_by_id(&pool, id).await.unwrap();
        assert!(almacen.is_none());
    }

    #[tokio::test]
    async fn test_delete_almacen_not_found() {
        let pool = setup_test_db().await;
        
        let result = almacen_service::delete(&pool, 999).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 0);
    }
}

#[cfg(test)]
mod factura_service_tests {
    use crate::models::factura::{FacturaInput, FacturaUpdate};
    use crate::services::factura_service;
    use sqlx::SqlitePool;

    async fn setup_test_db() -> SqlitePool {
        let pool = SqlitePool::connect(":memory:").await.unwrap();
        
        // Crear tabla proveedor (necesaria para foreign key)
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

        // Insertar proveedor de prueba
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
    async fn test_create_factura() {
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
        assert_eq!(result.unwrap(), 1);
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
    async fn test_update_factura() {
        let pool = setup_test_db().await;
        
        // Crear factura
        let data = FacturaInput {
            numero: "F-003".to_string(),
            fecha: "2025-01-17".to_string(),
            id_proveedor: 1,
            total: Some(1000.0),
            estado: Some("Pendiente".to_string()),
        };
        let id = factura_service::create_factura(&pool, data).await.unwrap() as i32;

        // Actualizar factura
        let update_data = FacturaUpdate {
            numero: Some("F-003-MOD".to_string()),
            fecha: None,
            id_proveedor: None,
            total: Some(1200.0),
            estado: Some("Pagada".to_string()),
        };
        
        let result = factura_service::update_factura(&pool, id, update_data).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1);

        // Verificar actualización
        let factura = sqlx::query_as::<_, crate::models::factura::Factura>(
            "SELECT * FROM factura WHERE id_factura = ?"
        )
        .bind(id)
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(factura.numero, "F-003-MOD");
        assert_eq!(factura.fecha, "2025-01-17");
        assert_eq!(factura.total, Some(1200.0));
        assert_eq!(factura.estado, Some("Pagada".to_string()));
    }

    #[tokio::test]
    async fn test_update_factura_partial() {
        let pool = setup_test_db().await;
        
        let data = FacturaInput {
            numero: "F-004".to_string(),
            fecha: "2025-01-18".to_string(),
            id_proveedor: 1,
            total: Some(500.0),
            estado: Some("Pendiente".to_string()),
        };
        let id = factura_service::create_factura(&pool, data).await.unwrap() as i32;

        // Actualizar solo el estado
        let update_data = FacturaUpdate {
            estado: Some("Pagada".to_string()),
            ..Default::default()
        };
        
        factura_service::update_factura(&pool, id, update_data).await.unwrap();

        let factura = sqlx::query_as::<_, crate::models::factura::Factura>(
            "SELECT * FROM factura WHERE id_factura = ?"
        )
        .bind(id)
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(factura.numero, "F-004");
        assert_eq!(factura.total, Some(500.0));
        assert_eq!(factura.estado, Some("Pagada".to_string()));
    }

    #[tokio::test]
    async fn test_update_factura_not_found() {
        let pool = setup_test_db().await;
        
        let update_data = FacturaUpdate {
            estado: Some("Pagada".to_string()),
            ..Default::default()
        };
        
        let result = factura_service::update_factura(&pool, 999, update_data).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 0);
    }
}
