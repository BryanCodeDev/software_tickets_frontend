import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCheck, FaTimes as FaReject, FaArrowRight, FaCheckCircle, FaClock, FaUserCircle, FaComment, FaPaperclip, FaDownload, FaTrash, FaUpload, FaCopy, FaUndo } from 'react-icons/fa';
import { purchaseRequestsAPI } from '../../../api';
import AuthContext from '../../../context/AuthContext';
import { getTimeAgo } from '../../../utils';
import { SERVER_BASE_URL } from '../../../utils/constants';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

const PurchaseRequestDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  selectedRequest,
  user,
  onResubmit,
  onDuplicate,
  onSuccess
}) => {
  const { conditionalClasses } = useThemeClasses();
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectForCorrection, setRejectForCorrection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionComments, setActionComments] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [correctionData, setCorrectionData] = useState({
    title: '',
    description: '',
    justification: '',
    quantity: 1,
    estimatedCost: '',
    correctionComments: ''
  });
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  const userRole = user?.role?.name;

  // Cargar datos iniciales
  useEffect(() => {
    if (showDetailModal && selectedRequest?.id) {
      loadAttachments();
      loadComments();
      initCorrectionData();
    }
  }, [showDetailModal, selectedRequest]);

  const initCorrectionData = () => {
    if (selectedRequest) {
      setCorrectionData({
        title: selectedRequest.title || '',
        description: selectedRequest.description || '',
        justification: selectedRequest.justification || '',
        quantity: selectedRequest.quantity || 1,
        estimatedCost: selectedRequest.estimatedCost || '',
        correctionComments: ''
      });
    }
  };

  const loadAttachments = useCallback(async () => {
    if (!selectedRequest?.id) return;
    setAttachmentsLoading(true);
    try {
      const data = await purchaseRequestsAPI.getAttachments(selectedRequest.id);
      setAttachments(data);
    } catch (error) {
      console.error('Error loading attachments:', error);
    } finally {
      setAttachmentsLoading(false);
    }
  }, [selectedRequest?.id]);

  const loadComments = useCallback(async () => {
    if (!selectedRequest?.id) return;
    setCommentsLoading(true);
    try {
      const data = await purchaseRequestsAPI.getComments(selectedRequest.id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  }, [selectedRequest?.id]);

  // Acciones de archivos
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await purchaseRequestsAPI.uploadAttachment(selectedRequest.id, file);
      loadAttachments();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;
    try {
      await purchaseRequestsAPI.deleteAttachment(selectedRequest.id, attachmentId);
      loadAttachments();
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const downloadAttachment = (attachment) => {
    const link = document.createElement('a');
    link.href = `${SERVER_BASE_URL}/${attachment.path}`;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Acciones de comentarios
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await purchaseRequestsAPI.addComment(selectedRequest.id, newComment.trim(), isInternalComment);
      setNewComment('');
      setIsInternalComment(false);
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return;
    try {
      await purchaseRequestsAPI.deleteComment(selectedRequest.id, commentId);
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Utilidades
  const getStatusColor = (status) => {
    const colors = {
      'solicitado': conditionalClasses({ light: 'bg-blue-100 text-blue-700 border-blue-200', dark: 'bg-blue-900/30 text-blue-300 border-blue-700/30' }),
      'pendiente_coordinadora': conditionalClasses({ light: 'bg-yellow-100 text-yellow-700 border-yellow-200', dark: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/30' }),
      'aprobado_coordinadora': conditionalClasses({ light: 'bg-orange-100 text-orange-700 border-orange-200', dark: 'bg-orange-900/30 text-orange-300 border-orange-700/30' }),
      'pendiente_jefe': conditionalClasses({ light: 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]', dark: 'bg-purple-900/30 text-purple-300 border-purple-700/30' }),
      'aprobado_jefe': conditionalClasses({ light: 'bg-indigo-100 text-indigo-700 border-indigo-200', dark: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30' }),
      'en_compras': conditionalClasses({ light: 'bg-cyan-100 text-cyan-700 border-cyan-200', dark: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30' }),
      'comprado': conditionalClasses({ light: 'bg-teal-100 text-teal-700 border-teal-200', dark: 'bg-teal-900/30 text-teal-300 border-teal-700/30' }),
      'entregado': conditionalClasses({ light: 'bg-green-100 text-green-700 border-green-200', dark: 'bg-green-900/30 text-green-300 border-green-700/30' }),
      'rechazado': conditionalClasses({ light: 'bg-red-100 text-red-700 border-red-200', dark: 'bg-red-900/30 text-red-300 border-red-700/30' }),
      'rechazado_correccion': conditionalClasses({ light: 'bg-amber-100 text-amber-700 border-amber-200', dark: 'bg-amber-900/30 text-amber-300 border-amber-700/30' })
    };
    return colors[status?.toLowerCase()] || conditionalClasses({ light: 'bg-gray-100 text-gray-600 border-gray-200', dark: 'bg-gray-700 text-gray-300 border-gray-600' });
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

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'solicitado':
      case 'pendiente_coordinadora': return <FaClock />;
      case 'aprobado_coordinadora':
      case 'aprobado_jefe': return <FaCheck />;
      case 'en_compras':
      case 'comprado': return <FaArrowRight />;
      case 'entregado': return <FaCheckCircle />;
      case 'rechazado':
      case 'rechazado_correccion': return <FaReject />;
      default: return <FaClock />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  // Permisos
  const canApproveAsCoordinator = () => {
    return (userRole === 'Coordinadora Administrativa' || userRole === 'Administrador') && selectedRequest?.status === 'pendiente_coordinadora';
  };

  const canApproveAsManager = () => {
    return (userRole === 'Jefe' || userRole === 'Administrador') && selectedRequest?.status === 'pendiente_jefe';
  };

  const canMarkAsPurchased = () => {
    return (userRole === 'Compras' || userRole === 'Administrador') && selectedRequest?.status === 'en_compras';
  };

  const canMarkAsDelivered = () => {
    return (userRole === 'Compras' || userRole === 'Administrador') && selectedRequest?.status === 'comprado';
  };

  const canReject = () => {
    return ['Coordinadora Administrativa', 'Jefe', 'Compras', 'Administrador'].includes(userRole) && 
           ['pendiente_coordinadora', 'pendiente_jefe', 'en_compras'].includes(selectedRequest?.status);
  };

  const canResubmit = () => {
    return selectedRequest?.status === 'rechazado_correccion' && selectedRequest?.userId === user?.id;
  };

  const canDuplicate = () => {
    return ['Administrador', 'Técnico', 'Empleado', 'Jefe', 'Coordinadora Administrativa', 'Calidad'].includes(userRole);
  };

  const canEdit = () => {
    return ['solicitado', 'rechazado_correccion'].includes(selectedRequest?.status) && selectedRequest?.userId === user?.id;
  };

  // Acciones de workflow
  const handleApproveAsCoordinator = async () => {
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.approveAsCoordinator(selectedRequest.id, { comments: actionComments });
      onSuccess?.('Aprobado por coordinadora exitosamente');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAsManager = async () => {
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.approveAsManager(selectedRequest.id, { comments: actionComments });
      onSuccess('Aprobado por jefe exitosamente');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPurchased = async () => {
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.markAsPurchased(selectedRequest.id, { comments: actionComments });
      onSuccess('Marcado como comprado');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error marking as purchased:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.markAsDelivered(selectedRequest.id, { comments: actionComments });
      onSuccess('Marcado como entregado');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error marking as delivered:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.rejectPurchaseRequest(selectedRequest.id, {
        rejectionReason: rejectionReason.trim(),
        rejectForCorrection
      });
      onSuccess(rejectForCorrection ? 'Devuelto para corrección' : 'Rechazado exitosamente');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResubmit = async () => {
    setActionLoading(true);
    try {
      await purchaseRequestsAPI.resubmitRejectedRequest(selectedRequest.id, correctionData);
      onSuccess('Solicitud reenviada exitosamente');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error resubmitting:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const newRequest = await purchaseRequestsAPI.duplicatePurchaseRequest(selectedRequest.id);
      onSuccess?.('Solicitud duplicada exitosamente', 'success');
      if (onDuplicate) onDuplicate(newRequest);
    } catch (error) {
      console.error('Error duplicating:', error);
    }
  };

  // Timeline mejorado
  const getWorkflowSteps = () => {
    const steps = [
      { status: 'solicitado', label: 'Solicitado', description: 'Solicitud creada por el usuario' },
      { status: 'pendiente_coordinadora', label: 'Pendiente Coordinadora', description: 'Esperando aprobación de coordinadora' },
      { status: 'aprobado_coordinadora', label: 'Aprobado por Coordinadora', description: 'Aprobado por coordinadora administrativa' },
      { status: 'pendiente_jefe', label: 'Pendiente Jefe', description: 'Esperando aprobación del jefe' },
      { status: 'aprobado_jefe', label: 'Aprobado por Jefe', description: 'Aprobado por el jefe' },
      { status: 'en_compras', label: 'En Compras', description: 'Procesando en compras' },
      { status: 'comprado', label: 'Comprado', description: 'Ítem adquirido' },
      { status: 'entregado', label: 'Entregado', description: 'Ítem entregado al solicitante' }
    ];

    if (selectedRequest?.status === 'rechazado') {
      steps.push({ status: 'rechazado', label: 'Rechazado', description: 'Solicitud rechazada' });
    } else if (selectedRequest?.status === 'rechazado_correccion') {
      steps.push({ status: 'rechazado_correccion', label: 'Para Corrección', description: 'Devuelto para corrección por el usuario' });
    }

    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getWorkflowSteps();
    return steps.findIndex(step => step.status === selectedRequest?.status);
  };

  const getTimeInStep = (stepStatus) => {
    if (!selectedRequest) return null;
    
    const history = selectedRequest.approvalHistory || [];
    const stepIndex = getWorkflowSteps().findIndex(s => s.status === stepStatus);
    
    if (stepIndex === -1) return null;

    // Encontrar cuando entró en este estado
    const currentStatusIndex = getCurrentStepIndex();
    
    // Si es el estado actual, calcular desde última actualización
    if (stepIndex === currentStatusIndex) {
      const updatedAt = new Date(selectedRequest.updatedAt);
      const now = new Date();
      const diffMs = now - updatedAt;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return `${diffDays} días`;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours > 0) return `${diffHours} horas`;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min`;
    }
    
    return null;
  };

  if (!showDetailModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className={conditionalClasses({
        light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] border border-gray-200 transform animate-scale-in flex flex-col overflow-hidden',
        dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] border border-gray-600 transform animate-scale-in flex flex-col overflow-hidden'
      })}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-600 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">#{selectedRequest.id}</span>
              </div>
              <div>
                <h2 className={conditionalClasses({ light: 'text-xl font-bold text-gray-900', dark: 'text-xl font-bold text-gray-100' })}>{selectedRequest.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {getStatusLabel(selectedRequest.status)}
                  </span>
                  {selectedRequest.rejectionCount > 0 && (
                    <span className={conditionalClasses({ light: 'text-xs text-gray-500', dark: 'text-xs text-gray-400' })}>
                      {selectedRequest.rejectionCount} rechazo(s) previo(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canDuplicate() && (
                <button
                  onClick={handleDuplicate}
                  className={conditionalClasses({
                    light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
                    dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors'
                  })}
                  title="Duplicar solicitud"
                >
                  <FaCopy className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className={conditionalClasses({
                  light: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all',
                  dark: 'p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-all'
                })}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Details */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Detalles de la Solicitud</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className={conditionalClasses({ light: 'text-sm font-semibold text-gray-500 uppercase', dark: 'text-sm font-semibold text-gray-400 uppercase' })}>Tipo de Ítem</span>
                    <p className={conditionalClasses({ light: 'font-medium text-gray-900 capitalize mt-1', dark: 'font-medium text-gray-100 capitalize mt-1' })}>{selectedRequest.itemType}</p>
                  </div>
                  <div>
                    <span className={conditionalClasses({ light: 'text-sm font-semibold text-gray-500 uppercase', dark: 'text-sm font-semibold text-gray-400 uppercase' })}>Cantidad</span>
                    <p className={conditionalClasses({ light: 'font-medium text-gray-900 mt-1', dark: 'font-medium text-gray-100 mt-1' })}>{selectedRequest.quantity}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={conditionalClasses({ light: 'text-sm font-semibold text-gray-500 uppercase', dark: 'text-sm font-semibold text-gray-400 uppercase' })}>Costo Estimado</span>
                    <p className={conditionalClasses({ light: 'text-xl font-bold text-green-600 mt-1', dark: 'text-xl font-bold text-green-400 mt-1' })}>{formatCurrency(selectedRequest.estimatedCost)}</p>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <span className={conditionalClasses({ light: 'text-sm font-semibold text-gray-500 uppercase', dark: 'text-sm font-semibold text-gray-400 uppercase' })}>Descripción</span>
                    <p className={conditionalClasses({ light: 'text-gray-900 mt-1 leading-relaxed', dark: 'text-gray-100 mt-1 leading-relaxed' })}>{selectedRequest.description}</p>
                  </div>
                  <div>
                    <span className={conditionalClasses({ light: 'text-sm font-semibold text-gray-500 uppercase', dark: 'text-sm font-semibold text-gray-400 uppercase' })}>Justificación</span>
                    <p className={conditionalClasses({ light: 'text-gray-900 mt-1 leading-relaxed', dark: 'text-gray-100 mt-1 leading-relaxed' })}>{selectedRequest.justification}</p>
                  </div>
                </div>
              </div>

              {/* Workflow Timeline Mejorado */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>
                  Progreso del Workflow
                </h3>
                <div className="space-y-3">
                  {getWorkflowSteps().map((step, index) => {
                    const currentIndex = getCurrentStepIndex();
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isRejected = step.status === 'rechazado';
                    isForCorrection = step.status === 'rechazado_correccion';
                    const timeInStep = isCurrent ? getTimeInStep(step.status) : null;

                    return (
                      <div key={step.status} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        isCurrent ? conditionalClasses({ light: 'bg-blue-50 border border-blue-200', dark: 'bg-blue-900/30 border border-blue-700/30' }) :
                        isRejected ? conditionalClasses({ light: 'bg-red-50 border border-red-200', dark: 'bg-red-900/30 border border-red-700/30' }) :
                        isForCorrection ? conditionalClasses({ light: 'bg-amber-50 border border-amber-200', dark: 'bg-amber-900/30 border border-amber-700/30' }) :
                        isCompleted ? conditionalClasses({ light: 'bg-green-50 border border-green-200', dark: 'bg-green-900/30 border border-green-700/30' }) :
                        conditionalClasses({ light: 'bg-gray-100 border border-gray-200', dark: 'bg-gray-600 border border-gray-600' })
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isRejected ? 'bg-red-500' :
                          isForCorrection ? 'bg-amber-500' :
                          isCompleted ? 'bg-green-500' :
                          conditionalClasses({ light: 'bg-gray-300', dark: 'bg-gray-500' })
                        }`}>
                          {isRejected ? <FaReject className="w-4 h-4 text-white" /> :
                           isForCorrection ? <FaUndo className="w-4 h-4 text-white" /> :
                           isCompleted ? <FaCheck className="w-4 h-4 text-white" /> :
                           <span className={conditionalClasses({ light: 'text-xs font-bold text-gray-600', dark: 'text-xs font-bold text-gray-300' })}>{index + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={conditionalClasses({ light: 'font-semibold text-gray-900', dark: 'font-semibold text-gray-100' })}>{step.label}</h4>
                            {isCurrent && timeInStep && (
                              <span className={conditionalClasses({ light: 'text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full', dark: 'text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full' })}>
                                ⏱️ {timeInStep}
                              </span>
                            )}
                          </div>
                          <p className={conditionalClasses({ light: 'text-sm text-gray-600', dark: 'text-sm text-gray-300' })}>{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Approval History */}
              {selectedRequest.approvalHistory && selectedRequest.approvalHistory.length > 0 && (
                <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Historial de Acciones</h3>
                  <div className="space-y-3">
                    {selectedRequest.approvalHistory.map((action, index) => (
                      <div key={index} className={conditionalClasses({ light: 'flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200', dark: 'flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-600' })}>
                        <div className={conditionalClasses({ light: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center', dark: 'w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center' })}>
                          <FaComment className={conditionalClasses({ light: 'w-4 h-4 text-blue-600', dark: 'w-4 h-4 text-blue-400' })} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={conditionalClasses({ light: 'font-semibold text-gray-900', dark: 'font-semibold text-gray-100' })}>{action.userName}</span>
                            <span className={conditionalClasses({ light: 'text-sm text-gray-500 capitalize', dark: 'text-sm text-gray-400 capitalize' })}>{action.action.replace(/_/g, ' ')}</span>
                            <span className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>{getTimeAgo(new Date(action.timestamp))}</span>
                          </div>
                          {action.comments && (
                            <p className={conditionalClasses({ light: 'text-sm text-gray-700', dark: 'text-sm text-gray-300' })}>{action.comments}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedRequest.status?.includes('rechazado') && selectedRequest.rejectionReason && (
                <div className={conditionalClasses({ light: 'bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6', dark: 'bg-red-900/20 border border-red-800/30 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-red-900 mb-2', dark: 'text-lg font-bold text-red-300 mb-2' })}>
                    {selectedRequest.status === 'rechazado_correccion' ? 'Observaciones para Corrección' : 'Motivo de Rechazo'}
                  </h3>
                  <p className={conditionalClasses({ light: 'text-red-800', dark: 'text-red-200' })}>{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {/* Attachments */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 flex items-center', dark: 'text-lg font-bold text-gray-100 flex items-center' })}>
                    <FaPaperclip className="mr-2" />
                    Archivos Adjuntos ({attachments.length})
                  </h3>
                  {canEdit() && (
                    <label className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <FaUpload className="mr-2" />
                      Subir
                      <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif" />
                    </label>
                  )}
                </div>
                {attachments.length === 0 ? (
                  <p className={conditionalClasses({ light: 'text-gray-500 text-center py-4', dark: 'text-gray-400 text-center py-4' })}>No hay archivos adjuntos</p>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className={conditionalClasses({ light: 'flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200', dark: 'flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600' })}>
                        <div className="flex items-center flex-1 min-w-0">
                          <FaPaperclip className={conditionalClasses({ light: 'w-4 h-4 text-gray-400 mr-3', dark: 'w-4 h-4 text-gray-500 mr-3' })} />
                          <div className="flex-1 min-w-0">
                            <p className={conditionalClasses({ light: 'text-sm font-medium text-gray-900 truncate', dark: 'text-sm font-medium text-gray-100 truncate' })}>{attachment.originalName}</p>
                            <p className={conditionalClasses({ light: 'text-xs text-gray-500', dark: 'text-xs text-gray-400' })}>{(attachment.size / 1024).toFixed(1)} KB • {attachment.uploader?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button onClick={() => downloadAttachment(attachment)} className={conditionalClasses({ light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg', dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg' })}>
                            <FaDownload className="w-4 h-4" />
                          </button>
                          {canEdit() && (
                            <button onClick={() => handleDeleteAttachment(attachment.id)} className={conditionalClasses({ light: 'p-2 text-red-600 hover:bg-red-50 rounded-lg', dark: 'p-2 text-red-400 hover:bg-red-900/30 rounded-lg' })}>
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4 flex items-center', dark: 'text-lg font-bold text-gray-100 mb-4 flex items-center' })}>
                  <FaComment className="mr-2" />
                  Comentarios ({comments.length})
                </h3>
                
                {/* Add Comment */}
                <div className={conditionalClasses({ light: 'bg-white rounded-lg p-4 border border-gray-200 mb-4', dark: 'bg-gray-800 rounded-lg p-4 border border-gray-600 mb-4' })}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className={conditionalClasses({ light: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] outline-none resize-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8e4dbf] outline-none resize-none bg-gray-700 text-gray-100' })}
                    rows="3"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {userRole === 'Administrador' && (
                        <label className={conditionalClasses({ light: 'flex items-center gap-2 text-sm text-gray-600 cursor-pointer', dark: 'flex items-center gap-2 text-sm text-gray-400 cursor-pointer' })}>
                          <input type="checkbox" checked={isInternalComment} onChange={(e) => setIsInternalComment(e.target.checked)} className="rounded" />
                          Interno
                        </label>
                      )}
                    </div>
                    <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2 bg-[#662d91] hover:bg-[#7a3da8] text-white text-sm font-medium rounded-lg disabled:opacity-50">
                      Comentar
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <p className={conditionalClasses({ light: 'text-gray-500 text-center py-4', dark: 'text-gray-400 text-center py-4' })}>No hay comentarios</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className={conditionalClasses({ light: `p-4 rounded-lg border ${comment.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`, dark: `p-4 rounded-lg border ${comment.isInternal ? 'bg-yellow-900/20 border-yellow-700/30' : 'bg-gray-800 border-gray-600'}` })}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={conditionalClasses({ light: 'w-8 h-8 bg-[#f3ebf9] rounded-full flex items-center', dark: 'w-8 h-8 bg-purple-900/50 rounded-full flex items-center' })}>
                              <span className={conditionalClasses({ light: 'text-sm font-medium text-[#662d91]', dark: 'text-sm font-medium text-purple-300' })}>{(comment.user?.name || 'U').charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={conditionalClasses({ light: 'font-medium text-gray-900 text-sm', dark: 'font-medium text-gray-100 text-sm' })}>{comment.user?.name || 'Usuario'}</span>
                                {comment.isInternal && (
                                  <span className={conditionalClasses({ light: 'px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full', dark: 'px-2 py-0.5 bg-yellow-900/50 text-yellow-300 text-xs rounded-full' })}>Interno</span>
                                )}
                                <span className={conditionalClasses({ light: 'text-xs text-gray-500', dark: 'text-xs text-gray-400' })}>{getTimeAgo(comment.createdAt)}</span>
                              </div>
                              <p className={conditionalClasses({ light: 'text-gray-700 text-sm', dark: 'text-gray-300 text-sm' })}>{comment.content}</p>
                            </div>
                          </div>
                          {(userRole === 'Administrador' || comment.userId === user?.id) && (
                            <button onClick={() => handleDeleteComment(comment.id)} className={conditionalClasses({ light: 'p-1 text-red-600 hover:bg-red-50 rounded', dark: 'p-1 text-red-400 hover:bg-red-900/30 rounded' })}>
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Requester Info */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Solicitante</h3>
                <div className="flex items-center gap-3">
                  <div className={conditionalClasses({ light: 'w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center', dark: 'w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center' })}>
                    <FaUserCircle className={conditionalClasses({ light: 'w-6 h-6 text-gray-600', dark: 'w-6 h-6 text-gray-400' })} />
                  </div>
                  <div>
                    <p className={conditionalClasses({ light: 'font-semibold text-gray-900', dark: 'font-semibold text-gray-100' })}>{selectedRequest.requester?.name}</p>
                    <p className={conditionalClasses({ light: 'text-sm text-gray-600', dark: 'text-sm text-gray-400' })}>{selectedRequest.requester?.email}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(canApproveAsCoordinator() || canApproveAsManager() || canMarkAsPurchased() || canMarkAsDelivered() || canReject()) && selectedRequest.status !== 'rechazado' && (
                <div className={conditionalClasses({ light: 'bg-white border-2 border-gray-200 rounded-xl p-4 lg:p-6', dark: 'bg-gray-800 border-2 border-gray-600 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Acciones</h3>
                  <div className="space-y-3">
                    {canApproveAsCoordinator() && (
                      <div className="space-y-2">
                        <textarea placeholder="Comentarios..." value={actionComments} onChange={(e) => setActionComments(e.target.value)} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-700 text-gray-100' })} rows={2} />
                        <button onClick={handleApproveAsCoordinator} disabled={actionLoading} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50">
                          {actionLoading ? 'Procesando...' : 'Aprobar como coordinadora'}
                        </button>
                      </div>
                    )}
                    {canApproveAsManager() && (
                      <div className="space-y-2">
                        <textarea placeholder="Comentarios..." value={actionComments} onChange={(e) => setActionComments(e.target.value)} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-700 text-gray-100' })} rows={2} />
                        <button onClick={handleApproveAsManager} disabled={actionLoading} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50">
                          {actionLoading ? 'Procesando...' : 'Aprobar como jefe'}
                        </button>
                      </div>
                    )}
                    {canMarkAsPurchased() && (
                      <div className="space-y-2">
                        <textarea placeholder="Comentarios..." value={actionComments} onChange={(e) => setActionComments(e.target.value)} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-700 text-gray-100' })} rows={2} />
                        <button onClick={handleMarkAsPurchased} disabled={actionLoading} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">
                          {actionLoading ? 'Procesando...' : 'Marcar como comprado'}
                        </button>
                      </div>
                    )}
                    {canMarkAsDelivered() && (
                      <div className="space-y-2">
                        <textarea placeholder="Comentarios..." value={actionComments} onChange={(e) => setActionComments(e.target.value)} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-700 text-gray-100' })} rows={2} />
                        <button onClick={handleMarkAsDelivered} disabled={actionLoading} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50">
                          {actionLoading ? 'Procesando...' : 'Marcar como entregado'}
                        </button>
                      </div>
                    )}
                    {canReject() && !showRejectForm && (
                      <button onClick={() => setShowRejectForm(true)} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">
                        Rechazar / Devolver
                      </button>
                    )}
                    {canReject() && showRejectForm && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className={conditionalClasses({ light: 'flex items-center gap-2 text-sm cursor-pointer', dark: 'flex items-center gap-2 text-sm cursor-pointer' })}>
                            <input type="checkbox" checked={rejectForCorrection} onChange={(e) => setRejectForCorrection(e.target.checked)} className="rounded" />
                            <span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Devolver para corrección</span>
                          </label>
                        </div>
                        <textarea
                          placeholder={rejectForCorrection ? 'Observaciones para corrección (requerido)...' : 'Motivo del rechazo (requerido)...'}
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className={conditionalClasses({ light: 'w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none bg-red-50 text-gray-900', dark: 'w-full px-3 py-2 border border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none bg-red-900/30 text-gray-100' })}
                          rows={3}
                          required
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { setShowRejectForm(false); setRejectForCorrection(false); setRejectionReason(''); }} className={conditionalClasses({ light: 'flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg', dark: 'flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg' })}>
                            Cancelar
                          </button>
                          <button onClick={handleReject} disabled={actionLoading || !rejectionReason.trim()} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50">
                            {actionLoading ? 'Procesando...' : rejectForCorrection ? 'Devolver' : 'Confirmar'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reenviar si está rechazada para corrección */}
              {canResubmit() && (
                <div className={conditionalClasses({ light: 'bg-amber-50 border-2 border-amber-200 rounded-xl p-4 lg:p-6', dark: 'bg-amber-900/20 border-2 border-amber-700/30 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-amber-900 mb-4', dark: 'text-lg font-bold text-amber-300 mb-4' })}>
                    <FaUndo className="inline mr-2" />
                    Corregir y Reenviar
                  </h3>
                  {!showCorrectionForm ? (
                    <button onClick={() => setShowCorrectionForm(true)} className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg">
                      Corregir Solicitud
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input type="text" placeholder="Título" value={correctionData.title} onChange={(e) => setCorrectionData({...correctionData, title: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} />
                      <textarea placeholder="Descripción" value={correctionData.description} onChange={(e) => setCorrectionData({...correctionData, description: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} rows={3} />
                      <textarea placeholder="Justificación" value={correctionData.justification} onChange={(e) => setCorrectionData({...correctionData, justification: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} rows={2} />
                      <input type="number" placeholder="Cantidad" value={correctionData.quantity} onChange={(e) => setCorrectionData({...correctionData, quantity: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} />
                      <input type="number" placeholder="Costo estimado" value={correctionData.estimatedCost} onChange={(e) => setCorrectionData({...correctionData, estimatedCost: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} />
                      <textarea placeholder="Comentarios de corrección..." value={correctionData.correctionComments} onChange={(e) => setCorrectionData({...correctionData, correctionComments: e.target.value})} className={conditionalClasses({ light: 'w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900', dark: 'w-full px-3 py-2 border border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-700 text-gray-100' })} rows={2} />
                      <div className="flex gap-2">
                        <button onClick={() => setShowCorrectionForm(false)} className={conditionalClasses({ light: 'flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg', dark: 'flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg' })}>
                          Cancelar
                        </button>
                        <button onClick={handleResubmit} disabled={actionLoading || !correctionData.title || !correctionData.description || !correctionData.justification} className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg disabled:opacity-50">
                          {actionLoading ? 'Procesando...' : 'Reenviar'}
                        </button>
                      </div>
                    </div>
                  )}
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
