import React, { useState, useEffect } from "react";

type FieldType = "text" | "number" | "email" | "tel" | "date" | "select";

export interface GridFieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validate?: (value: string) => string | null;
  renderInput?: (value: any, onChange: (v: any) => void) => React.ReactNode;
  // Grid-specific properties
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12; // Bootstrap-like column spans
  order?: number; // Field order in the grid
  breakpoint?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
}

interface FormGridProps<T> {
  fields: GridFieldDef[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  onCancel: () => void;
  columns?: 1 | 2 | 3 | 4; // Number of columns in the grid
  gap?: "sm" | "md" | "lg"; // Gap between fields
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export function FormGrid<T extends Record<string, any>>({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  columns = 2,
  gap = "md",
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  className = "",
}: FormGridProps<T>) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues((prev) => {
      if (Object.keys(prev).length === 0) {
        const initial: Record<string, string> = {};
        fields.forEach((f) => {
          const val = initialValues[f.name];
          initial[f.name] = val !== undefined && val !== null ? String(val) : "";
        });
        return initial;
      }
      return prev;
    });
  }, [initialValues, fields]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      const v = values[f.name] ?? "";
      
      // Required field validation
      if (f.required && !v.trim()) {
        newErrors[f.name] = `${f.label} es requerido`;
        return;
      }
      
      // Type validation
      if (f.type === "number" && v && isNaN(Number(v))) {
        newErrors[f.name] = `${f.label} debe ser un número`;
      }
      
      if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        newErrors[f.name] = `${f.label} debe ser un email válido`;
      }
      
      // Custom validation
      if (f.validate) {
        const custom = f.validate(v);
        if (custom) newErrors[f.name] = custom;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setValues((old) => ({ ...old, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((old) => ({ ...old, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Parse values according to their types
    const parsed: Record<string, any> = {};
    fields.forEach((f) => {
      const value = values[f.name];
      if (f.type === "number") {
        parsed[f.name] = value === "" ? null : Number(value);
      } else {
        parsed[f.name] = value;
      }
    });
    onSubmit(parsed as T);
  };

  // Generate grid classes based on columns
  const getGridClasses = () => {
    const gapClasses = {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
    };
    
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    };
    
    return `grid ${columnClasses[columns]} ${gapClasses[gap]}`;
  };

  // Get column span classes for individual fields
  const getFieldClasses = (field: GridFieldDef) => {
    if (!field.colSpan && !field.breakpoint) return "";
    
    let classes = "";
    
    // Default column span
    if (field.colSpan) {
      const spanMap = {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        6: "col-span-6",
        12: "col-span-full",
      };
      classes += spanMap[field.colSpan];
    }
    
    // Responsive breakpoints
    if (field.breakpoint) {
      if (field.breakpoint.sm) classes += ` sm:col-span-${field.breakpoint.sm}`;
      if (field.breakpoint.md) classes += ` md:col-span-${field.breakpoint.md}`;
      if (field.breakpoint.lg) classes += ` lg:col-span-${field.breakpoint.lg}`;
    }
    
    return classes;
  };

  // Sort fields by order if specified
  const sortedFields = [...fields].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return 0;
  });

  const renderField = (field: GridFieldDef) => {
    const fieldValue = values[field.name] ?? "";
    const fieldError = errors[field.name];
    
    return (
      <div key={field.name} className={getFieldClasses(field)}>
        <label 
          htmlFor={field.name} 
          className="block text-sm font-semibold text-gray-800 mb-3"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.renderInput ? (
          field.renderInput(fieldValue, (v) => handleChange(field.name, v))
        ) : field.type === "select" ? (
          <select
            id={field.name}
            value={fieldValue}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              fieldError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type === "number" ? "text" : field.type}
            value={fieldValue}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 hover:shadow-md
              ${fieldError ? "border-red-400 focus:ring-red-500 bg-red-50" : "border-gray-300"}
            `}
          />
        )}
        
        {fieldError && (
          <p className="text-red-600 text-sm mt-1">{fieldError}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className={getGridClasses()}>
        {sortedFields.map(renderField)}
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
