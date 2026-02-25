import React from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const UploadModal = ({
  showUploadModal,
  setShowUploadModal,
  formData,
  setFormData,
  handleUpload,
  uploadLoading,
  documents,
  folders
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    showUploadModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
        <div className={`rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 animate-scale-in ${conditionalClasses({
          light: 'bg-white border-gray-200',
          dark: 'bg-gray-800 border-gray-600'
        })}`}>
          <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Nuevo Documento</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleUpload} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-5rem)]">
            <div className="flex items-center space-x-4 mb-4">
              <label className={`flex items-center ${conditionalClasses({
                light: 'text-gray-700',
                dark: 'text-gray-300'
              })}`}>
                <input
                  type="radio"
                  name="uploadType"
                  checked={!formData.isNewVersion}
                  onChange={() => setFormData({ ...formData, isNewVersion: false, parentDocumentId: null })}
                  className="mr-2"
                />
                Nuevo Documento
              </label>
              <label className={`flex items-center ${conditionalClasses({
                light: 'text-gray-700',
                dark: 'text-gray-300'
              })}`}>
                <input
                  type="radio"
                  name="uploadType"
                  checked={formData.isNewVersion}
                  onChange={() => setFormData({ ...formData, isNewVersion: true })}
                  className="mr-2"
                />
                Nueva Versión
              </label>
            </div>

            {formData.isNewVersion && (
              <div>
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>
                  Seleccionar Documento Base <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parentDocumentId || ''}
                  onChange={(e) => {
                    const docsArray = Array.isArray(documents) ? documents : [];
                    const selectedDoc = docsArray.find(doc => doc.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      parentDocumentId: e.target.value,
                      title: selectedDoc ? selectedDoc.title : '',
                      type: selectedDoc ? selectedDoc.type : '',
                      category: selectedDoc ? selectedDoc.category : '',
                      version: selectedDoc ? (parseFloat(selectedDoc.version) + 0.1).toFixed(1) : '1.0'
                    });
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  required={formData.isNewVersion}
                >
                  <option value="">Seleccionar documento...</option>
                  {(Array.isArray(documents) ? documents : [])
                    .filter(doc => doc.isActive)
                    .sort((a, b) => {
                      // Ordenar por carpeta primero, luego por título
                      const aFolder = (Array.isArray(folders) ? folders : []).find(f => f.id === a.folderId)?.name || 'Raíz';
                      const bFolder = (Array.isArray(folders) ? folders : []).find(f => f.id === b.folderId)?.name || 'Raíz';
                      if (aFolder !== bFolder) return aFolder.localeCompare(bFolder);
                      return a.title.localeCompare(b.title);
                    })
                    .map((doc) => {
                      const folderName = (Array.isArray(folders) ? folders : []).find(f => f.id === doc.folderId)?.name || 'Raíz';
                      return (
                        <option key={doc.id} value={doc.id}>
                          [{folderName}] {doc.title} (v{doc.version})
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  required
                  disabled={formData.isNewVersion}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Versión</label>
                <input
                  type="text"
                  placeholder="Ej: 1.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
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
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  disabled={formData.isNewVersion}
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
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  disabled={formData.isNewVersion}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Descripción</label>
                <textarea
                  placeholder="Descripción del contenido del documento"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all resize-none ${conditionalClasses({
                    light: 'border-gray-300 bg-white',
                    dark: 'border-gray-600 bg-gray-700 text-white'
                  })}`}
                  rows="3"
                />
              </div>

              {formData.isNewVersion && (
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}`}>Descripción de Cambios</label>
                  <textarea
                    placeholder="Describe los cambios en esta versión"
                    value={formData.changeDescription}
                    onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all resize-none ${conditionalClasses({
                      light: 'border-gray-300 bg-white',
                      dark: 'border-gray-600 bg-gray-700 text-white'
                    })}`}
                    rows="2"
                  />
                </div>
              )}

              {!formData.isNewVersion && (
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}`}>Carpeta</label>
                  <select
                    value={formData.folderId || ''}
                    onChange={(e) => setFormData({ ...formData, folderId: e.target.value || null })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all ${conditionalClasses({
                      light: 'border-gray-300 bg-white',
                      dark: 'border-gray-600 bg-gray-700 text-white'
                    })}`}
                  >
                    <option value="">Seleccionar carpeta (opcional)</option>
                    {(Array.isArray(folders) ? folders : []).map((folder) => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>
                  Archivo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer ${conditionalClasses({
                    light: 'border-gray-300 file:bg-[#f3ebf9] file:text-[#662d91] hover:file:bg-[#e8d5f5]',
                    dark: 'border-gray-600 file:bg-purple-900/50 file:text-purple-300 file:border-gray-600'
                  })}`}
                  required
                />
              </div>
            </div>

            <div className={`flex gap-3 pt-4 border-t ${conditionalClasses({
              light: 'border-gray-200',
              dark: 'border-gray-600'
            })}`}>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${conditionalClasses({
                  light: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                })}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Subir Documento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UploadModal;