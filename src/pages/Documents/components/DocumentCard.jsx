import React from 'react';
import { FaDownload, FaEdit, FaTrash, FaClock, FaUser, FaTag } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const DocumentCard = ({
  doc,
  getFileIcon,
  getTimeAgo,
  getDownloadName,
  handleDownloadDocument,
  handleViewHistory,
  canEdit,
  handleEdit,
  handleDelete
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div
      className={`group rounded-xl p-5 border transition-all duration-200 ${conditionalClasses({
        light: 'bg-linear-to-r from-gray-50 to-white border-gray-200 hover:border-[#8e4dbf] hover:shadow-md',
        dark: 'bg-gray-800 border-gray-600 hover:border-[#8e4dbf] hover:shadow-lg'
      })}`}
    >
      {/* Document Header with Icon and Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conditionalClasses({
          light: 'bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5]',
          dark: 'bg-gray-700'
        })}`}>
          {getFileIcon(doc.filePath)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold mb-2 text-lg ${conditionalClasses({
            light: 'text-gray-900',
            dark: 'text-white'
          })}`}>{doc.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {doc.type && (
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                light: 'bg-blue-50 text-blue-700',
                dark: 'bg-blue-900 text-blue-300'
              })}`}>
                <FaTag className={`mr-1.5 text-xs ${conditionalClasses({
                  light: 'text-blue-700',
                  dark: 'text-blue-300'
                })}`} />
                {doc.type}
              </span>
            )}
            {doc.category && (
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                light: 'bg-green-50 text-green-700',
                dark: 'bg-green-900 text-green-300'
              })}`}>
                {doc.category}
              </span>
            )}
            {doc.version && (
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${conditionalClasses({
                light: 'bg-[#f3ebf9] text-[#662d91]',
                dark: 'bg-purple-900/50 text-purple-300'
              })}`}>
                v{doc.version}
              </span>
            )}
          </div>
          {doc.description && (
            <p className={`text-sm mb-2 ${conditionalClasses({
              light: 'text-gray-600',
              dark: 'text-gray-300'
            })}`}>{doc.description}</p>
          )}
          {/* NUEVA FUNCIONALIDAD: Información adicional */}
          <div className={`flex items-center gap-3 text-xs mb-2 ${conditionalClasses({
            light: 'text-gray-500',
            dark: 'text-gray-400'
          })}`}>
            {doc.createdAt && (
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {getTimeAgo(doc.createdAt)}
              </span>
            )}
            {doc.createdByUser && (
              <span className="flex items-center gap-1">
                <FaUser className="w-3 h-3" />
                {doc.createdByUser.name || doc.createdByUser.username}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`flex flex-wrap gap-2 pt-3 border-t ${conditionalClasses({
        light: 'border-gray-100',
        dark: 'border-gray-600'
      })}`}>
        <button
          onClick={() => handleDownloadDocument(doc.id, getDownloadName(doc))}
          className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <FaDownload className="mr-2" />
          Descargar
        </button>
        <button
          onClick={() => handleViewHistory(doc)}
          className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
            light: 'bg-green-50 hover:bg-green-100 text-green-700',
            dark: 'bg-green-900/50 hover:bg-green-800 text-green-300'
          })}`}
        >
          <FaClock className="mr-2" />
          Ver Versiones
        </button>
        {canEdit(doc) && (
          <>
            <button
              onClick={() => handleEdit(doc)}
              className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                light: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                dark: 'bg-blue-900/50 hover:bg-blue-800 text-blue-300'
              })}`}
            >
              <FaEdit className="mr-2" />
              Editar
            </button>
            <button
              onClick={() => handleDelete(doc.id)}
              className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                light: 'bg-red-50 hover:bg-red-100 text-red-700',
                dark: 'bg-red-900/50 hover:bg-red-800 text-red-300'
              })}`}
            >
              <FaTrash className="mr-2" />
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;