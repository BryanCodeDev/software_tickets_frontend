import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCrown, FaWrench, FaUser, FaShieldAlt, FaClipboardList, FaUserShield, FaUserCog } from 'react-icons/fa';
import AuthContext from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isCalidadOpen, setIsCalidadOpen] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);

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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Inventario',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        description: 'Control de activos tecnológicos',
        subItems: [
          {
            path: '/inventory',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            ),
            label: 'Computadores',
            description: 'Inventario de equipos de cómputo'
          },
          {
            path: '/corporate-phones',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            ),
            label: 'Celulares Corporativos',
            description: 'Gestión de teléfonos corporativos'
          }
        ]
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
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
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
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
      },
      {
        path: '/roles',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        label: 'Roles',
        description: 'Gestión de roles y permisos'
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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Inventario',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        description: 'Control de activos tecnológicos',
        subItems: [
          {
            path: '/inventory',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            ),
            label: 'Computadores',
            description: 'Inventario de equipos de cómputo'
          },
          {
            path: '/corporate-phones',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            ),
            label: 'Celulares Corporativos',
            description: 'Gestión de teléfonos corporativos'
          }
        ]
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
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
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
          {
            path: '/documents',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            label: 'Documentos',
            description: 'Documentos públicos'
          },
          {
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
      }
    );
  } else if (role === 'Calidad') {
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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
          {
            path: '/documents',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            label: 'Documentos',
            description: 'Gestión de documentos de calidad'
          },
          {
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
      }
    );
  } else if (role === 'Coordinadora Administrativa') {
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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Inventario',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        description: 'Control de activos tecnológicos',
        subItems: [
          {
            path: '/inventory',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            ),
            label: 'Computadores',
            description: 'Inventario de equipos de cómputo'
          },
          {
            path: '/corporate-phones',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            ),
            label: 'Celulares Corporativos',
            description: 'Gestión de teléfonos corporativos'
          }
        ]
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
          {
            path: '/documents',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            label: 'Documentos',
            description: 'Documentos administrativos'
          },
          {
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
      }
    );
  } else if (role === 'Jefe') {
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
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
          {
            path: '/documents',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            label: 'Documentos',
            description: 'Documentos operativos'
          },
          {
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'
          }
        ]
      }
    );
  } else if (role === 'Compras') {
    menuItems.push(
      {
        path: '/purchase-requests',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        label: 'Solicitudes de Compra',
        description: 'Periféricos y electrodomésticos'
      },
      {
        type: 'submenu',
        label: 'Calidad',
        icon: <FaShieldAlt className="w-5 h-5" />,
        description: 'Gestión de calidad y documentación',
        subItems: [
          {
            path: '/documents',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            label: 'Documentos',
            description: 'Documentos de compras'
          },
          {
            path: '/ticket_calidad',
            icon: <FaClipboardList className="w-5 h-5" />,
            label: 'Ticket Calidad',
            description: 'Reportes de calidad y cambios documentales'      }
    ]
  }
);
}
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
      <div className="relative h-14 sm:h-16 flex items-center px-6 bg-linear-to-br from-[#662d91] via-[#7a3da8] to-[#8e4dbf] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-200 shrink-0">
              <span className="text-transparent bg-clip-text bg-linear-to-br from-[#662d91] to-[#7a3da8] font-bold text-lg sm:text-2xl">D</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate drop-shadow-lg">DuvyClass</h2>
              <p className="text-xs sm:text-sm text-[#e8d5f5] font-medium truncate">Gestión Tecnológica</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm shrink-0"
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
          if (item.type === 'submenu') {
            const isSubmenuActive = item.subItems.some(subItem => location.pathname === subItem.path);

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (item.label === 'Calidad') {
                      setIsCalidadOpen(!isCalidadOpen);
                    } else if (item.label === 'Inventario') {
                      setIsInventarioOpen(!isInventarioOpen);
                    }
                  }}
                  className={`
                    group relative flex items-center w-full px-3 py-3.5 rounded-xl transition-all duration-200
                    ${isSubmenuActive
                      ? 'bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white shadow-lg shadow-[#662d91]/30 scale-[1.02]'
                      : 'text-gray-700 hover:text-[#662d91] hover:bg-[#f3ebf9]'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isSubmenuActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg"></div>
                  )}

                  {/* Icon container */}
                  <div className={`
                    shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mr-3 transition-all duration-200
                    ${isSubmenuActive
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-linear-to-br from-gray-100 to-gray-50 group-hover:from-[#f3ebf9] group-hover:to-[#e8d5f5] group-hover:scale-110 shadow-sm'
                    }
                  `}>
                    <div className={`transition-colors ${isSubmenuActive ? 'text-white' : 'text-gray-600 group-hover:text-[#662d91]'}`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm truncate">{item.label}</span>
                    </div>
                    <p className={`text-xs truncate leading-tight ${isSubmenuActive ? 'text-[#e8d5f5]' : 'text-gray-500 group-hover:text-[#8e4dbf]'}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      (item.label === 'Calidad' && isCalidadOpen) || (item.label === 'Inventario' && isInventarioOpen) ? 'rotate-90' : ''
                    } ${isSubmenuActive ? 'text-white' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Submenu items */}
                {((item.label === 'Calidad' && isCalidadOpen) || (item.label === 'Inventario' && isInventarioOpen)) && (
                  <div className="ml-6 mt-1 space-y-1 animate-fade-in">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;

                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => {
                            if (window.innerWidth < 1024) {
                              toggleSidebar();
                            }
                          }}
                          className={`
                            group relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isSubActive
                              ? 'bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white shadow-md scale-[1.01]'
                              : 'text-gray-600 hover:text-[#662d91] hover:bg-[#f3ebf9]'
                            }
                          `}
                        >
                          {/* Active indicator bar */}
                          {isSubActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"></div>
                          )}

                          {/* Icon container */}
                          <div className={`
                            shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200
                            ${isSubActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 group-hover:bg-[#e8d5f5] group-hover:scale-105'
                            }
                          `}>
                            <div className={`transition-colors text-xs ${isSubActive ? 'text-white' : 'text-gray-500 group-hover:text-[#662d91]'}`}>
                              {subItem.icon}
                            </div>
                          </div>

                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm truncate">{subItem.label}</span>
                            <p className={`text-xs truncate leading-tight ${isSubActive ? 'text-[#e8d5f5]' : 'text-gray-400 group-hover:text-[#8e4dbf]'}`}>
                              {subItem.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

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
                  ? 'bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white shadow-lg shadow-[#662d91]/30 scale-[1.02]'
                  : 'text-gray-700 hover:text-[#662d91] hover:bg-[#f3ebf9]'
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
                  : 'bg-linear-to-br from-gray-100 to-gray-50 group-hover:from-[#f3ebf9] group-hover:to-[#e8d5f5] group-hover:scale-110 shadow-sm'
                }
              `}>
                <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#662d91]'}`}>
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
                        : 'bg-[#e8d5f5] text-[#662d91]'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate leading-tight ${isActive ? 'text-[#e8d5f5]' : 'text-gray-500 group-hover:text-[#8e4dbf]'}`}>
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
              className="p-2 rounded-lg text-gray-400 hover:text-[#662d91] hover:bg-[#f3ebf9] transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link
              to="/help"
              onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
              className="p-2 rounded-lg text-gray-400 hover:text-[#662d91] hover:bg-[#f3ebf9] transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
        
        <p className="text-xs text-center text-gray-400">
          © 2025 Desarrollado por <span className="font-semibold text-[#662d91]">Bryan Muñoz</span>
        </p>
      </div>
    </div>
  </aside>
</>
);
};
export default Sidebar;

