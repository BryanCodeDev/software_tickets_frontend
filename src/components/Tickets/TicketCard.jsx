import React, { memo } from 'react';
import { FaEdit, FaEye, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaCheck, FaClock, FaUserCircle } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const TicketCard = ({
  ticket,
  onViewDetail,
  onEdit,
  canEditTicket
}) => {
  const { conditionalClasses } = useThemeClasses();

  const getStatusColor = (status) => {
    const colors = {
      'abierto': conditionalClasses({
        light: 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
        dark: 'bg-purple-900/30 text-purple-300 border-purple-700'
      }),
      'en progreso': conditionalClasses({
        light: 'bg-blue-100 text-blue-700 border-blue-200',
        dark: 'bg-blue-900/30 text-blue-300 border-blue-700'
      }),
      'cerrado': conditionalClasses({
        light: 'bg-gray-200 text-gray-700 border-gray-300',
        dark: 'bg-gray-700 text-gray-300 border-gray-600'
      }),
      'resuelto': conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900/30 text-green-300 border-green-700'
      })
    };
    return colors[status?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-600 border-gray-200',
      dark: 'bg-gray-700 text-gray-400 border-gray-600'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': conditionalClasses({
        light: 'bg-red-100 text-red-700 border-red-200',
        dark: 'bg-red-900/30 text-red-300 border-red-700'
      }),
      'media': conditionalClasses({
        light: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dark: 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
      }),
      'baja': conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900/30 text-green-300 border-green-700'
      })
    };
    return colors[priority?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-600 border-gray-200',
      dark: 'bg-gray-700 text-gray-400 border-gray-600'
    });
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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  return (
    <div
      className={`
        rounded-xl lg:rounded-2xl border-2 hover:border-purple-500 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer
        ${conditionalClasses({
          light: 'bg-gray-50 border-gray-200',
          dark: 'bg-gray-800 border-gray-700'
        })}
      `}
      onClick={() => onViewDetail(ticket)}
    >
      {/* Card Header */}
      <div className={`
        p-3 lg:p-4 border-b-2
        ${ticket.priority === 'alta' ? conditionalClasses({
          light: 'bg-linear-to-r from-red-50 to-red-100 border-red-200',
          dark: 'bg-linear-to-r from-red-900/20 to-red-800/20 border-red-700'
        }) :
        ticket.priority === 'media' ? conditionalClasses({
          light: 'bg-linear-to-r from-yellow-50 to-yellow-100 border-yellow-200',
          dark: 'bg-linear-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-700'
        }) :
        conditionalClasses({
          light: 'bg-linear-to-r from-green-50 to-green-100 border-green-200',
          dark: 'bg-linear-to-r from-green-900/20 to-green-800/20 border-green-700'
        })
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1.5 lg:p-2 rounded-lg ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
              </span>
              <div className="flex flex-wrap gap-1 lg:gap-2">
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            <h3 className={`
              text-base lg:text-lg font-bold mb-1 truncate
              ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-gray-100'
              })}
            `}>{ticket.title}</h3>
            <p className={`
              text-xs
              ${conditionalClasses({
                light: 'text-gray-500',
                dark: 'text-gray-400'
              })}
            `}>Ticket #{ticket.id}</p>
          </div>
          {canEditTicket(ticket) && (
            <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit(ticket)}
                className={`
                  p-1.5 lg:p-2 rounded-lg transition-all
                  ${conditionalClasses({
                    light: 'bg-blue-100 hover:bg-blue-200 text-blue-600',
                    dark: 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-400'
                  })}
                `}
                title="Editar"
              >
                <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 lg:p-5">
        <p className={`
          text-sm mb-4 line-clamp-3
          ${conditionalClasses({
            light: 'text-gray-700',
            dark: 'text-gray-300'
          })}
        `}>{ticket.description}</p>

        <div className="space-y-3">
          <div className={`
            flex items-center gap-3 pb-3 border-b
            ${conditionalClasses({
              light: 'border-gray-100',
              dark: 'border-gray-700'
            })}
          `}>
            <div className={`
              w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shrink-0
              ${conditionalClasses({
                light: 'bg-[#f3ebf9]',
                dark: 'bg-purple-900/30'
              })}
            `}>
              <FaUserCircle className={`
                w-5 h-5 lg:w-6 lg:h-6
                ${conditionalClasses({
                  light: 'text-[#662d91]',
                  dark: 'text-purple-400'
                })}
              `} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`
                text-xs font-medium
                ${conditionalClasses({
                  light: 'text-gray-500',
                  dark: 'text-gray-400'
                })}
              `}>Creado por</p>
              <p className={`
                text-sm font-bold truncate
                ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-gray-100'
                })}
              `}>
                {ticket.creator?.name || 'Usuario'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`
                text-xs font-medium mb-1
                ${conditionalClasses({
                  light: 'text-gray-500',
                  dark: 'text-gray-400'
                })}
              `}>Asignado a</p>
              <p className={`
                text-sm font-semibold truncate
                ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-gray-100'
                })}
              `}>
                {ticket.assignee?.name || 'Sin asignar'}
              </p>
            </div>
            <div>
              <p className={`
                text-xs font-medium mb-1
                ${conditionalClasses({
                  light: 'text-gray-500',
                  dark: 'text-gray-400'
                })}
              `}>Actualizado</p>
              <p className={`
                text-sm font-semibold
                ${conditionalClasses({
                  light: 'text-gray-900',
                  dark: 'text-gray-100'
                })}
              `}>{getTimeAgo(ticket.updatedAt)}</p>
            </div>
          </div>

          <div className={`
            pt-3 border-t
            ${conditionalClasses({
              light: 'border-gray-100',
              dark: 'border-gray-700'
            })}
          `}>
            <div className={`
              flex items-center justify-between text-xs
              ${conditionalClasses({
                light: 'text-gray-500',
                dark: 'text-gray-400'
              })}
            `}>
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
              </span>
              <button className={`
                flex items-center gap-1 font-semibold hover:underline
                ${conditionalClasses({
                  light: 'text-[#662d91] hover:text-[#662d91]',
                  dark: 'text-purple-400 hover:text-purple-300'
                })}
              `}>
                <FaEye className="w-3 h-3" />
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoización para evitar re-renders innecesarios
const MemoizedTicketCard = memo(TicketCard);
MemoizedTicketCard.displayName = 'TicketCard';

export default MemoizedTicketCard;
