// ─── Entitlements ───────────────────────────────────────────────────────────
// Granular permissions that control access to specific features or actions.
// Extend this object when adding new capabilities to the application.
//
// Convention:  VERB_RESOURCE  e.g. VIEW_ANALYTICS_DASHBOARD
//
// These are stored as a plain constant so the same file can be imported on
// both the frontend (React hooks) and backend (API route guards, Lambda).
// When you are ready to move entitlements to the database, replace this
// object with a fetcher that returns the same shape.

export const ENTITLEMENTS = {
  // ── Analytics ───────────────────────────────────────────────────────────
  VIEW_ANALYTICS_DASHBOARD: 'VIEW_ANALYTICS_DASHBOARD',

  // ── User management ────────────────────────────────────────────────────
  CREATE_USER: 'CREATE_USER',
  VIEW_USER: 'VIEW_USER',
  EDIT_USER: 'EDIT_USER',
  DELETE_USER: 'DELETE_USER',

  // ── Profile management ─────────────────────────────────────────────────
  VIEW_PROFILE: 'VIEW_PROFILE',
  EDIT_PROFILE: 'EDIT_PROFILE',
  DELETE_PROFILE: 'DELETE_PROFILE',

  // ── Content ────────────────────────────────────────────────────────────
  CREATE_CONTENT: 'CREATE_CONTENT',
  EDIT_CONTENT: 'EDIT_CONTENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  PUBLISH_CONTENT: 'PUBLISH_CONTENT',

  // ── Orders / E-commerce ────────────────────────────────────────────────
  VIEW_ORDERS: 'VIEW_ORDERS',
  MANAGE_ORDERS: 'MANAGE_ORDERS',

  // ── Settings ───────────────────────────────────────────────────────────
  VIEW_SETTINGS: 'VIEW_SETTINGS',
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
} as const;
