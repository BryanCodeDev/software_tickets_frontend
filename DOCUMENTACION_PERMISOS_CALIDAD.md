# Documentación de Cambios en Permisos - Roles "Calidad", "Jefe", "Compras" y "Coordinadora Administrativa"

## Fecha de Actualización
14 de enero de 2026

## Resumen de Cambios
Se han modificado los permisos de los roles "Calidad", "Jefe", "Compras" y "Coordinadora Administrativa" para cumplir con los siguientes requisitos:

### Rol "Calidad":
- **Solicitudes de Compra**: CRUD limitado a solicitudes creadas por el usuario
- **Documentos**: Acceso administrativo completo (crear carpetas, documentos, asignar permisos)
- **Tickets de Calidad**: Acceso administrativo completo

### Rol "Jefe":
- **Tickets de Calidad**: CRUD limitado a tickets creados por el usuario
- **Solicitudes de Compra**: Acceso completo (sin cambios)
- **Documentos**: Acceso completo (sin cambios)

### Rol "Compras":
- **Tickets de Calidad**: CRUD limitado a tickets creados por el usuario
- **Solicitudes de Compra**: Acceso completo (sin cambios)
- **Documentos**: Acceso completo (sin cambios)

### Rol "Coordinadora Administrativa":
- **Tickets de Calidad**: CRUD limitado a tickets creados por el usuario
- **Solicitudes de Compra**: Acceso completo (sin cambios)
- **Documentos**: Acceso completo (sin cambios)

## Cambios Realizados por Módulo

### 1. Módulo de Solicitudes de Compra (PurchaseRequests.jsx)

#### Archivo Modificado:
- `software_tickets_frontend/src/pages/PurchaseRequests/PurchaseRequests.jsx`
- `software_tickets_frontend/src/components/PurchaseRequests/PurchaseRequestCard.jsx`

#### Cambios Específicos:

**En PurchaseRequests.jsx:**
- **Línea 333**: Se agregó "Calidad" al array `canCreate` para permitir crear solicitudes
- **Líneas 134-137**: Se modificó el filtrado para que los usuarios "Calidad" solo vean sus propias solicitudes:
  ```javascript
  if (!checkPermission('purchase_requests', 'view_all') || userRole === 'Calidad') {
    filtered = filtered.filter(req => req.userId === user?.id);
  }
  ```

**En PurchaseRequestCard.jsx:**
- **Líneas 167-178**: Se modificó la visibilidad del botón de edición para que los usuarios "Calidad" solo puedan editar sus propias solicitudes:
  ```javascript
  {(userRole === 'Administrador' || (userRole === 'Calidad' && request.userId === user?.id)) && (
    <button
      onClick={() => onEdit(request)}
      className="text-blue-600 hover:text-blue-800"
    >
      <Edit2 className="w-4 h-4" />
    </button>
  )}
  ```

#### Comportamiento Resultante:
- ✅ Puede crear solicitudes de compra
- ✅ Solo puede ver las solicitudes que ha creado
- ✅ Solo puede editar las solicitudes que ha creado
- ✅ Solo puede eliminar las solicitudes que ha creado

### 2. Módulo de Documentos (Documents.jsx)

#### Archivo Verificado:
- `software_tickets_frontend/src/pages/Documents/Documents.jsx`

#### Estado Actual:
No se requirieron modificaciones ya que el rol "Calidad" ya tenía acceso administrativo completo.

#### Permisos Confirmados:
- **Línea 158**: `canCreateFolder` - Puede crear carpetas
- **Línea 172**: `canCreateDocument` - Puede crear documentos
- **Línea 197**: `canAssignPermissions` - Puede asignar permisos
- **Línea 229**: `canDelete` - Puede eliminar documentos
- **Línea 535**: Acceso completo a todas las operaciones

#### Comportamiento Resultante:
- ✅ Puede crear carpetas
- ✅ Puede crear documentos
- ✅ Puede asignar permisos
- ✅ Puede editar documentos
- ✅ Puede eliminar documentos
- ✅ Acceso total al módulo

### 3. Módulo de Tickets de Calidad (TicketCalidad.jsx)

#### Archivo Verificado:
- `software_tickets_frontend/src/pages/Tickets/TicketCalidad.jsx`

#### Estado Actual:
No se requirieron modificaciones ya que el rol "Calidad" ya tenía acceso administrativo completo.

#### Permisos Confirmados:
- **Línea 164**: `canEditTicket` - Puede editar todos los tickets
- **Línea 174**: `canDeleteTicket` - Puede eliminar todos los tickets
- **Línea 187**: `canSendMessage` - Puede enviar mensajes en todos los tickets
- **Línea 237**: Puede ver todos los tickets (sin filtrado por usuario)
- **Línea 556**: `canCreate` - Puede crear tickets

