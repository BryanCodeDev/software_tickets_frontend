# 📅 PLAN DE IMPLEMENTACIÓN - MEJORAS DE DISEÑO DUVYCLASS

**Objetivo:** Alcanzar puntaje de 9/10 en calidad de diseño, cumplir WCAG 2.1 AA, y unificar identidad de marca en ambos modos.

**Duración total:** 5 semanas (1 semana por fase + 1 semana buffer)

---

## FASE 1: CRÍTICO - Identidad de Marca + Accesibilidad Legal
**Duración:** 1 semana (20-26 Abril 2026)
**Objetivo:** Corregir problemas que afectan la marca y cumplimiento legal
**Responsable:** Frontend Lead
**Entregable:** App con Gradientes consistentes y accesibilidad WCAG AA

### Tareas Detalladas:

#### T1.1: Unificar Gradientes de Marca (4h)
**Archivos:**
- `src/design-system/tokens.js` (CREAR)
- `src/components/Sidebar.jsx`
- `src/components/Navbar.jsx`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Dashboard.jsx`

**Pasos:**
1. Crear `src/design-system/tokens.js`:
```js
export const BRAND_COLORS = {
  dark: '#4a1f6e',
  main: '#662d91',
  light: '#8e4dbf',
  lighter: '#7c3aad'
};

export const GRADIENTS = {
  brand: {
    light: 'from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
    dark: 'from-[#3d1069] via-[#662d91] to-[#4a1f6e]'
  },
  brandHorizontal: {
    light: 'bg-linear-to-r from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
    dark: 'bg-linear-to-r from-[#3d1069] via-[#662d91] to-[#4a1f6e]'
  }
};
```

2. En cada archivo, reemplazar:
```jsx
// ANTES:
light: 'bg-linear-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad]'
dark: 'bg-linear-to-br from-gray-950 via-[#2d1254] to-gray-950'

// DESPUÉS:
...conditionalClasses(GRADIENTS.brand)
```

**Criterio de éxito:** Ambos modos usan el morado #662d91 como color central del gradient.

---

#### T1.2: Asegurar Contraste WCAG AA (6h)
**Archivos:** Sidebar.jsx, Dashboard.jsx, Navbar.jsx, Login.jsx, Register.jsx

**Pasos:**
1. Crear `src/design-system/colors.js` con colores validados:
```js
export const TEXT_COLORS = {
  primary: {
    light: 'text-gray-900',   // #111827 ratio 15:1 sobre #fff
    dark: 'text-gray-100'     // #f3f4f6 ratio 15:1 sobre #111
  },
  body: {
    light: 'text-gray-700',   // #374151 ratio 8.6:1
    dark: 'text-gray-300'     // #d1d5db ratio 7.5:1
  },
  secondary: {
    light: 'text-gray-500',   // #6b7280 ratio 4.5:1 justo
    dark: 'text-gray-400'     // #9ca3af NO SIRVE → usar text-gray-300
  },
  muted: {
    light: 'text-gray-400',   // solo para texto < 14px
    dark: 'text-gray-500'     // ratio bajo pero aceptable si es pequeño
  }
};
```

2. Reemplazar en código:
```jsx
// ANTES (Sidebar línea 422):
className={`text-[13px] font-bold truncate leading-tight ${conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' })}`}

// DESPUÉS:
className="text-sm font-bold truncate leading-tight text-gray-900 dark:text-gray-100"
```

3. **Regla general:**
- Texto principal (labels, títulos): `dark:text-gray-100` (no `text-gray-800`)
- Texto cuerpo (parrafos, descriptions): `dark:text-gray-300`
- Texto secundario (hints, placeholders): `dark:text-gray-400` solo si ≤ 14px

**Criterio de éxito:** Todo texto ≥ 14px cumple ratio 4.5:1 en ambos modos (verificar con WebAIM Contrast Checker).

---

#### T1.3: Focus Rings en Todos los Botones (3h)
**Archivos:**
- `src/components/Sidebar.jsx`
- `src/components/Navbar.jsx`
- `src/components/base/Button.jsx` (MEJORAR AQUÍ)
- Icon buttons en todos los componentes

**Pasos:**
1. Actualizar `src/components/base/Button.jsx`:
```jsx
const baseClasses = `
  inline-flex items-center justify-center
  rounded-lg
  font-medium
  transition-all duration-150
  focus:outline-none
  focus:ring-2
  focus:ring-[#662d91]
  focus:ring-opacity-60
  focus:ring-offset-2
  dark:focus:ring-offset-gray-900
  disabled:opacity-60 disabled:cursor-not-allowed
  active:scale-98
`;
```

2. En Sidebar y Navbar, asegurar que botones icon-only también tengan focus ring:

```jsx
<button
  onClick={toggleSidebarCollapse}
  className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#662d91] focus:ring-opacity-60 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-150 shrink-0"
