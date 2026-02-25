import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileAlt, FaFolder, FaEdit, FaTrash, FaUpload, FaBan, FaUserCircle, FaArrowRight, FaCheckCircle, FaClock, FaExclamationTriangle, FaLayerGroup, FaXmark } from 'react-icons/fa';
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
  onDelete,
  user,
  mode
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

  const canEdit = useCallback(() => {
    if (!request) return false;
    if (request.requester?.id === user?.id && request.workflowStatus === 'borrador') return true;
    return ['Administrador', 'Calidad', 'Técnico'].includes(userRole);
  }, [request, user?.id, userRole]);

  const canDelete = useCallback(() => {
    if (!request) return false;
    if (request.workflowStatus !== 'borrador') return false;
    if (request.requester?.id === user?.id) return true;
    return ['Administrador', 'Técnico', 'Calidad'].includes(userRole);
  }, [request, user?.id, userRole]);

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

  const handleDelete = async () => {
    if (!request?.id) return;
    if (!confirm('¿Eliminar esta solicitud? Esta acción no se puede deshacer.')) return;
    setActionLoading(true);
    try {
      await documentChangeRequestsAPI.delete(request.id);
      onDelete?.();
      onClose();
    } catch (err) { setError(err.response?.data?.error || 'Error al eliminar'); }
    finally { setActionLoading(false); }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view' || (request && !['borrador', 'rechazado'].includes(request.workflowStatus));

  const currentStepIndex = getCurrentStepIndex();
  const workflowSteps = getWorkflowSteps();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
        
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between shrink-0 ${conditionalClasses({ light: 'border-gray-200', dark: 'border-gray-700' })}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">#{request?.id || 'N'}</span>
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>
                {mode === 'create' ? 'Nueva Solicitud de Cambio' : request?.title || 'Detalles de Solicitud'}
              </h2>
              {request && (
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    request.workflowStatus === 'borrador' ? 'bg-slate-100 text-slate-700' :
                    request.workflowStatus === 'pendiente_revision' ? 'bg-amber-100 text-amber-700' :
                    request.workflowStatus === 'en_revision' ? 'bg-blue-100 text-blue-700' :
                    request.workflowStatus === 'aprobado' ? 'bg-emerald-100 text-emerald-700' :
                    request.workflowStatus === 'en_implementacion' ? 'bg-purple-100 text-purple-700' :
                    request.workflowStatus === 'publicado' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.workflowStatus === 'borrador' && 'Borrador'}
                    {request.workflowStatus === 'pendiente_revision' && 'Pendiente Revisión'}
                    {request.workflowStatus === 'en_revision' && 'En Revisión'}
                    {request.workflowStatus === 'aprobado' && 'Aprobado'}
                    {request.workflowStatus === 'en_implementacion' && 'En Implementación'}
                    {request.workflowStatus === 'publicado' && 'Publicado'}
                    {request.workflowStatus === 'rechazado' && 'Rechazado'}
                  </span>
                  <span className={`text-sm ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                    Paso {request.currentStep} de {request.totalSteps}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className={`p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' })}`}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">
            {/* Main Content */}
            <div className="lg:col-span-2 p-6 space-y-6">
              {error && (
                <div className={`p-4 rounded-xl border ${conditionalClasses({ light: 'bg-red-50 border-red-200 text-red-700', dark: 'bg-red-900/20 border-red-800 text-red-400' })}`}>
                  {error}
                </div>
              )}

              {/* Workflow Timeline */}
              <div className={`rounded-2xl p-6 ${conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-800' })}`}>
                <h3 className={`text-lg font-bold mb-5 ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>
                  Progreso del Workflow
                </h3>
                <div className="flex items-center justify-between">
                  {workflowSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all
                          ${isCompleted ? 'bg-green-500 text-white' : 
                            isCurrent ? 'bg-purple-500 text-white animate-pulse' : 
                            conditionalClasses({ light: 'bg-gray-200 text-gray-400', dark: 'bg-gray-700 text-gray-500' })}
                        `}>
                          {isCompleted ? <FaCheck className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-purple-600 dark:text-purple-400' : conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div className={`rounded-2xl p-6 ${conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-800' })}`}>
                <h3 className={`text-lg font-bold mb-5 ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>
                  Detalles de la Solicitud
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Título *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900 disabled:bg-gray-100', dark: 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-600' })
                      }`}
                      placeholder="Título de la solicitud" />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Tipo de Cambio *</label>
                    <select name="requestType" value={formData.requestType} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}>
                      <option value="create">Crear Nuevo Documento</option>
                      <option value="edit">Editar Documento Existente</option>
                      <option value="version_update">Nueva Versión</option>
                      <option value="delete">Eliminar Documento</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Prioridad *</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
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
                      <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Carpeta *</label>
                      <select name="folderId" value={formData.folderId} onChange={handleChange} disabled={isReadOnly}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                          conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                        }`}>
                        <option value="">Seleccionar...</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                  )}

                  {['edit', 'version_update', 'delete'].includes(formData.requestType) && (
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Documento *</label>
                      <select name="documentId" value={formData.documentId} onChange={handleChange} disabled={isReadOnly}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                          conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                        }`}>
                        <option value="">Seleccionar...</option>
                        {documents.map(d => <option key={d.id} value={d.id}>{d.title} (v{d.version})</option>)}
                      </select>
                    </div>
                  )}

                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Justificación * (mín 10 caracteres)</label>
                    <textarea name="justification" value={formData.justification} onChange={handleChange} disabled={isReadOnly} rows={3}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="¿Por qué es necesario este cambio?" />
                  </div>

                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Descripción *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} disabled={isReadOnly} rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Descripción detallada del cambio" />
                  </div>

                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Análisis de Impacto</label>
                    <textarea name="impactAnalysis" value={formData.impactAnalysis} onChange={handleChange} disabled={isReadOnly} rows={3}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Impacto en otros procesos" />
                  </div>

                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}`}>Procesos Afectados</label>
                    <input type="text" name="affectedProcesses" value={formData.affectedProcesses} onChange={handleChange} disabled={isReadOnly}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                        conditionalClasses({ light: 'border-gray-200 bg-white text-gray-900', dark: 'border-gray-600 bg-gray-700 text-white' })
                      }`}
                      placeholder="Ej: Compras, Ventas, Almacén" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={`p-6 border-l space-y-6 ${conditionalClasses({ light: 'border-gray-200 bg-gray-50', dark: 'border-gray-700 bg-gray-800' })}`}>
              {/* Solicitante */}
              <div className={`rounded-2xl p-5 ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wide mb-4 ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>Solicitante</h4>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${conditionalClasses({ light: 'bg-purple-100', dark: 'bg-purple-900/50' })}`}>
                    <span className={`text-lg font-bold ${conditionalClasses({ light: 'text-purple-600', dark: 'text-purple-400' })}`}>
                      {(request?.requester?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className={`font-bold ${conditionalClasses({ light: 'text-gray-900', dark: 'text-white' })}`}>{request?.requester?.name || 'Usuario'}</p>
                    <p className={`text-sm ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>{request?.requester?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {(canApproveStep() || canReject() || canSubmitForReview() || canDelete()) && (
                <div className={`rounded-2xl p-5 ${conditionalClasses({ light: 'bg-white', dark: 'bg-gray-900' })}`}>
                  <h4 className={`text-sm font-bold uppercase tracking-wide mb-4 ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>Acciones</h4>
                  <div className="space-y-3">
                    {canDelete() && (
                      <button onClick={handleDelete} disabled={actionLoading}
                        className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                        <FaTrash className="w-4 h-4" /> Eliminar
                      </button>
                    )}

                    {canSubmitForReview() && (
                      <button onClick={handleSubmitForReview} disabled={loading}
                        className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                        <FaArrowRight className="w-4 h-4" /> Enviar a Revisión
                      </button>
                    )}

                    {canApproveStep() && !showRejectForm && (
                      <div className="space-y-2">
                        <textarea value={actionComment} onChange={(e) => setActionComment(e.target.value)} placeholder="Comentarios (opcional)"
                          className={`w-full px-3 py-2 rounded-lg border-2 ${conditionalClasses({ light: 'border-gray-200 bg-white', dark: 'border-gray-600 bg-gray-800' })}`} rows={2} />
                        <button onClick={handleApprove} disabled={actionLoading}
                          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                          <FaCheckCircle className="w-4 h-4" /> Aprobar
                        </button>
                      </div>
                    )}

                    {canReject() && !showRejectForm && (
                      <button onClick={() => setShowRejectForm(true)}
                        className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                        <FaBan className="w-4 h-4" /> Rechazar
                      </button>
                    )}

                    {canReject() && showRejectForm && (
                      <div className="space-y-2">
                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Motivo del rechazo (requerido)"
                          className={`w-full px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30`} rows={3} required />
                        <div className="flex gap-2">
                          <button onClick={() => { setShowRejectForm(false); setRejectionReason(''); }} 
                            className={`flex-1 py-2 px-3 rounded-lg font-medium ${conditionalClasses({ light: 'bg-gray-100 hover:bg-gray-200', dark: 'bg-gray-700 hover:bg-gray-600' })}`}>
                            Cancelar
                          </button>
                          <button onClick={handleReject} disabled={actionLoading || !rejectionReason.trim()}
                            className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50">
                            Confirmar
                          </button>
                        </div>
                      </div>
                    )}

                    {canEdit() && request?.workflowStatus === 'borrador' && mode !== 'create' && (
                      <button onClick={handleSave} disabled={loading}
                        className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                        <FaEdit className="w-4 h-4" /> Guardar
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
