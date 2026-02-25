import { useMemo } from 'react';

export const useDocumentFilters = (documents, searchTerm, filterType, sortBy, sortOrder, currentFolder) => {
  const filteredAndSortedDocuments = useMemo(() => {
    // Verificar que documents sea un array
    if (!Array.isArray(documents)) {
      return [];
    }

    // Filtrar documentos por carpeta actual
    let docsInFolder = documents.filter(doc => {
      if (currentFolder) {
        return doc.folderId === currentFolder.id;
      } else {
        return !doc.folderId; // Documentos en la raíz
      }
    });

    // Agrupar documentos por parentDocumentId o id si no tiene parent
    const grouped = docsInFolder.reduce((acc, doc) => {
      const key = doc.parentDocumentId || doc.id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {});

    // Para cada grupo, tomar la versión activa más reciente
    let filtered = Object.values(grouped).map(group => {
      const activeVersions = group.filter(doc => doc.isActive !== false); // Asumir true si no definido
      if (activeVersions.length === 0) return group[0]; // Si ninguno activo, tomar el primero
      return activeVersions.sort((a, b) => parseFloat(b.version) - parseFloat(a.version))[0];
    });

    // Búsqueda por título, descripción, tipo o categoría
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type?.toLowerCase() === filterType.toLowerCase());
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
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

    return filtered;
  }, [documents, searchTerm, filterType, sortBy, sortOrder, currentFolder]);

  return filteredAndSortedDocuments;
};