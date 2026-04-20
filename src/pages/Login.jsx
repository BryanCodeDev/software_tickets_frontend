import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const { conditionalClasses } = useThemeClasses();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password, requires2FA ? twoFactorToken : null);
      if (response.requires2FA) {
        setRequires2FA(true);
        setError('');
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas. Verifica tus datos e intenta nuevamente.');
      setLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Mesa de Ayuda',
      desc: 'Tickets en tiempo real'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Inventario IT',
      desc: 'Control de activos'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Gestión de Calidad',
      desc: 'Certificación ISO 9001'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Compras Empresariales',
      desc: 'Flujos de aprobación'
    }
  ];

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen flex',
      dark: 'min-h-screen flex'
    })}>
      {/* Left Panel - Branding */}
      <div className={conditionalClasses({
        light: 'hidden lg:flex lg:w-[52%] bg-gradient-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad] p-14 flex-col justify-between relative overflow-hidden',
        dark: 'hidden lg:flex lg:w-[52%] bg-gradient-to-br from-[#3d1069] via-[#662d91] to-[#4a1f6e] p-14 flex-col justify-between relative overflow-hidden'
      })}>
        {/* Geometric decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-white/3 -mr-64 -mt-64" />
           <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-white/3 -ml-48 -mb-48" />
           <div className="absolute top-1/2 left-1/2 w-75 h-75 rounded-full bg-[#8e4dbf]/10 -translate-x-1/2 -translate-y-1/2" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Top: Logo + tagline */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/25 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
             <div>
               <span className="text-2xl font-bold text-white tracking-tight">DuvyClass</span>
               <div className="text-xs text-purple-300 tracking-[0.2em] uppercase font-medium">Enterprise Platform</div>
             </div>
          </div>

          <div className="space-y-5 mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/80 font-medium tracking-wide">Sistema operativo</span>
            </div>
            <h1 className="text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight">
              Gestión Tecnológica<br />
              <span className="text-purple-300">Empresarial Integrada</span>
            </h1>
            <p className="text-base text-white/65 leading-relaxed max-w-sm">
              Centraliza soporte técnico, inventario IT, documentación, calidad ISO 9001, compras y credenciales en una sola plataforma.
            </p>
          </div>
        </div>

        {/* Bottom: Feature grid */}
        <div className="relative z-10 space-y-4">
          <p className="text-xs text-white/40 uppercase tracking-[0.15em] font-semibold">Módulos disponibles</p>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feat, i) => (
              <div key={i} className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-3.5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{feat.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={conditionalClasses({
        light: 'flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white',
        dark: 'flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-900'
      })}>
        <div className="w-full max-w-100">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-[#662d91] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#662d91]">DuvyClass</span>
          </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight',
                dark: 'text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight'
              })}>
                {requires2FA ? 'Verificación en dos pasos' : 'Acceso al sistema'}
              </h2>
              <p className={conditionalClasses({
                light: 'text-sm text-gray-600 leading-relaxed',
                dark: 'text-sm text-gray-300 leading-relaxed'
              })}>
               {requires2FA
                 ? 'Ingresa el código generado por tu aplicación de autenticación.'
                 : 'Ingresa tus credenciales corporativas para continuar.'}
             </p>
           </div>

          {/* Error message */}
          {error && (
            <div className={`mb-5 flex items-start gap-3 rounded-xl p-3.5 animate-fade-down ${conditionalClasses({
              light: 'bg-red-50 border border-red-200',
              dark: 'bg-red-900/20 border border-red-800'
            })}`}>
              <svg className={`w-4 h-4 mt-0.5 shrink-0 ${conditionalClasses({
                light: 'text-red-500',
                dark: 'text-red-400'
              })}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-sm ${conditionalClasses({
                light: 'text-red-700',
                dark: 'text-red-200'
              })}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!requires2FA ? (
              <>
                 {/* Email */}
                 <div>
                   <label htmlFor="email" className={conditionalClasses({
                     light: 'block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide',
                     dark: 'block text-sm font-semibold text-gray-300 mb-1.5 uppercase tracking-wide'
                   })}>
                     Correo electrónico
                   </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                         light: 'block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 focus:border-[#662d91] transition-all bg-gray-50 hover:bg-white',
                         dark: 'block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/40 focus:border-[#662d91] transition-all bg-gray-800'
                       })}
                      placeholder="usuario@empresa.com"
                    />
                  </div>
                </div>

                 {/* Password */}
                 <div>
                   <label htmlFor="password" className={conditionalClasses({
                     light: 'block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide',
                     dark: 'block text-sm font-semibold text-gray-300 mb-1.5 uppercase tracking-wide'
                   })}>
                     Contraseña
                   </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                       className={conditionalClasses({
                         light: 'block w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 focus:border-[#662d91] transition-all bg-gray-50 hover:bg-white',
                         dark: 'block w-full pl-10 pr-11 py-2.5 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/40 focus:border-[#662d91] transition-all bg-gray-800'
                       })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                       className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${conditionalClasses({
                         light: 'text-gray-400 hover:text-gray-600',
                         dark: 'text-gray-300 hover:text-gray-200'
                       })} transition-colors`}
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded dark:border-gray-600"
                    />
                    <span className={conditionalClasses({
                      light: 'text-sm text-gray-600',
                      dark: 'text-sm text-gray-300'
                    })}>Mantener sesión activa</span>
                  </label>
                   <Link to="/forgot-password" className={`${conditionalClasses({
                     light: 'text-sm font-medium text-[#662d91] hover:text-[#8e4dbf]',
                     dark: 'text-sm font-medium text-purple-400 hover:text-purple-300'
                   })} transition-colors`}>
                     ¿Olvidaste tu contraseña?
                   </Link>
                </div>
              </>
            ) : (
              /* 2FA Step */
              <div>
                <div className={conditionalClasses({
                  light: 'flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4',
                  dark: 'flex items-center gap-3 bg-purple-900/20 border border-purple-800/40 rounded-xl p-4 mb-4'
                })}>
                  <svg className="w-5 h-5 text-[#662d91] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                  </svg>
                  <p className={conditionalClasses({
                    light: 'text-sm text-purple-800',
                    dark: 'text-sm text-purple-300'
                  })}>
                    Abre tu aplicación de autenticación (Google Authenticator, Authy, etc.) y copia el código de 6 dígitos.
                  </p>
                </div>
                <label htmlFor="twoFactorToken" className={conditionalClasses({
                  light: 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide',
                  dark: 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide'
                })}>
                  Código de verificación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                    </svg>
                  </div>
                  <input
                    id="twoFactorToken"
                    name="twoFactorToken"
                    type="text"
                    inputMode="numeric"
                    required
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                     className={conditionalClasses({
                       light: 'block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 focus:border-[#662d91] transition-all bg-gray-50 tracking-[0.4em] text-center font-mono',
                       dark: 'block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/40 focus:border-[#662d91] transition-all bg-gray-800 tracking-[0.4em] text-center font-mono'
                     })}
                    placeholder="000000"
                    maxLength="6"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#5a2480] hover:to-[#7c3aad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#662d91] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#662d91]/25"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {requires2FA ? 'Verificando...' : 'Autenticando...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {requires2FA ? 'Verificar y acceder' : 'Iniciar sesión'}
                  </>
                )}
              </button>
            </div>

            {/* Divider + Register */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className={conditionalClasses({
                  light: 'w-full border-t border-gray-100',
                  dark: 'w-full border-t border-gray-700/60'
                })}></div>
              </div>
               <div className="relative flex justify-center text-xs">
                 <span className={`px-3 ${conditionalClasses({
                   light: 'bg-white text-gray-500',
                   dark: 'bg-gray-900 text-gray-300'
                 })}`}>¿Aún no tienes acceso?</span>
               </div>
            </div>

            <Link
              to="/register"
              className={conditionalClasses({
                light: 'w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#662d91]/20 transition-all duration-200',
                dark: 'w-full flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 transition-all duration-200'
              })}
            >
              <svg className="w-4 h-4 mr-2 text-[#662d91]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Solicitar acceso al sistema
            </Link>
          </form>

          <p className={conditionalClasses({
            light: 'mt-8 text-center text-xs text-gray-400',
            dark: 'mt-8 text-center text-xs text-gray-400'
          })}>
            © 2026 DuvyClass · Desarrollado por Bryan Muñoz · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
