import React, { memo } from 'react';
import { FaEdit, FaEye, FaFileAlt, FaCheck, FaClock, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const DocumentChangeRequestCard = ({
  request,
  onViewDetail,
  onEdit,
  canEdit,
  canApprove,
  onApprove
}) => {
  const { conditionalClasses } = useThemeClasses();

  const getStatusConfig = (status) => {
    const configs = {
      'borrador': {
        color: conditionalClasses({ light: 'bg-gray-100 text-gray-700 border-gray-300', dark: 'bg-gray-700 text-gray-300 border-gray-600' }),
        icon: FaEdit,
        label: 'Borrador'
      },
      'pendiente_revision': {
        color: conditionalClasses({ light: 'bg-yellow-100 text-yellow-700 border-yellow-300', dark: 'bg-yellow-900/30 text-yellow-300 border-yellow-700' }),
        icon: FaClock,
        label: 'Pendiente Revisión'
      },
      'en_revision': {
        color: conditionalClasses({ light: 'bg-blue-100 text-blue-700 border-blue-300', dark: 'bg-blue-900/30 text-blue-300 border-blue-700' }),
        icon: FaSpinner,
        label: 'En Revisión'
      },
      'aprobado': {
        color: conditionalClasses({ light: 'bg-green-100 text-green-700 border-green-300', dark: 'bg-green-900/30 text-green-300 border-green-700' }),
        icon: FaCheck,
        label: 'Aprobado'
      },
      'en_implementacion': {
        color: conditionalClasses({ light: 'bg-purple-100 text-purple-700 border-purple-300', dark: 'bg-purple-900/30 text-purple-300 border-purple-700' }),
        icon: FaSpinner,
        label: 'En Implementación'
      },
      'publicado': {
        color: conditionalClasses({ light: 'bg-emerald-100 text-emerald-700 border-emerald-300', dark: 'bg-emerald-900/30 text-emerald-300 border-emerald-700' }),
        icon: FaCheck,
        label: 'Publicado'
      },
      'rechazado': {
        color: conditionalClasses({ light: 'bg-red-100 text-red-700 border-red-300', dark: 'bg-red-900/30 text-red-300 border-red-700' }),
        icon: FaTimes,
        label: 'Rechazado'
      },
      'cancelado': {
        color: conditionalClasses({ light: 'bg-gray-200 text-gray-500 border-gray-300', dark: 'bg-gray-700 text-gray-400 border-gray-600' }),
        icon: FaTimes,
        label: 'Cancelado'
      }
    };
    return configs[status] || configs['borrador'];
  };

  const getTypeConfig = (type) => {
    const configs = {
      'create': { label: 'Crear', icon: '➕' },
      'edit': { label: 'Editar', icon: '✏️' },
      'delete': { label: 'Eliminar', icon: '🗑️' },
      'version_update': { label: 'Nueva Versión', icon: '📄' }
    };
    return configs[type] || { label: type, icon: '📋' };
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'urgente': conditionalClasses({ light: 'bg-red-100 text-red-700', dark: 'bg-red-900/30 text-red-300' }),
      'alta': conditionalClasses({ light: 'bg-orange-100 text-orange-700', dark: 'bg-orange-900/30 text-orange-300' }),
      'media': conditionalClasses({ light: 'bg-yellow-100 text-yellow-700', dark: 'bg-yellow-900/30 text-yellow-300' }),
      'baja': conditionalClasses({ light: 'bg-green-100 text-green-700', dark: 'bg-green-900/30 text-green-300' })
    };
    return colors[priority] || colors['media'];
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

  const statusConfig = getStatusConfig(request.workflowStatus);
  const typeConfig = getTypeConfig(request.requestType);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`
        rounded-xl lg:rounded-2xl border-2 hover:border-purple-500 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer
        ${conditionalClasses({
          light: 'bg-gray-50 border-gray-200',
          dark: 'bg-gray-800 border-gray-700'
        })}
      `}
      onClick={() => onViewDetail(request)}
    >
      {/* Card Header */}
      <div className={`
        p-3 lg:p-4 border-b-2
        ${request.priority === 'urgente' ? conditionalClasses({
          light: 'bg-linear-to-r from-red-50 to-red-100 border-red-200',
          dark: 'bg-linear-to-r from-red-900/20 to-red-800/20 border-red-700'
        }) :
        request.priority === 'alta' ? conditionalClasses({
          light: 'bg-linear-to-r from-orange-50 to-orange-100 border-orange-200',
          dark: 'bg-linear-to-r from-orange-900/20 to-orange-800/20 border-orange-700'
        }) :
        conditionalClasses({
          light: 'bg-linear-to-r from-green-50 to-green-100 border-green-200',
          dark: 'bg-linear-to-r from-green-900/20 to-green-800/20 border-green-700'
        })
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
                <StatusIcon className="inline w-3 h-3 mr-1" />
                {statusConfig.label}
              </span>
              <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${conditionalClasses({
                light: 'bg-gray-200 text-gray-700',
                dark: 'bg-gray-600 text-gray-200'
              })}`}>
                {typeConfig.icon} {typeConfig.label}
              </span>
            </div>
            <h3 className={`
              text-base lg:text-lg font-bold mb-1 truncate
              ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-gray-100'
              })}
            `}>{request.title}</h3>
            <p className="text-xs text-gray-500">#{request.id}</p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
            {canApprove && canApprove(request) && request.workflowStatus !== 'borrador' && request.workflowStatus !== 'publicado' && request.workflowStatus !== 'rechazado' && (
              <button
                onClick={() => onApprove(request)}
                className={`p-1.5 lg:p-2 rounded-lg transition-all ${conditionalClasses({
                  light: 'bg-green-100 hover:bg-green-200 text-green-600',
                  dark: 'bg-green-900/30 hover:bg-green-800/40 text-green-400'
                })}`}
                title="Aprobar"
              >
                <FaCheck className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            )}
            {canEdit && canEdit(request) && (
              <button
                onClick={() => onEdit(request)}
                className={`p-1.5 lg:p-2 rounded-lg transition-all ${conditionalClasses({
                  light: 'bg-blue-100 hover:bg-blue-200 text-blue-600',
                  dark: 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-400'
                })}`}
                title="Editar"
              >
                <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            )}
          </div>
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
        `}>{request.description}</p>

        {/* Workflow Progress */}
        <div className="mb-4">
          <div className={`
            flex items-center justify-between text-xs mb-1
            ${conditionalClasses({
              light: 'text-gray-500',
              dark: 'text-gray-400'
            })}
          `}>
            <span>Progreso del Workflow</span>
            <span>Paso {request.currentStep} de {request.totalSteps}</span>
          </div>
          <div className={`
            w-full h-2 rounded-full overflow-hidden
            ${conditionalClasses({
              light: 'bg-gray-200',
              dark: 'bg-gray-700'
            })}
          `}>
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(request.currentStep / request.totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* Requester */}
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
              <span className={conditionalClasses({
                light: 'text-[#662d91]',
                dark: 'text-purple-400'
              })}>👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500">Solicitado por</p>
              <p className={`text-sm font-bold truncate ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-gray-100'
              })}`}>
                {request.requester?.name || 'Usuario'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className={`
            pt-3 border-t flex items-center justify-between
            ${conditionalClasses({
              light: 'border-gray-100',
              dark: 'border-gray-700'
            })}
          `}>
            <span className={`flex items-center gap-1 text-xs ${conditionalClasses({
              light: 'text-gray-500',
              dark: 'text-gray-400'
            })}`}>
              <FaClock className="w-3 h-3" />
              {getTimeAgo(request.updatedAt)}
            </span>
            
            <button className={`
              flex items-center gap-1 text-xs font-semibold hover:underline
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
  );
};

const MemoizedDocumentChangeRequestCard = memo(DocumentChangeRequestCard);
MemoizedDocumentChangeRequestCard.displayName = 'DocumentChangeRequestCard';

export default MemoizedDocumentChangeRequestCard;
