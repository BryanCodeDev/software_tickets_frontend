import React, { memo } from 'react';
import { FaClipboardList, FaChartBar, FaEye, FaEdit, FaTrash, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaCheck, FaClock } from 'react-icons/fa';
import TicketCard from './TicketCard';
import { getTimeAgo } from '../../utils';

const TicketList = ({
  tickets,
  totalItems,
  currentPage,
  itemsPerPage,
  conditionalClasses,
  handleViewDetail,
  handleEdit,
  handleDelete,
  canEditTicket,
  canDeleteTicket,
  user,
  viewMode,
  setViewMode,
  onPageChange,
  loading // ✅ agregado a props
}) => {
  // Función helper para obtener colores de estado
  const getStatusColor = (status) => {
    const isDark = document.documentElement.classList.contains('dark');

    const colors = {
      'abierto': isDark
        ? 'bg-purple-900/50 text-purple-200 border-purple-700'
        : 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
      'en progreso': isDark
        ? 'bg-blue-900/50 text-blue-200 border-blue-700'
        : 'bg-blue-100 text-blue-700 border-blue-200',
      'cerrado': isDark
        ? 'bg-gray-700 text-gray-300 border-gray-600'
        : 'bg-gray-200 text-gray-700 border-gray-300',
      'resuelto': isDark
        ? 'bg-green-900/50 text-green-200 border-green-700'
        : 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status?.toLowerCase()] || (isDark
      ? 'bg-gray-700 text-gray-400 border-gray-600'
      : 'bg-gray-100 text-gray-600 border-gray-200');
  };

  const getPriorityColor = (priority) => {
    const isDark = document.documentElement.classList.contains('dark');

    const colors = {
      'alta': isDark
        ? 'bg-red-900/50 text-red-200 border-red-700'
        : 'bg-red-100 text-red-700 border-red-200',
      'media': isDark
        ? 'bg-yellow-900/50 text-yellow-200 border-yellow-700'
        : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'baja': isDark
        ? 'bg-green-900/50 text-green-200 border-green-700'
        : 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority?.toLowerCase()] || (isDark
      ? 'bg-gray-700 text-gray-400 border-gray-600'
      : 'bg-gray-100 text-gray-600 border-gray-200');
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'abierto': return <FaExclamationTriangle />;
      case 'en progreso': return <FaSpinner className="animate-spin" />;
      case 'resuelto': return <FaCheckCircle />;
      case 'cerrado': return <FaCheck />;
      default: return <FaClock />;
    }
  };

  // ✅ Controles de paginación definidos FUERA del return principal
  const totalPages = Math.ceil((totalItems || 0) / (itemsPerPage || 1));

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={conditionalClasses({
            light: `px-3 py-1 rounded-lg transition-all touch-manipulation ${
              i === currentPage
                ? 'bg-[#662d91] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`,
            dark: `px-3 py-1 rounded-lg transition-all touch-manipulation ${
              i === currentPage
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`
          })}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={conditionalClasses({
            light: "px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
            dark: "px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          })}
        >
          Anterior
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className={conditionalClasses({ light: "px-3 py-1 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100", dark: "px-3 py-1 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600" })}>1</button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button onClick={() => onPageChange(totalPages)} className={conditionalClasses({ light: "px-3 py-1 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100", dark: "px-3 py-1 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600" })}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={conditionalClasses({
            light: "px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
            dark: "px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          })}
        >
          Siguiente
        </button>
      </div>
    );
  };

  // ✅ Estado vacío usando `tickets` (no `filteredTickets`)
  if (!loading && tickets.length === 0) {
    return (
      <div className={conditionalClasses({
        light: "bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center",
        dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-700 p-6 lg:p-12 text-center"
      })}>
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5] rounded-full flex items-center justify-center mx-auto mb-4">
          <FaClipboardList className="w-8 h-8 lg:w-10 lg:h-10 text-[#662d91]" />
        </div>
        <h3 className={conditionalClasses({
          light: "text-lg lg:text-xl font-bold text-gray-900 mb-2",
          dark: "text-lg lg:text-xl font-bold text-white mb-2"
        })}>
          No hay tickets disponibles
        </h3>
        <p className={conditionalClasses({
          light: "text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6",
          dark: "text-sm lg:text-base text-gray-300 max-w-md mx-auto mb-4 lg:mb-6"
        })}>
          Comienza creando un nuevo ticket para dar seguimiento a incidencias
        </p>
      </div>
    );
  }

  // ✅ Un único return principal con estructura correcta
  return (
    <>
      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className={conditionalClasses({
          light: "text-sm text-gray-600 font-medium",
          dark: "text-sm text-gray-300 font-medium"
        })}>
          Mostrando <span className="font-bold text-[#662d91]">{tickets.length}</span> de <span className="font-bold">{totalItems || 0}</span> tickets
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={conditionalClasses({
              light: `px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`,
              dark: `px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`
            })}
          >
            <FaClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Tarjetas</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={conditionalClasses({
              light: `px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'list'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`,
              dark: `px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'list'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }`
            })}
          >
            <FaChartBar className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Lista</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-[#662d91]" />
        </div>
      ) : (
        <>
          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className={conditionalClasses({
              light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6",
              dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6"
            })}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    conditionalClasses={conditionalClasses}
                    onViewDetail={() => handleViewDetail(ticket)}
                    onEdit={() => handleEdit(ticket)}
                    onDelete={() => handleDelete(ticket)}
                    canEditTicket={canEditTicket}
                    canDeleteTicket={canDeleteTicket}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className={conditionalClasses({ light: "bg-[#f3ebf9]", dark: "bg-gray-700" })}>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Título</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Prioridad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Creado por</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Asignado a</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Fecha Creación</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{ticket.creator?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{ticket.assignee?.name || 'No asignado'}</td>
                      <td className="px-4 py-3 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleViewDetail(ticket)} className={conditionalClasses({ light: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg", dark: "p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg" })} title="Ver">
                            <FaEye className="w-4 h-4" />
                          </button>
                          {canEditTicket(ticket) && (
                            <button onClick={() => handleEdit(ticket)} className={conditionalClasses({ light: "p-2 text-green-600 hover:bg-green-50 rounded-lg", dark: "p-2 text-green-400 hover:bg-green-900/50 rounded-lg" })} title="Editar">
                              <FaEdit className="w-4 h-4" />
                            </button>
                          )}
                          {canDeleteTicket(ticket) && (
                            <button onClick={() => handleDelete(ticket)} className={conditionalClasses({ light: "p-2 text-red-600 hover:bg-red-50 rounded-lg", dark: "p-2 text-red-400 hover:bg-red-900/50 rounded-lg" })} title="Eliminar">
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <PaginationControls />
          </div>
        </>
      )}
    </>
  );
};

// Memoización para evitar re-renders innecesarios
const MemoizedTicketList = memo(TicketList);
MemoizedTicketList.displayName = 'TicketList';

export default MemoizedTicketList;