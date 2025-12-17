import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const EmptyState = ({ searchTerm, filterType }) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className="text-center py-16">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${conditionalClasses({
        light: 'bg-gray-100',
        dark: 'bg-gray-700'
      })}`}>
        <FaFileAlt className={`w-10 h-10 ${conditionalClasses({
          light: 'text-gray-400',
          dark: 'text-gray-500'
        })}`} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${conditionalClasses({
        light: 'text-gray-900',
        dark: 'text-white'
      })}`}>
        {searchTerm || filterType !== 'all'
          ? 'No se encontraron elementos'
          : 'Sin elementos disponibles'}
      </h3>
      <p className={`max-w-sm mx-auto ${conditionalClasses({
        light: 'text-gray-600',
        dark: 'text-gray-300'
      })}`}>
        {searchTerm || filterType !== 'all'
          ? 'Intenta ajustar los filtros de búsqueda'
          : 'Comienza agregando tu primera carpeta o documento'}
      </p>
    </div>
  );
};

export default EmptyState;