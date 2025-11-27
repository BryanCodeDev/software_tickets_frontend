import React, { useState, useEffect, useContext } from 'react';
import { credentialsAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaLock, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaCheck, FaTimes, FaSearch, FaFilter, FaCopy, FaKey, FaExclamationTriangle, FaSortAmountDown, FaSortAmountUp, FaHistory, FaClock, FaArrowLeft, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { NotificationSystem, ConfirmDialog, FilterPanel } from '../../components/common';

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formData, setFormData] = useState({ service: '', username: '', password: '', area: '', notes: '' });
  const [folderFormData, setFolderFormData] = useState({ name: '', description: '' });
  const [editFolderFormData, setEditFolderFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [folderFormLoading, setFolderFormLoading] = useState(false);
  const [editFolderFormLoading, setEditFolderFormLoading] = useState(false);

  // Estados para navegación de carpetas
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { user } = useContext(AuthContext);

  // NUEVAS FUNCIONALIDADES: Estados para búsqueda, filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('service');
  const [sortOrder, setSortOrder] = useState('asc');
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    if (user && (user.role?.name === 'Administrador' || user.role?.name === 'Técnico')) {
      fetchCredentials();
      fetchFolders();
    } else {
      setLoading(false);
      setLoadingFolders(false);
    }
  }, [user]);

  const fetchCredentials = async () => {
    try {
      const data = await credentialsAPI.fetchCredentials();
      setCredentials(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const data = await credentialsAPI.fetchFolders();
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    } finally {
      setLoadingFolders(false);
    }
  };

  // NUEVA FUNCIONALIDAD: Filtrado y ordenamiento
  const filterAndSortCredentials = () => {
    let filtered = [...credentials];

    // Filtrar por carpeta actual
    if (currentFolder) {
      filtered = filtered.filter(cred => cred.credentialFolderId === currentFolder.id);
    }

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cred =>
        cred.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else if (typeof aVal === 'string') {
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

  // Filtrar carpetas de la raíz (solo cuando no hay carpeta actual)
  const rootFolders = folders.filter(folder => !folder.parentFolderId);

  const filteredCredentials = filterAndSortCredentials();

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


  // NUEVA FUNCIONALIDAD: Copiar al portapapeles
  const copyToClipboard = async (text, label) => {
    try {
      // Intentar con la API moderna
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotification(`${label} copiado al portapapeles`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }

    // Fallback para navegadores antiguos o cuando falla la API moderna
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        showNotification(`${label} copiado al portapapeles`, 'success');
      } else {
        throw new Error('execCommand failed');
      }
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      showNotification('Error al copiar al portapapeles. Intente copiar manualmente.', 'error');
    }
  };

  // NUEVA FUNCIONALIDAD: Generar contraseña segura
  const generateSecurePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+-='[Math.floor(Math.random() * 14)];
    
    // Completar el resto
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar caracteres
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
    showNotification('Contraseña segura generada', 'success');
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

  const handleCreate = () => {
    setEditingCredential(null);
    setFormData({ service: '', username: '', password: '', area: '', notes: '' });
    setPasswordStrength(null);
    setShowModal(true);
  };

  const handleCreateFolder = () => {
    setFolderFormData({ name: '', description: '' });
    setShowFolderModal(true);
  };

  const handleEnterFolder = (folder) => {
    setCurrentFolder(folder);
  };

  const handleGoBack = () => {
    setCurrentFolder(null);
  };

  const handleEdit = (cred) => {
    setEditingCredential(cred);
    setFormData({
      service: cred.service,
      username: cred.username,
      password: cred.password,
      area: cred.area || '',
      notes: cred.description || ''
    });
    setPasswordStrength(checkPasswordStrength(cred.password));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta credencial?', async () => {
      try {
        await credentialsAPI.deleteCredential(id);
        fetchCredentials();
        showNotification('Credencial eliminada exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar la credencial. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const credentialData = { ...formData };
      if (editingCredential) {
        await credentialsAPI.updateCredential(editingCredential.id, credentialData);
        showNotification('Credencial actualizada exitosamente', 'success');
      } else {
        // Si estamos en una carpeta, asignar la carpeta actual
        if (currentFolder) {
          credentialData.credentialFolderId = currentFolder.id;
        }
        await credentialsAPI.createCredential(credentialData);
        showNotification('Credencial creada exitosamente', 'success');
      }
      fetchCredentials();
      setShowModal(false);
    } catch (err) {
      showNotification('Error al guardar la credencial. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    setFolderFormLoading(true);
    try {
      await credentialsAPI.createFolder(folderFormData);
      fetchFolders();
      showNotification('Carpeta creada exitosamente', 'success');
      setShowFolderModal(false);
    } catch (err) {
      showNotification('Error al crear la carpeta. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFolderFormLoading(false);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditFolderFormData({ name: folder.name, description: folder.description || '' });
    setShowEditFolderModal(true);
  };

  const handleDeleteFolder = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta carpeta?', async () => {
      try {
        await credentialsAPI.deleteFolder(id);
        fetchFolders();
        showNotification('Carpeta eliminada exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar la carpeta. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleEditFolderSubmit = async (e) => {
    e.preventDefault();
    setEditFolderFormLoading(true);
    try {
      await credentialsAPI.updateFolder(editingFolder.id, editFolderFormData);
      fetchFolders();
      showNotification('Carpeta actualizada exitosamente', 'success');
      setShowEditFolderModal(false);
      setEditingFolder(null);
    } catch (err) {
      showNotification('Error al actualizar la carpeta. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setEditFolderFormLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFormPasswordVisibility = () => {
    setShowFormPassword(prev => !prev);
  };

  // Actualizar fortaleza de contraseña cuando cambia
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

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

  if (!user || (user.role?.name !== 'Administrador' && user.role?.name !== 'Técnico')) {
    return <div className="container mx-auto p-6">Acceso Denegado</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Notification */}
      <NotificationSystem
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
      />

      <div>
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                {currentFolder ? `Carpeta: ${currentFolder.name}` : 'Credenciales'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-600">
                {currentFolder ? (currentFolder.description || 'Gestiona las credenciales de esta carpeta') : 'Gestiona las credenciales internas del sistema'}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {currentFolder && (
                <button
                  onClick={handleGoBack}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span>Atrás</span>
                </button>
              )}
              {currentFolder ? (
                <button
                  onClick={handleCreate}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span>Nueva Credencial</span>
                </button>
              ) : (
                <button
                  onClick={handleCreateFolder}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span>Nueva Carpeta</span>
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Filter Panel */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'service', label: 'Servicio' },
            { value: 'username', label: 'Usuario' },
            { value: 'createdAt', label: 'Fecha de creación' }
          ]}
        />

        {/* Resumen de resultados */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            {currentFolder
              ? `Mostrando ${filteredCredentials.length} credenciales en esta carpeta`
              : `Mostrando ${rootFolders.length} carpetas`
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
              {currentFolder ? 'Credenciales de la Carpeta' : 'Carpetas de Credenciales'}
            </h2>
          </div>
          <div className="p-3 sm:p-4 md:p-6">
            {currentFolder ? (
              // Vista de credenciales dentro de una carpeta
              filteredCredentials.length === 0 ? (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaLock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2">
                    {searchTerm
                      ? 'No se encontraron credenciales'
                      : 'No hay credenciales en esta carpeta'}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {searchTerm
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Comienza creando una nueva credencial'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {filteredCredentials.map((cred) => (
                    <div key={cred.id} className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center text-center sm:items-start sm:text-left md:flex-row md:items-center md:justify-between mb-3 sm:mb-4 gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-sm md:text-base truncate w-full sm:w-auto">{cred.service}</h3>
                      </div>
                      <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center justify-between">
                          <p><strong>Usuario:</strong> {cred.username}</p>
                          <button
                            onClick={() => copyToClipboard(cred.username, 'Usuario')}
                            className="text-gray-400 hover:text-purple-600 p-1 transition-colors"
                            title="Copiar usuario"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        </div>
                        {cred.area && (
                          <div className="flex items-center justify-between">
                            <p><strong>Área:</strong> {cred.area}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <p className="text-xs sm:text-sm"><strong>Contraseña:</strong></p>
                          <span className="flex-1 text-xs sm:text-sm font-mono">
                            {showPassword[cred.id] ? cred.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(cred.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title={showPassword[cred.id] ? 'Ocultar' : 'Mostrar'}
                          >
                            {showPassword[cred.id] ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(cred.password, 'Contraseña')}
                            className="text-gray-400 hover:text-purple-600 p-1 transition-colors"
                            title="Copiar contraseña"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        </div>
                        {cred.description && (
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1"><strong>Notas:</strong></p>
                            <p className="text-xs text-gray-600">{cred.description}</p>
                          </div>
                        )}
                        {cred.createdAt && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 pt-2">
                            <FaClock className="w-3 h-3" />
                            <span>Creada {getTimeAgo(cred.createdAt)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(cred)}
                          className="flex items-center justify-center space-x-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-blue-100 text-blue-700 text-sm sm:text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FaEdit className="w-4 h-4 sm:w-4 md:w-4" />
                          <span>Editar</span>
                        </button>
                        {user.role?.name === 'Administrador' && (
                          <button
                            onClick={() => handleDelete(cred.id)}
                            className="flex items-center justify-center space-x-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-red-100 text-red-700 text-sm sm:text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTrash className="w-4 h-4 sm:w-4 md:w-4" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Vista de carpetas en la raíz
              rootFolders.length === 0 ? (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaFolder className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2">
                    No hay carpetas disponibles
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Comienza creando una nueva carpeta
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {rootFolders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => handleEnterFolder(folder)}
                      className="group bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-5 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                          <FaFolder className="text-blue-600 text-lg sm:text-lg md:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-sm md:text-base lg:text-lg">{folder.name}</h3>
                          {folder.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">{folder.description}</p>
                          )}
                          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-gray-500">
                            {folder.createdAt && (
                              <span className="flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {getTimeAgo(folder.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFolder(folder);
                            }}
                            className="p-1.5 sm:p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar carpeta"
                          >
                            <FaEdit className="w-4 h-4 sm:w-4" />
                          </button>
                          {user.role?.name === 'Administrador' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFolder(folder.id);
                              }}
                              className="p-1.5 sm:p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar carpeta"
                            >
                              <FaTrash className="w-4 h-4 sm:w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2 md:p-4 animate-fade-in">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-3 sm:p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {editingCredential ? 'Editar Credencial' : 'Nueva Credencial'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1.5 sm:mb-2 md:mb-3">
                    Servicio *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Base de datos, API, etc."
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm md:text-base lg:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1.5 sm:mb-2 md:mb-3">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm md:text-base lg:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1.5 sm:mb-2 md:mb-3">
                    Área
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm md:text-base lg:text-base bg-white"
                  >
                    <option value="">Seleccionar área</option>

                    {/* Producción y Operaciones */}
                    <optgroup label="Producción y Operaciones">
                      <option value="MATERIA PRIMA">Materia Prima</option>
                      <option value="PRODUCCION">Producción</option>
                      <option value="PRODUCTO TERMINADO">Producto Terminado</option>
                      <option value="DESPACHOS">Despachos</option>
                      <option value="DEVOLUCIONES">Devoluciones</option>
                      <option value="BODEGA">Bodega</option>
                      <option value="RECEPCION">Recepción</option>
                      <option value="ALMACENISTA">Almacenista</option>
                    </optgroup>

                    {/* Calidad y Laboratorio */}
                    <optgroup label="Calidad y Laboratorio">
                      <option value="CALIDAD">Calidad</option>
                      <option value="CALIDAD OROCCO">Calidad Orocco</option>
                      <option value="LABORATORIO">Laboratorio</option>
                      <option value="INVESTIGACION">Investigación</option>
                    </optgroup>

                    {/* Administración y Finanzas */}
                    <optgroup label="Administración y Finanzas">
                      <option value="CONTABILIDAD">Contabilidad</option>
                      <option value="COSTOS">Costos</option>
                      <option value="TESORERIA">Tesorería</option>
                      <option value="CARTERA">Cartera</option>
                      <option value="FACTURACION">Facturación</option>
                      <option value="COMPRAS">Compras</option>
                      <option value="JEFE COMPRAS">Jefe Compras</option>
                    </optgroup>

                    {/* Ventas y Mercadeo */}
                    <optgroup label="Ventas y Mercadeo">
                      <option value="VENTAS">Ventas</option>
                      <option value="MERCADEO">Mercadeo</option>
                      <option value="DIRECCION VENTAS">Dirección Ventas</option>
                      <option value="CALL CENTER">Call Center</option>
                      <option value="SAC">SAC</option>
                    </optgroup>

                    {/* Recursos Humanos */}
                    <optgroup label="Recursos Humanos">
                      <option value="RH">Recursos Humanos</option>
                      <option value="ADMINISTRATIVO">Administrativo</option>
                    </optgroup>

                    {/* Gerencia y Dirección */}
                    <optgroup label="Gerencia y Dirección">
                      <option value="GERENCIA">Gerencia</option>
                      <option value="SUB GERENCIA">Sub Gerencia</option>
                      <option value="EJECUTIVA">Ejecutiva</option>
                      <option value="COORDINADOR">Coordinador</option>
                      <option value="PLANEACION">Planeación</option>
                    </optgroup>

                    {/* Servicios Generales */}
                    <optgroup label="Servicios Generales">
                      <option value="MANTENIMIENTO">Mantenimiento</option>
                      <option value="REPARACION">Reparación</option>
                      <option value="SERVICIO GENERAL">Servicio General</option>
                      <option value="AMBIENTAL Y SST">Ambiental y SST</option>
                    </optgroup>

                    {/* Sistemas y Tecnología */}
                    <optgroup label="Sistemas y Tecnología">
                      <option value="SISTEMAS">Sistemas</option>
                      <option value="DESARROLLO">Desarrollo</option>
                    </optgroup>

                    {/* Control y Auditoría */}
                    <optgroup label="Control y Auditoría">
                      <option value="AUDITORIA">Auditoría</option>
                      <option value="ARCHIVO">Archivo</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1.5 sm:mb-2 md:mb-3">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 pr-16 sm:pr-20 md:pr-24 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm md:text-base lg:text-base"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 md:pr-3 gap-0.5 sm:gap-1 md:gap-2">
                      {/* NUEVA FUNCIONALIDAD: Botón para generar contraseña segura */}
                      <button
                        type="button"
                        onClick={generateSecurePassword}
                        className="text-gray-400 hover:text-purple-600 p-1 sm:p-1.5 md:p-2 transition-colors"
                        title="Generar contraseña segura"
                      >
                        <FaKey className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 lg:w-6 lg:h-6" />
                      </button>
                      <button
                        type="button"
                        onClick={toggleFormPasswordVisibility}
                        className="text-gray-400 hover:text-gray-600 p-1 sm:p-1.5 md:p-2"
                        title={showFormPassword ? 'Ocultar' : 'Mostrar'}
                      >
                        {showFormPassword ? <FaEyeSlash className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 lg:w-6 lg:h-6" /> : <FaEye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 lg:w-6 lg:h-6" />}
                      </button>
                    </div>
                  </div>
                  {/* NUEVA FUNCIONALIDAD: Indicador de fortaleza de contraseña */}
                  {passwordStrength && (
                    <div className="mt-2 sm:mt-3 md:mt-4">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                        <div className="flex-1 h-2 sm:h-2.5 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs sm:text-sm md:text-base font-semibold ${
                          passwordStrength.color === 'red' ? 'text-red-600' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.level === 'weak' ? 'Débil' :
                           passwordStrength.level === 'medium' ? 'Media' : 'Fuerte'}
                        </span>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <p className="text-xs sm:text-sm md:text-base text-gray-500">
                          Mejoras: {passwordStrength.feedback.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* NUEVA FUNCIONALIDAD: Campo de notas */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1.5 sm:mb-2 md:mb-3">
                    Notas
                  </label>
                  <textarea
                    placeholder="Información adicional sobre esta credencial..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm md:text-base lg:text-base resize-none"
                    rows="3 sm:rows-4 lg:rows-5"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3 md:pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm md:text-base"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 lg:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm md:text-base"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 sm:h-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">{editingCredential ? 'Actualizando...' : 'Creando...'}</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    editingCredential ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Create Folder */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2 md:p-4 animate-fade-in">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-green-600 to-green-700 p-3 sm:p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Nueva Carpeta</h2>
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleFolderSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la carpeta"
                  value={folderFormData.name}
                  onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción de la carpeta (opcional)"
                  value={folderFormData.description}
                  onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-xs sm:text-sm"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm"
                  disabled={folderFormLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                  disabled={folderFormLoading}
                >
                  {folderFormLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </>
                  ) : (
                    'Crear Carpeta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Edit Folder */}
      {showEditFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2 md:p-4 animate-fade-in">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 p-3 sm:p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Editar Carpeta</h2>
                <button
                  onClick={() => setShowEditFolderModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditFolderSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la carpeta"
                  value={editFolderFormData.name}
                  onChange={(e) => setEditFolderFormData({ ...editFolderFormData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción de la carpeta (opcional)"
                  value={editFolderFormData.description}
                  onChange={(e) => setEditFolderFormData({ ...editFolderFormData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-xs sm:text-sm"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditFolderModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm"
                  disabled={editFolderFormLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                  disabled={editFolderFormLoading}
                >
                  {editFolderFormLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Carpeta'
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

export default Credentials;

