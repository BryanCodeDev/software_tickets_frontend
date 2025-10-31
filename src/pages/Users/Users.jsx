import React, { useState, useEffect, useContext } from 'react';
import { usersAPI } from '../../api';
import { inventoryAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', roleId: 1, it: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [uniqueITs, setUniqueITs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role?.name === 'Administrador') {
      fetchUsers();
      fetchUniqueITs();
      fetchInventoryItems();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniqueITs = async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const data = await inventoryAPI.fetchInventory();
      setInventoryItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', name: '', email: '', password: '', roleId: 1, it: '' });
    setShowModal(true);
  };

  const handleEdit = (usr) => {
    setEditingUser(usr);
    setFormData({
      username: usr.username,
      name: usr.name || '',
      email: usr.email,
      password: '',
      roleId: usr.roleId,
      it: usr.it || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este usuario?', async () => {
      try {
        await usersAPI.deleteUser(id);
        fetchUsers();
        showNotification('Usuario eliminado exitosamente', 'success');
      } catch (err) {
        console.error(err);
        showNotification('Error al eliminar el usuario. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUser) {
        await usersAPI.updateUser(editingUser.id, { roleId: formData.roleId, it: formData.it });
        showNotification('Usuario actualizado exitosamente', 'success');
      } else {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        showNotification('Usuario creado exitosamente', 'success');
      }
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showNotification('Error al guardar el usuario. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancelConfirm = () => {
    setConfirmDialog(null);
  };

  if (!user || user.role?.name !== 'Administrador') {
    return <div className="container mx-auto p-6">Acceso Denegado</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <FaCheck className="w-5 h-5 text-green-400" />
              ) : (
                <FaTimes className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-50"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirmar Acción</h3>
              <p className="text-sm text-gray-600 text-center mb-6">{confirmDialog.message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <FaUsers className="text-white text-lg" />
                </div>
                Usuarios
              </h1>
              <p className="mt-2 text-gray-600">Gestiona los usuarios del sistema</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FaPlus className="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Todos los Usuarios</h2>
          </div>
          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios disponibles</h3>
                <p className="text-gray-600">Comienza creando un nuevo usuario</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((usr) => (
                  <div key={usr.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{usr.username}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {usr.Role?.name}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><strong>Nombre:</strong> {usr.name || usr.username}</p>
                      <p><strong>Email:</strong> {usr.email}</p>
                      <p><strong>Rol:</strong> {usr.Role?.name}</p>
                      <p><strong>IT:</strong> {usr.it ? `${usr.it} (${inventoryItems.find(item => item.it === usr.it)?.area || 'Sin área'})` : 'No asignado'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(usr)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FaEdit />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(usr.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTrash />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl max-h-[95vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                    disabled={editingUser}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                    disabled={editingUser}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                    disabled={editingUser}
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Rol
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value={1}>Administrador</option>
                    <option value={2}>Técnico</option>
                    <option value={3}>Empleado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    IT del Computador
                  </label>
                  <select
                    value={formData.it}
                    onChange={(e) => setFormData({ ...formData, it: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="">Seleccionar IT</option>
                    {uniqueITs.map((item) => (
                      <option key={item.it} value={item.it}>{item.it} ({item.area})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingUser ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingUser ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;