import { createContext, useContext, useMemo } from 'react';
import type { Profile, ResolvedRBAC, Role } from '@/rbac/types';
import { resolveProfile, resolveRoles } from '@/rbac/registry';

// ─── Context ────────────────────────────────────────────────────────────────

const RBACContext = createContext<ResolvedRBAC | undefined>(undefined);

// ─── Provider (profile-based) ───────────────────────────────────────────────

interface RBACProviderProps {
  /** Assign a named profile — roles and entitlements are resolved automatically. */
  profile?: Profile | string | undefined;
  /** Alternatively, supply roles directly (e.g. from a JWT or subscription). */
  roles?: ReadonlyArray<Role | string> | undefined;
  children: React.ReactNode;
}

/**
 * Provides resolved RBAC entitlements to the React tree.
 *
 * Usage (profile-based):
 * ```tsx
 * <RBACProvider profile="USER_MANAGER">
 *   <App />
 * </RBACProvider>
 * ```
 *
 * Usage (role-based):
 * ```tsx
 * <RBACProvider roles={['USER_MANAGEMENT_ROLE', 'ANALYTICS_VIEWER_ROLE']}>
 *   <App />
 * </RBACProvider>
 * ```
 */
export function RBACProvider({ profile, roles, children }: RBACProviderProps) {
  const resolved = useMemo<ResolvedRBAC>(() => {
    if (profile) return resolveProfile(profile);
    if (roles && roles.length > 0) return resolveRoles(roles);
    return { profile: null, roles: [], entitlements: new Set() };
  }, [profile, roles]);

  return (
    <RBACContext.Provider value={resolved}>{children}</RBACContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Access the resolved RBAC context.
 *
 * @throws If used outside of `<RBACProvider>`.
 */
export function useRBAC(): ResolvedRBAC {
  const ctx = useContext(RBACContext);
  if (ctx === undefined) {
    throw new Error('useRBAC must be used within an <RBACProvider>');
  }
  return ctx;
}
