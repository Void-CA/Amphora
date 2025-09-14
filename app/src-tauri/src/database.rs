use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: i64,
    pub description: String,
    pub category: Option<String>,
    pub subcategory: Option<String>,
    pub unit: String,
    pub current_stock: Option<f64>,
    pub min_stock: Option<f64>,
    pub max_stock: Option<f64>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct NewProduct {
    pub description: String,
    pub category: Option<String>,
    pub subcategory: Option<String>,
    pub unit: String,
    pub current_stock: Option<f64>,
    pub min_stock: Option<f64>,
    pub max_stock: Option<f64>,
    pub status: Option<String>,
}

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        let db = Database { conn };
        db.create_tables()?;
        db.seed_data()?;
        Ok(db)
    }

    fn create_tables(&self) -> Result<()> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS Product (
                Product_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Description TEXT NOT NULL,
                Category TEXT,
                Subcategory TEXT,
                Unit TEXT NOT NULL,
                Current_Stock REAL,
                Min_Stock REAL,
                Max_Stock REAL,
                Status TEXT
            )",
            [],
        )?;
        Ok(())
    }

    pub fn get_all_products(&self) -> Result<Vec<Product>> {
        let mut stmt = self.conn.prepare(
            "SELECT Product_ID, Description, Category, Subcategory, Unit, 
                    Current_Stock, Min_Stock, Max_Stock, Status 
             FROM Product"
        )?;

        let product_iter = stmt.query_map([], |row| {
            Ok(Product {
                id: row.get(0)?,
                description: row.get(1)?,
                category: row.get(2)?,
                subcategory: row.get(3)?,
                unit: row.get(4)?,
                current_stock: row.get(5)?,
                min_stock: row.get(6)?,
                max_stock: row.get(7)?,
                status: row.get(8)?,
            })
        })?;

        let mut products = Vec::new();
        for product in product_iter {
            products.push(product?);
        }
        Ok(products)
    }

    pub fn create_product(&self, product: NewProduct) -> Result<Product> {
        self.conn.execute(
            "INSERT INTO Product (Description, Category, Subcategory, Unit, 
                                Current_Stock, Min_Stock, Max_Stock, Status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                product.description,
                product.category,
                product.subcategory,
                product.unit,
                product.current_stock,
                product.min_stock,
                product.max_stock,
                product.status
            ],
        )?;

        let id = self.conn.last_insert_rowid();
        self.get_product_by_id(id)
    }

    pub fn get_product_by_id(&self, id: i64) -> Result<Product> {
        let mut stmt = self.conn.prepare(
            "SELECT Product_ID, Description, Category, Subcategory, Unit, 
                    Current_Stock, Min_Stock, Max_Stock, Status 
             FROM Product WHERE Product_ID = ?1"
        )?;

        stmt.query_row([id], |row| {
            Ok(Product {
                id: row.get(0)?,
                description: row.get(1)?,
                category: row.get(2)?,
                subcategory: row.get(3)?,
                unit: row.get(4)?,
                current_stock: row.get(5)?,
                min_stock: row.get(6)?,
                max_stock: row.get(7)?,
                status: row.get(8)?,
            })
        })
    }

    pub fn update_product(&self, id: i64, product: NewProduct) -> Result<Product> {
        self.conn.execute(
            "UPDATE Product SET Description = ?1, Category = ?2, Subcategory = ?3, 
                              Unit = ?4, Current_Stock = ?5, Min_Stock = ?6, 
                              Max_Stock = ?7, Status = ?8
             WHERE Product_ID = ?9",
            params![
                product.description,
                product.category,
                product.subcategory,
                product.unit,
                product.current_stock,
                product.min_stock,
                product.max_stock,
                product.status,
                id
            ],
        )?;

        self.get_product_by_id(id)
    }

    pub fn delete_product(&self, id: i64) -> Result<bool> {
        let changes = self.conn.execute(
            "DELETE FROM Product WHERE Product_ID = ?1",
            [id],
        )?;
        Ok(changes > 0)
    }

    pub fn get_low_stock_products(&self) -> Result<Vec<Product>> {
        let mut stmt = self.conn.prepare(
            "SELECT Product_ID, Description, Category, Subcategory, Unit, 
                    Current_Stock, Min_Stock, Max_Stock, Status 
             FROM Product 
             WHERE Current_Stock IS NOT NULL AND Min_Stock IS NOT NULL 
                   AND Current_Stock <= Min_Stock"
        )?;

        let product_iter = stmt.query_map([], |row| {
            Ok(Product {
                id: row.get(0)?,
                description: row.get(1)?,
                category: row.get(2)?,
                subcategory: row.get(3)?,
                unit: row.get(4)?,
                current_stock: row.get(5)?,
                min_stock: row.get(6)?,
                max_stock: row.get(7)?,
                status: row.get(8)?,
            })
        })?;

        let mut products = Vec::new();
        for product in product_iter {
            products.push(product?);
        }
        Ok(products)
    }

    fn seed_data(&self) -> Result<()> {
        // Check if data already exists
        let mut stmt = self.conn.prepare("SELECT COUNT(*) FROM Product")?;
        let count: i64 = stmt.query_row([], |row| row.get(0))?;
        
        if count == 0 {
            // Insert sample products
            let sample_products = vec![
                ("Laptop Dell Inspiron 15", Some("Electrónicos"), Some("Computadoras"), "Unidad", Some(25.0), Some(10.0), Some(50.0), Some("Activo")),
                ("Mouse Inalámbrico Logitech", Some("Electrónicos"), Some("Accesorios"), "Unidad", Some(5.0), Some(15.0), Some(100.0), Some("Stock Bajo")),
                ("Papel Bond A4", Some("Oficina"), Some("Papelería"), "Resma", Some(45.0), Some(20.0), Some(80.0), Some("Activo")),
                ("Teclado Mecánico RGB", Some("Electrónicos"), Some("Accesorios"), "Unidad", Some(12.0), Some(8.0), Some(30.0), Some("Activo")),
                ("Monitor 24 pulgadas", Some("Electrónicos"), Some("Monitores"), "Unidad", Some(3.0), Some(5.0), Some(20.0), Some("Stock Bajo")),
            ];

            for product in sample_products {
                self.conn.execute(
                    "INSERT INTO Product (Description, Category, Subcategory, Unit, Current_Stock, Min_Stock, Max_Stock, Status)
                     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                    params![product.0, product.1, product.2, product.3, product.4, product.5, product.6, product.7],
                )?;
            }
        }
        
        Ok(())
    }
}
