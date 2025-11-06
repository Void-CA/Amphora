import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPackage, FiPieChart, FiActivity } from "react-icons/fi";

interface InsightCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
}

const InsightCard = ({ title, value, description, icon, trend, color }: InsightCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    orange: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <FiTrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <FiTrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${iconColorClasses[color]}`}>
          {icon}
        </div>
        {getTrendIcon()}
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

interface InventoryInsightsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalStockValue: number;
  };
}

export function InventoryInsights({ stats }: InventoryInsightsProps) {
  // Calcular métricas adicionales
  const stockHealthPercentage = stats.totalProducts > 0 
    ? Math.round(((stats.totalProducts - stats.lowStockProducts) / stats.totalProducts) * 100)
    : 100;

  const activeProductsPercentage = stats.totalProducts > 0
    ? Math.round((stats.activeProducts / stats.totalProducts) * 100)
    : 0;

  const averageStockPerProduct = stats.totalProducts > 0
    ? Math.round(stats.totalStockValue / stats.totalProducts)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Análisis de Inventario</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Métricas clave y tendencias de tu inventario</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          title="Salud del Stock"
          value={`${stockHealthPercentage}%`}
          description={`${stats.totalProducts - stats.lowStockProducts} de ${stats.totalProducts} productos con stock adecuado`}
          icon={<FiActivity className="h-5 w-5" />}
          trend={stockHealthPercentage >= 80 ? 'up' : stockHealthPercentage >= 60 ? 'neutral' : 'down'}
          color="green"
        />
        
        <InsightCard
          title="Productos Activos"
          value={`${activeProductsPercentage}%`}
          description={`${stats.activeProducts} productos están activos en el sistema`}
          icon={<FiPackage className="h-5 w-5" />}
          trend={activeProductsPercentage >= 90 ? 'up' : 'neutral'}
          color="blue"
        />
        
        <InsightCard
          title="Stock Promedio"
          value={averageStockPerProduct}
          description="Unidades promedio por producto en inventario"
          icon={<FiPieChart className="h-5 w-5" />}
          color="purple"
        />
        
        <InsightCard
          title="Diversidad"
          value={stats.totalProducts}
          description="Diferentes productos en tu catálogo"
          icon={<FiTrendingUp className="h-5 w-5" />}
          trend={stats.totalProducts > 50 ? 'up' : stats.totalProducts > 20 ? 'neutral' : 'down'}
          color="indigo"
        />
        
        <InsightCard
          title="Valor Total"
          value={`${stats.totalStockValue.toLocaleString()} u`}
          description="Unidades totales en inventario"
          icon={<FiDollarSign className="h-5 w-5" />}
          color="orange"
        />
        
        <InsightCard
          title="Eficiencia"
          value={stats.lowStockProducts === 0 ? "Óptima" : "Mejorable"}
          description={stats.lowStockProducts === 0 
            ? "Sin productos con stock crítico" 
            : `${stats.lowStockProducts} productos necesitan atención`}
          icon={<FiActivity className="h-5 w-5" />}
          trend={stats.lowStockProducts === 0 ? 'up' : 'down'}
          color="green"
        />
      </div>
    </div>
  );
}
