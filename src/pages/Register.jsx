import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Register = () => {
  const { conditionalClasses } = useThemeClasses();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor verifica e intenta nuevamente.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe contener al menos 8 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'No fue posible completar el registro. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return { text: 'Débil', color: 'text-red-500' };
    if (passwordStrength <= 3) return { text: 'Moderada', color: 'text-amber-500' };
    return { text: 'Segura', color: 'text-emerald-500' };
  };

  const benefits = [
    'Acceso unificado a todos los módulos empresariales',
    'Auditoría completa con trazabilidad de acciones',
    'Control de accesos basado en roles (RBAC)',
    'Integraciones ISO 9001 y flujos de aprobación',
  ];

  const strengthLabel = getStrengthLabel();

  const inputClass = (extra = '') => conditionalClasses({
    light: `block w-full py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 focus:border-[#662d91] transition-all bg-gray-50 hover:bg-white ${extra}`,
    dark: `block w-full py-2.5 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#662d91]/40 focus:border-[#662d91] transition-all bg-gray-800 ${extra}`
  });

  const labelClass = conditionalClasses({
    light: 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide',
    dark: 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide'
  });

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-slate-950 via-[#3d1a57] to-slate-950 flex',
      dark: 'min-h-screen bg-linear-to-br from-gray-950 via-[#2a1040] to-gray-950 flex'
    })}>
      {/* Left Panel - Branding */}
      <div className={conditionalClasses({
        light: 'hidden lg:flex lg:w-[52%] bg-linear-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad] p-14 flex-col justify-between relative overflow-hidden',
        dark: 'hidden lg:flex lg:w-[52%] bg-linear-to-br from-[#1a0a2e] via-[#2d1254] to-[#1a0a2e] p-14 flex-col justify-between relative overflow-hidden'
      })}>
        {/* Geometric decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-white/3 -mr-64 -mt-64" />
           <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-white/3 -ml-48 -mb-48" />
           <div className="absolute top-1/2 left-1/2 w-75 h-75 rounded-full bg-[#8e4dbf]/10 -translate-x-1/2 -translate-y-1/2" />
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
              <div className="text-[10px] text-purple-300 tracking-[0.2em] uppercase font-medium">Enterprise Platform</div>
            </div>
          </div>

          <div className="space-y-5 mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/80 font-medium tracking-wide">Registro habilitado</span>
            </div>
            <h1 className="text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight">
              Crea tu cuenta<br />
              <span className="text-purple-300">y comienza hoy mismo</span>
            </h1>
            <p className="text-base text-white/65 leading-relaxed max-w-sm">
              Únete a la plataforma líder en gestión tecnológica empresarial. Accede a todos los módulos desde un único punto de control.
            </p>
          </div>
        </div>

        {/* Bottom: Benefits list */}
        <div className="relative z-10 space-y-4">
          <p className="text-xs text-white/40 uppercase tracking-[0.15em] font-semibold">Beneficios incluidos</p>
          <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#662d91]/50 border border-purple-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/70 leading-snug">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={conditionalClasses({
        light: 'flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white overflow-y-auto',
        dark: 'flex-1 flex flex-col justify-center items-center px-6 py-10 bg-gray-900 overflow-y-auto'
      })}>
        <div className="w-full max-w-105">
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
           <div className="mb-7">
             <h2 className={conditionalClasses({
               light: 'text-3xl font-bold text-gray-900 mb-2 tracking-tight',
               dark: 'text-3xl font-bold text-white mb-2 tracking-tight'
             })}>
               Crear cuenta corporativa
             </h2>
             <p className={conditionalClasses({
               light: 'text-sm text-gray-500 leading-relaxed',
               dark: 'text-sm text-gray-400 leading-relaxed'
             })}>
               Completa el formulario para solicitar acceso al sistema.
             </p>
           </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass('pl-10 pr-4')}
                  placeholder="Nombre y apellido"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className={labelClass}>Nombre de usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass('pl-10 pr-4')}
                  placeholder="usuario.empresa"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>Correo electrónico corporativo</label>
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
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('pl-10 pr-4')}
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>Contraseña</label>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass('pl-10 pr-11')}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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

              {/* Password strength indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= level ? getStrengthColor() : conditionalClasses({
                            light: 'bg-gray-200',
                            dark: 'bg-gray-700'
                          })
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthLabel.color}`}>
                    Seguridad: {strengthLabel.text}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirmar contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass('pl-10 pr-11')}
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
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
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-3.5 w-3.5 mt-0.5 text-[#662d91] focus:ring-[#662d91] border-gray-300 rounded"
              />
              <label htmlFor="terms" className={conditionalClasses({
                light: 'text-sm text-gray-600 leading-snug',
                dark: 'text-sm text-gray-400 leading-snug'
              })}>
                He leído y acepto los{' '}
                <Link to="/terms-and-conditions" className="font-semibold text-[#662d91] hover:text-[#8e4dbf] transition-colors">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/privacy-policy" className="font-semibold text-[#662d91] hover:text-[#8e4dbf] transition-colors">
                  Política de Privacidad
                </Link>{' '}
                de DuvyClass.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-[#662d91] to-[#8e4dbf] hover:from-[#5a2480] hover:to-[#7c3aad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#662d91] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#662d91]/25"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Crear cuenta y solicitar acceso
                  </>
                )}
              </button>
            </div>

            {/* Divider + Login link */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className={conditionalClasses({
                  light: 'w-full border-t border-gray-100',
                  dark: 'w-full border-t border-gray-700/60'
                })}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className={conditionalClasses({
                  light: 'px-3 bg-white text-gray-400',
                  dark: 'px-3 bg-gray-900 text-gray-500'
                })}>¿Ya tienes cuenta?</span>
              </div>
            </div>

            <Link
              to="/login"
              className={conditionalClasses({
                light: 'w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#662d91]/20 transition-all duration-200',
                dark: 'w-full flex justify-center items-center py-2.5 px-4 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-[#662d91]/30 transition-all duration-200'
              })}
            >
              <svg className="w-4 h-4 mr-2 text-[#662d91]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar sesión con cuenta existente
            </Link>
          </form>

          <p className={conditionalClasses({
            light: 'mt-7 text-center text-xs text-gray-400',
            dark: 'mt-7 text-center text-xs text-gray-600'
          })}>
            © 2026 DuvyClass · Desarrollado por Bryan Muñoz · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;