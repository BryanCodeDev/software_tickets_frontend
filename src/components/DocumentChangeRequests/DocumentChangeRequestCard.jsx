import React, { memo } from 'react';
import { FaEdit, FaEye, FaFileAlt, FaCheck, FaClock, FaTimes, FaSpinner, FaArrowRight, FaExclamationTriangle, FaCheckCircle, FaLayerGroup } from 'react-icons/fa';
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
        color: conditionalClasses({ light: 'bg-slate-100 text-slate-700 border-slate-300', dark: 'bg-slate-700/50 text-slate-300 border-slate-600' }),
        bg: conditionalClasses({ light: 'from-slate-50 to-slate-100', dark: 'from-slate-800 to-slate-700' }),
        icon: FaLayerGroup,
        label: 'Borrador',
        desc: 'Pendiente por enviar'
      },
      'pendiente_revision': {
        color: conditionalClasses({ light: 'bg-amber-100 text-amber-700 border-amber-300', dark: 'bg-amber-900/30 text-amber-300 border-amber-700' }),
        bg: conditionalClasses({ light: 'from-amber-50 to-amber-100', dark: 'from-amber-900/20 to-amber-800/20' }),
        icon: FaClock,
        label: 'Pendiente Revisión',
        desc: 'Esperando revisión de Calidad'
      },
      'en_revision': {
        color: conditionalClasses({ light: 'bg-blue-100 text-blue-700 border-blue-300', dark: 'bg-blue-900/30 text-blue-300 border-blue-700' }),
        bg: conditionalClasses({ light: 'from-blue-50 to-blue-100', dark: 'from-blue-900/20 to-blue-800/20' }),
        icon: FaSpinner,
        label: 'En Revisión',
        desc: 'En proceso de evaluación'
      },
      'aprobado': {
        color: conditionalClasses({ light: 'bg-emerald-100 text-emerald-700 border-emerald-300', dark: 'bg-emerald-900/30 text-emerald-300 border-emerald-700' }),
        bg: conditionalClasses({ light: 'from-emerald-50 to-emerald-100', dark: 'from-emerald-900/20 to-emerald-800/20' }),
        icon: FaCheck,
        label: 'Aprobado',
        desc: 'Esperando implementación'
      },
      'en_implementacion': {
        color: conditionalClasses({ light: 'bg-purple-100 text-purple-700 border-purple-300', dark: 'bg-purple-900/30 text-purple-300 border-purple-700' }),
        bg: conditionalClasses({ light: 'from-purple-50 to-purple-100', dark: 'from-purple-900/20 to-purple-800/20' }),
        icon: FaSpinner,
        label: 'En Implementación',
        desc: 'Ejecutando cambios'
      },
      'publicado': {
        color: conditionalClasses({ light: 'bg-green-100 text-green-700 border-green-300', dark: 'bg-green-900/30 text-green-300 border-green-700' }),
        bg: conditionalClasses({ light: 'from-green-50 to-green-100', dark: 'from-green-900/20 to-green-800/20' }),
        icon: FaCheckCircle,
        label: 'Publicado',
        desc: 'Cambio implementado'
      },
      'rechazado': {
        color: conditionalClasses({ light: 'bg-red-100 text-red-700 border-red-300', dark: 'bg-red-900/30 text-red-300 border-red-700' }),
        bg: conditionalClasses({ light: 'from-red-50 to-red-100', dark: 'from-red-900/20 to-red-800/20' }),
        icon: FaTimes,
        label: 'Rechazado',
        desc: 'No procede'
      }
    };
    return configs[status] || configs['borrador'];
  };

  const getTypeConfig = (type) => {
    const configs = {
      'create': { label: 'Crear', icon: '➕', color: 'text-green-600' },
      'edit': { label: 'Editar', icon: '✏️', color: 'text-blue-600' },
      'delete': { label: 'Eliminar', icon: '🗑️', color: 'text-red-600' },
      'version_update': { label: 'Nueva Versión', icon: '📄', color: 'text-purple-600' }
    };
    return configs[type] || { label: type, icon: '📋', color: 'text-gray-600' };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'urgente': { color: 'bg-red-500', text: 'text-red-600', darkText: 'text-red-400', label: 'Urgente' },
      'alta': { color: 'bg-orange-500', text: 'text-orange-600', darkText: 'text-orange-400', label: 'Alta' },
      'media': { color: 'bg-yellow-500', text: 'text-yellow-600', darkText: 'text-yellow-400', label: 'Media' },
      'baja': { color: 'bg-green-500', text: 'text-green-600', darkText: 'text-green-400', label: 'Baja' }
    };
    return configs[priority] || configs['media'];
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const statusConfig = getStatusConfig(request.workflowStatus);
  const typeConfig = getTypeConfig(request.requestType);
  const priorityConfig = getPriorityConfig(request.priority);
  const StatusIcon = statusConfig.icon;

  const progressPercent = ((request.currentStep || 1) / (request.totalSteps || 5)) * 100;

  return (
    <div
      className={`
        rounded-2xl border-2 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer
        ${conditionalClasses({
          light: 'bg-white border-gray-100 hover:border-purple-300',
          dark: 'bg-gray-800 border-gray-700 hover:border-purple-500'
        })}
      `}
      onClick={() => onViewDetail(request)}
    >
      {/* Card Header - Status Bar */}
      <div className={`
        p-4 border-b-0
        ${statusConfig.bg}
        ${conditionalClasses({ light: 'border-gray-100', dark: 'border-gray-700' })}
      `}>
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.text} ${conditionalClasses({ dark: priorityConfig.darkText })}`}>
              {priorityConfig.label}
            </span>
          </div>
          
          {/* Request ID */}
          <span className={conditionalClasses({ light: 'text-sm font-bold text-gray-400', dark: 'text-sm font-bold text-gray-500' })}>
            #{request.id}
          </span>
        </div>

        {/* Title */}
        <h3 className={`
          text-base font-bold mt-3 line-clamp-2
          ${conditionalClasses({
            light: 'text-gray-900',
            dark: 'text-white'
          })}
        `}>{request.title}</h3>
        
        {/* Description Preview */}
        <p className={`
          text-sm mt-2 line-clamp-2
          ${conditionalClasses({
            light: 'text-gray-500',
            dark: 'text-gray-400'
          })}
        `}>{request.description}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}>Progreso</span>
            <span className={`font-semibold ${priorityConfig.text} ${conditionalClasses({ dark: priorityConfig.darkText })}`}>
              Paso {request.currentStep} / {request.totalSteps}
            </span>
          </div>
          <div className={`
            h-2 rounded-full overflow-hidden
            ${conditionalClasses({
              light: 'bg-gray-200',
              dark: 'bg-gray-600'
            })}
          `}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className={`
        p-4 flex items-center justify-between
        ${conditionalClasses({
          light: 'bg-gray-50 border-t border-gray-100',
          dark: 'bg-gray-800 border-t border-gray-700'
        })}
      `}>
        {/* Requester & Time */}
        <div className="flex items-center gap-3">
          <div className={`
            w-9 h-9 rounded-full flex items-center justify-center shrink-0
            ${conditionalClasses({
              light: 'bg-purple-100',
              dark: 'bg-purple-900/50'
            })}
          `}>
            <span className={conditionalClasses({
              light: 'text-purple-600 font-semibold text-sm',
              dark: 'text-purple-400 font-semibold text-sm'
            })}>
              {(request.requester?.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-medium ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
              {request.requester?.name || 'Usuario'}
            </p>
            <p className={`text-xs ${conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' })}`}>
              {getTimeAgo(request.updatedAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {canApprove && canApprove(request) && !['borrador', 'publicado', 'rechazado'].includes(request.workflowStatus) && (
            <button
              onClick={() => onViewDetail(request)}
              className={conditionalClasses({
                light: 'p-2.5 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 transition-all',
                dark: 'p-2.5 rounded-xl bg-green-900/50 hover:bg-green-800/60 text-green-400 transition-all'
              })}
              title="Aprobar"
            >
              <FaCheck className="w-4 h-4" />
            </button>
          )}
          {canEdit && canEdit(request) && request.workflowStatus === 'borrador' && (
            <button
              onClick={() => onEdit(request)}
              className={conditionalClasses({
                light: 'p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all',
                dark: 'p-2.5 rounded-xl bg-blue-900/50 hover:bg-blue-800/60 text-blue-400 transition-all'
              })}
              title="Editar"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          )}
          <button
            className={conditionalClasses({
              light: 'p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all',
              dark: 'p-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-400 transition-all'
            })}
            title="Ver detalles"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MemoizedDocumentChangeRequestCard = memo(DocumentChangeRequestCard);
MemoizedDocumentChangeRequestCard.displayName = 'DocumentChangeRequestCard';

export default MemoizedDocumentChangeRequestCard;
