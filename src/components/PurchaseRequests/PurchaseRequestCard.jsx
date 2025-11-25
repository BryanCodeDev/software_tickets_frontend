import React from 'react';
import { FaEye, FaClock, FaCheck, FaTimes, FaArrowRight, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { getTimeAgo } from '../../utils';

const PurchaseRequestCard = ({ request, onViewDetail, userRole }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-200 overflow-hidden">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-purple-600 text-lg">#{request.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                {request.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2 line-clamp-2 leading-tight">
              {request.title}
            </h3>
          </div>
          <button
            onClick={() => onViewDetail(request)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shrink-0 ml-2"
            title="Ver detalles"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {request.description}
        </p>

        {/* Item Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
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
        <div className="mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Costo Estimado</span>
          <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(request.estimatedCost)}</p>
        </div>

        {/* Requester */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <FaUserCircle className="w-4 h-4 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solicitante</p>
            <p className="text-sm font-medium text-gray-900 truncate">{request.requester?.name || 'Usuario'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Actualizado {getTimeAgo(request.updatedAt)}
          </div>
          <div className="text-xs text-gray-500">
            Creado {getTimeAgo(request.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestCard;