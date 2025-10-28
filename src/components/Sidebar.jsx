import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    description: 'Vista general'
  });

  // Role-based menu items
  const role = user?.role?.name;

  if (role === 'Administrador') {
    // Full access
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Gestión de incidencias'
      },
      {
        path: '/inventory',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        label: 'Inventario',
        description: 'Control de activos'
      },
      {
        path: '/repository',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        ),
        label: 'Repositorio',
        description: 'Archivos compartidos'
      },
      {
        path: '/documents',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Documentos',
        description: 'Documentos oficiales'
      },
      {
        path: '/credentials',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
        label: 'Credenciales',
        description: 'Gestión de accesos'
      },
      {
        path: '/users',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        label: 'Usuarios',
        description: 'Gestión de usuarios'
      }
    );
  } else if (role === 'Técnico') {
    // Técnico: Tickets, Inventory, Documents, Repository
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Gestión de incidencias'
      },
      {
        path: '/inventory',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        label: 'Inventario',
        description: 'Control de activos'
      },
      {
        path: '/repository',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        ),
        label: 'Repositorio',
        description: 'Documentación técnica'
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
      }
    );
  } else if (role === 'Empleado') {
    // Empleado/Solicitante: Tickets, Documents (public), Repository (public)
    menuItems.push(
      {
        path: '/tickets',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        label: 'Tickets',
        description: 'Crear y seguir tickets'
      },
      {
        path: '/repository',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        ),
        label: 'Repositorio',
        description: 'Documentos públicos'
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
        fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-linear-to-br from-purple-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg sm:text-xl">D</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Duvy Class</h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Sistema IT Pro</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="p-3 sm:p-4 mx-3 sm:mx-4 mt-4 bg-linear-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30">
                <span className="text-white font-bold text-base sm:text-lg">
                  {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || user?.username || 'Usuario'}
                </p>
                <p className="text-xs text-purple-100 truncate">
                  {user?.role?.name || 'Rol'}
                </p>
                {user?.department && (
                  <p className="text-xs text-purple-200 truncate">
                    {user.department}
                  </p>
                )}
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-6 space-y-1 overflow-y-auto">
            <div className="mb-3 px-2 sm:px-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navegación
              </p>
            </div>
            
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isNewTicket = item.path === 'new-ticket';

              if (isNewTicket) {
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      // Navigate to tickets page and trigger new ticket modal
                      window.location.href = '/tickets?new=true';
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                    className="w-full group relative flex items-center px-2 sm:px-3 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mr-2 sm:mr-3 transition-all bg-gray-100 group-hover:bg-purple-100 group-hover:scale-110">
                      <div className="text-gray-600 group-hover:text-purple-600">
                        {item.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm sm:text-base truncate">{item.label}</span>
                      </div>
                      <div className="text-xs mt-0.5 truncate text-gray-500 group-hover:text-purple-600">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              }

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
                    group relative flex items-center px-2 sm:px-3 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-linear-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  <div className={`
                    shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mr-2 sm:mr-3 transition-all
                    ${isActive
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-purple-100 group-hover:scale-110'
                    }
                  `}>
                    <div className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}>
                      {item.icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm sm:text-base truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`
                          ml-2 px-2 py-0.5 text-xs font-bold rounded-full
                          ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 text-purple-700'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-purple-100' : 'text-gray-500 group-hover:text-purple-600'}`}>
                      {item.description}
                    </div>
                  </div>

                  {isActive && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>


          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 font-medium truncate">© 2025 Duvy Class</p>
                <p className="text-gray-400 truncate">v1.0.0</p>
              </div>
              <div className="flex space-x-1 sm:space-x-2 ml-2">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
