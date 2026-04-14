// ─── RBAC Registry ──────────────────────────────────────────────────────────
// The registry resolves a profile (or a set of roles) into a flat set of
// entitlements.  It is pure and stateless — no React dependency — so it works
// on both client and server (API routes, Lambda, middleware).

import { ENTITLEMENTS } from './entitlements';
import { ROLE_DEFINITIONS } from './roles';
import { PROFILE_DEFINITIONS } from './profiles';
import type {
  Entitlement,
  Role,
  Profile,
  ResolvedRBAC,
} from './types';

// ─── Configuration validation (runs once at import time) ───────────────────

function validateConfig(): void {
  const knownEntitlements = new Set(Object.values(ENTITLEMENTS));
  const knownRoles = new Set(ROLE_DEFINITIONS.map((rd) => rd.role));

  for (const rd of ROLE_DEFINITIONS) {
    for (const e of rd.entitlements) {
      if (!knownEntitlements.has(e as Entitlement)) {
        throw new Error(
          `[RBAC] Role "${rd.role}" references unknown entitlement "${e}". ` +
            'Add it to ENTITLEMENTS or fix the typo.',
        );
      }
    }
  }

  for (const pd of PROFILE_DEFINITIONS) {
    for (const r of pd.roles) {
      if (!knownRoles.has(r)) {
        throw new Error(
          `[RBAC] Profile "${pd.profile}" references unknown role "${r}". ` +
            'Add it to ROLE_DEFINITIONS or fix the typo.',
        );
      }
    }
  }
}

validateConfig();

// ─── Internal look-up maps (built once at import time) ─────────────────────

const roleToEntitlements = new Map<string, ReadonlySet<string>>(
  ROLE_DEFINITIONS.map((rd) => [rd.role, new Set(rd.entitlements)]),
);

const profileToRoles = new Map<string, readonly string[]>(
  PROFILE_DEFINITIONS.map((pd) => [pd.profile, [...pd.roles]]),
);

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Resolve a single role to its set of entitlements.
 */
export function getEntitlementsForRole(
  role: Role | string,
): ReadonlySet<string> {
  const stored = roleToEntitlements.get(role);
  return stored ? new Set(stored) : new Set();
}

/**
 * Resolve multiple roles to the union of their entitlements.
 */
export function getEntitlementsForRoles(
  roles: ReadonlyArray<Role | string>,
): ReadonlySet<string> {
  const merged = new Set<string>();
  for (const role of roles) {
    const entitlements = roleToEntitlements.get(role);
    if (entitlements) {
      for (const e of entitlements) merged.add(e);
    }
  }
  return merged;
}

/**
 * Resolve a profile to its roles.
 */
export function getRolesForProfile(
  profile: Profile | string,
): readonly string[] {
  const stored = profileToRoles.get(profile);
  return stored ? [...stored] : [];
}

/**
 * Fully resolve a profile → roles → entitlements.
 */
export function resolveProfile(
  profile: Profile | string,
): ResolvedRBAC {
  const roles = getRolesForProfile(profile);
  const entitlements = getEntitlementsForRoles(roles);
  return { profile, roles, entitlements };
}

/**
 * Resolve from an explicit list of roles (useful when the caller already
 * knows the roles — e.g. from a JWT claim or subscription payload).
 */
export function resolveRoles(
  roles: ReadonlyArray<Role | string>,
): ResolvedRBAC {
  const entitlements = getEntitlementsForRoles(roles);
  return { profile: null, roles, entitlements };
}

/**
 * Check whether a resolved RBAC context has a specific entitlement.
 */
export function hasEntitlement(
  resolved: ResolvedRBAC,
  entitlement: Entitlement | string,
): boolean {
  return resolved.entitlements.has(entitlement);
}

/**
 * Check whether a resolved RBAC context has **all** of the listed entitlements.
 */
export function hasAllEntitlements(
  resolved: ResolvedRBAC,
  entitlements: ReadonlyArray<Entitlement | string>,
): boolean {
  return entitlements.every((e) => resolved.entitlements.has(e));
}

/**
 * Check whether a resolved RBAC context has **any** of the listed entitlements.
 */
export function hasAnyEntitlement(
  resolved: ResolvedRBAC,
  entitlements: ReadonlyArray<Entitlement | string>,
): boolean {
  return entitlements.some((e) => resolved.entitlements.has(e));
}
