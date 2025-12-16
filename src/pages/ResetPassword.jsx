import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { useThemeClasses } from '../hooks/useThemeClasses';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { conditionalClasses } = useThemeClasses();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword(token, formData.password);
      setSuccess('Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength <= 3) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-slate-900 via-[#662d91] to-slate-900 flex',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-[#662d91] to-gray-900 flex'
    })}>
      <div className={conditionalClasses({
        light: 'w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 ml-auto',
        dark: 'w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900 ml-auto'
      })}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className={conditionalClasses({
              light: 'text-2xl font-bold text-gray-900',
              dark: 'text-2xl font-bold text-gray-100'
            })}>DuvyClass</span>
          </div>

          <div className="text-center mb-8">
            <h2 className={conditionalClasses({
              light: 'text-3xl font-bold text-gray-900 mb-2',
              dark: 'text-3xl font-bold text-gray-100 mb-2'
            })}>Restablecer Contraseña</h2>
            <p className={conditionalClasses({
              light: 'text-gray-600',
              dark: 'text-gray-400'
            })}>Ingresa tu nueva contraseña</p>
          </div>

          <div className={conditionalClasses({
            light: 'bg-white rounded-2xl shadow-xl border border-gray-200 p-8',
            dark: 'bg-gray-800 rounded-2xl shadow-xl border border-gray-600 p-8'
          })}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className={conditionalClasses({
                  light: 'bg-red-50 border-l-4 border-red-500 p-4 rounded-lg',
                  dark: 'bg-red-900/30 border-l-4 border-red-600 p-4 rounded-lg'
                })}>
                  <div className="flex items-start">
                    <svg className={conditionalClasses({
                      light: 'w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0',
                      dark: 'w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0'
                    })} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className={conditionalClasses({
                        light: 'text-sm font-medium text-red-800',
                        dark: 'text-sm font-medium text-red-300'
                      })}>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className={conditionalClasses({
                  light: 'bg-green-50 border-l-4 border-green-500 p-4 rounded-lg',
                  dark: 'bg-green-900/30 border-l-4 border-green-600 p-4 rounded-lg'
                })}>
                  <div className="flex items-start">
                    <svg className={conditionalClasses({
                      light: 'w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0',
                      dark: 'w-5 h-5 text-green-400 mt-0.5 mr-3 shrink-0'
                    })} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className={conditionalClasses({
                        light: 'text-sm font-medium text-green-800',
                        dark: 'text-sm font-medium text-green-300'
                      })}>{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className={conditionalClasses({
                  light: 'block text-sm font-semibold text-gray-700 mb-2',
                  dark: 'block text-sm font-semibold text-gray-300 mb-2'
                })}>
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={conditionalClasses({
                      light: 'h-5 w-5 text-gray-400',
                      dark: 'h-5 w-5 text-gray-500'
                    })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={conditionalClasses({
                      light: 'block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all',
                      dark: 'block w-full pl-12 pr-12 py-3 border border-gray-600 bg-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all'
                    })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <svg className={conditionalClasses({
                        light: 'h-5 w-5 text-gray-400 hover:text-gray-600',
                        dark: 'h-5 w-5 text-gray-400 hover:text-gray-300'
                      })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className={conditionalClasses({
                        light: 'h-5 w-5 text-gray-400 hover:text-gray-600',
                        dark: 'h-5 w-5 text-gray-400 hover:text-gray-300'
                      })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={conditionalClasses({
                        light: 'text-xs text-gray-600',
                        dark: 'text-xs text-gray-400'
                      })}>Seguridad de la contraseña:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength <= 1 ? conditionalClasses({
                          light: 'text-red-600',
                          dark: 'text-red-400'
                        }) :
                        passwordStrength <= 3 ? conditionalClasses({
                          light: 'text-yellow-600',
                          dark: 'text-yellow-400'
                        }) :
                        conditionalClasses({
                          light: 'text-green-600',
                          dark: 'text-green-400'
                        })
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className={conditionalClasses({
                      light: 'w-full bg-gray-200 rounded-full h-2',
                      dark: 'w-full bg-gray-600 rounded-full h-2'
                    })}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={conditionalClasses({
                  light: 'block text-sm font-semibold text-gray-700 mb-2',
                  dark: 'block text-sm font-semibold text-gray-300 mb-2'
                })}>
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={conditionalClasses({
                      light: 'h-5 w-5 text-gray-400',
                      dark: 'h-5 w-5 text-gray-500'
                    })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={conditionalClasses({
                      light: 'block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all',
                      dark: 'block w-full pl-12 pr-12 py-3 border border-gray-600 bg-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all'
                    })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg className={conditionalClasses({
                        light: 'h-5 w-5 text-gray-400 hover:text-gray-600',
                        dark: 'h-5 w-5 text-gray-400 hover:text-gray-300'
                      })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className={conditionalClasses({
                        light: 'h-5 w-5 text-gray-400 hover:text-gray-600',
                        dark: 'h-5 w-5 text-gray-400 hover:text-gray-300'
                      })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className={conditionalClasses({
                    light: 'mt-1 text-xs text-red-600',
                    dark: 'mt-1 text-xs text-red-400'
                  })}>Las contraseñas no coinciden</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#7a3da8] hover:to-[#9b5fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#662d91] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Restableciendo...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restablecer Contraseña
                  </>
                )}
              </button>
            </form>
          </div>

          <p className={conditionalClasses({
            light: 'mt-8 text-center text-xs text-gray-500',
            dark: 'mt-8 text-center text-xs text-gray-400'
          })}>
            © 2025 DuvyClass. Desarrollado por Bryan Muñoz.<br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


