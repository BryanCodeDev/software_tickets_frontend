import React, { useState, useEffect, useContext } from 'react';
import { inventoryAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaBox, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
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
    warrantyExpiry: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [detectingHardware, setDetectingHardware] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryAPI.fetchInventory();
      setInventory(data);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
      alert('Error al cargar el inventario. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

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
      warrantyExpiry: ''
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
      warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.')) {
      try {
        await inventoryAPI.deleteInventoryItem(id);
        fetchInventory();
        showNotification('Artículo eliminado exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar:', err);
        showNotification('Error al eliminar el artículo. Por favor, inténtalo de nuevo.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingItem) {
        await inventoryAPI.updateInventoryItem(editingItem.id, formData);
        showNotification('Artículo actualizado exitosamente', 'success');
      } else {
        await inventoryAPI.createInventoryItem(formData);
        showNotification('Artículo creado exitosamente', 'success');
      }
      fetchInventory();
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      showNotification('Error al guardar el artículo. Por favor, verifica los datos e inténtalo de nuevo.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const canEdit = user?.role?.name === 'Administrador' || user?.role?.name === 'Técnico';

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
      showNotification('Componentes del PC detectados automáticamente', 'success');
    } catch (err) {
      console.error('Error detecting hardware:', err);
      showNotification('Error al detectar componentes del PC. Verifica que estés ejecutando desde un PC Windows.', 'error');
    } finally {
      setDetectingHardware(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 border-b-2 border-purple-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-sm">
          <div className={`flex items-center p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="shrink-0">
              {notification.type === 'success' ? (
                <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              ) : (
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              )}
            </div>
            <div className="ml-2 sm:ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium break-words">{notification.message}</p>
            </div>
            <div className="ml-2 sm:ml-auto sm:pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex rounded-md p-1 sm:p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-50"
              >
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[2000px] mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <FaBox className="text-white text-sm sm:text-base md:text-lg" />
                  </div>
                  <span className="break-words leading-tight">
                    <span className="hidden md:inline">Inventario de Equipos de Cómputo</span>
                    <span className="hidden sm:inline md:hidden">Inventario de Equipos</span>
                    <span className="sm:hidden">Inventario</span>
                  </span>
                </h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600 break-words">
                  Control y seguimiento de equipos informáticos 2025
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 shrink-0"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:hidden md:inline">Nuevo</span>
                <span className="hidden sm:inline md:hidden">Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900">
              Todos los Artículos
            </h2>
          </div>
          
          <div className="p-3 sm:p-4 md:p-6">
            {inventory.length === 0 ? (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaBox className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2">
                  No hay equipos disponibles
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-md mx-auto px-4">
                  Comienza agregando un nuevo equipo al inventario de cómputo
                </p>
              </div>
            ) : (
              <>
                {/* Mobile/Tablet Card Layout (< 1280px) */}
                <div className="block xl:hidden space-y-3 sm:space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{item.propiedad}</h3>
                            <span className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                              item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                              item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">IT:</strong>
                              <span className="break-all">{item.it}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Serial:</strong>
                              <span className="break-all">{item.serial}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Área:</strong>
                              <span className="break-all">{item.area}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Marca:</strong>
                              <span className="break-all">{item.marca}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Responsable:</strong>
                              <span className="break-all">{item.responsable}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">RAM:</strong>
                              <span className="break-all">{item.ram}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Ubicación:</strong>
                              <span className="break-all">{item.location || '-'}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Garantía:</strong>
                              <span className="break-all">{item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-'}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex flex-wrap items-baseline gap-1">
                              <strong className="font-medium text-gray-700">Capacidad:</strong>
                              <span className="break-all">{item.capacidad}</span>
                            </div>
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout (>= 1280px) */}
                <div className="hidden xl:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Propiedad</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">IT</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Área</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Responsable</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Serial</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Capacidad</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">RAM</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Marca</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ubicación</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Garantía</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                        {canEdit && (
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 text-sm font-medium text-gray-900">
                            <div className="max-w-[150px] truncate" title={item.propiedad}>{item.propiedad}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[100px] truncate" title={item.it}>{item.it}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[150px] truncate" title={item.area}>{item.area}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[150px] truncate" title={item.responsable}>{item.responsable}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[120px] truncate" title={item.serial}>{item.serial}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[100px] truncate" title={item.capacidad}>{item.capacidad}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[80px] truncate" title={item.ram}>{item.ram}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[100px] truncate" title={item.marca}>{item.marca}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="max-w-[120px] truncate" title={item.location || '-'}>{item.location || '-'}</div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                            {item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-'}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                              item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                              item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          {canEdit && (
                            <td className="px-3 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                  title="Eliminar"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-3 sm:p-4 md:p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words flex-1">
                  {editingItem ? 'Editar Equipo' : 'Nuevo Equipo de Cómputo'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Propiedad *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: PROPIO"
                    value={formData.propiedad}
                    onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    IT *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: IT070"
                    value={formData.it}
                    onChange={(e) => setFormData({ ...formData, it: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Área *
                </label>
                <input
                  type="text"
                  placeholder="Ej: MATERIA PRIMA"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Responsable *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Oscar"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Serial *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: MP1AP4S"
                    value={formData.serial}
                    onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Capacidad *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 512GB"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    RAM *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 4GB"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Lenovo"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Oficina 101"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Fecha de Garantía
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                >
                  <option value="disponible">Disponible</option>
                  <option value="en uso">En Uso</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fuera de servicio">Fuera de Servicio</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="order-3 sm:order-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading || detectingHardware}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDetectHardware}
                  className="order-2 sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <FaSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Detectar PC</span>
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  className="order-1 sm:order-3 sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={formLoading || detectingHardware}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingItem ? 'Actualizando...' : 'Creando...'}</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Actualizar Equipo' : 'Crear Equipo'}</span>
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

export default Inventory;