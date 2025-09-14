// Inventory-related types based on database schema

export interface Product {
  id: number;
  description: string;
  category: string;
  subcategory: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
}

export interface Supplier {
  id: number;
  taxId: string; // RUC/CI
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  manager: string;
}

export interface WarehouseStock {
  id: number;
  productId: number;
  warehouseId: number;
  currentStock: number;
}

// Movement types based on schema enums
export type EntryType = "Purchase" | "Return" | "Adjustment+";
export type ExitType = "Sale" | "Consumption" | "Transfer" | "Adjustment-";
export type MovementType = EntryType | ExitType;

export interface Movement {
  id: number;
  date: string; // ISO string
  time: string; // HH:mm:ss
  type: MovementType;
  docRef?: string;
  productId: number;
  supplierId: number;
  userId: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  batch?: string;
  expiryDate?: string;
  notes?: string;
}

// Form field definition type
export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validate?: (value: string) => string | null;
  renderInput?: (value: any, onChange: (v: any) => void) => React.ReactNode;
  // Grid-specific properties
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  order?: number;
  breakpoint?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
}

// Table column definition type
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Entity table props
export interface EntityTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
}

// Entity form props
export interface EntityFormProps<T> {
  fields: FormField[];
  onSubmit: (data: T) => void;
  onCancel: () => void;
  defaultData?: T;
  submitLabel?: string;
}
