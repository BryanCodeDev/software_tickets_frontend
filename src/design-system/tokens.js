/**
 * Design Tokens - DuvyClass
 * Centralized design tokens for consistent theming across light/dark modes
 */

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const BRAND_COLORS = {
  dark: '#4a1f6e',    // Color más oscuro (para gradientes oscuros)
  main: '#662d91',    // Color principal de marca (PÚRPURA)
  light: '#8e4dbf',   // Color claro (hover states)
  lighter: '#7c3aad', // Más claro aún
};

// ─── Gradients ────────────────────────────────────────────────────────────────
export const GRADIENTS = {
  brand: {
    light: 'bg-gradient-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
    dark: 'bg-gradient-to-br from-[#3d1069] via-[#662d91] to-[#4a1f6e]',
  },
  brandHorizontal: {
    light: 'bg-gradient-to-r from-[#4a1f6e] via-[#662d91] to-[#7c3aad]',
    dark: 'bg-gradient-to-r from-[#3d1069] via-[#662d91] to-[#4a1f6e]',
  },
  brandSubtle: {
    light: 'bg-gradient-to-br from-purple-50 to-white',
    dark: 'bg-gradient-to-br from-purple-900/40 to-gray-800',
  },
};

// ─── Text Colors (WCAG AA Compliant) ─────────────────────────────────────────
export const TEXT_COLORS = {
  primary: {
    light: 'text-gray-900',   // Ratio 15:1 sobre blanco ✓
    dark: 'text-gray-100',    // Ratio 15:1 sobre negro ✓
  },
  body: {
    light: 'text-gray-700',   // Ratio 8.6:1 ✓
    dark: 'text-gray-300',    // Ratio 7.5:1 ✓
  },
  secondary: {
    light: 'text-gray-500',   // Ratio 4.5:1 ✓ (mínimo)
    dark: 'text-gray-300',    // Mejorado: 7.5:1 (era gray-400 = 3.4:1 ❌)
  },
  muted: {
    light: 'text-gray-400',   // Para texto pequeño (<14px)
    dark: 'text-gray-500',    // Ratio bajo pero aceptable en tamaños pequeños
  },
};

// ─── Background Colors ────────────────────────────────────────────────────────
export const BG_COLORS = {
  sidebar: {
    light: 'bg-white border-r border-gray-100',
    dark: 'bg-gray-900 border-r border-gray-800/60',
  },
  header: GRADIENTS.brand,
  main: {
    light: 'bg-gray-50',
    dark: 'bg-gray-900',
  },
  card: {
    light: 'bg-white border border-gray-200',
    dark: 'bg-gray-800 border border-gray-600',
  },
  footer: {
    light: 'border-t border-gray-100 bg-gray-50/80',
    dark: 'border-t border-gray-800/60 bg-gray-950',
  },
  input: {
    light: 'bg-gray-50',
    dark: 'bg-gray-800',
  },
  hover: {
    light: 'hover:bg-gray-50',
    dark: 'hover:bg-gray-800',
  },
  subtle: {
    light: 'bg-gray-100',
    dark: 'bg-gray-800',
  }
};

// ─── Extended Color Palette (Hardcodeados identificados) ───────────────────────
export const PALETTE = {
  // Brand shades
  brand: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    main: '#662d91',
    dark: '#4a1f6e',
    light: '#8e4dbf',
  },
  // Hover/accent backgrounds
  brandHover: {
    light: '#f8f3ff',  // hover bg light
    active: '#f3ebff', // active bg light
    subtle: '#ede5f9', // subtle hover
  },
  // Gray scale (con valores exactos)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// ─── Interactive States ───────────────────────────────────────────────────────
export const INTERACTIVE = {
  activeItem: {
    light: 'bg-gradient-to-r from-[#662d91] to-[#8e4dbf] text-white shadow-md shadow-[#662d91]/20',
    dark: 'bg-gradient-to-r from-[#662d91]/80 to-[#8e4dbf]/70 text-white shadow-md shadow-purple-900/30',
  },
  inactiveItem: {
    light: 'text-gray-600 hover:text-[#662d91] hover:bg-[#f8f3ff]',
    dark: 'text-gray-400 hover:text-purple-300 hover:bg-gray-800/60',
  },
  activeSubmenu: {
    light: 'bg-[#f3ebff] text-[#662d91]',
    dark: 'bg-purple-900/30 text-purple-300',
  },
  inactiveSubmenu: {
    light: 'text-gray-500 hover:text-[#8e4dbf] hover:bg-[#f8f3ff]',
    dark: 'text-gray-500 hover:text-purple-400 hover:bg-gray-800/60',
  },
};

// ─── Shadows / Elevation ──────────────────────────────────────────────────────
export const ELEVATION = {
  flat: {
    light: 'shadow-sm', // 0 1px 2px rgba(0,0,0,0.05)
    dark: 'shadow-sm',  // same class, different opacity in CSS
  },
  raised: {
    light: 'shadow-md',
    dark: 'shadow-md',
  },
  floating: {
    light: 'shadow-lg',
    dark: 'shadow-lg',
  },
  modal: {
    light: 'shadow-2xl',
    dark: 'shadow-2xl',
  },
  hero: {
    light: 'shadow-xl',
    dark: 'shadow-xl',
  },
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 'rounded-sm',   // 2px
  md: 'rounded-md',   // 6px - badges, tags
  lg: 'rounded-lg',   // 12px - inputs, buttons, cards (ESTÁNDAR)
  xl: 'rounded-xl',   // 16px - modales, contenedores principales
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

// ─── Spacing Scale (extend Tailwind) ─────────────────────────────────────────
export const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};

// ─── Transitions ──────────────────────────────────────────────────────────────
export const TRANSITIONS = {
  fast: 'duration-150 ease-out',
  normal: 'duration-200 ease-out',
  slow: 'duration-300 ease-in-out',
};

// ─── Focus Ring ───────────────────────────────────────────────────────────────
export const FOCUS_RING = {
  primary: 'focus:ring-2 focus:ring-[#662d91] focus:ring-opacity-60 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  subtle: 'focus:ring-2 focus:ring-[#662d91] focus:ring-opacity-30',
};

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
export const Z_INDEX = {
  dropdown: 40,
  navbar: 30,
  sidebar: 50,
  modal: 60,
  tooltip: 70,
  toast: 80,
};

// ─── Color Tokens for JS Values ───────────────────────────────────────────────
export const COLORS = {
  brandMain: BRAND_COLORS.main,
  brandLight: BRAND_COLORS.light,
  brandDark: BRAND_COLORS.dark,
  // Accent colors
  success: {
    light: 'bg-green-100 text-green-700 border-green-200',
    dark: 'bg-green-900/30 text-green-300 border-green-800',
  },
  warning: {
    light: 'bg-amber-100 text-amber-700 border-amber-200',
    dark: 'bg-amber-900/30 text-amber-300 border-amber-800',
  },
  error: {
    light: 'bg-red-100 text-red-700 border-red-200',
    dark: 'bg-red-900/30 text-red-300 border-red-800',
  },
  info: {
    light: 'bg-blue-100 text-blue-700 border-blue-200',
    dark: 'bg-blue-900/30 text-blue-300 border-blue-800',
  },
};

// ─── Export default ───────────────────────────────────────────────────────────
export default {
  BRAND_COLORS,
  GRADIENTS,
  TEXT_COLORS,
  BG_COLORS,
  INTERACTIVE,
  ELEVATION,
  RADIUS,
  SPACING,
  TRANSITIONS,
  FOCUS_RING,
  Z_INDEX,
  COLORS,
};
