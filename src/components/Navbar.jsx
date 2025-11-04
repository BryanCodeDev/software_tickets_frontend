import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { ticketsAPI, documentsAPI, inventoryAPI } from '../api/index.js';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Función de búsqueda con debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const [tickets, documents, inventory] = await Promise.allSettled([
        ticketsAPI.searchTickets(query),
        documentsAPI.searchDocuments(query),
        inventoryAPI.searchInventory(query)
      ]);

      const results = [];

      // Procesar resultados de tickets
      if (tickets.status === 'fulfilled') {
        results.push(...tickets.value.map(item => ({
          ...item,
          type: 'ticket',
          displayType: 'Ticket',
          title: item.title,
          subtitle: `Estado: ${item.status}`,
          url: `/tickets/${item.id}`
        })));
      }

      // Procesar resultados de documentos
      if (documents.status === 'fulfilled') {
        results.push(...documents.value.map(item => ({
          ...item,
          type: 'document',
          displayType: 'Documento',
          title: item.title,
          subtitle: `Tipo: ${item.type}`,
          url: `/documents/${item.id}`
        })));
      }

      // Procesar resultados de inventario
      if (inventory.status === 'fulfilled') {
        results.push(...inventory.value.map(item => ({
          ...item,
          type: 'inventory',
          displayType: 'Inventario',
          title: item.propiedad || item.serial || `Item ${item.id}`,
          subtitle: `IT: ${item.it}, Área: ${item.area}`,
          url: `/inventory/${item.id}`
        })));
      }

      setSearchResults(results.slice(0, 10)); // Limitar a 10 resultados
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay para permitir clics en resultados
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleResultClick = (url) => {
    navigate(url);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Menu button and Title for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="lg:hidden flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs sm:text-sm">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Duvy Class</h1>
                <p className="text-xs text-gray-500 truncate">Sistema IT</p>
              </div>
            </div>
          </div>

          {/* Center - Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar tickets, archivos, documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Buscando...</span>
                  </div>
                ) : (
                  <>
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleResultClick(result.url)}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="shrink-0 mr-3">
                          {result.type === 'ticket' && (
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          {result.type === 'document' && (
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          {result.type === 'inventory' && (
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md mr-2">
                              {result.displayType}
                            </span>
                            <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Right side - Notifications and User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search button for mobile */}
            <button className="md:hidden p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>


            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-24">{user?.name || user?.username || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 truncate max-w-24">{user?.role?.name || 'Rol'}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <svg className="hidden sm:block w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || user?.username || 'Usuario'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'email@ejemplo.com'}</p>
                    {user?.department && (
                      <p className="text-xs text-gray-400 truncate">{user?.department}</p>
                    )}
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
                      {user?.role?.name || 'Rol'}
                    </span>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configuración
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ayuda
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
      {(showUserMenu || showSearchResults) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowSearchResults(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;