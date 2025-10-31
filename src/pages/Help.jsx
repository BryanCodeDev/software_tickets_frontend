import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

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
        </div>
      </div>
    </div>
  );
};

export default Help;