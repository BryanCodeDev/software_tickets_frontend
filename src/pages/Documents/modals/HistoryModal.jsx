import React from 'react';
import { FaTimes, FaDownload, FaTrash } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const HistoryModal = ({
  showHistoryModal,
  setShowHistoryModal,
  selectedDocument,
  getDownloadName,
  handleDownloadDocument,
  handleDeleteVersion,
  user
}) => {
  const { conditionalClasses } = useThemeClasses();

  if (!selectedDocument) return null;

  return (
    showHistoryModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
        <div className={`rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 animate-scale-in ${conditionalClasses({
          light: 'bg-white border-gray-200',
          dark: 'bg-gray-800 border-gray-600'
        })}`}>
          <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Historial de Versiones: {selectedDocument.title}</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {selectedDocument.versions.map((version) => (
                <div key={version.id} className={`p-4 rounded-xl border ${conditionalClasses({
                  light: version.isActive ? 'border-[#8e4dbf] bg-[#f3ebf9]' : 'border-gray-200 bg-gray-50',
                  dark: version.isActive ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 bg-gray-700'
                })}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-bold ${conditionalClasses({
                        light: 'text-gray-900',
                        dark: 'text-white'
                      })}`}>Versión {version.version}</span>
                      {version.isActive && <span className={`px-2 py-1 text-xs font-semibold rounded-full ${conditionalClasses({
                        light: 'bg-[#f3ebf9] text-[#662d91]',
                        dark: 'bg-purple-900/50 text-purple-300'
                      })}`}>Activa</span>}
                      <span className={`text-sm ${conditionalClasses({
                        light: 'text-gray-500',
                        dark: 'text-gray-400'
                      })}`}>{new Date(version.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadDocument(version.id, getDownloadName(selectedDocument, version))}
                        className="inline-flex items-center px-3 py-1.5 bg-[#662d91] hover:bg-[#7a3da8] text-white text-sm font-semibold rounded-lg transition-all"
                      >
                        <FaDownload className="mr-1" />
                        Descargar
                      </button>
                      {(user.role?.name === 'Administrador' || user.role?.name === 'Técnico') && (
                        <button
                          onClick={() => handleDeleteVersion(version.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          <FaTrash className="mr-1" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                  {version.changeDescription && (
                    <p className={`text-sm mb-2 ${conditionalClasses({
                      light: 'text-gray-600',
                      dark: 'text-gray-300'
                    })}`}><strong>Cambios:</strong> {version.changeDescription}</p>
                  )}
                  {version.description && (
                    <p className={`text-sm ${conditionalClasses({
                      light: 'text-gray-600',
                      dark: 'text-gray-300'
                    })}`}><strong>Descripción:</strong> {version.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default HistoryModal;