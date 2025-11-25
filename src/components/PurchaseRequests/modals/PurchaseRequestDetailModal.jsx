import React, { useState, useContext } from 'react';
import { FaTimes, FaCheck, FaTimes as FaReject, FaArrowRight, FaCheckCircle, FaClock, FaUserCircle, FaComment } from 'react-icons/fa';
import { purchaseRequestsAPI } from '../../../api';
import AuthContext from '../../../context/AuthContext';
import { getTimeAgo } from '../../../utils';

const PurchaseRequestDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  selectedRequest,
  user
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionComments, setActionComments] = useState('');

  const userRole = user?.role?.name;

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const canApproveAsCoordinator = () => {
    return userRole === 'Coordinadora Administrativa' || userRole === 'Administrador';
  };

  const canApproveAsManager = () => {
    return userRole === 'Jefe' || userRole === 'Administrador';
  };

  const canMarkAsPurchased = () => {
    return userRole === 'Compras' || userRole === 'Administrador';
  };

  const canMarkAsDelivered = () => {
    return userRole === 'Compras' || userRole === 'Administrador';
  };

  const canReject = () => {
    return ['Coordinadora Administrativa', 'Jefe', 'Compras', 'Administrador'].includes(userRole);
  };

  const handleApproveAsCoordinator = async () => {
    if (!canApproveAsCoordinator()) return;

    setActionLoading(true);
    try {
      await purchaseRequestsAPI.approveAsCoordinator(selectedRequest.id, {
        comments: actionComments
      });
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving as coordinator:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAsManager = async () => {
    if (!canApproveAsManager()) return;

    setActionLoading(true);
    try {
      await purchaseRequestsAPI.approveAsManager(selectedRequest.id, {
        comments: actionComments
      });
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving as manager:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPurchased = async () => {
    if (!canMarkAsPurchased()) return;

    setActionLoading(true);
    try {
      await purchaseRequestsAPI.markAsPurchased(selectedRequest.id, {
        comments: actionComments
      });
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error marking as purchased:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    if (!canMarkAsDelivered()) return;

    setActionLoading(true);
    try {
      await purchaseRequestsAPI.markAsDelivered(selectedRequest.id, {
        comments: actionComments
      });
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error marking as delivered:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!canReject() || !rejectionReason.trim()) return;

    setActionLoading(true);
    try {
      await purchaseRequestsAPI.rejectPurchaseRequest(selectedRequest.id, {
        rejectionReason: rejectionReason.trim()
      });
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error rejecting purchase request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getWorkflowSteps = () => {
    const steps = [
      { status: 'solicitado', label: 'Solicitado', description: 'Solicitud creada por el usuario' },
      { status: 'pendiente_coordinadora', label: 'Pendiente Coordinadora', description: 'Esperando aprobación de coordinadora administrativa' },
      { status: 'aprobado_coordinadora', label: 'Aprobado por Coordinadora', description: 'Aprobado por coordinadora administrativa' },
      { status: 'pendiente_jefe', label: 'Pendiente Jefe', description: 'Esperando aprobación final del jefe' },
      { status: 'aprobado_jefe', label: 'Aprobado por Jefe', description: 'Aprobado por el jefe' },
      { status: 'en_compras', label: 'En Compras', description: 'Procesando compra en departamento de compras' },
      { status: 'comprado', label: 'Comprado', description: 'Ítem adquirido' },
      { status: 'entregado', label: 'Entregado', description: 'Ítem entregado al solicitante' }
    ];

    if (selectedRequest?.status === 'rechazado') {
      steps.push({ status: 'rechazado', label: 'Rechazado', description: 'Solicitud rechazada' });
    }

    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getWorkflowSteps();
    return steps.findIndex(step => step.status === selectedRequest?.status);
  };

  if (!showDetailModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] border border-gray-200 transform animate-scale-in flex flex-col">
        <div className="p-4 lg:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">#{selectedRequest.id}</span>
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 line-clamp-1">{selectedRequest.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(selectedRequest.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Details */}
              <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles de la Solicitud</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tipo de Ítem</span>
                    <p className="text-base font-medium text-gray-900 mt-1 capitalize">{selectedRequest.itemType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cantidad</span>
                    <p className="text-base font-medium text-gray-900 mt-1">{selectedRequest.quantity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Costo Estimado</span>
                    <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(selectedRequest.estimatedCost)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Descripción</span>
                    <p className="text-base text-gray-900 mt-1 leading-relaxed">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Justificación</span>
                    <p className="text-base text-gray-900 mt-1 leading-relaxed">{selectedRequest.justification}</p>
                  </div>
                </div>
              </div>

              {/* Workflow Timeline */}
              <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Progreso del Workflow</h3>

                <div className="space-y-3">
                  {getWorkflowSteps().map((step, index) => {
                    const currentIndex = getCurrentStepIndex();
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const isRejected = selectedRequest.status === 'rechazado' && step.status === 'rechazado';

                    return (
                      <div key={step.status} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        isCurrent ? 'bg-blue-50 border border-blue-200' :
                        isCompleted ? 'bg-green-50 border border-green-200' :
                        'bg-gray-100 border border-gray-200'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isRejected ? 'bg-red-500' :
                          isCompleted ? 'bg-green-500' :
                          'bg-gray-300'
                        }`}>
                          {isRejected ? <FaTimes className="w-4 h-4 text-white" /> :
                           isCompleted ? <FaCheck className="w-4 h-4 text-white" /> :
                           <span className="text-xs font-bold text-gray-600">{index + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{step.label}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Approval History */}
              {selectedRequest.approvalHistory && selectedRequest.approvalHistory.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Aprobaciones</h3>

                  <div className="space-y-3">
                    {selectedRequest.approvalHistory.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <FaComment className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{action.userName}</span>
                            <span className="text-sm text-gray-500 capitalize">{action.action.replace('_', ' ')}</span>
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(new Date(action.timestamp))}
                            </span>
                          </div>
                          {action.comments && (
                            <p className="text-sm text-gray-700">{action.comments}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedRequest.status === 'rechazado' && selectedRequest.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Motivo de Rechazo</h3>
                  <p className="text-base text-red-800">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Requester Info */}
              <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Solicitante</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedRequest.requester?.name}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.requester?.email}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(canApproveAsCoordinator() || canApproveAsManager() || canMarkAsPurchased() || canMarkAsDelivered() || canReject()) &&
               selectedRequest.status !== 'rechazado' && selectedRequest.status !== 'entregado' && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Disponibles</h3>

                  <div className="space-y-3">
                    {/* Coordinator Approval */}
                    {canApproveAsCoordinator() && selectedRequest.status === 'pendiente_coordinadora' && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Comentarios (opcional)..."
                          value={actionComments}
                          onChange={(e) => setActionComments(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                          rows={2}
                        />
                        <button
                          onClick={handleApproveAsCoordinator}
                          disabled={actionLoading}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {actionLoading ? 'Procesando...' : 'Aprobar como Coordinadora'}
                        </button>
                      </div>
                    )}

                    {/* Manager Approval */}
                    {canApproveAsManager() && selectedRequest.status === 'pendiente_jefe' && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Comentarios (opcional)..."
                          value={actionComments}
                          onChange={(e) => setActionComments(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                          rows={2}
                        />
                        <button
                          onClick={handleApproveAsManager}
                          disabled={actionLoading}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {actionLoading ? 'Procesando...' : 'Aprobar como Jefe'}
                        </button>
                      </div>
                    )}

                    {/* Mark as Purchased */}
                    {canMarkAsPurchased() && selectedRequest.status === 'en_compras' && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Comentarios (opcional)..."
                          value={actionComments}
                          onChange={(e) => setActionComments(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                          rows={2}
                        />
                        <button
                          onClick={handleMarkAsPurchased}
                          disabled={actionLoading}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {actionLoading ? 'Procesando...' : 'Marcar como Comprado'}
                        </button>
                      </div>
                    )}

                    {/* Mark as Delivered */}
                    {canMarkAsDelivered() && selectedRequest.status === 'comprado' && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Comentarios (opcional)..."
                          value={actionComments}
                          onChange={(e) => setActionComments(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                          rows={2}
                        />
                        <button
                          onClick={handleMarkAsDelivered}
                          disabled={actionLoading}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {actionLoading ? 'Procesando...' : 'Marcar como Entregado'}
                        </button>
                      </div>
                    )}

                    {/* Reject */}
                    {canReject() && !['rechazado', 'entregado'].includes(selectedRequest.status) && (
                      <div className="space-y-2">
                        {!showRejectForm ? (
                          <button
                            onClick={() => setShowRejectForm(true)}
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
                          >
                            Rechazar Solicitud
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              placeholder="Motivo del rechazo (requerido)..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none bg-red-50"
                              rows={3}
                              required
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setShowRejectForm(false);
                                  setRejectionReason('');
                                }}
                                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={handleReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                              >
                                {actionLoading ? 'Procesando...' : 'Confirmar Rechazo'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestDetailModal;