import React from 'react';
import { FaEdit, FaTrash, FaEye, FaClock, FaCheck, FaTimes, FaCopy, FaArrowRight } from 'react-icons/fa';
import { getTimeAgo } from '../../utils';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const PurchaseRequestCard = ({ request, onViewDetail, onEdit, onDelete, user, userRole }) => {
  const { conditionalClasses } = useThemeClasses();

  const getStatusColor = (status) => {
    const colors = {
      'solicitado': 'bg-blue-100 text-blue-700 border-blue-200',
      'pendiente_coordinadora': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'aprobado_coordinadora': 'bg-orange-100 text-orange-700 border-orange-200',
      'pendiente_jefe': 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
      'aprobado_jefe': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'en_compras': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'comprado': 'bg-teal-100 text-teal-700 border-teal-200',
      'entregado': 'bg-green-100 text-green-700 border-green-200',
      'rechazado': 'bg-red-100 text-red-700 border-red-200',
      'rechazado_correccion': 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'solicitado': 'Solicitado',
      'pendiente_coordinadora': 'Pendiente Coordinadora',
      'aprobado_coordinadora': 'Aprobado por Coordinadora',
      'pendiente_jefe': 'Pendiente Jefe',
      'aprobado_jefe': 'Aprobado por Jefe',
      'en_compras': 'En Compras',
      'comprado': 'Comprado',
      'entregado': 'Entregado',
      'rechazado': 'Rechazado',
      'rechazado_correccion': 'Para Corrección'
    };
    return labels[status?.toLowerCase()] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'baja': 'bg-gray-100 text-gray-600',
      'media': 'bg-yellow-100 text-yellow-600',
      'alta': 'bg-orange-100 text-orange-600',
      'critica': 'bg-red-100 text-red-600'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const canEdit = () => {
    const editableStatuses = ['solicitado', 'rechazado_correccion'];
    if (!editableStatuses.includes(request.status)) return false;
    if (['Administrador', 'Jefe', 'Coordinadora Administrativa', 'Técnico', 'Calidad'].includes(userRole)) return true;
    return request.userId === user?.id;
  };

  const canDelete = () => {
    const deletableStatuses = ['solicitado', 'rechazado_correccion'];
    if (!deletableStatuses.includes(request.status)) return false;
    if (['Administrador', 'Jefe', 'Coordinadora Administrativa', 'Técnico', 'Calidad'].includes(userRole)) return true;
    return request.userId === user?.id;
  };

  const canResubmit = () => {
    return request.status === 'rechazado_correccion' && request.userId === user?.id;
  };

  return (
    <div className={conditionalClasses({
      light: `bg-white rounded-xl shadow-md border-2 border-gray-200 hover:shadow-lg transition-all duration-200`,
      dark: `bg-gray-800 rounded-xl shadow-md border-2 border-gray-700 hover:shadow-lg transition-all duration-200`
    })}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={conditionalClasses({
                light: 'font-bold text-[#662d91]',
                dark: 'font-bold text-purple-400'
              })}>#{request.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
              {request.rejectionCount > 0 && (
                <span className={conditionalClasses({
                  light: 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
                  dark: 'px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-400'
                })}>
                  {request.rejectionCount} {request.rejectionCount === 1 ? 'rechazo' : 'rechazos'}
                </span>
              )}
            </div>
            <h3 className={conditionalClasses({
              light: 'font-semibold text-gray-900 text-lg truncate',
              dark: 'font-semibold text-white text-lg truncate'
            })}>
              {request.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(request.priority || 'media')}`}>
              {request.priority || 'media'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <span className={conditionalClasses({
              light: 'text-gray-500 text-xs uppercase tracking-wide',
              dark: 'text-gray-400 text-xs uppercase tracking-wide'
            })}>Tipo</span>
            <p className={conditionalClasses({
              light: 'font-medium text-gray-900 capitalize',
              dark: 'font-medium text-white capitalize'
            })}>{request.itemType}</p>
          </div>
          <div>
            <span className={conditionalClasses({
              light: 'text-gray-500 text-xs uppercase tracking-wide',
              dark: 'text-gray-400 text-xs uppercase tracking-wide'
            })}>Cantidad</span>
            <p className={conditionalClasses({
              light: 'font-medium text-gray-900',
              dark: 'font-medium text-white'
            })}>{request.quantity}</p>
          </div>
          <div className="col-span-2">
            <span className={conditionalClasses({
              light: 'text-gray-500 text-xs uppercase tracking-wide',
              dark: 'text-gray-400 text-xs uppercase tracking-wide'
            })}>Costo Estimado</span>
            <p className={conditionalClasses({
              light: 'font-bold text-lg text-green-600',
              dark: 'font-bold text-lg text-green-400'
            })}>{formatCurrency(request.estimatedCost)}</p>
          </div>
        </div>

        <p className={conditionalClasses({
          light: 'text-gray-600 text-sm line-clamp-2 mb-4',
          dark: 'text-gray-400 text-sm line-clamp-2 mb-4'
        })}>
          {request.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={conditionalClasses({
              light: 'text-gray-500',
              dark: 'text-gray-400'
            })}>
              <span className="font-medium">{request.requester?.name || 'Usuario'}</span>
            </span>
          </div>
          <div className={conditionalClasses({
            light: 'text-gray-500 flex items-center gap-1',
            dark: 'text-gray-400 flex items-center gap-1'
          })}>
            <FaClock className="w-3 h-3" />
            <span>{getTimeAgo(request.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={conditionalClasses({
        light: 'px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-end gap-2',
        dark: 'px-4 py-3 border-t border-gray-600 bg-gray-700 rounded-b-xl flex items-center justify-end gap-2'
      })}>
        <button
          onClick={() => onViewDetail(request)}
          className={conditionalClasses({
            light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
            dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors'
          })}
          title="Ver detalles"
        >
          <FaEye className="w-4 h-4" />
        </button>

        {canEdit() && (
          <button
            onClick={() => onEdit(request)}
            className={conditionalClasses({
              light: 'p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors',
              dark: 'p-2 text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors'
            })}
            title="Editar"
          >
            <FaEdit className="w-4 h-4" />
          </button>
        )}

        {canResubmit() && (
          <button
            onClick={() => onViewDetail(request)}
            className={conditionalClasses({
              light: 'p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors',
              dark: 'p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors'
            })}
            title="Reenviar tras corrección"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        )}

        {canDelete() && (
          <button
            onClick={() => onDelete(request)}
            className={conditionalClasses({
              light: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
              dark: 'p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors'
            })}
            title="Eliminar"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseRequestCard;
