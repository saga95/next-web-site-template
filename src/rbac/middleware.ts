// ─── API Route Entitlement Guard ────────────────────────────────────────────
// Composable middleware for Next.js API routes.  Resolves the caller's RBAC
// profile/roles (from a header, JWT claim, or session) and rejects with 403
// if the required entitlements are missing.
//
// This is intentionally decoupled from how you *obtain* the caller's identity.
// Supply a `resolveCallerRoles` function to plug in your auth strategy.

import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveRoles, hasAllEntitlements, hasAnyEntitlement } from './registry';
import type { Entitlement, Role } from './types';

/**
 * Function that extracts the caller's roles from the request.
 * Implement this per your auth strategy (Cognito session, API key, etc.).
 */
export type ResolveCallerRoles = (
  req: NextApiRequest,
) => Promise<ReadonlyArray<Role | string>> | ReadonlyArray<Role | string>;

export interface RequireEntitlementOptions {
  /** Entitlements the caller must possess. */
  entitlements: ReadonlyArray<Entitlement | string>;
  /** `'every'` (default) — all required. `'some'` — at least one. */
  mode?: 'every' | 'some';
  /** Extracts the caller's roles from the request. */
  resolveCallerRoles: ResolveCallerRoles;
}

/**
 * Higher-order function that wraps a Next.js API handler with an entitlement
 * check.  Returns 403 if the caller lacks the required entitlements.
 *
 * @example
 * ```ts
 * import { apiHandler } from '@/lib/apiHandler';
 * import { requireEntitlement } from '@/rbac/middleware';
 * import { ENTITLEMENTS } from '@/rbac';
 * import { getCallerRoles } from '@/lib/auth'; // your auth helper
 *
 * const guard = requireEntitlement({
 *   entitlements: [ENTITLEMENTS.CREATE_USER],
 *   resolveCallerRoles: getCallerRoles,
 * });
 *
 * export default apiHandler({
 *   POST: guard(async (req, res) => {
 *     // Only reachable if the caller has CREATE_USER
 *     res.status(201).json({ data: await createUser(req.body) });
 *   }),
 * });
 * ```
 */
export function requireEntitlement(options: RequireEntitlementOptions) {
  const { entitlements, mode = 'every', resolveCallerRoles } = options;

  return (
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  ) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const roles = await resolveCallerRoles(req);
      const resolved = resolveRoles(roles);

      const allowed =
        mode === 'every'
          ? hasAllEntitlements(resolved, entitlements)
          : hasAnyEntitlement(resolved, entitlements);

      if (!allowed) {
        return res.status(403).json({
          error: { code: 'FORBIDDEN', message: 'Insufficient entitlements' },
        });
      }

      return handler(req, res);
    };
  };
}
