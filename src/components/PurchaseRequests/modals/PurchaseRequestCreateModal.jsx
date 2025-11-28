import React, { useState } from 'react';
import { FaTimes, FaPlus, FaSpinner, FaPaperclip, FaTrash } from 'react-icons/fa';
import { purchaseRequestsAPI } from '../../../api';

const PurchaseRequestCreateModal = ({
  showCreateModal,
  setShowCreateModal,
  formData,
  setFormData,
  userRole,
  onSuccess // Nueva prop para callback
}) => {
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.justification.trim()) {
      newErrors.justification = 'La justificación es requerida';
    }

    if (!formData.estimatedCost || parseFloat(formData.estimatedCost) <= 0) {
      newErrors.estimatedCost = 'El costo estimado debe ser mayor a 0';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const request = await purchaseRequestsAPI.createPurchaseRequest({
        title: formData.title.trim(),
        itemType: formData.itemType,
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        estimatedCost: parseFloat(formData.estimatedCost),
        justification: formData.justification.trim()
      });

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const attachment of attachments) {
          try {
            await purchaseRequestsAPI.uploadAttachment(request.id, attachment.file);
          } catch (uploadError) {
            console.error('Error uploading attachment:', uploadError);
            // Continue with other uploads even if one fails
          }
        }
      }

      // Reset form
      setFormData({
        title: '',
        itemType: 'periferico',
        description: '',
        quantity: 1,
        estimatedCost: '',
        justification: ''
      });
      setErrors({});
      setAttachments([]);
      setShowCreateModal(false);

      // Callback to parent component
      if (onSuccess) {
        onSuccess('Solicitud creada exitosamente');
      }
    } catch (error) {
      console.error('Error creating purchase request:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la solicitud. Por favor, intenta nuevamente.';
      if (onSuccess) {
        onSuccess(errorMessage, 'error');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const formatCurrency = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert('Algunos archivos fueron rechazados. Solo se permiten archivos de hasta 10MB de tipos: PDF, Word, Excel, imágenes y texto.');
    }

    setAttachments(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }))]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleCostChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({
      ...prev,
      estimatedCost: formatted
    }));
    if (errors.estimatedCost) {
      setErrors(prev => ({
        ...prev,
        estimatedCost: ''
      }));
    }
  };

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] border-2 border-gray-200 animate-scale-in flex flex-col">
        <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Nueva Solicitud de Compra</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
            >
              <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título de la Solicitud *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Mouse inalámbrico Logitech"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={formLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Ítem *
              </label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                disabled={formLoading}
              >
                <option value="periferico">Periférico</option>
                <option value="electrodomestico">Electrodoméstico</option>
                <option value="software">Software</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
                  errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={formLoading}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Costo Estimado (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="text"
                  value={formData.estimatedCost}
                  onChange={handleCostChange}
                  placeholder="0"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
                    errors.estimatedCost ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  disabled={formLoading}
                />
              </div>
              {errors.estimatedCost && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedCost}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe detalladamente el ítem que necesitas..."
                rows="4 lg:rows-5"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={formLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Justificación *
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleInputChange}
                placeholder="Explica por qué necesitas este ítem y cómo beneficiará tu trabajo..."
                rows="4 lg:rows-5"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base ${
                  errors.justification ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={formLoading}
              />
              {errors.justification && (
                <p className="mt-1 text-sm text-red-600">{errors.justification}</p>
              )}
            </div>

            {/* Attachments Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Archivos Adjuntos (Opcional)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                    <FaPaperclip className="mr-2" />
                    Seleccionar Archivos
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                      disabled={formLoading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Tipos permitidos: PDF, Word, Excel, imágenes. Máximo 10MB por archivo.
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1 min-w-0">
                          <FaPaperclip className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                          disabled={formLoading}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm lg:text-base"
              disabled={formLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <FaSpinner className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                  Crear Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestCreateModal;

