import React, { useState, useEffect, useContext } from 'react';
import { inventoryAPI } from '../../api';
import AuthContext from '../../context/AuthContext.jsx';
import { FaBox, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

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

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-violet-50 to-indigo-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
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

      <div>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                  <FaBox className="text-white text-base sm:text-lg" />
                </div>
                <span className="hidden sm:inline">Inventario de Equipos de Cómputo</span>
                <span className="sm:hidden">Inventario</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Control y seguimiento de equipos informáticos 2025</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nuevo Equipo</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900">Todos los Artículos</h2>
          </div>
          <div className="p-4 sm:p-6">
            {inventory.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay equipos disponibles</h3>
                <p className="text-sm sm:text-base text-gray-600">Comienza agregando un nuevo equipo al inventario de cómputo</p>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="block lg:hidden space-y-3 sm:space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 gap-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{item.propiedad}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full self-start sm:self-auto ${
                              item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                              item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>IT:</strong> <span className="truncate">{item.it}</span></div>
                            <div><strong>Serial:</strong> <span className="truncate">{item.serial}</span></div>
                            <div><strong>Área:</strong> <span className="truncate">{item.area}</span></div>
                            <div><strong>Marca:</strong> <span className="truncate">{item.marca}</span></div>
                            <div><strong>Responsable:</strong> <span className="truncate">{item.responsable}</span></div>
                            <div><strong>RAM:</strong> <span className="truncate">{item.ram}</span></div>
                            <div><strong>Ubicación:</strong> <span className="truncate">{item.location || '-'}</span></div>
                            <div><strong>Garantía:</strong> <span className="truncate">{item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-'}</span></div>
                            <div className="col-span-1 sm:col-span-2"><strong>Capacidad:</strong> <span className="truncate">{item.capacidad}</span></div>
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex flex-col space-y-1 ml-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tablet and Desktop Table Layout */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Inventario de Equipos de Cómputo</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROPIEDAD</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IT</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÁREA</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESPONSABLE</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SERIAL</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAPACIDAD</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RAM</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARCA</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UBICACIÓN</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GARANTÍA</th>
                          <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTADO</th>
                          {canEdit && (
                            <th className="px-3 lg:px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCIONES</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-32">{item.propiedad}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-24">{item.it}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-32">{item.area}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-32">{item.responsable}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-32">{item.serial}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-24">{item.capacidad}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-20">{item.ram}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-24">{item.marca}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-32">{item.location || '-'}</td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-24">
                              {item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString('es-ES') : '-'}
                            </td>
                            <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.status === 'disponible' ? 'bg-green-100 text-green-700' :
                                item.status === 'en uso' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            {canEdit && (
                              <td className="px-3 lg:px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[95vh] overflow-y-auto mx-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {editingItem ? 'Editar Equipo' : 'Nuevo Equipo de Cómputo'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingItem ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingItem ? 'Actualizar Equipo' : 'Crear Equipo'
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