// ─── Cognito Group → RBAC Profile mapping ──────────────────────────────────
// Maps AWS Cognito user-pool groups to RBAC profiles.
//
// Customize this when you add new Cognito groups or RBAC profiles.
// The first matching group wins (order matters — most privileged first).

import { PROFILES } from './profiles';
import type { Profile } from './types';

/**
 * Ordered mapping from Cognito group name to RBAC profile.
 * Put the most privileged group first so it takes precedence when a user
 * belongs to multiple Cognito groups.
 */
export const COGNITO_GROUP_TO_PROFILE: ReadonlyArray<{
  group: string;
  profile: Profile | string;
}> = [
  { group: 'Admin', profile: PROFILES.ADMIN },
  { group: 'Shopper', profile: PROFILES.SHOPPER },
];

/**
 * Resolve Cognito groups (from the JWT `cognito:groups` claim) to the
 * highest-priority RBAC profile.
 *
 * Returns `null` if no mapping is found.
 */
export function resolveProfileFromCognitoGroups(
  groups: readonly string[],
): Profile | string | null {
  for (const mapping of COGNITO_GROUP_TO_PROFILE) {
    if (groups.includes(mapping.group)) {
      return mapping.profile;
    }
  }
  return null;
}
