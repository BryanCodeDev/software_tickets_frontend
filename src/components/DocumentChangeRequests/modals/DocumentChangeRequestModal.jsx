import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileAlt, FaFolder, FaEdit, FaTrash, FaUpload, FaCheck, FaClock, FaBan, FaUserCircle, FaComment, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import documentsAPI from '../../../api/documentsAPI';
import documentChangeRequestsAPI from '../../../api/documentChangeRequestsAPI';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

const DocumentChangeRequestModal = ({
  isOpen,
  onClose,
  request,
  onSave,
  onSubmit,
  onApprove,
  user,
  mode // 'create', 'edit', 'view', 'approve'
}) => {
  const { conditionalClasses } = useThemeClasses();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requestType: 'create',
    documentId: '',
    folderId: '',
    justification: '',
    impactAnalysis: '',
    affectedProcesses: '',
    priority: 'media',
    observations: ''
  });
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionComment, setActionComment] = useState('');

  const userRole = user?.role?.name;

  // Permisos de aprobación basados en el paso actual del workflow
  const canApproveStep = useCallback(() => {
    if (!request) return false;
    
    const currentStep = request.currentStep || 1;
    const workflowStatus = request.workflowStatus;
    
    // No se puede aprobar si está en estos estados
    if (['borrador', 'publicado', 'rechazado'].includes(workflowStatus)) {
      return false;
    }

    // Administrador y Técnico pueden aprobar cualquier paso
    if (['Administrador', 'Técnico'].includes(userRole)) {
      return true;
    }

    // Calidad puede aprobar pasos 2 y 5
    if (userRole === 'Calidad' && [2, 5].includes(currentStep)) {
      return true;
    }

    // Jefe puede aprobar paso 3
    if (userRole === 'Jefe' && currentStep === 3) {
      return true;
    }

    // Coordinador/a Administrativa puede aprobar paso 4
    if (userRole === 'Coordinadora Administrativa' && currentStep === 4) {
      return true;
    }

    return false;
  }, [request, userRole]);

  const canReject = useCallback(() => {
    if (!request) return false;
    
    const workflowStatus = request.workflowStatus;
    
    // Puede rechazar si está en revisión
    if (['pendiente_revision', 'en_revision', 'aprobado', 'en_implementacion'].includes(workflowStatus)) {
      if (['Administrador', 'Técnico', 'Calidad', 'Jefe', 'Coordinadora Administrativa'].includes(userRole)) {
        return true;
      }
    }
    
    return false;
  }, [request, userRole]);

  const canSubmitForReview = useCallback(() => {
    if (!request) return false;
    return request.workflowStatus === 'borrador' && request.requester?.id === user?.id;
  }, [request, user?.id]);

  const canEdit = useCallback(() => {
    if (!request) return false;
    // El creador puede editar si está en borrador
    if (request.requester?.id === user?.id && request.workflowStatus === 'borrador') {
      return true;
    }
    // Roles con permisos totales
    return ['Administrador', 'Calidad', 'Técnico'].includes(userRole);
  }, [request, user?.id, userRole]);

  // Workflow steps definition
  const getWorkflowSteps = () => {
    const steps = [
      { status: 'borrador', label: 'Borrador', description: 'Solicitud creada, pendiente de enviar a revisión' },
      { status: 'pendiente_revision', label: 'Pendiente Revisión', description: 'Esperando revisión del área de calidad' },
      { status: 'en_revision', label: 'En Revisión', description: 'Revisando cambio propuesto' },
      { status: 'aprobado', label: 'Aprobado', description: 'Cambio aprobado, esperando implementación' },
      { status: 'en_implementacion', label: 'En Implementación', description: 'Implementando el cambio' },
      { status: 'publicado', label: 'Publicado', description: 'Documento publicado y disponible' }
    ];
    
    if (request?.workflowStatus === 'rechazado') {
      steps.push({ status: 'rechazado', label: 'Rechazado', description: 'Solicitud rechazada' });
    }
    
    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getWorkflowSteps();
    return steps.findIndex(step => step.status === request?.workflowStatus);
  };

  const getTimeInStep = (stepStatus) => {
    if (!request) return null;
    
    const stepIndex = getWorkflowSteps().findIndex(s => s.status === stepStatus);
    if (stepIndex === -1) return null;

    const currentStatusIndex = getCurrentStepIndex();
    
    if (stepIndex === currentStatusIndex) {
      const updatedAt = new Date(request.updatedAt);
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

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadDocuments();
      loadFolders();
      
      if (request) {
        setFormData({
          title: request.title || '',
          description: request.description || '',
          requestType: request.requestType || 'create',
          documentId: request.documentId || '',
          folderId: request.folderId || '',
          justification: request.justification || '',
          impactAnalysis: request.impactAnalysis || '',
          affectedProcesses: request.affectedProcesses ? 
            (typeof request.affectedProcesses === 'string' ? request.affectedProcesses : request.affectedProcesses.join(', ')) : '',
          priority: request.priority || 'media',
          observations: request.observations || ''
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, request]);

  const loadDocuments = async () => {
    try {
      const response = await documentsAPI.fetchDocuments();
      setDocuments(response || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await documentsAPI.fetchFolders();
      setFolders(response || []);
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requestType: 'create',
      documentId: '',
      folderId: '',
      justification: '',
      impactAnalysis: '',
      affectedProcesses: '',
      priority: 'media',
      observations: ''
    });
    setSelectedFile(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'El título es requerido';
    if (!formData.description.trim()) return 'La descripción es requerida';
    if (!formData.justification.trim() || formData.justification.length < 10) {
      return 'La justificación debe tener al menos 10 caracteres';
    }
    if (formData.requestType === 'create' && !formData.folderId) {
      return 'Debe seleccionar una carpeta para crear el documento';
    }
    if (['edit', 'version_update'].includes(formData.requestType) && !formData.documentId) {
      return 'Debe seleccionar el documento a modificar';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        affectedProcesses: formData.affectedProcesses.split(',').map(s => s.trim()).filter(Boolean)
      };

      let savedRequest;
      if (request?.id) {
        savedRequest = await documentChangeRequestsAPI.update(request.id, data);
      } else {
        savedRequest = await documentChangeRequestsAPI.create(data);
      }

      if (selectedFile && savedRequest.id) {
        await documentChangeRequestsAPI.uploadFile(savedRequest.id, selectedFile);
      }

      onSave(savedRequest);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!request?.id) return;

    setLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.submitForReview(request.id);
      onSubmit(updatedRequest);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar a revisión');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request?.id) return;

    setActionLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.approveStep(request.id, {
        stepNumber: request.currentStep,
        action: 'approve',
        comment: actionComment
      });
      onApprove(updatedRequest);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al aprobar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!request?.id || !rejectionReason.trim()) return;

    setActionLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.approveStep(request.id, {
        stepNumber: request.currentStep,
        action: 'reject',
        comment: rejectionReason
      });
      onApprove(updatedRequest);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al rechazar');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view' || (request && !['borrador', 'rechazado'].includes(request.workflowStatus));

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
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">#{request?.id || ' Nuevo'}</span>
              </div>
              <div>
                <h2 className={conditionalClasses({ light: 'text-xl font-bold text-gray-900', dark: 'text-xl font-bold text-gray-100' })}>
                  {mode === 'create' ? 'Nueva Solicitud de Cambio' : 
                   mode === 'edit' ? 'Editar Solicitud' : 
                   request?.title || 'Detalles de Solicitud'}
                </h2>
                {request && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 ${
                      request.workflowStatus === 'borrador' ? conditionalClasses({ light: 'bg-gray-100 text-gray-700', dark: 'bg-gray-700 text-gray-300' }) :
                      request.workflowStatus === 'pendiente_revision' ? conditionalClasses({ light: 'bg-yellow-100 text-yellow-700', dark: 'bg-yellow-900/30 text-yellow-300' }) :
                      request.workflowStatus === 'en_revision' ? conditionalClasses({ light: 'bg-blue-100 text-blue-700', dark: 'bg-blue-900/30 text-blue-300' }) :
                      request.workflowStatus === 'aprobado' ? conditionalClasses({ light: 'bg-green-100 text-green-700', dark: 'bg-green-900/30 text-green-300' }) :
                      request.workflowStatus === 'en_implementacion' ? conditionalClasses({ light: 'bg-purple-100 text-purple-700', dark: 'bg-purple-900/30 text-purple-300' }) :
                      request.workflowStatus === 'publicado' ? conditionalClasses({ light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-900/30 text-emerald-300' }) :
                      conditionalClasses({ light: 'bg-red-100 text-red-700', dark: 'bg-red-900/30 text-red-300' })
                    }`}>
                      {request.workflowStatus === 'borrador' && 'Borrador'}
                      {request.workflowStatus === 'pendiente_revision' && 'Pendiente Revisión'}
                      {request.workflowStatus === 'en_revision' && 'En Revisión'}
                      {request.workflowStatus === 'aprobado' && 'Aprobado'}
                      {request.workflowStatus === 'en_implementacion' && 'En Implementación'}
                      {request.workflowStatus === 'publicado' && 'Publicado'}
                      {request.workflowStatus === 'rechazado' && 'Rechazado'}
                    </span>
                    <span className={conditionalClasses({ light: 'text-sm text-gray-500', dark: 'text-sm text-gray-400' })}>
                      Paso {request.currentStep} de {request.totalSteps}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={conditionalClasses({
                light: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all',
                dark: 'p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-all'
              })}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className={`p-3 rounded-lg border ${conditionalClasses({
                  light: 'bg-red-100 text-red-700 border-red-200',
                  dark: 'bg-red-900/30 text-red-300 border-red-700'
                })}`}>
                  {error}
                </div>
              )}

              {/* Workflow Timeline */}
              {request && (
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
                      const timeInStep = isCurrent ? getTimeInStep(step.status) : null;

                      return (
                        <div key={step.status} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isCurrent ? conditionalClasses({ light: 'bg-blue-50 border border-blue-200', dark: 'bg-blue-900/30 border border-blue-700/30' }) :
                            isRejected ? conditionalClasses({ light: 'bg-red-50 border border-red-200', dark: 'bg-red-900/30 border border-red-700/30' }) :
                            isCompleted ? conditionalClasses({ light: 'bg-green-50 border border-green-200', dark: 'bg-green-900/30 border border-green-700/30' }) :
                            conditionalClasses({ light: 'bg-gray-100 border border-gray-200', dark: 'bg-gray-600 border border-gray-600' })
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isRejected ? 'bg-red-500' :
                            isCompleted ? 'bg-green-500' :
                            conditionalClasses({ light: 'bg-gray-300', dark: 'bg-gray-500' })
                          }`}>
                            {isRejected ? <FaBan className="w-4 h-4 text-white" /> :
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
              )}

              {/* Formulario */}
              <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>
                  Detalles de la Solicitud
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="lg:col-span-2">
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Título del Cambio *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 disabled:bg-gray-100',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white disabled:bg-gray-600'
                      })}
                      placeholder="Ej: Actualización del Procedimiento de Compras"
                    />
                  </div>

                  {/* Tipo de Solicitud */}
                  <div>
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Tipo de Cambio *
                    </label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                    >
                      <option value="create">Crear Nuevo Documento</option>
                      <option value="edit">Editar Documento Existente</option>
                      <option value="version_update">Nueva Versión</option>
                      <option value="delete">Eliminar Documento</option>
                    </select>
                  </div>

                  {/* Prioridad */}
                  <div>
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Prioridad *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  {/* Carpeta (para crear) */}
                  {formData.requestType === 'create' && (
                    <div>
                      <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                        <FaFolder className="inline mr-1" />
                        Carpeta de Destino *
                      </label>
                      <select
                        name="folderId"
                        value={formData.folderId}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className={conditionalClasses({
                          light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                          dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                        })}
                      >
                        <option value="">Seleccionar carpeta...</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Documento (para editar/eliminar) */}
                  {['edit', 'version_update', 'delete'].includes(formData.requestType) && (
                    <div>
                      <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                        <FaFileAlt className="inline mr-1" />
                        Documento a Modificar *
                      </label>
                      <select
                        name="documentId"
                        value={formData.documentId}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className={conditionalClasses({
                          light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                          dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                        })}
                      >
                        <option value="">Seleccionar documento...</option>
                        {documents.map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.title} (v{doc.version})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Justificación */}
                  <div className="lg:col-span-2">
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Justificación del Cambio * (Mínimo 10 caracteres)
                    </label>
                    <textarea
                      name="justification"
                      value={formData.justification}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      rows={3}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                      placeholder="Explique por qué es necesario este cambio (ISO 9001 requiere trazabilidad)..."
                    />
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-2">
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Descripción del Cambio *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      rows={4}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                      placeholder="Describa detalladamente los cambios que se realizarán..."
                    />
                  </div>

                  {/* Análisis de Impacto */}
                  <div className="lg:col-span-2">
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Análisis de Impacto
                    </label>
                    <textarea
                      name="impactAnalysis"
                      value={formData.impactAnalysis}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      rows={3}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                      placeholder="Analice el impacto de este cambio en otros procesos..."
                    />
                  </div>

                  {/* Procesos Afectados */}
                  <div className="lg:col-span-2">
                    <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                      Procesos Afectados (separados por coma)
                    </label>
                    <input
                      type="text"
                      name="affectedProcesses"
                      value={formData.affectedProcesses}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white text-gray-900',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white'
                      })}
                      placeholder="Ej: Compras, Almacén, Ventas"
                    />
                  </div>

                  {/* Upload de archivo */}
                  {mode !== 'view' && (
                    <div className="lg:col-span-2">
                      <label className={conditionalClasses({ light: 'block text-sm font-semibold text-gray-700 mb-2', dark: 'block text-sm font-semibold text-gray-200 mb-2' })}>
                        <FaUpload className="inline mr-1" />
                        Archivo Propuesto
                      </label>
                      <div className={conditionalClasses({
                        light: 'border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-all',
                        dark: 'border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-all'
                      })}>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          disabled={isReadOnly}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {selectedFile ? (
                            <div className="flex items-center justify-center gap-2">
                              <FaFileAlt className="w-8 h-8 text-purple-500" />
                              <span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-200' })}>{selectedFile.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <FaUpload className="w-8 h-8 text-gray-400" />
                              <span className={conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}>
                                Haz clic para subir el archivo o arrástralo aquí
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Actions */}
            <div className="space-y-6">
              {/* Requester Info */}
              {request && (
                <div className={conditionalClasses({ light: 'bg-gray-50 rounded-xl p-4 lg:p-6', dark: 'bg-gray-700 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Solicitante</h3>
                  <div className="flex items-center gap-3">
                    <div className={conditionalClasses({ light: 'w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center', dark: 'w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center' })}>
                      <FaUserCircle className={conditionalClasses({ light: 'w-6 h-6 text-gray-600', dark: 'w-6 h-6 text-gray-400' })} />
                    </div>
                    <div>
                      <p className={conditionalClasses({ light: 'font-semibold text-gray-900', dark: 'font-semibold text-gray-100' })}>{request.requester?.name || 'Usuario'}</p>
                      <p className={conditionalClasses({ light: 'text-sm text-gray-600', dark: 'text-sm text-gray-400' })}>{request.requester?.email || ''}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions - Botones de aprobar según el estado */}
              {(canApproveStep() || canReject() || canSubmitForReview() || (canEdit() && request?.workflowStatus === 'borrador')) && (
                <div className={conditionalClasses({ light: 'bg-white border-2 border-gray-200 rounded-xl p-4 lg:p-6', dark: 'bg-gray-800 border-2 border-gray-600 rounded-xl p-4 lg:p-6' })}>
                  <h3 className={conditionalClasses({ light: 'text-lg font-bold text-gray-900 mb-4', dark: 'text-lg font-bold text-gray-100 mb-4' })}>Acciones</h3>
                  <div className="space-y-3">
                    {/* Enviar a Revisión */}
                    {canSubmitForReview() && (
                      <button
                        onClick={handleSubmitForReview}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <FaArrowRight className="w-4 h-4" />
                        {loading ? 'Enviando...' : 'Enviar a Revisión'}
                      </button>
                    )}

                    {/* Aprobar */}
                    {canApproveStep() && !showRejectForm && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Comentarios (opcional)..."
                          value={actionComment}
                          onChange={(e) => setActionComment(e.target.value)}
                          className={conditionalClasses({
                            light: 'w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900',
                            dark: 'w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-gray-700 text-gray-100'
                          })}
                          rows={2}
                        />
                        <button
                          onClick={handleApprove}
                          disabled={actionLoading}
                          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          {actionLoading ? 'Procesando...' : 'Aprobar'}
                        </button>
                      </div>
                    )}

                    {/* Rechazar */}
                    {canReject() && !showRejectForm && (
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                      >
                        <FaBan className="w-4 h-4" />
                        Rechazar
                      </button>
                    )}

                    {/* Formulario de rechazo */}
                    {canReject() && showRejectForm && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Motivo del rechazo (requerido)..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className={conditionalClasses({
                            light: 'w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none bg-red-50 text-gray-900',
                            dark: 'w-full px-3 py-2 border border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none bg-red-900/30 text-gray-100'
                          })}
                          rows={3}
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setShowRejectForm(false); setRejectionReason(''); }}
                            className={conditionalClasses({ light: 'flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg', dark: 'flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg' })}
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleReject}
                            disabled={actionLoading || !rejectionReason.trim()}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50"
                          >
                            {actionLoading ? 'Procesando...' : 'Confirmar'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Guardar edición */}
                    {canEdit() && request?.workflowStatus === 'borrador' && mode !== 'create' && (
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-[#662d91] hover:bg-[#7a3da8] text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <FaEdit className="w-4 h-4" />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
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

export default DocumentChangeRequestModal;
