import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { usersAPI } from '../api';
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState(() => {
    return {};
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState({
    secret: '',
    qrCode: '',
    token: '',
    isEnabled: false
  });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      const status = await usersAPI.get2FAStatus();
      setTwoFactorData(prev => ({
        ...prev,
        isEnabled: status.enabled || false
      }));
    } catch (error) {
      console.error('Error loading 2FA status:', error);
      // If token is invalid, don't show error to user, just keep default state
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usersAPI.updateSettings(settings);
      showNotification('Configuración guardada exitosamente', 'success');
    } catch (error) {
      showNotification('Error al guardar la configuración. Por favor, inténtalo de nuevo.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      setPasswordLoading(false);
      return;
    }

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showNotification('Contraseña cambiada exitosamente. Serás redirigido al login.', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ current: false, new: false, confirm: false }); // Reset visibility

      // Clear local storage and redirect to login after successful password change
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      showNotification(error.response?.data?.error || error || 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.', 'error');
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    setTwoFactorLoading(true);
    try {
      if (twoFactorData.isEnabled) {
        await usersAPI.disable2FA();
        setTwoFactorData(prev => ({ ...prev, isEnabled: false }));
        showNotification('Autenticación de dos factores deshabilitada', 'success');
      } else {
        const response = await usersAPI.enable2FA();
        setTwoFactorData(prev => ({
          ...prev,
          secret: response.secret,
          qrCode: response.qrCode
        }));
        setShow2FAModal(true);
      }
    } catch (error) {
      showNotification(error || 'Error al cambiar configuración 2FA', 'error');
      console.error(error);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setTwoFactorLoading(true);

    try {
      await usersAPI.verify2FA(twoFactorData.token);
      setTwoFactorData(prev => ({
        ...prev,
        isEnabled: true,
        secret: '',
        qrCode: '',
        token: ''
      }));
      setShow2FAModal(false);
      showNotification('Autenticación de dos factores habilitada exitosamente', 'success');
    } catch (error) {
      showNotification(error || 'Código de verificación incorrecto', 'error');
      console.error(error);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handle2FAChange = (e) => {
    setTwoFactorData({
      ...twoFactorData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Configuración
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Personaliza tu experiencia en la plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Seguridad */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Seguridad
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Cambiar Contraseña
                  </label>
                  <p className="text-sm text-gray-600">
                    Actualiza tu contraseña de acceso
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors shrink-0"
                >
                  Cambiar
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Autenticación de Dos Factores
                  </label>
                  <p className="text-sm text-gray-600">
                    {twoFactorData.isEnabled ? 'Habilitada - Añade una capa extra de seguridad' : 'Deshabilitada - Añade una capa extra de seguridad'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handle2FAToggle}
                  disabled={twoFactorLoading}
                  className={`px-4 py-2 font-medium rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors shrink-0 ${
                    twoFactorData.isEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                      : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {twoFactorLoading ? 'Procesando...' : (twoFactorData.isEnabled ? 'Deshabilitar' : 'Habilitar')}
                </button>
              </div>
            </div>
          </div>

          {/* Guardar Cambios */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>


        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Configurar Autenticación de Dos Factores
                  </h2>
                  <button
                    onClick={() => {
                      setShow2FAModal(false);
                      setTwoFactorData(prev => ({ ...prev, secret: '', qrCode: '', token: '' }));
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handle2FASubmit} className="p-6 space-y-5">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
                  </p>
                  {twoFactorData.qrCode && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={twoFactorData.qrCode}
                        alt="QR Code para 2FA"
                        className="border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mb-4">
                    O ingresa manualmente este código: <strong>{twoFactorData.secret}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Código de Verificación *
                  </label>
                  <input
                    type="text"
                    name="token"
                    value={twoFactorData.token}
                    onChange={handle2FAChange}
                    placeholder="Ingresa el código de 6 dígitos"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                    maxLength="6"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShow2FAModal(false);
                      setTwoFactorData(prev => ({ ...prev, secret: '', qrCode: '', token: '' }));
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    disabled={twoFactorLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={twoFactorLoading}
                  >
                    {twoFactorLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando...
                      </>
                    ) : (
                      'Verificar y Habilitar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cambiar Contraseña
                  </h2>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPasswords.current ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPasswords.new ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirmar Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPasswords.confirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    disabled={passwordLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cambiando...
                      </>
                    ) : (
                      'Cambiar Contraseña'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;