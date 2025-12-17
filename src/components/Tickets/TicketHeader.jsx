import React, { memo } from 'react';
import { FaPlus, FaDownload, FaChartBar } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const TicketHeader = ({
  user,
  checkPermission,
  showStats,
  setShowStats,
  exportToExcel,
  canCreate,
  handleCreate
}) => {
  const { conditionalClasses } = useThemeClasses();
  const userRole = user?.role?.name;

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 lg:gap-4 mb-3">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-xl shrink-0">
              <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={conditionalClasses({
                light: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate",
                dark: "text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight truncate"
              })}>
                Sistema de Tickets
              </h1>
              <p className={conditionalClasses({
                light: "text-xs sm:text-sm text-gray-600 mt-1",
                dark: "text-xs sm:text-sm text-gray-300 mt-1"
              })}>
                Gestión integral de incidencias y soporte técnico
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:gap-3">
          {((checkPermission('tickets', 'view_stats') || checkPermission('tickets', 'export') ||
            userRole === 'Administrador' || userRole === 'Técnico')) && (
            <>
              {(checkPermission('tickets', 'view_stats') || userRole === 'Administrador' || userRole === 'Técnico') && (
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={conditionalClasses({
                    light: "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base",
                    dark: "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl border-2 border-gray-600 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
                  })}
                >
                  <FaChartBar className="w-4 h-4" />
                  <span className="hidden sm:inline">Estadísticas</span>
                </button>
              )}
              {(checkPermission('tickets', 'export') || userRole === 'Administrador' || userRole === 'Técnico') && (
                <button
                  onClick={exportToExcel}
                  className={conditionalClasses({
                    light: "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base",
                    dark: "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl border-2 border-gray-600 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
                  })}
                >
                  <FaDownload className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
              )}
            </>
          )}
          {canCreate && (
            <button
              onClick={handleCreate}
              className={conditionalClasses({
                light: "flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base",
                dark: "flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base"
              })}
            >
              <FaPlus className="w-4 h-4" />
              <span>Nuevo Ticket</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoización para evitar re-renders innecesarios
const MemoizedTicketHeader = memo(TicketHeader);
MemoizedTicketHeader.displayName = 'TicketHeader';

export default MemoizedTicketHeader;