# API Gateway with Custom Domain

This template provisions an **AWS API Gateway HTTP API** backed by a Lambda
router (`amplify/api/`). With three environment variables you can expose it
under a professional subdomain such as `https://api.example.com/` instead of
the default `https://<api-id>.execute-api.<region>.amazonaws.com/`.

## Architecture

```
Browser ─▶ api.example.com ─▶ API Gateway (HTTP API) ─▶ Lambda (api-router)
                                       │
                                       └─▶ /health, /version, /{proxy+}
```

- HTTP API and Lambda live in their own CDK stack created via
  `backend.createStack('api-stack')` in [`amplify/backend.ts`](../amplify/backend.ts).
- Routes are added in [`amplify/api/handler.ts`](../amplify/api/handler.ts).
- Endpoint URLs are emitted to `amplify_outputs.json` under `custom.api`.

## Built-in routes

| Method | Path       | Description                     |
| ------ | ---------- | ------------------------------- |
| GET    | `/`        | Service banner                  |
| GET    | `/health`  | Liveness probe (status, uptime) |
| GET    | `/version` | App version + stage from env    |

Add new routes by extending the `routes` map in `amplify/api/handler.ts`.

## Local development

```bash
npx ampx sandbox
```

The sandbox prints the HTTP API endpoint, e.g.
`https://abc123.execute-api.us-east-1.amazonaws.com/`. No custom domain is
attached in sandbox mode unless you set the env vars below.

## Enabling `api.<your-domain>` in deployed environments

### Prerequisites

1. **Domain in Route 53** (recommended) — or any DNS provider.
2. **ACM certificate for `api.<your-domain>`** in the **same AWS region** as
   your Amplify backend. (HTTP APIs use regional endpoints.)
3. **Hosted-zone ID** for the apex domain (only if you want CDK to create the
   DNS record automatically).

### Issue the certificate

```bash
aws acm request-certificate \
  --domain-name api.example.com \
  --validation-method DNS \
  --region <your-region>
```

Validate via the DNS CNAME ACM provides, then copy the certificate ARN.

### Set environment variables

Set these in your Amplify branch settings (Console → App settings →
Environment variables) **before** deploying:

| Variable                      | Required | Example                                                        |
| ----------------------------- | -------- | -------------------------------------------------------------- |
| `API_DOMAIN_NAME`             | yes      | `api.example.com`                                              |
| `API_DOMAIN_CERTIFICATE_ARN`  | yes      | `arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-...` |
| `API_DOMAIN_HOSTED_ZONE_ID`   | optional | `Z1234567890ABC`                                               |
| `API_DOMAIN_HOSTED_ZONE_NAME` | optional | `example.com`                                                  |

If both `API_DOMAIN_HOSTED_ZONE_ID` and `API_DOMAIN_HOSTED_ZONE_NAME` are
present, the CDK stack creates the Route 53 alias record automatically.
Otherwise you must create the DNS record manually pointing `api.example.com`
to the **regional domain name** exported in `amplify_outputs.json`:

```jsonc
// amplify_outputs.json
{
  "custom": {
    "api": {
      "url": "https://abc123.execute-api.us-east-1.amazonaws.com",
      "customDomain": "https://api.example.com",
      "apiDomainTarget": "d-xyz.execute-api.us-east-1.amazonaws.com",
      "apiDomainHostedZoneId": "Z2OJLYMUO9EFXC",
    },
  },
}
```

Create an **A (ALIAS)** record in your DNS provider:

- Name: `api`
- Type: `A` (alias) — or `CNAME` if alias isn't supported
- Target: value of `apiDomainTarget`

### Deploy

```bash
git push origin main           # Amplify pipeline picks up env vars and synthesises CDK
```

Verify:

```bash
curl https://api.example.com/health
# { "status": "ok", "timestamp": "...", "uptime": ... }
```

## Consuming the API from the Next.js app

Set `NEXT_PUBLIC_API_URL` for the deployed environment:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

The shared client in [`src/api/client.ts`](../src/api/client.ts) will pick this
up. For client-side calls you can also read the URL out of
`amplify_outputs.json#custom.api.customDomain` if you prefer not to duplicate
the value.

## Cost

HTTP APIs are billed per request (cheaper than REST APIs) plus standard Lambda
invocation costs. Custom domains are free; you only pay for the ACM
certificate (free for AWS-issued public certs) and Route 53 hosted zone.

## Troubleshooting

| Symptom                                | Likely cause                                                              |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `403 Forbidden` from `api.example.com` | DNS still propagating, or ALIAS points to wrong target                    |
| `502 Bad Gateway`                      | Lambda threw — check CloudWatch Logs for `api-router`                     |
| `Certificate not found` on deploy      | ACM cert is in a different region than the API; reissue in the API region |
| Custom domain skipped in deploy logs   | One of the required env vars is missing; check Amplify branch env vars    |
