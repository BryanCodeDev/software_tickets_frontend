import React, { useState, useEffect, useContext } from 'react';
import { rolesAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaShieldAlt, FaKey, FaUserShield, FaUserCog, FaUser, FaChartBar, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { NotificationSystem, ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    description: '',
    permissionIds: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('level');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (user && user.role?.name === 'Administrador') {
      fetchRoles();
      fetchPermissions();
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const data = await rolesAPI.fetchRoles();
      setRoles(data);
    } catch (err) {
      showNotification('Error al cargar roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const [allPermissions, groupedPermissions] = await Promise.all([
        rolesAPI.fetchAllPermissions(),
        rolesAPI.fetchPermissionsByModule()
      ]);
      setPermissions(allPermissions);
      setPermissionsByModule(groupedPermissions);
    } catch (err) {
      showNotification('Error al cargar permisos', 'error');
    }
  };

  // Filter and sort roles
  const filterAndSortRoles = () => {
    let filtered = [...roles];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(role =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

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

  const filteredRoles = filterAndSortRoles();

  // Calculate stats
  const calculateStats = () => {
    const total = roles.length;
    const systemRoles = roles.filter(r => r.name === 'Administrador' || r.name === 'Empleado').length;
    const customRoles = total - systemRoles;
    const totalPermissions = permissions.length;
    const avgPermissions = total > 0 ? Math.round(roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0) / total) : 0;

    return { total, systemRoles, customRoles, totalPermissions, avgPermissions };
  };

  const stats = calculateStats();

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      level: 1,
      description: '',
      permissionIds: []
    });
    setShowCreateModal(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      level: role.level,
      description: role.description || '',
      permissionIds: role.permissions?.map(p => p.id) || []
    });
    setShowEditModal(true);
  };

  const handleDelete = async (roleId) => {
    showConfirmDialog(
      '¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.',
      async () => {
        try {
          await rolesAPI.deleteRole(roleId);
          showNotification('Rol eliminado exitosamente', 'success');
          fetchRoles();
        } catch (err) {
          showNotification('Error al eliminar el rol', 'error');
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingRole) {
        // Update role
        await rolesAPI.updateRole(editingRole.id, {
          name: formData.name,
          level: formData.level,
          description: formData.description
        });

        // Update permissions
        await rolesAPI.updateRolePermissions(editingRole.id, formData.permissionIds);

        showNotification('Rol actualizado exitosamente', 'success');
        setShowEditModal(false);
      } else {
        // Create role
        await rolesAPI.createRole(formData);
        showNotification('Rol creado exitosamente', 'success');
        setShowCreateModal(false);
      }

      fetchRoles();
    } catch (err) {
      showNotification('Error al guardar el rol', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  const handleModulePermissionsToggle = (modulePermissions) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const hasAllPermissions = modulePermissionIds.every(id => formData.permissionIds.includes(id));

    if (hasAllPermissions) {
      // Remove all permissions from this module
      setFormData(prev => ({
        ...prev,
        permissionIds: prev.permissionIds.filter(id => !modulePermissionIds.includes(id))
      }));
    } else {
      // Add all permissions from this module
      setFormData(prev => ({
        ...prev,
        permissionIds: [...new Set([...prev.permissionIds, ...modulePermissionIds])]
      }));
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'Administrador': return <FaUserShield className="w-4 h-4 text-purple-600" />;
      case 'Técnico': return <FaUserCog className="w-4 h-4 text-blue-600" />;
      case 'Calidad': return <FaShieldAlt className="w-4 h-4 text-emerald-600" />;
      default: return <FaUser className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch(roleName) {
      case 'Administrador': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Técnico': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Calidad': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (!user || user.role?.name !== 'Administrador') {
    return <div className="container mx-auto p-6">Acceso Denegado</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      <NotificationSystem
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
          setConfirmDialog(null);
        }}
      />

      <div>
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <FaShieldAlt className="w-6 h-6 text-white" />
                </div>
                Gestión de Roles
              </h1>
              <p className="mt-2 text-gray-600">Administra roles y permisos del sistema</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
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
                <span>Nuevo Rol</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <StatsPanel
            showStats={showStats}
            stats={stats}
            statsConfig={[
              {
                key: 'total',
                label: 'Total Roles',
                icon: FaUsers,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'systemRoles',
                label: 'Roles Sistema',
                icon: FaShieldAlt,
                gradient: 'from-purple-500 to-purple-600',
                loading: loading
              },
              {
                key: 'customRoles',
                label: 'Roles Personalizados',
                icon: FaUserCog,
                gradient: 'from-green-500 to-teal-600',
                loading: loading
              },
              {
                key: 'totalPermissions',
                label: 'Total Permisos',
                icon: FaKey,
                gradient: 'from-orange-500 to-orange-600',
                loading: loading
              },
              {
                key: 'avgPermissions',
                label: 'Permisos Promedio',
                icon: FaChartBar,
                gradient: 'from-indigo-500 to-indigo-600',
                loading: loading
              }
            ]}
          />
        )}

        {/* Filter Panel */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={[]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'name', label: 'Nombre' },
            { value: 'level', label: 'Nivel' },
            { value: 'description', label: 'Descripción' }
          ]}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredRoles.length}</span> de <span className="font-bold">{roles.length}</span> roles
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Todos los Roles</h2>
          </div>
          <div className="p-6">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No se encontraron roles' : 'No hay roles disponibles'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando un nuevo rol'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => (
                  <div key={role.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(role.name)}
                        </div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(role.name)}`}>
                        Nivel {role.level}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><strong>Descripción:</strong> {role.description || 'Sin descripción'}</p>
                      <p><strong>Permisos:</strong> {role.permissions?.length || 0}</p>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Permisos asignados:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.slice(0, 3).map((permission) => (
                            <span key={permission.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {permission.action}
                            </span>
                          ))}
                          {role.permissions && role.permissions.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{role.permissions.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                        disabled={role.name === 'Administrador'}
                      >
                        <FaEdit />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                        disabled={role.name === 'Administrador'}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Crear Nuevo Rol</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nivel *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción del rol"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    rows="3"
                  />
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                    <div key={module} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 capitalize">{module.replace('_', ' ')}</h4>
                        <button
                          type="button"
                          onClick={() => handleModulePermissionsToggle(modulePermissions)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          {modulePermissions.every(p => formData.permissionIds.includes(p.id)) ? 'Desmarcar todo' : 'Marcar todo'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {modulePermissions.map((permission) => (
                          <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissionIds.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{permission.action}</span>
                            {permission.description && (
                              <span className="text-xs text-gray-500">({permission.description})</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                      Creando...
                    </>
                  ) : (
                    'Crear Rol'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Editar Rol</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Nivel *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción del rol"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    rows="3"
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                    <div key={module} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 capitalize">{module.replace('_', ' ')}</h4>
                        <button
                          type="button"
                          onClick={() => handleModulePermissionsToggle(modulePermissions)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          disabled={editingRole.name === 'Administrador'}
                        >
                          {modulePermissions.every(p => formData.permissionIds.includes(p.id)) ? 'Desmarcar todo' : 'Marcar todo'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {modulePermissions.map((permission) => (
                          <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissionIds.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              disabled={editingRole.name === 'Administrador'}
                            />
                            <span className="text-sm text-gray-700">{permission.action}</span>
                            {permission.description && (
                              <span className="text-xs text-gray-500">({permission.description})</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Rol'
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

export default Roles;