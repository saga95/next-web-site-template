# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this template or any project built with it:

1. **Do NOT open a public issue.**
2. Email the maintainer at [saga95] with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. You will receive a response within 48 hours.

## Security Practices in This Template

This template follows security best practices:

- **Content Security Policy (CSP)** headers configured in `netlify.toml` and `next.config.mjs`
- **Strict TypeScript** — no `any` types, strict null checks, preventing type-related vulnerabilities
- **Input validation** — Zod schemas for runtime type validation at system boundaries
- **Environment variable isolation** — `src/lib/env.ts` prevents direct `process.env` access
- **Dependency management** — Husky pre-commit hooks, ESLint security rules
- **OWASP Top 10** awareness in code review guidelines
- **AWS Amplify Auth** — Cognito-based authentication with MFA support
- **HTTPS/HSTS** — Enforced via deployment platform headers

## Dependency Updates

- Run `pnpm audit` regularly to check for known vulnerabilities
- Use `pnpm update` to keep dependencies current
- Review Dependabot alerts if enabled on your fork
