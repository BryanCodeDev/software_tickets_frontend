import React from 'react';
import { FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';

const TicketCreateModal = ({
  showCreateModal,
  setShowCreateModal,
  formData,
  setFormData,
  handleCreateSubmit,
  formLoading,
  userRole,
  technicians,
  administrators,
  standardizedTitles
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Crear Nuevo Ticket</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
            >
              <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría del Problema *
              </label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                required
              >
                <option value="">Selecciona una categoría</option>
                {standardizedTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base"
                rows="4 lg:rows-5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
              >
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
              >
                <option value="abierto">Abierto</option>
                <option value="en progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Archivo adjunto (opcional)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">Puedes subir imágenes o videos (máx. 10MB)</p>
            </div>

            {(userRole === 'Administrador' || userRole === 'Técnico') && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asignar a
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                >
                  <option value="">Sin asignar</option>
                  {technicians.length > 0 && (
                    <optgroup label="👨‍💻 Técnicos">
                      <option value="all-technicians">Todos los técnicos</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name || tech.username}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {administrators.length > 0 && (
                    <optgroup label="👨‍💼 Administradores">
                      <option value="all-administrators">Todos los administradores</option>
                      {administrators.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name || admin.username}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100">
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
              className="flex-1 px-4 lg:px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
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
                  Crear Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreateModal;