/**
 * Hook para memoizar valores calculados costosos
 * Útil para cálculos que requieren procesamiento pesado
 */
import { useMemo } from 'react';

/**
 * Hook para memoizar cálculos costosos con dependencias
 * @param {Function} compute - Función que realiza el cálculo
 * @param {Array} deps - Dependencias que disparan el recálculo
 * @returns {any} Resultado del cálculo memoizado
 */
export const useMemoizedValue = (compute, deps) => {
  return useMemo(() => compute(), deps);
};

/**
 * Hook para memoizar una lista filtrada
 * @param {Array} items - Lista de elementos
 * @param {Function} filterFn - Función de filtrado
 * @param {Array} deps - Dependencias
 * @returns {Array} Lista filtrada memoizada
 */
export const useFilteredList = (items, filterFn, deps = []) => {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return filterFn ? items.filter(filterFn) : items;
  }, [items, filterFn, ...deps]);
};

/**
 * Hook para memoizar una lista ordenada
 * @param {Array} items - Lista de elementos
 * @param {Function} sortFn - Función de ordenamiento
 * @param {Array} deps - Dependencias
 * @returns {Array} Lista ordenada memoizada
 */
export const useSortedList = (items, sortFn, deps = []) => {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return sortFn ? [...items].sort(sortFn) : items;
  }, [items, sortFn, ...deps]);
};

/**
 * Hook para memoizar una transformación de datos
 * @param {Array} items - Lista de elementos
 * @param {Function} transformFn - Función de transformación
 * @param {Array} deps - Dependencias
 * @returns {Array} Lista transformada memoizada
 */
export const useTransformedList = (items, transformFn, deps = []) => {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return transformFn ? items.map(transformFn) : items;
  }, [items, transformFn, ...deps]);
};

export default {
  useMemoizedValue,
  useFilteredList,
  useSortedList,
  useTransformedList
};
