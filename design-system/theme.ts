import { tokens } from './tokens';

/**
 * 🌗 Theme Configuration
 * Maps semantic role names to token values.
 * Use these in components — never use raw tokens directly.
 */

export const lightTheme = {
  // Backgrounds
  bg: {
    base: tokens.colors.neutral[0],
    subtle: tokens.colors.neutral[50],
    muted: tokens.colors.neutral[100],
    emphasis: tokens.colors.neutral[200],
  },
  // Foregrounds / Text
  fg: {
    base: tokens.colors.neutral[900],
    muted: tokens.colors.neutral[600],
    subtle: tokens.colors.neutral[400],
    onBrand: tokens.colors.neutral[0],
  },
  // Borders
  border: {
    base: tokens.colors.neutral[200],
    muted: tokens.colors.neutral[100],
    emphasis: tokens.colors.neutral[300],
  },
  // Brand
  brand: {
    base: tokens.colors.brand[500],
    hover: tokens.colors.brand[600],
    subtle: tokens.colors.brand[50],
    emphasis: tokens.colors.brand[700],
  },
  // Semantic
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  error: tokens.colors.error,
  info: tokens.colors.info,
} as const;

export const darkTheme: typeof lightTheme = {
  bg: {
    base: tokens.colors.neutral[950],
    subtle: tokens.colors.neutral[900],
    muted: tokens.colors.neutral[800],
    emphasis: tokens.colors.neutral[700],
  },
  fg: {
    base: tokens.colors.neutral[50],
    muted: tokens.colors.neutral[400],
    subtle: tokens.colors.neutral[600],
    onBrand: tokens.colors.neutral[0],
  },
  border: {
    base: tokens.colors.neutral[800],
    muted: tokens.colors.neutral[900],
    emphasis: tokens.colors.neutral[700],
  },
  brand: {
    base: tokens.colors.brand[400],
    hover: tokens.colors.brand[300],
    subtle: tokens.colors.brand[950],
    emphasis: tokens.colors.brand[200],
  },
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  error: tokens.colors.error,
  info: tokens.colors.info,
} as const;

export type Theme = typeof lightTheme;
