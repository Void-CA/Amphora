
export interface Product {
  id_producto: number;
  codigo_interno: string;
  descripcion: string;
  categoria?: string | null;
  subcategoria?: string | null;
  estado?: string | null;
}

export interface Supplier {
  id: number; // id_proveedor
  name: string; // nombre
  contact?: string | null; // contacto
  status?: string | null; // estado
}

export interface ProductSupplier {
  id: number; // id_prod_prov
  productId: number; // id_producto
  supplierId: number; // id_proveedor
  supplierCode: string; // codigo_proveedor
  status?: string | null; // estado
}

export interface Presentation {
  id: number; // id_presentacion
  productId: number; // id_producto
  unit: string; // unidad
  quantity: number; // cantidad (REAL)
  description?: string | null; // descripcion
}

export interface Invoice {
  id: number; // id_factura
  number: string; // numero
  date: string; // fecha
  supplierId: number; // id_proveedor
  total?: number | null;
  status?: string | null; // estado
}

export interface Warehouse {
  id: number; // id_almacen
  name: string; // nombre
  location?: string | null; // ubicacion
  manager?: string | null; // responsable
}

export interface Movement {
  id: number; // id_movimiento
  date: string; // fecha
  type: string; // tipo
  subtype?: string | null; // subtipo
  productSupplierId: number; // id_prod_prov
  presentationId: number; // id_presentacion
  quantity: number; // cantidad
  unitPrice?: number | null; // precio_unit
  totalAmount?: number | null; // monto_total
  batch?: string | null; // lote
  expiryDate?: string | null; // fecha_venc
  notes?: string | null; // obs
  invoiceId?: number | null; // id_factura
}

export interface WarehouseStock {
  id: number; // id_stock
  productSupplierId: number; // id_prod_prov
  presentationId: number; // id_presentacion
  warehouseId: number; // id_almacen
  currentStock: number; // stock_actual
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
