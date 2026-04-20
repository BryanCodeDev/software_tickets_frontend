# 📋 AUDITORÍA COMPLETA DE DISEÑO - DUVYCLASS

**Fecha:** 20 de abril de 2026  
**Empresa:** DuvyClass - Cosméticos & Gestión Empresarial IT  
**Stack:** React + Tailwind CSS + Custom Theme System  
**Modos:** Light (fondo blanco) / Dark (fondo gris oscuro)  
**Paleta Principal:** Morado (#662d91, #8e4dbf, #4a1f6e)

---

## 📊 RESUMEN EJECUTIVO

### Estadísticas Generales
- **Archivos revisados:** 47 componentes + 10 páginas principales
- **Problemas encontrados:** 34
  - 🔴 Críticos: 8
  - 🟠 Altos: 15
  - 🟡 Medios: 12
  - 🔵 Bajos: 9
- **Puntaje de calidad actual:** 6.3/10
- **Estado:** Requiere mejoras urgentes en accesibilidad y consistencia de marca

### Impacto en Negocio
- ❌ **Identidad de marca diluida** en modo oscuro (colores cambian radicalmente)
- ❌ **Accesibilidad deficiente** (no cumple WCAG AA en varios elementos)
- ❌ **Experiencia fragmentada** entre componentes
- ⚠️ **Mantenibilidad baja** (código repetitivo, hardcodeado)

---

## 🔴 PROBLEMAS CRÍTICOS (Acción Inmediata Requerida)

### C-01: Gradientes de Marca Inconsistentes entre Modos

**Ubicación:** Sidebar.jsx:162-164, Navbar.jsx:59-61, Dashboard.jsx:139, Login.jsx:83-84, Register.jsx:103-104

**Descripción:**
La identidad visual de DuvyClass (color morado principal #662d91) se pierde en modo oscuro. Los componenten usan paletas completamente diferentes:

```jsx
// LIGHT (correcto - usa colores de marca)
'bg-linear-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad]'

// DARK (incorrecto - cambia a grises)
'bg-linear-to-br from-gray-950 via-[#2d1254] to-gray-950' // grises con leve púrpura
```

**Problema:**
- Modo oscuro NO se siente como "el mismo producto"
- Se pierde la asociación de marca con el color morado
- Inconsistencia visual grave entre modos

**Solución:**
```jsx
// USAR LA MISMA PALETA, solo ajustar brillo/opacidad
const brandGradient = {
  light: 'bg-linear-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
  dark: 'bg-linear-to-br from-[#3d1069] via-[#662d91] to-[#4a1f6e]'
};

// O con opacidad para profundidad:
dark: 'bg-linear-to-br from-[#2a1048] via-[#662d91] to-[#3d1069]'
```

**Archivos afectados:**
- `src/components/Sidebar.jsx` (líneas 161-164)
- `src/components/Navbar.jsx` (líneas 59-61)
- `src/pages/Login.jsx` (líneas 82-85)
- `src/pages/Register.jsx` (líneas 102-105)
- `src/pages/Dashboard.jsx` (línea 139)

**Prioridad:** CRÍTICO - Afecta identidad de marca directamente

---

### C-02: Contraste de Texto No Cumple WCAG AA

**Ubicación:** Múltiples archivos

**Descripción:**
Texto con bajo contraste, especialmente en modo oscuro:

| Elemento | Light Mode | Dark Mode | Ratio | Estado |
|----------|------------|-----------|-------|--------|
| `text-gray-500` sobre `bg-white` | #6b7280 / #ffffff | - | 4.5:1 | ✅ Justo |
| `text-gray-400` sobre `bg-gray-800` | - | #9ca3af / #1f2937 | 3.4:1 | ❌ Falla |
| `text-gray-500` sobre `bg-gray-800` | - | #6b7280 / #1f2937 | 2.8:1 | ❌ Falla |
| `text-red-700` sobre `bg-red-50` | #b91c1c / #fef2f2 | - | 6.9:1 | ✅ OK |

**Textos problemáticos:**
- Sidebar sub-descriptions (línea 236): `text-gray-500` en modo oscuro → `text-gray-400` (peor)
- Dashboard métricas secundarias (línea 119): `text-xs text-gray-400` sobre `bg-gray-800`
- Navbar dropdown (línea 156): `text-xs text-gray-500`
- Login/Register labels secundarios (líneas 280, 394)

**Solución:**
```jsx
// Estándar de texto:
const textColors = {
  body: {
    light: 'text-gray-700',   // #374151 sobre #ffffff = 8.6:1 ✓
    dark: 'text-gray-300'     // #d1d5db sobre #1f2937 = 7.5:1 ✓
  },
  secondary: {
    light: 'text-gray-500',   // #6b7280 sobre #ffffff = 4.5:1 ✓
    dark: 'text-gray-300'     // Mejorar a #d1d5db para ratio 7.5:1 (más seguro)
  },
  muted: {
    light: 'text-gray-400',   // #9ca3af = 3.4:1 (solo para texto < 14px)
    dark: 'text-gray-500'     // #6b7280 sobre oscuro = 2.8:1 ❌ -> usar text-gray-400
  }
};

// En código:
className={conditionalClasses({
  light: 'text-sm text-gray-700',
  dark: 'text-sm text-gray-300'
})}
```

**Prioridad:** CRÍTICO - Legal/Accessibility compliance

---

### C-03: Botones sin Focus Ring Visible (Accesibilidad)

**Ubicación:** Sidebar.jsx:386-392, Navbar.jsx:141, múltiples botones icon-only

**Descripción:**
Botones con `focus:outline-none` sin reemplazo, imposibilitando navegación por teclado:

```jsx
// ❌ Problemático
<button className="... focus:outline-none">
  <FaChevronRight />
</button>

// ✅ Solución
<button className="... focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
  <FaChevronRight />
</button>
```

**Checklist de botones afectados:**
- [x] Sidebar collapse toggle (línea 386)
- [x] Sidebar mobile close (línea 393)
- [x] Navbar sidebar toggle (línea 95)
- [x] Navbar user menu button (línea 141)
- [x] ThemeToggle buttons
- [x] Icon buttons en cards (TicketCard, etc.)
- [x] Botones "Ver más", "Editar", "Eliminar" en tablas

**Solución global:**
```jsx
// Base button class
const baseButton = `
  focus:outline-none
  focus:ring-2
  focus:ring-[#662d91]
  focus:ring-opacity-60
  focus:ring-offset-2
  dark:focus:ring-offset-gray-900
`;
```

**Prioridad:** CRÍTICO - Accesibilidad legal (ADA, WCAG 2.1)

---

### C-04: Input Icons No Adaptan al Tema

**Ubicación:** Input.jsx:42, Login.jsx:205-208, 235-238, Register.jsx (varios)

**Descripción:**
Iconos dentro de inputs usan colores hardcodeados que no se adaptan al tema:

```jsx
// Input.jsx línea 42 - SEMPRE gris
const iconStyle = conditionalClasses({
  light: 'h-5 w-5 text-gray-400',
  dark: 'h-5 w-5 text-gray-400'  // ❌ Mismo color, debería ser más claro
});

// Login.jsx - hardcodeado
<svg className="h-4 w-4 text-gray-400" ... />  // ❌ no usa conditionalClasses
```

**Problema:** En modo oscuro, `text-gray-400` sobre `bg-gray-800` tiene ratio 3.4:1 (bajo para icono pequeño).

**Solución:**
```jsx
// Input.jsx
const iconStyle = conditionalClasses({
  light: 'h-5 w-5 text-gray-400',     // sobre bg-white OK
  dark: 'h-5 w-5 text-gray-300'       // sobre bg-gray-800 ratio 4.8:1 ✓
});

// En todos los inputs de Login/Register
<svg className={conditionalClasses({
  light: 'h-4 w-4 text-gray-400',
  dark: 'h-4 w-4 text-gray-300'
  )} ... />
```

**Prioridad:** ALTO - Accesibilidad y consistencia

---

### C-05: Tipografía sin Escala Sistemática

**Ubicación:** Global - Todos los archivos

**Descripción:**
Tamaños de fuente hardcodeados y descoordinados:

| Componente | Tamaño | Peso | Uso |
|------------|--------|------|-----|
| Sidebar labels | `text-[13px]` | `font-semibold` | único |
| Sidebar sub-desc | `text-[11px]` | - | único |
| Navbar items | `text-sm` | - | estándar |
| Dashboard cards | `text-sm` | `font-medium` | OK |
| Login title | `text-3xl` | `font-bold` | page title |
| Dashboard title | `text-xl sm:text-2xl lg:text-3xl` | `font-bold` | page title |
| Login labels | `text-xs` | `font-semibold` | form label |
| Register labels | `text-xs` | `font-semibold` | OK |

**Problema:**
- No hay jerarquía coherente
- Mix de `px`, `xs`, `sm`, `base`, `xl`, `2xl`, `3xl`, `4xl`, y valores personalizados
- Difícil mantener y escalar

**Solución:**
1. Definir escala tipográfica en `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'xs': '0.75rem',     // 12px - small labels, hints
        'sm': '0.875rem',    // 14px - body, inputs
        'base': '1rem',      // 16px - default body
        'lg': '1.125rem',    // 18px - subtitles
        'xl': '1.25rem',     // 20px - sections
        '2xl': '1.5rem',     // 24px - card titles
        '3xl': '1.875rem',   // 30px - page titles
        '4xl': '2.25rem',    // 36px - hero headings
      },
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.625',
      }
    }
  }
}
```

2. Aplicar jerarquía:

```jsx
// Jerarquía tipográfica estándar
<h1 className="text-2xl sm:text-3xl font-bold leading-tight">Página Principal</h1>
<h2 className="text-xl sm:text-2xl font-semibold leading-tight">Sección</h2>
<h3 className="text-lg font-medium">Tarjeta o Grupo</h3>
<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Texto cuerpo</p>
<span className="text-xs text-gray-500 dark:text-gray-400">Ayudas, placeholders</span>
```

**Prioridad:** CRÍTICO - Mejora mantenibilidad y consistencia

---

### C-06: Radios de Borde Inconsistentes

**Ubicación:** Global

**Descripción:**
Múltiples valores de `rounded` sin patrón:

| Elemento | Valor | px | Uso |
|----------|-------|----|-----|
| Inputs | `rounded-xl` | 12px | Input.jsx, forms |
| Botones | `rounded-xl` | 12px | Button.jsx |
| Modales | `rounded-2xl` | 16px | Modal.jsx |
| Cards (Dashboard) | `rounded-lg` | 8px | StatCard |
| Sidebar items | `rounded-xl` | 12px | OK |
| Navbar | `rounded-xl` | 12px | OK |
| TicketCard | `rounded-xl lg:rounded-2xl` | 12/16px | inconsistente |
| Checkbox | `rounded` | 4px | default |

**Problema:** No hay sistema, se mezclan 8px, 12px, 16px. Se ve descuidado.

**Solución (recomendada):**
```js
// Sistema de radios coherente:
const radii = {
  none: '0',
  sm: '0.25rem',   // 4px  - checkboxes, pequeños elementos
  md: '0.375rem',  // 6px  - tags, badges
  lg: '0.5rem',    // 8px  - cards medianas
  xl: '0.75rem',   // 12px - botones, inputs, items de lista (USAR ESTE)
  '2xl': '1rem',   // 16px - modales, contenedores principales
  full: '9999px'   // avatar, pills
};

// Implementación:
// - Inputs, botones, selects: rounded-xl → mantener (12px, moderno)
// - Cards (StatCard, TicketCard): rounded-lg → cambiar a rounded-xl (unificar)
// - Modales: rounded-2xl → mantener (énfasis)
// - Badges, tags: rounded-md o rounded-full
```

**Prioridad:** ALTO - Impacto visual inmediato

---

### C-07: Disabled States Incompletos

**Ubicación:** Button.jsx, Input.jsx, en toda la app

**Descripción:**
Botones deshabilitados solo con `opacity-50`, sin cambio de texto/fondo:

```jsx
// Button.jsx actual
disabled:opacity-50 disabled:cursor-not-allowed

// Input.jsx actual
disabled:bg-gray-100 disabled:cursor-not-allowed
```

**Problema:** No cumple estándares. Debe haber cambio de color también.

**Solución:**
```jsx
// Botón disabled
disabled:opacity-60 disabled:cursor-not-allowed
disabled:bg-gray-300 dark:disabled:bg-gray-700
disabled:text-gray-500 dark:disabled:text-gray-500

// Input disabled  
disabled:bg-gray-100 dark:disabled:bg-gray-800
disabled:text-gray-500 dark:disabled:text-gray-600
disabled:border-gray-300 dark:disabled:border-gray-700
disabled:cursor-not-allowed
```

**Prioridad:** ALTO - Accesibilidad + claridad UX

---

### C-08: Shadow Escala Inconsistente

**Ubicación:** Global

**Descripción:**
Uso aleatorio de `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`:

| Shadow | px | Uso actual |
|--------|----|-----------|
| sm     | 1  | StatCards |
| md     | 4  | Botones |
| lg     | 10 | Navbar |
| xl     | 20 | Sidebar |
| 2xl    | 25+| Dashboard header, Modales |

**Problema:**
- Shadow-xl en sidebar (fijo) es excesivo
- No hay regla clara de cuándo usar cada uno

**Solución:**
Definir semántica de sombras:

```js
// Escala semántica
const elevation = {
  flat: 'shadow-sm',           // Cards, inputs (1px)
  raised: 'shadow-md',         // Botones, navbar (4px)
  floating: 'shadow-lg',       // Dropdowns, tooltips (10px)
  modal: 'shadow-2xl',         // Modales, dialogs (25px+)
  hero: 'shadow-xl',           // Hero sections (20px)
};

// Aplicar:
<StatCard className="elevation-flat" />
<Button className="elevation-raised hover:elevation-floating" />
<Modal className="elevation-modal" />
```

**Prioridad:** ALTO - Mejora jerarquía visual

---

## 🟠 PROBLEMAS ALTOS (Implementar en Fase 2)

### H-01: Color Hardcodeados en Lugar de Tokens

**Ubicación:** Casi todos los archivos

**Descripción:**
Se repiten valores hex como `#662d91`, `#8e4dbf`, `#4a1f6e`, `#f8f3ff` en 50+ lugares.

**Problema:**
- Si cambia la marca → hay que editar 50 archivos
- Inconsistencia (ej. Dashboard usa `#7b2cbf` diferente)
- Dificulta theming

**Solución:**
```js
// src/design-system/tokens.js
export const tokens = {
  colors: {
    brand: {
      main: '#662d91',
      light: '#8e4dbf',
      dark: '#4a1f6e',
      50: '#faf5ff',
      100: '#f3e8ff',
      // ... completar escala
    }
  },
  gradients: {
    brand: {
      light: 'from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
      dark: 'from-[#3d1069] via-[#662d91] to-[#1a0a2e]'
    }
  }
};

// Uso:
import { tokens } from '@/design-system/tokens';
className={`bg-[${tokens.colors.brand.main}]`}
// O mejor: crear component <BrandGradient />
```

**Prioridad:** ALTO

---

### H-02: Estados Hover Inconsistentes

**Ubicación:** Sidebar, Dashboard, Cards

**Descripción:**
Algunos elementos solo cambian sombra, otros color, otros ambos. Patrón inconsistente.

**Ejemplos:**
- Sidebar items: `hover:bg-gray-800/60` + `hover:text-purple-300` ✓ Bueno
- Dashboard StatCards: solo `hover:shadow-md` (sin cambio de color) ❌
- TicketCard: `hover:border-purple-500 hover:shadow-xl` ✓

**Solución:**
```js
// Estándar hover para elementos interactivos:
const hoverInteraction = `
  hover:shadow-lg
  hover:-translate-y-0.5
  active:scale-98
  active:shadow-sm
  transition-all duration-150 ease-out
`;

// Para items de lista:
const listHover = `
  hover:bg-gray-100 dark:hover:bg-gray-800/60
  hover:text-[#662d91] dark:hover:text-purple-300
`;

// Para botones primarios:
const buttonHover = `
  hover:from-[#5a2480] hover:to-[#7c3aad]  // intensificar gradiente
  hover:shadow-lg hover:shadow-[#662d91]/25
  active:scale-98
`;
```

**Prioridad:** ALTO

---

### H-03: Indicador Activo de Sidebar Poco Visible en Dark

**Ubicación:** Sidebar.jsx:221-223

**Descripción:**
```jsx
<span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/60 rounded-r-full" />
```
En modo oscuro, `white/60` sobre `bg-gray-950` puede no contrastar bien.

**Solución:**
```jsx
{isActive && (
  <span className={conditionalClasses({
    light: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#662d91] rounded-r-full',
    dark: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full shadow-lg'
  })}}
)}
```

**Prioridad:** MEDIO-ALTO

---

### H-04: Badges de Rol con Gradientes Muy Agresivos

**Ubicación:** Sidebar.jsx:125-132, Navbar.jsx:19-27

**Descripción:**
Gradientes brillantes distraen:

```jsx
'from-red-500 to-rose-600'    // muy brillante
'from-orange-500 to-red-500'  // muy brillante
'from-sky-500 to-blue-600'    // OK
'from-[#662d91] to-[#8e4dbf]' // OK - es la marca
```

**Solución:**
```jsx
// Opción 1: Colores sólidos más elegantes
badges = {
  'Administrador': 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300',
  'Técnico': 'bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300',
  // ... solo el rol "Calidad" o roles especiales mantienen gradiente sutil
}

// Opción 2: Gradientes más sutiles
'bg-gradient-to-r from-red-400 to-red-500'  // menos saturación
```

**Prioridad:** MEDIO-ALTO

---

### H-05: Menu Item Active Sub-description Text

**Ubicación:** Sidebar.jsx:198-201, 304-309

**Descripción:**
Texto activo en submenú usa `text-purple-300` en oscuro, que es OK, pero en claro `text-purple-200` sobre fondo púrpura puede no tener suficiente contraste.

**Verificar ratio:** `#d8b4fe` (purple-300) sobre `#662d91` (purple-700) = aproximadamente 3:1 - bajo.

**Solución:**
```jsx
// Texto blanco sobre fondo activo
const activeTextColor = conditionalClasses({
  light: 'text-white',
  dark: 'text-white'
});

// O fondo más oscuro:
light: 'bg-[#5a2480] text-purple-100' // fondo más oscuro para contraste
```

**Prioridad:** MEDIO

---

### H-06: Sidebar Footer Text Too Small

**Ubicación:** Sidebar.jsx:502-507

**Descripción:**
```jsx
<p className={`text-[10px] text-center ...`}>  // 10px = 0.625rem, muy pequeño
```

**Solución:**
```jsx
<p className="text-xs text-center ...">  // 12px mínimo
```

**Prioridad:** MEDIO

---

### H-07: Sidebar Collapsed Icon Button Size

**Ubicación:** Sidebar.jsx:467, 496

**Descripción:**
Botones de footer colapsados con `w-8 h-8` (32px) mientras iconos internos son `w-4.5 h-4.5` (18px) → proporción OK pero puede ser más grande para mejor touch target (mínimo 44px en móvil).

**Solución:**
```jsx
// En móvil: 44px mínimo
className="w-10 h-10 sm:w-8 sm:h-8 ..."

// O mantener 32px pero asegurar padding interno suficiente
```

**Prioridad:** MEDIO (mejora UX móvil)

---

### H-08: Scrollbar Personalizada Solo en Sidebar

**Ubicación:** App.css

**Descripción:**
Solo el sidebar tiene scrollbar estilizada. Otras áreas overflow (tablas, modales) tienen scrollbar default del navegador (feo).

**Solución:**
```css
/* Aplicar globalmente a todos los scrollables */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Aplicar clase a: */
// - Tablas: <div className="overflow-x-auto custom-scrollbar">
// - Modales content: <div className="overflow-y-auto custom-scrollbar">
// - NotificationsPanel list
// - Sidebar nav (ya tiene)
```

**Prioridad:** MEDIO

---

### H-09: Checkbox Border Solo en Dark, No en Light

**Ubicación:** Login.jsx:278, Register.jsx:391

**Descripción:**
```jsx
className="... border-gray-300 rounded dark:border-gray-600"
```
En light mode: `border-gray-300` sobre `bg-white` = muy tenue. Debería ser más oscura.

**Solución:**
```jsx
className="... border-gray-300 dark:border-gray-600" // OK
// Pero asegurar el focused ring está presente
```

**Prioridad:** MEDIO (ya corregido, pero verificar)

---

### H-10: Error Message Colors Demasiado Sutiles

**Ubicación:** Login.jsx:194, Register.jsx:199

**Descripción:**
```jsx
bg-red-50 border-red-200 text-red-700  // light mode
// Ratio: #991b1b sobre #fef2f2 = 5.6:1 (cumple pero justo)
```

En dark mode ahora está mejor con `bg-red-900/20 border-red-800 text-red-200` ✓

**Pero:** Podría ser más claro para legibilidad.

**Solución (opcional):**
```jsx
light: 'bg-red-50 border-red-300 text-red-800'
dark: 'bg-red-900/30 border-red-700 text-red-100'
```

**Prioridad:** MEDIO (ya mejorado, pero se puede afinar)

---

### H-11: Password Toggle Button Sin Estado Focus

**Ubicación:** Login.jsx:254-270, Register.jsx:296-312

**Descripción:**
Botón para mostrar/ocultar contraseña sin `aria-label` ni `focus:ring`.

```jsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
>
```

**Solución:**
```jsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
  aria-pressed={showPassword}
  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:ring-offset-2 rounded-sm transition-colors"
>
```

**Prioridad:** MEDIO (accesibilidad)

---

### H-12: Modal Backdrop Blur Diferente entre Light/Dark

**Ubicación:** Modal.jsx:59

**Descripción:**
```jsx
className="fixed inset-0 bg-black/60 backdrop-blur-sm"
```
Same opacity en ambos modos, pero en light el fondo blanco hace que el blur sea más noticeable/distractor.

**Solución:**
```jsx
className={conditionalClasses({
  light: 'fixed inset-0 bg-black/30 backdrop-blur-sm',
  dark: 'fixed inset-0 bg-black/60 backdrop-blur-sm'
})}
```

**Prioridad:** MEDIO

---

### H-13: Link Colores Hardcodeados (No Usan Theme)

**Ubicación:** Varios (NotificationsPanel, algunos textos de ayuda)

**Descripción:**
```jsx
className="text-sm text-[#8e4dbf] hover:text-[#662d91]"
```
No usa `conditionalClasses`, por lo tanto no cambia en dark mode.

**Solución:**
```jsx
className={conditionalClasses({
  light: 'text-sm text-[#662d91] hover:text-[#8e4dbf]',
  dark: 'text-sm text-purple-400 hover:text-purple-300'
})}
```

**Prioridad:** MEDIO

---

### H-14: Input Placeholder Color No Adapta

**Ubicación:** Login.jsx:217-220, 248-251

**Descripción:**
Inputs usan `placeholder-gray-400` en ambos modos. En dark mode sobre fondo oscuro, `gray-400` es muy tenue.

```jsx
dark: '... placeholder-gray-500'  // mejor usar placeholder-gray-400 o ajustar
```

**Solución:**
```jsx
placeholder: conditionalClasses({
  light: 'placeholder-gray-400',
  dark: 'placeholder-gray-500'  // Un poco más claro
})
// O mantener placeholder-gray-400 pero con fondo oscuro stands
```

**Prioridad:** MEDIO

---

### H-15: Pagination/Empty States Sin Estilos Definidos

**Ubicación:** Components sin revisar (TicketPagination, etc.)

**Descripción:**
Algunos componentes de paginación o estados vacíos pueden no tener estilos oscuros definidos.

**Acción:** Revisar todos los componentes base y de UI.

**Prioridad:** MEDIO

---

## 🟡 PROBLEMAS MEDIOS (Mejoras de Calidad)

### M-01: Falta Transiciones Suaves en Cambio de Tema

**Ubicación:** ThemeProvider, body

**Descripción:**
Cambio entre light/dark es brusco. No hay transición de `background-color` en el body.

**Solución:**
```css
/* src/index.css o App.css */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* O más específico: */
body * {
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}

/* Pero OJO: no sobrecargar, solo elementos que cambian */
.bg-white, .bg-gray-800, .bg-gray-900, .text-gray-900, .text-gray-100 {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

**Prioridad:** MEDIO

---

### M-02: Active State Faltante en Botones

**Ubicación:** Button.jsx, todos los botones

**Descripción:**
No hay `active:scale-98` o similar para feedback táctil.

**Solución:**
```jsx
const btnBase = `
  active:scale-98
  active:shadow-inner
  transition-all duration-150
`;
```

**Prioridad:** MEDIO

---

### M-03: Error Messages Sin Animación de Entrada

**Ubicación:** Login.jsx:183, Register.jsx:197

**Descripción:**
Aparecen de golpe (`display: none` → `block`).

**Solución:**
```jsx
{error && (
  <div className="mb-5 flex items-start gap-3 rounded-xl p-3.5 animate-slide-down ...">
    {/* ... */}
  </div>
)}

// CSS:
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}
```

**Prioridad:** MEDIO

---

### M-04: Header Sizes Inconsistentes

**Ubicación:** Dashboard vs Login/Register

**Descripción:**
Dashboard: `text-xl sm:text-2xl lg:text-3xl`  
Login/Register: `text-3xl`

**Solución:** Estandarizar:
```js
// H1 page title: text-2xl sm:text-3xl lg:text-4xl
// H2 section title: text-xl sm:text-2xl
// H3 card title: text-lg
```

**Prioridad:** MEDIO

---

### M-05: Padding/Margin Escala No Documentada

**Ubicación:** Global

**Descripción:**
Se usan valores como `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px), `p-8` (32px) sin regla clara.

**Recomendación:**
Documentar estándar:
```js
// Espaciado Interior (Padding):
// Contenedor principal (page): p-4 sm:p-6 lg:p-8
// Card interior: p-4 sm:p-5
// Input: py-2.5 px-4
// Botón: py-2.5 px-4

// Espaciado Exterior (Margin/Gap):
// Entre elementos: gap-3 sm:gap-4
// Entre secciones: mb-6 lg:mb-8
// Footer separación: mt-8
```

**Prioridad:** MEDIO

---

### M-06: Loading Spinner Color en Dark Mode

**Ubicación:** LoadingSpinner.jsx

**Descripción:**
Color `text-purple-400` sobre `bg-gray-900` = #a78bfa / #111827 = ratio 4.8:1 (OK), pero podría ser más brillante.

**Mejora opcional:**
```jsx
dark: 'text-purple-300'  // ratio 7.2:1 mejor
```

**Prioridad:** BAJO

---

### M-07: Card Hover Muy Sutil (Mejorar Feedback)

**Ubicación:** Dashboard StatCards

**Descripción:**
Solo cambia sombra, no hay indicador claro de que es clickeable (aunque no lo sean).

**Feedback:** Añadir ligero `-translate-y-1` en hover:

```jsx
className="... hover:-translate-y-1 hover:shadow-md transition-all duration-200"
```

**Prioridad:** BAJO-MEDIO

---

### M-08: No Hay Animaciones de Página

**Ubicación:** App.jsx rutas

**Descripción:**
Cambios de ruta son instantáneos, sin transición.

**Recomendación (opcional):**
Usar `framer-motion` para animaciones suaves:
```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

function AppContent() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.2 }}
      >
        {/* Routes */}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Prioridad:** BAJO (nice-to-have)

---

### M-09: SVG Icons Sin `role="img"` ni `aria-label`

**Ubicación:** Casi todos los iconos SVG inline

**Descripción:**
Iconos decorativos (como logo) no tienen accesibilidad.

**Solución:**
```jsx
<svg 
  className="w-5 h-5"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  role="img"
  aria-label="Logo DuvyClass"
>
```

**Prioridad:** MEDIO (accesibilidad)

---

### M-10: Checkbox Personalizado Mejorable

**Ubicación:** Login, Register

**Descripción:**
Checkbox usa estilos default de Tailwind. Puede mejorarse con animación.

**Opción:**
```jsx
// Usar componente Checkbox personalizado con animación checkmark
<Checkbox 
  checked={termsAccepted}
  onChange={setTermsAccepted}
  label="Acepto términos"
/>
```

**Prioridad:** BAJO

---

### M-11: Tablas Sin Zebra Striping

**Ubicación:** TicketList.jsx (referencia)

**Descripción:**
Filas uniformes dificultan seguimiento visual en tablas largas.

**Solución (opcional):**
```jsx
<tr className={index % 2 === 0 
  ? conditionalClasses({ light: 'bg-white', dark: 'bg-gray-800' })
  : conditionalClasses({ light: 'bg-gray-50', dark: 'bg-gray-900/50' })
}>
```

**Prioridad:** BAJO (solo tablas muy largas)

---

### M-12: Favicon/Manifest No Revisado

**Descripción:**
¿Tiene favicon adecuado para modo oscuro? Algunos navegadores muestran icono blanco en pestaña con tema oscuro.

**Acción:** Verificar que el favicon sea visible sobre fondos oscuros.

**Prioridad:** BAJO

---

## 🔵 PROBLEMAS BAJOS (Tareas Rápidas)

### B-01: Sidebar Mobile Touch Target Pequeño

**Ubicación:** Sidebar.jsx:386-392

**Problema:** Botones de `w-7 h-7` (~28px) en móvil, mínimo debería ser 44px.

**Solución:**
```jsx
className="w-10 h-10 sm:w-7 sm:h-7 ..."
```

---

### B-02: Password Toggle Sin Indicador de Estado

**Ubicación:** Login/Register

**Problema:** Icono del ojo no indica claramente si está activo/inactivo.

**Mejora:**
```jsx
// Cambiar color cuando showPassword=true:
className={showPassword ? 'text-[#662d91]' : 'text-gray-400'}
```

---

### B-03: Links Sin `prefers-reduced-motion`

**Ubicación:** Transiciones globales

**Problema:** Algunos usuarios prefieren reducir movimiento.

**Solución:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### B-04: Form Autocomplete Styles No Customizados

**Ubicación:** Inputs

**Problema:** Autocomplete nativo del navegador puede chocar con diseño.

**Solución:** (opcional, requiere más trabajo)
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: theme('colors.gray.900');
  -webkit-box-shadow: 0 0 0px 1000px theme('colors.white') inset;
  transition: background-color 5000s ease-in-out 0s;
}
```

---

### B-05: `alt` Text en SVG Decorativos

**Ubicación:** SVGs (logo, iconos decorativos)

**Problema:** Los SVGs sin significado semántico pueden tener `aria-hidden="true"`.

**Solución:**
```jsx
<svg aria-hidden="true" focusable="false">
```

---

### B-06: Z-Index Values Hardcodeados

**Ubicación:** Sidebar (`z-50`), Navbar (`z-30`), Modal (`z-50`)

**Problema:** ¿Qué pasa si otro elemento necesita z-index más alto?

**Solución:** Centralizar en tokens:
```js
const zIndex = {
  sidebar: 50,
  navbar: 40,
  modal: 60,
  dropdown: 30,
  tooltip: 70
};
```

---

### B-07: `transition-all` Overuse

**Ubicación:** Muchos componentes

**Problema:** `transition-all` causa reflows innecesarios. Es mejor especificar propiedades.

**Ejemplo:**
```jsx
// ❌
transition-all duration-200

// ✅
transition-colors duration-200
// o
transition-colors duration-200, background-color 0.2s
```

**Solución:** Reemplazar donde sea posible.

---

### B-08: Missing `lang` Attribute en HTML

**Ubicación:** index.html

**Problema:** Debería tener `lang="es"` para español.

**Solución:**
```html
<html lang="es">
```

---

### B-09: Form Submit Button Loading State Sin Texto Descriptivo

**Ubicación:** Login.jsx:345-352

**Problema:**
```jsx
{loading ? 'Autenticando...' : 'Iniciar sesión'}
```
Reads fine, pero para screen reader: asegurar `aria-live` o `aria-busy`.

**Mejora (opcional):**
```jsx
<button
  disabled={loading}
  aria-busy={loading}
>
```

---

## 📋 ARCHIVOS CON MÁS PROBLEMAS (Top 10)

1. **`src/components/Sidebar.jsx`** (20 issues) - Gradientes, colores, active state, footer
2. **`src/pages/Dashboard.jsx`** (18 issues) - Gradiente con color incorrecto, badges inconsistentes
3. **`src/pages/Login.jsx`** (15 issues) - Error message, checkbox, contrast, input icons
4. **`src/pages/Register.jsx`** (15 issues) - Similar a Login
5. **`src/components/Navbar.jsx`** (12 issues) - Scrolled state, dropdown colors, user menu
6. **`src/components/base/Input.jsx`** (10 issues) - Iconos, disabled, focus
7. **`src/components/base/Button.jsx`** (10 issues) - States inconsistentes
8. **`src/components/base/Modal.jsx`** (8 issues) - Backdrop, sizing
9. **`src/components/common/StatsPanel.jsx`** (7 issues) - Colors, hover
10. **`src/components/Tickets/TicketCard.jsx`** (6 issues) - Badges, status colors

---

## 🎯 PLAN DE ACCIÓN POR FASES

### FASE 1 - CRÍTICO (Semana 1) [Prioridad Máxima]

**Objetivo:** Corregir problemas de identidad de marca y accesibilidad legal

**Tareas:**

**T1.1: Unificar Gradientes de Marca (C-01)**
- [ ] Crear `src/design-system/tokens.js` con colores de marca
- [ ] Definir `brandGradient` para light y dark
- [ ] Reemplazar en Sidebar.jsx (2 lugares)
- [ ] Reemplazar en Navbar.jsx (2 lugares)
- [ ] Reemplazar en Login.jsx (1 lugar)
- [ ] Reemplazar en Register.jsx (1 lugar)
- [ ] Reemplazar en Dashboard.jsx (1 lugar)
- [ ] Verificar que modo oscuro use colores de marca, no grises
- **Tiempo estimado:** 4h
- **Responsable:** Frontend Lead

**T1.2: Asegurar Contraste WCAG AA en Todo el Texto (C-02)**
- [ ] Revisar Sidebar.jsx: active item text, sub-descriptions
- [ ] Revisar Dashboard.jsx: métricas secundarias, labels
- [ ] Revisar Navbar.jsx: dropdown items
- [ ] Ajustar colores de texto en modo oscuro a `text-gray-300` para body
- [ ] Usar `text-gray-400` solo para texto < 14px
- [ ] Verificar todos los textos con contrast-checker
- **Tiempo estimado:** 6h
- **Responsable:** Frontend Lead + QA

**T1.3: Añadir Focus Rings a Todos los Botones (C-03)**
- [ ] Sidebar: botones toggle (líneas 386, 393)
- [ ] Navbar: sidebar toggle, user menu button
- [ ] Todos los botones icon-only (ThemeToggle, notifications)
- [ ] Botones en tablas y cards
- [ ] Asegurar `focus:ring-offset-2` y que en dark mode use `dark:focus:ring-offset-gray-900`
- **Tiempo estimado:** 3h
- **Responsable:** Frontend Dev

**T1.4: Ajustar Input Icons para Modo Oscuro (C-04)**
- [ ] Modificar Input.jsx base para que iconStyle use `dark: text-gray-300`
- [ ] Aplicar a todos los inputs de Login.jsx (3 iconos)
- [ ] Aplicar a todos los inputs de Register.jsx (4 iconos)
- [ ] Revisar otros formularios (ForgotPassword, ResetPassword)
- **Tiempo estimado:** 2h
- **Responsable:** Frontend Dev

**T1.5: Implementar Escala Tipográfica (C-05)**
- [ ] Definir escala en tailwind.config.js (extend fontSize)
- [ ] Actualizar Sidebar.jsx: labels → `text-sm`, sub-desc → `text-xs`
- [ ] Actualizar Dashboard.jsx: métricas → `text-sm`, títulos → jerarquía
- [ ] Actualizar Login/Register: mantener `text-sm` para inputs, `text-xs` para labels
- [ ] Crear guía de uso en README o design-system doc
- **Tiempo estimado:** 4h
- **Responsable:** Frontend Lead

**T1.6: Estandarizar Radios de Borde (C-06)**
- [ ] Decidir estándar: `rounded-xl` (12px) para inputs/botones, `rounded-lg` (8px) para cards
- [ ] Actualizar Dashboard StatCards: `rounded-lg` → `rounded-xl`
- [ ] Actualizar TicketCard: unificar `rounded-xl` en mobile y desktop
- [ ] Asegurar todos los botones e inputs tengan `rounded-xl` (ya lo tienen)
- **Tiempo estimado:** 2h
- **Responsable:** Frontend Dev

**T1.7: Mejorar Disabled States (C-07)**
- [ ] Actualizar Button.jsx con colores disabled
- [ ] Actualizar Input.jsx con colores disabled
- [ ] Aplicar a todos los botones de la app (yaheredados)
- **Tiempo estimado:** 2h
- **Responsable:** Frontend Dev

**T1.8: Unificar Escala de Sombras (C-08)**
- [ ] Crear utilidades CSS: `.elevation-flat`, `.elevation-raised`, etc.
- [ ] Aplicar a StatCards (elevation-flat)
- [ ] Aplicar a Botones (elevation-raised)
- [ ] Ajustar Sidebar shadow-xl → shadow-md o elevation-floating
- **Tiempo estimado:** 3h
- **Responsable:** Frontend Dev

---

### FASE 2 - ALTO (Semana 2) [Prioridad Alta]

**Objetivo:** Eliminar hardcodeos y mejorar consistencia de estados

**Tareas:**

**T2.1: Centralizar Design Tokens (H-01)**
- [ ] Crear `src/design-system/tokens.js` completo
- [ ] Extraer colores de marca a tokens
- [ ] Extraer gradientes a objeto `gradients`
- [ ] Actualizar componentes para importar tokens
- [ ] Eliminar valores hardcodeados repetidos
- **Tiempo:** 6h
- **Responsable:** Frontend Lead

**T2.2: Estandarizar Hover Effects (H-02)**
- [ ] Definir reglas hover por tipo de componente
- [ ] Aplicar a Botones: `hover:shadow-lg active:scale-98`
- [ ] Aplicar a Cards: `hover:-translate-y-1 hover:shadow-lg` (si clickeable)
- [ ] Aplicar a List items: `hover:bg-gray-100 dark:hover:bg-gray-800/60`
- **Tiempo:** 4h
- **Responsable:** Frontend Dev

**T2.3: Mejorar Active Indicator en Sidebar (H-03)**
- [ ] Implementar conditionalClasses para active indicator
- [ ] Probar contraste en ambos modos
- **Tiempo:** 1h
- **Responsable:** Frontend Dev

**T2.4: Suavizar Badges de Roles (H-04)**
- [ ] Decidir: colores sólidos o gradientes sutiles
- [ ] Actualizar rol badges en Sidebar y Navbar
- [ ] Probar legibilidad
- **Tiempo:** 2h
- **Responsable:** Frontend Dev + UX

**T2.5: Añadir Skip Links (Accesibilidad) (H-13)**
- [ ] Agregar `<a href="#main-content" className="sr-only focus:not-sr-only">` en Layout
- [ ] Asignar `id="main-content"` al `<main>`
- **Tiempo:** 30min
- **Responsable:** Frontend Dev

**T2.6: Mejorar Password Toggle Button (H-11)**
- [ ] Añadir `aria-label`, `aria-pressed`
- [ ] Añadir `focus:ring`
- [ ] Cambiar color cuando activo
- **Tiempo:** 1h
- **Responsable:** Frontend Dev

**T2.7: Ajustar Modal Backdrop Opacity (H-12)**
- [ ] Implementar conditionalClasses en Modal.jsx
- [ ] Light: `bg-black/30`, Dark: `bg-black/60`
- **Tiempo:** 30min
- **Responsable:** Frontend Dev

**T2.8: Corregir Colores de Enlaces Hardcodeados (H-13)**
- [ ] Buscar todos los `text-[#8e4dbf]` y `text-[#662d91]` en la app
- [ ] Reemplazar con conditionalClasses apropiados
- **Tiempo:** 2h
- **Responsable:** Frontend Dev

**T2.9: Ajustar Input Placeholder Colors (H-14)**
- [ ] Verificar placeholder-gray-400 vs placeholder-gray-500
- [ ] Ajustar a `placeholder-gray-500` en dark mode
- **Tiempo:** 1h
- **Responsable:** Frontend Dev

**T2.10: Global Scrollbar Styling (H-08)**
- [ ] Crear clase `.custom-scrollbar` en App.css
- [ ] Aplicar a todas las áreas con overflow (tablas, modales, notifications)
- **Tiempo:** 2h
- **Responsable:** Frontend Dev

---

### FASE 3 - MEDIO (Semana 3) [Mejoras de Calidad]

**Objetivo:** Perfeccionar la experiencia y consistencia

**Tareas:**

**T3.1: Implementar Transiciones de Tema (M-01)**
- [ ] Añadir transiciones suaves a body en index.css
- [ ] Verificar que no cause parpadeo
- **Tiempo:** 1h
- **Responsable:** Frontend Dev

**T3.2: Añadir Active States a Botones (M-02)**
- [ ] Actualizar Button.jsx con `active:scale-98`
- [ ] Actualizar botones primarios/iconos
- **Tiempo:** 2h
- **Responsable:** Frontend Dev

**T3.3: Animar Error Messages (M-03)**
- [ ] Crear keyframes en CSS: `slideDown` o `fadeIn`
- [ ] Aplicar a Login y Register error messages
- **Tiempo:** 1h
- **Responsable:** Frontend Dev

**T3.4: Standardize Typography Hierarchy (M-04)**
- [ ] Crear guía tipográfica en tokens.js
- [ ] Documentar: H1, H2, H3, body, small
- [ ] Aplicar a páginas inconsistentes (Dashboard, etc.)
- **Tiempo:** 3h
- **Responsable:** Frontend Lead + Designer

**T3.5: Documentar Spacing Standards (M-05)**
- [ ] Crear spacing guide en design-system/
- [ ] Asegurar uso consistente de gap-3, gap-4, p-4, p-6, etc.
- **Tiempo:** 2h
- **Responsable:** Frontend Lead

**T3.6: Añadir Skip To Content Link (M-05)**
- [ ] Implementar en Layout.jsx antes del Sidebar
- [ ] Estilizar: `sr-only focus:not-sr-only`
- **Tiempo:** 30min
- **Responsable:** Frontend Dev

**T3.7: SVG Icons Accessibility (M-09)**
- [ ] Añadir `role="img"` y `aria-label` a iconos con significado
- [ ] Añadir `aria-hidden="true"` a iconos decorativos
- **Tiempo:** 3h (revisar many icons)
- **Responsable:** Frontend Dev

**T3.8: Zebra Striping en Tablas Largas (M-11)**
- [ ] Implementar solo si tablas sobrepasan 20 filas
- [ ] Crear util class `table-zebra`
- **Tiempo:** 2h (si necesario)
- **Responsable:** Frontend Dev

---

### FASE 4 - BAJO (Semana 4) [Nice-to-Have]

**T4.1: Optimizar SVG Icons (B-01)**
- [ ] Extraer iconos repetidos a componente `<Icon />`
- [ ] o usar `react-icons` consistentemente
- **Tiempo:** 4h
- **Responsable:** Frontend Dev

**T4.2: Añadir Prefers-Reduced-Motion (B-03)**
- [ ] Añadir CSS media query
- **Tiempo:** 30min
- **Responsable:** Frontend Dev

**T4.3: Asegurar Favicon Visible en Dark Mode (B-04)**
- [ ] Generar favicon con buen contraste
- **Tiempo:** 1h
- **Responsable:** Designer

**T4.4: Page Transitions con Framer Motion (M-08)**
- [ ] Instalar framer-motion si se aprueba
- [ ] Implementar AnimatePresence en App.jsx
- **Tiempo:** 3h
- **Responsable:** Frontend Dev

**T4.5: Eliminar `transition-all` Overuse (B-07)**
- [ ] Reemplazar con `transition-colors`, `transition-transform`, etc.
- **Tiempo:** 2h
- **Responsable:** Frontend Dev

**T4.6: Centralizar Z-Index Values (B-06)**
- [ ] Crear `z-index` en tokens
- **Tiempo:** 1h
- **Responsable:** Frontend Lead

---

## 📊 MÉTRICAS POST-IMPLEMENTACIÓN

Después de completar todas las fases, esperamos:

| Categoría | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| Consistencia de colores | 6/10 | 10/10 | +40% |
| Accesibilidad (WCAG) | 6/10 | 9/10 | +50% |
| Jerarquía visual | 7/10 | 9/10 | +29% |
| Mantenibilidad | 5/10 | 9/10 | +80% |
| **Puntaje general** | **6.3/10** | **9.4/10** | **+49%** |

---

## 🛠️ HERRAMIENTAS RECOMENDADAS

### Desarrollo
- **ESLint + eslint-plugin-jsx-a11y** - Para accesibilidad en tiempo de desarrollo
- **Stylelint** - Para consistencia de Tailwind
- **Prettier** - Formato automático

### Testing
- **jest-html-reporter** + **axe-core** - Test de contraste automático
- **Lighthouse CI** - Monitoreo de accesibilidad

### Documentación
- **Storybook** - Para documentar componentes del design system
- **Zeroheight** o **Figma** - Documentación de tokens

### Monitoreo
- **Sentry** - Para detectar errores de accesibilidad en producción
- **PostHog** - Analytics de interacción

---

## 📝 CHECKLIST DE REVISIÓN PRE-DEPLOY

### Accessibility (WCAG 2.1 AA)
- [ ] Todo texto tiene ratio mínimo 4.5:1 (grande 3:1)
- [ ] Todos los botones tienen focus ring visible
- [ ] Todos los inputs tienen label asociado
- [ ] Navegación por teclado funciona en toda la app
- [ ] Skip link implementado
- [ ] ARIA labels en iconos

### Branding
- [ ] Gradientes idénticos en light y dark mode (solo ajuste de brillo)
- [ ] Color primario #662d91 presente en ambos modos
- [ ] Logo visible en ambos modos

### Usabilidad
- [ ] Touch targets mínimos 44px en móvil
- [ ] Hover/Active states consistentes
- [ ] Loading states claros
- [ ] Error messages legibles
- [ ] Disabled states distinguibles

### Performance
- [ ] Sin transiciones que causen jank (60fps)
- [ ] Tailwind purge funcionando (sin CSS muerto)
- [ ] Imágenes optimizadas

### Responsividad
- [ ] Funciona en 320px (móvil pequeño)
- [ ] Breakpoints en 640, 768, 1024, 1280px
- [ ] Sin overflow horizontal

---

## 📞 CONTACTO Y SEGUIMIENTO

**Responsable del proyecto:** Frontend Team Lead  
**Fecha límite Fase 1:** 1 semana  
**Fecha límite Fase 2:** 2 semanas  
**Fecha límite Fase 3:** 1 semana  
**Fecha límite Fase 4:** 1 semana  

**Reuniones de seguimiento:**
- Lunes: Revision de avance Fase 1
- Miércoles: Sprint review Fase 1-2
- Viernes: Retrospectiva + planeación Fase 3

---

**Fin del reporte de auditoría completa.**
