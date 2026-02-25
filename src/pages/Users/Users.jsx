import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { usersAPI, authAPI } from '../../api';
import { inventoryAPI } from '../../api';
import { corporatePhoneAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaEye, FaEyeSlash, FaSearch, FaFilter, FaUserShield, FaUserCog, FaUser, FaChartBar, FaDownload, FaSortAmountDown, FaSortAmountUp, FaClock, FaEnvelope, FaKey, FaToggleOn, FaToggleOff, FaBan, FaShieldAlt, FaCrown, FaClipboardList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { NotificationSystem, ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';
import { onUserUpdated, onUsersListUpdated, offUserUpdated, offUsersListUpdated } from '../../api/socket';
import { CONFIG } from '../../constants';

const Users = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', roleId: 1, it: '', hasCorporatePhone: false, corporatePhone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uniqueITs, setUniqueITs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [availablePhones, setAvailablePhones] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const { user } = useContext(AuthContext);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(CONFIG.DEFAULT_PAGE_SIZE);

  // NUEVAS FUNCIONALIDADES: Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStats, setShowStats] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Efecto para debounce de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset a página 1 al buscar
    }, CONFIG.DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch
      };
      const data = await usersAPI.fetchUsers(params);
      setUsers(data.data || []);
      setTotalUsers(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  const fetchUniqueITs = useCallback(async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (error) {
      console.error('Error al cargar ITs únicos:', error);
    }
  }, []);

  const fetchInventoryItems = useCallback(async () => {
    try {
      const data = await inventoryAPI.fetchInventory({ limit: 1000 });
      setInventoryItems(data.data || []);
    } catch (error) {
      console.error('Error al cargar items de inventario:', error);
    }
  }, []);

  const fetchAvailablePhones = useCallback(async () => {
    try {
      const phones = await corporatePhoneAPI.fetchCorporatePhones();
      // Filtrar solo los teléfonos activos
      const activePhones = phones.filter(phone => phone.status === 'activo');
      setAvailablePhones(activePhones);
    } catch (err) {
      console.error('Error al cargar teléfonos corporativos:', err);
    }
  }, []);

  useEffect(() => {
    // Solo Administrador y Técnico tienen acceso completo a usuarios
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Técnico')) {
      fetchUsers();
      fetchUniqueITs();
      fetchInventoryItems();
      fetchAvailablePhones();
    }
  }, [user, fetchUsers, fetchUniqueITs, fetchInventoryItems, fetchAvailablePhones]);

  // Actualizar usuarios cuando cambie la página
  useEffect(() => {
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Técnico')) {
      fetchUsers();
    }
  }, [currentPage, pageSize, debouncedSearch]);

  // Socket listeners for real-time updates
  useEffect(() => {
    const handleUserUpdated = (data) => {
      const { userId, user: updatedUser } = data;
      setUsers(prevUsers =>
        prevUsers.map(u => u.id === userId ? { ...u, ...updatedUser } : u)
      );
    };

    const handleUsersListUpdated = () => {
      fetchUsers();
    };

    onUserUpdated(handleUserUpdated);
    onUsersListUpdated(handleUsersListUpdated);

    return () => {
      offUserUpdated(handleUserUpdated);
      offUsersListUpdated(handleUsersListUpdated);
    };
  }, [fetchUsers]);

  // NUEVA FUNCIONALIDAD: Filtrado y ordenamiento (solo para visualización local)
  const filterAndSortUsers = useCallback(() => {
    let filtered = [...users];

    // Filtro por rol (solo local, no en servidor)
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
  }, [users, filterRole, sortBy, sortOrder]);

  const filteredUsers = filterAndSortUsers();

  // NUEVA FUNCIONALIDAD: Calcular estadísticas
  const calculateStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.Role?.name === 'Administrador').length;
    const technicians = users.filter(u => u.Role?.name === 'Técnico').length;
    const calidad = users.filter(u => u.Role?.name === 'Calidad').length;
    const jefe = users.filter(u => u.Role?.name === 'Jefe').length;
    const compras = users.filter(u => u.Role?.name === 'Compras').length;
    const coordinadoraAdministrativa = users.filter(u => u.Role?.name === 'Coordinadora Administrativa').length;
    const employees = users.filter(u => u.Role?.name === 'Empleado').length;
    const withIT = users.filter(u => u.it).length;
    const withCorporatePhone = users.filter(u => u.hasCorporatePhone).length;

    return { total, admins, technicians, calidad, coordinadoraAdministrativa, jefe, compras, employees, withIT, withCorporatePhone };
  };

  const stats = calculateStats();

  // Encontrar el teléfono seleccionado
  const selectedPhone = availablePhones.find(phone => phone.numero_celular === formData.corporatePhone);

  // Filtrar teléfonos por búsqueda
  const phonesFiltered = availablePhones.filter(phone =>
    searchPhone === '' ||
    phone.numero_celular.toLowerCase().includes(searchPhone.toLowerCase()) ||
    phone.nombre.toLowerCase().includes(searchPhone.toLowerCase()) ||
    phone.category.toLowerCase().includes(searchPhone.toLowerCase())
  );

  // NUEVA FUNCIONALIDAD: Verificar fortaleza de contraseña
  const checkPasswordStrength = useCallback((password) => {
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
  }, []);

  // NUEVA FUNCIONALIDAD: Generar contraseña segura
  const generateSecurePassword = useCallback(() => {
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
    notifySuccess('Contraseña segura generada');
  }, [checkPasswordStrength, notifySuccess, formData]);


  // NUEVA FUNCIONALIDAD: Obtener icono de rol
  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'Administrador': return <FaUserShield className={conditionalClasses({ light: 'w-4 h-4 text-[#662d91]', dark: 'w-4 h-4 text-[#8e4dbf]' })} />;
      case 'Coordinadora Administrativa': return <FaUserShield className={conditionalClasses({ light: 'w-4 h-4 text-orange-600', dark: 'w-4 h-4 text-orange-400' })} />;
      case 'Técnico': return <FaUserCog className={conditionalClasses({ light: 'w-4 h-4 text-blue-600', dark: 'w-4 h-4 text-blue-400' })} />;
      case 'Calidad': return <FaShieldAlt className={conditionalClasses({ light: 'w-4 h-4 text-emerald-600', dark: 'w-4 h-4 text-emerald-400' })} />;
      case 'Jefe': return <FaClipboardList className={conditionalClasses({ light: 'w-4 h-4 text-yellow-600', dark: 'w-4 h-4 text-yellow-400' })} />;
      case 'Compras': return <FaCrown className={conditionalClasses({ light: 'w-4 h-4 text-teal-600', dark: 'w-4 h-4 text-teal-400' })} />;
      case 'Empleado': return <FaUser className={conditionalClasses({ light: 'w-4 h-4 text-green-600', dark: 'w-4 h-4 text-green-400' })} />;
      default: return <FaUser className={conditionalClasses({ light: 'w-4 h-4 text-gray-600', dark: 'w-4 h-4 text-gray-400' })} />;
    }
  };

  // NUEVA FUNCIONALIDAD: Obtener color de badge por rol
  const getRoleBadgeColor = (roleName) => {
    switch(roleName) {
      case 'Administrador': return conditionalClasses({
        light: 'bg-[#f3ebf9] text-[#662d91] border-[#e8d5f5]',
        dark: 'bg-[#3d2a4a] text-[#8e4dbf] border-[#4a3560]'
      });
      case 'Coordinadora Administrativa': return conditionalClasses({
        light: 'bg-orange-100 text-orange-700 border-orange-200',
        dark: 'bg-orange-900/30 text-orange-400 border-orange-600'
      });
      case 'Técnico': return conditionalClasses({
        light: 'bg-blue-100 text-blue-700 border-blue-200',
        dark: 'bg-blue-900/30 text-blue-400 border-blue-600'
      });
      case 'Calidad': return conditionalClasses({
        light: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dark: 'bg-emerald-900/30 text-emerald-400 border-emerald-600'
      });
      case 'Jefe': return conditionalClasses({
        light: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dark: 'bg-yellow-900/30 text-yellow-400 border-yellow-600'
      });
      case 'Compras': return conditionalClasses({
        light: 'bg-teal-100 text-teal-700 border-teal-200',
        dark: 'bg-teal-900/30 text-teal-400 border-teal-600'
      });
      case 'Empleado': return conditionalClasses({
        light: 'bg-green-100 text-green-700 border-green-200',
        dark: 'bg-green-900/30 text-green-400 border-green-600'
      });
      default: return conditionalClasses({
        light: 'bg-gray-100 text-gray-700 border-gray-200',
        dark: 'bg-gray-700 text-gray-300 border-gray-600'
      });
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
  }, [formData.password, checkPasswordStrength]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', name: '', email: '', password: '', roleId: 1, it: '', hasCorporatePhone: false, corporatePhone: '' });
    setPasswordStrength(null);
    setShowModal(true);
  };

  const handleEdit = (usr) => {
    setEditingUser(usr);
    setFormData({
      username: usr.username,
      name: usr.name || '',
      email: usr.email,
      password: '', // No mostrar contraseña actual (está hasheada)
      roleId: usr.roleId,
      it: usr.it || '',
      hasCorporatePhone: usr.hasCorporatePhone || false,
      corporatePhone: usr.corporatePhone || ''
    });
    setPasswordStrength(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este usuario?', async () => {
      try {
        const response = await usersAPI.deleteUser(id);
        fetchUsers();

        if (response.deactivated) {
          notifySuccess('Usuario desactivado exitosamente (tenía registros relacionados)');
        } else {
          notifySuccess('Usuario eliminado exitosamente');
        }
      } catch {
        notifyError('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUser) {
        const updateData = { roleId: formData.roleId, it: formData.it, hasCorporatePhone: formData.hasCorporatePhone, corporatePhone: formData.corporatePhone };
        if (formData.password) updateData.password = formData.password;
        await usersAPI.updateUser(editingUser.id, updateData);
        notifySuccess('Usuario actualizado exitosamente');
      } else {
        await authAPI.register(
          formData.name,
          formData.username,
          formData.email,
          formData.password,
          formData.roleId,
          formData.it,
          formData.hasCorporatePhone,
          formData.corporatePhone
        );
        notifySuccess('Usuario creado exitosamente');
      }
      fetchUsers();
      setShowModal(false);
    } catch {
      notifyError('Error al guardar el usuario. Por favor, verifica los datos e inténtalo de nuevo.');
    } finally {
      setFormLoading(false);
    }
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

  // Solo Administrador y Técnico tienen acceso completo a la gestión de usuarios
  if (!user || (user.role?.name !== 'Administrador' && user.role?.name !== 'Técnico')) {
    return <div className="container mx-auto p-6">Acceso Denegado</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4 sm:px-6 lg:px-8',
      dark: 'min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'
    })}>
      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
      />

      <div>
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl font-bold text-gray-900 flex items-center',
                dark: 'text-2xl sm:text-3xl font-bold text-gray-100 flex items-center'
              })}>
                <div className={conditionalClasses({
                  light: 'w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-xl flex items-center justify-center mr-3 shadow-lg',
                  dark: 'w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-xl flex items-center justify-center mr-3 shadow-lg'
                })}>
                  <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                Usuarios
              </h1>
              <p className={conditionalClasses({
                light: 'mt-2 text-gray-600',
                dark: 'mt-2 text-gray-300'
              })}>Gestiona los usuarios del sistema</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className={conditionalClasses({
                  light: 'inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all',
                  dark: 'inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 text-gray-200 font-semibold rounded-xl transition-all'
                })}
                title="Ver estadísticas"
              >
                <FaChartBar className="mr-2" />
                Estadísticas
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-6 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlus className="w-5 h-5 mr-2" />
                Nuevo Usuario
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
                label: 'Total Usuarios',
                icon: FaUsers,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'admins',
                label: 'Administradores',
                icon: FaUserShield,
                gradient: 'from-[#662d91] to-[#8e4dbf]',
                loading: loading
              },
              {
                key: 'technicians',
                label: 'Técnicos',
                icon: FaUserCog,
                gradient: 'from-blue-500 to-indigo-600',
                loading: loading
              },
              {
                key: 'calidad',
                label: 'Calidad',
                icon: FaShieldAlt,
                gradient: 'from-emerald-500 to-emerald-600',
                loading: loading
              },
              {
                key: 'coordinadoraAdministrativa',
                label: 'Coordinadoras Administrativas',
                icon: FaUserShield,
                gradient: 'from-orange-500 to-red-600',
                loading: loading
              },
              {
                key: 'jefe',
                label: 'Jefes',
                icon: FaClipboardList,
                gradient: 'from-yellow-500 to-orange-600',
                loading: loading
              },
              {
                key: 'compras',
                label: 'Compras',
                icon: FaCrown,
                gradient: 'from-teal-500 to-cyan-600',
                loading: loading
              },
              {
                key: 'employees',
                label: 'Empleados',
                icon: FaUser,
                gradient: 'from-green-500 to-teal-600',
                loading: loading
              },
              {
                key: 'withIT',
                label: 'Con IT Asignado',
                icon: FaCheck,
                gradient: 'from-[#8e4dbf] to-[#662d91]',
                loading: loading
              },
              {
                key: 'withCorporatePhone',
                label: 'Con Teléfono Corporativo',
                icon: FaCheck,
                gradient: 'from-teal-500 to-cyan-600',
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
          filters={[
            {
              label: 'Rol',
              value: filterRole,
              onChange: setFilterRole,
              type: 'select',
              options: [
                { value: 'Administrador', label: 'Administrador' },
                { value: 'Coordinadora Administrativa', label: 'Coordinadora Administrativa' },
                { value: 'Técnico', label: 'Técnico' },
                { value: 'Calidad', label: 'Calidad' },
                { value: 'Jefe', label: 'Jefe' },
                { value: 'Compras', label: 'Compras' },
                { value: 'Empleado', label: 'Empleado' }
              ]
            }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'username', label: 'Username' },
            { value: 'name', label: 'Nombre' },
            { value: 'email', label: 'Email' },
            { value: 'Role', label: 'Rol' }
          ]}
        />

        {/* NUEVA FUNCIONALIDAD: Resumen de resultados y vista */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <p className={conditionalClasses({
            light: 'text-sm text-gray-600 font-medium',
            dark: 'text-sm text-gray-300 font-medium'
          })}>
            Mostrando <span className="font-bold text-[#662d91]">{filteredUsers.length}</span> de <span className="font-bold">{totalUsers}</span> usuarios
          </p>
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={conditionalClasses({
                  light: 'p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
                  dark: 'p-2 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                })}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <span className={conditionalClasses({
                light: 'text-sm text-gray-600',
                dark: 'text-sm text-gray-300'
              })}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={conditionalClasses({
                  light: 'p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
                  dark: 'p-2 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                })}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={conditionalClasses({
                  light: 'ml-2 px-2 py-1 text-sm border border-gray-300 rounded-lg bg-white',
                  dark: 'ml-2 px-2 py-1 text-sm border border-gray-600 rounded-lg bg-gray-700'
                })}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>

        <div className={conditionalClasses({
          light: 'bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden',
          dark: 'bg-gray-800 rounded-2xl shadow-xl border border-gray-600 overflow-hidden'
        })}>
          <div className={conditionalClasses({
            light: 'px-6 py-4 border-b border-gray-200 bg-gray-50',
            dark: 'px-6 py-4 border-b border-gray-600 bg-gray-700'
          })}>
            <h2 className={conditionalClasses({
              light: 'text-xl font-semibold text-gray-900',
              dark: 'text-xl font-semibold text-gray-100'
            })}>Todos los Usuarios</h2>
          </div>
          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className={conditionalClasses({
                  light: 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4',
                  dark: 'w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'
                })}>
                  <FaUsers className={conditionalClasses({
                    light: 'w-8 h-8 text-gray-400',
                    dark: 'w-8 h-8 text-gray-500'
                  })} />
                </div>
                <h3 className={conditionalClasses({
                  light: 'text-lg font-medium text-gray-900 mb-2',
                  dark: 'text-lg font-medium text-gray-100 mb-2'
                })}>
                  {searchTerm || filterRole !== 'all'
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios disponibles'}
                </h3>
                <p className={conditionalClasses({
                  light: 'text-gray-600',
                  dark: 'text-gray-300'
                })}>
                  {searchTerm || filterRole !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza creando un nuevo usuario'}
                </p>
              </div>
            ) : (
              <>
                {/* NUEVA FUNCIONALIDAD: Vista de cuadrícula */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredUsers.map((usr) => (
                    <div key={usr.id} className={conditionalClasses({
                      light: 'bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow',
                      dark: 'bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-600 hover:shadow-md transition-shadow'
                    })}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={conditionalClasses({
                            light: 'w-10 h-10 bg-[#f3ebf9] rounded-full flex items-center justify-center',
                            dark: 'w-10 h-10 bg-[#3d2a4a] rounded-full flex items-center justify-center'
                          })}>
                            {getRoleIcon(usr.Role?.name)}
                          </div>
                          <h3 className={conditionalClasses({
                            light: 'font-semibold text-gray-900',
                            dark: 'font-semibold text-gray-100'
                          })}>{usr.username}</h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(usr.Role?.name)}`}>
                          {usr.Role?.name}
                        </span>
                      </div>
                      <div className={conditionalClasses({
                        light: 'space-y-2 text-sm text-gray-600 mb-4',
                        dark: 'space-y-2 text-sm text-gray-300 mb-4'
                      })}>
                        <div className="flex items-center gap-2">
                          <FaUser className={conditionalClasses({
                            light: 'w-3 h-3 text-gray-400',
                            dark: 'w-3 h-3 text-gray-500'
                          })} />
                          <p><strong>Nombre:</strong> {usr.name || usr.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className={conditionalClasses({
                            light: 'w-3 h-3 text-gray-400',
                            dark: 'w-3 h-3 text-gray-500'
                          })} />
                          <p className="truncate"><strong>Email:</strong> {usr.email}</p>
                        </div>
                        <div className={conditionalClasses({
                          light: 'pt-2 border-t border-gray-200',
                          dark: 'pt-2 border-t border-gray-600'
                        })}>
                          <p className={conditionalClasses({
                            light: 'text-xs text-gray-500 mb-1',
                            dark: 'text-xs text-gray-400 mb-1'
                          })}><strong>IT Asignado:</strong></p>
                          {usr.it ? (
                            <div className={conditionalClasses({
                              light: 'bg-blue-50 rounded-lg p-2',
                              dark: 'bg-blue-900/30 rounded-lg p-2'
                            })}>
                              <p className={conditionalClasses({
                                light: 'text-xs font-semibold text-blue-700',
                                dark: 'text-xs font-semibold text-blue-300'
                              })}>{usr.it}</p>
                              <p className={conditionalClasses({
                                light: 'text-xs text-blue-600',
                                dark: 'text-xs text-blue-400'
                              })}>
                                {inventoryItems.find(item => item.it === usr.it)?.area || 'Sin área'}
                              </p>
                            </div>
                          ) : (
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-400 italic',
                              dark: 'text-xs text-gray-500 italic'
                            })}>No asignado</p>
                          )}
                        </div>
                        <div className={conditionalClasses({
                          light: 'pt-2 border-t border-gray-200',
                          dark: 'pt-2 border-t border-gray-600'
                        })}>
                          <p className={conditionalClasses({
                            light: 'text-xs text-gray-500 mb-1',
                            dark: 'text-xs text-gray-400 mb-1'
                          })}><strong>Teléfono Corporativo:</strong></p>
                          {usr.hasCorporatePhone ? (
                            <div className={conditionalClasses({
                              light: 'bg-green-50 rounded-lg p-2',
                              dark: 'bg-green-900/30 rounded-lg p-2'
                            })}>
                              <p className={conditionalClasses({
                                light: 'text-xs font-semibold text-green-700',
                                dark: 'text-xs font-semibold text-green-300'
                              })}>{usr.corporatePhone}</p>
                            </div>
                          ) : (
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-400 italic',
                              dark: 'text-xs text-gray-500 italic'
                            })}>No tiene</p>
                          )}
                        </div>
                        {/* NUEVA FUNCIONALIDAD: Mostrar fecha de creación */}
                        {usr.createdAt && (
                          <div className={conditionalClasses({
                            light: 'flex items-center gap-2 text-xs text-gray-500 pt-2',
                            dark: 'flex items-center gap-2 text-xs text-gray-400 pt-2'
                          })}>
                            <FaClock className="w-3 h-3" />
                            <span>Creado {getTimeAgo(usr.createdAt)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleEdit(usr)}
                          className={conditionalClasses({
                            light: 'flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors',
                            dark: 'flex items-center space-x-1 px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-900/50 transition-colors'
                          })}
                        >
                          <FaEdit />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(usr.id)}
                          className={conditionalClasses({
                            light: 'flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors',
                            dark: 'flex items-center space-x-1 px-3 py-1 bg-red-900/30 text-red-400 text-xs font-medium rounded-lg hover:bg-red-900/50 transition-colors'
                          })}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
            dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-600 animate-scale-in'
          })}>
            <div className={conditionalClasses({
              light: 'sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 sm:p-5 lg:p-6 z-10',
              dark: 'sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 sm:p-5 lg:p-6 z-10'
            })}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm lg:text-base font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-white text-gray-900',
                      dark: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-gray-700 text-gray-100'
                    })}
                    required
                    disabled={editingUser}
                  />
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm lg:text-base font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-white text-gray-900',
                      dark: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-gray-700 text-gray-100'
                    })}
                    required
                    disabled={editingUser}
                  />
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-white text-gray-900',
                      dark: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-gray-700 text-gray-100'
                    })}
                    required
                    disabled={editingUser}
                  />
                </div>

                {(!editingUser || (user && user.role?.name === 'Administrador')) && (
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                      dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                    })}>
                      {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={editingUser ? "Dejar vacío para mantener contraseña actual" : "Contraseña"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={conditionalClasses({
                          light: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 pr-20 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-white text-gray-900',
                          dark: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 pr-20 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-gray-700 text-gray-100'
                        })}
                        required={!editingUser}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                        {/* NUEVA FUNCIONALIDAD: Botón para generar contraseña */}
                        <button
                          type="button"
                          onClick={generateSecurePassword}
                          className="text-gray-400 hover:text-[#662d91] p-1 transition-colors"
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
                    {passwordStrength && formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={conditionalClasses({
                            light: 'flex-1 h-2 bg-gray-200 rounded-full overflow-hidden',
                            dark: 'flex-1 h-2 bg-gray-600 rounded-full overflow-hidden'
                          })}>
                            <div
                              className={conditionalClasses({
                                light: `h-full transition-all duration-300 ${
                                  passwordStrength.color === 'red' ? 'bg-red-500' :
                                  passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`,
                                dark: `h-full transition-all duration-300 ${
                                  passwordStrength.color === 'red' ? 'bg-red-400' :
                                  passwordStrength.color === 'yellow' ? 'bg-yellow-400' :
                                  'bg-green-400'
                                }`
                              })}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            />
                          </div>
                          <span className={conditionalClasses({
                            light: `text-xs font-semibold ${
                              passwordStrength.color === 'red' ? 'text-red-600' :
                              passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                              'text-green-600'
                            }`,
                            dark: `text-xs font-semibold ${
                              passwordStrength.color === 'red' ? 'text-red-400' :
                              passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                              'text-green-400'
                            }`
                          })}>
                            {passwordStrength.level === 'weak' ? 'Débil' :
                             passwordStrength.level === 'medium' ? 'Media' : 'Fuerte'}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <p className={conditionalClasses({
                            light: 'text-xs text-gray-500',
                            dark: 'text-xs text-gray-400'
                          })}>
                            Mejoras: {passwordStrength.feedback.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    Rol
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-white text-gray-900',
                      dark: 'w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base lg:text-lg bg-gray-700 text-gray-100'
                    })}
                  >
                    <option value={1}>Administrador</option>
                    <option value={5}>Coordinadora Administrativa</option>
                    <option value={2}>Técnico</option>
                    <option value={4}>Calidad</option>
                    <option value={6}>Jefe</option>
                    <option value={7}>Compras</option>
                    <option value={3}>Empleado</option>
                  </select>
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    IT del Computador
                  </label>
                  <select
                    value={formData.it}
                    onChange={(e) => setFormData({ ...formData, it: e.target.value })}
                    className={conditionalClasses({
                      light: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900',
                      dark: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-gray-100'
                    })}
                  >
                    <option value="">Sin asignar</option>
                    {uniqueITs.map((item) => (
                      <option key={item.it} value={item.it}>
                        {item.it} ({item.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                    dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                  })}>
                    ¿Tiene teléfono corporativo?
                  </label>
                  <div className="flex gap-4">
                    <label className={conditionalClasses({
                      light: 'flex items-center',
                      dark: 'flex items-center'
                    })}>
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === true}
                        onChange={() => setFormData({ ...formData, hasCorporatePhone: true })}
                        className="mr-2"
                      />
                      <span className={conditionalClasses({
                        light: 'text-gray-700',
                        dark: 'text-gray-200'
                      })}>Sí</span>
                    </label>
                    <label className={conditionalClasses({
                      light: 'flex items-center',
                      dark: 'flex items-center'
                    })}>
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === false}
                        onChange={() => {
                          setFormData({ ...formData, hasCorporatePhone: false, corporatePhone: '' });
                          setSearchPhone('');
                        }}
                        className="mr-2"
                      />
                      <span className={conditionalClasses({
                        light: 'text-gray-700',
                        dark: 'text-gray-200'
                      })}>No</span>
                    </label>
                  </div>
                </div>

                {formData.hasCorporatePhone && (
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2',
                      dark: 'block text-xs sm:text-sm font-medium text-gray-200 mb-1.5 sm:mb-2'
                    })}>
                      Número Corporativo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`Buscar y seleccionar teléfono... (${availablePhones.length} disponibles)`}
                        value={selectedPhone ? `${selectedPhone.numero_celular} - ${selectedPhone.nombre} (${selectedPhone.category})` : searchPhone}
                        onChange={(e) => {
                          setSearchPhone(e.target.value);
                          setFormData({ ...formData, corporatePhone: '' });
                          setShowPhoneDropdown(true);
                        }}
                        onFocus={() => setShowPhoneDropdown(true)}
                        onBlur={() => setTimeout(() => setShowPhoneDropdown(false), 200)}
                        className={conditionalClasses({
                          light: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-gray-900',
                          dark: 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all text-sm sm:text-base bg-gray-700 text-gray-100'
                        })}
                      />
                      {showPhoneDropdown && (
                        <div className={conditionalClasses({
                          light: 'absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-lg max-h-60 overflow-y-auto',
                          dark: 'absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl shadow-lg max-h-60 overflow-y-auto'
                        })}>
                          {phonesFiltered.length > 0 ? (
                            phonesFiltered.map(phone => (
                              <div
                                key={phone.id}
                                className={conditionalClasses({
                                  light: 'px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0',
                                  dark: 'px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0'
                                })}
                                onClick={() => {
                                  setFormData({ ...formData, corporatePhone: phone.numero_celular });
                                  setSearchPhone('');
                                  setShowPhoneDropdown(false);
                                }}
                              >
                                <div className={conditionalClasses({
                                  light: 'font-medium text-gray-900',
                                  dark: 'font-medium text-gray-100'
                                })}>{phone.numero_celular}</div>
                                <div className={conditionalClasses({
                                  light: 'text-sm text-gray-600',
                                  dark: 'text-sm text-gray-300'
                                })}>{phone.nombre} ({phone.category})</div>
                              </div>
                            ))
                          ) : (
                            <div className={conditionalClasses({
                              light: 'px-3 sm:px-4 py-2 sm:py-2.5 text-gray-500 text-center',
                              dark: 'px-3 sm:px-4 py-2 sm:py-2.5 text-gray-400 text-center'
                            })}>
                              {availablePhones.length === 0
                                ? 'No hay teléfonos disponibles'
                                : 'No se encontraron teléfonos con esa búsqueda'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={conditionalClasses({
                    light: 'flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors',
                    dark: 'flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium rounded-xl transition-colors'
                  })}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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


