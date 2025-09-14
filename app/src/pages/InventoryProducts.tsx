import React, { useState, useEffect } from "react";
import { EntityTable } from "../components/EntityTable";
import { EntityForm } from "../components/EntityForm";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { FiPlus, FiPackage, FiAlertTriangle } from "react-icons/fi";
import type { Product } from "../db/products";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  type NewProduct
} from "../db/products";


// Form fields for product creation/editing
type FieldType = "text" | "number" | "email" | "tel" | "date" | "select";
type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

const productFormFields: FieldDef[] = [
  {
    name: "description",
    label: "Descripción",
    type: "text",
    required: true,
    placeholder: "Ingrese la descripción del producto"
  },
  {
    name: "category",
    label: "Categoría",
    type: "select",
    required: true,
    options: [
      { value: "Electrónicos", label: "Electrónicos" },
      { value: "Oficina", label: "Oficina" },
      { value: "Herramientas", label: "Herramientas" },
      { value: "Consumibles", label: "Consumibles" }
    ]
  },
  {
    name: "subcategory",
    label: "Subcategoría",
    type: "text",
    placeholder: "Ingrese la subcategoría"
  },
  {
    name: "unit",
    label: "Unidad de Medida",
    type: "select",
    required: true,
    options: [
      { value: "Unidad", label: "Unidad" },
      { value: "Caja", label: "Caja" },
      { value: "Paquete", label: "Paquete" },
      { value: "Resma", label: "Resma" },
      { value: "Litro", label: "Litro" },
      { value: "Kilogramo", label: "Kilogramo" }
    ]
  },
  {
    name: "current_stock",
    label: "Stock Actual",
    type: "number",
    required: true,
    placeholder: "0"
  },
  {
    name: "min_stock",
    label: "Stock Mínimo",
    type: "number",
    required: true,
    placeholder: "0"
  },
  {
    name: "max_stock",
    label: "Stock Máximo",
    type: "number",
    required: true,
    placeholder: "0"
  },
  {
    name: "status",
    label: "Estado",
    type: "select",
    required: true,
    options: [
      { value: "Activo", label: "Activo" },
      { value: "Inactivo", label: "Inactivo" },
      { value: "Descontinuado", label: "Descontinuado" }
    ]
  }
];

// Table columns configuration
const productColumns: Array<{
  key: keyof Product;
  label: string;
  sortable: boolean;
  render?: (value: any, row: Product) => React.ReactNode;
}> = [
  { key: "id", label: "ID", sortable: true },
  { key: "description", label: "Descripción", sortable: true },
  { key: "category", label: "Categoría", sortable: true },
  { key: "subcategory", label: "Subcategoría", sortable: true },
  { key: "unit", label: "Unidad", sortable: true },
  { 
    key: "current_stock", 
    label: "Stock Actual", 
    sortable: true,
    render: (value: number | null, row: Product) => (
      <span className={`font-medium ${
        (row.current_stock !== null && row.min_stock !== null && row.current_stock <= row.min_stock)
          ? "text-red-600 dark:text-red-400" 
          : "text-green-600 dark:text-green-400"
      }`}>
        {value ?? 0}
        {(row.current_stock !== null && row.min_stock !== null && row.current_stock <= row.min_stock) && (
          <FiAlertTriangle className="inline ml-1 w-4 h-4" />
        )}
      </span>
    )
  },
  { key: "min_stock", label: "Stock Mín.", sortable: true },
  { key: "max_stock", label: "Stock Máx.", sortable: true },
  { 
    key: "status", 
    label: "Estado", 
    sortable: true,
    render: (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === "Activo" 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : value === "Stock Bajo"
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      }`}>
        {value}
      </span>
    )
  }
];

export default function InventoryProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  // Load products from database
  const loadProducts = async () => {
    try {
      setLoading(true);
      const [allProducts, lowStock] = await Promise.all([
        getAllProducts(),
        getLowStockProducts()
      ]);
      setProducts(allProducts);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const newProductData: NewProduct = {
        description: productData.description || "",
        category: productData.category || null,
        subcategory: productData.subcategory || null,
        unit: productData.unit || "",
        current_stock: productData.current_stock || 0,
        min_stock: productData.min_stock || 0,
        max_stock: productData.max_stock || 0,
        status: productData.status || "Activo"
      };

      await createProduct(newProductData);
      await loadProducts(); // Reload products from database
      setShowProductForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      const updates: NewProduct = {
        description: productData.description || "",
        category: productData.category || null,
        subcategory: productData.subcategory || null,
        unit: productData.unit || "",
        current_stock: productData.current_stock || 0,
        min_stock: productData.min_stock || 0,
        max_stock: productData.max_stock || 0,
        status: productData.status || "Activo"
      };

      await updateProduct(editingProduct.id, updates);
      await loadProducts(); // Reload products from database
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      await loadProducts(); // Reload products from database
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const closeForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiPackage className="w-6 h-6" />
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra tu inventario de productos
          </p>
        </div>
        <Button 
          onClick={() => setShowProductForm(true)}
          className="flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <FiPackage className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productos Activos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {products.filter(p => p.status === "Activo").length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Bajo</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockProducts.length}</p>
            </div>
            <FiAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-medium text-red-800 dark:text-red-200">
              Productos con Stock Bajo
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm">
            {lowStockProducts.length} producto(s) tienen stock por debajo del mínimo requerido.
          </p>
        </div>
      )}

      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar productos por descripción, categoría o estado..."
      />

      {/* Products Table */}
      <EntityTable
        data={filteredProducts}
        columns={productColumns}
        onEdit={openEditForm}
        onDelete={handleDeleteProduct}
      />

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={closeForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={productFormFields}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={closeForm}
            initialValues={editingProduct || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}