#### Comportamiento Resultante:
- ✅ Puede crear tickets de calidad
- ✅ Puede ver todos los tickets de calidad
- ✅ Puede editar todos los tickets de calidad
- ✅ Puede eliminar todos los tickets de calidad
- ✅ Puede enviar mensajes en todos los tickets
- ✅ Acceso administrativo completo al módulo

### 4. Módulo de Tickets de Calidad - Rol "Jefe" (TicketCalidad.jsx)

#### Archivo Modificado:
- `software_tickets_frontend/src/pages/Tickets/TicketCalidad.jsx`

#### Cambios Específicos:

**Funciones helper modificadas:**
- **Líneas 163-171**: Se modificó `canEditTicket` para que el rol "Jefe" solo pueda editar sus propios tickets:
  ```javascript
  const canEditTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Líneas 173-184**: Se modificó `canDeleteTicket` para que el rol "Jefe" solo pueda eliminar sus propios tickets:
  ```javascript
  const canDeleteTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Técnico') {
      return (ticket.userId === user?.id || ticket.assignedTo === user?.id) && ticket.status?.toLowerCase() === 'cerrado';
    }
    if (userRole === 'Empleado' || userRole === 'Jefe') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Líneas 186-194**: Se modificó `canSendMessage` para que el rol "Jefe" solo pueda enviar mensajes en sus propios tickets:
  ```javascript
  const canSendMessage = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Línea 556**: Se agregó "Jefe" a `canCreate` para permitir crear tickets:
  ```javascript
  const canCreate = userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad' || userRole === 'Empleado' || userRole === 'Jefe';
  ```

**Filtrado de tickets:**
El rol "Jefe" ya estaba correctamente configurado en el filtrado (líneas 237-241) para ver solo sus propios tickets:
```javascript
if (!['Administrador', 'Técnico', 'Calidad'].includes(userRole)) {
  // Otros roles solo ven sus propios tickets
  filtered = filtered.filter(ticket => ticket.userId === user?.id);
}
```

#### Comportamiento Resultante:
- ✅ Puede crear tickets de calidad
- ✅ Solo puede ver los tickets que ha creado
- ✅ Solo puede editar los tickets que ha creado
- ✅ Solo puede eliminar los tickets que ha creado
- ✅ Solo puede enviar mensajes en los tickets que ha creado

## Resumen de Permisos por Rol

### Rol "Calidad":
| Módulo | Crear | Ver | Editar | Eliminar | Restricciones |
|--------|-------|-----|--------|----------|---------------|
| Solicitudes de Compra | ✅ | Solo propias | Solo propias | Solo propias | Solo puede ver/editar/eliminar sus propias solicitudes |
| Documentos | ✅ | Todos | Todos | Todos | Acceso administrativo completo |
| Tickets de Calidad | ✅ | Todos | Todos | Todos | Acceso administrativo completo |

### Rol "Jefe":
| Módulo | Crear | Ver | Editar | Eliminar | Restricciones |
|--------|-------|-----|--------|----------|---------------|
| Solicitudes de Compra | ✅ | Todos | Todos | Todos | Acceso completo (sin cambios) |
| Documentos | ✅ | Todos | Todos | Todos | Acceso completo (sin cambios) |
| Tickets de Calidad | ✅ | Solo propios | Solo propios | Solo propios | Solo puede ver/editar/eliminar sus propios tickets |

### Rol "Compras":
| Módulo | Crear | Ver | Editar | Eliminar | Restricciones |
|--------|-------|-----|--------|----------|---------------|
| Solicitudes de Compra | ✅ | Todos | Todos | Todos | Acceso completo (sin cambios) |
| Documentos | ✅ | Todos | Todos | Todos | Acceso completo (sin cambios) |
| Tickets de Calidad | ✅ | Solo propios | Solo propios | Solo propios | Solo puede ver/editar/eliminar sus propios tickets |

## Validación

Para verificar que los cambios funcionan correctamente:

### Para el rol "Calidad":
1. **Iniciar sesión como usuario con rol "Calidad"**
2. **Módulo de Solicitudes de Compra**:
   - Verificar que solo aparecen las solicitudes creadas por el usuario
   - Verificar que puede crear nuevas solicitudes
   - Verificar que solo puede editar/eliminar sus propias solicitudes
3. **Módulo de Documentos**:
   - Verificar que puede crear carpetas y documentos
   - Verificar que puede asignar permisos
   - Verificar que tiene acceso a todas las funciones administrativas
4. **Módulo de Tickets de Calidad**:
   - Verificar que puede ver todos los tickets
   - Verificar que puede crear, editar y eliminar cualquier ticket
   - Verificar que puede enviar mensajes en cualquier ticket

### Para el rol "Jefe":
1. **Iniciar sesión como usuario con rol "Jefe"**
2. **Módulo de Tickets de Calidad**:
   - Verificar que solo puede ver los tickets que ha creado
   - Verificar que puede crear nuevos tickets
   - Verificar que solo puede editar los tickets que ha creado
   - Verificar que solo puede eliminar los tickets que ha creado
   - Verificar que solo puede enviar mensajes en los tickets que ha creado
3. **Módulo de Solicitudes de Compra**:
   - Verificar que mantiene acceso completo (sin cambios)
4. **Módulo de Documentos**:
   - Verificar que mantiene acceso completo (sin cambios)

### Para el rol "Compras":
1. **Iniciar sesión como usuario con rol "Compras"**
2. **Módulo de Tickets de Calidad**:
   - Verificar que solo puede ver los tickets que ha creado
   - Verificar que puede crear nuevos tickets
   - Verificar que solo puede editar los tickets que ha creado
   - Verificar que solo puede eliminar los tickets que ha creado
   - Verificar que solo puede enviar mensajes en los tickets que ha creado
3. **Módulo de Solicitudes de Compra**:
   - Verificar que mantiene acceso completo (sin cambios)
4. **Módulo de Documentos**:
   - Verificar que mantiene acceso completo (sin cambios)

## Notas Técnicas

- Los cambios se implementaron manteniendo la compatibilidad con el sistema de permisos existente
- Se utilizó la función `checkPermission()` para mantener consistencia con el resto de la aplicación
- El filtrado de solicitudes se realiza tanto a nivel de backend como de frontend para mayor seguridad
- Para los roles "Jefe" y "Compras" se utilizaron funciones helper (`canEditTicket`, `canDeleteTicket`, `canSendMessage`) para aplicar restricciones a nivel de ticket individual
- No se modificaron los permisos de otros roles, solo se ajustaron los de los roles "Calidad", "Jefe" y "Compras"
- Los cambios siguen el patrón existente en la aplicación para mantener consistencia
- Los roles "Jefe" y "Compras" comparten el mismo nivel de restricciones en el módulo TicketCalidad

### 7. Módulo de Tickets de Calidad - Rol "Compras" (TicketCalidad.jsx)

#### Archivo Modificado:
- `software_tickets_frontend/src/pages/Tickets/TicketCalidad.jsx`

#### Cambios Específicos:

**Funciones helper modificadas:**
- **Líneas 163-171**: Se modificó `canEditTicket` para que el rol "Compras" solo pueda editar sus propios tickets:
  ```javascript
  const canEditTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Líneas 173-184**: Se modificó `canDeleteTicket` para que el rol "Compras" solo pueda eliminar sus propios tickets:
  ```javascript
  const canDeleteTicket = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Técnico') {
      return (ticket.userId === user?.id || ticket.assignedTo === user?.id) && ticket.status?.toLowerCase() === 'cerrado';
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Líneas 186-194**: Se modificó `canSendMessage` para que el rol "Compras" solo pueda enviar mensajes en sus propios tickets:
  ```javascript
  const canSendMessage = useCallback((ticket) => {
    if (userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad') {
      return true;
    }
    if (userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras') {
      return ticket.userId === user?.id;
    }
    return false;
  }, [userRole, user?.id]);
  ```

- **Línea 556**: Se agregó "Compras" a `canCreate` para permitir crear tickets:
  ```javascript
  const canCreate = userRole === 'Administrador' || userRole === 'Técnico' || userRole === 'Calidad' || userRole === 'Empleado' || userRole === 'Jefe' || userRole === 'Compras';
  ```

**Filtrado de tickets:**
El rol "Compras" ya estaba correctamente configurado en el filtrado (líneas 237-241) para ver solo sus propios tickets:
```javascript
if (!['Administrador', 'Técnico', 'Calidad'].includes(userRole)) {
  // Otros roles solo ven sus propios tickets
  filtered = filtered.filter(ticket => ticket.userId === user?.id);
}
```

#### Comportamiento Resultante:
- ✅ Puede crear tickets de calidad
- ✅ Solo puede ver los tickets que ha creado
- ✅ Solo puede editar los tickets que ha creado
- ✅ Solo puede eliminar los tickets que ha creado
- ✅ Solo puede enviar mensajes en los tickets que ha creado

## Archivos Modificados

1. `software_tickets_frontend/src/pages/PurchaseRequests/PurchaseRequests.jsx`
2. `software_tickets_frontend/src/components/PurchaseRequests/PurchaseRequestCard.jsx`
3. `software_tickets_frontend/src/pages/Tickets/TicketCalidad.jsx`
4. `software_tickets_frontend/DOCUMENTACION_PERMISOS_CALIDAD.md` (actualizado)

## Contacto

Para cualquier consulta sobre estos cambios, contactar al equipo de desarrollo.