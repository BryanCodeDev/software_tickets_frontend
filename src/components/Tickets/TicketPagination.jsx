import React from 'react';

const TicketPagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 mt-6">
      <div className="text-sm text-gray-600">
        Página {pagination.currentPage} de {pagination.totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
          className="px-4 py-2 bg-[#662d91] hover:bg-[#7a3da8] disabled:bg-[#8e4dbf] disabled:text-[#e8d5f5] text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TicketPagination;

