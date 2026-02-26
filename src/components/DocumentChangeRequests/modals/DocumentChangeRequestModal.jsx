import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileAlt, FaFolder, FaEdit, FaTrash, FaUpload, FaCheck, FaBan, FaUserCircle, FaArrowRight, FaCheckCircle, FaClock, FaExclamationTriangle, FaLayerGroup, FaPlus } from 'react-icons/fa';
import documentsAPI from '../../../api/documentsAPI';
import documentChangeRequestsAPI from '../../../api/documentChangeRequestsAPI';
import { useThemeClasses } from '../../../hooks/useThemeClasses';
import { useNotifications } from '../../../hooks/useNotifications';

const DocumentChangeRequestModal = ({
  isOpen,
  onClose,
  request,
  onSave,
  onSubmit,
  onApprove,
  onDelete,
  user,
  mode,
  canDelete: canDeleteProp
}) => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [confirmDialog, setConfirmDialog] = useState(null);
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

  // Permisos
  const canApproveStep = useCallback(() => {
    if (!request) return false;
    const currentStep = request.currentStep || 1;
    const workflowStatus = request.workflowStatus;
    if (['borrador', 'publicado', 'rechazado'].includes(workflowStatus)) return false;
    if (['Administrador', 'Técnico'].includes(userRole)) return true;
    if (userRole === 'Calidad' && [2, 5].includes(currentStep)) return true;
    if (userRole === 'Jefe' && currentStep === 3) return true;
    if (userRole === 'Coordinadora Administrativa' && currentStep === 4) return true;
    return false;
  }, [request, userRole]);

  const canReject = useCallback(() => {
    if (!request) return false;
    if (['pendiente_revision', 'en_revision', 'aprobado', 'en_implementacion'].includes(request.workflowStatus)) {
      return ['Administrador', 'Técnico', 'Calidad', 'Jefe', 'Coordinadora Administrativa'].includes(userRole);
    }
    return false;
  }, [request, userRole]);

  const canSubmitForReview = useCallback(() => {
    if (!request) return false;
    return request.workflowStatus === 'borrador' && request.requester?.id === user?.id;
  }, [request, user?.id]);

  // Permisos para editar
  // Administrador, Técnico, Calidad pueden editar cualquier solicitud
  // Jefe, CoordinadorAdministrativo, Compras, Empleado solo pueden editar sus PROPIAS solicitudes
  const canEdit = useCallback(() => {
    if (!request) return false;
    // Solo se puede editar si está en borrador o rechazado
    if (!['borrador', 'rechazado'].includes(request.workflowStatus)) return false;
    // Roles que pueden editar cualquier solicitud
    const canEditAll = ['Administrador', 'Técnico', 'Calidad'].includes(userRole);
    // Si tiene rol de editar todo, permitir
    if (canEditAll) return true;
    // Si no, solo puede editar si es su propia solicitud
    return request.requester?.id === user?.id;
  }, [request, user?.id, userRole]);

  // Permisos para eliminar - cualquiera de los estados
  // Administrador, Técnico, Calidad pueden eliminar CUALQUIER solicitud
  // Jefe, CoordinadorAdministrativo, Compras, Empleado solo pueden eliminar sus PROPIAS solicitudes
  const canDelete = useCallback(() => {
    // Si se pasa la función desde la página, usarla
    if (canDeleteProp) {
      return canDeleteProp(request);
    }
    // Función interna por defecto
    if (!request) return false;
    // Roles que pueden eliminar cualquier solicitud
    const canDeleteAll = ['Administrador', 'Técnico', 'Calidad'].includes(userRole);
    // Si tiene rol de eliminar todo, permitir
    if (canDeleteAll) return true;
    // Si no, solo puede eliminar si es su propia solicitud
    return request.requester?.id === user?.id;
  }, [request, user?.id, userRole, canDeleteProp]);

  // Workflow steps
  const getWorkflowSteps = () => {
    const steps = [
      { status: 'borrador', label: 'Borrador', icon: FaLayerGroup },
      { status: 'pendiente_revision', label: 'Pendiente', icon: FaClock },
      { status: 'en_revision', label: 'En Revisión', icon: FaClock },
      { status: 'aprobado', label: 'Aprobado', icon: FaCheck },
      { status: 'en_implementacion', label: 'Implementación', icon: FaCheckCircle },
      { status: 'publicado', label: 'Publicado', icon: FaCheckCircle }
    ];
    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getWorkflowSteps();
    return steps.findIndex(step => step.status === request?.workflowStatus);
  };

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
    } catch (err) { console.error('Error loading documents:', err); }
  };

  const loadFolders = async () => {
    try {
      const response = await documentsAPI.fetchFolders();
      setFolders(response || []);
    } catch (err) { console.error('Error loading folders:', err); }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', requestType: 'create', documentId: '', folderId: '', justification: '', impactAnalysis: '', affectedProcesses: '', priority: 'media', observations: '' });
    setSelectedFile(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const validateForm = () => {
    if (!formData.title.trim()) return 'El título es requerido';
    if (!formData.description.trim()) return 'La descripción es requerida';
    if (!formData.justification.trim() || formData.justification.length < 10) return 'La justificación debe tener al menos 10 caracteres';
    if (formData.requestType === 'create' && !formData.folderId) return 'Debe seleccionar una carpeta';
    if (['edit', 'version_update'].includes(formData.requestType) && !formData.documentId) return 'Debe seleccionar el documento';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    try {
      const data = { ...formData, affectedProcesses: formData.affectedProcesses.split(',').map(s => s.trim()).filter(Boolean) };
      let savedRequest = request?.id ? await documentChangeRequestsAPI.update(request.id, data) : await documentChangeRequestsAPI.create(data);
      if (selectedFile && savedRequest.id) await documentChangeRequestsAPI.uploadFile(savedRequest.id, selectedFile);
      onSave(savedRequest);
      onClose();
    } catch (err) { setError(err.response?.data?.error || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const handleSubmitForReview = async () => {
    if (!request?.id) return;
    setLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.submitForReview(request.id);
      onSubmit(updatedRequest);
      onClose();
    } catch (err) { setError(err.response?.data?.error || 'Error al enviar a revisión'); }
    finally { setLoading(false); }
  };

  const handleApprove = async () => {
    if (!request?.id) return;
    setActionLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.approveStep(request.id, { stepNumber: request.currentStep, action: 'approve', comment: actionComment });
      onApprove(updatedRequest);
      onClose();
    } catch (err) { setError(err.response?.data?.error || 'Error al aprobar'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!request?.id || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.approveStep(request.id, { stepNumber: request.currentStep, action: 'reject', comment: rejectionReason });
      onApprove(updatedRequest);
      onClose();
    } catch (err) { setError(err.response?.data?.error || 'Error al rechazar'); }
    finally { setActionLoading(false); }
  };

  // Función para mostrar el diálogo de confirmación
  const showConfirmDialog = useCallback((message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  }, []);

  const handleDelete = async () => {
    if (!request?.id) return;
    
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta solicitud de cambio documental? Esta acción no se puede deshacer y la solicitud será movida a la papelera.', async () => {
      setActionLoading(true);
      try {
        await documentChangeRequestsAPI.delete(request.id);
        notifySuccess('Solicitud eliminada correctamente');
        onDelete?.();
        onClose();
      } catch (err) { 
        notifyError(err.response?.data?.error || 'Error al eliminar');
      } finally { 
        setActionLoading(false); 
      }
    });
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view' && request && !['borrador', 'rechazado'].includes(request.workflowStatus);

  const currentStepIndex = getCurrentStepIndex();
  const workflowSteps = getWorkflowSteps();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-3 sm:p-4 animate-fade-in">
          <div className={conditionalClasses({
            light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in",
            dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl max-w-md w-full border border-gray-600 transform animate-scale-in"
          })}>
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className={`text-lg lg:text-xl font-bold text-center mb-3 ${conditionalClasses({
                light: "text-gray-900",
                dark: "text-white"
              })}`}>Confirmar Acción</h3>
              <p className={`text-xs sm:text-sm text-center mb-4 lg:mb-6 leading-relaxed ${conditionalClasses({
                light: "text-gray-600",
                dark: "text-gray-300"
              })}`}>{confirmDialog.message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation",
                    dark: "flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
                  })}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base touch-manipulation"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-2xl w-full max-w-[95vw] sm:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 ${conditionalClasses({ light: 'border-gray-200', dark: 'border-gray-700' })}`}>
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
              <span className="text-white font-bold text-base sm:text-xl">#{request?.id || 'N'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-lg sm:text-2xl font-bold ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })} truncate`}>
                {mode === 'create' ? 'Nueva Solicitud' : request?.title || 'Detalles'}
              </h2>
              {request && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                    request.workflowStatus === 'borrador' ? 'bg-slate-100 text-slate-700' :
                    request.workflowStatus === 'pendiente_revision' ? 'bg-amber-100 text-amber-700' :
                    request.workflowStatus === 'en_revision' ? 'bg-blue-100 text-blue-700' :
                    request.workflowStatus === 'aprobado' ? 'bg-emerald-100 text-emerald-700' :
                    request.workflowStatus === 'en_implementacion' ? 'bg-purple-100 text-purple-700' :
                    request.workflowStatus === 'publicado' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.workflowStatus === 'borrador' && 'Borrador'}
                    {request.workflowStatus === 'pendiente_revision' && 'Pendiente'}
                    {request.workflowStatus === 'en_revision' && 'En Revisión'}
                    {request.workflowStatus === 'aprobado' && 'Aprobado'}
                    {request.workflowStatus === 'en_implementacion' && 'Implementación'}
                    {request.workflowStatus === 'publicado' && 'Publicado'}
                    {request.workflowStatus === 'rechazado' && 'Rechazado'}
                  </span>
                  <span className={`text-xs sm:text-sm ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                    Paso {request.currentStep}/{request.totalSteps}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className={`p-2 sm:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' })} self-end sm:self-center`}>
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">
            {/* Main Content */}
            <div className="lg:col-span-2 p-4 sm:p-6 space-y-4 sm:space-y-6">
              {error && (
                <div className={`p-4 rounded-xl border ${conditionalClasses({ light: 'bg-red-50 border-red-200 text-red-700', dark: 'bg-red-900/20 border-red-800 text-red-400' })}`}>
                  {error}
                </div>
              )}

              {/* Workflow Timeline */}
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-800' })}`}>
                <h3 className={`text-sm sm:text-lg font-bold mb-3 sm:mb-5 ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>
                  Progreso
                </h3>
                <div className="flex items-center justify-between overflow-x-auto pb-2">
                  {workflowSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.status} className="flex flex-col items-center min-w-15">
                        <div className={`
                          w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all shrink-0
                          ${isCompleted ? 'bg-green-500 text-white' : 
                            isCurrent ? 'bg-purple-500 text-white animate-pulse' : 
                            conditionalClasses({ light: 'bg-gray-200 text-gray-400', dark: 'bg-gray-700 text-gray-500' })}
                        `}>
                          {isCompleted ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : <StepIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-center ${isCurrent ? 'text-purple-600 dark:text-purple-400' : conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                          {step.label.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-800' })}`}>
                <h3 className={`text-sm sm:text-lg font-bold mb-3 sm:mb-5 ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>
                  Detalles
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Título *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900 disabled:bg-gray-100', dark: 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-600' })
                      }`}
                      placeholder="Título" />
                  </div>

                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Tipo *</label>
                    <select name="requestType" value={formData.requestType} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}>
                      <option value="create">Crear</option>
                      <option value="edit">Editar</option>
                      <option value="version_update">Nueva Versión</option>
                      <option value="delete">Eliminar</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Prioridad *</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  {formData.requestType === 'create' && (
                    <div>
                      <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Carpeta *</label>
                      <select name="folderId" value={formData.folderId} onChange={handleChange} disabled={isReadOnly}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                          conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                        }`}>
                        <option value="">Seleccionar...</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                  )}

                  {['edit', 'version_update', 'delete'].includes(formData.requestType) && (
                    <div>
                      <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Documento *</label>
                      <select name="documentId" value={formData.documentId} onChange={handleChange} disabled={isReadOnly}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                          conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                        }`}>
                        <option value="">Seleccionar...</option>
                        {documents.map(d => <option key={d.id} value={d.id}>{d.title} (v{d.version})</option>)}
                      </select>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Justificación *</label>
                    <textarea name="justification" value={formData.justification} onChange={handleChange} disabled={isReadOnly} rows={2}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="¿Por qué es necesario este cambio?" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Descripción *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} disabled={isReadOnly} rows={3}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Descripción detallada" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Análisis de Impacto</label>
                    <textarea name="impactAnalysis" value={formData.impactAnalysis} onChange={handleChange} disabled={isReadOnly} rows={2}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Impacto en otros procesos" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Procesos Afectados</label>
                    <input type="text" name="affectedProcesses" value={formData.affectedProcesses} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm sm:text-base ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Ej: Compras, Ventas" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={`p-4 sm:p-6 border-l space-y-4 sm:space-y-6 ${conditionalClasses({ light: 'border-gray-200 bg-gray-50', dark: 'border-gray-700 bg-gray-800' })}`}>
              {/* Solicitante */}
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
                <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wide mb-3 sm:mb-4 ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>Solicitante</h4>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${conditionalClasses({ light: 'bg-purple-100', dark: 'bg-purple-900/50' })}`}>
                    <span className={`text-base sm:text-lg font-bold ${conditionalClasses({ light: 'text-purple-600', dark: 'text-purple-400' })}`}>
                      {(request?.requester?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm sm:text-base truncate ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>{request?.requester?.name || 'Usuario'}</p>
                    <p className={`text-xs sm:text-sm truncate ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>{request?.requester?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Acciones - Mostrar siempre para permitir crear/editar */}
              <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
                <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wide mb-3 sm:mb-4 ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>Acciones</h4>
                <div className="space-y-2 sm:space-y-3">
                  {/* Botón Crear para nueva solicitud */}
                  {mode === 'create' && (
                    <button onClick={handleSave} disabled={loading}
                      className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                      <FaPlus className="w-4 h-4" /> Crear Solicitud
                    </button>
                  )}

                  {/* Botón Eliminar */}
                  {canDelete() && (
                    <button onClick={handleDelete} disabled={actionLoading}
                      className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                      <FaTrash className="w-4 h-4" /> Eliminar
                    </button>
                  )}

                  {canSubmitForReview() && (
                    <button onClick={handleSubmitForReview} disabled={loading}
                      className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                      <FaArrowRight className="w-4 h-4" /> Enviar
                    </button>
                  )}

                  {canApproveStep() && !showRejectForm && (
                    <div className="space-y-2">
                      <textarea value={actionComment} onChange={(e) => setActionComment(e.target.value)} placeholder="Comentarios (opcional)"
                        className={`w-full px-3 py-2 rounded-lg border-2 text-sm ${conditionalClasses({ light: 'border-gray-200 bg-white', dark: 'border-gray-600 bg-gray-800' })}`} rows={2} />
                      <button onClick={handleApprove} disabled={actionLoading}
                        className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                        <FaCheckCircle className="w-4 h-4" /> Aprobar
                      </button>
                    </div>
                  )}

                  {canReject() && !showRejectForm && (
                    <button onClick={() => setShowRejectForm(true)}
                      className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                      <FaBan className="w-4 h-4" /> Rechazar
                    </button>
                  )}

                  {canReject() && showRejectForm && (
                    <div className="space-y-2">
                      <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Motivo (requerido)"
                        className={`w-full px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30 text-sm`} rows={3} required />
                      <div className="flex gap-2">
                        <button onClick={() => { setShowRejectForm(false); setRejectionReason(''); }} 
                          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm ${conditionalClasses({ light: 'bg-gray-100 hover:bg-gray-200', dark: 'bg-gray-700 hover:bg-gray-600' })}`}>
                          Cancelar
                        </button>
                        <button onClick={handleReject} disabled={actionLoading || !rejectionReason.trim()}
                          className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 text-sm">
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}

                  {canEdit() && ['borrador', 'rechazado'].includes(request?.workflowStatus) && mode !== 'create' && (
                    <button onClick={handleSave} disabled={loading}
                      className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                      <FaEdit className="w-4 h-4" /> Guardar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChangeRequestModal;
