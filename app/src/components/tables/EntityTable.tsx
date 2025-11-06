import React, { useState, useMemo } from "react";
import { FiEdit, FiTrash2, FiPlus, FiChevronUp, FiChevronDown, FiSearch, FiFilter, FiColumns, FiX } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { WithId } from "@/types/common";

type SortDirection = "asc" | "desc" | null;

type ColumnDef<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type EntityTableProps<T extends WithId> = {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  pageSize?: number;
  title?: string;
  addLabel?: string;
  enableSearch?: boolean;
  enableColumnToggle?: boolean;
};

// Función para obtener el ID de un ítem, ya sea por 'id' o 'id_*'
const getId = <T extends object>(item: T): number => {
  if ('id' in item && typeof item.id === 'number') return item.id;
  
  const idKey = Object.keys(item).find(key => 
    key.startsWith('id_') && typeof item[key as keyof T] === 'number'
  );
  
  return idKey ? (item as any)[idKey] : 0;
};

export function EntityTable<T extends WithId>({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  onAdd,
  pageSize = 10,
  title = "List",
  addLabel = "Add",
  enableSearch = true,
  enableColumnToggle = true,
}: EntityTableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map(col => col.key))
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Función para alternar el sorting
  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page when sorting
  };

  // Función para alternar visibilidad de columnas
  const toggleColumnVisibility = (columnKey: keyof T) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  // Función para actualizar filtros de columna
  const updateColumnFilter = (columnKey: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setPage(1); // Reset to first page when filtering
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setColumnFilters({});
    setSearchTerm("");
    setPage(1);
  };

  // Datos procesados con filtros, búsqueda y sorting
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar búsqueda global
    if (searchTerm && enableSearch) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        columns.some(col => {
          if (col.searchable === false) return false;
          const value = row[col.key];
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Aplicar filtros por columna
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        const filterLower = filterValue.toLowerCase();
        filtered = filtered.filter(row => {
          const value = row[columnKey as keyof T];
          return String(value).toLowerCase().includes(filterLower);
        });
      }
    });

    // Aplicar sorting
    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === "asc" ? -1 : 1;
        if (bValue == null) return sortDirection === "asc" ? 1 : -1;
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortDirection === "asc" 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        // String comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
        if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, columnFilters, sortColumn, sortDirection, columns, enableSearch]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginated = processedData.slice((page - 1) * pageSize, page * pageSize);
  const visibleColumnsArray = columns.filter(col => visibleColumns.has(col.key));
  const activeFiltersCount = Object.values(columnFilters).filter(v => v).length + (searchTerm ? 1 : 0);

  // Funciones de humanización
  function humanize(key: string, value: any) {
    if (value == null) return "-";
    // Fechas
    if (key.toLowerCase().includes("date")) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "2-digit" });
      }
    }
    // Dinero
    if (["total", "calculated_payment", "hourly_rate", "price", "cost"].includes(key)) {
      const num = Number(value);
      if (!isNaN(num)) {
        return `$${num.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`;
      }
    }
    // Números
    if (["hours_worked", "attendance_days", "quantity", "stock"].includes(key)) {
      const num = Number(value);
      if (!isNaN(num)) {
        return num.toLocaleString("es-ES");
      }
    }
    
    return value;

  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-card text-card-foreground shadow-lg rounded-xl border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          {enableSearch && (
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          )}

          {/* Filters Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FiFilter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            {/* Filters Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filtros por Columna</h3>
                  <div className="flex gap-2">
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpiar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {visibleColumnsArray
                    .filter(col => col.filterable !== false)
                    .map((col) => (
                      <div key={String(col.key)} className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">
                          {col.label}
                        </label>
                        <input
                          type="text"
                          placeholder={`Filtrar por ${col.label.toLowerCase()}...`}
                          value={columnFilters[String(col.key)] || ""}
                          onChange={(e) => updateColumnFilter(String(col.key), e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Column Toggle Button */}
          {enableColumnToggle && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                className="flex items-center gap-2"
              >
                <FiColumns className="h-4 w-4" />
                Columnas
              </Button>
              
              {/* Column Toggle Dropdown */}
              {showColumnToggle && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Mostrar Columnas</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowColumnToggle(false)}>
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {columns.map((col) => (
                      <label key={String(col.key)} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => toggleColumnVisibility(col.key)}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add Button */}
          {onAdd && (
            <Button onClick={onAdd} className="flex items-center gap-2">
              <FiPlus className="h-4 w-4" />
              <span>{addLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
              <span>Búsqueda: "{searchTerm}"</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
              >
                <FiX className="h-3 w-3" />
              </Button>
            </div>
          )}
          {Object.entries(columnFilters)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              const column = columns.find(col => String(col.key) === key);
              return (
                <div key={key} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                  <span>{column?.label}: "{value}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateColumnFilter(key, "")}
                    className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
                  >
                    <FiX className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumnsArray.map((col) => (
                  <TableHead key={String(col.key)} className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(col.key)}
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          {sortColumn === col.key ? (
                            sortDirection === "asc" ? (
                              <FiChevronUp className="h-4 w-4" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <div className="h-4 w-4 opacity-50">
                              <FiChevronUp className="h-3 w-3" />
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumnsArray.length + ((onEdit || onDelete) ? 1 : 0)} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm || Object.values(columnFilters).some(f => f) 
                      ? "No se encontraron resultados con los filtros aplicados."
                      : "No data found."
                    }
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => (
                  <TableRow key={getId(row)}>
                    {visibleColumnsArray.map((col) => (
                      <TableCell key={`${getId(row)}-${String(col.key)}`} className="text-center">
                        {col.render ? col.render(row[col.key], row) : humanize(String(col.key), row[col.key])}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell key={`${getId(row)}-actions`} className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(row)}
                              className="h-8 w-8 p-0"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(getId(row))}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Results info and pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-muted-foreground">
          Mostrando {paginated.length} de {processedData.length} resultados
          {processedData.length !== data.length && ` (${data.length} total)`}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showFilters || showColumnToggle) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowFilters(false);
            setShowColumnToggle(false);
          }}
        />
      )}
    </div>
  );
}