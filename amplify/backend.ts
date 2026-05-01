import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import {
  CorsHttpMethod,
  DomainName,
  EndpointType,
  HttpApi,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';
import { HttpMethods } from 'aws-cdk-lib/aws-s3';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { postConfirmation } from './auth/post-confirmation/resource';
import { apiRouter } from './api/resource';

/**
 * Main backend definition.
 * Pattern from politica, friday.lk, tmsaaokenki-dev/website, and uwu-sri-lanka/website.
 *
 * CDK overrides:
 * - Cognito password policy (min 8 chars, mixed case, numbers, symbols)
 * - Admin group IAM permissions for user management
 * - Post-confirmation Lambda permission to call AdminAddUserToGroup
 * - S3 CORS configuration for uploads
 * - HTTP API Gateway with optional custom domain (api.<your-domain>)
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  postConfirmation,
  apiRouter,
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

// ─── HTTP API Gateway ───────────────────────────────────────────────────────────
//
// Provisions an HTTP API in its own CDK stack and (optionally) attaches the
// custom domain `api.<your-domain>`. The custom domain is enabled only when
// the following env vars are present at synth time:
//
//   API_DOMAIN_NAME              e.g. "api.example.com"           (required)
//   API_DOMAIN_CERTIFICATE_ARN   ACM cert ARN in the same region  (required)
//   API_DOMAIN_HOSTED_ZONE_ID    Route 53 zone id for the apex    (optional)
//   API_DOMAIN_HOSTED_ZONE_NAME  e.g. "example.com"               (optional)
//
// If hosted-zone vars are omitted, the DNS record is NOT created automatically;
// you'll need to create the ALIAS / CNAME manually (the regional domain name
// is exported as the `apiDomainTarget` output).
//
// See `docs/API_GATEWAY.md` for the full setup walkthrough.

const apiStack = backend.createStack('api-stack');

const httpApi = new HttpApi(apiStack, 'HttpApi', {
  apiName: `${apiStack.stackName}-http-api`,
  description: 'REST endpoints for the application (api.<your-domain>).',
  corsPreflight: {
    allowOrigins: ['*'], // TODO: Restrict to your domain in production
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PUT,
      CorsHttpMethod.PATCH,
      CorsHttpMethod.DELETE,
      CorsHttpMethod.OPTIONS,
    ],
    allowHeaders: ['authorization', 'content-type', 'x-amz-date', 'x-api-key'],
    maxAge: undefined,
  },
});

const apiIntegration = new HttpLambdaIntegration(
  'ApiRouterIntegration',
  backend.apiRouter.resources.lambda
);

httpApi.addRoutes({
  path: '/{proxy+}',
  integration: apiIntegration,
});
httpApi.addRoutes({
  path: '/',
  integration: apiIntegration,
});

const apiDomainName = process.env['API_DOMAIN_NAME'];
const apiCertArn = process.env['API_DOMAIN_CERTIFICATE_ARN'];
const apiHostedZoneId = process.env['API_DOMAIN_HOSTED_ZONE_ID'];
const apiHostedZoneName = process.env['API_DOMAIN_HOSTED_ZONE_NAME'];

let apiCustomDomain: DomainName | undefined;

if (apiDomainName && apiCertArn) {
  const certificate = Certificate.fromCertificateArn(
    apiStack,
    'ApiDomainCertificate',
    apiCertArn
  );

  apiCustomDomain = new DomainName(apiStack, 'ApiCustomDomain', {
    domainName: apiDomainName,
    certificate,
    endpointType: EndpointType.REGIONAL,
    securityPolicy: SecurityPolicy.TLS_1_2,
  });

  httpApi.addStage('default-stage', {
    autoDeploy: true,
    domainMapping: { domainName: apiCustomDomain },
  });

  if (apiHostedZoneId && apiHostedZoneName) {
    const zone = HostedZone.fromHostedZoneAttributes(
      apiStack,
      'ApiHostedZone',
      {
        hostedZoneId: apiHostedZoneId,
        zoneName: apiHostedZoneName,
      }
    );

    new ARecord(apiStack, 'ApiAliasRecord', {
      zone,
      recordName: apiDomainName,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          apiCustomDomain.regionalDomainName,
          apiCustomDomain.regionalHostedZoneId
        )
      ),
    });
  }
}

// ─── Outputs ────────────────────────────────────────────────────────────────────
// Exposed via amplify_outputs.json → consumed by the Next.js app at runtime.

backend.addOutput({
  custom: {
    api: {
      url: httpApi.apiEndpoint,
      region: Stack.of(apiStack).region,
      ...(apiDomainName ? { customDomain: `https://${apiDomainName}` } : {}),
      ...(apiCustomDomain
        ? {
            apiDomainTarget: apiCustomDomain.regionalDomainName,
            apiDomainHostedZoneId: apiCustomDomain.regionalHostedZoneId,
          }
        : {}),
    },
  },
});
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
