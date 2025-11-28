import React from 'react';
import { FaEdit, FaEye, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaCheck, FaClock, FaUserCircle } from 'react-icons/fa';

const TicketCard = ({
  ticket,
  onViewDetail,
  onEdit,
  canEditTicket,
  userRole
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'abierto': 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
      'en progreso': 'bg-blue-100 text-blue-700 border-blue-200',
      'cerrado': 'bg-gray-200 text-gray-700 border-gray-300',
      'resuelto': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': 'bg-red-100 text-red-700 border-red-200',
      'media': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'baja': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
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
      className="bg-gray-50 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => onViewDetail(ticket)}
    >
      {/* Card Header */}
      <div className={`p-3 lg:p-4 border-b-2 ${
        ticket.priority === 'alta' ? 'bg-linear-to-r from-red-50 to-red-100 border-red-200' :
        ticket.priority === 'media' ? 'bg-linear-to-r from-yellow-50 to-yellow-100 border-yellow-200' :
        'bg-linear-to-r from-green-50 to-green-100 border-green-200'
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
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 truncate">{ticket.title}</h3>
            <p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
          </div>
          {canEditTicket(ticket) && (
            <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit(ticket)}
                className="p-1.5 lg:p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
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
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{ticket.description}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f3ebf9] rounded-full flex items-center justify-center shrink-0">
              <FaUserCircle className="w-5 h-5 lg:w-6 lg:h-6 text-[#662d91]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Creado por</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {ticket.creator?.name || 'Usuario'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Asignado a</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {ticket.assignee?.name || 'Sin asignar'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Actualizado</p>
              <p className="text-sm font-semibold text-gray-900">{getTimeAgo(ticket.updatedAt)}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
              </span>
              <button className="flex items-center gap-1 text-[#662d91] hover:text-[#662d91] font-semibold">
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

export default TicketCard;

