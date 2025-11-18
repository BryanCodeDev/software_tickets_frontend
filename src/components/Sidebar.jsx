import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCrown, FaWrench, FaUser } from 'react-icons/fa';
import AuthContext from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [];

  // Common items for all roles
  menuItems.push({
    path: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Panel Principal',
    description: 'Vista general del sistema'
  });

  // Role-based menu items
  const role = user?.role?.name;

  if (role === 'Administrador') {
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Gestión de incidencias IT'
      },
      {
        path: '/inventory',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        label: 'Inventario',
        description: 'Control de activos tecnológicos'
      },
      {
        path: '/documents',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Documentos',
        description: 'Archivos oficiales y políticas'
      },
      {
        path: '/credentials',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
        label: 'Credenciales',
        description: 'Gestión segura de accesos'
      },
      {
        path: '/users',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        label: 'Usuarios',
        description: 'Administración de usuarios'
      }
    );
  } else if (role === 'Técnico') {
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Gestión de incidencias IT'
      },
      {
        path: '/inventory',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        label: 'Inventario',
        description: 'Control de activos tecnológicos'
      },
      {
        path: '/documents',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Documentos',
        description: 'Documentación técnica'
      },
      {
        path: '/credentials',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
        label: 'Credenciales',
        description: 'Gestión de accesos seguros'
      }
    );
  } else if (role === 'Empleado') {
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Crear y seguir solicitudes'
      },
      {
        path: '/documents',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Documentos',
        description: 'Documentos públicos'
      }
    );
  }

  const getRoleBadge = (roleName) => {
    const badges = {
      'Administrador': { color: 'from-red-500 to-pink-600', icon: <FaCrown />, text: 'Admin', iconColor: 'text-red-500' },
      'Técnico': { color: 'from-blue-500 to-cyan-600', icon: <FaWrench />, text: 'Tech', iconColor: 'text-blue-500' },
      'Empleado': { color: 'from-green-500 to-emerald-600', icon: <FaUser />, text: 'User', iconColor: 'text-green-500' }
    };
    return badges[roleName] || badges['Empleado'];
  };

  const roleBadge = getRoleBadge(role);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80 bg-linear-to-b from-gray-50 to-white border-r border-gray-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out overflow-y-auto lg:overflow-visible
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 bg-linear-to-br from-purple-600 via-violet-600 to-indigo-600 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-200">
                  <span className="text-transparent bg-clip-text bg-linear-to-br from-purple-600 to-violet-600 font-bold text-2xl">D</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white truncate drop-shadow-lg">DuvyClass</h2>
                  <p className="text-xs text-purple-100 font-medium truncate">Gestión Tecnológica</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="p-4">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${roleBadge.color}`}></div>
              
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className={`relative w-14 h-14 rounded-xl bg-linear-to-br ${roleBadge.color} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                    <span className="text-white font-bold text-xl">
                      {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                    </span>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.name || user?.username || 'Usuario'}
                        </p>
                        {user?.email && (
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        )}
                      </div>
                      <span className={`shrink-0 text-lg ${roleBadge.iconColor}`}>{roleBadge.icon}</span>
                    </div>
                    
                    {/* Role Badge */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-linear-to-r ${roleBadge.color} shadow-sm`}>
                        {user?.role?.name || 'Empleado'}
                      </span>
                      {user?.department && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 bg-gray-100">
                          {user.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="mb-3 px-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Menú Principal
              </p>
            </div>
            
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`
                    group relative flex items-center px-3 py-3.5 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-linear-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50/80'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg"></div>
                  )}

                  {/* Icon container */}
                  <div className={`
                    shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mr-3 transition-all duration-200
                    ${isActive
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-linear-to-br from-gray-100 to-gray-50 group-hover:from-purple-100 group-hover:to-purple-50 group-hover:scale-110 shadow-sm'
                    }
                  `}>
                    <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`
                          ml-2 px-2 py-0.5 text-xs font-bold rounded-full
                          ${isActive
                            ? 'bg-white/30 text-white'
                            : 'bg-purple-100 text-purple-700'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate leading-tight ${isActive ? 'text-purple-100' : 'text-gray-500 group-hover:text-purple-600'}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  {isActive && (
                    <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-linear-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 truncate">Sistema DuvyClass</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Versión 1.0.0
                </p>
              </div>
              <div className="flex space-x-1">
                <Link
                  to="/settings"
                  onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                <Link
                  to="/help"
                  onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-400">
              © 2025 Desarrollado por <span className="font-semibold text-purple-600">Bryan Muñoz</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
