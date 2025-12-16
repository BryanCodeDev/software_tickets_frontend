import React from 'react';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const TicketPagination = ({ pagination, onPageChange }) => {
  const { conditionalClasses } = useThemeClasses();
  
  if (pagination.totalPages <= 1) return null;

  return (
    <div className={`
      flex items-center justify-between rounded-2xl shadow-lg border-2 p-4 lg:p-6 mt-6
      ${conditionalClasses({
        light: 'bg-white border-gray-200',
        dark: 'bg-gray-800 border-gray-700'
      })}
    `}>
      <div className={`
        text-sm
        ${conditionalClasses({
          light: 'text-gray-600',
          dark: 'text-gray-300'
        })}
      `}>
        Página {pagination.currentPage} de {pagination.totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
          className={`
            px-4 py-2 font-semibold rounded-xl transition-all disabled:cursor-not-allowed
            ${conditionalClasses({
              light: 'bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700',
              dark: 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-200'
            })}
          `}
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
          className={`
            px-4 py-2 font-semibold rounded-xl transition-all disabled:cursor-not-allowed
            ${conditionalClasses({
              light: 'bg-[#662d91] hover:bg-[#7a3da8] disabled:bg-[#8e4dbf] disabled:text-[#e8d5f5] text-white',
              dark: 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:text-purple-300 text-white'
            })}
          `}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TicketPagination;
