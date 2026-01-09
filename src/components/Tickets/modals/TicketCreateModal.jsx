import React from 'react';
import { FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

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
  standardizedTitles,
  isCalidad = false
}) => {
  const { conditionalClasses } = useThemeClasses();
  const canShowAssignment = ['Jefe', 'Compras', 'Coordinadora Administrativa', 'Calidad', 'Empleado'].includes(userRole);
  
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className={conditionalClasses({
        light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
        dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-600 animate-scale-in'
      })}>
        <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
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
              <label className={conditionalClasses({
                light: 'block text-sm font-semibold text-gray-700 mb-2',
                dark: 'block text-sm font-semibold text-gray-200 mb-2'
              })}>
                Categoría del Problema *
              </label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={conditionalClasses({
                  light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-gray-900 bg-white',
                  dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-white bg-gray-700'
                })}
                required
              >
                <option value="">Selecciona una categoría</option>
                {standardizedTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={conditionalClasses({
                light: 'block text-sm font-semibold text-gray-700 mb-2',
                dark: 'block text-sm font-semibold text-gray-200 mb-2'
              })}>
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={conditionalClasses({
                  light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base text-gray-900 bg-white placeholder-gray-500',
                  dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium resize-none text-sm lg:text-base text-white bg-gray-700 placeholder-gray-400'
                })}
                rows="4 lg:rows-5"
                required
              />
            </div>

            <div>
              <label className={conditionalClasses({
                light: 'block text-sm font-semibold text-gray-700 mb-2',
                dark: 'block text-sm font-semibold text-gray-200 mb-2'
              })}>
                Prioridad *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={conditionalClasses({
                  light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-gray-900 bg-white',
                  dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-white bg-gray-700'
                })}
              >
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>

            <div>
              <label className={conditionalClasses({
                light: 'block text-sm font-semibold text-gray-700 mb-2',
                dark: 'block text-sm font-semibold text-gray-200 mb-2'
              })}>
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={conditionalClasses({
                  light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-gray-900 bg-white',
                  dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-white bg-gray-700'
                })}
              >
                <option value="abierto">Abierto</option>
                <option value="en progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={conditionalClasses({
                light: 'block text-sm font-semibold text-gray-700 mb-2',
                dark: 'block text-sm font-semibold text-gray-200 mb-2'
              })}>
                Archivo adjunto (opcional)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                className={conditionalClasses({
                  light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-gray-900 bg-white file:bg-gray-100 file:border-0 file:px-3 file:py-2 file:rounded-lg file:text-sm file:font-medium file:text-gray-700 file:cursor-pointer hover:file:bg-gray-200',
                  dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-white bg-gray-700 file:bg-gray-600 file:border-0 file:px-3 file:py-2 file:rounded-lg file:text-sm file:font-medium file:text-gray-200 file:cursor-pointer hover:file:bg-gray-500'
                })}
              />
              <p className={conditionalClasses({
                light: 'text-xs text-gray-500 mt-1',
                dark: 'text-xs text-gray-400 mt-1'
              })}>Puedes subir imágenes o videos (máx. 10MB)</p>
            </div>

            {canShowAssignment && (
              <div className="md:col-span-2">
                <label className={conditionalClasses({
                  light: 'block text-sm font-semibold text-gray-700 mb-2',
                  dark: 'block text-sm font-semibold text-gray-200 mb-2'
                })}>
                  Asignar a
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className={conditionalClasses({
                    light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-gray-900 bg-white',
                    dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base text-white bg-gray-700'
                  })}
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
                    <optgroup label={isCalidad ? "🛡️ Calidad" : "👨‍💼 Administradores"}>
                      <option value={isCalidad ? "all-calidad" : "all-administrators"}>
                        {isCalidad ? "Todos los de calidad" : "Todos los administradores"}
                      </option>
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

          <div className={conditionalClasses({
            light: 'flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100',
            dark: 'flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-700'
          })}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className={conditionalClasses({
                light: 'px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm lg:text-base',
                dark: 'px-4 lg:px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all text-sm lg:text-base'
              })}
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
