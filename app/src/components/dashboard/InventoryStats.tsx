import { FiPackage, FiTruck, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import type { InventoryStats } from "@/hooks/useInventory";

interface InventoryStatsProps {
  stats: InventoryStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
  isAlert?: boolean;
}

const StatCard = ({ title, value, icon, color, isAlert }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const textColor = isAlert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Productos"
        value={stats.totalProducts}
        icon={<FiPackage className="h-6 w-6" />}
        color="blue"
      />
      
      <StatCard
        title="Productos Activos"
        value={stats.activeProducts}
        icon={<FiTrendingUp className="h-6 w-6" />}
        color="green"
      />
      
      <StatCard
        title="Stock Bajo"
        value={stats.lowStockProducts}
        icon={<FiAlertTriangle className="h-6 w-6" />}
        color="red"
        isAlert={stats.lowStockProducts > 0}
      />
      
      <StatCard
        title="Unidades Totales"
        value={stats.totalStockValue}
        icon={<FiTruck className="h-6 w-6" />}
        color="purple"
      />
    </div>
  );
}
