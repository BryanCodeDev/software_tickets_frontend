import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaTicketAlt, FaBox, FaFileAlt, FaKey, FaSearch, FaChartBar, FaSignInAlt, FaTachometerAlt, FaCog, FaUsers, FaShieldAlt, FaExclamationTriangle, FaLightbulb, FaHeadset, FaCrown, FaWrench, FaUser, FaGlobe, FaTimes, FaRocket, FaBullseye, FaLock, FaChartLine, FaBolt, FaCheck, FaClipboardList, FaClipboardCheck, FaDumpster, FaUndo, FaTrash, FaEye } from 'react-icons/fa';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const { conditionalClasses } = useThemeClasses();
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
    },
    {
      question: '¿Qué puede hacer el rol de Jefe en el sistema?',
      answer: 'El rol de Jefe tiene acceso a solicitudes de compra donde puede aprobar en segunda instancia, acceso completo a tickets de soporte, puede asignar técnicos a tickets, y tiene acceso a estadísticas y reportes del sistema.'
    },
    {
      question: '¿Cuáles son las funciones del rol de Compras?',
      answer: 'El rol de Compras tiene acceso a solicitudes de compra donde puede marcar como comprado y entregado, acceso a inventario de equipos y puede gestionar teléfonos corporativos. No tiene permisos para aprobar solicitudes.'
    },
    {
      question: '¿Qué responsabilidades tiene la Coordinadora Administrativa?',
      answer: 'La Coordinadora Administrativa tiene acceso a solicitudes de compra para aprobar en primera instancia, acceso a documentos y tickets de calidad, y puede gestionar actas de entrega. No puede eliminar usuarios del sistema.'
    },
    {
      question: '¿Qué acceso tiene el rol de Calidad?',
      answer: 'El rol de Calidad tiene acceso a elementos de calidad y documentos, puede gestionar tickets de calidad eliminados, restaurar documentos eliminados y tiene acceso específico a su área de responsabilidad.'
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
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900'
    })}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaQuestionCircle className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
                dark: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100'
              })}>Centro de Ayuda</h1>
              <p className={conditionalClasses({
                light: 'text-sm sm:text-base text-gray-600 mt-0.5',
                dark: 'text-sm sm:text-base text-gray-400 mt-0.5'
              })}>Encuentra respuestas y recursos para usar la plataforma</p>
            </div>
          </div>
        </div>

        <div className={conditionalClasses({
          light: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
          dark: 'bg-gray-800 rounded-xl shadow-sm border border-gray-600 overflow-hidden'
        })}>
          <div className={conditionalClasses({
            light: 'border-b border-gray-200',
            dark: 'border-b border-gray-600'
          })}>
            <nav className="flex">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'faq'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Preguntas Frecuentes
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'contact'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Contacto
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Manual de Usuario
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center mb-6">
                  <FaQuestionCircle className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Preguntas Frecuentes</h2>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className={conditionalClasses({
                      light: 'bg-gray-50 rounded-lg p-4',
                      dark: 'bg-gray-700 rounded-lg p-4'
                    })}>
                      <summary className={conditionalClasses({
                        light: 'font-medium text-gray-900 cursor-pointer hover:text-[#662d91]',
                        dark: 'font-medium text-gray-100 cursor-pointer hover:text-[#8e4dbf]'
                      })}>
                        {faq.question}
                      </summary>
                      <p className={conditionalClasses({
                        light: 'mt-2 text-gray-600',
                        dark: 'mt-2 text-gray-300'
                      })}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center mb-6">
                  <FaPhone className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Contacto y Soporte</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className={conditionalClasses({
                      light: 'bg-gray-50 rounded-lg p-4',
                      dark: 'bg-gray-700 rounded-lg p-4'
                    })}>
                      <div className="flex items-center mb-2">
                        {contact.icon}
                        <h3 className={conditionalClasses({
                          light: 'font-medium text-gray-900 ml-2',
                          dark: 'font-medium text-gray-100 ml-2'
                        })}>{contact.type}</h3>
                      </div>
                      <p className={conditionalClasses({
                        light: 'text-[#662d91] font-medium mb-1 whitespace-pre-line',
                        dark: 'text-[#8e4dbf] font-medium mb-1 whitespace-pre-line'
                      })}>{contact.value}</p>
                      <p className={conditionalClasses({
                        light: 'text-sm text-gray-600',
                        dark: 'text-sm text-gray-300'
                      })}>{contact.description}</p>
                    </div>
                  ))}
                </div>

                <div className={conditionalClasses({
                  light: 'mt-8 p-4 rounded-lg border-l-4 bg-purple-50 border-[#662d91]',
                  dark: 'mt-8 p-4 rounded-lg border-l-4 bg-purple-900/30 border-[#662d91]'
                })}>
                  <div className="flex items-start gap-3">
                    <FaHeadset className="mt-0.5 shrink-0 text-[#662d91]" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#662d91] mb-1">¿No encuentras lo que buscas?</h3>
                      <p className={conditionalClasses({
                        light: 'text-sm text-gray-700 mb-3',
                        dark: 'text-sm text-gray-300 mb-3'
                      })}>
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

            {activeTab === 'manual' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FaBook className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Manual de Usuario</h2>
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

                  <details className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                    dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                  })}>
                    <summary className={conditionalClasses({
                      light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                      dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                    })}>
                      <FaQuestionCircle className="text-[#662d91] mr-2" />
                      Introducción
                    </summary>
                    <div className={conditionalClasses({
                      light: 'p-4 pt-0 text-gray-700',
                      dark: 'p-4 pt-0 text-gray-300'
                    })}>
                      <p className="mb-3">DuvyClass es una plataforma web integral para la gestión tecnológica de empresas, centralizando procesos de soporte técnico, inventario IT, documentación y credenciales en una interfaz moderna, segura y eficiente.</p>
                      <div className={conditionalClasses({
                        light: 'bg-blue-50 p-3 rounded-lg mb-3',
                        dark: 'bg-blue-900/30 p-3 rounded-lg mb-3'
                      })}>
                        <h5 className={conditionalClasses({
                          light: 'font-medium text-blue-900 mb-1',
                          dark: 'font-medium text-blue-300 mb-1'
                        })}>¿Qué es DuvyClass?</h5>
                        <p className={conditionalClasses({
                          light: '',
                          dark: 'text-blue-200'
                        })}>Permite gestionar recursos tecnológicos, soporte, documentación y credenciales en un solo lugar, combinando múltiples módulos en una aplicación integrada.</p>
                      </div>
                    </div>
                  </details>

                  <details className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                    dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                  })}>
                    <summary className={conditionalClasses({
                      light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                      dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                    })}>
                      <FaDumpster className="text-[#662d91] mr-2" />
                      Sistema de Papelera
                    </summary>
                    <div className="p-4 pt-0 text-gray-700">
                      <p className="mb-3">El sistema de papelera permite recuperar elementos eliminados accidentalmente y gestionar eliminaciones de forma segura.</p>
                      
                      <h6 className={conditionalClasses({
                        light: 'font-medium text-gray-900 mb-2',
                        dark: 'font-medium text-gray-100 mb-2'
                      })}>Módulos Compatibles</h6>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        <div className="bg-blue-100 p-2 rounded text-xs">
                          <span className="font-medium text-blue-800">Tickets</span>
                        </div>
                        <div className="bg-green-100 p-2 rounded text-xs">
                          <span className="font-medium text-green-800">Usuarios</span>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded text-xs">
                          <span className="font-medium text-yellow-800">Inventario</span>
                        </div>
                        <div className="bg-purple-100 p-2 rounded text-xs">
                          <span className="font-medium text-purple-800">Solicitudes</span>
                        </div>
                        <div className="bg-indigo-100 p-2 rounded text-xs">
                          <span className="font-medium text-indigo-800">Documentos</span>
                        </div>
                        <div className="bg-red-100 p-2 rounded text-xs">
                          <span className="font-medium text-red-800">Credenciales</span>
                        </div>
                        <div className="bg-pink-100 p-2 rounded text-xs">
                          <span className="font-medium text-pink-800">Teléfonos</span>
                        </div>
                        <div className="bg-cyan-100 p-2 rounded text-xs">
                          <span className="font-medium text-cyan-800">Tablets</span>
                        </div>
                        <div className="bg-orange-100 p-2 rounded text-xs">
                          <span className="font-medium text-orange-800">PDAs</span>
                        </div>
                        <div className="bg-teal-100 p-2 rounded text-xs">
                          <span className="font-medium text-teal-800">Actas</span>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          <span className="font-medium text-gray-800">Calidad</span>
                        </div>
                      </div>

                      <h6 className={conditionalClasses({
                        light: 'font-medium text-gray-900 mb-2',
                        dark: 'font-medium text-gray-100 mb-2'
                      })}>Acciones Disponibles</h6>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FaUndo className="text-green-600 w-6 h-6" />
                          </div>
                          <div className="font-medium text-sm text-green-700">Restaurar</div>
                          <p className="text-xs text-gray-600">Recupera el elemento a su módulo original</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FaTrash className="text-red-600 w-6 h-6" />
                          </div>
                          <div className="font-medium text-sm text-red-700">Eliminar</div>
                          <p className="text-xs text-gray-600">Eliminación permanente e irreversible</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FaEye className="text-blue-600 w-6 h-6" />
                          </div>
                          <div className="font-medium text-sm text-blue-700">Ver Detalles</div>
                          <p className="text-xs text-gray-600">Información completa del elemento</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h6 className="font-medium text-yellow-900 mb-2 flex items-center">
                          <FaExclamationTriangle className="text-yellow-600 mr-2" />
                          Limpieza Automática
                        </h6>
                        <p className="text-sm text-gray-700">La limpieza automática se ejecuta cada noche a las 2:00 AM. Elimina elementos que han estado en la papelera por más de 30 días.</p>
                      </div>
                    </div>
                  </details>

                  <details className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                    dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                  })}>
                    <summary className={conditionalClasses({
                      light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                      dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                    })}>
                      <FaShieldAlt className="text-[#662d91] mr-2" />
                      Permisos y Roles
                    </summary>
                    <div className={conditionalClasses({
                      light: 'p-4 pt-0 text-gray-700',
                      dark: 'p-4 pt-0 text-gray-300'
                    })}>
                      <p className="mb-3">El sistema DuvyClass utiliza un modelo de control de acceso basado en roles (RBAC) para gestionar los permisos de los usuarios.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-red-700">Administrador</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Gestión completa de usuarios y roles</li>
                            <li>• Acceso a todos los módulos sin restricciones</li>
                            <li>• Configuración del sistema</li>
                            <li>• Reportes y estadísticas globales</li>
                            <li>• Gestión de la papelera</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-blue-700">Técnico</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Atención y resolución de tickets</li>
                            <li>• Asignación de tickets</li>
                            <li>• Gestión de inventario IT</li>
                            <li>• Acceso a documentación técnica</li>
                            <li>• Gestión de teléfonos corporativos</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-green-700">Empleado</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Creación de tickets de soporte</li>
                            <li>• Visualización de documentos</li>
                            <li>• Acceso a su inventario asignado</li>
                            <li>• Creación de solicitudes de compra</li>
                            <li>• Solo ve sus propios elementos</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-purple-700">Calidad</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Gestión de tickets de calidad</li>
                            <li>• Control documental completo</li>
                            <li>• Solicitudes de cambio documental</li>
                            <li>• Aprobación de documentos</li>
                            <li>• Gestión de carpetas y permisos</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-orange-700">Coordinadora Administrativa</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Aprobación de solicitudes (primera instancia)</li>
                            <li>• Gestión de actas de entrega</li>
                            <li>• Acceso a documentos</li>
                            <li>• Tickets de calidad</li>
                            <li>• Reportes de compras</li>
                          </ul>
                        </div>
                        <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-cyan-700">Jefe</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Aprobación de solicitudes (segunda instancia)</li>
                            <li>• Asignación de técnicos a tickets</li>
                            <li>• Acceso a estadísticas y reportes</li>
                            <li>• Gestión de tickets de soporte</li>
                            <li>• Supervisión del área técnica</li>
                          </ul>
                        </div>
                        <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                            <h6 className="font-medium text-pink-700">Compras</h6>
                          </div>
                          <ul className="text-xs space-y-1 ml-5">
                            <li>• Marcar solicitudes como compradas</li>
                            <li>• Marcar solicitudes como entregadas</li>
                            <li>• Acceso a inventario</li>
                            <li>• Gestión de teléfonos corporativos</li>
                            <li>• Reportes de compras</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </details>
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
