// ─── Roles ──────────────────────────────────────────────────────────────────
// A role groups a set of entitlements together.
// One user profile can have multiple roles; the effective entitlements are the
// union of all entitlements across all assigned roles.

import { ENTITLEMENTS } from './entitlements';
import type { RoleDefinition } from './types';

export const ROLES = {
  USER_MANAGEMENT_ROLE: 'USER_MANAGEMENT_ROLE',
  CONTENT_MANAGEMENT_ROLE: 'CONTENT_MANAGEMENT_ROLE',
  ANALYTICS_VIEWER_ROLE: 'ANALYTICS_VIEWER_ROLE',
  ORDER_MANAGEMENT_ROLE: 'ORDER_MANAGEMENT_ROLE',
  SETTINGS_ADMIN_ROLE: 'SETTINGS_ADMIN_ROLE',
  BASIC_USER_ROLE: 'BASIC_USER_ROLE',
} as const;

/**
 * Role → Entitlements mapping.
 *
 * Add or modify entries here when new roles are introduced.
 * When migrating to a database, replace this array with a DB query that
 * returns the same `RoleDefinition[]` shape.
 */
export const ROLE_DEFINITIONS: readonly RoleDefinition[] = [
  {
    role: ROLES.USER_MANAGEMENT_ROLE,
    entitlements: [
      ENTITLEMENTS.CREATE_USER,
      ENTITLEMENTS.VIEW_USER,
      ENTITLEMENTS.EDIT_USER,
      ENTITLEMENTS.DELETE_USER,
    ],
  },
  {
    role: ROLES.CONTENT_MANAGEMENT_ROLE,
    entitlements: [
      ENTITLEMENTS.CREATE_CONTENT,
      ENTITLEMENTS.EDIT_CONTENT,
      ENTITLEMENTS.DELETE_CONTENT,
      ENTITLEMENTS.PUBLISH_CONTENT,
    ],
  },
  {
    role: ROLES.ANALYTICS_VIEWER_ROLE,
    entitlements: [ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD],
  },
  {
    role: ROLES.ORDER_MANAGEMENT_ROLE,
    entitlements: [ENTITLEMENTS.VIEW_ORDERS, ENTITLEMENTS.MANAGE_ORDERS],
  },
  {
    role: ROLES.SETTINGS_ADMIN_ROLE,
    entitlements: [ENTITLEMENTS.VIEW_SETTINGS, ENTITLEMENTS.MANAGE_SETTINGS],
  },
  {
    role: ROLES.BASIC_USER_ROLE,
    entitlements: [ENTITLEMENTS.VIEW_PROFILE, ENTITLEMENTS.EDIT_PROFILE],
  },
] as const;