>
```

**Criterio de éxito:** Todos los botones muestran anillo de foco morado al presionar Tab. El offset evita que el anillo se corte.

---

#### T1.4: Input Icons Adaptativos (2h)
**Archivos:**
- `src/components/base/Input.jsx`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- Cualquier otro formulario

**Pasos:**
1. En `Input.jsx`, modificar `getIconStyle()`:
```js
const getIconStyle = () => conditionalClasses({
  light: 'h-5 w-5 text-gray-400',
  dark: 'h-5 w-5 text-gray-300'  // Más claro para contraste
});
```

2. En los forms que hardcodean SVG icons (Login, Register):
 Buscar todos los `<svg className="h-4 w-4 text-gray-400"` y reemplazar por:
```jsx
<svg className={conditionalClasses({
  light: 'h-4 w-4 text-gray-400',
  dark: 'h-4 w-4 text-gray-300'
})} ... />
```

**Criterio de éxito:** Iconos de inputs se ven claramente en ambos modos.

---

#### T1.5: Implementar Escala Tipográfica (4h)
**Archivos:**
- `tailwind.config.js`
- Todos los componentes (aplicar cambios)

**Pasos:**
1. Actualizar `tailwind.config.js`:
```js
theme: {
  extend: {
    fontSize: {
      'xs': '0.75rem',     // 12px
      'sm': '0.875rem',    // 14px
      'base': '1rem',      // 16px
      'lg': '1.125rem',    // 18px
      'xl': '1.25rem',     // 20px
      '2xl': '1.5rem',     // 24px
      '3xl': '1.875rem',   // 30px
      '4xl': '2.25rem',    // 36px
    }
  }
}
```

2. Aplicar cambios:

**Sidebar.jsx:**
```jsx
// ANTES:
< span className="block text-[13px] font-semibold leading-tight truncate">{item.label}</span>
< span className={`block text-[11px] truncate leading-tight mt-0.5 ...`}>{item.description}</span>

// DESPUÉS:
< span className="block text-sm font-semibold leading-tight truncate">{item.label}</span>
< span className={`block text-xs truncate leading-tight mt-0.5 ...`}>{item.description}</span>
```

**Dashboard.jsx:**
```jsx
// Mantener: text-sm para body, text-lg para card titles
// Ajustar page heading a text-2xl sm:text-3xl
```

**Login/Register:**
```jsx
// Títulos de página: text-3xl → text-2xl sm:text-3xl (responsivo)
// Labels: text-xs → text-sm (mejor legibilidad)
// Inputs: ya usan text-sm (OK)
```

**Criterio de éxito:** Eliminación completa de valores `text-[Npx]` personalizados. Solo usar `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.

---

#### T1.6: Estándar de Border Radius (2h)
**Archivos:** Dashboard.jsx, TicketCard.jsx, otros componentes con `rounded-lg`

**Pasos:**
1. Decisión: 
   - Inputs y botones: `rounded-lg` (12px) - MODERNO
   - Cards: `rounded-lg` (12px) - UNIFICAR
   - Modales: `rounded-2xl` (16px) - ÉNFASIS

2. Aplicar cambios:

**Dashboard.jsx (StatCard):**
```jsx
// ANTES:
light: `... rounded-lg ...`
dark: `... rounded-lg ...`

// DESPUÉS:
light: `... rounded-xl ...`  // Cambiar a rounded-xl para unificar con resto
dark: `... rounded-xl ...`
```

**TicketCard.jsx:**
```jsx
// Si tiene: rounded-xl lg:rounded-2xl
// Cambiar a: rounded-xl unified
className="rounded-xl"
```

**Criterio de éxito:** Solo 2 valores: `rounded-lg` (12px) en inputs/botones/cards, `rounded-2xl` (16px) en modales.

---

#### T1.7: Disabled States Consistentes (2h)
**Archivos:**
- `src/components/base/Button.jsx`
- `src/components/base/Input.jsx`

**Pasos:**

**Button.jsx:**
```jsx
// AGREGAR:
disabled:opacity-60
disabled:cursor-not-allowed
disabled:bg-gray-300 dark:disabled:bg-gray-700
disabled:text-gray-500 dark:disabled:text-gray-500

// Para botones con gradiente:
disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600
```

**Input.jsx:**
```jsx
// AGREGAR:
disabled:bg-gray-100 dark:disabled:bg-gray-800
disabled:text-gray-500 dark:disabled:text-gray-600
disabled:border-gray-300 dark:disabled:border-gray-700
disabled:cursor-not-allowed
```

**Criterio de éxito:** Botones e inputs deshabilitados tienen cambio de color, no solo opacidad.

---

#### T1.8: Escala de Sombras Unificada (3h)
**Archivos:** App.css o crear nuevo archivo design-system/shadows.css

**Pasos:**
1. Crear utilidades CSS en `src/design-system/shadows.css`:
```css
.elevation-flat {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.dark .elevation-flat {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.3);
}

.elevation-raised {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.dark .elevation-raised {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
}

.elevation-floating {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.dark .elevation-floating {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
}

.elevation-modal {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
.dark .elevation-modal {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.75);
}
```

2. Aplicar:

**Button.jsx:** `elevation-raised` (actualmente `shadow-md`)
**StatCard:** `elevation-flat` (actualmente `shadow-sm`)
**Modal.jsx:** `elevation-modal` (ya tiene `shadow-2xl`)
**Sidebar:** cambiar de `shadow-xl` a `elevation-floating` o `elevation-raised`

**Criterio de éxito:** Cada tipo de elemento usa su sombra semántica, consistente en ambos modos.

---

**Checklist Fase 1 Completo:**
- [ ] T1.1 Gradientes
- [ ] T1.2 Contraste WCAG
- [ ] T1.3 Focus rings
- [ ] T1.4 Input icons
- [ ] T1.5 Tipografía
- [ ] T1.6 Border radius
- [ ] T1.7 Disabled states
- [ ] T1.8 Sombras
- [ ] Testing manual en light y dark mode
- [ ] Validación con contrast checker
- [ ] QA approval

---

## FASE 2: ALTO - Consistencia y Mantenibilidad
**Duración:** 1 semana (27 Abr - 3 May 2026)
**Objetivo:** Eliminar hardcodeos y estandarizar comportamiento
**Responsable:** Frontend Dev + Frontend Lead

### Tareas Detalladas:

#### T2.1: Centralizar Design Tokens (6h)
**Objetivo:** Eliminar valores hardcodeados como `#662d91`, `border-gray-200`, etc.

```js
// src/design-system/tokens.js (ampliar)
export const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
};

export const BORDER_RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
};

export const TRANSITION = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '350ms ease-in-out'
};
```

**Aplicar:**
- Reemplazar hardcodeados en todos los componentes
- Usar `cn()` helper (clsx + tailwind-merge)

**Criterio de éxito:** 0 valores hex hardcodeados en componentes (solo en tokens).

---

#### T2.2: Estandarizar Hover Effects (4h)
**Objetivo:** Mismo comportamiento hover en elementos similares

**Crear `src/design-system/hover.js`:**
```js
export const hoverStyles = {
  interactive: 'hover:shadow-lg hover:-translate-y-0.5 active:scale-98',
  listItem: 'hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-[#662d91] dark:hover:text-purple-300',
  buttonPrimary: 'hover:from-[#5a2480] hover:to-[#7c3aad] hover:shadow-lg hover:shadow-[#662d91]/25 active:scale-98'
};
```

**Aplicar a:**
- Botones primarios
- Cards clickeables
- List items (Sidebar, dropdowns)

---

#### T2.3: Mejorar Active Indicator Sidebar (1h)
**Ubicación:** Sidebar.jsx:221

**Cambiar:**
```jsx
// ANTES:
<span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/60 rounded-r-full" />

// DESPUÉS:
<span className={conditionalClasses({
  light: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#662d91] rounded-r-full shadow-sm',
  dark: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full shadow-lg'
})} />
```

---

#### T2.4: Suavizar Badges de Roles (2h)
**Opción elegida:** Colores sólidos más elegantes (opción 1)

**Cambiar en Sidebar.jsx (líneas 124-132):**
```jsx
const roleBadges = {
  'Administrador': {
    light: 'bg-red-100 text-red-700 border border-red-200',
    dark: 'bg-red-900/30 text-red-300 border border-red-800'
  },
  'Técnico': {
    light: 'bg-sky-100 text-sky-700 border border-sky-200',
    dark: 'bg-sky-900/30 text-sky-300 border border-sky-800'
  },
  // ... solo Calidad puede mantener gradiente sutil:
  'Calidad': {
    light: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
    dark: 'bg-gradient-to-r from-purple-900/40 to-purple-800/30 text-purple-300'
  }
};
```

---

#### T2.5: Global Scrollbar Styling (2h)
**Crear `src/design-system/scrollbar.css`:**
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: theme('colors.gray.100');
}
.dark .custom-scrollbar::-webkit-scrollbar-track {
  background-color: theme('colors.gray.800');
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.300');
  border-radius: 9999px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.600');
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.gray.400');
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.gray.500');
}
```

**Aplicar clase a:**
- Sidebar nav: `<nav className="... custom-scrollbar">`
- TicketTable overflow
- NotificationsPanel list
- Cualquier `overflow-y-auto`

---

#### T2.6: Enlace Colores con Theme (2h)
**Buscar y reemplazar:**
```bash
# En consola buscar:
grep -r "text-\[#8e4dbf\]" src/
grep -r "text-\[#662d91\]" src/
```

**Reemplazar con:**
```jsx
className={conditionalClasses({
  light: 'text-[#662d91] hover:text-[#8e4dbf]',
  dark: 'text-purple-400 hover:text-purple-300'
})}
```

---

#### T2.7: Añadir aria-labels a Icon Buttons (1h)
**Checklist:**
- [x] Sidebar collapse toggle: `aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}` (ya está)
- [ ] Sidebar mobile close: `aria-label="Cerrar menú"` (ya está)
- [ ] ThemeToggle: `aria-label="Cambiar tema"` (revisar)
- [ ] Notifications panel button: `aria-label="Notificaciones"`
- [ ] Password toggle buttons: `aria-label="Mostrar contraseña"`

---

**Checklist Fase 2 Completo:**
- [ ] T2.1 Design tokens centralized
- [ ] T2.2 Hover effects estandarizados
- [ ] T2.3 Active indicator mejorado
- [ ] T2.4 Badges suavizados
- [ ] T2.5 Scrollbar global
- [ ] T2.6 Colores de enlaces con tema
- [ ] T2.7 ARIA labels completos
- [ ] QA regression testing

---

## FASE 3: MEDIO - Perfeccionamiento UX
**Duración:** 1 semana (4-10 Mayo 2026)
**Objetivo:** Mejorar micro-interacciones y consistencia
**Responsable:** Frontend Dev

### Tareas:

#### T3.1: Transiciones de Tema Suaves (1h)
**Archivo:** `src/index.css` o `App.css`

```css
/* Suavizar cambio de background-color */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Solo elementos que cambian de color */
.bg-white,
.bg-gray-50, .bg-gray-100,
.bg-gray-800, .bg-gray-900,
.text-gray-900, .text-gray-100,
.text-gray-700, .text-gray-300,
.border-gray-200, .border-gray-700 {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
```

---

#### T3.2: Active States en Botones (2h)
**Archivo:** `src/components/base/Button.jsx`

```jsx
// Añadir a component base:
className={`
  ... 
  active:scale-98
  active:shadow-inner
  ${variantStyles}
`}
```

**Probar:** Que no entre en conflicto con `disabled`.

---

#### T3.3: Animación de Error Messages (1h)
**Archivos:** Login.jsx, Register.jsx

```jsx
// CSS:
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}

