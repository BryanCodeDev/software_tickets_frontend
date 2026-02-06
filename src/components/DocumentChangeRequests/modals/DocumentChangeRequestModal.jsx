import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaFileAlt, FaFolder, FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import documentsAPI from '../../../api/documentsAPI';
import foldersAPI from '../../../api/documentsAPI';
import documentChangeRequestsAPI from '../../../api/documentChangeRequestsAPI';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

const DocumentChangeRequestModal = ({
  isOpen,
  onClose,
  request,
  onSave,
  onSubmit,
  onApprove,
  mode // 'create', 'edit', 'view', 'approve'
}) => {
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
  const [approvalComment, setApprovalComment] = useState('');

  // Hook para clases de tema
  const { conditionalClasses } = useThemeClasses();

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
          affectedProcesses: request.affectedProcesses ? request.affectedProcesses.join(', ') : '',
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
      const response = await documentsAPI.getAll({ limit: 100 });
      setDocuments(response.documents || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await documentsAPI.getAllFolders();
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

      // Subir archivo si existe
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

  const handleApprove = async (action) => {
    if (!request?.id) return;

    setLoading(true);
    try {
      const updatedRequest = await documentChangeRequestsAPI.approveStep(request.id, {
        stepNumber: request.currentStep,
        action,
        comment: approvalComment
      });
      onApprove(updatedRequest);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || `Error al ${action === 'approve' ? 'aprobar' : 'rechazar'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view' || (request && request.workflowStatus !== 'borrador' && mode !== 'approve');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto
        ${documentChangeRequestsAPI ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className={`
          p-4 lg:p-6 border-b flex items-center justify-between
          ${conditionalClasses({
            light: 'bg-white border-gray-200',
            dark: 'bg-gray-800 border-gray-700'
          })}
        `}>
          <h2 className={`
            text-xl font-bold
            ${conditionalClasses({
              light: 'text-gray-900',
              dark: 'text-white'
            })}
          `}>
            {mode === 'create' ? 'Nueva Solicitud de Cambio' :
             mode === 'edit' ? 'Editar Solicitud' :
             mode === 'approve' ? 'Aprobar Solicitud' :
             'Detalles de Solicitud'}
          </h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${conditionalClasses({
                light: 'text-gray-500 hover:text-gray-700',
                dark: 'text-gray-400 hover:text-gray-200'
              })}
            `}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Workflow Status Badge */}
          {request && (
            <div className="mb-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                Estado: {request.workflowStatus} | Paso: {request.currentStep} de {request.totalSteps}
              </span>
            </div>
          )}

          {/* Approval Comment */}
          {mode === 'approve' && (
            <div className="mb-4">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Comentario de Aprobación *
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                rows={3}
                placeholder="Ingrese un comentario para la aprobación o rechazo..."
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Título */}
            <div className="lg:col-span-2">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Título del Cambio *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100',
                    dark: 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600'
                  })}
                `}
                placeholder="Ej: Actualización del Procedimiento de Compras"
              />
            </div>

            {/* Tipo de Solicitud */}
            <div>
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Tipo de Cambio *
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
              >
                <option value="create">Crear Nuevo Documento</option>
                <option value="edit">Editar Documento Existente</option>
                <option value="version_update">Nueva Versión</option>
                <option value="delete">Eliminar Documento</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Prioridad *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
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
                <label className={`
                  block text-sm font-medium mb-2
                  ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}
                `}>
                  <FaFolder className="inline mr-1" />
                  Carpeta de Destino *
                </label>
                <select
                  name="folderId"
                  value={formData.folderId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`
                    w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    ${conditionalClasses({
                      light: 'bg-white border-gray-300 text-gray-900',
                      dark: 'bg-gray-700 border-gray-600 text-white'
                    })}
                  `}
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
                <label className={`
                  block text-sm font-medium mb-2
                  ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}
                `}>
                  <FaFileAlt className="inline mr-1" />
                  Documento a Modificar *
                </label>
                <select
                  name="documentId"
                  value={formData.documentId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`
                    w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    ${conditionalClasses({
                      light: 'bg-white border-gray-300 text-gray-900',
                      dark: 'bg-gray-700 border-gray-600 text-white'
                    })}
                  `}
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
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Justificación del Cambio * (Mínimo 10 caracteres)
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={3}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                placeholder="Explique por qué es necesario este cambio (ISO 9001 requiere trazabilidad)..."
              />
            </div>

            {/* Descripción */}
            <div className="lg:col-span-2">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Descripción del Cambio *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={4}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                placeholder="Describa detalladamente los cambios que se realizarán..."
              />
            </div>

            {/* Análisis de Impacto */}
            <div className="lg:col-span-2">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Análisis de Impacto
              </label>
              <textarea
                name="impactAnalysis"
                value={formData.impactAnalysis}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={3}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                placeholder="Analice el impacto de este cambio en otros procesos..."
              />
            </div>

            {/* Procesos Afectados */}
            <div className="lg:col-span-2">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Procesos Afectados (separados por coma)
              </label>
              <input
                type="text"
                name="affectedProcesses"
                value={formData.affectedProcesses}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                placeholder="Ej: Compras, Almacén, Ventas"
              />
            </div>

            {/* Observaciones */}
            <div className="lg:col-span-2">
              <label className={`
                block text-sm font-medium mb-2
                ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}
              `}>
                Observaciones Adicionales
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={2}
                className={`
                  w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  ${conditionalClasses({
                    light: 'bg-white border-gray-300 text-gray-900',
                    dark: 'bg-gray-700 border-gray-600 text-white'
                  })}
                `}
                placeholder="Cualquier observación adicional..."
              />
            </div>

            {/* Upload de archivo */}
            {mode !== 'view' && (
              <div className="lg:col-span-2">
                <label className={`
                  block text-sm font-medium mb-2
                  ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}
                `}>
                  <FaUpload className="inline mr-1" />
                  Archivo Propuesto
                </label>
                <div className={`
                  border-2 border-dashed rounded-lg p-6 text-center
                  ${conditionalClasses({
                    light: 'border-gray-300 hover:border-purple-500',
                    dark: 'border-gray-600 hover:border-purple-500'
                  })}
                `}>
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
                        <span>{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FaUpload className="w-8 h-8 text-gray-400" />
                        <span className={conditionalClasses({
                          light: 'text-gray-500',
                          dark: 'text-gray-400'
                        })}>
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

        {/* Footer */}
        <div className={`
          p-4 lg:p-6 border-t flex items-center justify-end gap-3
          ${conditionalClasses({
            light: 'bg-gray-50 border-gray-200',
            dark: 'bg-gray-800 border-gray-700'
          })}
        `}>
          <button
            onClick={onClose}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${conditionalClasses({
                light: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
                dark: 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              })}
            `}
          >
            {mode === 'approve' ? 'Cancelar' : 'Cancelar'}
          </button>
          
          {mode === 'approve' ? (
            <>
              <button
                onClick={() => handleApprove('reject')}
                disabled={loading}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                  ${conditionalClasses({
                    light: 'bg-red-100 hover:bg-red-200 text-red-700',
                    dark: 'bg-red-900/30 hover:bg-red-800/40 text-red-300'
                  })}
                `}
              >
                <FaTimes />
                Rechazar
              </button>
              <button
                onClick={() => handleApprove('approve')}
                disabled={loading || !approvalComment.trim()}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                  ${conditionalClasses({
                    light: 'bg-green-100 hover:bg-green-200 text-green-700',
                    dark: 'bg-green-900/30 hover:bg-green-800/40 text-green-300'
                  })}
                `}
              >
                <FaCheck />
                Aprobar
              </button>
            </>
          ) : (
            <>
              {request?.workflowStatus === 'borrador' && (
                <button
                  onClick={handleSubmitForReview}
                  disabled={loading}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${conditionalClasses({
                      light: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
                      dark: 'bg-purple-900/30 hover:bg-purple-800/40 text-purple-300'
                    })}
                  `}
                >
                  <FaEdit />
                  Enviar a Revisión
                </button>
              )}
              {!isReadOnly && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${conditionalClasses({
                      light: 'bg-[#662d91] hover:bg-[#5a257a] text-white',
                      dark: 'bg-purple-600 hover:bg-purple-500 text-white'
                    })}
                  `}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentChangeRequestModal;
