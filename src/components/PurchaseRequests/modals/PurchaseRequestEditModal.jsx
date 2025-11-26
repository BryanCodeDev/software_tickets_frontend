import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaSpinner } from 'react-icons/fa';
import { purchaseRequestsAPI } from '../../../api';

const PurchaseRequestEditModal = ({
  showEditModal,
  setShowEditModal,
  editingRequest,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    itemType: 'periferico',
    description: '',
    quantity: 1,
    estimatedCost: '',
    justification: ''
  });
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (editingRequest && showEditModal) {
      setFormData({
        title: editingRequest.title || '',
        itemType: editingRequest.itemType || 'periferico',
        description: editingRequest.description || '',
        quantity: editingRequest.quantity || 1,
        estimatedCost: editingRequest.estimatedCost?.toString() || '',
        justification: editingRequest.justification || ''
      });
    }
  }, [editingRequest, showEditModal]);

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
      await purchaseRequestsAPI.updatePurchaseRequest(editingRequest.id, {
        title: formData.title.trim(),
        itemType: formData.itemType,
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        estimatedCost: parseFloat(formData.estimatedCost),
        justification: formData.justification.trim()
      });

      setShowEditModal(false);

      // Callback to parent component
      if (onSuccess) {
        onSuccess('Solicitud actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating purchase request:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar la solicitud. Por favor, intenta nuevamente.';
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

  if (!showEditModal || !editingRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] border-2 border-gray-200 animate-scale-in flex flex-col">
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Editar Solicitud de Compra</h2>
            <button
              onClick={() => setShowEditModal(false)}
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
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
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base ${
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base ${
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base ${
                  errors.justification ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={formLoading}
              />
              {errors.justification && (
                <p className="mt-1 text-sm text-red-600">{errors.justification}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm lg:text-base"
              disabled={formLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 lg:px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <FaSpinner className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <FaEdit className="w-4 h-4 lg:w-5 lg:h-5" />
                  Actualizar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestEditModal;