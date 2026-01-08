import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { usersAPI } from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useNotifications } from '../hooks/useNotifications';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaCog, FaLock, FaShieldAlt, FaKey, FaPalette } from 'react-icons/fa';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { conditionalClasses } = useThemeClasses();
  const { notifySuccess, notifyError } = useNotifications();
  const [settings, setSettings] = useState(() => {
    return {};
  });
  const [loading, setLoading] = useState(false);
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
      notifySuccess('Configuración guardada exitosamente');
    } catch (error) {
      notifyError('Error al guardar la configuración. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
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
      notifyError('Las contraseñas no coinciden');
      setPasswordLoading(false);
      return;
    }

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      notifySuccess('Contraseña cambiada exitosamente. Serás redirigido al login.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ current: false, new: false, confirm: false });

      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      notifyError(error.response?.data?.error || error || 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
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
        notifySuccess('Autenticación de dos factores deshabilitada');
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
      notifyError(error || 'Error al cambiar configuración 2FA');
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
      notifySuccess('Autenticación de dos factores habilitada exitosamente');
    } catch (error) {
      notifyError(error || 'Código de verificación incorrecto');
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
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100',
      dark: 'min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'
    })}>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaCog className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
                dark: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100'
              })}>Configuración</h1>
              <p className={conditionalClasses({
                light: 'text-sm sm:text-base text-gray-600 mt-0.5',
                dark: 'text-sm sm:text-base text-gray-300 mt-0.5'
              })}>Personaliza tu experiencia y gestiona tu seguridad</p>
            </div>
          </div>
        </div>

        {/* Main Settings Card */}
        <div className={conditionalClasses({
          light: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
          dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 overflow-hidden'
        })}>
          
          {/* Security Section Header */}
          <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <p className="text-xs text-purple-200 font-medium">Gestión de Cuenta</p>
                <p className="text-base sm:text-lg font-bold text-white">Seguridad y Privacidad</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            
            {/* Security Settings */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900 px-3',
                  dark: 'text-base sm:text-lg font-bold text-gray-100 px-3'
                })}>Opciones de Seguridad</h2>
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                
                {/* Change Password Option */}
                <div className={conditionalClasses({
                  light: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#662d91] hover:bg-gray-50 transition-all',
                  dark: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-600 hover:border-[#662d91] hover:bg-gray-700 transition-all'
                })}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className={conditionalClasses({
                      light: 'p-2 bg-purple-100 rounded-lg shrink-0 mt-0.5',
                      dark: 'p-2 bg-gray-700 rounded-lg shrink-0 mt-0.5'
                    })}>
                      <FaLock className={conditionalClasses({
                        light: 'text-[#662d91] text-sm',
                        dark: 'text-purple-400 text-sm'
                      })} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-900 mb-1',
                        dark: 'block text-sm font-semibold text-gray-100 mb-1'
                      })}>
                        Cambiar Contraseña
                      </label>
                      <p className={conditionalClasses({
                        light: 'text-xs sm:text-sm text-gray-600',
                        dark: 'text-xs sm:text-sm text-gray-300'
                      })}>
                        Actualiza tu contraseña de acceso al sistema
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className={conditionalClasses({
                      light: 'w-full sm:w-auto px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-sm shrink-0',
                      dark: 'w-full sm:w-auto px-4 py-2.5 bg-gray-600 text-gray-200 font-medium rounded-lg hover:bg-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-sm shrink-0'
                    })}
                  >
                    Cambiar
                  </button>
                </div>

                {/* Two-Factor Authentication Option */}
                <div className={conditionalClasses({
                  light: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#662d91] hover:bg-gray-50 transition-all',
                  dark: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-600 hover:border-[#662d91] hover:bg-gray-700 transition-all'
                })}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className={conditionalClasses({
                      light: 'p-2 bg-purple-100 rounded-lg shrink-0 mt-0.5',
                      dark: 'p-2 bg-gray-700 rounded-lg shrink-0 mt-0.5'
                    })}>
                      <FaKey className={conditionalClasses({
                        light: 'text-[#662d91] text-sm',
                        dark: 'text-purple-400 text-sm'
                      })} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-900 mb-1',
                        dark: 'block text-sm font-semibold text-gray-100 mb-1'
                      })}>
                        Autenticación de Dos Factores
                      </label>
                      <p className={conditionalClasses({
                        light: 'text-xs sm:text-sm text-gray-600',
                        dark: 'text-xs sm:text-sm text-gray-300'
                      })}>
                        {twoFactorData.isEnabled
                          ? 'Actualmente habilitada - Mayor protección para tu cuenta'
                          : 'Añade una capa extra de seguridad con códigos de verificación'}
                      </p>
                      {twoFactorData.isEnabled && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className={conditionalClasses({
                            light: 'text-xs font-medium text-green-700',
                            dark: 'text-xs font-medium text-green-400'
                          })}>Activo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handle2FAToggle}
                    disabled={twoFactorLoading}
                    className={`w-full sm:w-auto px-4 py-2.5 font-medium rounded-lg focus:ring-2 focus:ring-offset-2 transition-all text-sm shrink-0 ${
                      twoFactorData.isEnabled
                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                        : 'bg-[#662d91] text-white hover:bg-[#7a3da8] focus:ring-[#662d91]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {twoFactorLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      twoFactorData.isEnabled ? 'Deshabilitar' : 'Habilitar'
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Theme Settings Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
                <h2 className={conditionalClasses({
                  light: 'text-base sm:text-lg font-bold text-gray-900 px-3',
                  dark: 'text-base sm:text-lg font-bold text-gray-100 px-3'
                })}>Apariencia</h2>
                <div className={conditionalClasses({
                  light: 'h-px flex-1 bg-gray-200',
                  dark: 'h-px flex-1 bg-gray-600'
                })}></div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Theme Selection */}
                <div className={conditionalClasses({
                  light: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#662d91] hover:bg-gray-50 transition-all',
                  dark: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-gray-600 hover:border-[#662d91] hover:bg-gray-700 transition-all'
                })}>
                  <div className="flex items-start gap-3 flex-1">
                    <div className={conditionalClasses({
                      light: 'p-2 bg-purple-100 rounded-lg shrink-0 mt-0.5',
                      dark: 'p-2 bg-gray-700 rounded-lg shrink-0 mt-0.5'
                    })}>
                      <FaPalette className={conditionalClasses({
                        light: 'text-[#662d91] text-sm',
                        dark: 'text-purple-400 text-sm'
                      })} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={conditionalClasses({
                        light: 'block text-sm font-semibold text-gray-900 mb-1',
                        dark: 'block text-sm font-semibold text-gray-100 mb-1'
                      })}>
                        Tema de la Aplicación
                      </label>
                      <p className={conditionalClasses({
                        light: 'text-xs sm:text-sm text-gray-600',
                        dark: 'text-xs sm:text-sm text-gray-300'
                      })}>
                        Cambia entre modo claro y oscuro según tu preferencia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={conditionalClasses({
                      light: 'text-sm text-gray-500 hidden sm:inline',
                      dark: 'text-sm text-gray-400 hidden sm:inline'
                    })}>
                      Modo Claro
                    </span>
                    <ThemeToggle variant="switch" />
                    <span className={conditionalClasses({
                      light: 'text-sm text-gray-500 hidden sm:inline',
                      dark: 'text-sm text-gray-400 hidden sm:inline'
                    })}>
                      Modo Oscuro
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info Card */}
            <div className={conditionalClasses({
              light: 'mb-6 p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500',
              dark: 'mb-6 p-4 rounded-lg border-l-4 bg-blue-900/20 border-blue-600'
            })}>
              <div className="flex items-start gap-3">
                <FaShieldAlt className={conditionalClasses({
                  light: 'mt-0.5 shrink-0 text-blue-600',
                  dark: 'mt-0.5 shrink-0 text-blue-400'
                })} />
                <div className="flex-1 min-w-0">
                  <p className={conditionalClasses({
                    light: 'text-sm font-semibold mb-1 text-blue-900',
                    dark: 'text-sm font-semibold mb-1 text-blue-200'
                  })}>
                    Recomendaciones de Seguridad
                  </p>
                  <p className={conditionalClasses({
                    light: 'text-xs text-blue-700',
                    dark: 'text-xs text-blue-300'
                  })}>
                    Mantén tu cuenta segura actualizando tu contraseña regularmente y habilitando la autenticación de dos factores para mayor protección.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={conditionalClasses({
              light: 'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200',
              dark: 'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-600'
            })}>
              <div className={conditionalClasses({
                light: 'flex items-center gap-2 text-xs sm:text-sm text-gray-500',
                dark: 'flex items-center gap-2 text-xs sm:text-sm text-gray-400'
              })}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Los cambios se aplican de forma inmediata</span>
              </div>

              <button
                type="submit"
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
                    <FaCheck className="text-sm" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={conditionalClasses({
              light: 'bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200',
              dark: 'bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-600'
            })}>
              <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] px-6 py-5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FaLock className="text-white text-lg" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Cambiar Contraseña
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                <div>
                  <label className={conditionalClasses({
                    light: 'flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2',
                    dark: 'flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2'
                  })}>
                    <FaLock className={conditionalClasses({
                      light: 'text-[#662d91] text-xs',
                      dark: 'text-purple-400 text-xs'
                    })} />
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu contraseña actual"
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-400',
                        dark: 'w-full px-4 py-3 pr-12 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                      })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className={conditionalClasses({
                        light: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors',
                        dark: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors'
                      })}
                    >
                      {showPasswords.current ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2',
                    dark: 'flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2'
                  })}>
                    <FaKey className={conditionalClasses({
                      light: 'text-[#662d91] text-xs',
                      dark: 'text-purple-400 text-xs'
                    })} />
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu nueva contraseña"
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-400',
                        dark: 'w-full px-4 py-3 pr-12 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                      })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className={conditionalClasses({
                        light: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors',
                        dark: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors'
                      })}
                    >
                      {showPasswords.new ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2',
                    dark: 'flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2'
                  })}>
                    <FaKey className={conditionalClasses({
                      light: 'text-[#662d91] text-xs',
                      dark: 'text-purple-400 text-xs'
                    })} />
                    Confirmar Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirma tu nueva contraseña"
                      className={conditionalClasses({
                        light: 'w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-400',
                        dark: 'w-full px-4 py-3 pr-12 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-sm sm:text-base hover:border-gray-500 text-gray-100'
                      })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className={conditionalClasses({
                        light: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors',
                        dark: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors'
                      })}
                    >
                      {showPasswords.confirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className={conditionalClasses({
                      light: 'flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors',
                      dark: 'flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-lg transition-colors'
                    })}
                    disabled={passwordLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#662d91] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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

        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={conditionalClasses({
              light: 'bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200',
              dark: 'bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-600'
            })}>
              <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] px-6 py-5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FaShieldAlt className="text-white text-lg" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Configurar 2FA
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShow2FAModal(false);
                      setTwoFactorData(prev => ({ ...prev, secret: '', qrCode: '', token: '' }));
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <form onSubmit={handle2FASubmit} className="p-6 space-y-5">
                <div className="text-center">
                  <p className={conditionalClasses({
                    light: 'text-sm text-gray-600 mb-4',
                    dark: 'text-sm text-gray-300 mb-4'
                  })}>
                    Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
                  </p>
                  {twoFactorData.qrCode && (
                    <div className={conditionalClasses({
                      light: 'flex justify-center mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200',
                      dark: 'flex justify-center mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600'
                    })}>
                      <img
                        src={twoFactorData.qrCode}
                        alt="QR Code para 2FA"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <div className={conditionalClasses({
                    light: 'p-3 bg-purple-50 border border-purple-200 rounded-lg',
                    dark: 'p-3 bg-purple-900/20 border border-purple-800 rounded-lg'
                  })}>
                    <p className={conditionalClasses({
                      light: 'text-xs text-gray-600 mb-1',
                      dark: 'text-xs text-gray-400 mb-1'
                    })}>O ingresa manualmente:</p>
                    <p className="text-sm font-mono font-semibold text-[#662d91] break-all">{twoFactorData.secret}</p>
                  </div>
                </div>

                <div>
                  <label className={conditionalClasses({
                    light: 'flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2',
                    dark: 'flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2'
                  })}>
                    <FaKey className={conditionalClasses({
                      light: 'text-[#662d91] text-xs',
                      dark: 'text-purple-400 text-xs'
                    })} />
                    Código de Verificación *
                  </label>
                  <input
                    type="text"
                    name="token"
                    value={twoFactorData.token}
                    onChange={handle2FAChange}
                    placeholder="Ingresa el código de 6 dígitos"
                    className={conditionalClasses({
                      light: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-center text-lg tracking-widest font-mono',
                      dark: 'w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#7a3da8] focus:border-transparent outline-none transition-all text-center text-lg tracking-widest font-mono text-gray-100'
                    })}
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
                    className={conditionalClasses({
                      light: 'flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors',
                      dark: 'flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-lg transition-colors'
                    })}
                    disabled={twoFactorLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#662d91] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={twoFactorLoading}
                  >
                    {twoFactorLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
      </div>
    </div>
  );
};

export default Settings;