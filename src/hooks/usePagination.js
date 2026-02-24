/**
 * Hook personalizado para paginación
 * Maneja el estado y lógica de paginación de forma reutilizable
 */
import { useState, useCallback, useMemo } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 20) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset a página 1 al cambiar el límite
  }, []);

  const paginationParams = useMemo(() => ({
    page,
    limit
  }), [page, limit]);

  return {
    page,
    limit,
    setPage: goToPage,
    setLimit: changeLimit,
    resetPagination,
    nextPage,
    prevPage,
    paginationParams
  };
};

export default usePagination;
