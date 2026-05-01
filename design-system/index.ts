/**
 * Design System — Barrel Export
 *
 * Single source of truth for all visual decisions. Aria (UX Agent) reads
 * `tokens.ts` before producing any design artifact. Application code should
 * import from this module, never hardcode colors / spacing / typography.
 */

export { tokens } from './tokens';
export type { Tokens } from './tokens';
export {
  lightTheme as lightSemanticTheme,
  darkTheme as darkSemanticTheme,
} from './theme';
export type { Theme as SemanticTheme } from './theme';
export {
  buildMuiTheme,
  lightMuiThemeOptions,
  darkMuiThemeOptions,
} from './mui-theme';
