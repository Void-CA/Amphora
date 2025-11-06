import React from "react";
import type { Product, FormField, TableColumn } from "../types";
import { DynamicSelectField } from "../components";

// Field definitions for forms with improved grid layout
export const productFields: FormField[] = [
  { 
    name: "codigo_interno", 
    label: "Código Interno", 
    type: "text",
    required: true,
    placeholder: "Ej: PROD-001",
    colSpan: 2,
    order: 1
  },
  { 
    name: "descripcion", 
    label: "Descripción del Producto", 
    type: "text",
    required: true,
    placeholder: "Ej: Cámara Canon EOS 5D Mark IV",
    colSpan: 4,
    order: 2
  },
  { 
    name: "categoria", 
    label: "Categoría", 
    type: "select",
    required: false,
    renderInput: (value: any, onChange: (v: any) => void) => 
      React.createElement(DynamicSelectField, {
        field: 'categories',
        value: value || '',
        onChange,
        placeholder: "Seleccionar categoría...",
        required: false
      }),
    colSpan: 3,
    order: 3
  },
  { 
    name: "estado", 
    label: "Estado del Producto",   
    type: "select",
    required: false,
    renderInput: (value: any, onChange: (v: any) => void) => 
      React.createElement(DynamicSelectField, {
        field: 'statuses',
        value: value || '',
        onChange,
        placeholder: "Seleccionar estado...",
        required: false
      }),
    colSpan: 3,
    order: 2
  },
  { 
    name: "subcategoria", 
    label: "Subcategoría (Opcional)", 
    type: "text",
    placeholder: "Ej: Cámaras DSLR",
    colSpan: 3,
    order: 4
  }
];

// Column definitions for EntityTable
export const productColumns: TableColumn<Product>[] = [
  {
    key: "id_producto",
    label: "ID",
    sortable: true
  },
  {
    key: "codigo_interno",
    label: "Código Interno",
    sortable: true
  },
  {
    key: "descripcion",
    label: "Descripción",
    sortable: true
  },
  {
    key: "categoria",
    label: "Categoría",
    sortable: true
  },
  {
    key: "subcategoria",
    label: "Subcategoría",
    sortable: true
  },
  {
    key: "estado",
    label: "Estado",
    sortable: true,
    render: (value: any) => {
      const statusValue = String(value || 'Activo');
      const statusColors = {
        "Activo": "bg-green-100 text-green-800",
        "Inactivo": "bg-gray-100 text-gray-800",
        "Stock Bajo": "bg-red-100 text-red-800",
        "Descontinuado": "bg-gray-200 text-gray-800"
      };
      return React.createElement(
        'span',
        { 
          className: `px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[statusValue as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
          }` 
        },
        statusValue
      );
    }
  }
];
