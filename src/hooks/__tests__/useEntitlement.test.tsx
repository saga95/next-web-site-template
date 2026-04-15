import React from 'react';
import { renderHook } from '@testing-library/react';
import { RBACProvider } from '@/contexts/RBACContext';
import { useEntitlement } from '@/hooks/useEntitlement';
import { ENTITLEMENTS, PROFILES, ROLES } from '@/rbac';

function wrapper(props: { profile?: string; roles?: string[] }) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <RBACProvider {...props}>{children}</RBACProvider>;
  };
}

describe('useEntitlement', () => {
  it('returns true for a single granted entitlement', () => {
    const { result } = renderHook(
      () => useEntitlement(ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD),
      { wrapper: wrapper({ profile: PROFILES.USER_MANAGER }) }
    );
    expect(result.current).toBe(true);
  });

  it('returns false for a single missing entitlement', () => {
    const { result } = renderHook(
      () => useEntitlement(ENTITLEMENTS.MANAGE_ORDERS),
      { wrapper: wrapper({ profile: PROFILES.SHOPPER }) }
    );
    expect(result.current).toBe(false);
  });

  it('checks all entitlements by default (mode=every)', () => {
    const { result } = renderHook(
      () =>
        useEntitlement([
          ENTITLEMENTS.CREATE_USER,
          ENTITLEMENTS.VIEW_ANALYTICS_DASHBOARD,
        ]),
      { wrapper: wrapper({ profile: PROFILES.USER_MANAGER }) }
    );
    expect(result.current).toBe(true);
  });

  it('returns false when not all entitlements are present (mode=every)', () => {
    const { result } = renderHook(
      () =>
        useEntitlement([ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS]),
      { wrapper: wrapper({ profile: PROFILES.USER_MANAGER }) }
    );
    expect(result.current).toBe(false);
  });

  it('returns true when at least one entitlement is present (mode=some)', () => {
    const { result } = renderHook(
      () =>
        useEntitlement(
          [ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS],
          'some'
        ),
      { wrapper: wrapper({ profile: PROFILES.USER_MANAGER }) }
    );
    expect(result.current).toBe(true);
  });

  it('works with explicit roles instead of profile', () => {
    const { result } = renderHook(
      () => useEntitlement(ENTITLEMENTS.CREATE_CONTENT),
      {
        wrapper: wrapper({
          roles: [ROLES.CONTENT_MANAGEMENT_ROLE],
        }),
      }
    );
    expect(result.current).toBe(true);
  });

  it('returns true for empty entitlement array', () => {
    const { result } = renderHook(() => useEntitlement([]), {
      wrapper: wrapper({ profile: PROFILES.SHOPPER }),
    });
    expect(result.current).toBe(true);
  });

  it('throws when used outside RBACProvider', () => {
    // Suppress console.error for the expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useEntitlement(ENTITLEMENTS.CREATE_USER));
    }).toThrow('useRBAC must be used within an <RBACProvider>');
    spy.mockRestore();
  });
});
