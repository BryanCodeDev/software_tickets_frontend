import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaTicketAlt, FaBox, FaFileAlt, FaKey, FaSearch, FaChartBar, FaSignInAlt, FaTachometerAlt, FaCog, FaUsers, FaShieldAlt, FaExclamationTriangle, FaLightbulb, FaHeadset, FaCrown, FaWrench, FaUser, FaGlobe, FaTimes, FaRocket, FaBullseye, FaLock, FaChartLine, FaBolt, FaCheck, FaClipboardList } from 'react-icons/fa';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const navigate = useNavigate();

  const faqs = [
    {
      question: '¿Cómo crear un nuevo ticket?',
      answer: 'Para crear un nuevo ticket, ve a la sección de Tickets y haz clic en "Nuevo Ticket". Completa la información requerida como título, descripción, prioridad y categoría.'
    },
    {
      question: '¿Cómo gestionar el inventario?',
      answer: 'En la sección de Inventario puedes agregar, editar y eliminar activos. Cada activo debe tener un código único, descripción y ubicación.'
    },
    {
      question: '¿Cómo subir documentos?',
      answer: 'Ve a la sección de Documentos y haz clic en "Subir Documento". Selecciona el archivo, añade una descripción y clasifícalo por categoría.'
    },
    {
      question: '¿Cómo acceder al repositorio?',
      answer: 'La sección de Repositorio contiene archivos compartidos. Puedes buscar por nombre, filtrar por categoría y descargar los archivos necesarios.'
    },
    {
      question: '¿Cómo cambiar mi contraseña?',
      answer: 'Ve a Configuración > Seguridad y haz clic en "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva contraseña.'
    },
    {
      question: '¿Cómo asignar un ticket a un técnico?',
      answer: 'Los administradores y técnicos pueden asignar tickets desde la vista de detalles del ticket. Selecciona el técnico apropiado del menú desplegable.'
    },
    {
      question: '¿Cómo ver los mensajes de un ticket?',
      answer: 'En la vista de detalles del ticket, puedes ver todos los mensajes enviados. Los empleados solo ven mensajes de sus propios tickets.'
    },
    {
      question: '¿Cómo editar un mensaje enviado?',
      answer: 'Haz clic en el botón de opciones (tres puntos) junto a tu mensaje y selecciona "Editar". Solo puedes editar tus propios mensajes.'
    },
    {
      question: '¿Cómo detectar automáticamente las especificaciones de mi PC?',
      answer: 'En el formulario de creación de inventario, haz clic en "Detectar PC" para que el sistema identifique automáticamente el serial, capacidad de disco, RAM y marca.'
    },
    {
      question: '¿Cómo filtrar tickets por título?',
      answer: 'En la sección de Tickets, usa el menú desplegable "Todos los títulos" para filtrar tickets por títulos estandarizados como "Problemas con SAMP" o "Problemas con impresoras".'
    },
    {
      question: '¿Cómo subir archivos adjuntos a un ticket?',
      answer: 'Al crear un ticket, puedes adjuntar archivos como imágenes, videos o documentos. El sistema valida el tipo y tamaño de archivo automáticamente.'
    },
    {
      question: '¿Cómo gestionar credenciales de sistemas?',
      answer: 'Los administradores pueden crear y gestionar credenciales desde la sección de Credenciales. Incluye servicios, usuarios, contraseñas y áreas correspondientes.'
    },
    {
      question: '¿Cómo acceder al módulo de teléfonos corporativos?',
      answer: 'En la barra lateral, haga clic en "Inventario" para desplegar el submenú. Desde ahí puede acceder a "Celulares Corporativos" para gestionar teléfonos asignados a empleados. Solo administradores, técnicos y coordinadores administrativos tienen acceso.'
    },
    {
      question: '¿Cómo gestionar teléfonos corporativos?',
      answer: 'Desde el módulo "Celulares Corporativos", puede ver todos los teléfonos organizados por categorías (Administración, Asesores, Socios, Reposición). Cada teléfono incluye información completa: número, plan, equipo, IMEI, fecha de entrega y responsable.'
    },
    {
      question: '¿Qué categorías existen en teléfonos corporativos?',
      answer: 'Los teléfonos se dividen en 4 categorías: Administración (directivos), Asesores (vendedores), Socios (familiares estratégicos) y Reposición (equipos repuestos por robo, cambio o daño).'
    },
    {
      question: '¿Cómo agregar un nuevo teléfono corporativo?',
      answer: 'Solo administradores pueden agregar teléfonos. Haga clic en "Nuevo Teléfono" en el módulo de Celulares Corporativos, complete la información del equipo y asigne a un responsable.'
    },
    {
      question: '¿Cómo asignar un equipo IT a un usuario?',
      answer: 'Al crear o editar un usuario, selecciona el código IT correspondiente del menú desplegable que muestra los equipos disponibles en el inventario.'
    },
    {
      question: '¿Cómo ver las estadísticas de tickets?',
      answer: 'En la sección de Tickets, verás tarjetas con estadísticas como total de tickets, abiertos, en progreso y resueltos.'
    },
    {
      question: '¿Cómo agregar comentarios a un ticket?',
      answer: 'En la vista de detalles del ticket, usa el campo de comentarios para agregar notas adicionales. Los comentarios son visibles para todos los usuarios con acceso.'
    },
    {
      question: '¿Cómo cambiar el estado de un ticket?',
      answer: 'Los técnicos y administradores pueden cambiar el estado del ticket (abierto, en progreso, resuelto, cerrado) desde la edición del ticket.'
    },
    {
      question: '¿Cómo buscar documentos por categoría?',
      answer: 'En la sección de Documentos, puedes filtrar documentos por tipo y categoría. Los documentos incluyen información de versión y fecha de expiración.'
    },
    {
      question: '¿Cómo ver las imágenes y videos adjuntos a un ticket?',
      answer: 'En la vista de detalles del ticket, las imágenes y videos aparecen en una sección dedicada donde puedes descargarlos o verlos directamente.'
    },
    {
      question: '¿Cómo gestionar usuarios del sistema?',
      answer: 'Los administradores pueden crear, editar y eliminar usuarios desde la sección de Usuarios. Asigna roles como Administrador, Técnico o Empleado.'
    },
    {
      question: '¿Cómo ver la información de garantía de un equipo?',
      answer: 'En el inventario, cada equipo muestra la fecha de expiración de garantía. Puedes editar esta información desde el formulario de edición.'
    },
    {
      question: '¿Cómo enviar mensajes en tiempo real en un ticket?',
      answer: 'En la vista de detalles del ticket, usa el campo de mensaje para enviar comunicaciones instantáneas. Los mensajes se actualizan automáticamente via WebSocket.'
    },
    {
      question: '¿Cómo crear títulos estandarizados para tickets?',
      answer: 'El sistema incluye títulos predefinidos como "Problemas con SAMP", "Problemas con impresoras", etc. Selecciona del menú desplegable al crear tickets.'
    },
    {
      question: '¿Cómo ver los permisos de cada rol?',
      answer: 'Empleados pueden crear tickets y ver los suyos. Técnicos pueden editar tickets asignados. Administradores tienen acceso completo a todas las funciones.'
    },
    {
      question: '¿Cómo eliminar un mensaje enviado?',
      answer: 'Haz clic en el botón de opciones junto a tu mensaje y selecciona "Eliminar". Solo puedes eliminar tus propios mensajes.'
    },
    {
      question: '¿Cómo asignar tickets a grupos?',
      answer: 'Al crear o editar tickets, puedes asignarlos a "Todos los Técnicos", "Todos los Administradores" o "Técnicos y Administradores" para distribución grupal.'
    },
    {
      question: '¿Cómo ver el historial de actualizaciones de un ticket?',
      answer: 'Cada ticket muestra fechas de creación y última actualización. Los cambios de estado y asignaciones se reflejan automáticamente.'
    },
    {
      question: '¿Cómo gestionar la ubicación de equipos?',
      answer: 'En el inventario, puedes especificar la ubicación de cada equipo (ej: "Oficina 101"). Esta información es editable desde el formulario de equipo.'
    },
    {
      question: '¿Cómo ver las notificaciones del sistema?',
      answer: 'Las notificaciones aparecen en la esquina superior derecha para confirmar acciones como creación, actualización o eliminación de elementos.'
    },
    {
      question: '¿Cómo usar la detección automática de hardware?',
      answer: 'Solo funciona en PCs Windows. Ejecuta la aplicación desde el equipo cuya información deseas detectar para obtener serial, RAM, capacidad y marca automáticamente.'
    },
    {
      question: '¿Cómo filtrar tickets por estado?',
      answer: 'Aunque no hay filtro directo por estado, puedes identificar tickets por colores: morado (abierto), azul (en progreso), gris (cerrado), índigo (resuelto).'
    },
    {
      question: '¿Cómo ver los archivos adjuntos en documentos?',
      answer: 'Los documentos subidos se almacenan en el servidor y puedes descargarlos directamente. Incluyen validación de tipos permitidos (PDF, Office, imágenes).'
    },
    {
      question: '¿Cómo gestionar roles de usuario?',
      answer: 'Los roles determinan permisos: Empleados crean tickets, Técnicos gestionan tickets asignados, Administradores tienen control total del sistema.'
    },
    {
      question: '¿Cómo ver la información del creador de un ticket?',
      answer: 'En la vista de detalles del ticket, se muestra quién creó el ticket, quién lo asignó y las fechas relevantes.'
    },
    {
      question: '¿Cómo usar el chat en tiempo real?',
      answer: 'El chat funciona via WebSocket. Únete automáticamente a la sala del ticket al abrir detalles. Los mensajes se sincronizan en tiempo real entre usuarios.'
    },
    {
      question: '¿Cómo ver estadísticas de inventario?',
      answer: 'El inventario muestra todos los equipos en tarjetas o tabla. Incluye filtros visuales por estado (disponible, en uso, mantenimiento, fuera de servicio).'
    },
    {
      question: '¿Cómo gestionar fechas de expiración de documentos?',
      answer: 'Al subir documentos, puedes especificar fecha de expiración. Esta información se muestra en la lista de documentos para seguimiento.'
    },
    {
      question: '¿Cómo ver las credenciales de sistemas?',
      answer: 'Solo administradores ven la sección de Credenciales. Las contraseñas pueden ocultarse/mostrarse individualmente por seguridad.'
    },
    {
      question: '¿Cómo asignar múltiples técnicos a un ticket?',
      answer: 'Actualmente el sistema asigna a un técnico individual, pero puedes usar asignaciones grupales para notificar a múltiples técnicos simultáneamente.'
    },
    {
      question: '¿Cómo ver el progreso de un ticket?',
      answer: 'Los tickets cambian de color según estado: morado (abierto), azul (en progreso), gris (cerrado). Los mensajes y comentarios muestran el progreso.'
    },
    {
      question: '¿Cómo gestionar categorías de documentos?',
      answer: 'Los documentos se clasifican por tipo (Manual, Política) y categoría (Recursos Humanos, etc.). Esta información facilita la búsqueda y organización.'
    },
    {
      question: '¿Cómo ver los equipos asignados a usuarios?',
      answer: 'En la gestión de usuarios, puedes ver qué código IT está asignado a cada usuario, incluyendo el área correspondiente del equipo.'
    },
    {
      question: '¿Cómo usar las notificaciones de confirmación?',
      answer: 'Antes de eliminar elementos importantes, el sistema muestra diálogos de confirmación para prevenir acciones accidentales.'
    },
    {
      question: '¿Cómo ver el tamaño de archivos adjuntos?',
      answer: 'Los archivos adjuntos muestran su tamaño en MB. El sistema limita a 10MB por archivo y valida tipos permitidos.'
    },
    {
      question: '¿Cómo gestionar la información de contacto?',
      answer: 'La información de contacto incluye email y teléfono de soporte. Está disponible en la sección de Ayuda para consultas adicionales.'
    },
    {
      question: '¿Cómo acceder al módulo de Calidad?',
      answer: 'En la barra lateral, haga clic en "Calidad" para desplegar el submenú. Desde ahí puede acceder a "Documentos" para gestión documental y "Ticket Calidad" para reportes de calidad y cambios documentales.'
    },
    {
      question: '¿Cómo crear tickets de calidad?',
      answer: 'Desde el módulo "Ticket Calidad", haga clic en "Nuevo Ticket Calidad". Complete información sobre problemas en documentación, cambios de versiones, errores en procedimientos o actualizaciones de calidad.'
    },
    {
      question: '¿Cómo funcionan los permisos específicos por carpeta?',
      answer: 'Los empleados pueden tener permisos de solo lectura en una carpeta y permisos de escritura en otra. El botón de "Nuevo Documento" se activa automáticamente según los permisos de la carpeta actual, pero los empleados no pueden crear carpetas (solo administradores y técnicos).'
    },
    {
      question: '¿Cómo gestionar permisos en documentos y carpetas?',
      answer: 'Los administradores pueden asignar permisos específicos a usuarios en documentos o carpetas. Haga clic en el botón de opciones de un elemento y seleccione "Gestionar Permisos" para otorgar o revocar accesos.'
    },
    {
      question: '¿Qué tipos de problemas se reportan en tickets de calidad?',
      answer: 'Los tickets de calidad incluyen: problemas en documentación, cambios de versiones documentales, errores en procedimientos, actualizaciones de calidad, reportes de no conformidades, mejoras en procesos documentales, problemas con versiones de software, cambios en políticas de calidad, errores en manuales, actualizaciones de estándares, problemas con certificaciones y cambios en documentación técnica.'
    },
    {
      question: '¿Qué es el rol de Calidad?',
      answer: 'El rol de Calidad es un usuario especializado que tiene acceso limitado general pero control administrativo completo sobre los módulos de calidad y documentación. Puede crear tickets de calidad, gestionar todos los tickets de calidad existentes, acceder completamente al módulo de documentos (crear carpetas, editar cualquier documento, eliminar documentos), pero no tiene acceso a inventario, credenciales, gestión de usuarios ni configuración del sistema.'
    }
  ];

  const contactInfo = [
    {
      type: 'Email',
      value: 'asistentesistemas@duvyclass.co',
      icon: <FaEnvelope className="text-purple-600" />,
      description: 'Envíanos un correo para soporte técnico'
    },
    {
      type: 'Dirección',
      value: 'Kilómetro 3.5 vía Funza - Siberia\nParque Industrial Galicia\nManzana D, Bodegas 2 y 3',
      icon: <FaPhone className="text-purple-600" />,
      description: 'Nuestra ubicación física'
    },
    {
      type: 'PBX',
      value: '(57) 601-821 6565',
      icon: <FaPhone className="text-purple-600" />,
      description: 'Línea principal de la empresa'
    },
    {
      type: 'Sitio Web',
      value: 'www.duvyclass.com',
      icon: <FaPhone className="text-purple-600" />,
      description: 'Visita nuestro sitio web oficial'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
        <p className="text-base sm:text-lg text-gray-600">Encuentra respuestas y recursos para usar la plataforma</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contact'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Contacto
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manual de Usuario
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <FaQuestionCircle className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-purple-600">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}


          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <FaPhone className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Contacto y Soporte</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {contact.icon}
                      <h3 className="font-medium text-gray-900 ml-2">{contact.type}</h3>
                    </div>
                    <p className="text-purple-600 font-medium mb-1 whitespace-pre-line">{contact.value}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-purple-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">¿No encuentras lo que buscas?</h3>
                <p className="text-gray-600 mb-4">
                  Si tienes alguna pregunta específica o necesitas ayuda con algo en particular,
                  no dudes en contactarnos. Nuestro equipo de soporte está aquí para ayudarte.
                </p>
                <button
                  onClick={() => navigate('/tickets')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Crear Ticket de Soporte
                </button>
              </div>
            </div>
          )}

          {/* Manual Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <FaBook className="text-purple-600 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Manual de Usuario</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold">Manual de Usuario - DuvyClass</h3>
                  <p className="text-sm opacity-90">Sistema IT de Gestión Tecnológica</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-purple-600 mr-2" />
                      Introducción
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <p className="mb-3">DuvyClass es una plataforma web integral para la gestión tecnológica de empresas, centralizando procesos de soporte técnico, inventario IT, documentación y credenciales en una interfaz moderna, segura y eficiente.</p>
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <h5 className="font-medium text-blue-900 mb-1">¿Qué es DuvyClass?</h5>
                        <p>Permite gestionar recursos tecnológicos, soporte, documentación y credenciales en un solo lugar, combinando múltiples módulos en una aplicación integrada.</p>
                      </div>
                      <h5 className="font-medium mb-2">Beneficios Principales</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Centralización completa</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Eficiencia operativa</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Seguridad avanzada</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Trazabilidad total</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Colaboración en tiempo real</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm">Accesibilidad universal</span>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-purple-600 mr-2" />
                      Características Principales
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h6 className="font-medium text-purple-900 mb-2 flex items-center">
                            <FaTicketAlt className="text-purple-600 mr-2" />
                            Mesa de Ayuda
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Creación y seguimiento de tickets</li>
                            <li>• Asignación automática por categoría</li>
                            <li>• Sistema de comentarios y adjuntos</li>
                            <li>• Historial completo de acciones</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h6 className="font-medium text-blue-900 mb-2 flex items-center">
                            <FaBox className="text-blue-600 mr-2" />
                            Inventario IT
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Registro de activos tecnológicos</li>
                            <li>• Asignaciones por usuario y área</li>
                            <li>• Control de estados y garantías</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h6 className="font-medium text-green-900 mb-2 flex items-center">
                            <FaFileAlt className="text-green-600 mr-2" />
                            Repositorio Documental
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Almacenamiento centralizado</li>
                            <li>• Control de versiones</li>
                            <li>• Clasificación por categorías</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <h6 className="font-medium text-yellow-900 mb-2 flex items-center">
                            <FaKey className="text-yellow-600 mr-2" />
                            Gestión de Credenciales
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Almacenamiento seguro</li>
                            <li>• Acceso restringido por roles</li>
                            <li>• Registro de auditoría</li>
                          </ul>
                        </div>
                        <div className="bg-pink-50 p-3 rounded-lg">
                          <h6 className="font-medium text-pink-900 mb-2 flex items-center">
                            <FaPhone className="text-pink-600 mr-2" />
                            Teléfonos Corporativos
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Gestión de equipos móviles</li>
                            <li>• 4 categorías organizadas</li>
                            <li>• Control de asignaciones</li>
                            <li>• Seguimiento de IMEI y planes</li>
                          </ul>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <h6 className="font-medium text-indigo-900 mb-2 flex items-center">
                            <FaSearch className="text-indigo-600 mr-2" />
                            Búsqueda Global
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Buscador unificado</li>
                            <li>• Filtros automáticos</li>
                            <li>• Resultados categorizados</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <h6 className="font-medium text-orange-900 mb-2 flex items-center">
                            <FaShieldAlt className="text-orange-600 mr-2" />
                            Gestión de Calidad
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Tickets especializados en calidad</li>
                            <li>• Control documental avanzado</li>
                            <li>• Reportes de no conformidades</li>
                            <li>• Seguimiento de versiones</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h6 className="font-medium text-red-900 mb-2 flex items-center">
                            <FaChartBar className="text-red-600 mr-2" />
                            Reportes
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Exportación CSV</li>
                            <li>• Filtros por permisos</li>
                            <li>• Compatible con Excel</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-purple-600 mr-2" />
                      Requisitos del Sistema
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-green-700"><FaCheck className="text-green-600" /> Requisitos Mínimos</h6>
                          <ul className="text-sm space-y-1">
                            <li>• Navegador: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
                            <li>• Conexión: Internet banda ancha</li>
                            <li>• Resolución: 1024x768 píxeles mínimo</li>
                            <li>• SO: Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-blue-700">⭐ Requisitos Recomendados</h6>
                          <ul className="text-sm space-y-1">
                            <li>• Navegador: Chrome 100+ o Firefox 95+</li>
                            <li>• Conexión: Internet de alta velocidad</li>
                            <li>• Resolución: 1920x1080 píxeles</li>
                            <li>• RAM: 4GB mínimo</li>
                            <li>• Procesador: Dual-core 2.5GHz+</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h6 className="font-medium mb-2 text-purple-700 flex items-center"><FaGlobe className="text-purple-700 mr-2" /> Navegadores Soportados</h6>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="bg-green-100 p-2 rounded-lg text-center">
                            <div className="font-medium text-green-800">Chrome</div>
                            <div className="text-xs text-green-600">(Recomendado)</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-lg text-center">
                            <div className="font-medium text-blue-800">Firefox</div>
                            <div className="text-xs text-blue-600">88+</div>
                          </div>
                          <div className="bg-gray-100 p-2 rounded-lg text-center">
                            <div className="font-medium text-gray-800">Safari</div>
                            <div className="text-xs text-gray-600">14+</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-lg text-center">
                            <div className="font-medium text-blue-800">Edge</div>
                            <div className="text-xs text-blue-600">90+</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-red-600 flex items-center">
                          <FaTimes className="text-red-600 mr-2" /> Internet Explorer no está soportado
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaShieldAlt className="text-purple-600 mr-2" />
                      Roles y Permisos
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="mb-4">
                        <p className="text-sm mb-4">El sistema cuenta con tres roles principales que determinan los permisos y accesos de cada usuario. A continuación se detalla qué puede hacer cada rol en cada módulo del sistema.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <h6 className="font-bold text-red-900 mb-3 flex items-center">
                            <FaCrown className="text-red-600 mr-2" />
                            Administrador (Nivel 4 - Acceso Total)
                          </h6>
                          <p className="text-sm mb-3 text-red-800">Los administradores tienen control completo sobre todo el sistema y pueden gestionar usuarios, configuración y todos los módulos sin restricciones.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaTicketAlt className="text-red-600 mr-2" />
                                Mesa de Ayuda (Tickets)
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los tickets del sistema</li>
                                <li><FaCheck className="text-green-600" /> Crear tickets en nombre de cualquier usuario</li>
                                <li><FaCheck className="text-green-600" /> Asignar tickets a cualquier técnico</li>
                                <li><FaCheck className="text-green-600" /> Actualizar estado de cualquier ticket</li>
                                <li><FaCheck className="text-green-600" /> Agregar comentarios internos y públicos</li>
                                <li><FaCheck className="text-green-600" /> Subir adjuntos a cualquier ticket</li>
                                <li><FaCheck className="text-green-600" /> Eliminar tickets y comentarios</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes completos de tickets</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-red-600 mr-2" />
                                Inventario IT
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los equipos del inventario</li>
                                <li><FaCheck className="text-green-600" /> Registrar nuevos equipos</li>
                                <li><FaCheck className="text-green-600" /> Editar información de cualquier equipo</li>
                                <li><FaCheck className="text-green-600" /> Asignar equipos a cualquier usuario</li>
                                <li><FaCheck className="text-green-600" /> Cambiar estados de equipos</li>
                                <li><FaCheck className="text-green-600" /> Eliminar equipos del inventario</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de inventario</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaFileAlt className="text-red-600 mr-2" />
                                Control de Versiones de Documentos
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los documentos activos</li>
                                <li><FaCheck className="text-green-600" /> Subir documentos nuevos y nuevas versiones</li>
                                <li><FaCheck className="text-green-600" /> Editar metadatos de cualquier documento</li>
                                <li><FaCheck className="text-green-600" /> Eliminar cualquier documento o versión del historial</li>
                                <li><FaCheck className="text-green-600" /> Ver historial completo de versiones</li>
                                <li><FaCheck className="text-green-600" /> Descargar cualquier versión específica</li>
                                <li><FaCheck className="text-green-600" /> Control total sobre permisos documentales</li>
                                <li><FaCheck className="text-green-600" /> Búsqueda avanzada completa</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de documentos</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaShieldAlt className="text-red-600 mr-2" />
                                Gestión de Calidad
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Acceso completo al módulo de calidad</li>
                                <li><FaCheck className="text-green-600" /> Crear y gestionar tickets de calidad</li>
                                <li><FaCheck className="text-green-600" /> Reportes de no conformidades y problemas documentales</li>
                                <li><FaCheck className="text-green-600" /> Seguimiento de cambios de versiones</li>
                                <li><FaCheck className="text-green-600" /> Control total sobre procesos de calidad</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaKey className="text-red-600 mr-2" />
                                Gestión de Credenciales
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todas las credenciales del sistema</li>
                                <li><FaCheck className="text-green-600" /> Crear nuevas credenciales</li>
                                <li><FaCheck className="text-green-600" /> Editar cualquier credencial</li>
                                <li><FaCheck className="text-green-600" /> Eliminar credenciales</li>
                                <li><FaCheck className="text-green-600" /> Acceso a contraseñas en texto plano</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de credenciales</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaUsers className="text-red-600 mr-2" />
                                Gestión de Usuarios
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los usuarios del sistema</li>
                                <li><FaCheck className="text-green-600" /> Crear nuevos usuarios</li>
                                <li><FaCheck className="text-green-600" /> Editar información de cualquier usuario</li>
                                <li><FaCheck className="text-green-600" /> Cambiar roles y permisos</li>
                                <li><FaCheck className="text-green-600" /> Activar/desactivar cuentas</li>
                                <li><FaCheck className="text-green-600" /> Resetear contraseñas</li>
                                <li><FaCheck className="text-green-600" /> Eliminar usuarios</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaSearch className="text-red-600 mr-2" />
                                Búsqueda Global y Reportes
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Búsqueda en todos los módulos sin restricciones</li>
                                <li><FaCheck className="text-green-600" /> Acceso a todos los resultados</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de todos los módulos</li>
                                <li><FaCheck className="text-green-600" /> Acceder a configuración del sistema</li>
                                <li><FaCheck className="text-green-600" /> Ver logs de auditoría completos</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <h6 className="font-bold text-blue-900 mb-3 flex items-center">
                            <FaWrench className="text-blue-600 mr-2" />
                            Técnico (Nivel 2 - Soporte Especializado)
                          </h6>
                          <p className="text-sm mb-3 text-blue-800">Los técnicos pueden gestionar tickets asignados, inventario bajo su responsabilidad y documentos técnicos, pero tienen acceso limitado a gestión de usuarios y credenciales.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaTicketAlt className="text-blue-600 mr-2" />
                                Mesa de Ayuda (Tickets)
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver tickets asignados personalmente</li>
                                <li><FaCheck className="text-green-600" /> Ver tickets sin asignar para auto-asignación</li>
                                <li><FaCheck className="text-green-600" /> Actualizar estado de tickets asignados</li>
                                <li><FaCheck className="text-green-600" /> Agregar comentarios técnicos internos</li>
                                <li><FaCheck className="text-green-600" /> Subir adjuntos técnicos (capturas, logs)</li>
                                <li><FaCheck className="text-green-600" /> Comunicar con usuarios finales</li>
                                <li><FaTimes className="text-red-600" /> No puede asignar tickets a otros técnicos</li>
                                <li><FaTimes className="text-red-600" /> No puede eliminar tickets</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-blue-600 mr-2" />
                                Inventario IT
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los equipos del inventario</li>
                                <li><FaCheck className="text-green-600" /> Registrar nuevos equipos</li>
                                <li><FaCheck className="text-green-600" /> Editar equipos bajo su responsabilidad</li>
                                <li><FaCheck className="text-green-600" /> Actualizar estados de equipos</li>
                                <li><FaCheck className="text-green-600" /> Asignar equipos a usuarios</li>
                                <li><FaTimes className="text-red-600" /> No puede eliminar equipos del inventario</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaFileAlt className="text-blue-600 mr-2" />
                                Control de Versiones de Documentos
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver documentos activos</li>
                                <li><FaCheck className="text-green-600" /> Subir documentos nuevos (manuales, guías técnicas)</li>
                                <li><FaCheck className="text-green-600" /> Subir nuevas versiones de documentos técnicos</li>
                                <li><FaCheck className="text-green-600" /> Editar documentos creados por sí mismo</li>
                                <li><FaCheck className="text-green-600" /> Ver historial completo de versiones</li>
                                <li><FaCheck className="text-green-600" /> Descargar cualquier versión</li>
                                <li><FaCheck className="text-green-600" /> Búsqueda avanzada disponible</li>
                                <li><FaTimes className="text-red-600" /> No puede editar documentos de otros usuarios</li>
                                <li><FaTimes className="text-red-600" /> No puede eliminar documentos del sistema</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaKey className="text-blue-600 mr-2" />
                                Gestión de Credenciales
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todas las credenciales del sistema</li>
                                <li><FaCheck className="text-green-600" /> Crear nuevas credenciales</li>
                                <li><FaCheck className="text-green-600" /> Editar credenciales existentes</li>
                                <li><FaTimes className="text-red-600" /> No puede eliminar credenciales</li>
                                <li><FaCheck className="text-green-600" /> Acceso a contraseñas en texto plano</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaUsers className="text-blue-600 mr-2" />
                                Gestión de Usuarios
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso a gestión de usuarios</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaSearch className="text-blue-600 mr-2" />
                                Búsqueda Global y Reportes
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Búsqueda limitada a tickets asignados e inventario</li>
                                <li><FaCheck className="text-green-600" /> Acceso a resultados de documentos públicos</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de tickets asignados</li>
                                <li><FaCheck className="text-green-600" /> Generar reportes de inventario</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaShieldAlt className="text-blue-600 mr-2" />
                                Gestión de Calidad
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Acceso al módulo de calidad</li>
                                <li><FaCheck className="text-green-600" /> Gestionar tickets de calidad asignados</li>
                                <li><FaCheck className="text-green-600" /> Reportes técnicos de calidad</li>
                                <li><FaCheck className="text-green-600" /> Seguimiento de procesos documentales</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                          <h6 className="font-bold text-orange-900 mb-3 flex items-center">
                            <FaClipboardList className="text-orange-600 mr-2" />
                            Coordinador de Compras (Nivel 3 - Gestión de Compras)
                          </h6>
                          <p className="text-sm mb-3 text-orange-800">Los coordinadores de compras gestionan las solicitudes iniciales de compra y aprueban las primeras etapas del proceso de adquisiciones.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-orange-600 mr-2" />
                                Solicitudes de Compra
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todas las solicitudes de compra</li>
                                <li><FaCheck className="text-green-600" /> Aprobar solicitudes iniciales</li>
                                <li><FaCheck className="text-green-600" /> Gestionar estados de aprobación inicial</li>
                                <li><FaCheck className="text-green-600" /> Comunicar con solicitantes</li>
                                <li><FaTimes className="text-red-600" /> No puede aprobar compras finales</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <h6 className="font-bold text-red-900 mb-3 flex items-center">
                            <FaCrown className="text-red-600 mr-2" />
                            Director de Compras (Nivel 4 - Dirección de Compras)
                          </h6>
                          <p className="text-sm mb-3 text-red-800">Los directores de compras tienen autoridad final para aprobar todas las solicitudes de compra y gestionar proveedores.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-red-600 mr-2" />
                                Solicitudes de Compra
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todas las solicitudes de compra</li>
                                <li><FaCheck className="text-green-600" /> Aprobar solicitudes finales</li>
                                <li><FaCheck className="text-green-600" /> Gestionar proveedores y contratos</li>
                                <li><FaCheck className="text-green-600" /> Autoridad completa en proceso de compras</li>
                                <li><FaCheck className="text-green-600" /> Reportes completos de adquisiciones</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <h6 className="font-bold text-purple-900 mb-3 flex items-center">
                            <FaShieldAlt className="text-purple-600 mr-2" />
                            Calidad (Nivel 3 - Gestión de Calidad)
                          </h6>
                          <p className="text-sm mb-3 text-purple-800">Los usuarios de calidad tienen acceso limitado general pero control administrativo completo sobre los módulos de calidad y documentación.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaTicketAlt className="text-purple-600 mr-2" />
                                Mesa de Ayuda (Tickets)
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Crear tickets propios</li>
                                <li><FaCheck className="text-green-600" /> Ver todos los tickets del sistema</li>
                                <li><FaCheck className="text-green-600" /> Editar cualquier ticket de calidad</li>
                                <li><FaCheck className="text-green-600" /> Eliminar tickets de calidad</li>
                                <li><FaCheck className="text-green-600" /> Gestionar estados y asignaciones</li>
                                <li><FaCheck className="text-green-600" /> Acceso completo a tickets de calidad</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaFileAlt className="text-purple-600 mr-2" />
                                Control de Versiones de Documentos
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver todos los documentos activos</li>
                                <li><FaCheck className="text-green-600" /> Subir documentos nuevos y versiones</li>
                                <li><FaCheck className="text-green-600" /> Editar cualquier documento</li>
                                <li><FaCheck className="text-green-600" /> Eliminar documentos del sistema</li>
                                <li><FaCheck className="text-green-600" /> Ver historial completo de versiones</li>
                                <li><FaCheck className="text-green-600" /> Control total sobre permisos documentales</li>
                                <li><FaCheck className="text-green-600" /> Crear y gestionar carpetas</li>
                                <li><FaCheck className="text-green-600" /> Acceso administrativo en documentos</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaShieldAlt className="text-purple-600 mr-2" />
                                Gestión de Calidad
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Acceso completo al módulo de calidad</li>
                                <li><FaCheck className="text-green-600" /> Gestionar todos los tickets de calidad</li>
                                <li><FaCheck className="text-green-600" /> Reportes de no conformidades</li>
                                <li><FaCheck className="text-green-600" /> Seguimiento de procesos documentales</li>
                                <li><FaCheck className="text-green-600" /> Control administrativo de calidad</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-purple-600 mr-2" />
                                Inventario IT
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso al módulo de inventario</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaKey className="text-purple-600 mr-2" />
                                Gestión de Credenciales
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso al módulo de credenciales</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaUsers className="text-purple-600 mr-2" />
                                Gestión de Usuarios
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso a gestión de usuarios</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h6 className="font-bold text-green-900 mb-3 flex items-center">
                            <FaUser className="text-green-600 mr-2" />
                            Empleado (Nivel 1 - Usuario Final)
                          </h6>
                          <p className="text-sm mb-3 text-green-800">Los empleados tienen acceso limitado principalmente para crear y seguir sus propios tickets, con permisos de solo lectura en la mayoría de módulos.</p>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaTicketAlt className="text-green-600 mr-2" />
                                Mesa de Ayuda (Tickets)
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Crear tickets propios</li>
                                <li><FaCheck className="text-green-600" /> Ver solo tickets creados por sí mismo</li>
                                <li><FaCheck className="text-green-600" /> Agregar comentarios públicos a sus tickets</li>
                                <li><FaCheck className="text-green-600" /> Subir adjuntos a sus propios tickets</li>
                                <li><FaCheck className="text-green-600" /> Seguir estado de sus tickets</li>
                                <li><FaTimes className="text-red-600" /> No puede ver tickets de otros usuarios</li>
                                <li><FaTimes className="text-red-600" /> No puede agregar comentarios internos</li>
                                <li><FaTimes className="text-red-600" /> No puede actualizar estados de tickets</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaBox className="text-green-600 mr-2" />
                                Inventario IT
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso al módulo de inventario</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaFileAlt className="text-green-600 mr-2" />
                                Control de Versiones de Documentos
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Ver documentos activos (solo lectura)</li>
                                <li><FaCheck className="text-green-600" /> Subir documentos nuevos (solo personales)</li>
                                <li><FaCheck className="text-green-600" /> Historial limitado (solo versiones activas)</li>
                                <li><FaCheck className="text-green-600" /> Descargar versiones activas</li>
                                <li><FaCheck className="text-green-600" /> Búsqueda básica por título y descripción</li>
                                <li><FaTimes className="text-red-600" /> No puede subir nuevas versiones de documentos existentes</li>
                                <li><FaTimes className="text-red-600" /> No puede editar ningún documento</li>
                                <li><FaTimes className="text-red-600" /> No puede eliminar documentos</li>
                                <li><FaTimes className="text-red-600" /> No puede ver historial completo de versiones</li>
                                <li><FaTimes className="text-red-600" /> Sin acceso a filtros avanzados</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaKey className="text-green-600 mr-2" />
                                Gestión de Credenciales
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso al módulo de credenciales</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaUsers className="text-green-600 mr-2" />
                                Gestión de Usuarios
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaTimes className="text-red-600" /> Sin acceso a gestión de usuarios</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaSearch className="text-green-600 mr-2" />
                                Búsqueda Global y Reportes
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Búsqueda limitada a sus propios tickets</li>
                                <li><FaCheck className="text-green-600" /> Acceso a documentos públicos únicamente</li>
                                <li><FaTimes className="text-red-600" /> Sin acceso a generación de reportes</li>
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <h7 className="font-medium text-sm mb-2 flex items-center">
                                <FaShieldAlt className="text-green-600 mr-2" />
                                Gestión de Calidad
                              </h7>
                              <ul className="text-xs space-y-1 ml-6">
                                <li><FaCheck className="text-green-600" /> Acceso al módulo de calidad</li>
                                <li><FaCheck className="text-green-600" /> Crear tickets de calidad propios</li>
                                <li><FaCheck className="text-green-600" /> Reportar problemas documentales</li>
                                <li><FaCheck className="text-green-600" /> Permisos específicos por carpeta</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3 flex items-center"><FaChartBar className="text-gray-900 mr-2" /> Resumen de Permisos por Módulo</h6>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 p-2 text-left">Funcionalidad</th>
                                  <th className="border border-gray-300 p-2 text-center">Administrador</th>
                                  <th className="border border-gray-300 p-2 text-center">Técnico</th>
                                  <th className="border border-gray-300 p-2 text-center">Coordinador<br/>Compras</th>
                                  <th className="border border-gray-300 p-2 text-center">Director<br/>Compras</th>
                                  <th className="border border-gray-300 p-2 text-center">Calidad</th>
                                  <th className="border border-gray-300 p-2 text-center">Empleado</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Ver Todos los Tickets</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Crear Tickets</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Editar Cualquier Ticket</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (asignados)</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Ver Solicitudes de Compra</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Aprobar Solicitudes de Compra</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (inicial)</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Ver Inventario Completo</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Editar Inventario</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Ver Todos los Documentos</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (activos)</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Subir Nuevos Documentos</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Subir Nuevas Versiones</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Editar Cualquier Documento</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (propios)</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Eliminar Documentos</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Ver Historial de Versiones</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Acceso a Credenciales</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /> (sin eliminar)</td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Gestión de Usuarios</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Reportes Completos</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (limitados)</td>
                                  <td className="border border-gray-300 p-2 text-center text-yellow-600">⚠️ (calidad)</td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Permisos Específicos por Carpeta</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="border border-gray-300 p-2 font-medium">Módulo de Calidad</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Teléfonos Corporativos</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-300 p-2 font-medium">Configuración del Sistema</td>
                                  <td className="border border-gray-300 p-2 text-center text-green-600"><FaCheck className="text-green-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                  <td className="border border-gray-300 p-2 text-center text-red-600"><FaTimes className="text-red-600" /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaLightbulb className="text-purple-600 mr-2" />
                      Primeros Pasos
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-medium text-blue-900 mb-2 flex items-center"><FaRocket className="text-blue-600 mr-2" /> Instalación y Configuración</h6>
                          <p className="text-sm mb-2">DuvyClass es una aplicación web, por lo que no requiere instalación en su dispositivo local. Solo necesita:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Un navegador web moderno</li>
                            <li>• Acceso a internet</li>
                            <li>• Las credenciales de acceso proporcionadas por su administrador</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h6 className="font-medium text-green-900 mb-2 flex items-center"><FaBullseye className="text-green-600 mr-2" /> Acceso Inicial al Sistema</h6>
                          <ol className="text-sm space-y-1 list-decimal list-inside">
                            <li>Abra su navegador web</li>
                            <li>Navegue a la URL proporcionada por su administrador</li>
                            <li>Ingrese sus credenciales de usuario (usuario y contraseña)</li>
                            <li>Haga clic en "Iniciar Sesión"</li>
                            <li>Será redirigido al Dashboard principal</li>
                          </ol>
                        </div>


                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h6 className="font-medium text-purple-900 mb-2 flex items-center"><FaLock className="text-purple-600 mr-2" /> Cambio de Contraseña Inicial</h6>
                          <p className="text-sm mb-2">Después del primer acceso, se recomienda cambiar la contraseña por defecto:</p>
                          <ol className="text-sm space-y-1 list-decimal list-inside">
                            <li>Vaya a <strong>Perfil</strong> en la barra lateral</li>
                            <li>Seleccione <strong>Cambiar Contraseña</strong></li>
                            <li>Ingrese la contraseña actual y la nueva</li>
                            <li>Confirme el cambio</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-purple-600 mr-2" />
                      Guía de Uso
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-medium text-blue-900 mb-3 flex items-center">
                            <FaSignInAlt className="text-blue-600 mr-2" />
                            Acceso al Sistema
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Inicio de Sesión</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Navegue a la URL proporcionada por su administrador</li>
                                <li>Ingrese su nombre de usuario y contraseña</li>
                                <li>Si está habilitado, ingrese el código del autenticador 2FA</li>
                                <li>Haga clic en "Iniciar Sesión"</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Recuperación de Contraseña</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>En la pantalla de login, haga clic en "¿Olvidó su contraseña?"</li>
                                <li>Ingrese su dirección de email</li>
                                <li>Recibirá un enlace para restablecer la contraseña</li>
                                <li>Siga las instrucciones del email</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Cierre de Sesión</h7>
                              <p className="text-sm ml-4">Haga clic en su nombre en la esquina superior derecha y seleccione "Cerrar Sesión"</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h6 className="font-medium text-green-900 mb-3 flex items-center">
                            <FaTachometerAlt className="text-green-600 mr-2" />
                            Dashboard
                          </h6>
                          <p className="text-sm mb-2">El dashboard es la página principal que muestra una visión general del sistema.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded border">
                              <div className="font-medium text-sm mb-1 flex items-center"><FaChartBar className="text-green-600 mr-2" /> Estadísticas Generales</div>
                              <div className="text-xs">Número total de tickets, equipos, documentos y usuarios</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="font-medium text-sm mb-1 flex items-center"><FaChartLine className="text-green-600 mr-2" /> Estado de Tickets</div>
                              <div className="text-xs">Gráfico de distribución por estados</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="font-medium text-sm mb-1 flex items-center"><FaBolt className="text-green-600 mr-2" /> Actividad Reciente</div>
                              <div className="text-xs">Últimas acciones realizadas en el sistema</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="font-medium text-sm mb-1 flex items-center"><FaRocket className="text-green-600 mr-2" /> Accesos Rápidos</div>
                              <div className="text-xs">Botones para crear tickets o acceder a módulos</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h6 className="font-medium text-purple-900 mb-3 flex items-center">
                            <FaTicketAlt className="text-purple-600 mr-2" />
                            Gestión de Tickets
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Creación de Tickets</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Tickets" en la barra lateral</li>
                                <li>Haga clic en "Nuevo Ticket"</li>
                                <li>Complete el formulario: título, descripción, categoría, prioridad</li>
                                <li>Adjunte archivos si es necesario (imágenes, documentos)</li>
                                <li>Haga clic en "Crear Ticket"</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Estados de Tickets</h7>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-4">
                                <div className="bg-purple-200 p-2 rounded text-xs text-center">Abierto</div>
                                <div className="bg-blue-200 p-2 rounded text-xs text-center">En Progreso</div>
                                <div className="bg-gray-200 p-2 rounded text-xs text-center">Cerrado</div>
                                <div className="bg-indigo-200 p-2 rounded text-xs text-center">Resuelto</div>
                              </div>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Comunicación en Tickets</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Comentarios: Notas internas visibles solo para técnicos</li>
                                <li>• Mensajes: Comunicación con el usuario que creó el ticket</li>
                                <li>• Adjuntos: Archivos relacionados con el ticket</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h6 className="font-medium text-yellow-900 mb-3 flex items-center">
                            <FaBox className="text-yellow-600 mr-2" />
                            Inventario IT
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Visualización del Inventario</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Inventario" en la barra lateral</li>
                                <li>Verá todos los equipos registrados en tarjetas o tabla</li>
                                <li>Use filtros por estado, ubicación, responsable</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Registro de Equipos</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Agregar Equipo"</li>
                                <li>• Complete información básica: propiedad, IT, área, responsable</li>
                                <li>• Especificaciones técnicas: serial, marca, capacidad, RAM</li>
                                <li>• Estado: Operativo, Mantenimiento, Fuera de uso</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Asignación de Equipos</h7>
                              <p className="text-sm ml-4">Seleccione un equipo, haga clic en "Editar" y cambie el campo "Responsable"</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h6 className="font-medium text-indigo-900 mb-3 flex items-center">
                            <FaFileAlt className="text-indigo-600 mr-2" />
                            Repositorio Documental
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Subida de Documentos</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Documentos" en la barra lateral</li>
                                <li>Elija "Nuevo Documento" o "Nueva Versión"</li>
                                <li>Complete: archivo, título, versión, tipo, categoría, descripción</li>
                                <li>Haga clic en "Subir Documento"</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Control de Versiones</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Versiones Activas: Solo se muestran las más recientes</li>
                                <li>• Historial Completo: Acceso a todas las versiones</li>
                                <li>• Descarga Selectiva: Descargar cualquier versión específica</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h6 className="font-medium text-red-900 mb-3 flex items-center">
                            <FaKey className="text-red-600 mr-2" />
                            Gestión de Credenciales
                          </h6>
                          <p className="text-sm mb-2"><strong>Nota:</strong> Este módulo está disponible únicamente para usuarios con rol de Administrador.</p>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Registro de Credenciales</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Agregar Credencial"</li>
                                <li>• Complete: servicio, usuario, contraseña, descripción</li>
                                <li>• Las contraseñas se almacenan encriptadas</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Seguridad</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Encriptación completa de contraseñas</li>
                                <li>• Auditoría de todas las consultas</li>
                                <li>• Acceso restringido solo a administradores</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h6 className="font-medium text-teal-900 mb-3 flex items-center">
                            <FaUsers className="text-teal-600 mr-2" />
                            Gestión de Usuarios
                          </h6>
                          <p className="text-sm mb-2"><strong>Nota:</strong> Este módulo está disponible únicamente para usuarios con rol de Administrador.</p>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Creación de Usuarios</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Agregar Usuario"</li>
                                <li>Complete: nombre de usuario, email, nombre completo</li>
                                <li>Asigne un rol: Administrador, Técnico, Empleado</li>
                                <li>Establezca una contraseña inicial</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Gestión de Roles</h7>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ml-4">
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-red-700 flex items-center"><FaCrown className="text-red-700 mr-2" /> Administrador</div>
                                  <div className="text-xs">Acceso completo a todos los módulos</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-blue-700 flex items-center"><FaWrench className="text-blue-700 mr-2" /> Técnico</div>
                                  <div className="text-xs">Gestión de tickets e inventario</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-green-700 flex items-center"><FaUser className="text-green-700 mr-2" /> Empleado</div>
                                  <div className="text-xs">Creación y seguimiento de tickets propios</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h6 className="font-medium text-orange-900 mb-3 flex items-center">
                            <FaCog className="text-orange-600 mr-2" />
                            Configuración Personal
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Perfil de Usuario</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Modificar nombre, email, información personal</li>
                                <li>• Cambiar contraseña de acceso</li>
                                <li>• Actualizar preferencias personales</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Configuración del Sistema</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Tema: Modo oscuro o claro</li>
                                <li>• Notificaciones: Configurar alertas</li>
                                <li>• Idioma: Seleccionar idioma de la interfaz</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Autenticación de Dos Factores (2FA)</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Vaya a Configuración {'>'} Seguridad {'>'} Autenticación de Dos Factores</li>
                                <li>Active la autenticación de dos factores</li>
                                <li>Escanee el código QR con su aplicación autenticadora</li>
                                <li>Ingrese el código generado para confirmar</li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-lg">
                          <h6 className="font-medium text-pink-900 mb-3 flex items-center">
                            <FaSearch className="text-pink-600 mr-2" />
                            Búsqueda Global
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Funcionamiento</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Ingrese términos de búsqueda en la barra superior</li>
                                <li>El sistema busca en todos los módulos permitidos</li>
                                <li>Resultados se muestran categorizados por módulo</li>
                                <li>Haga clic en cualquier resultado para ir directamente</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Tipos de Búsqueda</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Tickets: Por título, descripción, ID, usuario asignado</li>
                                <li>• Inventario: Por propiedad, serial, responsable, ubicación</li>
                                <li>• Documentos: Por título, descripción, etiquetas</li>
                                <li>• Usuarios: Por nombre, email, nombre de usuario</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 p-4 rounded-lg">
                          <h6 className="font-medium text-cyan-900 mb-3 flex items-center">
                            <FaChartBar className="text-cyan-600 mr-2" />
                            Reportes
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Tipos de Reportes</h7>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs flex items-center"><FaChartBar className="text-cyan-600 mr-2" /> Reporte de Tickets</div>
                                  <div className="text-xs">ID, título, estado, prioridad, fechas</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs flex items-center"><FaBox className="text-cyan-600 mr-2" /> Reporte de Inventario</div>
                                  <div className="text-xs">Especificaciones, ubicación, responsable</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs flex items-center"><FaFileAlt className="text-cyan-600 mr-2" /> Reporte de Documentos</div>
                                  <div className="text-xs">Título, versión, tipo, categoría, autor</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs flex items-center"><FaLock className="text-cyan-600 mr-2" /> Reporte de Credenciales</div>
                                  <div className="text-xs">Servicios, usuarios (sin contraseñas)</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Generación</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Acceda al módulo correspondiente</li>
                                <li>Haga clic en "Exportar CSV"</li>
                                <li>El archivo se descarga automáticamente</li>
                                <li>Abra con Excel, Google Sheets u otro editor CSV</li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h6 className="font-medium text-orange-900 mb-3 flex items-center">
                            <FaShieldAlt className="text-orange-600 mr-2" />
                            Gestión de Calidad
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Acceso al Módulo</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Calidad" en la barra lateral</li>
                                <li>Se desplegará un submenú con opciones</li>
                                <li>Seleccione "Documentos" para gestión documental</li>
                                <li>Seleccione "Ticket Calidad" para reportes de calidad</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Tickets de Calidad</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Nuevo Ticket Calidad"</li>
                                <li>• Seleccione tipo de problema: documentación, versiones, procedimientos</li>
                                <li>• Complete descripción detallada del problema</li>
                                <li>• Adjunte evidencias si es necesario</li>
                                <li>• Los técnicos especializados gestionarán el ticket</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Permisos por Carpeta</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Los botones de creación se activan según permisos</li>
                                <li>• Lectura: solo ver documentos</li>
                                <li>• Escritura: crear y editar documentos</li>
                                <li>• Los permisos cambian al navegar entre carpetas</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-lg">
                          <h6 className="font-medium text-pink-900 mb-3 flex items-center">
                            <FaPhone className="text-pink-600 mr-2" />
                            Teléfonos Corporativos
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h7 className="font-medium text-sm">Acceso al Módulo</h7>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Inventario" en la barra lateral</li>
                                <li>Se desplegará un submenú con opciones</li>
                                <li>Seleccione "Celulares Corporativos"</li>
                                <li>Solo administradores, técnicos y coordinadores tienen acceso</li>
                              </ol>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Categorías de Teléfonos</h7>
                              <div className="grid grid-cols-2 gap-2 ml-4">
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-red-700">Administración</div>
                                  <div className="text-xs">Directivos y gerentes</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-blue-700">Asesores</div>
                                  <div className="text-xs">Vendedores y ejecutivos</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-green-700">Socios</div>
                                  <div className="text-xs">Familiares estratégicos</div>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <div className="font-medium text-xs text-orange-700">Reposición</div>
                                  <div className="text-xs">Equipos repuestos</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Información por Teléfono</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Número celular y operador</li>
                                <li>• Plan y tarifa mensual</li>
                                <li>• Equipo asignado y IMEI</li>
                                <li>• Responsable y fecha de entrega</li>
                                <li>• Estado y observaciones</li>
                              </ul>
                            </div>
                            <div>
                              <h7 className="font-medium text-sm">Gestión de Equipos</h7>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Solo administradores pueden agregar equipos</li>
                                <li>• Técnicos pueden editar información básica</li>
                                <li>• Coordinadores tienen acceso de lectura</li>
                                <li>• Seguimiento completo de asignaciones</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-purple-600 mr-2" />
                      Solución de Problemas
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="space-y-3">
                        <div className="border-l-4 border-red-500 pl-3">
                          <strong>No puedo acceder:</strong> Verificar URL, credenciales o conexión.
                        </div>
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Error al subir archivos:</strong> Revisar tamaño y formato permitido.
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-3">
                          <strong>Bajo rendimiento:</strong> Limpiar caché del navegador o actualizarlo.
                        </div>
                        <div className="border-l-4 border-blue-500 pl-3">
                          <strong>Notificaciones fallan:</strong> Verificar permisos del navegador.
                        </div>
                      </div>
                    </div>
                  </details>


                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaBook className="text-purple-600 mr-2" />
                      Glosario
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Ticket:</strong> Solicitud de soporte técnico
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Inventario:</strong> Lista de activos tecnológicos
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Repositorio:</strong> Documentos del sistema
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Credenciales:</strong> Usuarios y contraseñas cifradas
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Dashboard:</strong> Panel principal de estadísticas
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Auditoría:</strong> Historial de todas las acciones
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Calidad:</strong> Módulo especializado en gestión de calidad y procesos documentales
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Ticket de Calidad:</strong> Reporte específico para problemas de calidad y cambios documentales
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Permisos por Carpeta:</strong> Control de acceso específico para cada carpeta documental
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>No Conformidad:</strong> Problema identificado en procesos de calidad
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Control de Versiones:</strong> Seguimiento de cambios en documentos a lo largo del tiempo
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Permiso de Lectura:</strong> Acceso para ver documentos sin poder modificarlos
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Permiso de Escritura:</strong> Acceso completo para crear, editar y eliminar documentos
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Rol de Calidad:</strong> Usuario con acceso administrativo a módulos de calidad y documentación
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Teléfonos Corporativos:</strong> Módulo para gestión de equipos móviles asignados a empleados
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>IMEI:</strong> Identificador único internacional de equipo móvil
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Plan Corporativo:</strong> Servicio de telefonía móvil contratado para empleados
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Categorías de Teléfonos:</strong> Clasificación de equipos por tipo de usuario (Administración, Asesores, Socios, Reposición)
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Asignación de Equipos:</strong> Proceso de asignar teléfonos corporativos a empleados específicos
                        </div>
                      </div>
                      <div className="mt-4 text-center text-xs text-gray-500">
                        <p>DuvyClass – Transformando la gestión tecnológica empresarial</p>
                        <p>Manual actualizado: noviembre 2025 | Versión del Sistema: 1.1.0</p>
                        <p>Nueva funcionalidad: Módulo de Teléfonos Corporativos</p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
