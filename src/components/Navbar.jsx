import React, { useContext, useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef(null);

  const getRoleBadge = (roleName) => {
    const badges = {
      'Administrador':            { gradient: 'from-red-500 to-rose-600',     icon: <FaCrown />,      label: 'Admin',    iconColor: 'text-red-400' },
      'Coordinadora Administrativa': { gradient: 'from-orange-500 to-red-500', icon: <FaUserShield />, label: 'Coord',    iconColor: 'text-orange-400' },
      'Técnico':                  { gradient: 'from-sky-500 to-blue-600',      icon: <FaWrench />,     label: 'Técnico',  iconColor: 'text-sky-400' },
      'Jefe':                     { gradient: 'from-amber-500 to-orange-500',  icon: <FaUserCog />,    label: 'Jefe',     iconColor: 'text-amber-400' },
      'Compras':                  { gradient: 'from-teal-500 to-emerald-600',  icon: <FaUser />,       label: 'Compras',  iconColor: 'text-teal-400' },
      'Calidad':                  { gradient: 'from-[#662d91] to-[#8e4dbf]',  icon: <FaShieldAlt />,  label: 'Calidad',  iconColor: 'text-purple-400' },
      'Empleado':                 { gradient: 'from-emerald-500 to-green-600', icon: <FaUser />,       label: 'Empleado', iconColor: 'text-emerald-400' },
    };
    return badges[roleName] || badges['Empleado'];
  };

  const roleBadge = getRoleBadge(user?.role?.name);
  const userInitial = (user?.name || user?.username || 'U').charAt(0).toUpperCase();
  const userName = user?.name || user?.username || 'Usuario';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  if (!user) return null;

  // ─── Style tokens ───────────────────────────────────────────────────────────
   const navBg = isScrolled
     ? conditionalClasses({ light: 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm', dark: 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm' })
     : conditionalClasses({ light: 'bg-linear-to-r from-[#4a1f6e] via-[#662d91] to-[#7c3aad] shadow-lg', dark: 'bg-linear-to-r from-gray-950 via-[#2d1254] to-gray-950 shadow-lg border-b border-purple-900/30' });

  const iconBtn = isScrolled
    ? conditionalClasses({ light: 'text-gray-500 hover:text-[#662d91] hover:bg-[#f5eeff]', dark: 'text-gray-400 hover:text-purple-400 hover:bg-gray-800' })
    : 'text-white/75 hover:text-white hover:bg-white/15';

  const primaryText = isScrolled
    ? conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' })
    : 'text-white';

  const secondaryText = isScrolled
    ? conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' })
    : 'text-white/55';

  const chevronColor = isScrolled
    ? conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-600' })
    : 'text-white/50';

  const dropdownBg = conditionalClasses({ light: 'bg-white border border-gray-100 shadow-2xl shadow-gray-200/80', dark: 'bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50' });
  const dividerColor = conditionalClasses({ light: 'border-gray-100', dark: 'border-gray-800' });
  const menuItem = conditionalClasses({ light: 'text-gray-600 hover:text-[#662d91] hover:bg-[#f8f3ff]', dark: 'text-gray-400 hover:text-purple-300 hover:bg-gray-800' });
  const headerText = conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' });
  const subText = conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-500' });

  return (
    <nav className={`sticky top-0 z-30 transition-all duration-300 ${navBg}`}>
      <div className="px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* ── Left: sidebar toggle + mobile brand ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSidebar}
              aria-label="Abrir menú"
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 focus:outline-none ${iconBtn}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile brand mark */}
            <div className="lg:hidden flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${isScrolled ? 'bg-[#662d91]' : 'bg-white/20 border border-white/25'}`}>
                <svg className={`w-4 h-4 ${isScrolled ? 'text-white' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <p className={`text-sm font-bold leading-none ${primaryText}`}>DuvyClass</p>
                <p className={`text-[10px] leading-none mt-0.5 tracking-wide ${secondaryText}`}>Sistema IT</p>
              </div>
            </div>
          </div>

          {/* ── Right: notifications + theme + user ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Notifications */}
            <div className={`rounded-xl transition-all duration-200 ${iconBtn}`}>
              <NotificationsPanel />
            </div>

            {/* Theme toggle */}
            <div className="hidden sm:block">
              <ThemeToggle size="sm" variant="button" />
            </div>

            {/* Separator */}
            <div className={`hidden sm:block h-6 w-px mx-1 ${isScrolled
              ? conditionalClasses({ light: 'bg-gray-200', dark: 'bg-gray-700' })
              : 'bg-white/20'}`}
            />

            {/* User menu trigger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Menú de usuario"
                aria-expanded={showUserMenu}
                className={`flex items-center gap-2 sm:gap-2.5 px-1.5 sm:px-2 py-1.5 rounded-xl transition-all duration-200 focus:outline-none group ${
                  isScrolled
                    ? conditionalClasses({ light: 'hover:bg-gray-50', dark: 'hover:bg-gray-800' })
                    : 'hover:bg-white/10'
                }`}
              >
                {/* Name + role (desktop) */}
                 <div className="hidden sm:block text-right">
                   <div className="flex items-center justify-end gap-1.5">
                     <p className={`text-sm font-semibold leading-tight max-w-25 truncate ${primaryText}`}>
                       {userName}
                     </p>
                    <span className={`text-xs ${roleBadge.iconColor}`}>{roleBadge.icon}</span>
                  </div>
                   <p className={`text-xs leading-tight max-w-27.5 truncate ${secondaryText}`}>
                     {user?.role?.name || 'Sin rol'}
                   </p>
                </div>

                {/* Avatar */}
                <div className={`relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br ${roleBadge.gradient} rounded-xl flex items-center justify-center shadow-md ring-2 ring-white/30 transition-transform duration-150 group-hover:scale-105`}>
                  <span className="text-white text-xs sm:text-sm font-bold">{userInitial}</span>
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900" />
                </div>

                {/* Chevron */}
                <svg
                  className={`hidden sm:block w-3.5 h-3.5 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} ${chevronColor}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ── Dropdown menu ── */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl overflow-hidden z-50 ${dropdownBg}`}
                  style={{ animation: 'fadeDown 0.15s ease-out' }}
                >
                  <style>{`
                    @keyframes fadeDown {
                      from { opacity: 0; transform: translateY(-6px); }
                      to   { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>

                  {/* User header */}
                  <div className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 bg-gradient-to-br ${roleBadge.gradient} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
                        <span className="text-white font-bold text-base">{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${headerText}`}>{userName}</p>
                        <p className={`text-xs truncate ${subText}`}>{user?.email || '—'}</p>
                        {user?.department && (
                          <p className={`text-xs truncate ${subText}`}>{user.department}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#f3ebff] text-[#662d91] dark:bg-purple-900/40 dark:text-purple-300`}>
                        <span className="text-[10px]">{roleBadge.icon}</span>
                        {user?.role?.name || 'Sin rol'}
                      </span>
                    </div>
                  </div>

                  <div className={`border-t ${dividerColor}`} />

                  {/* Navigation links */}
                  <div className="py-1.5">
                    {[
                      {
                        to: '/profile',
                        label: 'Mi perfil',
                        desc: 'Información personal y cuenta',
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        )
                      },
                      {
                        to: '/settings',
                        label: 'Configuración',
                        desc: 'Preferencias y seguridad',
                        icon: (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </>
                        )
                      },
                      {
                        to: '/help',
                        label: 'Centro de ayuda',
                        desc: 'Guías, manuales y soporte',
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )
                      }
                    ].map(({ to, label, desc, icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 ${menuItem}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conditionalClasses({ light: 'bg-gray-100', dark: 'bg-gray-800' })}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {icon}
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{label}</p>
                          <p className={`text-xs leading-tight ${subText}`}>{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className={`border-t ${dividerColor}`} />

                  {/* Logout */}
                  <div className="py-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium leading-tight">Cerrar sesión</p>
                        <p className="text-xs text-red-400/70 leading-tight">Finalizar sesión actual</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;