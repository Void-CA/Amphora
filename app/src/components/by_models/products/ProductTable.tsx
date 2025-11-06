// components/products/ProductTable.tsx
import { EntityTable } from "@/components";
import { FiAlertTriangle } from "react-icons/fi";
import type { Product } from "@/types/inventory";
import { productColumns } from "@/config/productConfig";

interface ProductTableProps {
  products: Product[];
  lowStockProducts: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, lowStockProducts, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="space-y-4">
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
            {lowStockProducts.length} producto(s) tienen stock por debajo del stock mínimo.
          </p>
        </div>
      )}
      
      {/* Products Table */}
      <EntityTable
        enableSearch={true}
        enableColumnToggle={true}
        title="Lista de Productos"
        data={products}
        columns={productColumns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}