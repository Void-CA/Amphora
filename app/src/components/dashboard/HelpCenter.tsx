import { FiHelpCircle, FiBook, FiMessageCircle, FiExternalLink } from "react-icons/fi";

interface HelpItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
}

const HelpItem = ({ title, description, icon, action, onClick }: HelpItemProps) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{description}</p>
          <button
            onClick={onClick}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
          >
            {action}
            <FiExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export function HelpCenter() {
  const handleGetStarted = () => {
    alert('Guía de inicio rápido:\n\n1. Agrega tu primer producto usando el botón "Agregar Producto"\n2. Completa la información básica (nombre, código, stock)\n3. Usa los accesos rápidos para navegar rápidamente\n4. Revisa las alertas para mantener tu inventario saludable');
  };

  const handleViewTutorials = () => {
    alert('Tutoriales disponibles:\n\n• Cómo agregar productos\n• Gestión de stock\n• Interpretación de métricas\n• Configuración de alertas\n• Generación de reportes');
  };

  const handleContactSupport = () => {
    alert('Soporte técnico:\n\nPara obtener ayuda adicional, puedes:\n• Consultar la documentación\n• Contactar al equipo de soporte\n• Revisar las preguntas frecuentes');
  };

  const handleViewShortcuts = () => {
    alert('Atajos de teclado:\n\n• Ctrl + N: Agregar nuevo producto\n• Ctrl + F: Buscar productos\n• Ctrl + R: Actualizar datos\n• Esc: Cerrar diálogos\n• Tab: Navegar entre campos');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Centro de Ayuda</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Recursos y guías para aprovechar al máximo tu inventario</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HelpItem
          title="Guía de Inicio"
          description="Aprende los conceptos básicos para comenzar a usar el sistema"
          icon={<FiBook className="h-5 w-5" />}
          action="Ver guía"
          onClick={handleGetStarted}
        />
        
        <HelpItem
          title="Tutoriales"
          description="Videos y guías paso a paso para funciones específicas"
          icon={<FiHelpCircle className="h-5 w-5" />}
          action="Ver tutoriales"
          onClick={handleViewTutorials}
        />
        
        <HelpItem
          title="Atajos de Teclado"
          description="Acelera tu trabajo con combinaciones de teclas útiles"
          icon={<FiExternalLink className="h-5 w-5" />}
          action="Ver atajos"
          onClick={handleViewShortcuts}
        />
        
        <HelpItem
          title="Soporte Técnico"
          description="Obtén ayuda personalizada de nuestro equipo de soporte"
          icon={<FiMessageCircle className="h-5 w-5" />}
          action="Contactar"
          onClick={handleContactSupport}
        />
      </div>
    </div>
  );
}
