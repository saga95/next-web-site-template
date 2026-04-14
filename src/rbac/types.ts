// ─── RBAC Types ─────────────────────────────────────────────────────────────
// These types are intentionally loose (string-based) so the registry can be
// extended at runtime (e.g. loaded from a database) without type gymnastics.
// The concrete *constants* in entitlements.ts / roles.ts / profiles.ts give
// compile-time safety for the values shipped with the template.

import type { ENTITLEMENTS } from './entitlements';
import type { ROLES } from './roles';
import type { PROFILES } from './profiles';

/** Union of every built-in entitlement key. */
export type Entitlement = (typeof ENTITLEMENTS)[keyof typeof ENTITLEMENTS];

/** Union of every built-in role key. */
export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Union of every built-in profile key. */
export type Profile = (typeof PROFILES)[keyof typeof PROFILES];

/** A role definition: a role name mapped to its granted entitlements. */
export interface RoleDefinition {
  role: Role | string;
  entitlements: ReadonlyArray<Entitlement | string>;
}

/** A profile definition: a profile name mapped to its assigned roles. */
export interface ProfileDefinition {
  profile: Profile | string;
  roles: ReadonlyArray<Role | string>;
}

/** Resolved user RBAC context — the final flat set of entitlements. */
export interface ResolvedRBAC {
  profile: Profile | string | null;
  roles: ReadonlyArray<Role | string>;
  entitlements: ReadonlySet<Entitlement | string>;
}
