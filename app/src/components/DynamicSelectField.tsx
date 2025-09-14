import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Button } from './ui/button';
import { Select } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useDynamicOptions } from '../hooks/useDynamicOptions';

interface DynamicSelectFieldProps {
  field: 'categories' | 'units' | 'statuses';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function DynamicSelectField({
  field,
  value,
  onChange,
  placeholder = "Seleccionar...",
  required = false,
  className = ""
}: DynamicSelectFieldProps) {
  const { getOptions, addOption, optionExists } = useDynamicOptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const options = getOptions(field);

  const handleAddNewOption = async () => {
    if (!newOptionValue.trim()) return;

    setIsAdding(true);
    try {
      const success = await addOption(field, newOptionValue.trim());
      if (success) {
        onChange(newOptionValue.trim());
        setNewOptionValue('');
        setShowAddDialog(false);
      } else {
        alert('Esta opción ya existe o es inválida');
      }
    } catch (error) {
      console.error('Error adding option:', error);
      alert('Error al agregar la opción');
    } finally {
      setIsAdding(false);
    }
  };

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === '__add_new__') {
      setShowAddDialog(true);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              value={value}
              onValueChange={handleValueChange}
              placeholder={placeholder}
              options={options}
              required={required}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiPlus className="h-4 w-4" />
            <span className="font-medium">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Add New Option Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Opción</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nueva {field === 'categories' ? 'Categoría' : 
                     field === 'units' ? 'Unidad de Medida' : 'Estado'}
              </label>
              <input
                type="text"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder={`Ej: ${
                  field === 'categories' ? 'Nuevas Tecnologías' : 
                  field === 'units' ? 'Metro' : 'En Revisión'
                }`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isAdding) {
                    handleAddNewOption();
                  }
                }}
                autoFocus
              />
            </div>

            {optionExists(field, newOptionValue.trim()) && newOptionValue.trim() && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Esta opción ya existe
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewOptionValue('');
              }}
              disabled={isAdding}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddNewOption}
              disabled={!newOptionValue.trim() || isAdding || optionExists(field, newOptionValue.trim())}
              className="flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Agregando...
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4" />
                  Agregar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
