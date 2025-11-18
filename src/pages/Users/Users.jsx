import React, { useState, useEffect, useContext } from 'react';
import { usersAPI } from '../../api';
import { inventoryAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaEye, FaEyeSlash, FaSearch, FaFilter, FaUserShield, FaUserCog, FaUser, FaChartBar, FaDownload, FaSortAmountDown, FaSortAmountUp, FaClock, FaEnvelope, FaKey, FaToggleOn, FaToggleOff, FaBan } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', roleId: 1, it: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uniqueITs, setUniqueITs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // NUEVAS FUNCIONALIDADES: Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStats, setShowStats] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchUniqueITs = async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (err) {
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const data = await inventoryAPI.fetchInventory();
      setInventoryItems(data);
    } catch (err) {
    }
  };

  // NUEVA FUNCIONALIDAD: Filtrado y ordenamiento
  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(usr =>
        usr.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usr.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usr.it?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rol
    if (filterRole !== 'all') {
      filtered = filtered.filter(usr => usr.Role?.name === filterRole);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'Role') {
        aVal = a.Role?.name || '';
        bVal = b.Role?.name || '';
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal?.toLowerCase() || '';
        bVal = bVal?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredUsers = filterAndSortUsers();

  // NUEVA FUNCIONALIDAD: Calcular estadísticas
  const calculateStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.Role?.name === 'Administrador').length;
    const technicians = users.filter(u => u.Role?.name === 'Técnico').length;
    const employees = users.filter(u => u.Role?.name === 'Empleado').length;
    const withIT = users.filter(u => u.it).length;

    return { total, admins, technicians, employees, withIT };
  };

  const stats = calculateStats();

  // NUEVA FUNCIONALIDAD: Verificar fortaleza de contraseña
  const checkPasswordStrength = (password) => {
    if (!password) return null;
    
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('Mínimo 8 caracteres');
    
    if (password.length >= 12) strength++;
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    else feedback.push('Mayúsculas y minúsculas');
    
    if (/\d/.test(password)) strength++;
    else feedback.push('Números');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    else feedback.push('Caracteres especiales');

    let level = 'weak';
    let color = 'red';
    if (strength >= 4) {
      level = 'strong';
      color = 'green';
    } else if (strength >= 2) {
      level = 'medium';
      color = 'yellow';
    }

    return { level, color, strength, feedback };
  };

  // NUEVA FUNCIONALIDAD: Generar contraseña segura
  const generateSecurePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+-='[Math.floor(Math.random() * 14)];
    
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
    showNotification('Contraseña segura generada', 'success');
  };


  // NUEVA FUNCIONALIDAD: Obtener icono de rol
  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'Administrador': return <FaUserShield className="w-4 h-4 text-purple-600" />;
      case 'Técnico': return <FaUserCog className="w-4 h-4 text-blue-600" />;
      case 'Empleado': return <FaUser className="w-4 h-4 text-green-600" />;
      default: return <FaUser className="w-4 h-4 text-gray-600" />;
    }
  };

  // NUEVA FUNCIONALIDAD: Obtener color de badge por rol
  const getRoleBadgeColor = (roleName) => {
    switch(roleName) {
      case 'Administrador': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Técnico': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Empleado': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // NUEVA FUNCIONALIDAD: Tiempo relativo
  const getTimeAgo = (date) => {
    if (!date) return 'Desconocido';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months}m`;
    return `Hace ${Math.floor(months / 12)}a`;
  };

  // Actualizar fortaleza de contraseña cuando cambia
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', name: '', email: '', password: '', roleId: 1, it: '' });
    setPasswordStrength(null);
    setShowModal(true);
  };

  const handleEdit = (usr) => {
    setEditingUser(usr);
    setFormData({
      username: usr.username,
      name: usr.name || '',
      email: usr.email,
      password: usr.password || '',
      roleId: usr.roleId,
      it: usr.it || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este usuario?', async () => {
      try {
        const response = await usersAPI.deleteUser(id);
        fetchUsers();

        if (response.deactivated) {
          showNotification('Usuario desactivado exitosamente (tenía registros relacionados)', 'success');
        } else {
          showNotification('Usuario eliminado exitosamente', 'success');
        }
      } catch (err) {
        if (err.response?.data?.error?.includes('registros relacionados')) {
          showNotification(err.response.data.error, 'error');
        } else if (err.response?.data?.error?.includes('propio usuario')) {
          showNotification(err.response.data.error, 'error');
        } else {
          showNotification('Error al eliminar el usuario. Por favor, inténtalo de nuevo.', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUser) {
        const updateData = { roleId: formData.roleId, it: formData.it };
        if (formData.password) updateData.password = formData.password;
        await usersAPI.updateUser(editingUser.id, updateData);
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <FaUsers className="text-white text-lg" />
                </div>
                Usuarios
              </h1>
              <p className="mt-2 text-gray-600">Gestiona los usuarios del sistema</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* NUEVA FUNCIONALIDAD: Botones de estadísticas */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                title="Ver estadísticas"
              >
                <FaChartBar className="mr-2" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlus className="w-5 h-5" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>
        </div>

        {/* NUEVA FUNCIONALIDAD: Panel de estadísticas */}
        {showStats && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in fade-in">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaUsers className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.total}</span>
                </div>
                <p className="text-sm font-medium opacity-90">Total Usuarios</p>
              </div>

              <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaUserShield className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.admins}</span>
                </div>
                <p className="text-sm font-medium opacity-90">Administradores</p>
              </div>

              <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaUserCog className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.technicians}</span>
                </div>
                <p className="text-sm font-medium opacity-90">Técnicos</p>
              </div>

              <div className="bg-linear-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaUser className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.employees}</span>
                </div>
                <p className="text-sm font-medium opacity-90">Empleados</p>
              </div>

              <div className="bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaCheck className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.withIT}</span>
                </div>
                <p className="text-sm font-medium opacity-90">Con IT Asignado</p>
              </div>
            </div>
          </div>
        )}

        {/* NUEVA FUNCIONALIDAD: Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por username, nombre, email o IT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showFilters 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          {/* NUEVA FUNCIONALIDAD: Panel de filtros expandible */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-100 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todos los roles</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Empleado">Empleado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="username">Username</option>
                  <option value="name">Nombre</option>
                  <option value="email">Email</option>
                  <option value="Role">Rol</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Orden</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {sortOrder === 'asc' ? <FaSortAmountDown className="w-5 h-5" /> : <FaSortAmountUp className="w-5 h-5" />}
                    <span className="text-sm font-medium">{sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NUEVA FUNCIONALIDAD: Resumen de resultados y vista */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredUsers.length}</span> de <span className="font-bold">{users.length}</span> usuarios
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Todos los Usuarios</h2>
          </div>
          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios disponibles'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza creando un nuevo usuario'}
                </p>
              </div>
            ) : (
              <>
                {/* NUEVA FUNCIONALIDAD: Vista de cuadrícula */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((usr) => (
                    <div key={usr.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            {getRoleIcon(usr.Role?.name)}
                          </div>
                          <h3 className="font-semibold text-gray-900">{usr.username}</h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(usr.Role?.name)}`}>
                          {usr.Role?.name}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-3 h-3 text-gray-400" />
                          <p><strong>Nombre:</strong> {usr.name || usr.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-3 h-3 text-gray-400" />
                          <p className="truncate"><strong>Email:</strong> {usr.email}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1"><strong>IT Asignado:</strong></p>
                          {usr.it ? (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <p className="text-xs font-semibold text-blue-700">{usr.it}</p>
                              <p className="text-xs text-blue-600">
                                {inventoryItems.find(item => item.it === usr.it)?.area || 'Sin área'}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No asignado</p>
                          )}
                        </div>
                        {/* NUEVA FUNCIONALIDAD: Mostrar fecha de creación */}
                        {usr.createdAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                            <FaClock className="w-3 h-3" />
                            <span>Creado {getTimeAgo(usr.createdAt)}</span>
                          </div>
                        )}
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
                          disabled={usr.id === user?.id}
                        >
                          <FaTrash />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

                {(!editingUser || (user && user.role?.name === 'Administrador')) && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Contraseña{!editingUser ? ' *' : ''}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-20 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                        required={!editingUser}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                        {/* NUEVA FUNCIONALIDAD: Botón para generar contraseña */}
                        <button
                          type="button"
                          onClick={generateSecurePassword}
                          className="text-gray-400 hover:text-purple-600 p-1 transition-colors"
                          title="Generar contraseña segura"
                        >
                          <FaKey className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {/* NUEVA FUNCIONALIDAD: Indicador de fortaleza de contraseña */}
                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.color === 'red' ? 'bg-red-500' :
                                passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.color === 'red' ? 'text-red-600' :
                            passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {passwordStrength.level === 'weak' ? 'Débil' :
                             passwordStrength.level === 'medium' ? 'Media' : 'Fuerte'}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Mejoras: {passwordStrength.feedback.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
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
                    <option value="">Sin asignar</option>
                    {uniqueITs.map((item) => (
                      <option key={item.it} value={item.it}>
                        {item.it} ({item.area})
                      </option>
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
