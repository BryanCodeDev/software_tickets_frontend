import React, { useState, useEffect, useContext } from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaDownload, FaFileExport, FaChartBar, FaExclamationTriangle, FaCalendarAlt, FaCog, FaSortAmountDown, FaSortAmountUp, FaQrcode, FaPrint, FaHistory } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import inventoryAPI from '../../api/inventoryAPI';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    propiedad: '',
    it: '',
    area: '',
    responsable: '',
    serial: '',
    capacidad: '',
    ram: '',
    marca: '',
    status: 'disponible',
    location: '',
    warrantyExpiry: '',
    purchaseDate: '',
    lastMaintenance: '',
    cost: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [detectingHardware, setDetectingHardware] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [sortBy, setSortBy] = useState('it');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterAndSortInventory();
  }, [inventory, searchTerm, filterStatus, filterArea, sortBy, sortOrder]);

  const fetchInventory = async () => {
    try {
      const data = await inventoryAPI.fetchInventory();
      setInventory(data);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
      showNotification('Error al cargar el inventario. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortInventory = () => {
    let filtered = [...inventory];

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Filtro por área
    if (filterArea !== 'all') {
      filtered = filtered.filter(item => item.area === filterArea);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredInventory(filtered);
  };

  const calculateStats = () => {
    const total = inventory.length;
    const disponible = inventory.filter(i => i.status === 'disponible').length;
    const enUso = inventory.filter(i => i.status === 'en uso').length;
    const mantenimiento = inventory.filter(i => i.status === 'mantenimiento').length;
    const fueraServicio = inventory.filter(i => i.status === 'fuera de servicio').length;
    
    const warrantyExpiring = inventory.filter(item => {
      if (!item.warrantyExpiry) return false;
      const expiry = new Date(item.warrantyExpiry);
      const now = new Date();
      const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 90 && diffDays > 0;
    }).length;

    const totalValue = inventory.reduce((sum, item) => sum + (item.cost || 0), 0);

    return {
      total,
      disponible,
      enUso,
      mantenimiento,
      fueraServicio,
      warrantyExpiring,
      totalValue,
      utilizationRate: total > 0 ? ((enUso / total) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      propiedad: '',
      it: '',
      area: '',
      responsable: '',
      serial: '',
      capacidad: '',
      ram: '',
      marca: '',
      status: 'disponible',
      location: '',
      warrantyExpiry: '',
      purchaseDate: '',
      lastMaintenance: '',
      cost: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      propiedad: item.propiedad,
      it: item.it,
      area: item.area,
      responsable: item.responsable,
      serial: item.serial,
      capacidad: item.capacidad,
      ram: item.ram,
      marca: item.marca,
      status: item.status,
      location: item.location || '',
      warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.split('T')[0] : '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : '',
      cost: item.cost || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.', async () => {
      try {
        await inventoryAPI.deleteInventoryItem(id);
        fetchInventory();
        showNotification('Equipo eliminado exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar:', err);
        showNotification('Error al eliminar el equipo. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingItem) {
        await inventoryAPI.updateInventoryItem(editingItem.id, formData);
        showNotification('Equipo actualizado exitosamente', 'success');
      } else {
        await inventoryAPI.createInventoryItem(formData);
        showNotification('Equipo creado exitosamente', 'success');
      }
      fetchInventory();
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      showNotification('Error al guardar el equipo. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDetectHardware = async () => {
    setDetectingHardware(true);
    try {
      const hardwareData = await inventoryAPI.detectHardware();
      setFormData(prev => ({
        ...prev,
        serial: hardwareData.serial !== 'No detectado' ? hardwareData.serial : prev.serial,
        capacidad: hardwareData.capacidad !== 'No detectado' ? hardwareData.capacidad : prev.capacidad,
        ram: hardwareData.ram !== 'No detectado' ? hardwareData.ram : prev.ram,
        marca: hardwareData.marca !== 'No detectado' ? hardwareData.marca : prev.marca,
      }));
      showNotification('Hardware detectado automáticamente', 'success');
    } catch (err) {
      console.error('Error detecting hardware:', err);
      showNotification('Error al detectar hardware. Verifica la conexión.', 'error');
    } finally {
      setDetectingHardware(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Propiedad', 'IT', 'Área', 'Responsable', 'Serial', 'Capacidad', 'RAM', 'Marca', 'Estado', 'Ubicación', 'Garantía', 'Compra', 'Mantenimiento', 'Costo'];
    const rows = filteredInventory.map(item => [
      item.propiedad,
      item.it,
      item.area,
      item.responsable,
      item.serial,
      item.capacidad,
      item.ram,
      item.marca,
      item.status,
      item.location || '-',
      item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-',
      item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString('es-ES') : '-',
      item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('es-ES') : '-',
      item.cost ? `$${item.cost.toLocaleString('es-CO')}` : '-'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('Inventario exportado exitosamente', 'success');
  };

  const canEdit = user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico';

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

  const getWarrantyStatus = (warrantyExpiry) => {
    if (!warrantyExpiry) return { status: 'unknown', days: null };
    const expiry = new Date(warrantyExpiry);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', days: diffDays };
    if (diffDays <= 30) return { status: 'critical', days: diffDays };
    if (diffDays <= 90) return { status: 'warning', days: diffDays };
    return { status: 'good', days: diffDays };
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-8 px-4">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando inventario...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-6 px-4 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-in-right">
          <div className={`flex items-center p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-white border-green-400 text-green-800'
              : 'bg-white border-red-400 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-5 h-5 text-red-600" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 transform animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Confirmar Acción</h3>
              <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FaBox className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    Sistema de Inventario
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestión integral de equipos de cómputo · 2025
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg"
              >
                <FaChartBar className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg"
              >
                <FaDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              {canEdit && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Nuevo Equipo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaBox className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total Equipos</p>
              <p className="text-xs opacity-75 mt-1">Inventario completo</p>
            </div>
            
            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaCheck className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.disponible}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Disponibles</p>
              <p className="text-xs opacity-75 mt-1">Listos para asignar</p>
            </div>
            
            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaChartBar className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.utilizationRate}%</span>
              </div>
              <p className="text-sm font-medium opacity-90">Tasa de Uso</p>
              <p className="text-xs opacity-75 mt-1">{stats.enUso} equipos activos</p>
            </div>
            
            <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FaExclamationTriangle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{stats.warrantyExpiring}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Garantías por Vencer</p>
              <p className="text-xs opacity-75 mt-1">Próximos 90 días</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por IT, responsable, serial, marca..."
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

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-100 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="en uso">En Uso</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fuera de servicio">Fuera de Servicio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Área</label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="all">Todas las áreas</option>
                  <option value="Alta Dirección">Alta Dirección</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Dirección Técnica">Dirección Técnica</option>
                  <option value="Cadena de abastecimiento">Cadena de abastecimiento</option>
                  <option value="Gestión de Operaciones">Gestión de Operaciones</option>
                  <option value="Mercadeo">Mercadeo</option>
                  <option value="Gestión de Calidad">Gestión de Calidad</option>
                  <option value="Gestión de Talento Humano">Gestión de Talento Humano</option>
                  <option value="Gestión Administrativa">Gestión Administrativa</option>
                  <option value="Gestión Financiera">Gestión Financiera</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                  >
                    <option value="it">IT</option>
                    <option value="responsable">Responsable</option>
                    <option value="area">Área</option>
                    <option value="marca">Marca</option>
                    <option value="status">Estado</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    {sortOrder === 'asc' ? <FaSortAmountDown className="w-5 h-5" /> : <FaSortAmountUp className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-purple-600">{filteredInventory.length}</span> de <span className="font-bold">{inventory.length}</span> equipos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'cards' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaBox className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'table' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterArea !== 'all' 
                ? 'No se encontraron equipos' 
                : 'No hay equipos disponibles'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || filterStatus !== 'all' || filterArea !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando un nuevo equipo al inventario'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && filterArea === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlus className="w-4 h-4" />
                Agregar Primer Equipo
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInventory.map((item) => {
                  const warranty = getWarrantyStatus(item.warrantyExpiry);
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="bg-linear-to-r from-purple-600 to-violet-600 p-4 text-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold">{item.it}</h3>
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                item.status === 'disponible' ? 'bg-green-400 text-green-900' :
                                item.status === 'en uso' ? 'bg-blue-400 text-blue-900' :
                                item.status === 'mantenimiento' ? 'bg-yellow-400 text-yellow-900' :
                                'bg-red-400 text-red-900'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm opacity-90">{item.marca} · {item.propiedad}</p>
                          </div>
                          {canEdit && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                              <FaBox className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Responsable</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{item.responsable}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Área</p>
                              <p className="text-sm font-semibold text-gray-900">{item.area}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Ubicación</p>
                              <p className="text-sm font-semibold text-gray-900">{item.location || '-'}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Capacidad</p>
                              <p className="text-sm font-semibold text-gray-900">{item.capacidad}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">RAM</p>
                              <p className="text-sm font-semibold text-gray-900">{item.ram}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-1">Serial</p>
                            <p className="text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg text-gray-700">{item.serial}</p>
                          </div>

                          {/* Warranty Alert */}
                          {warranty.status !== 'unknown' && warranty.status !== 'good' && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                              warranty.status === 'expired' ? 'bg-red-50 text-red-700' :
                              warranty.status === 'critical' ? 'bg-orange-50 text-orange-700' :
                              'bg-yellow-50 text-yellow-700'
                            }`}>
                              <FaExclamationTriangle className="w-4 h-4 shrink-0" />
                              <p className="text-xs font-semibold">
                                {warranty.status === 'expired' 
                                  ? 'Garantía vencida' 
                                  : `Garantía vence en ${warranty.days} días`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-purple-600 to-violet-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">IT</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Responsable</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Área</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Marca</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Serial</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Specs</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Garantía</th>
                        {canEdit && (
                          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInventory.map((item) => {
                        const warranty = getWarrantyStatus(item.warrantyExpiry);
                        return (
                          <tr key={item.id} className="hover:bg-purple-50 transition-colors">
                            <td className="px-4 py-4">
                              <span className="font-bold text-purple-600">{item.it}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-semibold text-gray-900">{item.responsable}</div>
                              <div className="text-xs text-gray-500">{item.location || '-'}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">{item.area}</td>
                            <td className="px-4 py-4">
                              <div className="font-semibold text-gray-900">{item.marca}</div>
                              <div className="text-xs text-gray-500">{item.propiedad}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{item.serial}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{item.capacidad}</div>
                              <div className="text-xs text-gray-500">{item.ram}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                                item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {warranty.status !== 'unknown' && (
                                <div className={`flex items-center gap-1 ${
                                  warranty.status === 'expired' ? 'text-red-600' :
                                  warranty.status === 'critical' ? 'text-orange-600' :
                                  warranty.status === 'warning' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {warranty.status !== 'good' && <FaExclamationTriangle className="w-3 h-3" />}
                                  <span className="text-xs font-semibold">
                                    {warranty.status === 'expired' ? 'Vencida' : `${warranty.days}d`}
                                  </span>
                                </div>
                              )}
                            </td>
                            {canEdit && (
                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Editar"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-violet-600 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingItem ? 'Editar Equipo' : 'Nuevo Equipo de Cómputo'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaBox className="w-4 h-4 text-purple-600" />
                  </div>
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código IT *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: IT070"
                      value={formData.it}
                      onChange={(e) => setFormData({ ...formData, it: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Propiedad *
                    </label>
                    <select
                      value={formData.propiedad}
                      onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="PROPIO">PROPIO</option>
                      <option value="ARRENDADO">ARRENDADO</option>
                      <option value="COMODATO">COMODATO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en uso">En Uso</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="fuera de servicio">Fuera de Servicio</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Asignación */}
              <div className="pt-6 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCog className="w-4 h-4 text-blue-600" />
                  </div>
                  Asignación y Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Responsable *
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.responsable}
                      onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Área *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    >
                      <option value="">Seleccionar área</option>
                      <option value="Alta Dirección">Alta Dirección</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Dirección Técnica">Dirección Técnica</option>
                      <option value="Cadena de abastecimiento">Cadena de abastecimiento</option>
                      <option value="Gestión de Operaciones">Gestión de Operaciones</option>
                      <option value="Mercadeo">Mercadeo</option>
                      <option value="Gestión de Calidad">Gestión de Calidad</option>
                      <option value="Gestión de Talento Humano">Gestión de Talento Humano</option>
                      <option value="Gestión Administrativa">Gestión Administrativa</option>
                      <option value="Gestión Financiera">Gestión Financiera</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ubicación Física
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Oficina 101"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="pt-6 border-t-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaCog className="w-4 h-4 text-green-600" />
                    </div>
                    Especificaciones Técnicas
                  </h3>
                  <button
                    type="button"
                    onClick={handleDetectHardware}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    disabled={formLoading || detectingHardware}
                  >
                    {detectingHardware ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Detectando...
                      </>
                    ) : (
                      <>
                        <FaSearch className="w-4 h-4" />
                        Auto-detectar
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Lenovo"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Serial *
                    </label>
                    <input
                      type="text"
                      placeholder="Número de serie"
                      value={formData.serial}
                      onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacidad *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 512GB SSD"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      RAM *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 16GB DDR4"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Información Administrativa */}
              <div className="pt-6 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="w-4 h-4 text-amber-600" />
                  </div>
                  Información Administrativa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Compra
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vencimiento Garantía
                    </label>
                    <input
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Último Mantenimiento
                    </label>
                    <input
                      type="date"
                      value={formData.lastMaintenance}
                      onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Costo (COP)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
                  disabled={formLoading || detectingHardware}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={formLoading || detectingHardware}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingItem ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-5 h-5" />
                      {editingItem ? 'Actualizar Equipo' : 'Crear Equipo'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Inventory;