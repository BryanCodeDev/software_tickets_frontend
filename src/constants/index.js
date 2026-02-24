/**
 * Constantes centralizadas del proyecto
 * Evita strings hardcodeados en múltiples archivos
 */

// ==================== ROLES ====================
export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  TECNICO: 'Técnico',
  CALIDAD: 'Calidad',
  COORDINADORA_ADMINISTRATIVA: 'Coordinadora Administrativa',
  JEFE: 'Jefe',
  COMPRAS: 'Compras',
  EMPLEADO: 'Empleado'
};

export const ROLES_CON_ACCESO_TOTAL = [
  ROLES.ADMINISTRADOR,
  ROLES.TECNICO,
  ROLES.CALIDAD
];

export const ROLES_CON_ACCESO_TICKETS = [
  ROLES.ADMINISTRADOR,
  ROLES.TECNICO,
  ROLES.CALIDAD,
  ROLES.COORDINADORA_ADMINISTRATIVA,
  ROLES.JEFE,
  ROLES.COMPRAS
];

// ==================== ESTADOS ====================
export const ESTADOS_TICKET = {
  ABIERTO: 'abierto',
  EN_PROCESO: 'en_proceso',
  PENDIENTE: 'pendiente',
  RESUELTO: 'resuelto',
  CERRADO: 'cerrado',
  CANCELADO: 'cancelado'
};

export const ESTADOS_DOCUMENTO = {
  BORRADOR: 'borrador',
  PENDIENTE_REVISION: 'pendiente_revision',
  EN_REVISION: 'en_revision',
  APROBADO: 'aprobado',
  EN_IMPLEMENTACION: 'en_implementacion',
  PUBLICADO: 'publicado',
  RECHAZADO: 'rechazado'
};

export const ESTADOS_SOLICITUD_COMPRA = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
};

export const ESTADOS_QUALITY_TICKET = {
  ABIERTO: 'abierto',
  EN_REVISION: 'en_revision',
  EN_ACCION: 'en_accion',
  CERRADO: 'cerrado',
  CANCELADO: 'cancelado'
};

// ==================== PRIORIDADES ====================
export const PRIORIDADES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  URGENTE: 'urgente'
};

export const PRIORIDADES_ORDER = [PRIORIDADES.URGENTE, PRIORIDADES.ALTA, PRIORIDADES.MEDIA, PRIORIDADES.BAJA];

// ==================== TIPOS ====================
export const TIPOS_SOLICITUD_CAMBIO = {
  CREATE: 'create',
  EDIT: 'edit',
  VERSION_UPDATE: 'version_update',
  DELETE: 'delete'
};

export const TIPOS_DOCUMENTO = {
  MANUAL: 'manual',
  PROCEDIMIENTO: 'procedimiento',
  INSTRUCTIVO: 'instructivo',
  FORMATO: 'formato',
  POLITICA: 'politica',
  REGISTRO: 'registro',
  OTRO: 'otro'
};

export const TIPOS_QUALITY_TICKET = {
  NCR: 'ncr',
  CAPA: 'capa',
  AUDITORIA: 'auditoria',
  MEJORA: 'mejora',
  OTRO: 'otro'
};

// ==================== PERMISOS ====================
export const TIPOS_PERMISO = {
  LECTURA: 'read',
  ESCRITURA: 'write'
};

// ==================== ESTADOS INVENTARIO ====================
export const ESTADOS_INVENTARIO = {
  ACTIVO: 'activo',
  EN_REPARACION: 'en_reparacion',
  BAJA: 'baja',
  ASIGNADO: 'asignado',
  DISPONIBLE: 'disponible'
};

// ==================== CONFIGURACIÓN ====================
export const CONFIG = {
  // Paginación
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Tiempos (en ms)
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  DEBOUNCE_DELAY: 300,
  
  // Límites
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SEARCH_RESULTS: 50,
  
  // Roles de permisos documentales
  FULL_ACCESS_ROLES: ['Administrador', 'Técnico', 'Calidad'],
  RESTRICTED_ROLES: ['Coordinadora Administrativa', 'Jefe', 'Compras', 'Empleado']
};

// ==================== MENSAJES ====================
export const MENSAJES = {
  // Éxito
  CREADO: 'Creado exitosamente',
  ACTUALIZADO: 'Actualizado exitosamente',
  ELIMINADO: 'Eliminado exitosamente',
  ENVIADO_PAPELERA: 'Enviado a papelera',
  EXPORTADO: 'Exportación completada',
  
  // Errores
  ERROR_GENERAL: 'Ha ocurrido un error. Por favor, intente de nuevo.',
  ERROR_PERMISOS: 'No tienes permisos para realizar esta acción',
  ERROR_NO_ENCONTRADO: 'No encontrado',
  ERROR_VALIDACION: 'Por favor, complete todos los campos requeridos',
  
  // Confirmaciones
  CONFIRM_ELIMINAR: '¿Está seguro de que desea eliminar este elemento?',
  CONFIRM_ENVIAR_PAPELERA: '¿Está seguro de que desea enviar a papelera?',
  CONFIRM_CANCELAR: '¿Está seguro de que desea cancelar?'
};

// ==================== UTILIDADES ====================
export const FORMATOS = {
  DATE: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm'
};

export const COLORES_ESTADO = {
  [ESTADOS_TICKET.ABIERTO]: 'blue',
  [ESTADOS_TICKET.EN_PROCESO]: 'yellow',
  [ESTADOS_TICKET.PENDIENTE]: 'orange',
  [ESTADOS_TICKET.RESUELTO]: 'green',
  [ESTADOS_TICKET.CERRADO]: 'gray',
  [ESTADOS_TICKET.CANCELADO]: 'red'
};

export const COLORES_PRIORIDAD = {
  [PRIORIDADES.BAJA]: 'green',
  [PRIORIDADES.MEDIA]: 'yellow',
  [PRIORIDADES.ALTA]: 'orange',
  [PRIORIDADES.URGENTE]: 'red'
};
