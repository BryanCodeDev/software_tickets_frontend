import { useMemo } from 'react';

export const useDocumentFilters = (documents, searchTerm, filterType, sortBy, sortOrder, currentFolder) => {
  const filteredAndSortedDocuments = useMemo(() => {
    try {
      // Verificar que documents sea un array - usar Array.isArray para mayor seguridad
      let docsArray = [];
      
      if (Array.isArray(documents)) {
        docsArray = documents;
      } else if (documents?.data && Array.isArray(documents.data)) {
        docsArray = documents.data;
      } else if (documents?.data?.data && Array.isArray(documents.data.data)) {
        docsArray = documents.data.data;
      }
      
      // Si no es array, retornar array vacío
      if (!Array.isArray(docsArray)) {
        return [];
      }

      // Filtrar documentos por carpeta actual
      let docsInFolder = docsArray.filter(doc => {
        if (!doc) return false;
        if (currentFolder) {
          return doc.folderId === currentFolder.id;
        } else {
          return !doc.folderId; // Documentos en la raíz
        }
      });

      // Agrupar documentos por parentDocumentId o id si no tiene parent
      const grouped = docsInFolder.reduce((acc, doc) => {
        if (!doc) return acc;
        const key = doc.parentDocumentId || doc.id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(doc);
        return acc;
      }, {});

      // Para cada grupo, tomar la versión activa más reciente
      let filtered = Object.values(grouped).map(group => {
        // Verificar que group sea un array antes de usar filter
        if (!Array.isArray(group) || group.length === 0) {
          return null;
        }
        const activeVersions = group.filter(doc => doc && doc.isActive !== false);
        if (activeVersions.length === 0) return group[0];
        return activeVersions.sort((a, b) => parseFloat(b.version || 0) - parseFloat(a.version || 0))[0];
      }).filter(Boolean);

      // Asegurar que filtered siempre sea un array
      if (!Array.isArray(filtered)) {
        filtered = [];
      }

      // Búsqueda por título, descripción, tipo o categoría
      if (searchTerm && filtered.length > 0) {
        filtered = filtered.filter(doc => {
          if (!doc) return false;
          const searchLower = searchTerm.toLowerCase();
          return (
            doc.title?.toLowerCase().includes(searchLower) ||
            doc.description?.toLowerCase().includes(searchLower) ||
            doc.type?.toLowerCase().includes(searchLower) ||
            doc.category?.toLowerCase().includes(searchLower)
          );
        });
      }

      // Filtro por tipo
      if (filterType !== 'all' && filtered.length > 0) {
        filtered = filtered.filter(doc => {
          if (!doc) return false;
          return doc.type?.toLowerCase() === filterType.toLowerCase();
        });
      }

      // Ordenamiento
      if (filtered.length > 0) {
        filtered.sort((a, b) => {
          if (!a || !b) return 0;
          let aVal = a[sortBy];
          let bVal = b[sortBy];

          if (sortBy === 'createdAt') {
            aVal = aVal ? new Date(aVal) : new Date(0);
            bVal = bVal ? new Date(bVal) : new Date(0);
          } else if (sortBy === 'version') {
            aVal = parseFloat(aVal || 0);
            bVal = parseFloat(bVal || 0);
          } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal?.toLowerCase() || '';
          }

          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return filtered;
    } catch (error) {
      console.error('Error in useDocumentFilters:', error);
      return [];
    }
  }, [documents, searchTerm, filterType, sortBy, sortOrder, currentFolder]);

  return filteredAndSortedDocuments;
};
