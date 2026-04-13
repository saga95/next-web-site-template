import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { postConfirmation } from './auth/post-confirmation/resource';

/**
 * Main backend definition.
 * Pattern from politica, friday.lk, tmsaaokenki-dev/website, and uwu-sri-lanka/website.
 *
 * CDK overrides:
 * - Cognito password policy (min 8 chars, mixed case, numbers, symbols)
 * - Admin group IAM permissions for user management
 * - Post-confirmation Lambda permission to call AdminAddUserToGroup
 * - S3 CORS configuration for uploads
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  postConfirmation,
});

// ─── Cognito password policy ────────────────────────────────────────────────────

const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 7,
  },
};

// ─── Post-confirmation Lambda: permission to add users to groups ────────────────

backend.postConfirmation.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['cognito-idp:AdminAddUserToGroup'],
    resources: [backend.auth.resources.userPool.userPoolArn],
  })
);

// ─── Admin group: IAM permissions for user management ───────────────────────────

const adminGroupRole = backend.auth.resources.groups['Admin'];
if (adminGroupRole) {
  adminGroupRole.role.addToPrincipalPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'cognito-idp:AdminListGroupsForUser',
        'cognito-idp:AdminGetUser',
        'cognito-idp:ListUsers',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminDeleteUser',
        'cognito-idp:AdminAddUserToGroup',
        'cognito-idp:AdminRemoveUserFromGroup',
      ],
      resources: [backend.auth.resources.userPool.userPoolArn],
    })
  );
}

// ─── S3 CORS for file uploads ───────────────────────────────────────────────────

const s3Bucket = backend.storage.resources.bucket;
s3Bucket.addCorsRule({
  allowedHeaders: ['*'],
  allowedMethods: [
    HttpMethods.GET,
    HttpMethods.PUT,
    HttpMethods.POST,
    HttpMethods.DELETE,
  ],
  allowedOrigins: ['*'], // TODO: Restrict to your domain in production
  exposedHeaders: ['ETag', 'x-amz-meta-custom-header'],
  maxAge: 3600,
});
