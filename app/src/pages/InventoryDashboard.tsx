import { useState } from "react";
import { EntityTable } from "../components/EntityTable";
import { EntityForm } from "../components/EntityForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { FiPackage, FiTruck, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { useInventory } from "../hooks/useInventory";
import { useDynamicOptions } from "../hooks/useDynamicOptions";
import { productFields, productColumns } from "../config/productConfig";
import type { Product } from "../types";

export default function InventoryDashboard() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Use the inventory hook for all data operations
  const {
    products,
    loading,
    stats,
    addProduct,
    updateProduct,
    deleteProduct
  } = useInventory();

  // Initialize dynamic options
  const { loading: optionsLoading } = useDynamicOptions();

  // Product CRUD operations
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveProduct = async (formData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Inventario
          </h1>
          <p className="text-gray-600">
            Gestiona tu inventario de manera eficiente y organizada
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unidades Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStockValue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTruck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <EntityTable
          data={products}
          columns={productColumns}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
          title="Productos"
          addLabel="Agregar Producto"
          pageSize={10}
          enableSearch={true}
          enableColumnToggle={true}
        />

        {/* Product Form Dialog */}
        <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <EntityForm
              fields={productFields}
              initialValues={editingProduct || undefined}
              onSubmit={handleSaveProduct}
              onCancel={() => setShowProductForm(false)}
              columns={3}
              gap="md"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
