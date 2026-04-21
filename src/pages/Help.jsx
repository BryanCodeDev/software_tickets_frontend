import React, { useState } from 'react';
import { 
  FaQuestionCircle, FaEnvelope, FaPhone, FaBook, FaTicketAlt, FaBox, FaFileAlt, FaKey, 
  FaSearch, FaChartBar, FaSignInAlt, FaTachometerAlt, FaCog, FaUsers, FaShieldAlt, 
  FaExclamationTriangle, FaLightbulb, FaHeadset, FaCrown, FaWrench, FaUser, FaGlobe, 
  FaTimes, FaRocket, FaBullseye, FaLock, FaChartLine, FaBolt, FaCheck, FaClipboardList,
  FaClipboardCheck, FaDumpster, FaUndo, FaTrash, FaEye, FaHistory, FaTag, FaFolder,
  FaComments, FaPaperclip, FaChartPie, FaServer, FaMobile, FaIdCard, FaBriefcase, FaEdit,
  FaTrashRestore, FaDownload, FaUpload, FaPlus, FaMinus, FaBan, FaStar, FaMedal,
    FaList, FaChevronDown, FaCompass, FaShoppingCart, FaSync, FaUserCog
} from 'react-icons/fa';
import { useThemeClasses } from '../hooks/useThemeClasses';

