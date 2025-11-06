import { useState } from "react";
import { 
  EntityTable, 
  EntityForm, 
  InventoryStats,
  QuickActions,
  InventoryAlerts,
  InventoryInsights,
  RecentActivity,
  HelpCenter
} from "../components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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

  // Handlers for new components
  const handleViewReports = () => {
    alert('Funcionalidad de reportes próximamente disponible');
  };

  const handleCheckLowStock = () => {
    if (stats.lowStockProducts > 0) {
      // Scroll to products table and potentially filter by low stock
      const productsTable = document.querySelector('[data-testid="products-table"]');
      if (productsTable) {
        productsTable.scrollIntoView({ behavior: 'smooth' });
      }
      alert(`Hay ${stats.lowStockProducts} producto${stats.lowStockProducts > 1 ? 's' : ''} con stock bajo que necesita${stats.lowStockProducts > 1 ? 'n' : ''} atención.`);
    } else {
      alert('¡Excelente! Todos los productos tienen stock adecuado.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        <InventoryStats stats={stats} />

        {/* Quick Actions */}
        <QuickActions 
          onAddProduct={handleAddProduct}
          onViewReports={handleViewReports}
          onCheckLowStock={handleCheckLowStock}
        />

        {/* Two Column Layout for Alerts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InventoryAlerts stats={stats} />
          <InventoryInsights stats={stats} />
        </div>

        {/* Bottom Section with Activity and Help */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity stats={stats} />
          <HelpCenter />
        </div>

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
