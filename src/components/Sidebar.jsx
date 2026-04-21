import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaCrown, FaWrench, FaUser, FaShieldAlt, FaClipboardList,
  FaUserShield, FaUserCog, FaDumpster, FaChartLine,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext.jsx';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { GRADIENTS, BG_COLORS, INTERACTIVE } from '../design-system/tokens';

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconTicket = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconCart = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const IconBox = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconLock = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);
const IconShield = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconPhone = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconTablet = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const IconDoc = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const IconDocAlt = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconComputer = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);
const IconClose = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── Menu definitions ─────────────────────────────────────────────────────────
const inventarioSubItems = [
  { path: '/inventory',        icon: <IconComputer />, label: 'Computadores',          description: 'Equipos de cómputo' },
  { path: '/corporate-phones', icon: <IconPhone />,    label: 'Celulares Corporativos', description: 'Teléfonos corporativos' },
  { path: '/tablets',          icon: <IconTablet />,   label: 'Tablets',               description: 'Tablets corporativas' },
  { path: '/pdas',             icon: <IconTablet />,   label: 'PDAs',                  description: 'PDAs corporativas' },
  { path: '/actas-entrega',    icon: <IconDocAlt />,   label: 'Actas de Entrega',      description: 'Entrega y devolución' },
];

const calidadSubItemsFull = [
  { path: '/quality-dashboard',        icon: <FaChartLine className="w-4.25 h-4.25" />, label: 'Dashboard Calidad',     description: 'Vista general de calidad' },
  { path: '/documents',                icon: <IconDoc />,                                    label: 'Documentos',            description: 'Archivos oficiales' },
  { path: '/document-change-requests', icon: <IconDocAlt />,                                 label: 'Solicitudes de Cambio', description: 'Workflow documental' },
  { path: '/ticket_calidad',           icon: <FaClipboardList className="w-4.25 h-4.25" />, label: 'Ticket Calidad',    description: 'Reportes de calidad' },
];

  const buildMenuItems = (role) => {
    const base = [{ path: '/dashboard', icon: <IconHome />, label: 'Panel Principal', description: 'Vista general del sistema' }];

    const ticketItem    = { path: '/tickets',           icon: <IconTicket />, label: 'Tickets',                description: 'Gestión de incidencias IT' };
    const purchaseItem  = { path: '/purchase-requests', icon: <IconCart />,   label: 'Solicitudes de Compra',  description: 'Periféricos y equipos' };
    const inventario    = { type: 'submenu', label: 'Inventario', icon: <IconBox />, description: 'Control de activos tecnológicos', subItems: inventarioSubItems };
    const calidadFull   = { type: 'submenu', label: 'Calidad',    icon: <FaShieldAlt className="w-4.5 h-4.5" />, description: 'ISO 9001 y gestión documental', subItems: calidadSubItemsFull };
    const credItem      = { path: '/credentials', icon: <IconLock />,   label: 'Credenciales',   description: 'Gestión de accesos seguros' };
    const docItem       = { path: '/documents', icon: <IconDoc />,    label: 'Documentos',     description: 'Archivos oficiales' };
    const usersItem     = { path: '/users',        icon: <IconUsers />,  label: 'Usuarios',       description: 'Administración de usuarios' };
    const rolesItem     = { path: '/roles',         icon: <IconShield />, label: 'Roles',          description: 'Permisos y control de acceso' };
    const trashItem     = { path: '/trash',         icon: <FaDumpster className="w-4.5 h-4.5" />, label: 'Papelera', description: 'Elementos eliminados' };
    const registerItem  = { path: '/register',      icon: <FaUserCog className="w-4.5 h-4.5" />, label: 'Crear Usuario',  description: 'Registrar nuevo usuario' };

    if (role === 'Administrador') return [...base, ticketItem, purchaseItem, inventario, calidadFull, credItem, usersItem, rolesItem, trashItem, registerItem];
    if (role === 'Técnico')       return [...base, ticketItem, inventario, credItem, trashItem, registerItem];
    if (role === 'Empleado')      return [...base, ticketItem, purchaseItem, inventario, docItem];
    if (role === 'Jefe')          return [...base, ticketItem, purchaseItem, calidadFull];
    if (role === 'Compras')       return [...base, purchaseItem];
    if (role === 'Calidad')       return [...base, calidadFull];
    if (role === 'Coordinadora Administrativa') return [...base, purchaseItem, inventario];
    return base;
  };

