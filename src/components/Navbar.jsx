import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useThemeClasses } from '../hooks/useThemeClasses';
import ThemeToggle from './ThemeToggle';
import NotificationsPanel from './common/NotificationsPanel.jsx';
import { FaCrown, FaWrench, FaUser, FaShieldAlt, FaUserShield, FaUserCog } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { conditionalClasses } = useThemeClasses();

  // Configuración de estilos con soporte para tema oscuro
  const navbarConfig = {
    normal: {
      light: 'bg-gradient-to-br from-[#662d91] via-[#7a3da8] to-[#8e4dbf] shadow-lg',
      dark: 'bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 shadow-lg'
    },
    scrolled: {
      light: 'bg-white shadow-sm',
      dark: 'bg-gray-900 shadow-sm'
    }
  };

  const buttonConfig = {
    light: 'text-white/80 hover:text-white hover:bg-white/20 focus:ring-white',
    dark: 'text-gray-300 hover:text-white hover:bg-gray-700/50 focus:ring-gray-400'
  };

  const scrolledButtonConfig = {
    light: 'text-gray-600 hover:text-[#662d91] hover:bg-[#f3ebf9] focus:ring-[#662d91]',
    dark: 'text-gray-300 hover:text-purple-400 hover:bg-gray-800 focus:ring-purple-500'
  };

  const textConfig = {
    light: 'text-white',
    dark: 'text-gray-100'
  };

  const scrolledTextConfig = {
    light: 'text-gray-900',
    dark: 'text-gray-100'
  };

  const subtextConfig = {
    light: 'text-[#e8d5f5]',
    dark: 'text-gray-400'
  };

  const scrolledSubtextConfig = {
    light: 'text-gray-500',
    dark: 'text-gray-400'
  };

  const menuConfig = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700'
  };

  const menuItemConfig = {
    light: 'text-gray-700 hover:bg-gray-50 hover:text-[#662d91]',
    dark: 'text-gray-300 hover:bg-gray-700 hover:text-purple-400'
  };

  const getRoleBadge = (roleName) => {
    const badges = {
      'Administrador': { color: 'from-red-500 to-pink-600', icon: <FaCrown />, text: 'Admin', iconColor: 'text-red-500' },
      'Coordinadora Administrativa': { color: 'from-orange-500 to-red-600', icon: <FaUserShield />, text: 'Coord', iconColor: 'text-orange-500' },
      'Técnico': { color: 'from-blue-500 to-cyan-600', icon: <FaWrench />, text: 'Tech', iconColor: 'text-blue-500' },
      'Jefe': { color: 'from-yellow-500 to-orange-600', icon: <FaUserCog />, text: 'Jefe', iconColor: 'text-yellow-500' },
      'Compras': { color: 'from-teal-500 to-cyan-600', icon: <FaUser />, text: 'Compras', iconColor: 'text-teal-500' },
      'Calidad': { color: 'from-[#662d91] to-[#8e4dbf]', icon: <FaShieldAlt />, text: 'Quality', iconColor: 'text-[#662d91]' },
      'Empleado': { color: 'from-green-500 to-emerald-600', icon: <FaUser />, text: 'User', iconColor: 'text-green-500' }
    };
    return badges[roleName] || badges['Empleado'];
  };

  const roleBadge = getRoleBadge(user?.role?.name);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;

  const navbarClasses = conditionalClasses(isScrolled ? navbarConfig.scrolled : navbarConfig.normal);
  const buttonClasses = conditionalClasses(isScrolled ? scrolledButtonConfig : buttonConfig);
  const textClasses = conditionalClasses(isScrolled ? scrolledTextConfig : textConfig);
  const subtextClasses = conditionalClasses(isScrolled ? scrolledSubtextConfig : subtextConfig);

  return (
    <nav className={`sticky top-0 z-30 transition-all duration-300 ${navbarClasses}`}>
      <div className="px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Menu button and Title for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className={`lg:hidden p-1.5 sm:p-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${buttonClasses}`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="lg:hidden flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
                <span className="text-transparent bg-clip-text bg-linear-to-br from-[#662d91] to-[#7a3da8] font-bold text-xs sm:text-sm">D</span>
              </div>
              <div className="min-w-0">
                <h1 className={`text-base sm:text-lg font-bold truncate ${textClasses}`}>Duvy Class</h1>
                <p className={`text-xs truncate ${subtextClasses}`}>Sistema IT</p>
              </div>
            </div>
          </div>

          {/* Right side - Theme Toggle and User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notifications */}
            <NotificationsPanel />
            
            {/* Theme Toggle */}
            <ThemeToggle size="sm" variant="button" className="hidden sm:block" />
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-xl transition-all duration-200 ${
                  isScrolled ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'hover:bg-white/20'
                }`}
              >
                <div className="hidden sm:block text-right">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold truncate max-w-20 ${textClasses}`}>{user?.name || user?.username || 'Usuario'}</p>
                    <span className={`shrink-0 text-base ${roleBadge.iconColor}`}>{roleBadge.icon}</span>
                  </div>
                  <p className={`text-xs truncate max-w-24 ${subtextClasses}`}>{user?.role?.name || 'Rol'}</p>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br ${roleBadge.color} rounded-xl flex items-center justify-center shadow-md ring-2 ${isScrolled ? 'ring-white' : 'ring-white'}`}>
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <svg className={`hidden sm:block w-4 h-4 ${isScrolled ? 'text-gray-400' : 'text-white/80'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 sm:w-72 rounded-xl shadow-lg border py-2 z-50 ${conditionalClasses(menuConfig)}`}>
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className={`text-sm font-semibold truncate ${conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' })}`}>{user?.name || user?.username || 'Usuario'}</p>
                    <p className={`text-xs truncate ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>{user?.email || 'email@ejemplo.com'}</p>
                    {user?.department && (
                      <p className={`text-xs truncate ${conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' })}`}>{user?.department}</p>
                    )}
                    <span className="inline-block mt-2 px-2 py-1 bg-[#f3ebf9] text-[#662d91] dark:bg-purple-900 dark:text-purple-300 text-xs font-medium rounded-md">
                      {user?.role?.name || 'Rol'}
                    </span>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${conditionalClasses(menuItemConfig)}`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </Link>
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${conditionalClasses(menuItemConfig)}`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configuración
                    </Link>
                    <Link
                      to="/help"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${conditionalClasses(menuItemConfig)}`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ayuda
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