// En componente:
{error && (
  <div className="mb-5 flex items-start gap-3 rounded-xl p-3.5 animate-slide-down ...">
```

---

#### T3.4: Zebra Striping en Tablas (2h) [Opcional]

**Crear util:**
```jsx
// src/components/base/Table.jsx
export const TableRow = ({ children, index }) => (
  <tr className={index % 2 === 0
    ? 'bg-white dark:bg-gray-800'
    : 'bg-gray-50 dark:bg-gray-900/50'
  }>
    {children}
  </tr>
);
```

**Aplicar a:** TicketList, Users table, etc.

---

#### T3.5: Skip Link Implementation (30min)
**Archivo:** `src/components/Layout.jsx`

```jsx
return (
  <div className="flex min-h-screen">
    {/* Skip Link */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-main text-white px-4 py-2 rounded-lg z-50"
    >
      Saltar al contenido principal
    </a>

    <Sidebar ... />
    <div className="flex-1 ...">
      <Navbar ... />
      <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-5">
        {children}
      </main>
    </div>
  </div>
);
```

---

#### T3.6: SVG Icons Accessibility (3h)
**Auditar y corregir:**

```jsx
// Iconos decorativos (sin texto):
<svg aria-hidden="true" focusable="false" ...>

// Iconos con significado (logo, alertas, estados):
<svg role="img" aria-label="Logo DuvyClass" ...>
```

**Lista a revisar:**
- Logo en Sidebar/Navbar (con label)
- Iconos de status (check circle, warning, error)
- Iconos de features en Login/Register

---

#### T3.7: Form Autocomplete Styling (1h) [Opcional]

**En `src/index.css`:**
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: theme('colors.gray.900');
  -webkit-box-shadow: 0 0 0px 1000px theme('colors.white') inset;
  transition: background-color 5000s ease-in-out 0s;
}

.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus,
.dark input:-webkit-autofill:active {
  -webkit-text-fill-color: theme('colors.gray.100');
  -webkit-box-shadow: 0 0 0px 1000px theme('colors.gray.800') inset;
}
```

---

**Checklist Fase 3 Completo:**
- [ ] T3.1 Transiciones tema
- [ ] T3.2 Active states
- [ ] T3.3 Error animations
- [ ] T3.4 Zebra tables (opcional)
- [ ] T3.5 Skip link
- [ ] T3.6 SVG accessibility
- [ ] T3.7 Autocomplete styles
- [ ] Testing completo

---

## FASE 4: BAJO - Pulido Final
**Duración:** 1 semana (11-17 Mayo 2026)
**Objetivo:** Detalles, optimización, documentación
**Responsable:** Frontend Dev + Designer

### Tareas:

#### T4.1: Page Transitions con Framer Motion (3h)
**Instalar:** `npm install framer-motion`

**Implementar en `App.jsx`:**
```jsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: 20, y: 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -20, y: 0 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.2
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
        transition={pageTransition}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            {/* routes */}
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

#### T4.2: Prefers-Reduced-Motion (30min)
**Archivo:** `src/index.css`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

#### T4.3: Design System Documentation (4h)
**Crear `src/design-system/README.md`:**
- Tokens (colors, spacing, fonts, radii, shadows)
- Componentes base
- Guidelines de uso
- Ejemplos de código

**Opcional:** Configurar Storybook para componentes base.

---

#### T4.4: Favicon Dark Mode Ready (1h)
- Generar favicon SVG con buen contraste
- Asegurar visible sobre fondos oscuros
- Crear `favicon.svg` y `favicon.ico`

---

#### T4.5: Eliminar `transition-all` Overuse (2h)
**Auditar y reemplazar:**
```bash
# Buscar transition-all
grep -r "transition-all" src/components/ | grep -v node_modules
```

**Reemplazar con:**
- `transition-colors` (solo colores)
- `transition-transform` (solo transform)
- `transition-shadow` (solo shadow)

---

#### T4.6: Z-Index Centralization (1h)
**Crear `src/design-system/z-index.js`:**
```js
export const Z_INDEX = {
  dropdown: 40,
  sidebar: 50,
  navbar: 30,
  modal: 60,
  tooltip: 70,
  toast: 80
};
```

**Aplicar a todos los `z-*` hardcodeados.

---

**Checklist Fase 4 Completo:**
- [ ] T4.1 Page transitions
- [ ] T4.2 Reduced motion
- [ ] T4.3 Design system docs
- [ ] T4.4 Favicon
- [ ] T4.5 Optimizar transitions
- [ ] T4.6 Z-index centralizado
- [ ] Deploy a staging environment
- [ ] QA final

---

## 📊 MÉTRICAS DE ÉXITO

### Antes / Después

| Categoría | Antes | Después | Δ |
|-----------|-------|---------|---|
| **Design Consistency** | 6/10 | **9.5/10** | +58% |
| **Accessibility (WCAG)** | 6/10 | **9/10** | +50% |
| **Brand Coherence** | 5/10 | **10/10** | +100% |
| **Maintainability** | 5/10 | **9/10** | +80% |
| **User Experience** | 7/10 | **9/10** | +29% |
| **Overall Score** | **5.8/10** | **9.3/10** | +60% |

---

## 🧪 PLAN DE TESTING

### Unit Tests (Jest + React Testing Library)
- [ ] Test focus ring appears on button focus
- [ ] Test disabled state styles applied correctly
- [ ] Test conditionalClasses returns correct values for light/dark

### Visual Regression Testing (Percy/Chromatic)
- [ ] Capture baseline screenshots (light mode)
- [ ] Capture dark mode screenshots
- [ ] Ensure no visual regressions after changes

### Accessibility Testing
- [ ] Run `axe-core` on all pages
- [ ] Manual keyboard navigation test
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Color contrast validation (all text)

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 DESPLIEGUE

### Staging (Semana 4)
1. Merge a `develop` branch
2. Deploy a staging environment
3. Ejecutar suite completa de tests
4. Validación de diseño por stakeholder
5. Correcciones finales

### Production (Semana 5)
1. Merge a `main` con PR revisado
2. Deploy production (canary 10% → 50% → 100%)
3. Monitoreo con Sentry dev errors
4. Lighthouse CI para asegurar accesibilidad
5. Rollback plan documentado

---

## 📋 RECURSOS ASIGNADOS

| Recurso | Horas/semana | Fases |
|---------|--------------|-------|
| Frontend Lead | 40h | F1 (complete), F2 (supervisión) |
| Frontend Dev 1 | 40h | F1, F2, F3, F4 |
| Frontend Dev 2 | 40h | F2, F3 (apoyo) |
| QA Tester | 20h | Test F1 → F4 |
| Designer/UX | 10h | Review F1, F4 |

**Total horas dev:** ~160h  
**Total horas QA:** ~40h  
**Total estimado:** 200 horas

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Regresiones visuales en producción | Media | Alto | Staging environment + visual regression testing |
| Performance regression por transiciones CSS | Baja | Medio | Lighthouse audit pre-despliegue |
| Bugs cross-browser en modo oscuro | Media | Medio | Testing en 5 navegadores antes de PRD |
| Retraso en Fase 1 por bugs unknowns | Alta | Alto | Buffer de 2 días en timeline, priorizar T1.1-T1.3 |
| Resistencia al cambio del equipo | Baja | Bajo | Documentación + pair programming sessions |

---

## 📞 COMUNICACIONES

**Reuniones diarias:** 9:00 AM (Standup 15min)  
**Revisión semanal:** Viernes 4:00 PM (Sprint Review)  
**Retrospectiva:** Viernes 4:30 PM  
**Demo a stakeholders:** Miércoles Fase 1 (3 Mayo), Fase 2 (10 Mayo)

**Canales:**
- Slack: #frontend-duvyclass
- Jira/Trello: Tablero "Diseño Frente 2026"
- Documentación: GitHub Wiki / Notion

---

**Aprobado por:** Frontend Team Lead  
**Fecha de inicio:** 20 Abril 2026  
**Fecha de fin estimada:** 17 Mayo 2026  
**Versión:** 1.0
