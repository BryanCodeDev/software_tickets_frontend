import React from 'react';
import { FaFolder, FaEdit, FaTrash, FaUser, FaClock } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const FolderCard = ({
  folder,
  getTimeAgo,
  handleEnterFolder,
  canEdit,
  handleEditFolder,
  handleDeleteFolder,
  handleOpenPermissionsModal,
  canManagePermissions
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    <div
      onClick={() => handleEnterFolder(folder)}
      className={`group rounded-xl p-5 border transition-all duration-200 cursor-pointer ${conditionalClasses({
        light: 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-md',
        dark: 'bg-gray-800 border-gray-600 hover:border-blue-400 hover:shadow-lg'
      })}`}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conditionalClasses({
          light: 'bg-linear-to-br from-blue-100 to-indigo-100',
          dark: 'bg-gray-700'
        })}`}>
          <FaFolder className={`text-xl ${conditionalClasses({
            light: 'text-blue-600',
            dark: 'text-blue-400'
          })}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold mb-2 text-lg ${conditionalClasses({
            light: 'text-gray-900',
            dark: 'text-white'
          })}`}>{folder.name}</h3>
          {folder.description && (
            <p className={`text-sm mb-2 ${conditionalClasses({
              light: 'text-gray-600',
              dark: 'text-gray-300'
            })}`}>{folder.description}</p>
          )}
          <div className={`flex items-center gap-3 text-xs ${conditionalClasses({
            light: 'text-gray-500',
            dark: 'text-gray-400'
          })}`}>
            {folder.createdAt && (
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {getTimeAgo(folder.createdAt)}
              </span>
            )}
            {folder.creator && (
              <span className="flex items-center gap-1">
                <FaUser className="w-3 h-3" />
                {folder.creator.name || folder.creator.username}
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
        {canEdit(folder) && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditFolder(folder);
              }}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                light: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                dark: 'bg-blue-900/50 hover:bg-blue-800 text-blue-300'
              })}`}
            >
              <FaEdit className="mr-1" />
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
                light: 'bg-red-50 hover:bg-red-100 text-red-700',
                dark: 'bg-red-900/50 hover:bg-red-800 text-red-300'
              })}`}
            >
              <FaTrash className="mr-1" />
              Eliminar
            </button>
          </>
        )}
        {canManagePermissions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPermissionsModal(folder, 'folder');
            }}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${conditionalClasses({
              light: 'bg-[#f3ebf9] hover:bg-[#f3ebf9] text-[#662d91]',
              dark: 'bg-purple-900/50 hover:bg-purple-800 text-purple-300'
            })}`}
          >
            <FaUser className="mr-1" />
            Permisos
          </button>
        )}
      </div>
    </div>
  );
};

export default FolderCard;