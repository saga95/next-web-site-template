// ─── Profiles ───────────────────────────────────────────────────────────────
// A profile is the top-level assignment for a user (or subscription tier).
// Each profile aggregates one or more roles.
//
// Examples:
//   USER_MANAGER  → manages users and can view analytics
//   ADMIN         → everything
//   SHOPPER       → basic self-service profile

import { ROLES } from './roles';
import type { ProfileDefinition } from './types';

export const PROFILES = {
  ADMIN: 'ADMIN',
  USER_MANAGER: 'USER_MANAGER',
  CONTENT_EDITOR: 'CONTENT_EDITOR',
  SHOPPER: 'SHOPPER',
} as const;

/**
 * Profile → Roles mapping.
 *
 * Add or modify entries here when new profiles are introduced.
 * When migrating to a database, replace this array with a DB query that
 * returns the same `ProfileDefinition[]` shape.
 */
export const PROFILE_DEFINITIONS: readonly ProfileDefinition[] = [
  {
    profile: PROFILES.ADMIN,
    roles: [
      ROLES.USER_MANAGEMENT_ROLE,
      ROLES.CONTENT_MANAGEMENT_ROLE,
      ROLES.ANALYTICS_VIEWER_ROLE,
      ROLES.ORDER_MANAGEMENT_ROLE,
      ROLES.SETTINGS_ADMIN_ROLE,
      ROLES.BASIC_USER_ROLE,
    ],
  },
  {
    profile: PROFILES.USER_MANAGER,
    roles: [
      ROLES.USER_MANAGEMENT_ROLE,
      ROLES.ANALYTICS_VIEWER_ROLE,
      ROLES.BASIC_USER_ROLE,
    ],
  },
  {
    profile: PROFILES.CONTENT_EDITOR,
    roles: [ROLES.CONTENT_MANAGEMENT_ROLE, ROLES.BASIC_USER_ROLE],
  },
  {
    profile: PROFILES.SHOPPER,
    roles: [ROLES.BASIC_USER_ROLE],
  },
] as const;
