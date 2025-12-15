import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { usersAPI, inventoryAPI } from '../api';
import { corporatePhoneAPI } from '../api';
import { FaCheck, FaTimes, FaUser, FaEnvelope, FaIdCard, FaPhone, FaShieldAlt, FaSave, FaSearch, FaMobile } from 'react-icons/fa';
import { onUserUpdated, offUserUpdated } from '../api/socket';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    it: '',
    hasCorporatePhone: false,
    corporatePhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [uniqueITs, setUniqueITs] = useState([]);
  const [availablePhones, setAvailablePhones] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        it: user.it || '',
        hasCorporatePhone: user.hasCorporatePhone || false,
        corporatePhone: user.corporatePhone || ''
      });
    }
    fetchUniqueITs();
    fetchAvailablePhones();
  }, [user]);

  const selectedPhone = availablePhones.find(phone => phone.numero_celular === formData.corporatePhone);

  const phonesFiltered = availablePhones.filter(phone =>
    searchPhone === '' ||
    phone.numero_celular.toLowerCase().includes(searchPhone.toLowerCase()) ||
    phone.nombre.toLowerCase().includes(searchPhone.toLowerCase()) ||
    phone.category.toLowerCase().includes(searchPhone.toLowerCase())
  );

  useEffect(() => {
    const handleUserUpdated = (data) => {
      const { userId, user: updatedUser } = data;
      if (user && userId === user.id) {
        setFormData({
          name: updatedUser.name || updatedUser.username || '',
          email: updatedUser.email || '',
          username: updatedUser.username || '',
          it: updatedUser.it || '',
          hasCorporatePhone: updatedUser.hasCorporatePhone || false,
          corporatePhone: updatedUser.corporatePhone || ''
        });
        updateUser(updatedUser);
      }
    };

    onUserUpdated(handleUserUpdated);
    return () => offUserUpdated(handleUserUpdated);
  }, [user, updateUser]);

  const fetchUniqueITs = async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (err) {
      console.error('Error al cargar ITs:', err);
    }
  };

  const fetchAvailablePhones = async () => {
    try {
      const phones = await corporatePhoneAPI.fetchCorporatePhones();
      const activePhones = phones.filter(phone => phone.status === 'activo');
      setAvailablePhones(activePhones);
    } catch (err) {
      console.error('Error al cargar teléfonos corporativos:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await usersAPI.updateProfile(formData);
      updateUser(updatedUser);
      showNotification('Perfil actualizado exitosamente', 'success');
    } catch (error) {
      showNotification('Error al actualizar el perfil. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className={`p-2 rounded-full shrink-0 ${
                notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {notification.type === 'success' ? (
                  <FaCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaUser className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">Gestiona tu información personal y profesional</p>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Role Badge Section */}
          <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-xs text-purple-200 font-medium">Rol del Sistema</p>
                  <p className="text-base sm:text-lg font-bold text-white">{user?.role?.name || 'N/A'}</p>
                </div>
              </div>
              {(user?.role?.name === 'Coordinador de Compras' || user?.role?.name === 'Director de Compras') && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${
                  user?.role?.name === 'Director de Compras' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {user?.role?.name === 'Director de Compras' ? 'Aprobación Final' : 'Aprobación Inicial'}
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 px-3">Información Personal</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Nombre Completo */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaUser className="text-[#662d91] text-xs" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400"
                    required
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaEnvelope className="text-[#662d91] text-xs" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400"
                    required
                  />
                </div>

                {/* Nombre de Usuario */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaIdCard className="text-[#662d91] text-xs" />
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="usuario123"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400"
                    required
                  />
                </div>

                {/* Código IT */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaIdCard className="text-[#662d91] text-xs" />
                    Código IT
                  </label>
                  <select
                    name="it"
                    value={formData.it}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400 bg-white"
                  >
                    <option value="">Seleccionar código IT</option>
                    {uniqueITs.map((item) => (
                      <option key={item.it} value={item.it}>
                        {item.it} ({item.area})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Corporate Phone Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 px-3">Teléfono Corporativo</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* ¿Tiene teléfono corporativo? */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FaPhone className="text-[#662d91] text-xs" />
                    ¿Tiene teléfono corporativo?
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    <label className="flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9] flex-1 min-w-[100px]">
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === true}
                        onChange={() => setFormData({ ...formData, hasCorporatePhone: true })}
                        className="w-4 h-4 text-[#662d91] focus:ring-[#7a3da8]"
                      />
                      <span className="text-sm font-medium text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-checked:border-[#662d91] has-checked:bg-[#f3ebf9] flex-1 min-w-[100px]">
                      <input
                        type="radio"
                        name="hasCorporatePhone"
                        checked={formData.hasCorporatePhone === false}
                        onChange={() => {
                          setFormData({ ...formData, hasCorporatePhone: false, corporatePhone: '' });
                          setSearchPhone('');
                        }}
                        className="w-4 h-4 text-[#662d91] focus:ring-[#7a3da8]"
                      />
                      <span className="text-sm font-medium text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Número Corporativo */}
                {formData.hasCorporatePhone && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaMobile className="text-[#662d91] text-xs" />
                      Número Corporativo
                      <span className="ml-auto text-xs font-normal text-gray-500">
                        {availablePhones.length} disponibles
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar número, nombre o categoría..."
                        value={selectedPhone ? `${selectedPhone.numero_celular} - ${selectedPhone.nombre} (${selectedPhone.category})` : searchPhone}
                        onChange={(e) => {
                          setSearchPhone(e.target.value);
                          setFormData({ ...formData, corporatePhone: '' });
                          setShowPhoneDropdown(true);
                        }}
                        onFocus={() => setShowPhoneDropdown(true)}
                        onBlur={() => setTimeout(() => setShowPhoneDropdown(false), 200)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent transition-all text-sm sm:text-base hover:border-gray-400"
                      />
                      
                      {/* Dropdown de teléfonos */}
                      {showPhoneDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                          {phonesFiltered.length > 0 ? (
                            <div className="py-1">
                              {phonesFiltered.map(phone => (
                                <div
                                  key={phone.id}
                                  className="px-4 py-3 hover:bg-[#f3ebf9] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() => {
                                    setFormData({ ...formData, corporatePhone: phone.numero_celular });
                                    setSearchPhone('');
                                    setShowPhoneDropdown(false);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-semibold text-gray-900 text-sm">{phone.numero_celular}</div>
                                      <div className="text-xs text-gray-600">{phone.nombre}</div>
                                    </div>
                                    <div className="px-2 py-1 bg-[#f3ebf9] text-[#662d91] text-xs font-medium rounded">
                                      {phone.category}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-8 text-center">
                              <FaPhone className="mx-auto text-gray-400 text-2xl mb-2" />
                              <p className="text-sm text-gray-500">
                                {availablePhones.length === 0
                                  ? 'No hay teléfonos disponibles'
                                  : 'No se encontraron resultados'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedPhone && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaCheck className="text-green-600 text-sm" />
                          <p className="text-xs font-medium text-green-700">
                            Teléfono seleccionado correctamente
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            {(user?.role?.name === 'Coordinador de Compras' || user?.role?.name === 'Director de Compras') && (
              <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                user?.role?.name === 'Director de Compras'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-orange-50 border-orange-500'
              }`}>
                <div className="flex items-start gap-3">
                  <FaShieldAlt className={`mt-0.5 shrink-0 ${
                    user?.role?.name === 'Director de Compras' ? 'text-red-600' : 'text-orange-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold mb-1 ${
                      user?.role?.name === 'Director de Compras' ? 'text-red-900' : 'text-orange-900'
                    }`}>
                      Responsabilidades del Rol
                    </p>
                    <p className={`text-xs ${
                      user?.role?.name === 'Director de Compras' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {user?.role?.name === 'Director de Compras'
                        ? 'Responsable de aprobar solicitudes de compra finales y gestionar el presupuesto'
                        : 'Responsable de aprobar solicitudes de compra iniciales y coordinar con proveedores'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Todos los cambios se guardan de forma segura</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white rounded-lg font-semibold hover:from-[#7a3da8] hover:to-[#662d91] focus:ring-4 focus:ring-[#e8d5f5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;