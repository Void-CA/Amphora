// components/products/ProductStats.tsx
import { StatsSection, type StatGroup, type ChartData } from "@/components/common/StatsSection";
import { FiPackage, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";
import type { Product } from "@/types/inventory";

interface ProductStatsProps {
  products: Product[];
  lowStockProducts: Product[];
}

export function ProductStats({ products, lowStockProducts }: ProductStatsProps) {
  const activeProducts = products.filter(p => p.status === "Activo").length;
  const inactiveProducts = products.filter(p => p.status === "Inactivo").length;
  const discontinuedProducts = products.filter(p => p.status === "Descontinuado").length;
  
  const categoryStats = products.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsGroups: StatGroup[] = [
    {
      title: "Resumen General",
      description: "Métricas principales del inventario de productos",
      stats: [
        {
          id: "total",
          label: "Total Productos",
          value: products.length,
          icon: <FiPackage className="h-5 w-5" />,
          color: "blue",
          description: "Productos registrados en el sistema"
        },
        {
          id: "active",
          label: "Productos Activos",
          value: activeProducts,
          icon: <FiTrendingUp className="h-5 w-5" />,
          color: "green",
          description: "Productos disponibles para venta"
        },
        {
          id: "low-stock",
          label: "Stock Bajo",
          value: lowStockProducts.length,
          icon: <FiAlertTriangle className="h-5 w-5" />,
          color: "red",
          description: "Productos por debajo del stock mínimo"
        },
      ]
    },
    {
      title: "Estado de Productos",
      description: "Distribución por estado de actividad",
      stats: [
        {
          id: "active-detail",
          label: "Activos",
          value: activeProducts,
          color: "green",
          description: "Productos disponibles"
        },
        {
          id: "inactive-detail",
          label: "Inactivos",
          value: inactiveProducts,
          color: "yellow",
          description: "Productos temporalmente deshabilitados"
        },
        {
          id: "discontinued-detail",
          label: "Descontinuados",
          value: discontinuedProducts,
          color: "red",
          description: "Productos fuera de catálogo"
        }
      ]
    }
  ];

  const chartData: ChartData[] = [
    {
      title: "Productos por Categoría",
      description: "Distribución de productos según categoría",
      type: "histogram",
      data: Object.entries(categoryStats).map(([category, count]) => ({
        label: category,
        value: count
      }))
    }
  ];

  return <StatsSection groups={statsGroups} charts={chartData} />;
}