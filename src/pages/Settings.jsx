import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { usersAPI } from '../api';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const { darkMode, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'es'
  });
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [message, setMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await usersAPI.getSettings();
      setSettings({
        notifications: userSettings.notifications,
        emailAlerts: userSettings.emailAlerts,
        darkMode: userSettings.darkMode,
        language: userSettings.language
      });
      // Apply theme and language immediately
      setTheme(userSettings.darkMode);
      i18n.changeLanguage(userSettings.language);
      // Update local state to match
      setSettings(prev => ({ ...prev, darkMode: userSettings.darkMode }));
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set defaults if error
      setSettings({
        notifications: true,
        emailAlerts: true,
        darkMode: false,
        language: 'es'
      });
      setTheme(false);
      i18n.changeLanguage('es');
    } finally {
      setLoadingSettings(false);
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
    setMessage('');

    try {
      await usersAPI.updateSettings(settings);
      // Apply changes immediately
      setTheme(settings.darkMode);
      i18n.changeLanguage(settings.language);
      setMessage(t('Configuración guardada exitosamente'));
    } catch (error) {
      setMessage(t('Error al guardar la configuración'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Sync dark mode toggle with context
  const handleDarkModeToggle = (e) => {
    const newDarkMode = e.target.checked;
    setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
    setTheme(newDarkMode);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden');
      setPasswordLoading(false);
      return;
    }

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage('Contraseña cambiada exitosamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (error) {
      setPasswordMessage(error || 'Error al cambiar la contraseña');
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('Configuración')}</h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t('Personaliza tu experiencia en la plataforma')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notificaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('Notificaciones')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Notificaciones Push')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Recibe notificaciones en tiempo real')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Alertas por Email')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Recibe actualizaciones por correo electrónico')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={settings.emailAlerts}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('Apariencia')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Modo Oscuro')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Cambia a tema oscuro')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleDarkModeToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Idioma')}
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('Seguridad')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Cambiar Contraseña')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Actualiza tu contraseña de acceso')}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cambiar
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Autenticación de Dos Factores')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Añade una capa extra de seguridad')}</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Configurar
              </button>
            </div>
          </div>
        </div>

        {/* Guardar Cambios */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('Guardando...') : t('Guardar Cambios')}
          </button>
        </div>
      </form>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
          {message}
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{t('Cambiar Contraseña')}</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {passwordMessage && (
                <div className={`p-3 rounded-lg text-sm ${passwordMessage.includes('Error') || passwordMessage.includes('no coinciden') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
                  {passwordMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Contraseña Actual')} *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Nueva Contraseña')} *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('Confirmar Nueva Contraseña')} *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={passwordLoading}
                >
                  {t('Cancelar')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('Cambiando...')}
                    </>
                  ) : (
                    t('Cambiar Contraseña')
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

export default Settings;