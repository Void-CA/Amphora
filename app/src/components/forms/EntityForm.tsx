import React from "react";
import type { FormField } from "@/types";
import { FormGrid, type GridFieldDef } from "./FormGrid";

type EntityFormProps<T> = {
  fields: FormField[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  onCancel: () => void;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  submitLabel?: string;
  cancelLabel?: string;
};

export function EntityForm<T extends Record<string, any>>({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  columns = 2,
  gap = "md",
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
}: EntityFormProps<T>) {
  // Convert FieldDef[] to GridFieldDef[] for compatibility
  const gridFields: GridFieldDef[] = fields.map(field => ({
    ...field,
    // Preserve colSpan from field definition, fallback to type-based default only if not specified
    colSpan: field.colSpan || (field.type === "select" ? 2 : 1),
  }));

  return (
    <FormGrid
      fields={gridFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      columns={columns}
      gap={gap}
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      className="p-4"
    />
  );
}