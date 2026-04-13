# ISO 25010 Compliance Matrix

This document maps the template's features to the [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) product quality model, demonstrating how each quality characteristic is addressed.

---

## 1. Functional Suitability

| Sub-characteristic             | Implementation                                                                                                     | Evidence                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| **Functional completeness**    | Feature module pattern (`src/features/`) provides full CRUD lifecycle with types → repository → hooks → components | `src/features/todos/` reference implementation |
| **Functional correctness**     | TypeScript strict mode (20+ compiler flags), Zod runtime validation, 70% test coverage threshold                   | `tsconfig.json`, `jest.config.js`              |
| **Functional appropriateness** | Pages Router for SSR/SSG, React Query for server state, React Hook Form for client forms                           | `src/pages/`, feature hooks                    |

## 2. Performance Efficiency

| Sub-characteristic       | Implementation                                                                                                  | Evidence                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Time behaviour**       | React Query caching (30s stale time, automatic retries), Next.js SSR/SSG/ISR, code splitting                    | `src/pages/_app.tsx`, `next.config.mjs` |
| **Resource utilization** | Image optimization (Next.js Image), CSS Modules (no runtime CSS-in-JS overhead for static styles), tree-shaking | `next.config.mjs`                       |
| **Capacity**             | Paginated API types (`PaginatedResponse<T>`), lazy loading, Amplify auto-scaling backend                        | `src/types/index.ts`                    |

## 3. Compatibility

| Sub-characteristic   | Implementation                                                                                          | Evidence                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Co-existence**     | Multi-platform deployment (Vercel, Netlify, AWS Amplify) from same codebase, environment auto-detection | `src/lib/env.ts`, `vercel.json`, `netlify.toml`, `amplify.yml` |
| **Interoperability** | REST API routes, GraphQL via AppSync, EmailJS integration, standard JSON-LD structured data             | `src/pages/api/`, `amplify/data/resource.ts`, `src/lib/seo.ts` |

## 4. Usability

| Sub-characteristic                  | Implementation                                                                                                                                           | Evidence                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Appropriateness recognizability** | SEO metadata (`generatePageMeta()`), JSON-LD structured data, Open Graph, Twitter Cards                                                                  | `src/lib/seo.ts`                                |
| **Learnability**                    | 7-language i18n support, RTL layout support, locale-aware formatting                                                                                     | `src/lib/i18n.ts`, `public/locales/`            |
| **Operability**                     | WCAG 2.2 AA compliance, keyboard navigation, screen reader support, 44px touch targets                                                                   | `eslint.config.mjs` (30+ jsx-a11y rules)        |
| **User error protection**           | Form validation (React Hook Form + Zod), ErrorBoundary component, structured error states                                                                | `src/components/ErrorBoundary.tsx`, Zod schemas |
| **Accessibility**                   | ESLint jsx-a11y plugin with strict rules, semantic HTML enforcement, ARIA attribute validation, focus management, color contrast, reduced motion support | `eslint.config.mjs`                             |

## 5. Reliability

| Sub-characteristic  | Implementation                                                                                                      | Evidence                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Maturity**        | 70% test coverage threshold, CI/CD pipeline (lint → test → build), pre-commit hooks                                 | `jest.config.js`, `.github/workflows/ci-cd.yml`          |
| **Availability**    | Multi-region deployment support (Vercel/Netlify edge, Amplify), static generation for critical pages                | Deployment configs                                       |
| **Fault tolerance** | ErrorBoundary component, React Query retry policies (3 retries with exponential backoff), graceful Amplify fallback | `src/components/ErrorBoundary.tsx`, `src/pages/_app.tsx` |
| **Recoverability**  | ErrorBoundary "Try again" recovery, React Query automatic refetch on reconnect/focus                                | `_app.tsx` QueryClient config                            |

## 6. Security

| Sub-characteristic  | Implementation                                                                                            | Evidence                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Confidentiality** | AWS Cognito authentication, owner-based authorization rules, S3 private paths                             | `amplify/auth/resource.ts`, `amplify/storage/resource.ts` |
| **Integrity**       | TypeScript strict null checks, Zod schema validation, CSP headers, HSTS                                   | `tsconfig.json`, `netlify.toml`                           |
| **Non-repudiation** | Structured logging with context (`src/lib/logger.ts`), Amplify audit fields (createdAt/updatedAt/owner)   | `amplify/data/resource.ts`                                |
| **Accountability**  | Git hooks enforce lint/format on every commit, CI pipeline blocks broken code, PR template with checklist | `.husky/pre-commit`, `.github/PULL_REQUEST_TEMPLATE.md`   |
| **Authenticity**    | Cognito email verification, MFA support, CSRF protection via SameSite cookies                             | `amplify/auth/resource.ts`                                |

## 7. Maintainability

| Sub-characteristic | Implementation                                                                                                          | Evidence                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Modularity**     | Feature-based architecture (`src/features/`), separation of concerns (pages/components/hooks/lib/types)                 | Directory structure                                      |
| **Reusability**    | Shared component props (`ComponentProps`), utility types (`Prettify<T>`, `Optional<T>`), common hooks                   | `src/types/index.ts`, `src/hooks/common.ts`              |
| **Analysability**  | Structured logger with child loggers, TypeScript strict mode catches issues at compile time                             | `src/lib/logger.ts`, `tsconfig.json`                     |
| **Modifiability**  | Repository pattern isolates data access, environment abstraction (`src/lib/env.ts`), theme centralization               | `src/features/todos/repository.ts`                       |
| **Testability**    | Jest + RTL + Playwright, mocking infrastructure (router, i18n, MUI), coverage thresholds, test examples for every layer | `jest.setup.ts`, `e2e/`, `src/features/todos/__tests__/` |

## 8. Portability

| Sub-characteristic | Implementation                                                                                           | Evidence                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Adaptability**   | Environment auto-detection (Vercel/Netlify/Amplify), feature flags via env vars, responsive design       | `src/lib/env.ts`                                       |
| **Installability** | One-command bootstrap (`./scripts/bootstrap.sh`), `--ci` flag for automated environments                 | `scripts/bootstrap.sh`                                 |
| **Replaceability** | Repository pattern allows data source swapping without UI changes, theme abstraction for brand switching | `src/features/todos/repository.ts`, `src/lib/theme.ts` |

---

## ISO 27001 Alignment (Information Security)

While full ISO 27001 certification requires organizational controls beyond code, this template addresses key technical controls:

| Control Area                                   | Implementation                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| **A.8.25 — Secure development lifecycle**      | Pre-commit hooks, CI pipeline, PR template with security checklist                  |
| **A.8.26 — Application security requirements** | TypeScript strict mode, Zod validation, CSP/HSTS headers                            |
| **A.8.28 — Secure coding**                     | ESLint with security rules, no `any` types, environment variable isolation          |
| **A.8.29 — Security testing**                  | Jest unit tests, Playwright E2E, coverage thresholds                                |
| **A.8.31 — Separation of environments**        | Branch-based deployment (main/staging/development), platform-specific env configs   |
| **A.8.9 — Configuration management**           | `.env.example` template, `src/lib/env.ts` centralized access, AGENTS.md conventions |

---

## How to Use This Document

1. **For audits**: Reference specific files/configs listed in the "Evidence" column
2. **For new features**: Check which quality characteristics apply and follow existing patterns
3. **For client proposals**: Use this matrix to demonstrate quality commitments
4. **For compliance**: Map your project-specific requirements to the sub-characteristics above
