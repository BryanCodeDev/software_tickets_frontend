import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaTicketAlt, FaBox, FaFileAlt, FaKey, 
  FaSearch, FaChartBar, FaSignInAlt, FaTachometerAlt, FaCog, FaUsers, FaShieldAlt, 
  FaExclamationTriangle, FaLightbulb, FaHeadset, FaCrown, FaWrench, FaUser, FaGlobe, 
  FaTimes, FaRocket, FaBullseye, FaLock, FaChartLine, FaBolt, FaCheck, FaClipboardList,
  FaClipboardCheck, FaDumpster, FaUndo, FaTrash, FaEye, FaHistory, FaTag, FaFolder,
  FaComments, FaPaperclip, FaChartPie, FaServer, FaMobile, FaIdCard, FaBriefcase, FaEdit,
  FaTrashRestore, FaDownload, FaUpload, FaPlus, FaMinus, FaBan, FaStar, FaMedal,
  FaList, FaChevronDown, FaCompass, FaShoppingCart
} from 'react-icons/fa';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Help = () => {
  const [activeTab, setActiveTab] = useState('manual');
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
      question: '¿Cómo crear un ticket de calidad?',
      answer: 'Vaya al módulo Tickets de Calidad, haga clic en "Nuevo Ticket", seleccione el tipo (No Conformidad, Auditoría, CAPA o Mejora), describa el problema, identifique el área afectada y establezca la prioridad.'
    },
    {
      question: '¿Qué es una No Conformidad (NCR)?',
      answer: 'Es el registro de una desviación detecteda respecto a un estándar, requisito o proceso establecido. Requiere análisis de causa raíz y acción correctiva.'
    },
    {
      question: '¿Cómo solicitar un cambio documental?',
      answer: 'Vaya a Solicitudes de Cambio, cree una nueva solicitud, seleccione el tipo de cambio, justifique el cambio (mínimo 10 caracteres), analice el impacto y envíe para aprobación.'
    },
    {
      question: '¿Quién puede aprobar solicitudes de cambio?',
      answer: 'El workflow tiene 3 niveles: Calidad (revisión inicial), Jefe (aprobación) y Administrador (implementación y publicación). Cada rol tiene responsabilidades específicas.'
    },
    {
      question: '¿Qué es CAPA en calidad?',
      answer: 'CAPA significa Acción Correctiva y Preventiva. Es un proceso para identificar la causa raíz de un problema e implementar acciones para prevenir su recurrencia.'
    },
    {
      question: '¿Cómo usar el Dashboard de Calidad?',
      answer: 'El Dashboard muestra métricas en tiempo real: total de tickets, abiertos, cerrados y en progreso. También muestra gráficos por categoría, prioridad y estado.'
    },
    {
      question: '¿Qué es el análisis de causa raíz?',
      answer: 'Es una técnica para identificar la causa fundamental de un problema. Métodos comunes incluyen los 5 Por Qué y el diagrama de Ishikawa (espina de pescado).'
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

  const roles = [
    {
      name: 'Administrador',
      icon: <FaCrown className="text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Control total sobre todos los módulos y funcionalidades del sistema',
      permissions: [
        'Acceso completo a todos los módulos del sistema',
        'Gestión de usuarios y roles',
        'Configuración del sistema',
        'Ver y restaurar cualquier elemento de la papelera',
        'Vaciar papelera completamente',
        'Acceso a estadísticas y reportes globales',
        'Eliminar elementos permanentemente',
        'Gestionar permisos de usuarios',
        'Configurar parámetros de limpieza automática',
        'Ver logs de auditoría del sistema'
      ],
      modules: ['Todos los módulos', 'Usuarios', 'Roles', 'Configuración', 'Papelera', 'Auditoría']
    },
    {
      name: 'Jefe',
      icon: <FaMedal className="text-purple-500" />,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Supervisión y gestión de equipos con acceso a reportes y estadísticas avanzadas',
      permissions: [
        'Ver todos los tickets del área',
        'Asignar tickets a técnicos',
        'Aprobar solicitudes de cambio',
        'Ver estadísticas del departamento',
        'Crear y gestionar solicitudes de compra',
        'Acceso a documentos del área',
        'Ver reportes de rendimiento',
        'Gestionar workflow de documentos',
        'Aprobar tickets de calidad',
        'Ver métricas de equipo'
      ],
      modules: ['Tickets', 'Solicitudes de Cambio', 'Solicitudes de Compra', 'Documentos', 'Estadísticas', 'Calidad']
    },
    {
      name: 'Técnico',
      icon: <FaWrench className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Resolución de tickets y gestión de inventario técnico',
      permissions: [
        'Crear y atender tickets',
        'Asignarse tickets',
        'Actualizar estado de tickets',
        'Añadir comentarios y adjuntos',
        'Gestionar inventario',
        'Ver credenciales del sistema',
        'Restaurar elementos de la papelera (propios)',
        'Crear solicitudes de cambio',
        'Gestionar teléfonos corporativos',
        'Gestionar tablets y PDAs'
      ],
      modules: ['Tickets', 'Inventario', 'Credenciales', 'Teléfonos', 'Tablets', 'PDAs', 'Papelera']
    },
    {
      name: 'Empleado',
      icon: <FaUser className="text-green-500" />,
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Usuario básico con acceso para crear tickets y consultar información',
      permissions: [
        'Crear tickets propios',
        'Ver estado de sus tickets',
        'Añadir comentarios a sus tickets',
        'Ver documentos asignados',
        'Cambiar contraseña',
        'Ver perfil de usuario',
        'Crear solicitudes de compra',
        'Acceso de solo lectura a módulos autorizados',
        'Ver tickets de calidad asignados',
        'Consultar inventario asignado'
      ],
      modules: ['Tickets', 'Documentos', 'Solicitudes de Compra', 'Perfil', 'Inventario']
    },
    {
      name: 'Calidad',
      icon: <FaCheck className="text-teal-500" />,
      color: 'bg-teal-100 text-teal-800 border-teal-300',
      description: 'Gestión de calidad, auditoría y cumplimiento de procesos',
      permissions: [
        'Gestionar tickets de calidad',
        'Crear y aprobar documentos',
        'Ver historial de cambios documentales',
        'Aprobar solicitudes de cambio',
        'Ver métricas de calidad',
        'Gestionar workflow de documentos',
        'Crear no conformidades',
        'Ver reportes de calidad',
        'Gestionar plantillas documentales',
        'Auditoría de procesos'
      ],
      modules: ['Tickets de Calidad', 'Documentos', 'Solicitudes de Cambio', 'Reportes de Calidad', 'Auditoría']
    },
    {
      name: 'Coordinadora Administrativa',
      icon: <FaBriefcase className="text-pink-500" />,
      color: 'bg-pink-100 text-pink-800 border-pink-300',
      description: 'Gestión administrativa de compras, actas y recursos',
      permissions: [
        'Gestionar solicitudes de compra',
        'Crear y firmar actas de entrega',
        'Ver inventario administrativo',
        'Gestionar credenciales administrativas',
        'Ver reportes financieros',
        'Aprobar solicitudes de compra',
        'Gestionar telefónicas administrativas',
        'Ver estadísticas administrativas',
        'Crear órdenes de reposición',
        'Gestionar presupuestos'
      ],
      modules: ['Solicitudes de Compra', 'Actas de Entrega', 'Inventario', 'Credenciales', 'Teléfonos', 'Reportes']
    },
    {
      name: 'Compras',
      icon: <FaShoppingCart className="text-orange-500" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Gestión del proceso de compras y adquisiciones',
      permissions: [
        'Crear solicitudes de compra',
        'Seguir estado de solicitudes',
        'Ver catálogo de proveedores',
        'Gestionar órdenes de compra',
        'Ver historial de compras',
        'Adjuntar facturas y comprobantes',
        'Aprobar solicitudes de compra (nivel compras)',
        'Gestionar líneas de compra',
        'Ver reportes de compras',
        'Coordinar entregas'
      ],
      modules: ['Solicitudes de Compra', 'Proveedores', 'Órdenes de Compra', 'Inventario', 'Reportes']
    }
  ];

  const modules = [
    {
      name: 'Tickets',
      icon: <FaTicketAlt className="text-[#662d91]" />,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Sistema de mesa de ayuda para gestión de solicitudes técnicas',
      features: [
        'Creación de tickets con múltiples prioridades',
        'Asignación automática y manual de técnicos',
        'Sistema de categorías y subcategorías',
        'Comentarios y conversación en tiempo real',
        'Adjuntos de archivos e imágenes',
        'Historial completo de cambios de estado',
        'Notificaciones por email y sistema',
        'Filtros avanzados y búsqueda',
        'Estadísticas de resolución',
        'Plantillas de respuestas rápidas'
      ],
      workflows: ['Nuevo → Asignado → En Progreso → Esperando → Resuelto → Cerrado']
    },
    {
      name: 'Tickets de Calidad',
      icon: <FaClipboardCheck className="text-teal-500" />,
      color: 'bg-teal-100 text-teal-800 border-teal-300',
      description: 'Gestión de no conformidades y procesos de calidad',
      features: [
        'Registro de no conformidades (NCR)',
        'Auditorías de calidad programadas',
        'Análisis de causas raíz (5 Por Qué, Ishikawa)',
        'Acciones correctivas y preventivas (CAPA)',
        'Seguimiento de métricas e indicadores',
        'Reportes de cumplimiento ISO 9001',
        'Integración con documentos del sistema',
        'Workflow de aprobación por roles',
        'Plantillas de auditoría personalizadas',
        'Indicadores de rendimiento (KPI)',
        'Dashboard unificado de calidad',
        'Tickets de calidad por categoría'
      ],
      workflows: ['Detectado → En Análisis → Acción Correctiva → Verificación → Cerrado']
    },
    {
      name: 'Inventario',
      icon: <FaBox className="text-blue-600" />,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Control integral de activos tecnológicos',
      features: [
        'Registro de activos con código único',
        'Categorización por tipo de equipo',
        'Asignación a usuarios y áreas',
        'Control de estados (Activo, Inactivo, Mantenimiento)',
        'Historial de movimientos',
        'Control de garantías',
        'Valoración de activos',
        'Reportes de inventario',
        'Código de barras y QR',
        'Importación masiva'
      ],
      workflows: ['Ingreso → Asignado → Mantenimiento → Baja']
    },
    {
      name: 'Tablets',
      icon: <FaMobile className="text-indigo-500" />,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Gestión específica de dispositivos tablets',
      features: [
        'Inventario de tablets corporativas',
        'Control de IMEI y números de serie',
        'Asignación por usuario',
        'Gestión de planes de datos',
        'Apps instaladas',
        'Historial de asignaciones',
        'Estado del dispositivo',
        'Mantenimiento y reparaciones',
        'Control de cargadores',
        'Reportes de uso'
      ],
      workflows: ['Almacén → Asignado → Mantenimiento → Reposición']
    },
    {
      name: 'PDAs',
      icon: <FaMobile className="text-orange-500" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Control de dispositivos de captura de datos',
      features: [
        'Inventario de PDAs',
        'Control de asignación',
        'Software instalado',
        'Conectividad y redes',
        'Mantenimiento preventivo',
        'Historial de reparaciones',
        'Baterías y accesorios',
        'Certificaciones de uso',
        'Control de productividad',
        'Gestión de garantías'
      ],
      workflows: ['Almacén → Asignado → Mantenimiento → Baja']
    },
    {
      name: 'Teléfonos Corporativos',
      icon: <FaPhone className="text-pink-500" />,
      color: 'bg-pink-100 text-pink-800 border-pink-300',
      description: 'Gestión de telefonía móvil corporativa',
      features: [
        'Inventario por categoría (Admin, Asesores, Socios, Reposición)',
        'Control de IMEI y operador',
        'Gestión de planes móviles',
        'Asignación a empleados',
        'Historial de líneas',
        'Control de gastos',
        'Reposición de equipos',
        'Cancelación de líneas',
        'Reportes de uso',
        'Gestión de SIMs'
      ],
      workflows: ['Disponible → Asignado → Reposición → Baja']
    },
    {
      name: 'Documentos',
      icon: <FaFileAlt className="text-green-600" />,
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Repositorio centralizado de documentación',
      features: [
        'Organización por carpetas y subcarpetas',
        'Control de versiones',
        'Categorización por tipo documental',
        'Búsqueda avanzada',
        'Control de acceso por permisos',
        'Historial de modificaciones',
        'Firma digital de documentos',
        'Plantillas documentales',
        'Vencimiento de documentos',
        'Auditoría de accesos'
      ],
      workflows: ['Borrador → En Revisión → Aprobado →Publicado →Archivado']
    },
    {
      name: 'Solicitudes de Cambio',
      icon: <FaEdit className="text-red-500" />,
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Gestión de cambios en documentos y procesos ISO 9001',
      features: [
        'Solicitud de cambios documentales',
        'Análisis de impacto y justificación',
        'Workflow de aprobación ISO 9001',
        'Historial completo de versiones',
        'Justificación obligatoria del cambio',
        'Notificaciones a interesados',
        'Plazos y vencimientos',
        'Priorización de cambios',
        'Documentos afectados',
        'Cierre y evaluación del cambio',
        'Subida de archivos propuestos',
        'Integración con módulo de documentos'
      ],
      workflows: ['Borrador → Revisión Inicial → Aprobación → Implementación → Publicación']
    },
    {
      name: 'Solicitudes de Compra',
      icon: <FaShoppingCart className="text-orange-600" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Proceso de adquisiciones y compras',
      features: [
        'Creación de solicitudes',
        'Aprobaciones por workflow',
        'Presupuesto y centros de costo',
        'Archivos adjuntos',
        'Comentarios y seguimiento',
        'Estados de aprobación',
        'Historial de solicitudes',
        'Reportes de compras',
        'Catálogo de proveedores',
        'Órdenes de compra'
      ],
      workflows: ['Borrador → Enviado → Aprobación Manager → Aprobación Compras → Ordenado → Recibido']
    },
    {
      name: 'Actas de Entrega',
      icon: <FaIdCard className="text-cyan-500" />,
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      description: 'Documentación de entregas de equipos y bienes',
      features: [
        'Creación de actas de entrega',
        'Firma digital de recibidos',
        'Inventario detallado',
        'Condiciones de entrega',
        'Responsables y testigos',
        'Historial de entregas',
        'Plantillas de actas',
        'Reposición de equipos',
        'Reportes de entregas',
        'Integración con inventario'
      ],
      workflows: ['Borrador → Firmado → Entregado → Archivado']
    },
    {
      name: 'Credenciales',
      icon: <FaKey className="text-yellow-600" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Almacenamiento seguro de credenciales y accesos',
      features: [
        'Almacenamiento cifrado',
        'Organización por carpetas',
        'Control de acceso por roles',
        'Historial de accesos',
        'Compartición segura',
        'Notas y documentación',
        'Vencimiento de credenciales',
        'Auditoría de uso',
        'Búsqueda avanzada',
        'Exportación cifrada'
      ],
      workflows: ['Creado → Asignado → En Uso → Caducado']
    },
    {
      name: 'Usuarios',
      icon: <FaUsers className="text-gray-600" />,
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      description: 'Gestión de usuarios del sistema',
      features: [
        'Creación de usuarios',
        'Asignación de roles',
        'Gestión de permisos',
        'Perfiles de usuario',
        'Configuraciones personales',
        'Historial de sesiones',
        'Restablecimiento de contraseña',
        'Bloqueo/desbloqueo de usuarios',
        'Autenticación de dos factores',
        'Importación masiva'
      ],
      workflows: ['Creado → Activo → Inactivo → Eliminado']
    },
    {
      name: 'Roles',
      icon: <FaShieldAlt className="text-purple-600" />,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Configuración de roles y permisos',
      features: [
        'Definición de roles',
        'Asignación de permisos',
        'Jerarquía de roles',
        'Roles predefinidos',
        'Personalización de permisos',
        'Auditoría de cambios',
        'Plantillas de roles',
        'Copiar permisos',
        'Exportar/importar roles',
        'Verificación de permisos'
      ],
      workflows: ['Creado → Activo → Modificado → Desactivado']
    },
    {
      name: 'Papelera',
      icon: <FaDumpster className="text-red-500" />,
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Sistema de recuperación de elementos eliminados',
      features: [
        'Recuperación de elementos',
        'Eliminación permanente',
        'Búsqueda en papelera',
        'Filtros por módulo',
        'Detalles de eliminación',
        'Restauración con dependencias',
        'Vaciado de papelera',
        'Estadísticas de uso',
        'Limpieza automática',
        'Historial de restauraciones'
      ],
      workflows: ['Eliminado → En Papelera → Restaurado/Permanentemente Eliminado']
    },
    {
      name: 'Dashboard',
      icon: <FaChartBar className="text-indigo-600" />,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Panel de control y estadísticas',
      features: [
        'Métricas en tiempo real',
        'Gráficos interactivos',
        'Tickets por estado',
        'Tickets por prioridad',
        'Tiempo promedio de resolución',
        'Inventario por categoría',
        'Solicitudes pendientes',
        'Actividad reciente',
        'Reportes exportables',
        'Filtros de fecha'
      ],
      workflows: ['Datos en tiempo real → Actualización automática']
    }
  ];

  return (
    <div className={conditionalClasses({
      light: 'min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100',
      dark: 'min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900'
    })}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaQuestionCircle className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h1 className={conditionalClasses({
                light: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
                dark: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100'
              })}>Centro de Ayuda DuvyClass</h1>
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
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                onClick={() => setActiveTab('roles')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'roles'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Roles y Permisos
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'modules'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Módulos
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'trash'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Papelera
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'manual' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FaBook className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Manual de Usuario Completo</h2>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-linear-to-r from-[#662d91] to-[#8e4dbf] rounded-xl shadow-lg p-6 mb-6',
                  dark: 'bg-linear-to-r from-[#4a1f6b] to-[#6b3590] rounded-xl shadow-lg p-6 mb-6'
                })}>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shrink-0">
                      <FaBook className="text-white text-2xl" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Manual de Usuario - DuvyClass</h3>
                      <p className="text-purple-100 mt-1 text-sm sm:text-base">Sistema IT de Gestión Empresarial Integral</p>
                      <p className="text-purple-200 text-xs sm:text-sm mt-2">Versión 2.0 | Actualizado: Febrero 2026</p>
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaList className="text-[#662d91] mr-2" />
                    Tabla de Contenidos
                  </summary>
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <ul className="space-y-2">
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>1. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Introducción al Sistema</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>2. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Primeros Pasos</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>3. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Navegación y Interfaz</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>4. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Roles y Permisos</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>5. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Módulos del Sistema</span></li>
                      </ul>
                      <ul className="space-y-2">
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>6. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Guía de Tickets</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>7. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Gestión de Inventario</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>8. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Documentos y Cambios</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>9. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Solicitudes de Compra</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>10. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Gestión de Calidad</span></li>
                        <li><span className={conditionalClasses({ light: 'text-[#662d91]', dark: 'text-purple-400' })}>11. </span><span className={conditionalClasses({ light: 'text-gray-700', dark: 'text-gray-300' })}>Tips y Mejores Prácticas</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaRocket className="text-[#662d91] mr-2" />
                    1. Introducción al Sistema
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <p className={conditionalClasses({
                      light: 'text-gray-700',
                      dark: 'text-gray-300'
                    })}>
                      DuvyClass es una plataforma web integral para la gestión tecnológica empresarial, diseñada para centralizar 
                      todos los procesos de soporte técnico, inventario IT, documentación, credenciales y gestión de calidad 
                      en una interfaz moderna, segura y eficiente.
                    </p>
                    
                    <div className={conditionalClasses({
                      light: 'bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500',
                      dark: 'bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500'
                    })}>
                      <h4 className={conditionalClasses({
                        light: 'font-semibold text-blue-900 mb-2 flex items-center',
                        dark: 'font-semibold text-blue-300 mb-2 flex items-center'
                      })}>
                        <FaLightbulb className="mr-2" />
                        ¿Qué es DuvyClass?
                      </h4>
                      <p className={conditionalClasses({
                        light: 'text-blue-800 text-sm',
                        dark: 'text-blue-200 text-sm'
                      })}>
                        Es un sistema todo-en-uno que permite gestionar recursos tecnológicos, soporte técnico, 
                        documentación empresarial, credenciales de acceso, inventario de equipos y procesos de calidad 
                        desde una única plataforma integrada.
                      </p>
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>Beneficios Principales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { icon: '🗂️', text: 'Centralización completa' },
                        { icon: '⚡', text: 'Eficiencia operativa' },
                        { icon: '🔒', text: 'Seguridad avanzada' },
                        { icon: '📊', text: 'Trazabilidad total' },
                        { icon: '💬', text: 'Colaboración en tiempo real' },
                        { icon: '📱', text: 'Accesibilidad universal' },
                        { icon: '📈', text: 'Reportes y estadísticas' },
                        { icon: '♻️', text: 'Recuperación de datos' },
                        { icon: '🔄', text: 'Workflows automatizados' }
                      ].map((item, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-gray-50 p-3 rounded-lg flex items-center',
                          dark: 'bg-gray-700 p-3 rounded-lg flex items-center'
                        })}>
                          <span className="text-xl mr-2">{item.icon}</span>
                          <span className={conditionalClasses({
                            light: 'text-sm text-gray-700',
                            dark: 'text-sm text-gray-300'
                          })}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaSignInAlt className="text-green-500 mr-2" />
                    2. Primeros Pasos
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>2.1 Inicio de Sesión</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Acceda a la URL del sistema proporcionada por su administrador</li>
                      <li>Ingrese su correo electrónico institucional</li>
                      <li>Ingrese su contraseña</li>
                      <li>Haga clic en "Iniciar Sesión"</li>
                      <li>Si tiene 2FA habilitado, ingrese el código de verificación</li>
                    </ol>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>2.2 Configuración Inicial</h4>
                    <ul className={conditionalClasses({
                      light: 'list-disc list-inside space-y-2 text-gray-700',
                      dark: 'list-disc list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Complete su perfil de usuario con información de contacto</li>
                      <li>Configure sus preferencias de notificación</li>
                      <li>Seleccione el tema de interfaz (claro/oscuro)</li>
                      <li>Revise los módulos disponibles según su rol</li>
                    </ul>

                    <div className={conditionalClasses({
                      light: 'bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500',
                      dark: 'bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-500'
                    })}>
                      <h4 className={conditionalClasses({
                        light: 'font-semibold text-yellow-900 mb-2 flex items-center',
                        dark: 'font-semibold text-yellow-300 mb-2 flex items-center'
                      })}>
                        <FaExclamationTriangle className="mr-2" />
                        Recuperación de Contraseña
                      </h4>
                      <p className={conditionalClasses({
                        light: 'text-yellow-800 text-sm',
                        dark: 'text-yellow-200 text-sm'
                      })}>
                        Si olvidó su contraseña, haga clic en "¿Olvidó su contraseña?" en la pantalla de inicio 
                        de sesión. Recibirá un enlace de recuperación en su correo electrónico registrado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaCompass className="text-[#662d91] mr-2" />
                    3. Navegación y Interfaz
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>3.1 Estructura de la Interfaz</h4>
                    <div className={conditionalClasses({
                      light: 'bg-gray-50 p-4 rounded-lg',
                      dark: 'bg-gray-700 p-4 rounded-lg'
                    })}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className={conditionalClasses({
                            light: 'font-medium text-gray-900 mb-2',
                            dark: 'font-medium text-gray-100 mb-2'
                          })}>Barra Superior</h5>
                          <ul className={conditionalClasses({
                            light: 'text-sm text-gray-600 space-y-1',
                            dark: 'text-sm text-gray-300 space-y-1'
                          })}>
                            <li>• Logo de DuvyClass</li>
                            <li>• Búsqueda global</li>
                            <li>• Notificaciones</li>
                            <li>• Menú de usuario</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={conditionalClasses({
                            light: 'font-medium text-gray-900 mb-2',
                            dark: 'font-medium text-gray-100 mb-2'
                          })}>Barra Lateral</h5>
                          <ul className={conditionalClasses({
                            light: 'text-sm text-gray-600 space-y-1',
                            dark: 'text-sm text-gray-300 space-y-1'
                          })}>
                            <li>• Dashboard</li>
                            <li>• Tickets</li>
                            <li>• Inventario</li>
                            <li>• Documentos</li>
                            <li>• Más opciones...</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={conditionalClasses({
                            light: 'font-medium text-gray-900 mb-2',
                            dark: 'font-medium text-gray-100 mb-2'
                          })}>Área Principal</h5>
                          <ul className={conditionalClasses({
                            light: 'text-sm text-gray-600 space-y-1',
                            dark: 'text-sm text-gray-300 space-y-1'
                          })}>
                            <li>• Contenido del módulo</li>
                            <li>• Tablas y listas</li>
                            <li>• Formularios</li>
                            <li>• Modales y paneles</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>3.2 Atajos de Teclado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { keys: 'Ctrl + K', action: 'Búsqueda rápida' },
                        { keys: 'Ctrl + N', action: 'Nuevo ticket' },
                        { keys: 'Esc', action: 'Cerrar modal' },
                        { keys: 'Ctrl + B', action: 'Alternar barra lateral' },
                        { keys: 'Ctrl + D', action: 'Cambiar tema' }
                      ].map((shortcut, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-white p-2 rounded border flex justify-between',
                          dark: 'bg-gray-700 p-2 rounded border border-gray-600 flex justify-between'
                        })}>
                          <span className={conditionalClasses({
                            light: 'text-gray-600 text-sm',
                            dark: 'text-gray-300 text-sm'
                          })}>{shortcut.action}</span>
                          <kbd className={conditionalClasses({
                            light: 'bg-gray-100 px-2 py-0.5 rounded text-xs font-mono',
                            dark: 'bg-gray-600 px-2 py-0.5 rounded text-xs font-mono text-gray-200'
                          })}>{shortcut.keys}</kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaTicketAlt className="text-[#662d91] mr-2" />
                    4. Guía Completa de Tickets
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>4.1 Crear un Ticket</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Haga clic en "Nuevo Ticket" en la sección de Tickets</li>
                      <li>Seleccione la categoría del problema</li>
                      <li>Ingrese un título descriptivo</li>
                      <li>Escriba una descripción detallada del problema</li>
                      <li>Seleccione la prioridad (Baja, Media, Alta, Crítica)</li>
                      <li>Adjunte archivos si es necesario</li>
                      <li>Haga clic en "Crear Ticket"</li>
                    </ol>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>4.2 Estados de un Ticket</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      {[
                        { state: 'Nuevo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' },
                        { state: 'Asignado', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' },
                        { state: 'En Progreso', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' },
                        { state: 'Esperando', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' },
                        { state: 'Resuelto', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' },
                        { state: 'Cerrado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' }
                      ].map((status, idx) => (
                        <div key={idx} className={`p-2 rounded text-center text-xs ${status.color}`}>
                          {status.state}
                        </div>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>4.3 Prioridades</h4>
                    <div className="space-y-2">
                      {[
                        { priority: 'Baja', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200', desc: 'Problema menor, sin urgencia' },
                        { priority: 'Media', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200', desc: 'Problema regular, resolver en 24-48h' },
                        { priority: 'Alta', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200', desc: 'Problema importante, resolver hoy' },
                        { priority: 'Crítica', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200', desc: 'Urgente, afecta operaciones' }
                      ].map((pri, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'flex items-center p-2 bg-gray-50 rounded',
                          dark: 'flex items-center p-2 bg-gray-700/50 rounded'
                        })}>
                          <div className={`w-3 h-3 rounded-full ${pri.color.split(' ')[0]} mr-2`}></div>
                          <span className={conditionalClasses({
                            light: 'font-medium text-gray-900 mr-2',
                            dark: 'font-medium text-gray-100 mr-2'
                          })}>{pri.priority}</span>
                          <span className={conditionalClasses({
                            light: 'text-sm text-gray-600',
                            dark: 'text-sm text-gray-300'
                          })}>{pri.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaBox className="text-blue-600 mr-2" />
                    5. Gestión de Inventario
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>5.1 Tipos de Inventario</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Inventario General', icon: <FaBox />, desc: 'Equipos de cómputo, periféricos, monitores' },
                        { name: 'Tablets', icon: <FaMobile />, desc: 'Dispositivos tablets corporativas' },
                        { name: 'PDAs', icon: <FaMobile />, desc: 'Dispositivos de captura de datos' },
                        { name: 'Teléfonos', icon: <FaPhone />, desc: 'Líneas móviles corporativas' }
                      ].map((inv, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-gray-50 p-4 rounded-lg border',
                          dark: 'bg-gray-700 p-4 rounded-lg border border-gray-600'
                        })}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#662d91]">{inv.icon}</span>
                            <h5 className={conditionalClasses({
                              light: 'font-medium text-gray-900',
                              dark: 'font-medium text-gray-100'
                            })}>{inv.name}</h5>
                          </div>
                          <p className={conditionalClasses({
                            light: 'text-sm text-gray-600',
                            dark: 'text-sm text-gray-300'
                          })}>{inv.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>5.2 Registrar un Nuevo Activo</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Vaya al módulo de Inventario correspondiente</li>
                      <li>Haga clic en "Agregar" o "Nuevo Activo"</li>
                      <li>Complete los campos obligatorios: Código único, nombre, marca, modelo, serie, fecha, valor, ubicación</li>
                      <li>Guarde el activo</li>
                    </ol>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaFileAlt className="text-green-600 mr-2" />
                    6. Documentos y Solicitudes de Cambio
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>6.1 Subir un Documento</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Navegue a la sección Documentos</li>
                      <li>Seleccione la carpeta donde desea guardar</li>
                      <li>Haga clic en "Subir Documento"</li>
                      <li>Seleccione el archivo de su computadora</li>
                      <li>Ingrese título, descripción y categoría</li>
                      <li>Configure los permisos de acceso</li>
                      <li>Guarde el documento</li>
                    </ol>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>6.2 Solicitar un Cambio</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Vaya a "Solicitudes de Cambio"</li>
                      <li>Haga clic en "Nueva Solicitud"</li>
                      <li>Seleccione el documento a modificar</li>
                      <li>Describa el cambio y justifique</li>
                      <li>Analice el impacto del cambio</li>
                      <li>Envíe para aprobación</li>
                    </ol>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaShoppingCart className="text-orange-600 mr-2" />
                    7. Solicitudes de Compra
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900',
                      dark: 'font-semibold text-gray-100'
                    })}>7.1 Crear una Solicitud</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Vaya a "Solicitudes de Compra"</li>
                      <li>Haga clic en "Nueva Solicitud"</li>
                      <li>Seleccione el centro de costo</li>
                      <li>Ingrese la justificación de la compra</li>
                      <li>Agregue los items requeridos</li>
                      <li>Adjunte cotizaciones si aplica</li>
                      <li>Envíe para aprobación</li>
                    </ol>

                    <div className={conditionalClasses({
                      light: 'bg-gray-50 p-4 rounded-lg',
                      dark: 'bg-gray-700 p-4 rounded-lg'
                    })}>
                      <h5 className={conditionalClasses({
                        light: 'font-medium text-gray-900 mb-2',
                        dark: 'font-medium text-gray-100 mb-2'
                      })}>Workflow de Aprobación</h5>
                      <div className="flex flex-wrap items-center gap-2">
                        {['Borrador', 'Enviado', 'Jefe', 'Compras', 'Ordenado', 'Recibido'].map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className={conditionalClasses({
                              light: 'bg-white px-3 py-1 rounded border text-sm',
                              dark: 'bg-gray-600 px-3 py-1 rounded border text-sm text-gray-200'
                            })}>{step}</div>
                            {idx < 5 && <span className="text-gray-400">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaClipboardCheck className="text-teal-500 mr-2" />
                    8. Gestión de Calidad
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <p className={conditionalClasses({
                      light: 'text-gray-700',
                      dark: 'text-gray-300'
                    })}>
                      El módulo de Calidad permite gestionar no conformidades, auditorías y acciones correctivas 
                      para mantener los estándares de la organización bajo la norma ISO 9001.
                    </p>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.1 Módulos de Calidad</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Tickets de Calidad', icon: <FaClipboardCheck />, desc: 'Gestión de NCR, auditorías y CAPA' },
                        { name: 'Cambios Documentales', icon: <FaEdit />, desc: 'Workflow de cambios ISO 9001' },
                        { name: 'Dashboard', icon: <FaChartBar />, desc: 'Métricas e indicadores en tiempo real' }
                      ].map((mod, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-teal-50 p-3 rounded-lg border border-teal-200',
                          dark: 'bg-teal-900/30 p-3 rounded-lg border border-teal-700'
                        })}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-teal-600">{mod.icon}</span>
                            <h5 className={conditionalClasses({
                              light: 'font-medium text-teal-900',
                              dark: 'font-medium text-teal-200'
                            })}>{mod.name}</h5>
                          </div>
                          <p className={conditionalClasses({
                            light: 'text-sm text-teal-700',
                            dark: 'text-sm text-teal-300'
                          })}>{mod.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.2 Tipos de Registros de Calidad</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { type: 'No Conformidad (NCR)', desc: 'Desviación de un estándar o requisito', severity: 'Alta' },
                        { type: 'Auditoría', desc: 'Revisión programada o extraordinaria', severity: 'Media' },
                        { type: 'Acción Correctiva (CAPA)', desc: 'Corrección de causa raíz identificada', severity: 'Alta' },
                        { type: 'Mejora Continua', desc: 'Optimización de procesos existentes', severity: 'Baja' }
                      ].map((item, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-gray-50 p-3 rounded border',
                          dark: 'bg-gray-700 p-3 rounded border border-gray-600'
                        })}>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className={conditionalClasses({
                              light: 'font-medium text-gray-900',
                              dark: 'font-medium text-gray-100'
                            })}>{item.type}</h5>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              item.severity === 'Alta' ? 'bg-red-100 text-red-800' :
                              item.severity === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>{item.severity}</span>
                          </div>
                          <p className={conditionalClasses({
                            light: 'text-sm text-gray-600',
                            dark: 'text-sm text-gray-300'
                          })}>{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.3 Crear un Ticket de Calidad</h4>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300'
                    })}>
                      <li>Vaya al módulo "Tickets de Calidad" desde el menú lateral</li>
                      <li>Haga clic en "Nuevo Ticket de Calidad"</li>
                      <li>Seleccione el tipo: No Conformidad, Auditoría, CAPA o Mejora</li>
                      <li>Ingrese un título descriptivo del problema</li>
                      <li>Describa detalladamente la no conformidd o hallazgo</li>
                      <li>Identifique el proceso o área afectada</li>
                      <li>Establezca la prioridad (Baja, Media, Alta, Crítica)</li>
                      <li>Adjunte evidencias si es necesario</li>
                      <li>Guarde el ticket para iniciar el workflow</li>
                    </ol>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.4 Workflow de Tickets de Calidad</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {['Detectado', 'En Análisis', 'Acción Correctiva', 'Verificación', 'Cerrado'].map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className={conditionalClasses({
                            light: 'bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-sm font-medium',
                            dark: 'bg-teal-900/50 text-teal-300 px-3 py-1.5 rounded-lg text-sm font-medium'
                          })}>{step}</div>
                          {idx < 4 && <span className="text-gray-400">→</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.5 Solicitudes de Cambio Documental</h4>
                    <p className={conditionalClasses({
                      light: 'text-gray-700 text-sm',
                      dark: 'text-gray-300 text-sm'
                    })}>
                      Las solicitudes de cambio permiten modificar documentos del sistema bajo el proceso 
                      ISO 9001 de control de documentos y registros.
                    </p>
                    <ol className={conditionalClasses({
                      light: 'list-decimal list-inside space-y-2 text-gray-700 mt-2',
                      dark: 'list-decimal list-inside space-y-2 text-gray-300 mt-2'
                    })}>
                      <li>Vaya a "Solicitudes de Cambio" en el menú de Calidad</li>
                      <li>Cliquez en "Nueva Solicitud de Cambio"</li>
                      <li>Seleccione el tipo de cambio (Crear, Modificar, Eliminar, Actualizar versión)</li>
                      <li>Elija el documento afectado o cree uno nuevo</li>
                      <li>Proporcione una justificación detallada (mínimo 10 caracteres)</li>
                      <li>Realice el análisis de impacto del cambio</li>
                      <li>Suba el archivo propuesto si aplica</li>
                      <li>Envíe para revisión por el área de Calidad</li>
                    </ol>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.6 Workflow de Cambios Documentales</h4>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {['Borrador', 'Revisión Inicial', 'Aprobación', 'Implementación', 'Publicado'].map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className={conditionalClasses({
                            light: 'bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-sm font-medium',
                            dark: 'bg-red-900/50 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium'
                          })}>{step}</div>
                          {idx < 4 && <span className="text-gray-400">→</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className={conditionalClasses({
                      light: 'bg-blue-50 p-3 rounded-lg',
                      dark: 'bg-blue-900/30 p-3 rounded-lg'
                    })}>
                      <h5 className={conditionalClasses({
                        light: 'font-medium text-blue-900 mb-2',
                        dark: 'font-medium text-blue-300 mb-2'
                      })}>Roles en el Workflow de Cambios</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className={conditionalClasses({
                          light: 'bg-white p-2 rounded',
                          dark: 'bg-gray-800 p-2 rounded'
                        })}>
                          <span className={conditionalClasses({
                            light: 'font-medium text-blue-800',
                            dark: 'font-medium text-blue-400'
                          })}>Calidad:</span> Revisión inicial y análisis
                        </div>
                        <div className={conditionalClasses({
                          light: 'bg-white p-2 rounded',
                          dark: 'bg-gray-800 p-2 rounded'
                        })}>
                          <span className={conditionalClasses({
                            light: 'font-medium text-purple-800',
                            dark: 'font-medium text-purple-400'
                          })}>Jefe:</span> Aprobación del cambio
                        </div>
                        <div className={conditionalClasses({
                          light: 'bg-white p-2 rounded',
                          dark: 'bg-gray-800 p-2 rounded'
                        })}>
                          <span className={conditionalClasses({
                            light: 'font-medium text-yellow-800',
                            dark: 'font-medium text-yellow-400'
                          })}>Administrador:</span> Implementación y publicación
                        </div>
                      </div>
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.7 Indicadores de Calidad (KPI)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { kpi: 'NCR', desc: 'No Conformidades Registradas' },
                        { kpi: 'CAPA', desc: 'Acciones Correctivas' },
                        { kpi: 'AUD', desc: 'Auditorías Realizadas' },
                        { kpi: 'MEJ', desc: 'Mejoras Implementadas' }
                      ].map((kpi, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-teal-50 p-2 rounded text-center',
                          dark: 'bg-teal-900/30 p-2 rounded text-center'
                        })}>
                          <div className={conditionalClasses({
                            light: 'text-lg font-bold text-teal-800',
                            dark: 'text-lg font-bold text-teal-300'
                          })}>{kpi.kpi}</div>
                          <div className={conditionalClasses({
                            light: 'text-xs text-teal-600',
                            dark: 'text-xs text-teal-400'
                          })}>{kpi.desc}</div>
                        </div>
                      ))}
                    </div>

                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-gray-900 mt-4',
                      dark: 'font-semibold text-gray-100 mt-4'
                    })}>8.8 Dashboard de Calidad</h4>
                    <p className={conditionalClasses({
                      light: 'text-gray-700 text-sm',
                      dark: 'text-gray-300 text-sm'
                    })}>
                      El dashboard muestra métricas en tiempo real de todos los procesos de calidad.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        { metric: 'Total Tickets', icon: <FaClipboardList /> },
                        { metric: 'Abiertos', icon: <FaExclamationTriangle /> },
                        { metric: 'Cerrados', icon: <FaCheck /> },
                        { metric: 'En Progreso', icon: <FaChartLine /> }
                      ].map((m, idx) => (
                        <div key={idx} className={conditionalClasses({
                          light: 'bg-white p-2 rounded border text-center',
                          dark: 'bg-gray-700 p-2 rounded border border-gray-600 text-center'
                        })}>
                          <div className="text-teal-600 mb-1">{m.icon}</div>
                          <div className={conditionalClasses({
                            light: 'text-xs text-gray-600',
                            dark: 'text-xs text-gray-400'
                          })}>{m.metric}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={conditionalClasses({
                  light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                  dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                })}>
                  <summary className={conditionalClasses({
                    light: 'cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center',
                    dark: 'cursor-pointer p-4 font-medium text-gray-100 hover:bg-gray-700 flex items-center'
                  })}>
                    <FaLightbulb className="text-yellow-500 mr-2" />
                    9. Tips y Mejores Prácticas
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={conditionalClasses({
                        light: 'bg-green-50 p-4 rounded-lg',
                        dark: 'bg-green-900/30 p-4 rounded-lg'
                      })}>
                        <h4 className={conditionalClasses({
                          light: 'font-semibold text-green-900 mb-2',
                          dark: 'font-semibold text-green-300 mb-2'
                        })}>Para Usuarios</h4>
                        <ul className={conditionalClasses({
                          light: 'text-sm text-green-800 space-y-1',
                          dark: 'text-sm text-green-200 space-y-1'
                        })}>
                          <li>• Sea específico al crear tickets</li>
                          <li>• Incluya capturas de pantalla</li>
                          <li>• Respete los tiempos de respuesta</li>
                          <li>• Mantenga sus datos actualizados</li>
                          <li>• Use los filtros para buscar</li>
                        </ul>
                      </div>
                      <div className={conditionalClasses({
                        light: 'bg-blue-50 p-4 rounded-lg',
                        dark: 'bg-blue-900/30 p-4 rounded-lg'
                      })}>
                        <h4 className={conditionalClasses({
                          light: 'font-semibold text-blue-900 mb-2',
                          dark: 'font-semibold text-blue-300 mb-2'
                        })}>Para Técnicos</h4>
                        <ul className={conditionalClasses({
                          light: 'text-sm text-blue-800 space-y-1',
                          dark: 'text-sm text-blue-200 space-y-1'
                        })}>
                          <li>• Actualice estados regularmente</li>
                          <li>• Documente las soluciones</li>
                          <li>• Comunique demoras anticipadamente</li>
                          <li>• Use plantillas de respuestas</li>
                          <li>• Cierre tickets correctamente</li>
                        </ul>
                      </div>
                      <div className={conditionalClasses({
                        light: 'bg-purple-50 p-4 rounded-lg',
                        dark: 'bg-purple-900/30 p-4 rounded-lg'
                      })}>
                        <h4 className={conditionalClasses({
                          light: 'font-semibold text-purple-900 mb-2',
                          dark: 'font-semibold text-purple-300 mb-2'
                        })}>Para Administradores</h4>
                        <ul className={conditionalClasses({
                          light: 'text-sm text-purple-800 space-y-1',
                          dark: 'text-sm text-purple-200 space-y-1'
                        })}>
                          <li>• Revise métricas semanalmente</li>
                          <li>• Monitoree la papelera</li>
                          <li>• Actualice documentos del sistema</li>
                          <li>• Gestione usuarios inactivos</li>
                          <li>• Realice backups regulares</li>
                        </ul>
                      </div>
                      <div className={conditionalClasses({
                        light: 'bg-yellow-50 p-4 rounded-lg',
                        dark: 'bg-yellow-900/30 p-4 rounded-lg'
                      })}>
                        <h4 className={conditionalClasses({
                          light: 'font-semibold text-yellow-900 mb-2',
                          dark: 'font-semibold text-yellow-300 mb-2'
                        })}>Errores Comunes a Evitar</h4>
                        <ul className={conditionalClasses({
                          light: 'text-sm text-yellow-800 space-y-1',
                          dark: 'text-sm text-yellow-200 space-y-1'
                        })}>
                          <li>• No compartir contraseñas</li>
                          <li>• No dejar tickets sin actualizar</li>
                          <li>• No eliminar sin verificar</li>
                          <li>• No ignorar notificaciones</li>
                          <li>• No crear tickets duplicados</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FaShieldAlt className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Roles y Permisos</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {roles.map((role, idx) => (
                    <div key={idx} className={conditionalClasses({
                      light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                      dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                    })}>
                      <div className={conditionalClasses({
                        light: 'bg-gray-50 p-4 flex items-start gap-4',
                        dark: 'bg-gray-700 p-4 flex items-start gap-4'
                      })}>
                        <div className={`p-3 rounded-lg ${conditionalClasses({
                          light: role.color,
                          dark: role.color.replace('bg-', 'bg-opacity-50 ').replace('100', '800')
                        })}`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={conditionalClasses({
                            light: 'text-lg font-semibold text-gray-900',
                            dark: 'text-lg font-semibold text-gray-100'
                          })}>{role.name}</h3>
                          <p className={conditionalClasses({
                            light: 'text-sm text-gray-600 mt-1',
                            dark: 'text-sm text-gray-300 mt-1'
                          })}>{role.description}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className={conditionalClasses({
                          light: 'font-medium text-gray-900 mb-2 text-sm',
                          dark: 'font-medium text-gray-100 mb-2 text-sm'
                        })}>Permisos:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          {role.permissions.map((perm, pidx) => (
                            <div key={pidx} className={conditionalClasses({
                              light: 'flex items-center text-sm text-gray-700',
                              dark: 'flex items-center text-sm text-gray-300'
                            })}>
                              <FaCheck className="text-green-500 mr-2 text-xs" />
                              {perm}
                            </div>
                          ))}
                        </div>
                        <h4 className={conditionalClasses({
                          light: 'font-medium text-gray-900 mb-2 text-sm',
                          dark: 'font-medium text-gray-100 mb-2 text-sm'
                        })}>Módulos accesibles:</h4>
                        <div className="flex flex-wrap gap-2">
                          {role.modules.map((mod, midx) => (
                            <span key={midx} className={conditionalClasses({
                              light: 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs',
                              dark: 'bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs'
                            })}>{mod}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FaList className="text-[#662d91] text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Módulos del Sistema</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module, idx) => (
                    <div key={idx} className={conditionalClasses({
                      light: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                      dark: 'bg-gray-800 border border-gray-600 rounded-lg shadow-sm'
                    })}>
                      <div className={conditionalClasses({
                        light: 'p-4 border-b border-gray-200 flex items-center gap-3',
                        dark: 'p-4 border-b border-gray-600 flex items-center gap-3'
                      })}>
                        <div className={`p-2 rounded-lg ${conditionalClasses({
                          light: module.color,
                          dark: module.color.replace('bg-', 'bg-opacity-50 ').replace('100', '800')
                        })}`}>
                          {module.icon}
                        </div>
                        <div>
                          <h3 className={conditionalClasses({
                            light: 'font-medium text-gray-900',
                            dark: 'font-medium text-gray-100'
                          })}>{module.name}</h3>
                          <p className={conditionalClasses({
                            light: 'text-xs text-gray-500',
                            dark: 'text-xs text-gray-400'
                          })}>{module.description}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className={conditionalClasses({
                          light: 'font-medium text-gray-900 mb-2 text-xs uppercase tracking-wide',
                          dark: 'font-medium text-gray-100 mb-2 text-xs uppercase tracking-wide'
                        })}>Características:</h4>
                        <ul className="space-y-1 mb-3">
                          {module.features.slice(0, 5).map((feat, fid) => (
                            <li key={fid} className={conditionalClasses({
                              light: 'flex items-center text-sm text-gray-600',
                              dark: 'flex items-center text-sm text-gray-300'
                            })}>
                              <span className="w-1 h-1 bg-[#662d91] rounded-full mr-2"></span>
                              {feat}
                            </li>
                          ))}
                        </ul>
                        <div className={conditionalClasses({
                          light: 'bg-gray-50 p-2 rounded text-xs',
                          dark: 'bg-gray-700 p-2 rounded text-xs'
                        })}>
                          <span className={conditionalClasses({
                            light: 'font-medium text-gray-700',
                            dark: 'font-medium text-gray-300'
                          })}>Workflow: </span>
                          <span className={conditionalClasses({
                            light: 'text-gray-600',
                            dark: 'text-gray-400'
                          })}>{module.workflows[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trash' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FaDumpster className="text-red-500 text-2xl mr-3" />
                  <h2 className={conditionalClasses({
                    light: 'text-xl font-semibold text-gray-900',
                    dark: 'text-xl font-semibold text-gray-100'
                  })}>Sistema de Papelera</h2>
                </div>

                <div className="space-y-4">
                  <div className={conditionalClasses({
                    light: 'bg-red-50 p-4 rounded-lg border-l-4 border-red-500',
                    dark: 'bg-red-900/30 p-4 rounded-lg border-l-4 border-red-500'
                  })}>
                    <h3 className={conditionalClasses({
                      light: 'font-semibold text-red-900 mb-2',
                      dark: 'font-semibold text-red-300 mb-2'
                    })}>¿Qué es la Papelera?</h3>
                    <p className={conditionalClasses({
                      light: 'text-red-800 text-sm',
                      dark: 'text-red-200 text-sm'
                    })}>
                      El sistema de papelera permite recuperar elementos eliminados accidentalmente. 
                      Todos los elementos eliminados van a la papelera en lugar de eliminarse permanentemente, 
                      dando una oportunidad de recuperación durante 30 días.
                    </p>
                  </div>

                  <h3 className={conditionalClasses({
                    light: 'font-semibold text-gray-900 mt-4',
                    dark: 'font-semibold text-gray-100 mt-4'
                  })}>Módulos Compatibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Tickets', 'Usuarios', 'Inventario', 'Documentos', 'Credenciales', 'Teléfonos', 'Tablets', 'PDAs', 'Actas', 'Calidad', 'Solicitudes'].map((mod, idx) => (
                      <div key={idx} className={conditionalClasses({
                        light: 'bg-gray-100 p-2 rounded text-center text-sm',
                        dark: 'bg-gray-700 p-2 rounded text-center text-sm'
                      })}>
                        <span className={conditionalClasses({
                          light: 'text-gray-700',
                          dark: 'text-gray-300'
                        })}>{mod}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className={conditionalClasses({
                    light: 'font-semibold text-gray-900 mt-4',
                    dark: 'font-semibold text-gray-100 mt-4'
                  })}>Acciones Disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={conditionalClasses({
                      light: 'bg-green-50 p-4 rounded-lg text-center',
                      dark: 'bg-green-900/30 p-4 rounded-lg text-center'
                    })}>
                      <FaUndo className="text-green-500 text-2xl mx-auto mb-2" />
                      <h4 className={conditionalClasses({
                        light: 'font-medium text-green-900',
                        dark: 'font-medium text-green-300'
                      })}>Restaurar</h4>
                      <p className={conditionalClasses({
                        light: 'text-sm text-green-700',
                        dark: 'text-sm text-green-400'
                      })}>Recupera el elemento a su módulo original</p>
                    </div>
                    <div className={conditionalClasses({
                      light: 'bg-red-50 p-4 rounded-lg text-center',
                      dark: 'bg-red-900/30 p-4 rounded-lg text-center'
                    })}>
                      <FaTrash className="text-red-500 text-2xl mx-auto mb-2" />
                      <h4 className={conditionalClasses({
                        light: 'font-medium text-red-900',
                        dark: 'font-medium text-red-300'
                      })}>Eliminar</h4>
                      <p className={conditionalClasses({
                        light: 'text-sm text-red-700',
                        dark: 'text-sm text-red-400'
                      })}>Eliminación permanente e irreversible</p>
                    </div>
                    <div className={conditionalClasses({
                      light: 'bg-blue-50 p-4 rounded-lg text-center',
                      dark: 'bg-blue-900/30 p-4 rounded-lg text-center'
                    })}>
                      <FaEye className="text-blue-500 text-2xl mx-auto mb-2" />
                      <h4 className={conditionalClasses({
                        light: 'font-medium text-blue-900',
                        dark: 'font-medium text-blue-300'
                      })}>Ver Detalles</h4>
                      <p className={conditionalClasses({
                        light: 'text-sm text-blue-700',
                        dark: 'text-sm text-blue-400'
                      })}>Información completa del elemento</p>
                    </div>
                  </div>

                  <div className={conditionalClasses({
                    light: 'bg-yellow-50 p-4 rounded-lg mt-4',
                    dark: 'bg-yellow-900/30 p-4 rounded-lg mt-4'
                  })}>
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-yellow-900 mb-2 flex items-center',
                      dark: 'font-semibold text-yellow-300 mb-2 flex items-center'
                    })}>
                      <FaExclamationTriangle className="mr-2" />
                      Limpieza Automática
                    </h4>
                    <ul className={conditionalClasses({
                      light: 'text-sm text-yellow-800 space-y-1',
                      dark: 'text-sm text-yellow-200 space-y-1'
                    })}>
                      <li>• Se ejecuta cada noche a las 2:00 AM</li>
                      <li>• Elimina elementos después de 30 días</li>
                      <li>• Proceso automático sin intervención manual</li>
                    </ul>
                  </div>

                  <div className={conditionalClasses({
                    light: 'bg-blue-50 p-4 rounded-lg mt-4',
                    dark: 'bg-blue-900/30 p-4 rounded-lg mt-4'
                  })}>
                    <h4 className={conditionalClasses({
                      light: 'font-semibold text-blue-900 mb-2',
                      dark: 'font-semibold text-blue-300 mb-2'
                    })}>Permisos por Rol</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className={conditionalClasses({
                        light: 'bg-white p-2 rounded border',
                        dark: 'bg-gray-800 p-2 rounded border border-gray-600'
                      })}>
                        <span className={conditionalClasses({
                          light: 'font-medium text-red-700',
                          dark: 'font-medium text-red-400'
                        })}>Administrador</span>
                        <p className={conditionalClasses({
                          light: 'text-gray-600 text-xs mt-1',
                          dark: 'text-gray-400 text-xs mt-1'
                        })}>Acceso completo</p>
                      </div>
                      <div className={conditionalClasses({
                        light: 'bg-white p-2 rounded border',
                        dark: 'bg-gray-800 p-2 rounded border border-gray-600'
                      })}>
                        <span className={conditionalClasses({
                          light: 'font-medium text-blue-700',
                          dark: 'font-medium text-blue-400'
                        })}>Técnico</span>
                        <p className={conditionalClasses({
                          light: 'text-gray-600 text-xs mt-1',
                          dark: 'text-gray-400 text-xs mt-1'
                        })}>Módulos asignados</p>
                      </div>
                      <div className={conditionalClasses({
                        light: 'bg-white p-2 rounded border',
                        dark: 'bg-gray-800 p-2 rounded border border-gray-600'
                      })}>
                        <span className={conditionalClasses({
                          light: 'font-medium text-green-700',
                          dark: 'font-medium text-green-400'
                        })}>Empleado</span>
                        <p className={conditionalClasses({
                          light: 'text-gray-600 text-xs mt-1',
                          dark: 'text-gray-400 text-xs mt-1'
                        })}>Solo sus elementos</p>
                      </div>
                    </div>
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
