import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaCheck, FaTimes as FaReject, FaArrowRight, FaCheckCircle, FaClock, FaUserCircle, FaComment, FaPaperclip, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';
import { purchaseRequestsAPI } from '../../../api';
import AuthContext from '../../../context/AuthContext';
import { getTimeAgo } from '../../../utils';
import { SERVER_BASE_URL } from '../../../utils/constants';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

const PurchaseRequestDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  selectedRequest,
  user
}) => {
  const { conditionalClasses } = useThemeClasses();
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionComments, setActionComments] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  const userRole = user?.role?.name;

  useEffect(() => {
    if (showDetailModal && selectedRequest?.id) {
      loadAttachments();
      loadComments();
    }
  }, [showDetailModal, selectedRequest]);

  const loadAttachments = async () => {
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
  };

  const loadComments = async () => {
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
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await purchaseRequestsAPI.uploadAttachment(selectedRequest.id, file);
      loadAttachments(); // Reload attachments
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;

    try {
      await purchaseRequestsAPI.deleteAttachment(selectedRequest.id, attachmentId);
      loadAttachments(); // Reload attachments
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const downloadAttachment = (attachment) => {
    // Create download link
    const link = document.createElement('a');
    link.href = `${SERVER_BASE_URL}/${attachment.path}`;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className={conditionalClasses({
        light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] border border-gray-200 transform animate-scale-in flex flex-col',
        dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] border border-gray-600 transform animate-scale-in flex flex-col'
      })}>
        <div className="p-4 lg:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">#{selectedRequest.id}</span>
              </div>
              <div>
                <h2 className={conditionalClasses({
                  light: 'text-xl lg:text-2xl font-bold text-gray-900 line-clamp-1',
                  dark: 'text-xl lg:text-2xl font-bold text-gray-100 line-clamp-1'
                })}>{selectedRequest.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status}
                  </span>
                  <span className={conditionalClasses({
                    light: 'text-sm text-gray-500',
                    dark: 'text-sm text-gray-400'
                  })}>
                    {getTimeAgo(selectedRequest.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className={conditionalClasses({
                light: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200',
                dark: 'p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200'
              })}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Details */}
              <div className={conditionalClasses({
                light: 'bg-gray-50 rounded-xl p-4 lg:p-6',
                dark: 'bg-gray-700 rounded-xl p-4 lg:p-6'
              })}>
                <h3 className={conditionalClasses({
                  light: 'text-lg font-bold text-gray-900 mb-4',
                  dark: 'text-lg font-bold text-gray-100 mb-4'
                })}>Detalles de la Solicitud</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className={conditionalClasses({
                      light: 'text-sm font-semibold text-gray-500 uppercase tracking-wide',
                      dark: 'text-sm font-semibold text-gray-400 uppercase tracking-wide'
                    })}>Tipo de Ítem</span>
                    <p className={conditionalClasses({
                      light: 'text-base font-medium text-gray-900 mt-1 capitalize',
                      dark: 'text-base font-medium text-gray-100 mt-1 capitalize'
                    })}>{selectedRequest.itemType}</p>
                  </div>
                  <div>
                    <span className={conditionalClasses({
                      light: 'text-sm font-semibold text-gray-500 uppercase tracking-wide',
                      dark: 'text-sm font-semibold text-gray-400 uppercase tracking-wide'
                    })}>Cantidad</span>
                    <p className={conditionalClasses({
                      light: 'text-base font-medium text-gray-900 mt-1',
                      dark: 'text-base font-medium text-gray-100 mt-1'
                    })}>{selectedRequest.quantity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className={conditionalClasses({
                      light: 'text-sm font-semibold text-gray-500 uppercase tracking-wide',
                      dark: 'text-sm font-semibold text-gray-400 uppercase tracking-wide'
                    })}>Costo Estimado</span>
                    <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(selectedRequest.estimatedCost)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className={conditionalClasses({
                      light: 'text-sm font-semibold text-gray-500 uppercase tracking-wide',
                      dark: 'text-sm font-semibold text-gray-400 uppercase tracking-wide'
                    })}>Descripción</span>
                    <p className={conditionalClasses({
                      light: 'text-base text-gray-900 mt-1 leading-relaxed',
                      dark: 'text-base text-gray-100 mt-1 leading-relaxed'
                    })}>{selectedRequest.description}</p>
                  </div>
                  <div>
                    <span className={conditionalClasses({
                      light: 'text-sm font-semibold text-gray-500 uppercase tracking-wide',
                      dark: 'text-sm font-semibold text-gray-400 uppercase tracking-wide'
                    })}>Justificación</span>
                    <p className={conditionalClasses({
                      light: 'text-base text-gray-900 mt-1 leading-relaxed',
                      dark: 'text-base text-gray-100 mt-1 leading-relaxed'
                    })}>{selectedRequest.justification}</p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className={conditionalClasses({
                light: 'bg-gray-50 rounded-xl p-4 lg:p-6',
                dark: 'bg-gray-700 rounded-xl p-4 lg:p-6'
              })}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={conditionalClasses({
                    light: 'text-lg font-bold text-gray-900 flex items-center',
                    dark: 'text-lg font-bold text-gray-100 flex items-center'
                  })}>
                    <FaPaperclip className="mr-2" />
                    Archivos Adjuntos ({attachments.length})
                  </h3>
                  {(userRole === 'Administrador' || selectedRequest?.userId === user?.id) && (
                    <div>
                      <label className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                        <FaUpload className="mr-2" />
                        Subir Archivo
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {attachmentsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className={conditionalClasses({
                      light: 'text-sm text-gray-600 mt-2',
                      dark: 'text-sm text-gray-300 mt-2'
                    })}>Cargando archivos...</p>
                  </div>
                ) : attachments.length === 0 ? (
                  <div className="text-center py-8">
                    <FaPaperclip className={conditionalClasses({
                      light: 'w-12 h-12 text-gray-300 mx-auto mb-3',
                      dark: 'w-12 h-12 text-gray-500 mx-auto mb-3'
                    })} />
                    <p className={conditionalClasses({
                      light: 'text-gray-500',
                      dark: 'text-gray-400'
                    })}>No hay archivos adjuntos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className={conditionalClasses({
                        light: 'flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200',
                        dark: 'flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600'
                      })}>
                        <div className="flex items-center flex-1 min-w-0">
                          <FaPaperclip className={conditionalClasses({
                            light: 'w-4 h-4 text-gray-400 mr-3 shrink-0',
                            dark: 'w-4 h-4 text-gray-500 mr-3 shrink-0'
                          })} />
                          <div className="flex-1 min-w-0">
                            <p className={conditionalClasses({
                              light: 'text-sm font-medium text-gray-900 truncate',
                              dark: 'text-sm font-medium text-gray-100 truncate'
                            })}>{attachment.originalName}</p>
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-500',
                              dark: 'text-xs text-gray-400'
                            })}>
                              {(attachment.size / 1024).toFixed(1)} KB • Subido por {attachment.uploader?.name || 'Usuario'} • {getTimeAgo(attachment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => downloadAttachment(attachment)}
                            className={conditionalClasses({
                              light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
                              dark: 'p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors'
                            })}
                            title="Descargar"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                          {(userRole === 'Administrador' || attachment.uploadedBy === user?.id) && (
                            <button
                              onClick={() => handleDeleteAttachment(attachment.id)}
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
                    ))}
                  </div>
                )}
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

          {/* Comments Section */}
          <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaComment className="mr-2" />
                Comentarios ({comments.length})
              </h3>
            </div>

            {/* Add Comment */}
            {(userRole === 'Administrador' || userRole === 'Coordinadora Administrativa' || userRole === 'Jefe' || userRole === 'Compras' || selectedRequest?.userId === user?.id) && (
              <div className="mb-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#f3ebf9] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-[#662d91]">
                        {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none resize-none"
                        rows="3"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {userRole === 'Administrador' && (
                            <label className="flex items-center space-x-2 text-sm text-gray-600">
                              <input
                                type="checkbox"
                                checked={isInternalComment}
                                onChange={(e) => setIsInternalComment(e.target.checked)}
                                className="rounded border-gray-300 text-[#662d91] focus:ring-[#662d91]"
                              />
                              <span>Comentario interno</span>
                            </label>
                          )}
                        </div>
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-[#662d91] hover:bg-[#7a3da8] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#662d91] mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Cargando comentarios...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <FaComment className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay comentarios aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-lg border ${comment.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#f3ebf9] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-[#662d91]">
                          {(comment.user?.name || comment.user?.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {comment.user?.name || comment.user?.username || 'Usuario'}
                          </span>
                          {comment.isInternal && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Interno
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                      {(userRole === 'Administrador' || comment.userId === user?.id) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Eliminar comentario"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestDetailModal;

