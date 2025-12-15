import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaTicketAlt, FaBox, FaFileAlt, FaKey, FaSearch, FaChartBar, FaSignInAlt, FaTachometerAlt, FaCog, FaUsers, FaShieldAlt, FaExclamationTriangle, FaLightbulb, FaHeadset, FaCrown, FaWrench, FaUser, FaGlobe, FaTimes, FaRocket, FaBullseye, FaLock, FaChartLine, FaBolt, FaCheck, FaClipboardList, FaClipboardCheck, FaDumpster, FaUndo, FaTrash, FaEye } from 'react-icons/fa';

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
      question: '¿Cómo acceder al sistema de papelera?',
      answer: 'En la barra lateral, haz clic en "Papelera" para acceder al sistema de recuperación de elementos eliminados. Solo administradores y técnicos tienen acceso.'
    },
    {
      question: '¿Qué elementos van a la papelera?',
      answer: 'Los elementos eliminados de tickets, usuarios, inventario, solicitudes de compra, documentos, credenciales, teléfonos corporativos, tablets, PDAs, actas de entrega y tickets de calidad van automáticamente a la papelera.'
    },
    {
      question: '¿Cómo restaurar un elemento desde la papelera?',
      answer: 'En la papelera, haz clic en "Restaurar" junto al elemento que deseas recuperar. El elemento volverá a su módulo original con toda su información intacta.'
    },
    {
      question: '¿Cómo eliminar permanentemente un elemento?',
      answer: 'En la papelera, haz clic en "Eliminar" junto al elemento. Esta acción es irreversible y eliminará permanentemente el elemento del sistema.'
    },
    {
      question: '¿Cómo vaciar toda la papelera?',
      answer: 'Haz clic en "Vaciar Papelera" para eliminar permanentemente todos los elementos. Esta acción requiere confirmación y es irreversible.'
    },
    {
      question: '¿Cuánto tiempo permanecen los elementos en la papelera?',
      answer: 'Los elementos permanecen en la papelera por 30 días. Después de este tiempo, se eliminan automáticamente mediante un proceso de limpieza nocturna.'
    },
    {
      question: '¿Cómo buscar elementos en la papelera?',
      answer: 'Usa la barra de búsqueda y los filtros por módulo para encontrar elementos específicos en la papelera. Puedes filtrar por tipo de módulo y usar búsqueda por texto.'
    },
    {
      question: '¿Puedo ver estadísticas de la papelera?',
      answer: 'Sí, haz clic en "Estadísticas" para ver el total de elementos por módulo, distribución por tipos y métricas de uso de la papelera.'
    },
    {
      question: '¿Qué permisos necesito para usar la papelera?',
      answer: 'Solo administradores y técnicos tienen acceso completo a la papelera. Los empleados pueden ver sus propios elementos eliminados si tienen los permisos correspondientes.'
    },
    {
      question: '¿Cómo funciona la limpieza automática de la papelera?',
      answer: 'Cada noche a las 2:00 AM, el sistema elimina automáticamente todos los elementos que han estado en la papelera por más de 30 días.'
    },
    {
      question: '¿Puedo eliminar elementos sin enviarlos a la papelera?',
      answer: 'No, todas las eliminaciones van a la papelera para permitir recuperación. Solo en la papelera puedes eliminar elementos permanentemente.'
    },
    {
      question: '¿Se pueden restaurar elementos con dependencias?',
      answer: 'Sí, el sistema maneja automáticamente las dependencias. Si un elemento restaurado tenía relaciones con otros elementos, estas se restablecen.'
    },
    {
      question: '¿Cómo ver detalles de un elemento en la papelera?',
      answer: 'Haz clic en "Ver detalles" para ver información completa del elemento, incluyendo datos originales, quién lo eliminó, cuándo y por qué.'
    },
    {
      question: '¿Puedo filtrar elementos por fecha de eliminación?',
      answer: 'Los elementos se muestran ordenados por fecha de eliminación (más recientes primero). Puedes ver cuánto tiempo ha pasado desde la eliminación.'
    },
    {
      question: '¿Qué información se guarda de cada elemento eliminado?',
      answer: 'Se guarda el título, tipo de módulo, datos originales completos, usuario que lo eliminó, fecha de eliminación y razón de eliminación.'
    },
    {
      question: '¿Cómo diferenciar elementos por módulo en la papelera?',
      answer: 'Cada elemento tiene un ícono y color distintivo según su módulo. También se muestra el nombre del módulo y puedes filtrar por tipo.'
    },
    {
      question: '¿Puedo exportar elementos de la papelera?',
      answer: 'Actualmente no se pueden exportar elementos directamente de la papelera, pero puedes ver toda la información en pantalla y tomar capturas si es necesario.'
    },
    {
      question: '¿Qué pasa si elimino un elemento que está siendo usado?',
      answer: 'El sistema te advertirá sobre dependencias antes de permitir la eliminación. Si procedes, el elemento irá a la papelera y podrás restaurarlo.'
    },
    {
      question: '¿Cómo funciona la papelera en dispositivos móviles?',
      answer: 'La papelera tiene un diseño responsive que se adapta a dispositivos móviles. Todas las funciones están disponibles en tablets y teléfonos.'
    },
    {
      question: '¿Puedo buscar por el usuario que eliminó un elemento?',
      answer: 'Sí, en los detalles de cada elemento se muestra quién lo eliminó, y puedes usar esta información para filtrar o buscar elementos específicos.'
    },
    {
      question: '¿Hay límite en la cantidad de elementos en la papelera?',
      answer: 'No hay límite específico, pero el rendimiento puede verse afectado con demasiados elementos. La limpieza automática ayuda a mantener el sistema optimizado.'
    },
    {
      question: '¿Puedo deshacer una eliminación accidental?',
      answer: 'Sí, mientras el elemento esté en la papelera (máximo 30 días), puedes restaurarlo completamente desde la papelera del sistema.'
    },
    {
      question: '¿Cómo saber si un elemento ha sido restaurado exitosamente?',
      answer: 'Recibirás una notificación de éxito y el elemento desaparecerá de la papelera, apareciendo nuevamente en su módulo original.'
    },
    {
      question: '¿Qué módulos son compatibles con la papelera?',
      answer: 'Tickets, Usuarios, Inventario, Solicitudes de Compra, Documentos, Credenciales, Teléfonos Corporativos, Tablets, PDAs, Actas de Entrega y Tickets de Calidad.'
    }

  ];

  const contactInfo = [
    {
      type: 'Email',
      value: 'asistentesistemas@duvyclass.co',
      icon: <FaEnvelope className="text-[#662d91]" />,
      description: 'Envíanos un correo para soporte técnico'
    },
    {
      type: 'Dirección',
      value: 'Kilómetro 3.5 vía Funza - Siberia\nParque Industrial Galicia\nManzana D, Bodegas 2 y 3',
      icon: <FaPhone className="text-[#662d91]" />,
      description: 'Nuestra ubicación física'
    },
    {
      type: 'PBX',
      value: '(57) 601-821 6565',
      icon: <FaPhone className="text-[#662d91]" />,
      description: 'Línea principal de la empresa'
    },
    {
      type: 'Sitio Web',
      value: 'www.duvyclass.com',
      icon: <FaPhone className="text-[#662d91]" />,
      description: 'Visita nuestro sitio web oficial'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaQuestionCircle className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Centro de Ayuda</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">Encuentra respuestas y recursos para usar la plataforma</p>
            </div>
          </div>
        </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? 'border-[#662d91] text-[#662d91]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contact'
                  ? 'border-[#662d91] text-[#662d91]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Contacto
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-[#662d91] text-[#662d91]'
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
                <FaQuestionCircle className="text-[#662d91] text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-[#662d91]">
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
                <FaPhone className="text-[#662d91] text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Contacto y Soporte</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {contact.icon}
                      <h3 className="font-medium text-gray-900 ml-2">{contact.type}</h3>
                    </div>
                    <p className="text-[#662d91] font-medium mb-1 whitespace-pre-line">{contact.value}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg border-l-4 bg-purple-50 border-[#662d91]">
                <div className="flex items-start gap-3">
                  <FaHeadset className="mt-0.5 shrink-0 text-[#662d91]" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#662d91] mb-1">¿No encuentras lo que buscas?</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Si tienes alguna pregunta específica o necesitas ayuda con algo en particular,
                      no dudes en contactarnos. Nuestro equipo de soporte está aquí para ayudarte.
                    </p>
                    <button
                      onClick={() => navigate('/tickets')}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#662d91] to-[#8e4dbf] text-white rounded-lg font-semibold hover:from-[#7a3da8] hover:to-[#662d91] focus:ring-4 focus:ring-[#e8d5f5] transition-all shadow-lg hover:shadow-xl text-sm"
                    >
                      <FaTicketAlt className="text-sm" />
                      <span>Crear Ticket de Soporte</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <FaBook className="text-[#662d91] text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Manual de Usuario</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg p-6 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FaBook className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Manual de Usuario - DuvyClass</h3>
                      <p className="text-sm text-purple-100 mt-1">Sistema IT de Gestión Tecnológica</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaDumpster className="text-gray-600 mr-2" />
                      Sistema de Papelera
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                            <FaDumpster className="text-gray-600 mr-2" />
                            Gestión de Elementos Eliminados
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-sm">¿Qué es la Papelera?</h6>
                              <p className="text-sm text-gray-600 ml-4 mb-3">
                                El sistema de papelera permite recuperar elementos eliminados accidentalmente y gestionar eliminaciones de forma segura. 
                                Los elementos van a la papelera en lugar de eliminarse permanentemente, dando una segunda oportunidad de recuperación.
                              </p>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Acceso al Sistema</h6>
                              <ol className="text-sm space-y-1 list-decimal list-inside ml-4">
                                <li>Haga clic en "Papelera" en la barra lateral</li>
                                <li>Solo administradores y técnicos tienen acceso completo</li>
                                <li>Los empleados ven elementos según sus permisos de módulo</li>
                                <li>Se mostrarán todos los elementos eliminados del sistema</li>
                              </ol>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Módulos Compatibles</h6>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                                <div className="bg-blue-100 p-2 rounded text-xs">
                                  <div className="font-medium text-blue-800">Tickets</div>
                                </div>
                                <div className="bg-green-100 p-2 rounded text-xs">
                                  <div className="font-medium text-green-800">Usuarios</div>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded text-xs">
                                  <div className="font-medium text-yellow-800">Inventario</div>
                                </div>
                                <div className="bg-purple-100 p-2 rounded text-xs">
                                  <div className="font-medium text-purple-800">Solicitudes</div>
                                </div>
                                <div className="bg-indigo-100 p-2 rounded text-xs">
                                  <div className="font-medium text-indigo-800">Documentos</div>
                                </div>
                                <div className="bg-red-100 p-2 rounded text-xs">
                                  <div className="font-medium text-red-800">Credenciales</div>
                                </div>
                                <div className="bg-pink-100 p-2 rounded text-xs">
                                  <div className="font-medium text-pink-800">Teléfonos</div>
                                </div>
                                <div className="bg-cyan-100 p-2 rounded text-xs">
                                  <div className="font-medium text-cyan-800">Tablets</div>
                                </div>
                                <div className="bg-orange-100 p-2 rounded text-xs">
                                  <div className="font-medium text-orange-800">PDAs</div>
                                </div>
                                <div className="bg-teal-100 p-2 rounded text-xs">
                                  <div className="font-medium text-teal-800">Actas</div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded text-xs">
                                  <div className="font-medium text-gray-800">Calidad</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Navegación y Búsqueda</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• <strong>Búsqueda por texto:</strong> Busque por título o contenido</li>
                                <li>• <strong>Filtro por módulo:</strong> Vea solo elementos de un tipo específico</li>
                                <li>• <strong>Ordenamiento:</strong> Los elementos aparecen ordenados por fecha de eliminación</li>
                                <li>• <strong>Paginación:</strong> Navegue por páginas si hay muchos elementos</li>
                                <li>• <strong>Estadísticas:</strong> Vea métricas generales de la papelera</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Acciones Disponibles</h6>
                              <div className="bg-white p-3 rounded border ml-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <FaUndo className="text-green-600 w-6 h-6" />
                                    </div>
                                    <div className="font-medium text-sm text-green-700">Restaurar</div>
                                    <div className="text-xs text-gray-600">Recupera el elemento a su módulo original</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <FaTrash className="text-red-600 w-6 h-6" />
                                    </div>
                                    <div className="font-medium text-sm text-red-700">Eliminar</div>
                                    <div className="text-xs text-gray-600">Eliminación permanente e irreversible</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <FaEye className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <div className="font-medium text-sm text-blue-700">Ver Detalles</div>
                                    <div className="text-xs text-gray-600">Información completa del elemento</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Restaurar Elementos</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Restaurar" junto al elemento deseado</li>
                                <li>• Confirme la acción en el diálogo que aparece</li>
                                <li>• El elemento volverá a su módulo original</li>
                                <li>• Se restaurarán todas las relaciones y dependencias</li>
                                <li>• Recibirá una notificación de éxito</li>
                                <li>• El elemento desaparecerá de la papelera</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Eliminación Permanente</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Eliminar" para eliminación permanente</li>
                                <li>• Confirme que entiende que la acción es irreversible</li>
                                <li>• El elemento se borrará completamente del sistema</li>
                                <li>• Use esta opción solo si está seguro de no necesitar el elemento</li>
                                <li>• Se recomienda primero intentar restaurar si no está seguro</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Ver Detalles</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Ver detalles" para información completa</li>
                                <li>• Vea el título y módulo del elemento</li>
                                <li>• Conozca quién lo eliminó y cuándo</li>
                                <li>• Lea la razón de eliminación si se proporcionó</li>
                                <li>• Vea los datos originales completos en formato JSON</li>
                                <li>• Desde aquí también puede restaurar o eliminar permanentemente</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Vaciar Papelera</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Vaciar Papelera" para eliminar todo</li>
                                <li>• Esta acción requiere confirmación doble</li>
                                <li>• Eliminará permanentemente todos los elementos</li>
                                <li>• Use esta función para limpiar la papelera completamente</li>
                                <li>• Se recomienda solo cuando esté seguro de no necesitar nada</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Estadísticas de Papelera</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Haga clic en "Estadísticas" para ver métricas</li>
                                <li>• Total de elementos en la papelera</li>
                                <li>• Distribución por módulos</li>
                                <li>• Elementos más antiguos</li>
                                <li>• Tendencias de eliminación</li>
                                <li>• Esta información ayuda a optimizar el uso del sistema</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h6 className="font-medium text-yellow-900 mb-3 flex items-center">
                            <FaExclamationTriangle className="text-yellow-600 mr-2" />
                            Limpieza Automática
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-sm">Proceso Automático</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• La limpieza automática se ejecuta cada noche a las 2:00 AM</li>
                                <li>• Elimina elementos que han estado en la papelera por más de 30 días</li>
                                <li>• Este proceso es automático y no requiere intervención manual</li>
                                <li>• Se registra en los logs del sistema para auditoría</li>
                                <li>• Los administradores pueden ver el historial de limpiezas</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Configuración</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Solo administradores pueden modificar la configuración</li>
                                <li>• El período de retención actual es de 30 días</li>
                                <li>• El horario de limpieza es a las 2:00 AM hora de Colombia</li>
                                <li>• Se puede ejecutar limpieza manual desde herramientas administrativas</li>
                                <li>• Los logs registran cada elemento eliminado automáticamente</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Recomendaciones</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Revise la papelera regularmente para recuperar elementos necesarios</li>
                                <li>• Use la función de búsqueda para encontrar elementos específicos</li>
                                <li>• Considere restaurar elementos valiosos antes de la limpieza automática</li>
                                <li>• Use la función "Vaciar Papelera" para limpiar elementos innecesarios</li>
                                <li>• Las estadísticas ayudan a entender patrones de uso</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-medium text-blue-900 mb-3 flex items-center">
                            <FaCrown className="text-blue-600 mr-2" />
                            Permisos y Roles
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-sm">Acceso por Roles</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                <div className="bg-white p-3 rounded border">
                                  <div className="font-medium text-red-700 text-sm mb-1">Administrador</div>
                                  <ul className="text-xs space-y-1">
                                    <li>• Acceso completo a toda la papelera</li>
                                    <li>• Puede ver y gestionar elementos de todos los módulos</li>
                                    <li>• Puede vaciar la papelera completamente</li>
                                    <li>• Puede acceder a estadísticas y reportes</li>
                                    <li>• Puede configurar parámetros de limpieza</li>
                                  </ul>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                  <div className="font-medium text-blue-700 text-sm mb-1">Técnico</div>
                                  <ul className="text-xs space-y-1">
                                    <li>• Acceso a elementos de módulos que gestiona</li>
                                    <li>• Puede restaurar elementos de su área de responsabilidad</li>
                                    <li>• Puede eliminar permanentemente elementos</li>
                                    <li>• Acceso a estadísticas básicas</li>
                                    <li>• No puede vaciar toda la papelera</li>
                                  </ul>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                  <div className="font-medium text-green-700 text-sm mb-1">Empleado</div>
                                  <ul className="text-xs space-y-1">
                                    <li>• Puede ver elementos que él mismo eliminó</li>
                                    <li>• Puede restaurar sus propios elementos</li>
                                    <li>• Acceso limitado según permisos de módulo</li>
                                    <li>• No puede ver elementos de otros usuarios</li>
                                    <li>• No puede eliminar permanentemente elementos</li>
                                  </ul>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                  <div className="font-medium text-purple-700 text-sm mb-1">Calidad</div>
                                  <ul className="text-xs space-y-1">
                                    <li>• Acceso a elementos de calidad y documentos</li>
                                    <li>• Puede gestionar tickets de calidad eliminados</li>
                                    <li>• Puede restaurar documentos eliminados</li>
                                    <li>• Acceso específico a su área de responsabilidad</li>
                                    <li>• No puede acceder a otros módulos</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h6 className="font-medium text-green-900 mb-3 flex items-center">
                            <FaCheck className="text-green-600 mr-2" />
                            Mejores Prácticas
                          </h6>
                          <div className="space-y-3">
                            <div>
                              <h6 className="font-medium text-sm">Uso Eficiente</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Revise la papelera semanalmente para recuperar elementos necesarios</li>
                                <li>• Use filtros y búsqueda para encontrar elementos rápidamente</li>
                                <li>• Verifique las estadísticas para entender patrones de uso</li>
                                <li>• Considere restaurar en lugar de recrear elementos</li>
                                <li>• Mantenga la papelera limpia eliminando elementos innecesarios</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Prevención de Pérdidas</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Siempre confirme antes de eliminar elementos importantes</li>
                                <li>• Use los diálogos de confirmación para evitar eliminaciones accidentales</li>
                                <li>• Si no está seguro, primero restaure y luego elimine permanentemente si es necesario</li>
                                <li>• Documente las razones de eliminación para facilitar la recuperación</li>
                                <li>• Enseñe a los usuarios sobre la función de papelera</li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium text-sm">Mantenimiento del Sistema</h6>
                              <ul className="text-sm space-y-1 ml-4">
                                <li>• Monitoree el tamaño de la papelera regularmente</li>
                                <li>• Use la función de vaciado para limpiar elementos antiguos innecesarios</li>
                                <li>• Revise los logs de limpieza automática</li>
                                <li>• Capacite a los usuarios sobre el uso apropiado</li>
                                <li>• Mantenga respaldos del sistema antes de limpiezas masivas</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-[#662d91] mr-2" />
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
                      <FaQuestionCircle className="text-[#662d91] mr-2" />
                      Características Principales
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#f3ebf9] p-3 rounded-lg">
                          <h6 className="font-medium text-[#662d91] mb-2 flex items-center">
                            <FaDumpster className="text-[#662d91] mr-2" />
                            Sistema de Papelera
                          </h6>
                          <ul className="text-sm space-y-1">
                            <li>• Recuperación de elementos eliminados</li>
                            <li>• Limpieza automática después de 30 días</li>
                            <li>• Restauración con un clic</li>
                            <li>• Estadísticas y reportes de uso</li>
                          </ul>
                        </div>
                        <div className="bg-[#f3ebf9] p-3 rounded-lg">
                          <h6 className="font-medium text-[#662d91] mb-2 flex items-center">
                            <FaTicketAlt className="text-[#662d91] mr-2" />
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
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaQuestionCircle className="text-[#662d91] mr-2" />
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
                        <h6 className="font-medium mb-2 text-[#662d91] flex items-center"><FaGlobe className="text-[#662d91] mr-2" /> Navegadores Soportados</h6>
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
                      <FaLightbulb className="text-[#662d91] mr-2" />
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

                        <div className="bg-[#f3ebf9] p-4 rounded-lg">
                          <h6 className="font-medium text-[#662d91] mb-2 flex items-center"><FaLock className="text-[#662d91] mr-2" /> Cambio de Contraseña Inicial</h6>
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
                      <FaQuestionCircle className="text-[#662d91] mr-2" />
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
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Problemas con papelera:</strong> Verificar permisos de rol y conexión a internet.
                        </div>
                      </div>
                    </div>
                  </details>

                  <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center">
                      <FaBook className="text-[#662d91] mr-2" />
                      Glosario
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Sistema de Papelera:</strong> Módulo de recuperación de elementos eliminados que permite restaurar elementos por 30 días antes de eliminación permanente.
                        </div>
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
                          <strong>Limpieza Automática:</strong> Proceso nocturno que elimina elementos de la papelera después de 30 días
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Restauración:</strong> Acción de recuperar un elemento desde la papelera a su módulo original
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Eliminación Permanente:</strong> Borrado definitivo de un elemento desde la papelera
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Retención:</strong> Período de tiempo (30 días) que los elementos permanecen en la papelera
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong>Dependencias:</strong> Relaciones entre elementos que se mantienen al restaurar
                        </div>
                      </div>
                      <div className="mt-4 text-center text-xs text-gray-500">
                        <p>DuvyClass – Transformando la gestión tecnológica empresarial</p>
                        <p>Manual actualizado: diciembre 2025 | Versión del Sistema: 1.3.0</p>
                        <p>Nuevas funcionalidades: Sistema de Papelera con recuperación de elementos y limpieza automática</p>
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
    </div>
  );
};

export default Help;
