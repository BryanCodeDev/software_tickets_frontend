import { useMemo } from 'react';

export const useDocumentFilters = (documents, searchTerm, filterType, sortBy, sortOrder, currentFolder) => {
  // Versión ultra-simple que siempre retorna un array vacío o el array procesado
  const filteredAndSortedDocuments = useMemo(() => {
    try {
      // Inicializar como array vacío
      let result = [];
      
      // Verificar si documents es un array válido
      if (Array.isArray(documents) && documents.length > 0) {
        result = [...documents]; // Crear copia para no mutar
      } else if (documents?.data && Array.isArray(documents.data)) {
        result = [...documents.data];
      } else if (documents?.data?.data && Array.isArray(documents.data.data)) {
        result = [...documents.data.data];
      }
      
      // Si currentFolder está definido, filtrar por folderId
      if (currentFolder && currentFolder.id) {
        result = result.filter(doc => doc && doc.folderId === currentFolder.id);
      } else {
        // Solo documentos sin folderId (raíz)
        result = result.filter(doc => doc && !doc.folderId);
      }
      
      // Agrupar por parentDocumentId para obtener versiones únicas
      const grouped = {};
      result.forEach(doc => {
        if (!doc) return;
        const key = doc.parentDocumentId || doc.id;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(doc);
      });
      
      // Obtener solo la versión activa más reciente de cada grupo
      const uniqueDocs = [];
      Object.keys(grouped).forEach(key => {
        const group = grouped[key];
        if (!Array.isArray(group) || group.length === 0) return;
        
        // Filtrar solo versiones activas
        const active = group.filter(d => d && d.isActive !== false);
        
        if (active.length > 0) {
          // Ordenar por versión y tomar la más reciente
          active.sort((a, b) => {
            const vA = parseFloat(a.version || 0);
            const vB = parseFloat(b.version || 0);
            return vB - vA;
          });
          uniqueDocs.push(active[0]);
        } else {
          // Si no hay activas, tomar la primera
          uniqueDocs.push(group[0]);
        }
      });
      
      result = uniqueDocs;
      
      // Filtrar por búsqueda
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(doc => {
          if (!doc) return false;
          return (
            (doc.title && doc.title.toLowerCase().includes(term)) ||
            (doc.description && doc.description.toLowerCase().includes(term)) ||
            (doc.type && doc.type.toLowerCase().includes(term)) ||
            (doc.category && doc.category.toLowerCase().includes(term))
          );
        });
      }
      
      // Filtrar por tipo
      if (filterType && filterType !== 'all') {
        const type = filterType.toLowerCase();
        result = result.filter(doc => doc && doc.type && doc.type.toLowerCase() === type);
      }
      
      // Ordenar
      if (result.length > 0 && sortBy) {
        result.sort((a, b) => {
          if (!a || !b) return 0;
          let valA = a[sortBy];
          let valB = b[sortBy];
          
          if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            valA = valA ? new Date(valA).getTime() : 0;
            valB = valB ? new Date(valB).getTime() : 0;
          } else if (sortBy === 'version') {
            valA = parseFloat(valA || 0);
            valB = parseFloat(valB || 0);
          } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = (valB || '').toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return valA > valB ? 1 : -1;
          } else {
            return valA < valB ? 1 : -1;
          }
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error en useDocumentFilters:', err);
      return [];
    }
  }, [documents, searchTerm, filterType, sortBy, sortOrder, currentFolder]);

  return filteredAndSortedDocuments;
};
