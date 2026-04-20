import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes with conflict resolution
 * Usage: cn('px-4 py-2', conditionalClass, 'rounded-lg')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Conditional class merger for light/dark themes
 * Usage: cn(conditional({ light: 'bg-white', dark: 'bg-gray-800' }))
 */
export function conditional<T extends Record<string, string>>(classes: T): string {
  return clsx(classes);
}

/**
 * Get brand gradient classes (full background)
 */
export function brandGradient(darkMode = false): string {
  return darkMode
    ? 'bg-gradient-to-br from-[#3d1069] via-[#662d91] to-[#4a1f6e]'
    : 'bg-gradient-to-br from-[#4a1f6e] via-[#662d91] to-[#7c3aad]';
}

/**
 * Get brand horizontal gradient classes
 */
export function brandGradientHorizontal(darkMode = false): string {
  return darkMode
    ? 'bg-gradient-to-r from-[#3d1069] via-[#662d91] to-[#4a1f6e]'
    : 'bg-gradient-to-r from-[#4a1f6e] via-[#662d91] to-[#7c3aad]';
}

/**
 * Get brand hover background color
 */
export function brandHoverBg(darkMode = false): string {
  return darkMode ? 'hover:bg-gray-800' : 'hover:bg-[#f8f3ff]';
}

/**
 * Get brand active background color
 */
export function brandActiveBg(darkMode = false): string {
  return darkMode ? 'bg-purple-900/30' : 'bg-[#f3ebff]';
}

/**
 * Get brand subtle hover background (for inactive items)
 */
export function brandSubtleHoverBg(darkMode = false): string {
  return darkMode ? 'hover:bg-gray-800/60' : 'hover:bg-[#ede5f9]';
}

/**
 * Get brand text color (main)
 */
export function brandText(darkMode = false): string {
  return darkMode ? 'text-purple-300' : 'text-[#662d91]';
}

/**
 * Get brand border color
 */
export function brandBorder(darkMode = false): string {
  return darkMode ? 'border-purple-800/30' : 'border-[#662d91]/20';
}

// ─── Color values (for inline styles or dynamic strings) ─────────────────────
export const COLORS = {
  brandMain: '#662d91',
  brandLight: '#8e4dbf',
  brandDark: '#4a1f6e',
  brandHoverLight: '#f8f3ff',
  brandActiveLight: '#f3ebff',
  brandSubtle: '#ede5f9',
};

