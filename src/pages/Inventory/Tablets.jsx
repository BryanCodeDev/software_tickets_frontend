import React, { useState, useEffect, useContext } from 'react';
import { FaTablet, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaDownload, FaChartBar, FaExclamationTriangle, FaCalendarAlt, FaCog, FaSortAmountDown, FaSortAmountUp, FaQrcode, FaPrint, FaHistory, FaIndustry, FaFlask, FaCalculator, FaShoppingCart, FaUsers, FaBuilding, FaTools, FaLaptop, FaClipboardCheck } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import AuthContext from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import tabletInventoryAPI from '../../api/tabletInventoryAPI';
import { NotificationSystem, ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';

const Tablets = () => {
  const [tablets, setTablets] = useState([]);
  const [filteredTablets, setFilteredTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    propiedad: '',
    it: '',
    area: '',
    responsable: '',
    serial: '',
    capacidad_almacenamiento: '',
    ram: '',
    marca: '',
    modelo: '',
    pantalla: '',
    sistema_operativo: '',
    status: 'disponible',
    warrantyExpiry: '',
    purchaseDate: '',
    lastMaintenance: '',
    cost: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [filterPropiedad, setFilterPropiedad] = useState('all');
  const [sortBy, setSortBy] = useState('it');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const { user } = useContext(AuthContext);
  const { checkPermission } = useAuth();

  useEffect(() => {
    fetchTablets();
  }, []);

  useEffect(() => {
    filterAndSortTablets();
  }, [tablets, searchTerm, filterStatus, filterArea, filterPropiedad, sortBy, sortOrder]);

  const fetchTablets = async () => {
    try {
      const data = await tabletInventoryAPI.fetchTabletInventory();
      setTablets(data);
    } catch (err) {
      showNotification('Error al cargar las tablets. Por favor, recarga la página.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTablets = () => {
    let filtered = [...tablets];

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

    // Filtro por propiedad
    if (filterPropiedad !== 'all') {
      filtered = filtered.filter(item => item.propiedad === filterPropiedad);
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

    setFilteredTablets(filtered);
  };

  const calculateStats = () => {
    const total = tablets.length;
    const disponible = tablets.filter(i => i.status === 'disponible').length;
    const enUso = tablets.filter(i => i.status === 'en uso').length;
    const mantenimiento = tablets.filter(i => i.status === 'mantenimiento').length;
    const fueraServicio = tablets.filter(i => i.status === 'fuera de servicio').length;
    
    const warrantyExpiring = tablets.filter(item => {
      if (!item.warrantyExpiry) return false;
      const expiry = new Date(item.warrantyExpiry);
      const now = new Date();
      const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 90 && diffDays > 0;
    }).length;

    const totalValue = tablets.reduce((sum, item) => sum + (item.cost || 0), 0);

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
      capacidad_almacenamiento: '',
      ram: '',
      marca: '',
      modelo: '',
      pantalla: '',
      sistema_operativo: '',
      status: 'disponible',
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
      capacidad_almacenamiento: item.capacidad_almacenamiento,
      ram: item.ram,
      marca: item.marca,
      modelo: item.modelo || '',
      pantalla: item.pantalla || '',
      sistema_operativo: item.sistema_operativo || '',
      status: item.status,
      warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.split('T')[0] : '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : '',
      cost: item.cost || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar esta tablet? Esta acción no se puede deshacer.', async () => {
      try {
        await tabletInventoryAPI.deleteTabletInventoryItem(id);
        fetchTablets();
        showNotification('Tablet eliminada exitosamente', 'success');
      } catch (err) {
        showNotification('Error al eliminar la tablet. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingItem) {
        await tabletInventoryAPI.updateTabletInventoryItem(editingItem.id, formData);
        showNotification('Tablet actualizada exitosamente', 'success');
      } else {
        await tabletInventoryAPI.createTabletInventoryItem(formData);
        showNotification('Tablet creada exitosamente', 'success');
      }
      fetchTablets();
      setShowModal(false);
    } catch (err) {
      showNotification('Error al guardar la tablet. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const exportToExcel = () => {
    const headers = ['IT', 'Propiedad', 'Responsable', 'Área', 'Marca', 'Modelo', 'Serial', 'Almacenamiento', 'RAM', 'Pantalla', 'Sistema Operativo', 'Estado', 'Garantía', 'Compra', 'Mantenimiento', 'Costo'];
    const rows = filteredTablets.map(item => [
      item.it,
      item.propiedad,
      item.responsable,
      item.area,
      item.marca,
      item.modelo || '-',
      item.serial,
      item.capacidad_almacenamiento,
      item.ram,
      item.pantalla || '-',
      item.sistema_operativo || '-',
      item.status,
      item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-',
      item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString('es-ES') : '-',
      item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('es-ES') : '-',
      item.cost ? `$${item.cost.toLocaleString('es-CO')}` : '-'
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tablets');

    // Estilos para la tabla
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;

        // Estilo para el header
        if (row === 0) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '6B46C1' } }, // Color púrpura
            alignment: { horizontal: 'center' }
          };
        } else {
          // Estilo para las filas de datos
          ws[cellAddress].s = {
            alignment: { horizontal: 'left' },
            border: {
              top: { style: 'thin', color: { rgb: 'CCCCCC' } },
              bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
              left: { style: 'thin', color: { rgb: 'CCCCCC' } },
              right: { style: 'thin', color: { rgb: 'CCCCCC' } }
            }
          };
        }
      }
    }

    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 10 }, // IT
      { wch: 12 }, // Propiedad
      { wch: 15 }, // Responsable
      { wch: 15 }, // Área
      { wch: 12 }, // Marca
      { wch: 15 }, // Modelo
      { wch: 20 }, // Serial
      { wch: 15 }, // Almacenamiento
      { wch: 10 }, // RAM
      { wch: 12 }, // Pantalla
      { wch: 15 }, // Sistema Operativo
      { wch: 12 }, // Estado
      { wch: 12 }, // Garantía
      { wch: 12 }, // Compra
      { wch: 12 }, // Mantenimiento
      { wch: 12 }  // Costo
    ];

    XLSX.writeFile(wb, `tablets_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Tablets exportadas exitosamente', 'success');
  };

  const canCreate = checkPermission('tablets', 'create');
  const canEdit = checkPermission('tablets', 'edit');
  const canDelete = checkPermission('tablets', 'delete');
  const canView = checkPermission('tablets', 'view');

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
    <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando tablets...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-4 px-3 sm:py-6 sm:px-4 lg:px-8">
      {/* Notification */}
      <NotificationSystem
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={handleConfirm}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 lg:gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <FaTablet className="text-white text-xl lg:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate">
                    Inventario de Tablets
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Gestión integral de tablets corporativas · 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
              >
                <FaChartBar className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base"
              >
                <FaDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              {canCreate && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm lg:text-base"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Nueva Tablet</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <StatsPanel
            showStats={showStats}
            stats={stats}
            statsConfig={[
              {
                key: 'total',
                label: 'Total Tablets',
                description: 'Inventario completo',
                icon: FaTablet,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'disponible',
                label: 'Disponibles',
                description: 'Listos para asignar',
                icon: FaCheck,
                gradient: 'from-green-500 to-green-600',
                loading: loading
              },
              {
                key: 'utilizationRate',
                label: 'Tasa de Uso',
                description: `${stats.enUso} tablets activas`,
                icon: FaChartBar,
                gradient: 'from-[#662d91] to-[#8e4dbf]',
                loading: loading,
                formatter: (value) => `${value}%`
              },
              {
                key: 'warrantyExpiring',
                label: 'Garantías por Vencer',
                description: 'Próximos 90 días',
                icon: FaExclamationTriangle,
                gradient: 'from-amber-500 to-orange-600',
                loading: loading
              }
            ]}
          />
        )}

        {/* Search and Filters */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={[
            {
              label: 'Propiedad',
              value: filterPropiedad,
              onChange: setFilterPropiedad,
              type: 'select',
              options: [
                { value: 'PROPIO', label: 'Propio' },
                { value: 'MILENIO ARQUILER', label: 'Milenio Arq.' },
                { value: 'ARQUILER MOVISTAR', label: 'Arq. Movistar' }
              ]
            },
            {
              label: 'Estado',
              value: filterStatus,
              onChange: setFilterStatus,
              type: 'select',
              options: [
                { value: 'disponible', label: 'Disponible' },
                { value: 'en uso', label: 'En Uso' },
                { value: 'mantenimiento', label: 'Mantenimiento' },
                { value: 'fuera de servicio', label: 'Fuera de Servicio' }
              ]
            },
            {
              label: 'Área',
              value: filterArea,
              onChange: setFilterArea,
              type: 'multiselect',
              optgroups: [
                {
                  label: 'Producción y Operaciones',
                  options: [
                    { value: 'MATERIA PRIMA', label: 'Materia Prima' },
                    { value: 'PRODUCCION', label: 'Producción' },
                    { value: 'PRODUCTO TERMINADO', label: 'Producto Terminado' },
                    { value: 'DESPACHOS', label: 'Despachos' },
                    { value: 'DEVOLUCIONES', label: 'Devoluciones' },
                    { value: 'BODEGA', label: 'Bodega' },
                    { value: 'RECEPCION', label: 'Recepción' },
                    { value: 'ALMACENISTA', label: 'Almacenista' }
                  ]
                },
                {
                  label: 'Calidad y Laboratorio',
                  options: [
                    { value: 'CALIDAD', label: 'Calidad' },
                    { value: 'CALIDAD OROCCO', label: 'Calidad Orocco' },
                    { value: 'LABORATORIO', label: 'Laboratorio' },
                    { value: 'INVESTIGACION', label: 'Investigación' }
                  ]
                },
                {
                  label: 'Administración y Finanzas',
                  options: [
                    { value: 'CONTABILIDAD', label: 'Contabilidad' },
                    { value: 'COSTOS', label: 'Costos' },
                    { value: 'TESORERIA', label: 'Tesorería' },
                    { value: 'CARTERA', label: 'Cartera' },
                    { value: 'FACTURACION', label: 'Facturación' },
                    { value: 'COMPRAS', label: 'Compras' },
                    { value: 'JEFE COMPRAS', label: 'Jefe Compras' }
                  ]
                },
                {
                  label: 'Ventas y Mercadeo',
                  options: [
                    { value: 'VENTAS', label: 'Ventas' },
                    { value: 'MERCADEO', label: 'Mercadeo' },
                    { value: 'DIRECCION VENTAS', label: 'Dirección Ventas' },
                    { value: 'CALL CENTER', label: 'Call Center' },
                    { value: 'SAC', label: 'SAC' }
                  ]
                },
                {
                  label: 'Recursos Humanos',
                  options: [
                    { value: 'RH', label: 'Recursos Humanos' },
                    { value: 'ADMINISTRATIVO', label: 'Administrativo' }
                  ]
                },
                {
                  label: 'Gerencia y Dirección',
                  options: [
                    { value: 'GERENCIA', label: 'Gerencia' },
                    { value: 'SUB GERENCIA', label: 'Sub Gerencia' },
                    { value: 'EJECUTIVA', label: 'Ejecutiva' },
                    { value: 'COORDINADOR', label: 'Coordinador' },
                    { value: 'PLANEACION', label: 'Planeación' }
                  ]
                },
                {
                  label: 'Servicios Generales',
                  options: [
                    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
                    { value: 'REPARACION', label: 'Reparación' },
                    { value: 'SERVICIO GENERAL', label: 'Servicio General' },
                    { value: 'AMBIENTAL Y SST', label: 'Ambiental y SST' }
                  ]
                },
                {
                  label: 'Sistemas y Tecnología',
                  options: [
                    { value: 'SISTEMAS', label: 'Sistemas' },
                    { value: 'DESARROLLO', label: 'Desarrollo' }
                  ]
                },
                {
                  label: 'Control y Auditoría',
                  options: [
                    { value: 'AUDITORIA', label: 'Auditoría' },
                    { value: 'ARCHIVO', label: 'Archivo' }
                  ]
                }
              ]
            }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'it', label: 'IT' },
            { value: 'propiedad', label: 'Propiedad' },
            { value: 'responsable', label: 'Responsable' },
            { value: 'area', label: 'Área' },
            { value: 'marca', label: 'Marca' },
            { value: 'status', label: 'Estado' }
          ]}
        />

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando <span className="font-bold text-[#662d91]">{filteredTablets.length}</span> de <span className="font-bold">{tablets.length}</span> tablets
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaTablet className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'table'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tabla</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredTablets.length === 0 ? (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTablet className="w-8 h-8 lg:w-10 lg:h-10 text-[#662d91]" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterArea !== 'all'
                ? 'No se encontraron tablets'
                : 'No hay tablets disponibles'}
            </h3>
            <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6">
              {searchTerm || filterStatus !== 'all' || filterArea !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando una nueva tablet al inventario'}
            </p>
            {canCreate && !searchTerm && filterStatus === 'all' && filterArea === 'all' && filterPropiedad === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
              >
                <FaPlus className="w-4 h-4" />
                Agregar Primera Tablet
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredTablets.map((item) => {
                  const warranty = getWarrantyStatus(item.warrantyExpiry);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-3 lg:p-4 text-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base lg:text-lg font-bold truncate">{item.it}</h3>
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                item.status === 'disponible' ? 'bg-green-400 text-green-900' :
                                item.status === 'en uso' ? 'bg-blue-400 text-blue-900' :
                                item.status === 'mantenimiento' ? 'bg-yellow-400 text-yellow-900' :
                                'bg-red-400 text-red-900'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs lg:text-sm opacity-90 truncate">{item.marca}</p>
                            <p className="text-xs opacity-75 truncate">{item.propiedad}</p>
                          </div>
                          {canEdit && (
                            <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                                title="Editar"
                              >
                                <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          )}
                          {canDelete && (
                            <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                                title="Eliminar"
                              >
                                <FaTrash className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 lg:p-5">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f3ebf9] rounded-lg flex items-center justify-center shrink-0">
                              <FaTablet className="w-4 h-4 lg:w-5 lg:h-5 text-[#662d91]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Responsable</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{item.responsable}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Área</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.area}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Almacenamiento</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{item.capacidad_almacenamiento}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">RAM</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{item.ram}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-1">Serial</p>
                            <p className="text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg text-gray-700 break-all">{item.serial}</p>
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
                {/* Mobile Card View for Table Mode */}
                <div className="block md:hidden">
                  <div className="divide-y divide-gray-200">
                    {filteredTablets.map((item) => {
                      const warranty = getWarrantyStatus(item.warrantyExpiry);
                      return (
                        <div key={item.id} className="p-4 hover:bg-[#f3ebf9] transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-[#662d91]">{item.it}</span>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                  item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                                  item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                                  item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.responsable}</h3>
                              <p className="text-xs text-gray-500 truncate">{item.marca}</p>
                              <p className="text-xs text-[#662d91] font-medium truncate">{item.propiedad}</p>
                            </div>
                            {canEdit && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation"
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Área:</span>
                            <p className="truncate">{item.area}</p>
                            <div>
                              <span className="font-medium">Almacenamiento:</span>
                              <p className="truncate">{item.capacidad_almacenamiento}</p>
                            </div>
                            <div>
                              <span className="font-medium">RAM:</span>
                              <p className="truncate">{item.ram}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Serial:</span>
                              <p className="font-mono bg-gray-50 px-2 py-1 rounded text-xs break-all">{item.serial}</p>
                            </div>
                            {warranty.status !== 'unknown' && (
                              <div className="col-span-2">
                                <span className="font-medium">Garantía:</span>
                                <p className={`font-semibold ${
                                  warranty.status === 'expired' ? 'text-red-600' :
                                  warranty.status === 'critical' ? 'text-orange-600' :
                                  warranty.status === 'warning' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {warranty.status === 'expired' ? 'Vencida' : `${warranty.days} días`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">IT</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Propiedad</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Responsable</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Área</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Marca</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Modelo</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Serial</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Specs</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Garantía</th>
                        {(canEdit || canDelete) && (
                          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTablets.map((item) => {
                        const warranty = getWarrantyStatus(item.warrantyExpiry);
                        return (
                          <tr key={item.id} className="hover:bg-[#f3ebf9] transition-colors">
                            <td className="px-4 py-4">
                              <span className="font-bold text-[#662d91]">{item.it}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                item.propiedad === 'PROPIO' ? 'bg-green-100 text-green-700' :
                                item.propiedad === 'MILENIO ARQUILER' ? 'bg-blue-100 text-blue-700' :
                                'bg-[#f3ebf9] text-[#662d91]'
                              }`}>
                                {item.propiedad}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">{item.responsable}</td>
                            <td className="px-4 py-4 text-sm text-gray-700">{item.area}</td>
                            <td className="px-4 py-4">
                              <div className="font-semibold text-gray-900">{item.marca}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{item.modelo || '-'}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{item.serial}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{item.capacidad_almacenamiento}</div>
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
                            {(canEdit || canDelete) && (
                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  {canEdit && (
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                      title="Editar"
                                    >
                                      <FaEdit className="w-4 h-4" />
                                    </button>
                                  )}
                                  {canDelete && (
                                    <button
                                      onClick={() => handleDelete(item.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      title="Eliminar"
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  )}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {editingItem ? 'Editar Tablet' : 'Nueva Tablet'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all text-white shrink-0"
                >
                  <FaTimes className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              {/* Información Básica */}
              <div>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#f3ebf9] rounded-lg flex items-center justify-center">
                    <FaTablet className="w-3 h-3 lg:w-4 lg:h-4 text-[#662d91]" />
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
                      placeholder="Ej: TB001"
                      value={formData.it}
                      onChange={(e) => setFormData({ ...formData, it: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="PROPIO">PROPIO</option>
                      <option value="MILENIO ARQUILER">MILENIO ARQUILER</option>
                      <option value="ARQUILER MOVISTAR">ARQUILER MOVISTAR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
              <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCog className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                  </div>
                  Asignación y Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Responsable *
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.responsable}
                      onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-white"
                      required
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
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCog className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                  </div>
                  Especificaciones Técnicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Samsung"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Modelo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Galaxy Tab S7"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-mono text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Almacenamiento *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 128GB"
                      value={formData.capacidad_almacenamiento}
                      onChange={(e) => setFormData({ ...formData, capacidad_almacenamiento: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      RAM *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 4GB"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pantalla
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 11 pulgadas"
                      value={formData.pantalla}
                      onChange={(e) => setFormData({ ...formData, pantalla: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sistema Operativo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Android 11"
                      value={formData.sistema_operativo}
                      onChange={(e) => setFormData({ ...formData, sistema_operativo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Información Administrativa */}
              <div className="pt-4 lg:pt-6 border-t-2 border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="w-3 h-3 lg:w-4 lg:h-4 text-amber-600" />
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingItem ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                      {editingItem ? 'Actualizar Tablet' : 'Crear Tablet'}
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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Tablets;