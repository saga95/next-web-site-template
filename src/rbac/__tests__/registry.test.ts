import {
  ENTITLEMENTS,
  PROFILES,
  PROFILE_DEFINITIONS,
  ROLES,
  ROLE_DEFINITIONS,
  getEntitlementsForRole,
  getEntitlementsForRoles,
  getRolesForProfile,
  hasAllEntitlements,
  hasAnyEntitlement,
  hasEntitlement,
  resolveProfile,
  resolveRoles,
} from '@/rbac';

// ─── Entitlements ───────────────────────────────────────────────────────────

describe('ENTITLEMENTS', () => {
  it('contains the expected entitlement keys', () => {
    expect(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD).toBe(
      'VIEW_ANALYTICS_DASHBOARD'
    );
    expect(ENTITLEMENTS.CREATE_USER).toBe('CREATE_USER');
    expect(ENTITLEMENTS.DELETE_PROFILE).toBe('DELETE_PROFILE');
  });
});

// ─── Roles ──────────────────────────────────────────────────────────────────

describe('ROLE_DEFINITIONS', () => {
  it('maps USER_MANAGEMENT_ROLE to user entitlements', () => {
    const def = ROLE_DEFINITIONS.find(
      r => r.role === ROLES.USER_MANAGEMENT_ROLE
    );
    expect(def).toBeDefined();
    expect(def!.entitlements).toContain(ENTITLEMENTS.CREATE_USER);
    expect(def!.entitlements).toContain(ENTITLEMENTS.DELETE_USER);
  });
});

// ─── Profiles ───────────────────────────────────────────────────────────────

describe('PROFILE_DEFINITIONS', () => {
  it('maps USER_MANAGER to expected roles', () => {
    const def = PROFILE_DEFINITIONS.find(
      p => p.profile === PROFILES.USER_MANAGER
    );
    expect(def).toBeDefined();
    expect(def!.roles).toContain(ROLES.USER_MANAGEMENT_ROLE);
    expect(def!.roles).toContain(ROLES.ANALYTICS_VIEWER_ROLE);
  });
});

// ─── Registry ───────────────────────────────────────────────────────────────

describe('getEntitlementsForRole', () => {
  it('returns entitlements for a known role', () => {
    const entitlements = getEntitlementsForRole(ROLES.USER_MANAGEMENT_ROLE);
    expect(entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(true);
    expect(entitlements.has(ENTITLEMENTS.VIEW_USER)).toBe(true);
  });

  it('returns empty set for unknown role', () => {
    const entitlements = getEntitlementsForRole('NONEXISTENT_ROLE');
    expect(entitlements.size).toBe(0);
  });
});

describe('getEntitlementsForRoles', () => {
  it('merges entitlements from multiple roles', () => {
    const entitlements = getEntitlementsForRoles([
      ROLES.USER_MANAGEMENT_ROLE,
      ROLES.ANALYTICS_VIEWER_ROLE,
    ]);
    expect(entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(true);
    expect(entitlements.has(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD)).toBe(true);
  });
});

describe('getRolesForProfile', () => {
  it('returns roles for ADMIN profile', () => {
    const roles = getRolesForProfile(PROFILES.ADMIN);
    expect(roles).toContain(ROLES.USER_MANAGEMENT_ROLE);
    expect(roles).toContain(ROLES.SETTINGS_ADMIN_ROLE);
  });

  it('returns empty array for unknown profile', () => {
    const roles = getRolesForProfile('NONEXISTENT_PROFILE');
    expect(roles).toHaveLength(0);
  });
});

describe('resolveProfile', () => {
  it('resolves ADMIN to all entitlements', () => {
    const resolved = resolveProfile(PROFILES.ADMIN);
    expect(resolved.profile).toBe('ADMIN');
    expect(resolved.roles.length).toBeGreaterThan(0);
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(true);
    expect(resolved.entitlements.has(ENTITLEMENTS.MANAGE_SETTINGS)).toBe(true);
    expect(
      resolved.entitlements.has(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD)
    ).toBe(true);
  });

  it('resolves SHOPPER to basic entitlements only', () => {
    const resolved = resolveProfile(PROFILES.SHOPPER);
    expect(resolved.entitlements.has(ENTITLEMENTS.VIEW_PROFILE)).toBe(true);
    expect(resolved.entitlements.has(ENTITLEMENTS.EDIT_PROFILE)).toBe(true);
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(false);
    expect(resolved.entitlements.has(ENTITLEMENTS.MANAGE_SETTINGS)).toBe(false);
  });

  it('resolves USER_MANAGER correctly', () => {
    const resolved = resolveProfile(PROFILES.USER_MANAGER);
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(true);
    expect(
      resolved.entitlements.has(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD)
    ).toBe(true);
    expect(resolved.entitlements.has(ENTITLEMENTS.VIEW_PROFILE)).toBe(true);
    // Should NOT have content or order entitlements
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_CONTENT)).toBe(false);
    expect(resolved.entitlements.has(ENTITLEMENTS.MANAGE_ORDERS)).toBe(false);
  });
});

describe('resolveRoles', () => {
  it('resolves explicit roles to entitlements', () => {
    const resolved = resolveRoles([ROLES.CONTENT_MANAGEMENT_ROLE]);
    expect(resolved.profile).toBeNull();
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_CONTENT)).toBe(true);
    expect(resolved.entitlements.has(ENTITLEMENTS.CREATE_USER)).toBe(false);
  });
});

describe('hasEntitlement', () => {
  it('returns true for a granted entitlement', () => {
    const resolved = resolveProfile(PROFILES.ADMIN);
    expect(hasEntitlement(resolved, ENTITLEMENTS.CREATE_USER)).toBe(true);
  });

  it('returns false for a missing entitlement', () => {
    const resolved = resolveProfile(PROFILES.SHOPPER);
    expect(hasEntitlement(resolved, ENTITLEMENTS.CREATE_USER)).toBe(false);
  });
});

describe('hasAllEntitlements', () => {
  it('returns true when all entitlements are present', () => {
    const resolved = resolveProfile(PROFILES.ADMIN);
    expect(
      hasAllEntitlements(resolved, [
        ENTITLEMENTS.CREATE_USER,
        ENTITLEMENTS.DELETE_USER,
      ])
    ).toBe(true);
  });

  it('returns false when one entitlement is missing', () => {
    const resolved = resolveProfile(PROFILES.SHOPPER);
    expect(
      hasAllEntitlements(resolved, [
        ENTITLEMENTS.VIEW_PROFILE,
        ENTITLEMENTS.CREATE_USER,
      ])
    ).toBe(false);
  });
});

describe('hasAnyEntitlement', () => {
  it('returns true when at least one entitlement is present', () => {
    const resolved = resolveProfile(PROFILES.SHOPPER);
    expect(
      hasAnyEntitlement(resolved, [
        ENTITLEMENTS.VIEW_PROFILE,
        ENTITLEMENTS.CREATE_USER,
      ])
    ).toBe(true);
  });

  it('returns false when none are present', () => {
    const resolved = resolveProfile(PROFILES.SHOPPER);
    expect(
      hasAnyEntitlement(resolved, [
        ENTITLEMENTS.CREATE_USER,
        ENTITLEMENTS.MANAGE_ORDERS,
      ])
    ).toBe(false);
  });
});
