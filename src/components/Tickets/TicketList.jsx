import React, { memo } from 'react';
import { FaClipboardList, FaChartBar, FaEye, FaEdit, FaTrash, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaCheck, FaClock } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import TicketCard from './TicketCard';
import { getTimeAgo } from '../../utils';

const TicketList = ({
  filteredTickets,
  tickets,
  conditionalClasses,
  handleViewDetail,
  handleEdit,
  handleDelete,
  canEditTicket,
  canDeleteTicket,
  user,
  viewMode,
  setViewMode
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
    switch(status?.toLowerCase()) {
      case 'abierto': return <FaExclamationTriangle />;
      case 'en progreso': return <FaSpinner className="animate-spin" />;
      case 'resuelto': return <FaCheckCircle />;
      case 'cerrado': return <FaCheck />;
      default: return <FaClock />;
    }
  };

  if (filteredTickets.length === 0) {
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

  return (
    <>
      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className={conditionalClasses({
          light: "text-sm text-gray-600 font-medium",
          dark: "text-sm text-gray-300 font-medium"
        })}>
          Mostrando <span className="font-bold text-[#662d91]">{filteredTickets.length}</span> de <span className="font-bold">{tickets.length}</span> tickets
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

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className={conditionalClasses({
          light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6",
          dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6"
        })}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                canEditTicket={canEditTicket}
                userRole={user?.role?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className={conditionalClasses({
          light: "bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 lg:p-6 overflow-hidden",
          dark: "bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-4 lg:p-6 overflow-hidden"
        })}>
          {/* Mobile Card View for List Mode */}
          <div className="block md:hidden">
            <div className={conditionalClasses({
              light: "divide-y divide-gray-200",
              dark: "divide-y divide-gray-600"
            })}>
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className={conditionalClasses({
                  light: "p-4 hover:bg-[#f3ebf9] transition-colors",
                  dark: "p-4 hover:bg-gray-700 transition-colors"
                })}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-[#662d91]">#{ticket.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h3 className={conditionalClasses({
                        light: "font-semibold text-gray-900 text-sm mb-1 truncate",
                        dark: "font-semibold text-white text-sm mb-1 truncate"
                      })}>{ticket.title}</h3>
                      <p className={conditionalClasses({
                        light: "text-xs text-gray-500 line-clamp-2",
                        dark: "text-xs text-gray-400 line-clamp-2"
                      })}>{ticket.description}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleViewDetail(ticket)}
                        className={conditionalClasses({
                          light: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation",
                          dark: "p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg transition-all touch-manipulation"
                        })}
                        title="Ver detalles"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {canEditTicket(ticket) && (
                        <button
                          onClick={() => handleEdit(ticket)}
                          className={conditionalClasses({
                            light: "p-2 text-[#662d91] hover:bg-[#f3ebf9] rounded-lg transition-all touch-manipulation",
                            dark: "p-2 text-purple-400 hover:bg-purple-900/50 rounded-lg transition-all touch-manipulation"
                          })}
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      {canDeleteTicket(ticket) && (
                        <button
                          onClick={() => handleDelete(ticket)}
                          className={conditionalClasses({
                            light: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation",
                            dark: "p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-all touch-manipulation"
                          })}
                          title="Eliminar"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={conditionalClasses({
                    light: "grid grid-cols-2 gap-4 text-xs text-gray-600",
                    dark: "grid grid-cols-2 gap-4 text-xs text-gray-300"
                  })}>
                    <div>
                      <span className={conditionalClasses({
                        light: "font-medium text-gray-600",
                        dark: "font-medium text-gray-300"
                      })}>Creado por:</span>
                      <p className={conditionalClasses({
                        light: "truncate text-gray-700",
                        dark: "truncate text-gray-200"
                      })}>{ticket.creator?.name || 'Usuario'}</p>
                    </div>
                    <div>
                      <span className={conditionalClasses({
                        light: "font-medium text-gray-600",
                        dark: "font-medium text-gray-300"
                      })}>Asignado a:</span>
                      <p className={conditionalClasses({
                        light: "truncate text-gray-700",
                        dark: "truncate text-gray-200"
                      })}>{ticket.assignee?.name || 'Sin asignar'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={conditionalClasses({
                        light: "font-medium text-gray-600",
                        dark: "font-medium text-gray-300"
                      })}>Actualizado:</span>
                      <p className={conditionalClasses({
                        light: "text-gray-700",
                        dark: "text-gray-200"
                      })}>{getTimeAgo(ticket.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className={conditionalClasses({
                light: "bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white",
                dark: "bg-linear-to-r from-purple-700 to-purple-800 text-white"
              })}>
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase">ID</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase">Título</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase">Estado</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase">Prioridad</th>
                  <th className={conditionalClasses({
                    light: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-700",
                    dark: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-300"
                  })}>Creado por</th>
                  <th className={conditionalClasses({
                    light: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-700",
                    dark: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-300"
                  })}>Asignado a</th>
                  <th className={conditionalClasses({
                    light: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-700",
                    dark: "px-4 py-4 text-left text-xs font-bold uppercase text-gray-300"
                  })}>Fecha</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className={conditionalClasses({
                light: "divide-y divide-gray-200",
                dark: "divide-y divide-gray-600"
              })}>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className={conditionalClasses({
                    light: "hover:bg-[#f3ebf9] transition-colors",
                    dark: "hover:bg-gray-700 transition-colors"
                  })}>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#662d91]">#{ticket.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={conditionalClasses({
                        light: "font-semibold text-gray-900",
                        dark: "font-semibold text-white"
                      })}>{ticket.title}</div>
                      <div className={conditionalClasses({
                        light: "text-xs text-gray-500 truncate max-w-xs",
                        dark: "text-xs text-gray-400 truncate max-w-xs"
                      })}>{ticket.description}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className={conditionalClasses({
                      light: "px-4 py-4 text-sm text-gray-700",
                      dark: "px-4 py-4 text-sm text-gray-200"
                    })}>
                      {ticket.creator?.name || 'Usuario'}
                    </td>
                    <td className={conditionalClasses({
                      light: "px-4 py-4 text-sm text-gray-700",
                      dark: "px-4 py-4 text-sm text-gray-200"
                    })}>
                      {ticket.assignee?.name || 'Sin asignar'}
                    </td>
                    <td className={conditionalClasses({
                      light: "px-4 py-4 text-sm text-gray-500",
                      dark: "px-4 py-4 text-sm text-gray-400"
                    })}>
                      {getTimeAgo(ticket.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(ticket)}
                          className={conditionalClasses({
                            light: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation",
                            dark: "p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg transition-all touch-manipulation"
                          })}
                          title="Ver detalles"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {canEditTicket(ticket) && (
                          <button
                            onClick={() => handleEdit(ticket)}
                            className={conditionalClasses({
                              light: "p-2 text-[#662d91] hover:bg-[#f3ebf9] rounded-lg transition-all touch-manipulation",
                              dark: "p-2 text-purple-400 hover:bg-purple-900/50 rounded-lg transition-all touch-manipulation"
                            })}
                            title="Editar"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )}
                        {canDeleteTicket(ticket) && (
                          <button
                            onClick={() => handleDelete(ticket)}
                            className={conditionalClasses({
                              light: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation",
                              dark: "p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-all touch-manipulation"
                            })}
                            title="Eliminar"
                          >
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
        </div>
      )}
    </>
  );
};

// Memoización para evitar re-renders innecesarios
const MemoizedTicketList = memo(TicketList);
MemoizedTicketList.displayName = 'TicketList';

export default MemoizedTicketList;