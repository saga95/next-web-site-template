// ─── RBAC barrel export ─────────────────────────────────────────────────────
// Import from '@/rbac' in both frontend and backend code.

export { ENTITLEMENTS } from './entitlements';
export { ROLES, ROLE_DEFINITIONS } from './roles';
export { PROFILES, PROFILE_DEFINITIONS } from './profiles';
export {
  getEntitlementsForRole,
  getEntitlementsForRoles,
  getRolesForProfile,
  resolveProfile,
  resolveRoles,
  hasEntitlement,
  hasAllEntitlements,
  hasAnyEntitlement,
} from './registry';
export {
  requireEntitlement,
  type ResolveCallerRoles,
  type RequireEntitlementOptions,
} from './middleware';
export {
  COGNITO_GROUP_TO_PROFILE,
  resolveProfileFromCognitoGroups,
} from './cognitoMapping';
export type {
  Entitlement,
  Role,
  Profile,
  RoleDefinition,
  ProfileDefinition,
  ResolvedRBAC,
} from './types';
