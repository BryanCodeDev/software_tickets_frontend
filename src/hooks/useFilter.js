/**
 * Hook personalizado para filtros
 * Maneja el estado y lógica de filtros de forma reutilizable
 */
import { useState, useCallback, useMemo } from 'react';
import { CONFIG } from '../constants';

export const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v !== '' && v !== null && v !== undefined) || 
           searchTerm !== '';
  }, [filters, searchTerm]);

  const buildQueryParams = useCallback((baseParams = {}) => {
    const params = { ...baseParams };
    
    // Agregar búsqueda
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    // Agregar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    
    return params;
  }, [filters, searchTerm]);

  return {
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    setMultipleFilters,
    clearFilters,
    removeFilter,
    hasActiveFilters,
    buildQueryParams
  };
};

export default useFilter;
