import React from 'react';
import { render, screen } from '@testing-library/react';
import { RBACProvider } from '@/contexts/RBACContext';
import { EntitlementGuard } from '@/components/EntitlementGuard';
import { ENTITLEMENTS, PROFILES } from '@/rbac';

function renderWithRBAC(ui: React.ReactElement, profile: string) {
  return render(<RBACProvider profile={profile}>{ui}</RBACProvider>);
}

describe('EntitlementGuard', () => {
  it('renders children when entitlement is granted', () => {
    renderWithRBAC(
      <EntitlementGuard entitlement={ENTITLEMENTS.CREATE_USER}>
        <span data-testid='protected'>Secret</span>
      </EntitlementGuard>,
      PROFILES.ADMIN
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('renders nothing when entitlement is missing', () => {
    renderWithRBAC(
      <EntitlementGuard entitlement={ENTITLEMENTS.CREATE_USER}>
        <span data-testid='protected'>Secret</span>
      </EntitlementGuard>,
      PROFILES.SHOPPER
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('renders fallback when entitlement is missing', () => {
    renderWithRBAC(
      <EntitlementGuard
        entitlement={ENTITLEMENTS.CREATE_USER}
        fallback={<span data-testid='denied'>No access</span>}
      >
        <span data-testid='protected'>Secret</span>
      </EntitlementGuard>,
      PROFILES.SHOPPER
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    expect(screen.getByTestId('denied')).toBeInTheDocument();
  });

  it('supports mode="some" with multiple entitlements', () => {
    renderWithRBAC(
      <EntitlementGuard
        entitlement={[ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS]}
        mode='some'
      >
        <span data-testid='protected'>Visible</span>
      </EntitlementGuard>,
      PROFILES.USER_MANAGER
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('blocks when mode="every" and not all entitlements are present', () => {
    renderWithRBAC(
      <EntitlementGuard
        entitlement={[ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS]}
        mode='every'
      >
        <span data-testid='protected'>Hidden</span>
      </EntitlementGuard>,
      PROFILES.USER_MANAGER
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });
});
