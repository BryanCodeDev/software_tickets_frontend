import React from 'react';
import { FaEye, FaClock, FaCheck, FaTimes, FaArrowRight, FaCheckCircle, FaUserCircle, FaEdit, FaTrash, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import { getTimeAgo } from '../../utils';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const PurchaseRequestCard = ({ request, onViewDetail, onEdit, onDelete, userRole, user }) => {
  const { conditionalClasses } = useThemeClasses();

  const getStatusColor = (status) => {
    const colors = {
      'solicitado': conditionalClasses({
        light: 'bg-blue-100 text-blue-700 border-blue-200',
        dark: 'bg-blue-900/30 text-blue-300 border-blue-700/30'
      }),
      'pendiente_coordinadora': conditionalClasses({
        light: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dark: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/30'
      }),
      'aprobado_coordinadora': conditionalClasses({
        light: 'bg-orange-100 text-orange-700 border-orange-200',
        dark: 'bg-orange-900/30 text-orange-300 border-orange-700/30'
      }),
      'pendiente_jefe': conditionalClasses({
        light: 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
        dark: 'bg-purple-900/30 text-purple-300 border-purple-700/30'
      }),
      'aprobado_jefe': conditionalClasses({
        light: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        dark: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30'
      }),
      'en_compras': conditionalClasses({
        light: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        dark: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30'
      }),
      'comprado': conditionalClasses({
        light: 'bg-teal-100 text-teal-700 border-teal-200',
        dark: 'bg-teal-900/30 text-teal-300 border-teal-700/30'
      }),
      'entregado': conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900/30 text-green-300 border-green-700/30'
      }),
      'rechazado': conditionalClasses({
        light: 'bg-red-100 text-red-700 border-red-200',
        dark: 'bg-red-900/30 text-red-300 border-red-700/30'
      })
    };
    return colors[status?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-600 border-gray-200',
      dark: 'bg-gray-700 text-gray-300 border-gray-600'
    });
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'solicitado':
      case 'pendiente_coordinadora': return <FaClock />;
      case 'aprobado_coordinadora':
      case 'aprobado_jefe': return <FaCheck />;
      case 'en_compras':
      case 'comprado': return <FaArrowRight />;
      case 'entregado': return <FaCheckCircle />;
      case 'rechazado': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  const getItemTypeColor = (itemType) => {
    const colors = {
      'periferico': conditionalClasses({
        light: 'bg-blue-100 text-blue-700',
        dark: 'bg-blue-900/30 text-blue-300'
      }),
      'electrodomestico': conditionalClasses({
        light: 'bg-green-100 text-green-700',
        dark: 'bg-green-900/30 text-green-300'
      }),
      'software': conditionalClasses({
        light: 'bg-[#f3ebf9] text-[#662d91]',
        dark: 'bg-purple-900/30 text-purple-300'
      }),
      'otro': conditionalClasses({
        light: 'bg-gray-100 text-gray-700',
        dark: 'bg-gray-700 text-gray-300'
      })
    };
    return colors[itemType?.toLowerCase()] || conditionalClasses({
      light: 'bg-gray-100 text-gray-700',
      dark: 'bg-gray-700 text-gray-300'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const isUrgent = () => {
    const daysSinceCreation = (new Date() - new Date(request.createdAt)) / (1000 * 60 * 60 * 24);
    return daysSinceCreation > 7 && ['solicitado', 'pendiente_coordinadora', 'pendiente_jefe'].includes(request.status?.toLowerCase());
  };

  const hasBudgetIssue = () => {
    return request.budget && parseFloat(request.estimatedCost) > (parseFloat(request.budget.totalAmount) - parseFloat(request.budget.usedAmount));
  };

  const canDelete = () => {
    const isAdmin = userRole === 'Administrador';
    const isOwner = request.userId === user?.id; // Comparar con el ID del usuario actual
    const allowedStatuses = ['solicitado', 'pendiente_coordinadora', 'rechazado'];
    const statusAllowsDeletion = allowedStatuses.includes(request.status?.toLowerCase());

    return isAdmin || (isOwner && statusAllowsDeletion);
  };

  return (
    <div className={conditionalClasses({
      light: `bg-white rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-200 overflow-hidden ${
        isUrgent() ? 'border-red-300 ring-2 ring-red-100' : hasBudgetIssue() ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'
      }`,
      dark: `bg-gray-800 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-200 overflow-hidden ${
        isUrgent() ? 'border-red-600 ring-2 ring-red-900/50' : hasBudgetIssue() ? 'border-orange-600 ring-2 ring-orange-900/50' : 'border-gray-600'
      }`
    })}>
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-bold text-[#662d91] text-base sm:text-lg">#{request.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="hidden sm:inline">{request.status}</span>
                <span className="sm:hidden">Pendiente</span>
              </span>
              {isUrgent() && (
                <span className={conditionalClasses({
                  light: 'px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full inline-flex items-center gap-1',
                  dark: 'px-2 py-1 bg-red-900/30 text-red-300 text-xs font-bold rounded-full inline-flex items-center gap-1'
                })}>
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="hidden sm:inline">Urgente</span>
                  <span className="sm:hidden">!</span>
                </span>
              )}
              {hasBudgetIssue() && (
                <span className={conditionalClasses({
                  light: 'px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full inline-flex items-center gap-1',
                  dark: 'px-2 py-1 bg-orange-900/30 text-orange-300 text-xs font-bold rounded-full inline-flex items-center gap-1'
                })}>
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="hidden sm:inline">Presupuesto</span>
                  <span className="sm:hidden">$</span>
                </span>
              )}
            </div>
            <h3 className={conditionalClasses({
              light: 'font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 leading-tight',
              dark: 'font-bold text-gray-100 text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 leading-tight'
            })}>
              {request.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
            {(userRole === 'Administrador' || (userRole === 'Calidad' && request.userId === user?.id)) && (
              <button
                onClick={() => onEdit && onEdit(request)}
                className={conditionalClasses({
                  light: 'p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200',
                  dark: 'p-1.5 sm:p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-all duration-200'
                })}
                title="Editar solicitud"
              >
                <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
            {canDelete() && (
              <button
                onClick={() => onDelete && onDelete(request)}
                className={conditionalClasses({
                  light: 'p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200',
                  dark: 'p-1.5 sm:p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all duration-200'
                })}
                title="Eliminar solicitud"
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
            <button
              onClick={() => onViewDetail(request)}
              className={conditionalClasses({
                light: 'p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200',
                dark: 'p-1.5 sm:p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-all duration-200'
              })}
              title="Ver detalles"
            >
              <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className={conditionalClasses({
          light: 'text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed',
          dark: 'text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed'
        })}>
          {request.description}
        </p>

        {/* Item Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
          <div>
            <span className={conditionalClasses({
              light: 'text-xs font-semibold text-gray-500 uppercase tracking-wide',
              dark: 'text-xs font-semibold text-gray-400 uppercase tracking-wide'
            })}>Tipo</span>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getItemTypeColor(request.itemType)}`}>
                {request.itemType}
              </span>
            </div>
          </div>
          <div>
            <span className={conditionalClasses({
              light: 'text-xs font-semibold text-gray-500 uppercase tracking-wide',
              dark: 'text-xs font-semibold text-gray-400 uppercase tracking-wide'
            })}>Cantidad</span>
            <p className={conditionalClasses({
              light: 'text-sm font-semibold text-gray-900 mt-1',
              dark: 'text-sm font-semibold text-gray-100 mt-1'
            })}>{request.quantity}</p>
          </div>
        </div>

        {/* Cost */}
        <div className="mb-3 sm:mb-4">
          <span className={conditionalClasses({
            light: 'text-xs font-semibold text-gray-500 uppercase tracking-wide',
            dark: 'text-xs font-semibold text-gray-400 uppercase tracking-wide'
          })}>Costo Estimado</span>
          <p className="text-base sm:text-lg font-bold text-green-600 mt-1">{formatCurrency(request.estimatedCost)}</p>
        </div>

        {/* Budget Info */}
        {request.budget && (
          <div className={conditionalClasses({
            light: 'mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200',
            dark: 'mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/20 rounded-lg border border-blue-700/30'
          })}>
            <div className="flex items-center gap-2 mb-2">
              <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className={conditionalClasses({
                light: 'text-xs font-semibold text-blue-700 uppercase tracking-wide',
                dark: 'text-xs font-semibold text-blue-300 uppercase tracking-wide'
              })}>Presupuesto</span>
            </div>
            <div className="space-y-1">
              <p className={conditionalClasses({
                light: 'text-xs sm:text-sm font-medium text-blue-900 truncate',
                dark: 'text-xs sm:text-sm font-medium text-blue-100 truncate'
              })}>{request.budget.name}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className={conditionalClasses({
                  light: 'text-xs text-blue-700',
                  dark: 'text-xs text-blue-300'
                })}>Disponible:</span>
                <span className={conditionalClasses({
                  light: 'text-xs sm:text-sm font-semibold text-blue-900',
                  dark: 'text-xs sm:text-sm font-semibold text-blue-100'
                })}>
                  {formatCurrency(parseFloat(request.budget.totalAmount) - parseFloat(request.budget.usedAmount))}
                </span>
              </div>
              {parseFloat(request.estimatedCost) > (parseFloat(request.budget.totalAmount) - parseFloat(request.budget.usedAmount)) && (
                <div className={conditionalClasses({
                  light: 'flex items-center gap-1 text-red-600 text-xs',
                  dark: 'flex items-center gap-1 text-red-400 text-xs'
                })}>
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="text-xs">Excede presupuesto</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requester */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={conditionalClasses({
            light: 'w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0',
            dark: 'w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center shrink-0'
          })}>
            <FaUserCircle className={conditionalClasses({
              light: 'w-3 h-3 sm:w-4 sm:h-4 text-gray-600',
              dark: 'w-3 h-3 sm:w-4 sm:h-4 text-gray-400'
            })} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={conditionalClasses({
              light: 'text-xs font-semibold text-gray-500 uppercase tracking-wide',
              dark: 'text-xs font-semibold text-gray-400 uppercase tracking-wide'
            })}>Solicitante</p>
            <p className={conditionalClasses({
              light: 'text-xs sm:text-sm font-medium text-gray-900 truncate',
              dark: 'text-xs sm:text-sm font-medium text-gray-100 truncate'
            })}>{request.requester?.name || 'Usuario'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className={conditionalClasses({
          light: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-100',
          dark: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-700'
        })}>
          <div className={conditionalClasses({
            light: 'text-xs text-gray-500',
            dark: 'text-xs text-gray-400'
          })}>
            <span className="hidden sm:inline">Actualizado </span>
            <span className="sm:hidden">Act: </span>
            {getTimeAgo(request.updatedAt)}
          </div>
          <div className={conditionalClasses({
            light: 'text-xs text-gray-500',
            dark: 'text-xs text-gray-400'
          })}>
            <span className="hidden sm:inline">Creado </span>
            <span className="sm:hidden">Creado: </span>
            {getTimeAgo(request.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestCard;