// ─── Role badge config ────────────────────────────────────────────────────────
const roleBadges = {
  'Administrador':               { gradient: 'from-red-500 to-rose-600',      icon: <FaCrown />,      iconColor: 'text-red-400' },
  'Coordinadora Administrativa': { gradient: 'from-orange-500 to-red-500',    icon: <FaUserShield />, iconColor: 'text-orange-400' },
  'Técnico':                     { gradient: 'from-sky-500 to-blue-600',       icon: <FaWrench />,     iconColor: 'text-sky-400' },
  'Jefe':                        { gradient: 'from-amber-500 to-orange-500',   icon: <FaUserCog />,    iconColor: 'text-amber-400' },
  'Compras':                     { gradient: 'from-teal-500 to-emerald-600',   icon: <FaUser />,       iconColor: 'text-teal-400' },
   'Calidad':                     { gradient: 'from-purple-800 to-purple-500',   icon: <FaShieldAlt />,  iconColor: 'text-purple-400' },
  'Empleado':                    { gradient: 'from-emerald-500 to-green-600',  icon: <FaUser />,       iconColor: 'text-emerald-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleSidebarCollapse }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const { conditionalClasses } = useThemeClasses();

  const role = user?.role?.name;
  const menuItems = buildMenuItems(role);
  const badge = roleBadges[role] || roleBadges['Empleado'];
  const userInitial = (user?.name || user?.username || 'U').charAt(0).toUpperCase();
  const userName = user?.name || user?.username || 'Usuario';

  const toggleSubmenu = (label) => {
    if (isCollapsed) {
      // Si está colapsado, expandir primero y abrir el submenu
      toggleSidebarCollapse();
      // Abrir este submenu specific
      setOpenSubmenus(prev => ({ ...prev, [label]: true }));
    } else {
      setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
    }
  };

  const closeMobileIfNeeded = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

   // ── Style tokens ────────────────────────────────────────────────────────────
   const sidebarBg = conditionalClasses(BG_COLORS.sidebar);

   const headerBg = conditionalClasses({
     light: GRADIENTS.brand.light,
     dark: `${GRADIENTS.brand.dark} border-b border-purple-900/30`
   });

   const sectionLabel = conditionalClasses({
     light: 'text-gray-500',
     dark: 'text-gray-400'
   });

  const footerBg = conditionalClasses({
    light: 'border-t border-gray-100 bg-gray-50/80',
    dark: 'border-t border-gray-800/60 bg-gray-950'
  });

   // Active item
   const activeItem = conditionalClasses(INTERACTIVE.activeItem);

  // Inactive item
  const inactiveItem = conditionalClasses({
    light: 'text-gray-600 hover:text-purple-800 hover:bg-purple-50',
    dark: 'text-gray-400 hover:text-purple-300 hover:bg-gray-800/60'
  });

  // Active icon bg
  const activeIconBg = 'bg-purple-600/20';

  // Inactive icon bg
  const inactiveIconBg = conditionalClasses({
    light: 'bg-gray-100 group-hover:bg-purple-100',
    dark: 'bg-gray-800 group-hover:bg-gray-700'
  });

  // Active sub-description
  const activeSubDesc = conditionalClasses({
    light: 'text-purple-700',
    dark: 'text-purple-300'
  });

  // Inactive sub-description
  const inactiveSubDesc = conditionalClasses({
    light: 'text-gray-400 group-hover:text-purple-500',
    dark: 'text-gray-500 group-hover:text-purple-400'
  });

  // ── Render nav item (link) ──────────────────────────────────────────────────
  const renderLink = (item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={closeMobileIfNeeded}
        title={isCollapsed ? item.label : undefined}
        className={`group relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-2.5'} py-2.5 rounded-xl transition-all duration-150 ${isActive ? activeItem : inactiveItem}`}
      >
        {/* Active bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 rounded-r-full" />
        )}

        {/* Icon */}
        <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${isCollapsed ? '' : 'mr-2.5'} ${isActive ? activeIconBg : inactiveIconBg}`}>
          <span className={isActive ? 'text-white' : conditionalClasses({ light: 'text-gray-500 group-hover:text-purple-800', dark: 'text-gray-500 group-hover:text-purple-300' })}>
            {item.icon}
          </span>
        </span>

         {/* Label + description */}
         {!isCollapsed && (
           <span className="flex-1 min-w-0">
             <span className="block text-sm font-semibold leading-tight truncate">{item.label}</span>
             <span className={`block text-xs truncate leading-tight mt-0.5 ${isActive ? activeSubDesc : inactiveSubDesc}`}>
               {item.description}
             </span>
           </span>
         )}

        {/* Active arrow */}
        {isActive && !isCollapsed && (
          <svg className="w-3.5 h-3.5 text-white/60 shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>
    );
  };

  // ── Render submenu ──────────────────────────────────────────────────────────
  const renderSubmenu = (item) => {
    const isSubmenuActive = item.subItems.some(s => location.pathname === s.path);
    const isOpen = openSubmenus[item.label];

    return (
      <div key={item.label}>
        <button
          onClick={() => toggleSubmenu(item.label)}
          title={isCollapsed ? item.label : undefined}
          className={`group relative flex items-center w-full ${isCollapsed ? 'justify-center px-0' : 'px-2.5'} py-2.5 rounded-xl transition-all duration-150 ${isSubmenuActive ? activeItem : inactiveItem}`}
        >
          {isSubmenuActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/60 rounded-r-full" />
          )}

          {/* Icon */}
          <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${isCollapsed ? '' : 'mr-2.5'} ${isSubmenuActive ? activeIconBg : inactiveIconBg}`}>
            <span className={isSubmenuActive ? 'text-white' : conditionalClasses({ light: 'text-gray-500 group-hover:text-[#662d91]', dark: 'text-gray-500 group-hover:text-purple-300' })}>
              {item.icon}
            </span>
          </span>

          {/* Text */}
          {!isCollapsed && (
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-sm font-semibold leading-tight truncate">{item.label}</span>
              <span className={`block text-xs truncate leading-tight mt-0.5 ${isSubmenuActive ? activeSubDesc : inactiveSubDesc}`}>
                {item.description}
              </span>
            </span>
          )}

          {/* Chevron */}
          {!isCollapsed && (
            <svg
              className={`w-3.5 h-3.5 shrink-0 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${isSubmenuActive ? 'text-white/60' : conditionalClasses({ light: 'text-gray-400', dark: 'text-gray-600' })}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Submenu items */}
        {isOpen && !isCollapsed && (
          <div className="mt-1 ml-4 pl-3 space-y-0.5 border-l-2 border-dashed border-purple-500/20 dark:border-purple-800/30">
            {item.subItems.map((sub) => {
              const isSubActive = location.pathname === sub.path;
              return (
                <Link
                  key={sub.path}
                  to={sub.path}
                  onClick={closeMobileIfNeeded}
                  className={`group flex items-center px-2.5 py-2 rounded-lg transition-all duration-150 ${
                    isSubActive
                      ? conditionalClasses({ light: 'bg-[#f3ebff] text-[#662d91]', dark: 'bg-purple-900/30 text-purple-300' })
                      : conditionalClasses({ light: 'text-gray-500 hover:text-[#662d91] hover:bg-[#f8f3ff]', dark: 'text-gray-500 hover:text-purple-300 hover:bg-gray-800/60' })
                  }`}
                >
                   <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mr-2.5 transition-all duration-150 ${
                     isSubActive
                       ? conditionalClasses({ light: 'bg-purple-100', dark: 'bg-purple-800/30' })
                       : conditionalClasses({ light: 'bg-gray-100 group-hover:bg-purple-100', dark: 'bg-gray-800 group-hover:bg-gray-700' })
                   }`}>
                      <span className={`text-sm ${isSubActive ? conditionalClasses({ light: 'text-purple-800', dark: 'text-purple-300' }) : conditionalClasses({ light: 'text-gray-500 group-hover:text-purple-800', dark: 'text-gray-600 group-hover:text-purple-400' })}`}>
                        {sub.icon}
                      </span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate leading-tight">{sub.label}</span>
                      <span className={`block text-xs truncate leading-tight mt-0.5 ${isSubActive ? activeSubDesc : inactiveSubDesc}`}>
                        {sub.description}
                      </span>
                    </span>
                    {isSubActive && (
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${conditionalClasses({ light: 'bg-purple-600', dark: 'bg-purple-400' })}`} />
                    )}
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        w-72 ${isCollapsed ? 'lg:w-18' : 'lg:w-70'}
        elevation-floating transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${sidebarBg}
      `}>

        {/* ── Header ── */}
        <div className={`relative h-14 sm:h-16 flex items-center px-3 shrink-0 overflow-visible ${headerBg}`}>
          {/* Subtle background grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
           <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/4 -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex items-center justify-between w-full">
            {/* Brand */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/20 ${conditionalClasses({ light: 'bg-white/15 backdrop-blur-sm', dark: 'bg-white/10 backdrop-blur-sm' })}`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-white font-bold text-base leading-none tracking-tight">DuvyClass</p>
                  <p className="text-[10px] text-white/50 leading-none mt-1 tracking-[0.12em] uppercase font-medium">
                    Enterprise IT
                  </p>
                </div>
              )}
            </div>

            {/* Toggle buttons */}
            <button
              onClick={toggleSidebarCollapse}
              aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-all duration-150 shrink-0"
            >
              {isCollapsed ? <FaChevronRight className="w-3 h-3" /> : <FaChevronLeft className="w-3 h-3" />}
            </button>
            <button
              onClick={toggleSidebar}
              aria-label="Cerrar menú"
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-all duration-150 shrink-0"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* ── User card ── */}
        <div className={`px-3 py-3 shrink-0 ${conditionalClasses({ light: 'border-b border-gray-100', dark: 'border-b border-gray-800/60' })}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
               <div className={`relative w-10 h-10 bg-gradient-to-br ${badge.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-sm">{userInitial}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-950" />
              </div>
            </div>
          ) : (
            <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-900/60' })}`}>
              {/* Avatar */}
               <div className={`relative w-10 h-10 bg-gradient-to-br ${badge.gradient} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
                <span className="text-white font-bold text-sm">{userInitial}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-950" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between gap-1">
                   <p className={`text-sm font-bold truncate leading-tight ${conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' })}`}>
                     {userName}
                   </p>
                  <span className={`text-xs shrink-0 ${badge.iconColor}`}>{badge.icon}</span>
                </div>
                 {user?.email && (
                   <p className={`text-xs truncate leading-tight mt-0.5 ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                     {user.email}
                   </p>
                 )}
                   <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-gradient-to-r ${badge.gradient}`}>
                   {user?.role?.name || 'Empleado'}
                 </span>
               </div>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
          {/* Section label */}
           {!isCollapsed && (
             <p className={`text-xs font-bold uppercase tracking-[0.15em] px-2.5 pb-2 ${sectionLabel}`}>
               Navegación
             </p>
           )}

          {menuItems.map((item) =>
            item.type === 'submenu' ? renderSubmenu(item) : renderLink(item)
          )}
        </nav>

        {/* ── Footer ── */}
        <div className={`px-3 py-3 shrink-0 ${footerBg}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              {[
                { to: '/settings', title: 'Configuración', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { to: '/help', title: 'Centro de ayuda', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              ].map(({ to, title, icon }) => (
                <Link
                  key={to}
                  to={to}
                  title={title}
                  onClick={closeMobileIfNeeded}
                       className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 ${conditionalClasses({ light: 'text-gray-400 hover:text-purple-800 hover:bg-purple-50', dark: 'text-gray-400 hover:text-purple-300 hover:bg-gray-800' })}`}
                >
                  {icon}
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                 <div>
                   <p className="text-sm text-white/50 leading-none mt-1 tracking-[0.12em] uppercase font-medium">
                     Enterprise IT
                   </p>
                 </div>
                <div className="flex gap-1">
                  {[
                    { to: '/settings', title: 'Configuración', icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                    { to: '/help', title: 'Centro de ayuda', icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                  ].map(({ to, title, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      title={title}
                      onClick={closeMobileIfNeeded}
                       className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 ${conditionalClasses({ light: 'text-gray-400 hover:text-purple-800 hover:bg-purple-50', dark: 'text-gray-400 hover:text-purple-300 hover:bg-gray-800' })}`}
                    >
                      {icon}
                    </Link>
                  ))}
                </div>
              </div>
               <p className={`text-xs text-center ${conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' })}`}>
                 © 2026 Desarrollado por{' '}
                 <span className={`font-semibold ${conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-500' })}`}>
                   Bryan Muñoz
                 </span>
               </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
