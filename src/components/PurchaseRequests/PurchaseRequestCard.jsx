import React from 'react';
import { FaEye, FaClock, FaCheck, FaTimes, FaArrowRight, FaCheckCircle, FaUserCircle, FaEdit, FaTrash, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import { getTimeAgo } from '../../utils';

const PurchaseRequestCard = ({ request, onViewDetail, onEdit, onDelete, userRole }) => {
  const getStatusColor = (status) => {
    const colors = {
      'solicitado': 'bg-blue-100 text-blue-700 border-blue-200',
      'pendiente_coordinadora': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'aprobado_coordinadora': 'bg-orange-100 text-orange-700 border-orange-200',
      'pendiente_jefe': 'bg-purple-100 text-purple-700 border-purple-200',
      'aprobado_jefe': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'en_compras': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'comprado': 'bg-teal-100 text-teal-700 border-teal-200',
      'entregado': 'bg-green-100 text-green-700 border-green-200',
      'rechazado': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
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
      'periferico': 'bg-blue-100 text-blue-700',
      'electrodomestico': 'bg-green-100 text-green-700',
      'software': 'bg-purple-100 text-purple-700',
      'otro': 'bg-gray-100 text-gray-700'
    };
    return colors[itemType?.toLowerCase()] || 'bg-gray-100 text-gray-700';
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

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-200 overflow-hidden ${
      isUrgent() ? 'border-red-300 ring-2 ring-red-100' : hasBudgetIssue() ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'
    }`}>
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-bold text-purple-600 text-base sm:text-lg">#{request.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="hidden sm:inline">{request.status}</span>
                <span className="sm:hidden">Pendiente</span>
              </span>
              {isUrgent() && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full inline-flex items-center gap-1">
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="hidden sm:inline">Urgente</span>
                  <span className="sm:hidden">!</span>
                </span>
              )}
              {hasBudgetIssue() && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full inline-flex items-center gap-1">
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="hidden sm:inline">Presupuesto</span>
                  <span className="sm:hidden">$</span>
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 leading-tight">
              {request.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
            {userRole === 'Administrador' && (
              <>
                <button
                  onClick={() => onEdit && onEdit(request)}
                  className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  title="Editar solicitud"
                >
                  <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(request)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Eliminar solicitud"
                >
                  <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => onViewDetail(request)}
              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Ver detalles"
            >
              <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {request.description}
        </p>

        {/* Item Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</span>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getItemTypeColor(request.itemType)}`}>
                {request.itemType}
              </span>
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cantidad</span>
            <p className="text-sm font-semibold text-gray-900 mt-1">{request.quantity}</p>
          </div>
        </div>

        {/* Cost */}
        <div className="mb-3 sm:mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Costo Estimado</span>
          <p className="text-base sm:text-lg font-bold text-green-600 mt-1">{formatCurrency(request.estimatedCost)}</p>
        </div>

        {/* Budget Info */}
        {request.budget && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FaDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Presupuesto</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-blue-900 truncate">{request.budget.name}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs text-blue-700">Disponible:</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-900">
                  {formatCurrency(parseFloat(request.budget.totalAmount) - parseFloat(request.budget.usedAmount))}
                </span>
              </div>
              {parseFloat(request.estimatedCost) > (parseFloat(request.budget.totalAmount) - parseFloat(request.budget.usedAmount)) && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <FaExclamationTriangle className="w-3 h-3" />
                  <span className="text-xs">Excede presupuesto</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requester */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <FaUserCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solicitante</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{request.requester?.name || 'Usuario'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <span className="hidden sm:inline">Actualizado </span>
            <span className="sm:hidden">Act: </span>
            {getTimeAgo(request.updatedAt)}
          </div>
          <div className="text-xs text-gray-500">
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