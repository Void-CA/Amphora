import React from "react";
import type { Product, FormField, TableColumn } from "../types";
import { DynamicSelectField } from "../components/DynamicSelectField";

// Field definitions for forms with improved grid layout
export const productFields: FormField[] = [
  { 
    name: "description", 
    label: "Descripción del Producto", 
    type: "text",
    required: true,
    placeholder: "Ej: Cámara Canon EOS 5D Mark IV",
    colSpan: 3,
    order: 1
  },
  { 
    name: "category", 
    label: "Categoría", 
    type: "select",
    required: true,
    renderInput: (value: any, onChange: (v: any) => void) => 
      React.createElement(DynamicSelectField, {
        field: 'categories',
        value: value || '',
        onChange,
        placeholder: "Seleccionar categoría...",
        required: true
      }),
    colSpan: 3,
    order: 2
  },
  { 
    name: "unit", 
    label: "Unidad de Medida", 
    type: "select",
    required: true,
    renderInput: (value: any, onChange: (v: any) => void) => 
      React.createElement(DynamicSelectField, {
        field: 'units',
        value: value || '',
        onChange,
        placeholder: "Seleccionar unidad...",
        required: true
      }),
    colSpan: 3,
    order: 3
  },
  { 
    name: "status", 
    label: "Estado del Producto", 
    type: "select",
    required: true,
    renderInput: (value: any, onChange: (v: any) => void) => 
      React.createElement(DynamicSelectField, {
        field: 'statuses',
        value: value || '',
        onChange,
        placeholder: "Seleccionar estado...",
        required: true
      }),
    colSpan: 3,
    order: 4
  },
  { 
    name: "subcategory", 
    label: "Subcategoría", 
    type: "text",
    placeholder: "Ej: Computadoras, Accesorios, Periféricos",
    colSpan: 3,
    order: 5
  },
  { 
    name: "currentStock", 
    label: "Stock Actual", 
    type: "number",
    required: true,
    placeholder: "0",
    colSpan: 1,
    order: 6
  },
  { 
    name: "minStock", 
    label: "Stock Mínimo", 
    type: "number",
    required: true,
    placeholder: "10",
    colSpan: 1,
    order: 7
  },
  { 
    name: "maxStock", 
    label: "Stock Máximo", 
    type: "number",
    required: true,
    placeholder: "100",
    colSpan: 1,
    order: 8
  }
];

// Column definitions for EntityTable
export const productColumns: TableColumn<Product>[] = [
  {
    key: "description",
    label: "Descripción",
    sortable: true
  },
  {
    key: "category",
    label: "Categoría",
    sortable: true
  },
  {
    key: "subcategory",
    label: "Subcategoría",
    sortable: true
  },
  {
    key: "unit",
    label: "Unidad",
    sortable: true
  },
  {
    key: "currentStock",
    label: "Stock Actual",
    sortable: true,
    render: (value: any, row: Product) => {
      const stockValue = Number(value);
      const minStockValue = Number(row.minStock);
      const isLowStock = stockValue <= minStockValue;
      return React.createElement(
        'span',
        { className: `font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}` },
        stockValue
      );
    }
  },
  {
    key: "minStock",
    label: "Stock Mín.",
    sortable: true
  },
  {
    key: "maxStock",
    label: "Stock Máx.",
    sortable: true
  },
  {
    key: "status",
    label: "Estado",
    sortable: true,
    render: (value: any) => {
      const statusValue = String(value);
      const statusColors = {
        "Activo": "bg-green-100 text-green-800",
        "Inactivo": "bg-gray-100 text-gray-800",
        "Stock Bajo": "bg-red-100 text-red-800",
        "Descontinuado": "bg-yellow-100 text-yellow-800"
      };
      return React.createElement(
        'span',
        { className: `px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusValue as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}` },
        statusValue
      );
    }
  }
];
