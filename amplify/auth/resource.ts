import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

/**
 * Authentication configuration using Amazon Cognito.
 * Pattern from politica, friday.lk, tmsaaokenki-dev/website, and uwu-sri-lanka/website.
 *
 * Features:
 * - Email + phone login
 * - User groups for RBAC (Admin, Shopper)
 * - Post-confirmation Lambda to assign default group
 * - Optional MFA (TOTP)
 * - Custom user attributes (given name, family name, phone)
 *
 * Customize login methods and user attributes as needed.
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Your verification code',
    },
    phone: true,
  },
  userAttributes: {
    givenName: { required: false, mutable: true },
    familyName: { required: false, mutable: true },
    phoneNumber: { required: false, mutable: true },
  },
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
  },
  groups: ['Admin', 'Shopper'],
  triggers: {
    postConfirmation,
  },
});
