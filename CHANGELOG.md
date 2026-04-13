# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Health check endpoint** (`/api/health`) — returns status, uptime, version for load balancers and monitoring
- **Web Vitals monitoring** — automatic Core Web Vitals reporting (LCP, INP, CLS) via `reportWebVitals`
- **Feature flags utility** (`src/lib/featureFlags.ts`) — environment-variable-based feature flags for staged rollouts
- **API handler middleware** (`src/lib/apiHandler.ts`) — method validation, structured errors, no internal exposure
- **Skip-to-content link** — keyboard-accessible link for screen reader users (WCAG 2.1 AA)
- **Commitlint** — enforces conventional commit messages via Husky commit-msg hook
- **Dependabot** — automated weekly dependency updates for npm and GitHub Actions
- **E2E tests in CI** — Playwright runs in the CI pipeline with artifact upload on failure
- **Preconnect hints** — `<link rel="preconnect">` for Google Fonts in `_document.tsx`
- **Theme color meta** — light/dark theme-color meta tags for mobile browser chrome

### Changed

- **CI/CD pipeline** — migrated from npm to pnpm, split lint/typecheck into parallel jobs, upgraded actions to v4
- **Security audit** — changed from `continue-on-error: true` to required gate (`--audit-level=high`)
- **X-XSS-Protection header** — set to `0` (rely on CSP instead, per OWASP recommendation)
- **API routes** — `api/hello` now validates HTTP method (rejects non-GET with 405)

### Security

- **`generateId()`** — replaced `Math.random()` with `crypto.getRandomValues()` for cryptographic safety
- **`stripHtml()`** — removed `innerHTML` usage (XSS vector), replaced with regex-only approach
- **Deploy verification** — CI deploy steps include health check verification

## [1.0.0] - 2026-04-13

### Added

- Initial template with Next.js 14, TypeScript 5, Material UI v6
- AWS Amplify Gen 2 backend (Cognito RBAC, AppSync, DynamoDB, S3)
- Authentication pages (login, register, confirm, forgot-password)
- AdminLayout with sidebar + role-based route protection
- AccountLayout with tabbed navigation
- i18n (7 languages), WCAG 2.2 AA accessibility
- CI/CD pipeline, Husky + lint-staged, ESLint + Prettier
- Jest 30 + Playwright E2E testing setup
- Deployment support for Vercel, Netlify, AWS Amplify
