import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { usersAPI, inventoryAPI } from '../api';
import { FaCheck, FaTimes } from 'react-icons/fa';
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
  }, [user]);

  // Socket listener for real-time updates
  useEffect(() => {
    const handleUserUpdated = (data) => {
      const { userId, user: updatedUser } = data;
      if (user && userId === user.id) {
        // Update the form data and context
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

    return () => {
      offUserUpdated(handleUserUpdated);
    };
  }, [user, updateUser]);

  const fetchUniqueITs = async () => {
    try {
      const data = await inventoryAPI.fetchUniqueITs();
      setUniqueITs(data);
    } catch (err) {
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
    <div className="max-w-4xl mx-auto space-y-6">
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

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-base sm:text-lg text-gray-600">Gestiona tu información personal</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código IT
              </label>
              <select
                name="it"
                value={formData.it}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent"
              >
                <option value="">Seleccionar IT</option>
                {uniqueITs.map((item) => (
                  <option key={item.it} value={item.it}>{item.it} ({item.area})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Tiene teléfono corporativo?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasCorporatePhone"
                    checked={formData.hasCorporatePhone === true}
                    onChange={() => setFormData({ ...formData, hasCorporatePhone: true })}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasCorporatePhone"
                    checked={formData.hasCorporatePhone === false}
                    onChange={() => setFormData({ ...formData, hasCorporatePhone: false, corporatePhone: '' })}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.hasCorporatePhone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número Corporativo
                </label>
                <input
                  type="text"
                  name="corporatePhone"
                  value={formData.corporatePhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#662d91] focus:border-transparent"
                  placeholder="Ej: 300 123 4567"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              <p><strong>Rol:</strong> {user?.role?.name || 'N/A'}</p>
              {user?.role?.name === 'Coordinador de Compras' && (
                <p className="text-xs text-orange-600 mt-1">Responsable de aprobar solicitudes de compra iniciales</p>
              )}
              {user?.role?.name === 'Director de Compras' && (
                <p className="text-xs text-red-600 mt-1">Responsable de aprobar solicitudes de compra finales</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#662d91] text-white rounded-lg hover:bg-[#7a3da8] focus:ring-2 focus:ring-[#662d91] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;


