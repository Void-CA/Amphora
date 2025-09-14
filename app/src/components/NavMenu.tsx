import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  BookOpen,
  BarChart3,
  Bell,
  HelpCircle
} from "lucide-react";
import { useTheme } from "next-themes";

// Configuración centralizada del menú
export const menuConfig = {
  mainSections: [
    {
      title: "Dashboard",
      href: "/dashboard",
      description: "Vista general de tus métricas y estado de la app.",
      icon: LayoutDashboard,
    },
    {
      title: "Inventario",
      href: "/inventory",
      description: "Gestiona productos, categorías y proveedores.",
      icon: Package,
      submenu: [
        {
          title: "Productos",
          href: "/inventory/products",
          description: "Gestiona todos los productos en stock.",
        },
        {
          title: "Categorías",
          href: "/inventory/categories",
          description: "Organiza productos por categorías.",
        },
        {
          title: "Proveedores",
          href: "/inventory/suppliers",
          description: "Administra proveedores y contactos.",
        },
      ]
    },
    {
      title: "Ventas",
      href: "/sales",
      description: "Gestión de pedidos y transacciones.",
      icon: BarChart3,
      submenu: [
        {
          title: "Pedidos",
          href: "/sales/orders",
          description: "Seguimiento de pedidos de clientes.",
        },
        {
          title: "Clientes",
          href: "/sales/customers",
          description: "Administra información de clientes.",
        },
        {
          title: "Informes",
          href: "/sales/reports",
          description: "Reportes de ventas y métricas.",
        },
      ]
    },
  ],
  
  userSections: [
    {
      title: "Notificaciones",
      href: "/notifications",
      icon: Bell,
      description: "Alertas y avisos del sistema.",
    },
    {
      title: "Configuración",
      href: "/settings",
      icon: Settings,
      description: "Ajustes de la aplicación y preferencias del usuario.",
      submenu: [
        {
          title: "Perfil",
          href: "/settings/profile",
          description: "Configura tu perfil de usuario.",
        },
        {
          title: "Preferencias",
          href: "/settings/preferences",
          description: "Personaliza la experiencia de la app.",
        },
        {
          title: "Seguridad",
          href: "/settings/security",
          description: "Configuración de seguridad y acceso.",
        },
      ]
    },
  ],
  
  helpSections: [
    {
      title: "Documentación",
      href: "/docs",
      icon: BookOpen,
      description: "Guías de uso y documentación técnica.",
    },
    {
      title: "Soporte",
      href: "/support",
      icon: HelpCircle,
      description: "Centro de ayuda y contacto técnico.",
    },
  ]
};


// Componente para ítems del menú
const MenuItem = ({ item, hasSubmenu = false }: { 
  item: any; 
  hasSubmenu?: boolean; 
}) => {
  
  return (
    <NavigationMenuItem>
      {hasSubmenu && item.submenu ? (
        <>
          <NavigationMenuTrigger className="flex items-center gap-2 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            {item.icon && <item.icon size={18} />}
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-1 lg:w-[500px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-background p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 flex items-center gap-2 text-lg font-medium text-foreground">
                      {item.icon && <item.icon size={18} />}
                      {item.title}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {item.submenu.map((subItem: any) => (
                <ListItem
                  key={subItem.title}
                  to={subItem.href}
                  title={subItem.title}
                >
                  {subItem.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <NavigationMenuLink asChild>
            <div className={navigationMenuTriggerStyle()}>
                <Link 
                    to={item.href} 
                    className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 group gap-2"
                >
                    {item.icon && <item.icon size={18} />}
                    {item.title}
                </Link>
            </div>
        </NavigationMenuLink>
      )}
    </NavigationMenuItem>
  );
};

// Componente para elementos de lista
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Componente principal de navegación
export function NavigationMenuDemo() {
  const { theme } = useTheme();
  
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-1 rounded-lg bg-background p-1 shadow-sm border">
        {/* Secciones principales */}
        {menuConfig.mainSections.map((section) => (
          <MenuItem 
            key={section.title} 
            item={section} 
            hasSubmenu={!!section.submenu}
          />
        ))}
        
        {/* Secciones de usuario */}
        {menuConfig.userSections.map((section) => (
          <MenuItem 
            key={section.title} 
            item={section} 
            hasSubmenu={!!section.submenu}
          />
        ))}
        
        {/* Secciones de ayuda */}
        {menuConfig.helpSections.map((section) => (
          <MenuItem 
            key={section.title} 
            item={section} 
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}