const Help = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const { conditionalClasses } = useThemeClasses();

  const faqs = [
    {
      question: '¿Cuál es la diferencia entre "Registrar" y "Crear Usuario"?',
      answer: '"Registrar" (Login → ¿Aún no tienes acceso?) es una solicitud externa que redirige a WhatsApp. "Crear Usuario" (sidebar) es una acción interna solo para Admin/Técnico que registra empleados directamente en la base de datos. El segundo no inicia sesión automáticamente, manteniendo la sesión del creador.'
    },
    {
      question: '¿Qué permisos tengo para editar usuarios?',
      answer: 'Los Administradores pueden editar CUALQUIER campo de cualquier usuario: nombre, username, email, contraseña, rol, IT, teléfono corporativo. Los Técnicos pueden editar solo IT y teléfono corporativo (no rol). Los usuarios solo pueden editar su propio perfil (Mi Perfil) sin cambiar rol.'
    },
    {
      question: '¿Cómo funciona la paginación en listados?',
      answer: 'Los listados (tickets, documentos, inventario) usan paginación server-side. El backend devuelve solo la página solicitada (ej: 10-20 items). Usa los controles "Anterior/Siguiente" o los números de página. Esto hace que el sistema sea rápido incluso con miles de registros.'
    },
    {
      question: '¿Por qué al crear un usuario no me desloguea automáticamente?',
      answer: 'El sistema está diseñado para que el Administrador/Técnico mantenga su sesión activa tras crear usuarios. Esto permite crear múltiples usuarios sin interrumpir el trabajo. El endpoint POST /auth/create-user NO devuelve token, solo confirmación de creación. El nuevo usuario debe iniciar sesión por separado con sus propias credenciales.'
    },
    {
      question: '¿Qué diferencias hay entre Registrar usuario y Crear usuario?',
      answer: '"Registrar usuario" (en Login) es para usuarios externos que solicitan acceso: redirige a WhatsApp. "Crear usuario" (en sidebar) es para Administradores/Técnicos que registran empleados internamente: el formulario registra al usuario en la base de datos sin iniciar sesión. El primero es una solicitud, el segundo es una acción directa.'
    },
    {
      question: '¿Cómo funciona la paginación en listados?',
      answer: 'Los listados (tickets, documentos, inventario) usan paginación server-side. El backend devuelve solo la página solicitada (ej: 10-20 items). Usa los controles "Anterior/Siguiente" o los números de página. Esto hace que el sistema sea rápido incluso con miles de registros.'
    },
    {
      question: '¿Qué es el debounce en las búsquedas?',
      answer: 'El debounce espera 300ms después de que dejes de escribir antes de hacer la búsqueda. Esto evita llamadas a la API en cada tecla, mejorando rendimiento y reduciendo carga del servidor. Aplica a búsquedas de tickets, documentos, inventario, etc.'
    },
    {
      question: '¿Qué son las transacciones en el sistema?',
      answer: 'Las transacciones aseguran que operaciones múltiples (ej: crear ticket + notificar + log) se ejecuten como una unidad. Si algo falla, todo se revierte. Usado en createPurchaseRequest, submitForReview, approveStep y otras operaciones críticas. Garantiza integridad total de datos.'
    },
    {
      question: '¿Qué es el locking optimista y por qué importa?',
      answer: 'El locking optimista previene que dos usuarios editen el mismo registro simultáneamente. Cada registro tiene un campo version que se incrementa en cada update. Si intentas guardar con una version obsoleta, el sistema detecta conflicto y rechaza la operación. Aplica a Tickets, PurchaseRequests, DocumentChangeRequests y QualityTickets.'
    },
    {
      question: '¿Cómo se asignan automáticamente los tickets de calidad?',
      answer: 'Los tickets de calidad se asignan vía round-robin al usuario con MENOS tickets activos. Esto equilibra la carga de trabajo entre el equipo de calidad. La asignación es automática al crear el ticket (si no se especifica asignado manualmente).'
    },
    {
      question: '¿Qué información registra el sistema de logs (Winston)?',
      answer: 'El logger Winston registra: errores, advertencias, creación/update/delete de registros, cambios de estado, intentos de acceso, conflictos de locking, y Auditoría completa. Los logs se rotan diariamente en archivos. Reemplaza completamente console.error.'
    },
    {
      question: '¿Qué es el filtrado por roles en reportes?',
      answer: 'Los endpoints de reportes (tickets, purchaseRequests, qualityTickets) filtran automáticamente los resultados según el rol del usuario. Por ejemplo, un Jefe solo ve tickets de su área, un Empleado solo ve los propios. Esto asegura que cada usuario acceda solo a datos autorizados.'
    },
    {
      question: '¿Cómo puedo ver mis propios elementos eliminados en la papelera?',
      answer: 'Los empleados pueden ver únicamente sus propios elementos eliminados. Administradores y técnicos ven TODOS los elementos de la papelera, con opción de restaurar cualquiera.'
    },
    {
      question: '¿Qué hago si recibo un error de "conflicto de concurrencia"?',
      answer: 'Significa que alguien más modificó el registro mientras tú lo editabas. Recarga la página para obtener la versión más reciente, revisa los cambios y vuelve a intentar. El sistema protege la integridad de datos con locking optimista.'
    },
    {
      question: '¿Dónde se almacenan los datos del sistema?',
      answer: 'DuvyClass usa base de datos MySQL con Sequelize ORM. Todas las tablas tienen campos de auditoría (createdBy, updatedBy, deletedAt) y versionado para locking optimista. Los archivos adjuntos se guardan en el servidor de archivos configurado.'
    },
    {
      question: '¿Qué pasa si se cae el servidor durante una transacción?',
      answer: 'Las transacciones son ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad). Si el servidor falla a mitad de una transacción, la base de datos hace rollback automáticamente, dejando los datos consistentes. Ningún cambio parcial se guarda.'
    },
    {
      question: '¿Cómo usar el Dashboard de Calidad?',
      answer: 'El Dashboard de Calidad muestra métricas en tiempo real: total de tickets, distribución por estado y categoría, prioridades y tiempos de resolución. Incluye gráficos interactivos y filtros por fecha. Está disponible para roles Calidad, Administrador y Jefe.'
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
      answer: 'Los administradores y jefes pueden asignar tickets desde la vista de detalles del ticket. Selecciona el técnico apropiado del menú desplegable.'
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

  const _contactInfo = [
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
        'Ver logs de auditoría del sistema',
        'Crear nuevos usuarios (POST /auth/create-user) - NO inicia sesión automáticamente',
        'Asignar cualquier rol al crear usuarios (Administrador, Coordinadora, Técnico, Calidad, Jefe, Compras, Empleado)',
        'Editar rol de cualquier usuario existente',
        'Editar cualquier campo de cualquier usuario (nombre, email, contraseña, rol, IT, teléfono)',
        'Acceso total a tickets (ver, crear, editar, eliminar, comentar)',
        'Acceso total a tickets de calidad',
        'Acceso total a documentos',
        'Acceso total a solicitudes de compra',
        'Acceso total a inventario y equipos'
      ],
      modules: ['Todos los módulos', 'Usuarios', 'Roles', 'Configuración', 'Papelera', 'Auditoría', 'Tickets', 'Tickets de Calidad', 'Documentos', 'Solicitudes de Compra', 'Inventario', 'Credenciales']
    },
    {
      name: 'Jefe',
      icon: <FaMedal className="text-purple-500" />,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Supervisión y gestión de equipos con acceso a reportes y estadísticas avanzadas',
      permissions: [
        'Ver todos los tickets del área',
        'Asignar tickets a técnicos',
        'Editar cualquier ticket',
        'Aprobar solicitudes de cambio',
        'Ver estadísticas del departamento',
        'Crear y gestionar solicitudes de compra',
        'Aprobar solicitudes de compra',
        'Acceso a documentos del área',
        'Ver reportes de rendimiento',
        'Gestionar workflow de documentos',
        'Aprobar tickets de calidad',
        'Ver métricas de equipo',
        'Acceso a Dashboard de Calidad',
        'Gestionar tickets de calidad (crear, editar, eliminar)',
        'Comentar en tickets de calidad',
        'Acceso total a solicitudes de compra'
      ],
      modules: ['Tickets', 'Solicitudes de Cambio', 'Solicitudes de Compra', 'Documentos', 'Estadísticas', 'Calidad', 'Dashboard Calidad']
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
        'Editar tickets (cualquier ticket)',
        'Eliminar tickets (cualquier ticket)',
        'Añadir comentarios y adjuntos',
        'Gestionar inventario (computadores, celulares, tablets, PDAs, actas de entrega)',
        'Ver credenciales del sistema',
        'Restaurar elementos de la papelera',
        'Crear nuevos usuarios (solo rol Empleado) - NO inicia sesión automáticamente',
        'Asignar teléfono corporativo a usuarios',
        'Editar IT (identificación) de usuarios'
      ],
      modules: ['Tickets', 'Inventario', 'Credenciales', 'Teléfonos', 'Tablets', 'PDAs', 'Actas de Entrega', 'Papelera']
    },
    {
      name: 'Empleado',
      icon: <FaUser className="text-green-500" />,
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Usuario básico con acceso para crear tickets y consultar información',
      permissions: [
        'Crear tickets propios',
        'Ver estado de sus tickets',
        'Comentar en sus tickets',
        'Ver documentos asignados',
        'Cambiar contraseña',
        'Ver perfil de usuario',
        'Crear solicitudes de compra',
        'Acceso de solo lectura a módulos autorizados',
        'Consultar inventario asignado (solo vista)',
        'Editar sus propios tickets',
        'Eliminar sus propios tickets',
        'Ver sus propios documentos'
      ],
      modules: ['Tickets', 'Documentos', 'Solicitudes de Compra', 'Perfil', 'Inventario']
    },
    {
      name: 'Calidad',
      icon: <FaCheck className="text-teal-500" />,
      color: 'bg-teal-100 text-teal-800 border-teal-300',
      description: 'Gestión de calidad, auditoría y cumplimiento de procesos ISO 9001',
      permissions: [
        'Gestionar tickets de calidad (crear, editar, eliminar, cualquier ticket)',
        'Comentar en tickets de calidad',
        'Subir archivos a tickets de calidad',
        'Buscar en todos los tickets de calidad',
        'Crear y aprobar documentos',
        'Ver historial de cambios documentales',
        'Aprobar solicitudes de cambio (paso 2: Revisión Inicial)',
        'Ver métricas de calidad',
        'Gestionar workflow de documentos',
        'Crear no conformidades',
        'Ver reportes de calidad',
        'Gestionar plantillas documentales',
        'Auditoría de procesos',
        'Acceso a Dashboard de Calidad',
        'Aprobar cualquier paso de solicitudes de cambio'
      ],
      modules: ['Tickets de Calidad', 'Documentos', 'Solicitudes de Cambio', 'Reportes de Calidad', 'Auditoría', 'Dashboard Calidad']
    },
    {
      name: 'Coordinadora Administrativa',
      icon: <FaBriefcase className="text-pink-500" />,
      color: 'bg-pink-100 text-pink-800 border-pink-300',
      description: 'Gestión administrativa de compras, actas y recursos',
      permissions: [
        'Gestionar solicitudes de compra (crear, editar)',
        'Aprobar solicitudes de compra como coordinadora',
        'Rechazar solicitudes de compra',
        'Crear y firmar actas de entrega',
        'Ver inventario administrativo',
        'Ver reportes financieros',
        'Gestionar telefónicas administrativas',
        'Ver estadísticas administrativas',
        'Crear órdenes de reposición',
        'Gestionar presupuestos',
        'Editar comentarios en solicitudes de compra (de otros usuarios)',
        'Eliminar adjuntos de solicitudes de compra'
      ],
      modules: ['Solicitudes de Compra', 'Actas de Entrega', 'Inventario', 'Teléfonos', 'Reportes']
    },
    {
      name: 'Compras',
      icon: <FaShoppingCart className="text-orange-500" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Gestión del proceso de compras y adquisiciones',
      permissions: [
        'Crear solicitudes de compra',
        'Ver todas las solicitudes de compra',
        'Editar solicitudes de compra',
        'Eliminar solicitudes de compra',
        'Seguir estado de solicitudes',
        'Ver catálogo de proveedores',
        'Gestionar órdenes de compra',
        'Ver historial de compras',
        'Adjuntar facturas y comprobantes',
        'Gestionar líneas de compra',
        'Ver reportes de compras',
        'Coordinar entregas',
        'Editar comentarios en solicitudes (de otros usuarios)',
        'Eliminar adjuntos de solicitudes'
      ],
      modules: ['Solicitudes de Compra', 'Proveedores', 'Órdenes de Compra', 'Reportes']
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
      description: 'Gestión de no conformidades y procesos de calidad ISO 9001',
      features: [
        'Registro de no conformidades (NCR), auditorías, CAPA, sugerencias, mejoras',
        'Análisis de causas raíz (5 Por Qué, Ishikawa)',
        'Acciones correctivas y preventivas (CAPA)',
        'Seguimiento de métricas e indicadores',
        'Reportes de cumplimiento ISO 9001',
        'Integración con documentos del sistema',
        'Workflow de aprobación por roles',
        'Plantillas de auditoría personalizadas',
        'Indicadores de rendimiento (KPI)',
        'Dashboard unificado de calidad',
        'Asignación automática round-robin'
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
      workflows: ['Borrador → En Revisión → Aprobado → Publicado → Archivado']
    },
    {
      name: 'Solicitudes de Cambio',
      icon: <FaEdit className="text-red-500" />,
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Gestión de cambios en documentos y procesos ISO 9001',
      features: [
        'Solicitud de cambios documentales',
        'Análisis de impacto y justificación',
        'Workflow de aprobación ISO 9001 (Calidad → Jefe → Implementación → Publicación)',
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
      workflows: ['Borrador → Revisión Inicial (Calidad) → Aprobación (Jefe) → Implementación (Coordinadora) → Publicación (Calidad/Admin)']
    },
    {
      name: 'Solicitudes de Compra',
      icon: <FaShoppingCart className="text-orange-600" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Proceso de adquisiciones y compras',
      features: [
        'Creación de solicitudes',
        'Aprobaciones por workflow (Coordinadora → Jefe → Compras)',
        'Presupuesto y centros de costo',
        'Archivos adjuntos',
        'Comentarios y seguimiento',
        'Estados de aprobación',
        'Historial de solicitudes',
        'Reportes de compras',
        'Catálogo de proveedores',
        'Órdenes de compra'
      ],
      workflows: ['Borrador → Enviado → Aprobación Coordinadora → Aprobación Jefe → Ordenado → Recibido']
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
        'Control de acceso por permisos',
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
        'Creación de usuarios por Administrador',
        'Edición de perfil por cada usuario (propios datos)',
        'Administradores pueden editar rol, IT, teléfono de cualquier usuario',
        'Técnicos pueden editar IT y teléfono de usuarios',
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
      light: 'min-h-screen',
      dark: 'min-h-screen'
    })}>
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-3 xs:py-4 sm:py-6 md:py-7 lg:py-8 space-y-4 xs:space-y-5 sm:space-y-6">
        <div className="mb-4 xs:mb-5 sm:mb-6 lg:mb-8">
          <div className="flex flex-col xs:flex-row items-center xs:items-start gap-2 xs:gap-3 mb-2">
             <div className="p-2 xs:p-2.5 bg-linear-to-br from-[#662d91] to-[#8e4dbf] rounded-lg shadow-lg">
              <FaQuestionCircle className="text-white text-lg xs:text-xl sm:text-2xl" />
            </div>
            <div className="text-center xs:text-left">
              <h1 className={conditionalClasses({
                light: 'text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900',
                dark: 'text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100'
              })}>Centro de Ayuda DuvyClass</h1>
              <p className={conditionalClasses({
                light: 'text-xs sm:text-base text-gray-600 mt-0.5',
                dark: 'text-xs sm:text-base text-gray-400 mt-0.5'
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
            <nav className="flex overflow-x-auto scrollbar-thin -mx-1 px-1 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'manual'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'faq'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Preguntas
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'roles'
                    ? 'border-[#662d91] text-[#662d91]'
                    : conditionalClasses({
                        light: 'border-transparent text-gray-500 hover:text-gray-700',
                        dark: 'border-transparent text-gray-400 hover:text-gray-300'
                      })
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                className={`px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
            {activeTab === 'manual' && (
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {/* ... contenido del manual se mantiene igual ... */}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3 xs:space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-lg',
                    dark: 'bg-gray-800 border border-gray-600 rounded-lg'
                  })}>
                    <summary className={conditionalClasses({
                      light: 'cursor-pointer p-3 font-semibold text-gray-900 hover:bg-gray-50',
                      dark: 'cursor-pointer p-3 font-semibold text-gray-100 hover:bg-gray-700'
                    })}>
                      {faq.question}
                    </summary>
                    <div className="p-3 pt-0">
                      <p className={conditionalClasses({
                        light: 'text-sm text-gray-700 mt-2',
                        dark: 'text-sm text-gray-300 mt-2'
                      })}>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}

            {activeTab === 'roles' && (
              <div className="space-y-4">
                {roles.map((role, i) => (
                  <div key={i} className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-xl p-4 sm:p-6',
                    dark: 'bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6'
                  })}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${role.color.replace('text-', 'bg-').replace('border-', '')}`}>
                        {role.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={conditionalClasses({
                          light: 'text-lg sm:text-xl font-bold text-gray-900',
                          dark: 'text-lg sm:text-xl font-bold text-gray-100'
                        })}>{role.name}</h3>
                        <p className={conditionalClasses({
                          light: 'text-sm text-gray-600 mt-1',
                          dark: 'text-sm text-gray-400 mt-1'
                        })}>{role.description}</p>
                        
                        <div className="mt-3 sm:mt-4">
                          <h4 className={conditionalClasses({
                            light: 'text-sm font-semibold text-gray-900 mb-2',
                            dark: 'text-sm font-semibold text-gray-100 mb-2'
                          })}>Permisos principales:</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                            {role.permissions.map((perm, j) => (
                              <li key={j} className={conditionalClasses({
                                light: 'text-xs sm:text-sm text-gray-700 flex items-start gap-2',
                                dark: 'text-xs sm:text-sm text-gray-300 flex items-start gap-2'
                              })}>
                                <FaCheck className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{perm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 sm:mt-4">
                          <h4 className={conditionalClasses({
                            light: 'text-sm font-semibold text-gray-900 mb-2',
                            dark: 'text-sm font-semibold text-gray-100 mb-2'
                          })}>Módulos disponibles:</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.modules.map((mod, j) => (
                              <span key={j} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-4">
                {modules.map((mod, i) => (
                  <div key={i} className={conditionalClasses({
                    light: 'bg-white border border-gray-200 rounded-xl p-4 sm:p-6',
                    dark: 'bg-gray-800 border border-gray-600 rounded-xl p-4 sm:p-6'
                  })}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${mod.color}`}>
                        {mod.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={conditionalClasses({
                          light: 'text-lg sm:text-xl font-bold text-gray-900',
                          dark: 'text-lg sm:text-xl font-bold text-gray-100'
                        })}>{mod.name}</h3>
                        <p className={conditionalClasses({
                          light: 'text-sm text-gray-600 mt-1',
                          dark: 'text-sm text-gray-400 mt-1'
                        })}>{mod.description}</p>
                        
                        <div className="mt-3 sm:mt-4">
                          <h4 className={conditionalClasses({
                            light: 'text-sm font-semibold text-gray-900 mb-2',
                            dark: 'text-sm font-semibold text-gray-100 mb-2'
                          })}>Características:</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                            {mod.features.map((feat, j) => (
                              <li key={j} className={conditionalClasses({
                                light: 'text-xs sm:text-sm text-gray-700 flex items-start gap-2',
                                dark: 'text-xs sm:text-sm text-gray-300 flex items-start gap-2'
                              })}>
                                <FaBolt className="text-[#662d91] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 sm:mt-4">
                          <h4 className={conditionalClasses({
                            light: 'text-sm font-semibold text-gray-900 mb-2',
                            dark: 'text-sm font-semibold text-gray-100 mb-2'
                          })}>Workflow:</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {mod.workflows.map((step, j) => (
                              <React.Fragment key={j}>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mod.color}`}>
                                  {step}
                                </span>
                                {j < mod.workflows.length - 1 && (
                                  <FaChevronDown className="text-gray-400 text-xs" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ... resto de pestañas ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
