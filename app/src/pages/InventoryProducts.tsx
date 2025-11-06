// pages/InventoryProducts.tsx
import { useState } from "react";
import { EntityPageLayout } from "@/components/layout/EntityPageLayout";
import { ProductFormDialog } from "@/components/forms/ProductFormDialog";
import { FiPackage } from "react-icons/fi";
import type { Product } from "@/types";
import { productFields } from "@/config/productConfig";

// Componentes y hooks
import { useProducts } from "@/hooks/useProducts";
import { ProductStats } from "@/components/by_models/products/ProductStats";
import { ProductTable } from "@/components/by_models/products/ProductTable";
import { ProductLoading } from "@/components/by_models/products/ProductLoading";
import { useStocks } from "@/hooks/useStocks";

export default function InventoryProducts() {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts();


  const { lowStockProducts } = useStocks();
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      // Aseguramos que los campos requeridos estén presentes
      const productData: Omit<Product, 'id_producto'> = {
        codigo_interno: formData.codigo_interno || '',
        descripcion: formData.descripcion || '',
        categoria: formData.categoria || null,
        subcategoria: formData.subcategoria || null,
        estado: formData.estado || 'Activo'
      };

      if (editingProduct) {
        // Para actualizar, usamos el id_producto del producto que estamos editando
        await updateProduct(editingProduct.id_producto, productData);
      } else {
        // Para crear un nuevo producto, enviamos los datos validados
        await addProduct(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
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
    return <ProductLoading />;
  }

  // Contenido de la tabla
  const tableContent = (
    <ProductTable
      products={products}
      lowStockProducts={lowStockProducts}
      onEdit={openEditForm}
      onDelete={deleteProduct}
    />
  );

  // Contenido de estadísticas
  const statsContent = (
    <ProductStats products={products} lowStockProducts={lowStockProducts} />
  );

  return (
    <>
      <EntityPageLayout
        title="Gestión de Productos"
        description="Administra tu inventario de productos de manera eficiente"
        icon={<FiPackage className="h-6 w-6" />}
        totalCount={products.length}
        onAddNew={() => setShowProductForm(true)}
        addButtonLabel="Nuevo Producto"
        tabs={{ 
          showStats: true,
          showSettings: false,
          customTabs: [
            {
              id: "presentations",
              label: "Presentaciones",
              icon: <FiPackage className="h-5 w-5" />,
              content: tableContent
            }
          ]
        }}
      >
        {{
          table: tableContent,
          stats: statsContent
        }}
      </EntityPageLayout>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={showProductForm}
        onOpenChange={setShowProductForm}
        editingProduct={editingProduct}
        onSubmit={handleFormSubmit}
        fields={productFields}
      />
    </>
  );
}