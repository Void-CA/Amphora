import { FiAlertTriangle, FiAlertCircle, FiInfo, FiCheckCircle } from "react-icons/fi";

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  count?: number;
}

interface AlertItemProps {
  alert: Alert;
}

const AlertItem = ({ alert }: AlertItemProps) => {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
          titleColor: 'text-red-800 dark:text-red-300',
          messageColor: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: <FiAlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
          titleColor: 'text-yellow-800 dark:text-yellow-300',
          messageColor: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: <FiInfo className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
          titleColor: 'text-blue-800 dark:text-blue-300',
          messageColor: 'text-blue-600 dark:text-blue-400'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: <FiCheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
          titleColor: 'text-green-800 dark:text-green-300',
          messageColor: 'text-green-600 dark:text-green-400'
        };
    }
  };

  const styles = getAlertStyles(alert.type);

  return (
    <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium text-sm ${styles.titleColor}`}>
              {alert.title}
            </h4>
            {alert.count && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white dark:bg-gray-800 ${styles.titleColor} border ${styles.border}`}>
                {alert.count}
              </span>
            )}
          </div>
          <p className={`text-xs mt-1 ${styles.messageColor}`}>
            {alert.message}
          </p>
        </div>
      </div>
    </div>
  );
};

interface InventoryAlertsProps {
  stats: {
    lowStockProducts: number;
    totalProducts: number;
    activeProducts: number;
  };
}

export function InventoryAlerts({ stats }: InventoryAlertsProps) {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // Stock bajo
    if (stats.lowStockProducts > 0) {
      alerts.push({
        id: 'low-stock',
        type: 'warning',
        title: 'Stock Bajo Detectado',
        message: `${stats.lowStockProducts} producto${stats.lowStockProducts > 1 ? 's' : ''} necesita${stats.lowStockProducts > 1 ? 'n' : ''} reabastecimiento urgente`,
        count: stats.lowStockProducts
      });
    }

    // Productos inactivos
    const inactiveProducts = stats.totalProducts - stats.activeProducts;
    if (inactiveProducts > 0) {
      alerts.push({
        id: 'inactive-products',
        type: 'info',
        title: 'Productos Inactivos',
        message: `${inactiveProducts} producto${inactiveProducts > 1 ? 's están' : ' está'} marcado${inactiveProducts > 1 ? 's' : ''} como inactivo${inactiveProducts > 1 ? 's' : ''}`,
        count: inactiveProducts
      });
    }

    // Estado general del inventario
    if (stats.totalProducts === 0) {
      alerts.push({
        id: 'empty-inventory',
        type: 'error',
        title: 'Inventario Vacío',
        message: 'No hay productos registrados en el sistema. Comienza agregando tu primer producto.'
      });
    } else if (stats.lowStockProducts === 0 && stats.totalProducts > 0) {
      alerts.push({
        id: 'good-stock',
        type: 'success',
        title: 'Stock Saludable',
        message: 'Todos los productos mantienen niveles de stock adecuados.'
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Alertas y Notificaciones</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Estado actual del inventario y acciones recomendadas</p>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
