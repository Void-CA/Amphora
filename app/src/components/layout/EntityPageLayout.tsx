import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiPlus, FiBarChart, FiSettings, FiDatabase } from 'react-icons/fi';

interface EntityPageLayoutProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  totalCount?: number;
  onAddNew?: () => void;
  addButtonLabel?: string;
  children: {
    table: React.ReactNode;
    stats?: React.ReactNode;
    settings?: React.ReactNode;
  };
  tabs?: {
    showStats?: boolean;
    showSettings?: boolean;
    customTabs?: Array<{
      id: string;
      label: string;
      icon?: React.ReactNode;
      content: React.ReactNode;
    }>;
  };
}

export function EntityPageLayout({
  title,
  description,
  icon = <FiDatabase className="h-6 w-6" />,
  totalCount,
  onAddNew,
  addButtonLabel = "Agregar",
  children,
  tabs = { showStats: true, showSettings: false }
}: EntityPageLayoutProps) {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {description}
              </p>
            </div>
          </div>
          {totalCount !== undefined && (
            <Badge variant="secondary" className="ml-4">
              {totalCount} total
            </Badge>
          )}
        </div>
        
        {onAddNew && (
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <FiPlus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="main" className="flex items-center gap-2">
            <FiDatabase className="h-4 w-4" />
            Gestión
          </TabsTrigger>
          
          {tabs.showStats && (
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <FiBarChart className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          )}
          
          {tabs.showSettings && (
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <FiSettings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          )}
          
          {tabs.customTabs?.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Main Content Tab */}
        <TabsContent value="main" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {children.table}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        {tabs.showStats && (
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiBarChart className="h-5 w-5" />
                  Estadísticas y Métricas
                </CardTitle>
                <CardDescription>
                  Análisis detallado y métricas de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {children.stats || (
                  <div className="text-center py-8 text-gray-500">
                    <FiBarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Estadísticas no disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Settings Tab */}
        {tabs.showSettings && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiSettings className="h-5 w-5" />
                  Configuración
                </CardTitle>
                <CardDescription>
                  Ajustes y preferencias para este módulo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {children.settings || (
                  <div className="text-center py-8 text-gray-500">
                    <FiSettings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configuración no disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Custom Tabs */}
        {tabs.customTabs?.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
