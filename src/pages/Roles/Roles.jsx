import React, { useState, useEffect, useContext } from 'react';
import { rolesAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaShieldAlt, FaKey, FaUserShield, FaUserCog, FaUser, FaChartBar, FaSave, FaEye, FaEyeSlash, FaExclamationTriangle, FaInfoCircle, FaCopy, FaDownload } from 'react-icons/fa';
import { ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';

const Roles = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
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
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);
  const { checkPermission } = useAuth();
  
  // Estados adicionales para mejor gestión
  const [showPermissionPreview, setShowPermissionPreview] = useState(false);
  const [selectedRoleForPreview, setSelectedRoleForPreview] = useState(null);
  const [permissionChanges, setPermissionChanges] = useState({});
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('level');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (user && checkPermission('roles', 'view')) {
      fetchRoles();
      fetchPermissions();
    }
  }, [user, checkPermission]);

  const fetchRoles = async () => {
    try {
      const data = await rolesAPI.fetchRoles();
      setRoles(data);
    } catch (err) {
      notifyError('Error al cargar roles');
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
      notifyError('Error al cargar permisos');
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
    const systemRoles = roles.filter(r => ['Administrador', 'Empleado', 'Coordinadora Administrativa', 'Jefe', 'Compras'].includes(r.name)).length;
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
          notifySuccess('Rol eliminado exitosamente');
          fetchRoles();
        } catch (err) {
          notifyError('Error al eliminar el rol');
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

        notifySuccess('Rol actualizado exitosamente');
        setShowEditModal(false);
      } else {
        // Create role
        await rolesAPI.createRole(formData);
        notifySuccess('Rol creado exitosamente');
        setShowCreateModal(false);
      }

      fetchRoles();
    } catch (err) {
      notifyError('Error al guardar el rol');
    } finally {
      setFormLoading(false);
    }
  };

  // Función mejorada para manejar cambios de permisos con seguimiento
  const handlePermissionToggle = (permissionId) => {
    const wasSelected = formData.permissionIds.includes(permissionId);
    const newPermissionIds = wasSelected
      ? formData.permissionIds.filter(id => id !== permissionId)
      : [...formData.permissionIds, permissionId];
    
    setFormData(prev => ({
      ...prev,
      permissionIds: newPermissionIds
    }));

    // Registrar cambios para vista previa
    if (editingRole) {
      setPermissionChanges(prev => ({
        ...prev,
        [permissionId]: !wasSelected
      }));
    }
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

  // Función para previsualizar permisos antes de guardar
  const handlePreviewPermissions = (role) => {
    setSelectedRoleForPreview(role);
    setShowPermissionPreview(true);
  };

  // Función para copiar permisos de un rol a otro
  const handleCopyPermissions = async (sourceRoleId, targetRoleId) => {
    try {
      const sourceRole = roles.find(r => r.id === sourceRoleId);
      const targetRole = roles.find(r => r.id === targetRoleId);
      
      if (!sourceRole || !targetRole) {
        notifyError('Roles no encontrados');
        return;
      }

      const sourcePermissionIds = sourceRole.permissions?.map(p => p.id) || [];
      await rolesAPI.updateRolePermissions(targetRoleId, sourcePermissionIds);
      
      notifySuccess(`Permisos copiados de ${sourceRole.name} a ${targetRole.name}`);
      fetchRoles();
    } catch (err) {
      notifyError('Error al copiar permisos');
    }
  };

  // Función para exportar configuración de roles
  const handleExportRoles = async () => {
    try {
      const exportData = {
        roles: roles.map(role => ({
          name: role.name,
          level: role.level,
          description: role.description,
          permissions: role.permissions?.map(p => ({
            module: p.module,
            action: p.action,
            description: p.description
          })) || []
        })),
        exportDate: new Date().toISOString(),
        exportedBy: user?.name || user?.username
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roles-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      notifySuccess('Configuración de roles exportada exitosamente');
    } catch (err) {
      notifyError('Error al exportar configuración');
    }
  };

  // Función para validar configuración de permisos
  const validatePermissionConfiguration = () => {
    const warnings = [];
    const errors = [];

    roles.forEach(role => {
      const permissionCount = role.permissions?.length || 0;
      
      // Validaciones básicas
      if (permissionCount === 0 && role.name !== 'Empleado') {
        warnings.push(`El rol "${role.name}" no tiene permisos asignados`);
      }
      
      // Validar roles críticos
      if (['Administrador', 'Técnico', 'Calidad', 'Coordinadora Administrativa', 'Jefe', 'Compras'].includes(role.name)) {
        const criticalModules = ['tickets', 'purchase_requests', 'quality_tickets', 'documents'];
        const hasCriticalPermissions = role.permissions?.some(p => criticalModules.includes(p.module));
        
        if (!hasCriticalPermissions) {
          errors.push(`El rol "${role.name}" debe tener permisos en módulos críticos`);
        }
      }
    });

    return { warnings, errors };
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'Administrador': return <FaUserShield className="w-4 h-4 text-[#662d91]" />;
      case 'Coordinadora Administrativa': return <FaUserShield className="w-4 h-4 text-orange-600" />;
      case 'Técnico': return <FaUserCog className="w-4 h-4 text-blue-600" />;
      case 'Calidad': return <FaShieldAlt className="w-4 h-4 text-emerald-600" />;
      case 'Jefe': return <FaUserCog className="w-4 h-4 text-yellow-600" />;
      case 'Compras': return <FaKey className="w-4 h-4 text-teal-600" />;
      default: return <FaUser className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleBadgeColor = (roleName) => {
    const isDark = document.documentElement.classList.contains('dark');
    
    switch(roleName) {
      case 'Administrador':
        return isDark
          ? 'bg-purple-900/50 text-purple-200 border-purple-700'
          : 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]';
      case 'Coordinadora Administrativa':
        return isDark
          ? 'bg-orange-900/50 text-orange-200 border-orange-700'
          : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Técnico':
        return isDark
          ? 'bg-blue-900/50 text-blue-200 border-blue-700'
          : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Calidad':
        return isDark
          ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700'
          : 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Jefe':
        return isDark
          ? 'bg-yellow-900/50 text-yellow-200 border-yellow-700'
          : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Compras':
        return isDark
          ? 'bg-teal-900/50 text-teal-200 border-teal-700'
          : 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return isDark
          ? 'bg-green-900/50 text-green-200 border-green-700'
          : 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (!user || !checkPermission('roles', 'view')) {
    return <div className="container mx-auto p-6">Acceso Denegado</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={conditionalClasses({
      light: "min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4 sm:px-6 lg:px-8",
      dark: "min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
    })}>
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
              <h1 className={conditionalClasses({
                light: "text-3xl font-bold text-gray-900 flex items-center",
                dark: "text-3xl font-bold text-white flex items-center"
              })}>
                <div className="w-12 h-12 bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <FaShieldAlt className="w-6 h-6 text-white" />
                </div>
                Gestión de Roles
              </h1>
              <p className={conditionalClasses({
                light: "mt-2 text-gray-600",
                dark: "mt-2 text-gray-300"
              })}>Administra roles y permisos del sistema</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowStats(!showStats)}
                className={conditionalClasses({
                  light: "inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all",
                  dark: "inline-flex items-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 text-gray-200 font-semibold rounded-xl transition-all"
                })}
                title="Ver estadísticas"
              >
                <FaChartBar className="mr-2" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              
              {/* Botones de acciones rápidas */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className={conditionalClasses({
                    light: "inline-flex items-center px-3 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium rounded-xl transition-all text-sm",
                    dark: "inline-flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 text-gray-200 font-medium rounded-xl transition-all text-sm"
                  })}
                  title="Acciones rápidas"
                >
                  <FaFilter className="mr-1" />
                  <span className="hidden sm:inline">Acciones</span>
                </button>
                
                {showBulkActions && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportRoles}
                      className={conditionalClasses({
                        light: "inline-flex items-center px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-all text-sm",
                        dark: "inline-flex items-center px-3 py-2 bg-green-900 hover:bg-green-800 text-green-300 font-medium rounded-lg transition-all text-sm"
                      })}
                      title="Exportar configuración"
                    >
                      <FaDownload className="mr-1" />
                      <span className="hidden sm:inline">Exportar</span>
                    </button>
                  </div>
                )}
                
                {checkPermission('roles', 'create') && (
                  <button
                    onClick={handleCreate}
                    className={conditionalClasses({
                      light: "flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200",
                      dark: "flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    })}
                  >
                    <FaPlus className="w-5 h-5" />
                    <span>Nuevo Rol</span>
                  </button>
                )}
              </div>
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
                gradient: 'from-[#662d91] to-[#8e4dbf]',
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
          <p className={conditionalClasses({
            light: "text-sm text-gray-600 font-medium",
            dark: "text-sm text-gray-300 font-medium"
          })}>
            Mostrando <span className="font-bold text-[#662d91]">{filteredRoles.length}</span> de <span className="font-bold">{roles.length}</span> roles
          </p>
        </div>

        <div className={conditionalClasses({
          light: "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden",
          dark: "bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
        })}>
          <div className={conditionalClasses({
            light: "px-6 py-4 border-b border-gray-200 bg-gray-50",
            dark: "px-6 py-4 border-b border-gray-700 bg-gray-700"
          })}>
            <h2 className={conditionalClasses({
              light: "text-xl font-semibold text-gray-900",
              dark: "text-xl font-semibold text-white"
            })}>Todos los Roles</h2>
          </div>
          <div className="p-6">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-12">
                <div className={conditionalClasses({
                  light: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
                  dark: "w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                })}>
                  <FaShieldAlt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className={conditionalClasses({
                  light: "text-lg font-medium text-gray-900 mb-2",
                  dark: "text-lg font-medium text-white mb-2"
                })}>
                  {searchTerm ? 'No se encontraron roles' : 'No hay roles disponibles'}
                </h3>
                <p className={conditionalClasses({
                  light: "text-gray-600",
                  dark: "text-gray-300"
                })}>
                  {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando un nuevo rol'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => (
                  <div key={role.id} className={conditionalClasses({
                    light: "bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow",
                    dark: "bg-gray-700 rounded-xl p-6 border border-gray-600 hover:shadow-md transition-shadow"
                  })}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={conditionalClasses({
                          light: "w-10 h-10 bg-[#f3ebf9] rounded-full flex items-center justify-center",
                          dark: "w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center"
                        })}>
                          {getRoleIcon(role.name)}
                        </div>
                        <h3 className={conditionalClasses({
                          light: "font-semibold text-gray-900",
                          dark: "font-semibold text-white"
                        })}>{role.name}</h3>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(role.name)}`}>
                        Nivel {role.level}
                      </span>
                    </div>
                    <div className={conditionalClasses({
                      light: "space-y-2 text-sm text-gray-600 mb-4",
                      dark: "space-y-2 text-sm text-gray-300 mb-4"
                    })}>
                      <p><strong>Descripción:</strong> {role.description || 'Sin descripción'}</p>
                      <p><strong>Permisos:</strong> {role.permissions?.length || 0}</p>
                      <div className={conditionalClasses({
                        light: "pt-2 border-t border-gray-200",
                        dark: "pt-2 border-t border-gray-600"
                      })}>
                        <p className={conditionalClasses({
                          light: "text-xs text-gray-500 mb-2",
                          dark: "text-xs text-gray-400 mb-2"
                        })}>Permisos asignados:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.slice(0, 3).map((permission) => (
                            <span key={permission.id} className={conditionalClasses({
                              light: "px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full",
                              dark: "px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full"
                            })}>
                              {permission.action}
                            </span>
                          ))}
                          {role.permissions && role.permissions.length > 3 && (
                            <span className={conditionalClasses({
                              light: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full",
                              dark: "px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                            })}>
                              +{role.permissions.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {checkPermission('roles', 'edit') && (
                        <button
                          onClick={() => handleEdit(role)}
                          className={conditionalClasses({
                            light: "flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors",
                            dark: "flex items-center space-x-1 px-3 py-1 bg-blue-900 text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-800 transition-colors"
                          })}
                          disabled={role.name === 'Administrador'}
                          title="Editar rol y permisos"
                        >
                          <FaEdit />
                          <span>Editar</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handlePreviewPermissions(role)}
                        className={conditionalClasses({
                          light: "flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-200 transition-colors",
                          dark: "flex items-center space-x-1 px-3 py-1 bg-purple-900 text-purple-300 text-xs font-medium rounded-lg hover:bg-purple-800 transition-colors"
                        })}
                        title="Vista previa de permisos"
                      >
                        <FaEye />
                        <span>Ver</span>
                      </button>
                      
                      {checkPermission('roles', 'delete') && (
                        <button
                          onClick={() => handleDelete(role.id)}
                          className={conditionalClasses({
                            light: "flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors",
                            dark: "flex items-center space-x-1 px-3 py-1 bg-red-900 text-red-300 text-xs font-medium rounded-lg hover:bg-red-800 transition-colors"
                          })}
                          disabled={role.name === 'Administrador'}
                          title="Eliminar rol"
                        >
                          <FaTrash />
                          <span>Eliminar</span>
                        </button>
                      )}
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
          <div className={conditionalClasses({
            light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in",
            dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-700 animate-scale-in"
          })}>
            <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
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
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    required
                  />
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Nivel *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción del rol"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    rows="3"
                  />
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className={conditionalClasses({
                  light: "text-lg font-semibold text-gray-900 mb-4",
                  dark: "text-lg font-semibold text-white mb-4"
                })}>Permisos</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                    <div key={module} className={conditionalClasses({
                      light: "border border-gray-200 rounded-lg p-4",
                      dark: "border border-gray-600 rounded-lg p-4"
                    })}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={conditionalClasses({
                          light: "font-medium text-gray-900 capitalize",
                          dark: "font-medium text-white capitalize"
                        })}>{module.replace('_', ' ')}</h4>
                        <button
                          type="button"
                          onClick={() => handleModulePermissionsToggle(modulePermissions)}
                          className={conditionalClasses({
                            light: "text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors",
                            dark: "text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-gray-200"
                          })}
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
                              className="rounded border-gray-300 text-[#662d91] focus:ring-[#662d91]"
                            />
                            <span className={conditionalClasses({
                              light: "text-sm text-gray-700",
                              dark: "text-sm text-gray-200"
                            })}>{permission.action}</span>
                            {permission.description && (
                              <span className={conditionalClasses({
                                light: "text-xs text-gray-500",
                                dark: "text-xs text-gray-400"
                              })}>({permission.description})</span>
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
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors",
                    dark: "flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-xl transition-colors"
                  })}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                    dark: "flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  })}
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
          <div className={conditionalClasses({
            light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in",
            dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-700 animate-scale-in"
          })}>
            <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
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
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    required
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Nivel *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    required
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={conditionalClasses({
                    light: "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2",
                    dark: "block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2"
                  })}>
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción del rol"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={conditionalClasses({
                      light: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900",
                      dark: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-white"
                    })}
                    rows="3"
                    disabled={editingRole.name === 'Administrador'}
                  />
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className={conditionalClasses({
                  light: "text-lg font-semibold text-gray-900 mb-4",
                  dark: "text-lg font-semibold text-white mb-4"
                })}>Permisos</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                    <div key={module} className={conditionalClasses({
                      light: "border border-gray-200 rounded-lg p-4",
                      dark: "border border-gray-600 rounded-lg p-4"
                    })}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={conditionalClasses({
                          light: "font-medium text-gray-900 capitalize",
                          dark: "font-medium text-white capitalize"
                        })}>{module.replace('_', ' ')}</h4>
                        <button
                          type="button"
                          onClick={() => handleModulePermissionsToggle(modulePermissions)}
                          className={conditionalClasses({
                            light: "text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors",
                            dark: "text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-gray-200"
                          })}
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
                              className="rounded border-gray-300 text-[#662d91] focus:ring-[#662d91] dark:border-gray-500"
                              disabled={editingRole.name === 'Administrador'}
                            />
                            <span className={conditionalClasses({
                              light: "text-sm text-gray-700",
                              dark: "text-sm text-gray-200"
                            })}>{permission.action}</span>
                            {permission.description && (
                              <span className={conditionalClasses({
                                light: "text-xs text-gray-500",
                                dark: "text-xs text-gray-400"
                              })}>({permission.description})</span>
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
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors",
                    dark: "flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-xl transition-colors"
                  })}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                    dark: "flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  })}
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

      {/* Modal de Vista Previa de Permisos */}
      {showPermissionPreview && selectedRoleForPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className={conditionalClasses({
            light: "bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in",
            dark: "bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-700 animate-scale-in"
          })}>
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {getRoleIcon(selectedRoleForPreview.name)}
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white">
                      Permisos: {selectedRoleForPreview.name}
                    </h2>
                    <p className="text-purple-200 text-sm">
                      Nivel {selectedRoleForPreview.level} • {selectedRoleForPreview.permissions?.length || 0} permisos asignados
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPermissionPreview(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {/* Resumen de permisos */}
              <div className="mb-6">
                <div className={conditionalClasses({
                  light: "bg-blue-50 border border-blue-200 rounded-lg p-4",
                  dark: "bg-blue-900/30 border border-blue-700 rounded-lg p-4"
                })}>
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className={conditionalClasses({
                        light: "font-semibold text-blue-900 mb-1",
                        dark: "font-semibold text-blue-200 mb-1"
                      })}>Resumen de Permisos</h4>
                      <p className={conditionalClasses({
                        light: "text-sm text-blue-700",
                        dark: "text-sm text-blue-300"
                      })}>
                        Este rol tiene acceso a {selectedRoleForPreview.permissions?.length || 0} permisos distribuidos en {Object.keys(permissionsByModule).length} módulos del sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permisos por módulo */}
              <div className="space-y-4">
                <h3 className={conditionalClasses({
                  light: "text-lg font-semibold text-gray-900 mb-4",
                  dark: "text-lg font-semibold text-white mb-4"
                })}>Permisos por Módulo</h3>
                
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => {
                  const rolePermissionsInModule = selectedRoleForPreview.permissions?.filter(
                    p => p.module === module
                  ) || [];
                  
                  const hasAllPermissions = modulePermissions.length === rolePermissionsInModule.length;
                  const hasSomePermissions = rolePermissionsInModule.length > 0;
                  
                  return (
                    <div key={module} className={conditionalClasses({
                      light: "border border-gray-200 rounded-lg p-4",
                      dark: "border border-gray-600 rounded-lg p-4"
                    })}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className={conditionalClasses({
                            light: "font-medium text-gray-900 capitalize",
                            dark: "font-medium text-white capitalize"
                          })}>{module.replace('_', ' ')}</h4>
                          <span className={conditionalClasses({
                            light: "text-xs px-2 py-1 rounded-full",
                            dark: "text-xs px-2 py-1 rounded-full"
                          }, hasAllPermissions ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" :
                             hasSomePermissions ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" :
                             "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400")}>
                            {rolePermissionsInModule.length}/{modulePermissions.length}
                          </span>
                        </div>
                        <div className={conditionalClasses({
                          light: "text-sm text-gray-600",
                          dark: "text-sm text-gray-400"
                        })}>
                          {hasAllPermissions ? 'Acceso completo' :
                           hasSomePermissions ? 'Acceso parcial' : 'Sin acceso'}
                        </div>
                      </div>
                      
                      {hasSomePermissions && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {modulePermissions.map((permission) => {
                            const hasPermission = rolePermissionsInModule.some(rp => rp.id === permission.id);
                            return (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  hasPermission ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                  {hasPermission && <FaCheck className="w-2 h-2 text-white" />}
                                </div>
                                <span className={conditionalClasses({
                                  light: `text-sm ${hasPermission ? 'text-gray-900' : 'text-gray-400'}`,
                                  dark: `text-sm ${hasPermission ? 'text-white' : 'text-gray-500'}`
                                })}>
                                  {permission.action}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Acciones */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowPermissionPreview(false)}
                  className={conditionalClasses({
                    light: "flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors",
                    dark: "flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-xl transition-colors"
                  })}
                >
                  Cerrar
                </button>
                {checkPermission('roles', 'edit') && selectedRoleForPreview.name !== 'Administrador' && (
                  <button
                    onClick={() => {
                      setShowPermissionPreview(false);
                      handleEdit(selectedRoleForPreview);
                    }}
                    className={conditionalClasses({
                      light: "flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200",
                      dark: "flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    })}
                  >
                    Editar Permisos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;

