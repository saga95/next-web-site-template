import { resolveProfileFromCognitoGroups, COGNITO_GROUP_TO_PROFILE } from '@/rbac/cognitoMapping';
import { PROFILES } from '@/rbac';

describe('resolveProfileFromCognitoGroups', () => {
  it('maps Admin group to ADMIN profile', () => {
    expect(resolveProfileFromCognitoGroups(['Admin'])).toBe(PROFILES.ADMIN);
  });

  it('maps Shopper group to SHOPPER profile', () => {
    expect(resolveProfileFromCognitoGroups(['Shopper'])).toBe(PROFILES.SHOPPER);
  });

  it('returns the highest-priority profile when user has multiple groups', () => {
    // Admin is listed first in COGNITO_GROUP_TO_PROFILE, so it wins
    expect(resolveProfileFromCognitoGroups(['Shopper', 'Admin'])).toBe(PROFILES.ADMIN);
  });

  it('returns null for unmapped groups', () => {
    expect(resolveProfileFromCognitoGroups(['UnknownGroup'])).toBeNull();
  });

  it('returns null for empty groups', () => {
    expect(resolveProfileFromCognitoGroups([])).toBeNull();
  });

  it('exports a consistent mapping array', () => {
    expect(COGNITO_GROUP_TO_PROFILE.length).toBeGreaterThanOrEqual(2);
  });
});
