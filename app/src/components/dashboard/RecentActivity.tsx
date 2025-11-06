import { FiPlus, FiEdit3, FiTrash2, FiClock, FiUser } from "react-icons/fi";

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityItemProps {
  activity: ActivityItem;
}

const ActivityItemComponent = ({ activity }: ActivityItemProps) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'create':
        return <FiPlus className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'update':
        return <FiEdit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'delete':
        return <FiTrash2 className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'update':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'delete':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {activity.title}
            </h4>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
              <FiClock className="h-3 w-3 mr-1" />
              {activity.timestamp}
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
          {activity.user && (
            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <FiUser className="h-3 w-3 mr-1" />
              {activity.user}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RecentActivityProps {
  stats: {
    totalProducts: number;
  };
}

export function RecentActivity({ stats }: RecentActivityProps) {
  // Generar actividades de ejemplo basadas en el estado actual
  const generateMockActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    if (stats.totalProducts > 0) {
      activities.push(
        {
          id: '1',
          type: 'create',
          title: 'Producto agregado',
          description: 'Se agregó un nuevo producto al inventario',
          timestamp: 'Hace 2 horas',
          user: 'Usuario'
        },
        {
          id: '2',
          type: 'update',
          title: 'Stock actualizado',
          description: 'Se actualizó el stock de varios productos',
          timestamp: 'Hace 4 horas',
          user: 'Sistema'
        },
        {
          id: '3',
          type: 'create',
          title: 'Nuevo proveedor',
          description: 'Se registró un nuevo proveedor en el sistema',
          timestamp: 'Ayer',
          user: 'Usuario'
        }
      );
    } else {
      activities.push({
        id: '1',
        type: 'create',
        title: 'Sistema inicializado',
        description: 'El sistema de inventario está listo para usar',
        timestamp: 'Hoy',
        user: 'Sistema'
      });
    }

    return activities;
  };

  const activities = generateMockActivities();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Actividad Reciente</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Últimas acciones realizadas en el sistema</p>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItemComponent key={activity.id} activity={activity} />
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <FiClock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay actividad reciente</p>
        </div>
      )}
    </div>
  );
}
