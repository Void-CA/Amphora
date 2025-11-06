import React from "react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { NavigationMenuDemo } from "@/components/layout/NavMenu";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Navbar superior */}
      <Navbar />
      
      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

// Componente Navbar
export function Navbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Logo - Corrección importante */}
      <div className="flex items-center">
        <img 
          src="logo-no-bg.png" 
          alt="Amphora" 
          className="h-7 w-7" // Añade dimensiones
          onError={(e) => {
            // Fallback si la imagen no carga
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="ml-1 text-xl font-semibold font-logo tracking-wide text-primary dark:text-amber-50 dark:font-light">
            Amphora
        </span>
 
      </div>

      {/* Menú de navegación */}
      <div className="flex-1 mx-6">
        <NavigationMenuDemo />
      </div>

      {/* Toggle de tema */}
      <ModeToggle />
    </header>
  );
}