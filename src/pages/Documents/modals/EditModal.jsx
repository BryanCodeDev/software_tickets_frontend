import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const EditModal = ({
  showEditModal,
  setShowEditModal,
  editFormData,
  setEditFormData,
  handleUpdate
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    showEditModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
        <div className={`rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 animate-scale-in ${conditionalClasses({
          light: 'bg-white border-gray-200',
          dark: 'bg-gray-800 border-gray-600'
        })}`}>
          <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Editar Documento</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre del documento"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Tipo</label>
                <input
                  type="text"
                  placeholder="Ej: Manual, Política"
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Categoría</label>
                <input
                  type="text"
                  placeholder="Ej: Recursos Humanos"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Descripción</label>
                <textarea
                  placeholder="Descripción del contenido del documento"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all resize-none ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  rows="4"
                />
              </div>
            </div>

            <div className={`flex gap-3 pt-4 border-t ${conditionalClasses({
              light: 'border-gray-200',
              dark: 'border-gray-600'
            })}`}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${conditionalClasses({
                  light: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                })}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Actualizar Documento
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditModal;