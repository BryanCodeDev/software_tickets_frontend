import React from 'react';
import { FaTimes, FaUser, FaTrash } from 'react-icons/fa';
import { useThemeClasses } from '../../../hooks/useThemeClasses.js';

const PermissionsModal = ({
  showPermissionsModal,
  setShowPermissionsModal,
  selectedItemForPermissions,
  permissions,
  allUsers,
  userSearchTerm,
  setUserSearchTerm,
  selectedUsers,
  setSelectedUsers,
  permissionType,
  setPermissionType,
  handleGrantPermissions,
  handleRevokePermission,
  handleSelectAllUsers,
  handleDeselectAllUsers,
  handleUserToggle,
  filteredUsers
}) => {
  const { conditionalClasses } = useThemeClasses();

  return (
    showPermissionsModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
        <div className={`rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 animate-scale-in ${conditionalClasses({
          light: 'bg-white border-gray-200',
          dark: 'bg-gray-800 border-gray-600'
        })}`}>
          <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Gestionar Permisos</h2>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
            {/* Current Permissions */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-white'
              })}`}>Permisos Actuales</h3>
              {permissions.length === 0 ? (
                <p className={`text-center py-4 ${conditionalClasses({
                  light: 'text-gray-500',
                  dark: 'text-gray-400'
                })}`}>No hay permisos asignados</p>
              ) : (
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className={`flex items-center justify-between p-4 rounded-lg ${conditionalClasses({
                      light: 'bg-gray-50',
                      dark: 'bg-gray-700'
                    })}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${conditionalClasses({
                          light: 'bg-[#f3ebf9]',
                          dark: 'bg-purple-900/50'
                        })}`}>
                          <FaUser className={`w-4 h-4 ${conditionalClasses({
                            light: 'text-[#662d91]',
                            dark: 'text-purple-300'
                          })}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${conditionalClasses({
                            light: 'text-gray-900',
                            dark: 'text-white'
                          })}`}>
                            {permission.user?.name || permission.user?.username}
                          </p>
                          <p className={`text-sm ${conditionalClasses({
                            light: 'text-gray-500',
                            dark: 'text-gray-400'
                          })}`}>{permission.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          permission.permissionType === 'write'
                            ? conditionalClasses({
                              light: 'bg-green-100 text-green-700',
                              dark: 'bg-green-900/50 text-green-300'
                            })
                            : conditionalClasses({
                              light: 'bg-blue-100 text-blue-700',
                              dark: 'bg-blue-900/50 text-blue-300'
                            })
                        }`}>
                          {permission.permissionType === 'write' ? 'Lectura y Escritura' : 'Solo Lectura'}
                        </span>
                        <button
                          onClick={() => handleRevokePermission(permission.id)}
                          className={`p-2 rounded-lg transition-colors ${conditionalClasses({
                            light: 'text-red-600 hover:bg-red-50',
                            dark: 'text-red-400 hover:bg-red-900/20'
                          })}`}
                          title="Revocar permiso"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grant New Permissions */}
            <div className={`border-t pt-6 ${conditionalClasses({
              light: 'border-gray-200',
              dark: 'border-gray-600'
            })}`}>
              <h3 className={`text-lg font-semibold mb-4 ${conditionalClasses({
                light: 'text-gray-900',
                dark: 'text-white'
              })}`}>Otorgar Nuevos Permisos</h3>

              {/* Permission Type */}
              <div className="mb-4">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Tipo de Permiso</label>
                <div className="flex gap-4">
                  <label className={`flex items-center ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}`}>
                    <input
                      type="radio"
                      name="permissionType"
                      value="read"
                      checked={permissionType === 'read'}
                      onChange={(e) => setPermissionType(e.target.value)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${conditionalClasses({
                      light: 'text-gray-700',
                      dark: 'text-gray-300'
                    })}`}>Solo Lectura (ver y descargar)</span>
                  </label>
                  <label className={`flex items-center ${conditionalClasses({
                    light: 'text-gray-700',
                    dark: 'text-gray-300'
                  })}`}>
                    <input
                      type="radio"
                      name="permissionType"
                      value="write"
                      checked={permissionType === 'write'}
                      onChange={(e) => setPermissionType(e.target.value)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${conditionalClasses({
                      light: 'text-gray-700',
                      dark: 'text-gray-300'
                    })}`}>Lectura y Escritura (crear, editar, eliminar)</span>
                  </label>
                </div>
              </div>

              {/* User Selection */}
              <div className="mb-4">
                <label className={`block text-sm font-semibold mb-2 ${conditionalClasses({
                  light: 'text-gray-700',
                  dark: 'text-gray-300'
                })}`}>Seleccionar Usuarios</label>

                {/* Search Bar */}
                <div className="mb-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${conditionalClasses({
                      light: 'text-gray-400',
                      dark: 'text-gray-500'
                    })}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar usuarios por nombre, usuario o email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-[#662d91] focus:border-[#662d91] text-sm ${conditionalClasses({
                      light: 'border-gray-300 bg-white',
                      dark: 'border-gray-600 bg-gray-700 text-white'
                    })}`}
                  />
                </div>

                {/* Selection Controls */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleSelectAllUsers}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${conditionalClasses({
                      light: 'bg-[#f3ebf9] text-[#662d91] hover:bg-[#e8d5f5]',
                      dark: 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'
                    })}`}
                  >
                    Seleccionar Todos
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllUsers}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${conditionalClasses({
                      light: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                      dark: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    })}`}
                  >
                    Deseleccionar Todos
                  </button>
                  <span className={`text-xs self-center ml-auto ${conditionalClasses({
                    light: 'text-gray-500',
                    dark: 'text-gray-400'
                  })}`}>
                    {selectedUsers.length} seleccionados
                  </span>
                </div>

                {/* Users List */}
                <div className={`border rounded-lg max-h-60 overflow-y-auto ${conditionalClasses({
                  light: 'border-gray-300',
                  dark: 'border-gray-600'
                })}`}>
                  {filteredUsers.length === 0 ? (
                    <div className={`p-4 text-center text-sm ${conditionalClasses({
                      light: 'text-gray-500',
                      dark: 'text-gray-400'
                    })}`}>
                      {userSearchTerm ? (
                        `No se encontraron usuarios para "${userSearchTerm}"`
                      ) : allUsers.length === 0 ? (
                        <div>
                          <p className={`${conditionalClasses({
                            light: 'text-gray-600',
                            dark: 'text-gray-300'
                          })}`}>No hay usuarios disponibles</p>
                          <p className={`text-xs mt-1 ${conditionalClasses({
                            light: 'text-gray-500',
                            dark: 'text-gray-400'
                          })}`}>Verifica que tengas permisos para ver usuarios</p>
                        </div>
                      ) : (
                        'No hay usuarios que coincidan con los criterios'
                      )}
                    </div>
                  ) : (
                    <div className={`divide-y ${conditionalClasses({
                      light: 'divide-gray-200',
                      dark: 'divide-gray-600'
                    })}`}>
                      {filteredUsers.map((u) => (
                        <label key={u.id} className={`flex items-center p-3 cursor-pointer ${conditionalClasses({
                          light: 'hover:bg-gray-50',
                          dark: 'hover:bg-gray-700'
                        })}`}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => handleUserToggle(u.id)}
                            className="mr-3 h-4 w-4 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${conditionalClasses({
                              light: 'bg-[#f3ebf9]',
                              dark: 'bg-purple-900/50'
                            })}`}>
                              <span className={`text-sm font-medium ${conditionalClasses({
                                light: 'text-[#662d91]',
                                dark: 'text-purple-300'
                              })}`}>
                                {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm truncate ${conditionalClasses({
                                light: 'text-gray-900',
                                dark: 'text-white'
                              })}`}>
                                {u.name || u.username || 'Usuario sin nombre'}
                              </p>
                              <p className={`text-xs truncate ${conditionalClasses({
                                light: 'text-gray-500',
                                dark: 'text-gray-400'
                              })}`}>
                                {u.email || 'Sin email'}
                              </p>
                              {u.Role && (
                                <p className={`text-xs truncate ${conditionalClasses({
                                  light: 'text-[#662d91]',
                                  dark: 'text-purple-300'
                                })}`}>
                                  {u.Role.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className={`flex gap-3 pt-4 border-t ${conditionalClasses({
                light: 'border-gray-200',
                dark: 'border-gray-600'
              })}`}>
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${conditionalClasses({
                    light: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                    dark: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  })}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGrantPermissions}
                  disabled={selectedUsers.length === 0}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Otorgar Permisos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PermissionsModal;