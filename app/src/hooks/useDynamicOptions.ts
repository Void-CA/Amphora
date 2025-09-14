import { useState, useEffect, useCallback } from 'react';

export interface DynamicOption {
  value: string;
  label: string;
}

export interface DynamicOptionsState {
  categories: DynamicOption[];
  units: DynamicOption[];
  statuses: DynamicOption[];
}

const DEFAULT_OPTIONS: DynamicOptionsState = {
  categories: [
    { value: "Electrónicos", label: "Electrónicos" },
    { value: "Oficina", label: "Oficina" },
    { value: "Mobiliario", label: "Mobiliario" },
    { value: "Herramientas", label: "Herramientas" },
    { value: "Consumibles", label: "Consumibles" }
  ],
  units: [
    { value: "Unidad", label: "Unidad" },
    { value: "Caja", label: "Caja" },
    { value: "Paquete", label: "Paquete" },
    { value: "Resma", label: "Resma" },
    { value: "Litro", label: "Litro" },
    { value: "Kilogramo", label: "Kilogramo" }
  ],
  statuses: [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Stock Bajo", label: "Stock Bajo" },
    { value: "Descontinuado", label: "Descontinuado" }
  ]
};

export function useDynamicOptions() {
  const [options, setOptions] = useState<DynamicOptionsState>(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(true);

  // Load options from storage/database
  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call or Tauri command
      // const savedOptions = await invoke('get_dynamic_options');
      // if (savedOptions) {
      //   setOptions(savedOptions);
      // }
      
      // For now, load from localStorage as fallback
      const savedOptions = localStorage.getItem('dynamicOptions');
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions);
        setOptions({
          categories: [...DEFAULT_OPTIONS.categories, ...(parsed.categories || [])],
          units: [...DEFAULT_OPTIONS.units, ...(parsed.units || [])],
          statuses: [...DEFAULT_OPTIONS.statuses, ...(parsed.statuses || [])]
        });
      }
    } catch (error) {
      console.error('Error loading dynamic options:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save options to storage/database
  const saveOptions = useCallback(async (newOptions: DynamicOptionsState) => {
    try {
      // TODO: Replace with actual API call or Tauri command
      // await invoke('save_dynamic_options', { options: newOptions });
      
      // For now, save to localStorage
      localStorage.setItem('dynamicOptions', JSON.stringify(newOptions));
    } catch (error) {
      console.error('Error saving dynamic options:', error);
    }
  }, []);

  // Add new option to a specific field
  const addOption = useCallback(async (field: keyof DynamicOptionsState, newOption: string) => {
    const option: DynamicOption = {
      value: newOption.trim(),
      label: newOption.trim()
    };

    // Check if option already exists
    const exists = options[field].some(opt => 
      opt.value.toLowerCase() === option.value.toLowerCase()
    );

    if (!exists && option.value) {
      const newOptions = {
        ...options,
        [field]: [...options[field], option]
      };
      
      setOptions(newOptions);
      await saveOptions(newOptions);
      return true;
    }
    
    return false;
  }, [options, saveOptions]);

  // Remove option from a specific field
  const removeOption = useCallback(async (field: keyof DynamicOptionsState, value: string) => {
    // Don't allow removing default options
    const isDefault = DEFAULT_OPTIONS[field].some(opt => opt.value === value);
    if (isDefault) return false;

    const newOptions = {
      ...options,
      [field]: options[field].filter(opt => opt.value !== value)
    };
    
    setOptions(newOptions);
    await saveOptions(newOptions);
    return true;
  }, [options, saveOptions]);

  // Get options for a specific field
  const getOptions = useCallback((field: keyof DynamicOptionsState): DynamicOption[] => {
    return options[field] || [];
  }, [options]);

  // Check if an option exists
  const optionExists = useCallback((field: keyof DynamicOptionsState, value: string): boolean => {
    return options[field].some(opt => 
      opt.value.toLowerCase() === value.toLowerCase()
    );
  }, [options]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return {
    options,
    loading,
    addOption,
    removeOption,
    getOptions,
    optionExists,
    loadOptions
  };
}
