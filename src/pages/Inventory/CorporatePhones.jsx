
import React, { useState, useEffect, useContext } from 'react';
import { FaMobile, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaDownload, FaChartBar, FaExclamationTriangle, FaCalendarAlt, FaCog, FaSortAmountDown, FaSortAmountUp, FaQrcode, FaPrint, FaHistory, FaIndustry, FaFlask, FaCalculator, FaShoppingCart, FaUsers, FaBuilding, FaTools, FaLaptop, FaClipboardCheck, FaEye } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import AuthContext from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { corporatePhoneAPI } from '../../api';
import { ConfirmDialog, FilterPanel, StatsPanel } from '../../components/common';
import ActaEntregaHistoryModal from '../../components/ActasEntrega/ActaEntregaHistoryModal';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useNotifications } from '../../hooks/useNotifications';

const CorporatePhones = () => {
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [corporatePhones, setCorporatePhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: 'admon',
    numero_celular: '',
    plan: '',
    plan_minutos: '',
    tarifa: '',
    gigas_internet: '',
    nombre: '',
    cargo: '',
    correos: '',
    ciudad: '',
    equipo_celular: '',
    fecha_entrega: '',
    imei: '',
    fecha_entrega_reposicion: '',
    fecha_entrega_nueva_persona: '',
    devolucion_equipo: '',
    numero_factura_compra: '',
    status: 'activo'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { checkPermission } = useAuth();

  useEffect(() => {
    fetchCorporatePhones();
  }, []);

  useEffect(() => {
    filterAndSortPhones();
  }, [corporatePhones, searchTerm, filterStatus, filterCategory, sortBy, sortOrder]);

  const fetchCorporatePhones = async () => {
    try {
      const data = await corporatePhoneAPI.fetchCorporatePhones();
      setCorporatePhones(data);
    } catch (err) {
      notifyError('Error al cargar los teléfonos corporativos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPhones = () => {
    let filtered = [...corporatePhones];

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

    // Filtro por categoría
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
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

    setFilteredPhones(filtered);
  };

  const calculateStats = () => {
    const total = corporatePhones.length;
    const activos = corporatePhones.filter(p => p.status === 'activo').length;
    const inactivos = corporatePhones.filter(p => p.status === 'inactivo').length;
    const reposicion = corporatePhones.filter(p => p.status === 'reposicion').length;

    const byCategory = {
      admon: corporatePhones.filter(p => p.category === 'admon').length,
      asesores: corporatePhones.filter(p => p.category === 'asesores').length,
      socios: corporatePhones.filter(p => p.category === 'socios').length,
      reposicion: corporatePhones.filter(p => p.category === 'reposicion').length,
    };

    return {
      total,
      activos,
      inactivos,
      reposicion,
      byCategory,
      utilizationRate: total > 0 ? ((activos / total) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      category: 'admon',
      numero_celular: '',
      plan: '',
      plan_minutos: '',
      tarifa: '',
      gigas_internet: '',
      nombre: '',
      cargo: '',
      correos: '',
      ciudad: '',
      equipo_celular: '',
      fecha_entrega: '',
      imei: '',
      fecha_entrega_reposicion: '',
      fecha_entrega_nueva_persona: '',
      devolucion_equipo: '',
      numero_factura_compra: '',
      status: 'activo'
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      numero_celular: item.numero_celular,
      plan: item.plan,
      plan_minutos: item.plan_minutos,
      tarifa: item.tarifa || '',
      gigas_internet: item.gigas_internet,
      nombre: item.nombre,
      cargo: item.cargo,
      correos: item.correos,
      ciudad: item.ciudad,
      equipo_celular: item.equipo_celular,
      fecha_entrega: item.fecha_entrega ? item.fecha_entrega.split('T')[0] : '',
      imei: item.imei,
      fecha_entrega_reposicion: item.fecha_entrega_reposicion ? item.fecha_entrega_reposicion.split('T')[0] : '',
      fecha_entrega_nueva_persona: item.fecha_entrega_nueva_persona ? item.fecha_entrega_nueva_persona.split('T')[0] : '',
      devolucion_equipo: item.devolucion_equipo,
      numero_factura_compra: item.numero_factura_compra,
      status: item.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmDialog('¿Estás seguro de que deseas eliminar este teléfono corporativo? Esta acción no se puede deshacer.', async () => {
      try {
        await corporatePhoneAPI.deleteCorporatePhone(id);
        fetchCorporatePhones();
        notifySuccess('Teléfono corporativo eliminado exitosamente');
      } catch (err) {
        notifyError('Error al eliminar el teléfono corporativo. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const handleHistory = async (item) => {
    setHistoryItem(item);
    setHistoryLoading(true);
    setShowHistoryModal(true);

    try {
      const history = await corporatePhoneAPI.getHistory(item.id);
      // El modal manejará la carga de datos internamente
    } catch (err) {
      notifyError('Error al cargar el historial. Por favor, inténtalo de nuevo.');
      setShowHistoryModal(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingItem) {
        await corporatePhoneAPI.updateCorporatePhone(editingItem.id, formData);
        notifySuccess('Teléfono corporativo actualizado exitosamente');
      } else {
        await corporatePhoneAPI.createCorporatePhone(formData);
        notifySuccess('Teléfono corporativo creado exitosamente');
      }
      fetchCorporatePhones();
      setShowModal(false);
    } catch (err) {
      notifyError('Error al guardar el teléfono corporativo. Por favor, verifica los datos e inténtalo de nuevo.');
    } finally {
      setFormLoading(false);
    }
  };

  const exportToExcel = () => {
    const headers = ['Categoría', 'Número Celular', 'Plan', 'Plan Minutos', 'Tarifa', 'Gigas Internet', 'Nombre', 'Cargo', 'Correos', 'Ciudad', 'Equipo Celular', 'Fecha Entrega', 'IMEI', 'Estado'];
    const rows = filteredPhones.map(item => [
      item.category,
      item.numero_celular,
      item.plan,
      item.plan_minutos,
      item.tarifa ? `$${item.tarifa.toLocaleString('es-CO')}` : '-',
      item.gigas_internet,
      item.nombre,
      item.cargo,
      item.correos,
      item.ciudad,
      item.equipo_celular,
      item.fecha_entrega ? new Date(item.fecha_entrega).toLocaleDateString('es-ES') : '-',
      item.imei,
      item.status
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Telefonos_Corporativos');

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
      { wch: 12 }, // Categoría
      { wch: 15 }, // Número Celular
      { wch: 15 }, // Plan
      { wch: 12 }, // Plan Minutos
      { wch: 10 }, // Tarifa
      { wch: 12 }, // Gigas Internet
      { wch: 20 }, // Nombre
      { wch: 15 }, // Cargo
      { wch: 25 }, // Correos
      { wch: 15 }, // Ciudad
      { wch: 20 }, // Equipo Celular
      { wch: 12 }, // Fecha Entrega
      { wch: 15 }, // IMEI
      { wch: 10 }  // Estado
    ];

    XLSX.writeFile(wb, `telefonos_corporativos_${new Date().toISOString().split('T')[0]}.xlsx`);
    notifySuccess('Teléfonos corporativos exportados exitosamente');
  };

  const canCreate = checkPermission('corporate_phones', 'create');
  const canEdit = checkPermission('corporate_phones', 'edit');
  const canDelete = checkPermission('corporate_phones', 'delete');
  const canView = checkPermission('corporate_phones', 'view');

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      admon: 'Administración',
      asesores: 'Asesores',
      socios: 'Socios',
      reposicion: 'Reposición'
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      activo: conditionalClasses({
        light: 'bg-green-100 text-green-700',
        dark: 'bg-green-900 text-green-300'
      }),
      inactivo: conditionalClasses({
        light: 'bg-red-100 text-red-700',
        dark: 'bg-red-900 text-red-300'
      }),
      reposicion: conditionalClasses({
        light: 'bg-yellow-100 text-yellow-700',
        dark: 'bg-yellow-900 text-yellow-300'
      })
    };
    return colors[status] || conditionalClasses({
      light: 'bg-gray-100 text-gray-700',
      dark: 'bg-gray-700 text-gray-300'
    });
  };

  if (loading) return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-8 px-4',
      dark: 'min-h-screen bg-gray-900 py-8 px-4'
    })}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#662d91] mx-auto mb-4"></div>
          <p className={conditionalClasses({
            light: 'text-lg text-gray-600 font-medium',
            dark: 'text-lg text-gray-300 font-medium'
          })}>Cargando teléfonos corporativos...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-[#f3ebf9] via-[#e8d5f5] to-[#dbeafe] py-4 px-3 sm:py-6 sm:px-4 lg:px-8',
      dark: 'min-h-screen bg-gray-900 py-4 px-3 sm:py-6 sm:px-4 lg:px-8'
    })}>
      {/* Confirm Dialog */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          if (confirmDialog?.onConfirm) {
            confirmDialog.onConfirm();
          }
          setConfirmDialog(null);
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 lg:gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <FaMobile className="text-white text-xl lg:text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className={conditionalClasses({
                    light: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight truncate',
                    dark: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight truncate'
                  })}>
                    Teléfonos Corporativos
                  </h1>
                  <p className={conditionalClasses({
                    light: 'text-xs sm:text-sm text-gray-600 mt-1',
                    dark: 'text-xs sm:text-sm text-gray-300 mt-1'
                  })}>
                    Gestión de dispositivos móviles corporativos · 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={conditionalClasses({
                  light: 'flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base',
                  dark: 'flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl border-2 border-gray-600 transition-all duration-200 hover:shadow-lg text-sm lg:text-base'
                })}
              >
                <FaChartBar className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>
              <button
                onClick={exportToExcel}
                className={conditionalClasses({
                  light: 'flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg text-sm lg:text-base',
                  dark: 'flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl border-2 border-gray-600 transition-all duration-200 hover:shadow-lg text-sm lg:text-base'
                })}
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
                  Nuevo Teléfono
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
                label: 'Total Teléfonos',
                description: 'Inventario completo',
                icon: FaMobile,
                gradient: 'from-blue-500 to-blue-600',
                loading: loading
              },
              {
                key: 'activos',
                label: 'Activos',
                description: 'Teléfonos en uso',
                icon: FaCheck,
                gradient: 'from-green-500 to-green-600',
                loading: loading
              },
              {
                key: 'utilizationRate',
                label: 'Tasa de Uso',
                description: `${stats.activos} teléfonos activos`,
                icon: FaChartBar,
                gradient: 'from-[#662d91] to-[#8e4dbf]',
                loading: loading,
                formatter: (value) => `${value}%`
              },
              {
                key: 'reposicion',
                label: 'En Reposición',
                description: 'Pendientes de cambio',
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
              label: 'Categoría',
              value: filterCategory,
              onChange: setFilterCategory,
              type: 'select',
              options: [
                { value: 'admon', label: 'Administración' },
                { value: 'asesores', label: 'Asesores' },
                { value: 'socios', label: 'Socios' },
                { value: 'reposicion', label: 'Reposición' }
              ]
            },
            {
              label: 'Estado',
              value: filterStatus,
              onChange: setFilterStatus,
              type: 'select',
              options: [
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
                { value: 'reposicion', label: 'En Reposición' }
              ]
            }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={(order) => setSortOrder(order)}
          sortOptions={[
            { value: 'nombre', label: 'Nombre' },
            { value: 'numero_celular', label: 'Número' },
            { value: 'category', label: 'Categoría' },
            { value: 'status', label: 'Estado' }
          ]}
        />

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className={conditionalClasses({
            light: 'text-sm text-gray-600 font-medium',
            dark: 'text-sm text-gray-300 font-medium'
          })}>
            Mostrando <span className="font-bold text-[#662d91]">{filteredPhones.length}</span> de <span className="font-bold">{corporatePhones.length}</span> teléfonos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'cards'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : conditionalClasses({
                      light: 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
                      dark: 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    })
              }`}
            >
              <FaMobile className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                viewMode === 'table'
                  ? 'bg-[#662d91] text-white shadow-md'
                  : conditionalClasses({
                      light: 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
                      dark: 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    })
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Tabla</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredPhones.length === 0 ? (
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-200 p-6 lg:p-12 text-center',
            dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-700 p-6 lg:p-12 text-center'
          })}>
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-[#f3ebf9] to-[#e8d5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMobile className="w-8 h-8 lg:w-10 lg:h-10 text-[#662d91]" />
            </div>
            <h3 className={conditionalClasses({
              light: 'text-lg lg:text-xl font-bold text-gray-900 mb-2',
              dark: 'text-lg lg:text-xl font-bold text-white mb-2'
            })}>
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No se encontraron teléfonos'
                : 'No hay teléfonos disponibles'}
            </h3>
            <p className={conditionalClasses({
              light: 'text-sm lg:text-base text-gray-600 max-w-md mx-auto mb-4 lg:mb-6',
              dark: 'text-sm lg:text-base text-gray-300 max-w-md mx-auto mb-4 lg:mb-6'
            })}>
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando un nuevo teléfono corporativo al inventario'}
            </p>
            {canCreate && !searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
              >
                <FaPlus className="w-4 h-4" />
                Agregar Primer Teléfono
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredPhones.map((item) => (
                  <div
                    key={item.id}
                    className={conditionalClasses({
                      light: 'bg-white rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group',
                      dark: 'bg-gray-800 rounded-xl lg:rounded-2xl border-2 border-gray-700 hover:border-[#8e4dbf] hover:shadow-xl transition-all duration-300 overflow-hidden group'
                    })}
                  >
                    {/* Card Header */}
                    <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-3 lg:p-4 text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base lg:text-lg font-bold truncate">{item.numero_celular}</h3>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs lg:text-sm opacity-90 truncate">{item.nombre}</p>
                          <p className="text-xs opacity-75 truncate">{getCategoryLabel(item.category)}</p>
                        </div>
                        <div className="flex gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => handleHistory(item)}
                            className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                            title="Historial"
                          >
                            <FaHistory className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                              title="Editar"
                            >
                              <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 lg:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all touch-manipulation"
                              title="Eliminar"
                            >
                              <FaTrash className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 lg:p-5">
                      <div className="space-y-3">
                        <div className={conditionalClasses({
                          light: 'flex items-center gap-3 pb-3 border-b border-gray-100',
                          dark: 'flex items-center gap-3 pb-3 border-b border-gray-600'
                        })}>
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f3ebf9] rounded-lg flex items-center justify-center shrink-0">
                            <FaMobile className="w-4 h-4 lg:w-5 lg:h-5 text-[#662d91]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-500 font-medium',
                              dark: 'text-xs text-gray-400 font-medium'
                            })}>Plan</p>
                            <p className={conditionalClasses({
                              light: 'text-sm font-bold text-gray-900 truncate',
                              dark: 'text-sm font-bold text-white truncate'
                            })}>{item.plan || 'Sin plan'}</p>
                          </div>
                        </div>

                        <div>
                          <p className={conditionalClasses({
                            light: 'text-xs text-gray-500 font-medium mb-1',
                            dark: 'text-xs text-gray-400 font-medium mb-1'
                          })}>Equipo</p>
                          <p className={conditionalClasses({
                            light: 'text-sm font-semibold text-gray-900 truncate',
                            dark: 'text-sm font-semibold text-white truncate'
                          })}>{item.equipo_celular || 'No especificado'}</p>
                        </div>

                        <div className={conditionalClasses({
                          light: 'grid grid-cols-2 gap-3 pt-3 border-t border-gray-100',
                          dark: 'grid grid-cols-2 gap-3 pt-3 border-t border-gray-600'
                        })}>
                          <div>
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-500 font-medium mb-1',
                              dark: 'text-xs text-gray-400 font-medium mb-1'
                            })}>IMEI</p>
                            <p className={conditionalClasses({
                              light: 'text-sm font-semibold text-gray-900 truncate',
                              dark: 'text-sm font-semibold text-white truncate'
                            })}>{item.imei || 'N/A'}</p>
                          </div>
                          <div>
                            <p className={conditionalClasses({
                              light: 'text-xs text-gray-500 font-medium mb-1',
                              dark: 'text-xs text-gray-400 font-medium mb-1'
                            })}>Ciudad</p>
                            <p className={conditionalClasses({
                              light: 'text-sm font-semibold text-gray-900 truncate',
                              dark: 'text-sm font-semibold text-white truncate'
                            })}>{item.ciudad || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className={conditionalClasses({
                light: 'bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden',
                dark: 'bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 overflow-hidden'
              })}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Categoría</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Número</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Equipo</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={conditionalClasses({
                      light: 'divide-y divide-gray-200',
                      dark: 'divide-y divide-gray-600'
                    })}>
                      {filteredPhones.map((item) => (
                        <tr key={item.id} className={conditionalClasses({
                          light: 'hover:bg-[#f3ebf9] transition-colors',
                          dark: 'hover:bg-gray-700 transition-colors'
                        })}>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-[#662d91]">{getCategoryLabel(item.category)}</span>
                          </td>
                          <td className={conditionalClasses({
                            light: 'px-4 py-4 text-sm text-gray-700 font-mono',
                            dark: 'px-4 py-4 text-sm text-gray-300 font-mono'
                          })}>{item.numero_celular}</td>
                          <td className={conditionalClasses({
                            light: 'px-4 py-4 text-sm text-gray-700',
                            dark: 'px-4 py-4 text-sm text-gray-300'
                          })}>{item.nombre}</td>
                          <td className={conditionalClasses({
                            light: 'px-4 py-4 text-sm text-gray-700',
                            dark: 'px-4 py-4 text-sm text-gray-300'
                          })}>{item.plan || '-'}</td>
                          <td className={conditionalClasses({
                            light: 'px-4 py-4 text-sm text-gray-700',
                            dark: 'px-4 py-4 text-sm text-gray-300'
                          })}>{item.equipo_celular || '-'}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleHistory(item)}
                                className={conditionalClasses({
                                  light: 'p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all',
                                  dark: 'p-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-all'
                                })}
                                title="Historial"
                              >
                                <FaHistory className="w-4 h-4" />
                              </button>
                              {canEdit && (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className={conditionalClasses({
                                    light: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all',
                                    dark: 'p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition-all'
                                  })}
                                  title="Editar"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className={conditionalClasses({
                                    light: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all',
                                    dark: 'p-2 text-red-400 hover:bg-red-900 rounded-lg transition-all'
                                  })}
                                  title="Eliminar"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
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
          <div className={conditionalClasses({
            light: 'bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-scale-in',
            dark: 'bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto border-2 border-gray-700 animate-scale-in'
          })}>
            <div className="sticky top-0 bg-linear-to-r from-[#662d91] to-[#8e4dbf] p-4 lg:p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {editingItem ? 'Editar Teléfono Corporativo' : 'Nuevo Teléfono Corporativo'}
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
                <h3 className={conditionalClasses({
                  light: 'text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2',
                  dark: 'text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2'
                })}>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#f3ebf9] rounded-lg flex items-center justify-center">
                    <FaMobile className="w-3 h-3 lg:w-4 lg:h-4 text-[#662d91]" />
                  </div>
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white'
                      })}
                      required
                    >
                      <option value="admon">Administración</option>
                      <option value="asesores">Asesores</option>
                      <option value="socios">Socios</option>
                      <option value="reposicion">Reposición</option>
                    </select>
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Número Celular *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 300 123 4567"
                      value={formData.numero_celular}
                      onChange={(e) => setFormData({ ...formData, numero_celular: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                      required
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Estado *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white'
                      })}
                      required
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="reposicion">En Reposición</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información del Usuario */}
              <div className={conditionalClasses({
                light: 'pt-4 lg:pt-6 border-t-2 border-gray-100',
                dark: 'pt-4 lg:pt-6 border-t-2 border-gray-600'
              })}>
                <h3 className={conditionalClasses({
                  light: 'text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2',
                  dark: 'text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2'
                })}>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUsers className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                  </div>
                  Información del Usuario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                      required
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Cargo
                    </label>
                    <input
                      type="text"
                      placeholder="Cargo del usuario"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Correos
                    </label>
                    <input
                      type="email"
                      placeholder="correo@empresa.com"
                      value={formData.correos}
                      onChange={(e) => setFormData({ ...formData, correos: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Información del Plan */}
              <div className={conditionalClasses({
                light: 'pt-4 lg:pt-6 border-t-2 border-gray-100',
                dark: 'pt-4 lg:pt-6 border-t-2 border-gray-600'
              })}>
                <h3 className={conditionalClasses({
                  light: 'text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2',
                  dark: 'text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2'
                })}>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCalculator className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                  </div>
                  Información del Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Plan
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del plan"
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Plan Minutos
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 300 min"
                      value={formData.plan_minutos}
                      onChange={(e) => setFormData({ ...formData, plan_minutos: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Tarifa (COP)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.tarifa}
                      onChange={(e) => setFormData({ ...formData, tarifa: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Gigas Internet
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 10GB"
                      value={formData.gigas_internet}
                      onChange={(e) => setFormData({ ...formData, gigas_internet: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Información del Equipo */}
              <div className={conditionalClasses({
                light: 'pt-4 lg:pt-6 border-t-2 border-gray-100',
                dark: 'pt-4 lg:pt-6 border-t-2 border-gray-600'
              })}>
                <h3 className={conditionalClasses({
                  light: 'text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2',
                  dark: 'text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2'
                })}>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaTools className="w-3 h-3 lg:w-4 lg:h-4 text-amber-600" />
                  </div>
                  Información del Equipo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Equipo Celular
                    </label>
                    <input
                      type="text"
                      placeholder="Modelo del equipo"
                      value={formData.equipo_celular}
                      onChange={(e) => setFormData({ ...formData, equipo_celular: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      IMEI
                    </label>
                    <input
                      type="text"
                      placeholder="Número IMEI"
                      value={formData.imei}
                      onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-mono text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-mono text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                      })}
                    />
                  </div>

                  <div>
                    <label className={conditionalClasses({
                      light: 'block text-sm font-semibold text-gray-700 mb-2',
                      dark: 'block text-sm font-semibold text-gray-300 mb-2'
                    })}>
                      Fecha de Entrega
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_entrega}
                      onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                        dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white'
                      })}
                    />
                  </div>

                  {(formData.category === 'asesores' || formData.category === 'reposicion') && (
                    <div>
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-700 mb-2',
                        dark: 'block text-sm font-semibold text-gray-300 mb-2'
                      })}>
                        {formData.category === 'asesores' ? 'Fecha Entrega Reposición' : 'Fecha Entrega Nueva Persona'}
                      </label>
                      <input
                        type="date"
                        value={formData.category === 'asesores' ? formData.fecha_entrega_reposicion : formData.fecha_entrega_nueva_persona}
                        onChange={(e) => setFormData({
                          ...formData,
                          [formData.category === 'asesores' ? 'fecha_entrega_reposicion' : 'fecha_entrega_nueva_persona']: e.target.value
                        })}
                        className={conditionalClasses({
                          light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                          dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white'
                        })}
                      />
                    </div>
                  )}
                </div>

                {formData.category === 'reposicion' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-700 mb-2',
                        dark: 'block text-sm font-semibold text-gray-300 mb-2'
                      })}>
                        Devolución Equipo
                      </label>
                      <textarea
                        placeholder="Detalles de la devolución del equipo"
                        value={formData.devolucion_equipo}
                        onChange={(e) => setFormData({ ...formData, devolucion_equipo: e.target.value })}
                        className={conditionalClasses({
                          light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                          dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                        })}
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-700 mb-2',
                        dark: 'block text-sm font-semibold text-gray-300 mb-2'
                      })}>
                        Número Factura Compra
                      </label>
                      <input
                        type="text"
                        placeholder="Número de factura de compra"
                        value={formData.numero_factura_compra}
                        onChange={(e) => setFormData({ ...formData, numero_factura_compra: e.target.value })}
                        className={conditionalClasses({
                          light: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base',
                          dark: 'w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-[#8e4dbf] focus:border-transparent outline-none transition-all font-medium text-sm lg:text-base bg-gray-700 text-white placeholder-gray-400'
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={conditionalClasses({
                light: 'flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-100',
                dark: 'flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t-2 border-gray-600'
              })}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={conditionalClasses({
                    light: 'px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base',
                    dark: 'px-4 lg:px-6 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base'
                  })}
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
                      {editingItem ? 'Actualizar Teléfono' : 'Crear Teléfono'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && historyItem && (
        <ActaEntregaHistoryModal
          show={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title={`Historial - Teléfono ${historyItem.numero_celular}`}
          item={historyItem}
          loading={historyLoading}
          apiCall={() => corporatePhoneAPI.getHistory(historyItem.id)}
          moduleName="telefono corporativo"
        />
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

export default CorporatePhones;
