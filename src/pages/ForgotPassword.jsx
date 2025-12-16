import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useThemeClasses } from '../hooks/useThemeClasses';

const ForgotPassword = () => {
  const { conditionalClasses } = useThemeClasses();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.requestPasswordReset(email);
      setSuccess(response.message);

      // For development, show the reset token
      if (response.resetToken) {
        setSuccess(`${response.message}\n\nToken para desarrollo: ${response.resetToken}\n\nURL: ${response.resetUrl}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar restablecimiento de contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-slate-900 via-[#662d91] to-slate-900 flex',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex'
    })}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#662d91] via-[#8e4dbf] to-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl">
              <svg className="w-7 h-7 text-[#662d91]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">DuvyClass</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Recupera el Acceso<br />a tu Cuenta
            </h1>
            <p className="text-xl text-[#e8d5f5] leading-relaxed">
              No te preocupes, es normal olvidar contraseñas. Te ayudaremos a recuperar el acceso a tu cuenta de forma segura en minutos.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Email Seguro</p>
                  <p className="text-[#e8d5f5] text-sm">Enlace cifrado</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Proceso Rápido</p>
                  <p className="text-[#e8d5f5] text-sm">En minutos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold text-lg mb-4">¿Cómo funciona?</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-[#e8d5f5]">Ingresa tu correo electrónico registrado</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-[#e8d5f5]">Recibirás un enlace seguro en tu bandeja</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <span className="text-[#e8d5f5]">Haz clic y crea tu nueva contraseña</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <span className="text-[#e8d5f5]">¡Listo! Accede nuevamente a tu cuenta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div className={conditionalClasses({
        light: 'w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50',
        dark: 'w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900'
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f3ebf9] rounded-full mb-4">
              <svg className="w-8 h-8 text-[#662d91]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className={conditionalClasses({
              light: 'text-3xl font-bold text-gray-900 mb-2',
              dark: 'text-3xl font-bold text-gray-100 mb-2'
            })}>¿Olvidaste tu contraseña?</h2>
            <p className={conditionalClasses({
              light: 'text-gray-600',
              dark: 'text-gray-400'
            })}>Te enviaremos un enlace para restablecerla</p>
          </div>

          <div className={conditionalClasses({
            light: 'bg-white rounded-2xl shadow-xl border border-gray-200 p-8',
            dark: 'bg-gray-800 rounded-2xl shadow-xl border border-gray-600 p-8'
          })}>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        light: 'text-sm font-medium text-green-800 whitespace-pre-line',
                        dark: 'text-sm font-medium text-green-300 whitespace-pre-line'
                      })}>{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className={conditionalClasses({
                  light: 'block text-sm font-semibold text-gray-700 mb-2',
                  dark: 'block text-sm font-semibold text-gray-300 mb-2'
                })}>
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={conditionalClasses({
                      light: 'h-5 w-5 text-gray-400',
                      dark: 'h-5 w-5 text-gray-500'
                    })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={conditionalClasses({
                      light: 'block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all',
                      dark: 'block w-full pl-12 pr-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:border-transparent transition-all'
                    })}
                    placeholder="correo@empresa.com"
                  />
                </div>
                <p className={conditionalClasses({
                  light: 'mt-2 text-xs text-gray-500',
                  dark: 'mt-2 text-xs text-gray-400'
                })}>
                  Ingresa el correo con el que te registraste
                </p>
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
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Enlace de Recuperación
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={conditionalClasses({
                    light: 'w-full border-t border-gray-300',
                    dark: 'w-full border-t border-gray-600'
                  })}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={conditionalClasses({
                    light: 'px-2 bg-white text-gray-500',
                    dark: 'px-2 bg-gray-800 text-gray-400'
                  })}>¿Recordaste tu contraseña?</span>
                </div>
              </div>

              <Link
                to="/login"
                className={conditionalClasses({
                  light: 'w-full flex justify-center items-center py-3 px-4 border-2 border-[#662d91] rounded-xl shadow-sm text-sm font-semibold text-[#662d91] bg-white hover:bg-[#f3ebf9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#662d91] transition-all duration-200',
                  dark: 'w-full flex justify-center items-center py-3 px-4 border-2 border-[#662d91] rounded-xl shadow-sm text-sm font-semibold text-[#8e4dbf] bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#662d91] transition-all duration-200'
                })}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Volver al Inicio de Sesión
              </Link>
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

export default ForgotPassword;


