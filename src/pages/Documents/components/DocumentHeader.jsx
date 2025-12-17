import React from 'react';
import { FaArrowLeft, FaPlus, FaUpload } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const DocumentHeader = ({
  currentFolder,
  totalUniqueDocuments,
  handleGoBack,
  user,
  setShowCreateFolderModal,
  canWriteInCurrentFolder,
  setShowUploadModal
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div className={`shadow-sm border-b ${conditionalClasses({
      light: 'bg-white border-gray-200',
      dark: 'bg-gray-800 border-gray-700'
    })}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-white'
              })}`}>
                {currentFolder ? `Carpeta: ${currentFolder.name}` : 'Control de Versiones'}
              </h1>
              <p className={`mt-1 ${conditionalClasses({
                light: 'text-gray-600',
                dark: 'text-gray-300'
              })}`}>
                {currentFolder ? currentFolder.description || 'Gestiona versiones de políticas y documentos oficiales' : 'Gestiona versiones de políticas y documentos oficiales'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${conditionalClasses({
              light: 'bg-[#f3ebf9] text-gray-700',
              dark: 'bg-gray-700 text-gray-300'
            })}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{totalUniqueDocuments} documentos</span>
            </div>
            {currentFolder && (
              <button
                onClick={handleGoBack}
                className={`inline-flex items-center px-5 py-2.5 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${conditionalClasses({
                  light: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                })}`}
              >
                <FaArrowLeft className="mr-2" />
                Atrás
              </button>
            )}
            {/* Nueva Carpeta - Solo para Administradores y Técnicos */}
            {(user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') && (
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mr-3"
              >
                <FaPlus className="mr-2" />
                Nueva Carpeta
              </button>
            )}

            {/* Nuevo Documento - Para Administradores, Técnicos y empleados con permisos de escritura */}
            {((user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico') || canWriteInCurrentFolder) && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FaUpload className="mr-2" />
                Nuevo Documento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;