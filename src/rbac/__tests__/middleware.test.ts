import type { NextApiRequest, NextApiResponse } from 'next';
import { requireEntitlement } from '@/rbac/middleware';
import { ENTITLEMENTS, ROLES } from '@/rbac';

function mockReqRes(roles: string[]) {
  const req = {} as NextApiRequest;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;
  const resolveCallerRoles = () => roles;
  return { req, res, resolveCallerRoles };
}

describe('requireEntitlement', () => {
  it('calls handler when entitlement is present', async () => {
    const { req, res, resolveCallerRoles } = mockReqRes([ROLES.USER_MANAGEMENT_ROLE]);
    const handler = jest.fn();

    const guard = requireEntitlement({
      entitlements: [ENTITLEMENTS.CREATE_USER],
      resolveCallerRoles,
    });

    await guard(handler)(req, res);
    expect(handler).toHaveBeenCalledWith(req, res);
  });

  it('returns 403 when entitlement is missing', async () => {
    const { req, res, resolveCallerRoles } = mockReqRes([ROLES.BASIC_USER_ROLE]);
    const handler = jest.fn();

    const guard = requireEntitlement({
      entitlements: [ENTITLEMENTS.CREATE_USER],
      resolveCallerRoles,
    });

    await guard(handler)(req, res);
    expect(handler).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'FORBIDDEN' }),
      }),
    );
  });

  it('supports mode="some" — passes when at least one entitlement matches', async () => {
    const { req, res, resolveCallerRoles } = mockReqRes([ROLES.USER_MANAGEMENT_ROLE]);
    const handler = jest.fn();

    const guard = requireEntitlement({
      entitlements: [ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS],
      mode: 'some',
      resolveCallerRoles,
    });

    await guard(handler)(req, res);
    expect(handler).toHaveBeenCalled();
  });

  it('supports mode="every" (default) — rejects when one is missing', async () => {
    const { req, res, resolveCallerRoles } = mockReqRes([ROLES.USER_MANAGEMENT_ROLE]);
    const handler = jest.fn();

    const guard = requireEntitlement({
      entitlements: [ENTITLEMENTS.CREATE_USER, ENTITLEMENTS.MANAGE_ORDERS],
      resolveCallerRoles,
    });

    await guard(handler)(req, res);
    expect(handler).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('supports async resolveCallerRoles', async () => {
    const req = {} as NextApiRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;
    const handler = jest.fn();

    const guard = requireEntitlement({
      entitlements: [ENTITLEMENTS.CREATE_USER],
      resolveCallerRoles: async () => [ROLES.USER_MANAGEMENT_ROLE],
    });

    await guard(handler)(req, res);
    expect(handler).toHaveBeenCalled();
  });
});
