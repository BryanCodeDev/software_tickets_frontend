import { useMemo } from 'react';

export const useDocumentFilters = (documents, searchTerm, filterType, sortBy, sortOrder, currentFolder) => {
  // Versión de prueba simple que siempre retorna array vacío
  // Esto es para diagnosticar si el problema está en este hook
  
  const result = useMemo(() => {
    // Versión ultra-minimalista
    const arr = [];
    return arr;
  }, [documents, searchTerm, filterType, sortBy, sortOrder, currentFolder]);

  return result;
};
