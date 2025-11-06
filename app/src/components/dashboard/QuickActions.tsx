import { FiPlus, FiSearch, FiBarChart, FiPackage, FiTruck, FiAlertCircle } from "react-icons/fi";

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

const QuickAction = ({ title, description, icon, onClick, color }: QuickActionProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 dark:text-green-300',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300',
    red: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:border-red-700 dark:text-red-300',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md text-left w-full ${colorClasses[color]} dark:border-gray-600`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs opacity-80">{description}</p>
        </div>
      </div>
    </button>
  );
};

interface QuickActionsProps {
  onAddProduct: () => void;
  onViewReports: () => void;
  onCheckLowStock: () => void;
}

export function QuickActions({ onAddProduct, onViewReports, onCheckLowStock }: QuickActionsProps) {
  const handleSearchProducts = () => {
    // Scroll to products table
    const productsTable = document.querySelector('[data-testid="products-table"]');
    if (productsTable) {
      productsTable.scrollIntoView({ behavior: 'smooth' });
      // Focus on search input if available
      const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 500);
      }
    }
  };

  const handleViewInventory = () => {
    // Scroll to products table
    const productsTable = document.querySelector('[data-testid="products-table"]');
    if (productsTable) {
      productsTable.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleManageSuppliers = () => {
    alert('Funcionalidad de proveedores próximamente disponible');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accesos Rápidos</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Accede rápidamente a las funciones más utilizadas</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction
          title="Agregar Producto"
          description="Registra un nuevo producto en el inventario"
          icon={<FiPlus className="h-5 w-5" />}
          onClick={onAddProduct}
          color="green"
        />
        
        <QuickAction
          title="Buscar Productos"
          description="Encuentra productos específicos rápidamente"
          icon={<FiSearch className="h-5 w-5" />}
          onClick={handleSearchProducts}
          color="blue"
        />
        
        <QuickAction
          title="Ver Inventario"
          description="Consulta todos los productos disponibles"
          icon={<FiPackage className="h-5 w-5" />}
          onClick={handleViewInventory}
          color="purple"
        />
        
        <QuickAction
          title="Stock Bajo"
          description="Revisa productos con stock crítico"
          icon={<FiAlertCircle className="h-5 w-5" />}
          onClick={onCheckLowStock}
          color="red"
        />
        
        <QuickAction
          title="Reportes"
          description="Genera reportes de inventario y ventas"
          icon={<FiBarChart className="h-5 w-5" />}
          onClick={onViewReports}
          color="indigo"
        />
        
        <QuickAction
          title="Proveedores"
          description="Gestiona información de proveedores"
          icon={<FiTruck className="h-5 w-5" />}
          onClick={handleManageSuppliers}
          color="orange"
        />
      </div>
    </div>
  );
}
