/**
 * MUI v6 Theme Adapter
 *
 * Bridges the framework-agnostic design tokens in `tokens.ts` to a Material UI
 * `ThemeOptions` object. This is the integration point between Aria's design
 * system and the MUI components used throughout the template.
 *
 * Usage:
 *   import { buildMuiTheme } from '@/design-system';
 *   const theme = createTheme(buildMuiTheme('light'));
 */

import type { ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';
import { darkTheme, lightTheme } from './theme';

type Mode = 'light' | 'dark';

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: tokens.typography.fontFamily.body,
  h1: {
    fontFamily: tokens.typography.fontFamily.display,
    fontSize: tokens.typography.fontSize['4xl'],
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
  },
  h2: {
    fontFamily: tokens.typography.fontFamily.display,
    fontSize: tokens.typography.fontSize['3xl'],
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
  },
  h3: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
  },
  h4: {
    fontSize: tokens.typography.fontSize.xl,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.snug,
  },
  h5: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.snug,
  },
  h6: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.snug,
  },
  body1: {
    fontSize: tokens.typography.fontSize.base,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  body2: {
    fontSize: tokens.typography.fontSize.sm,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  button: {
    textTransform: 'none',
    fontWeight: tokens.typography.fontWeight.medium,
  },
};

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: tokens.typography.fontWeight.medium,
        borderRadius: tokens.radius.md,
        minHeight: 44, // WCAG 2.2 AA touch target
        minWidth: 44,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': { minHeight: 44 },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: { root: { minHeight: 44, minWidth: 44 } },
  },
};

export const lightMuiThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: tokens.colors.brand[500],
      light: tokens.colors.brand[400],
      dark: tokens.colors.brand[700],
      contrastText: tokens.colors.neutral[0],
    },
    secondary: {
      main: tokens.colors.brand[700],
      light: tokens.colors.brand[500],
      dark: tokens.colors.brand[900],
      contrastText: tokens.colors.neutral[0],
    },
    error: {
      main: tokens.colors.error.base,
      light: tokens.colors.error.light,
      dark: tokens.colors.error.dark,
    },
    warning: {
      main: tokens.colors.warning.base,
      light: tokens.colors.warning.light,
      dark: tokens.colors.warning.dark,
    },
    info: {
      main: tokens.colors.info.base,
      light: tokens.colors.info.light,
      dark: tokens.colors.info.dark,
    },
    success: {
      main: tokens.colors.success.base,
      light: tokens.colors.success.light,
      dark: tokens.colors.success.dark,
    },
    background: { default: lightTheme.bg.base, paper: lightTheme.bg.subtle },
    text: { primary: lightTheme.fg.base, secondary: lightTheme.fg.muted },
    divider: lightTheme.border.base,
  },
  shape: { borderRadius: 8 },
  typography: sharedTypography,
  components: sharedComponents,
};

export const darkMuiThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.colors.brand[400],
      light: tokens.colors.brand[300],
      dark: tokens.colors.brand[600],
      contrastText: tokens.colors.neutral[950],
    },
    secondary: {
      main: tokens.colors.brand[300],
      light: tokens.colors.brand[200],
      dark: tokens.colors.brand[500],
      contrastText: tokens.colors.neutral[950],
    },
    error: {
      main: tokens.colors.error.base,
      light: tokens.colors.error.light,
      dark: tokens.colors.error.dark,
    },
    warning: {
      main: tokens.colors.warning.base,
      light: tokens.colors.warning.light,
      dark: tokens.colors.warning.dark,
    },
    info: {
      main: tokens.colors.info.base,
      light: tokens.colors.info.light,
      dark: tokens.colors.info.dark,
    },
    success: {
      main: tokens.colors.success.base,
      light: tokens.colors.success.light,
      dark: tokens.colors.success.dark,
    },
    background: { default: darkTheme.bg.base, paper: darkTheme.bg.subtle },
    text: { primary: darkTheme.fg.base, secondary: darkTheme.fg.muted },
    divider: darkTheme.border.base,
  },
  shape: { borderRadius: 8 },
  typography: sharedTypography,
  components: sharedComponents,
};

/** Returns MUI ThemeOptions for the given mode. */
export function buildMuiTheme(mode: Mode): ThemeOptions {
  return mode === 'dark' ? darkMuiThemeOptions : lightMuiThemeOptions;
}
