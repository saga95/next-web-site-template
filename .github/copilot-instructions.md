# Copilot Instructions — Next.js Enterprise Template

## Project Overview

This is a **Next.js 14 enterprise template** using the **Pages Router**, **Material UI v6**, **TypeScript 5**, and **AWS Amplify Gen 2** for backend services. It is designed for rapid client project setup with multi-platform deployment (Vercel, Netlify, AWS Amplify).

## Architecture

- **Framework**: Next.js 14 (Pages Router, NOT App Router)
- **UI**: Material UI v6 with `@emotion/react` and `@emotion/styled`
- **Backend**: AWS Amplify Gen 2 (Cognito Auth, AppSync GraphQL, DynamoDB, S3)
- **State**: React Query (`@tanstack/react-query`) for server state
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next with HTTP backend, 7 languages supported
- **Email**: EmailJS for contact forms
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules + MUI `sx` prop (no Tailwind)

## Key Directories

- `src/pages/` — File-based routing (Pages Router)
- `src/pages/auth/` — Authentication pages (login, register, confirm, forgot-password)
- `src/components/` — Reusable React components (AdminLayout, AccountLayout, ErrorBoundary, Toast)
- `src/contexts/` — React context providers (AuthContext with Cognito RBAC)
- `src/lib/` — Utilities: `env.ts`, `i18n.ts`, `theme.ts`, `seo.ts`, `logger.ts`, `amplify.ts`, `amplifyClient.ts`, `emailjs.ts`, `date.ts`, `utils.ts`
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions (Auth, RBAC, Ecommerce, UI, API)
- `src/styles/` — Global CSS and CSS modules
- `amplify/` — AWS Amplify Gen 2 backend (auth with groups, data schema, storage, post-confirmation Lambda)
- `public/locales/` — Translation JSON files
- `scripts/` — Deployment and setup scripts

## Coding Standards

1. **TypeScript strict mode** — All code must pass `tsc --noEmit` with strict options.
2. **No `any` types** — Use proper typing. Prefer `unknown` when type is truly unknown.
3. **ESLint + Prettier** — Pre-commit hooks enforce formatting. Run `npm run lint` before committing.
4. **Accessibility** — All interactive elements must meet WCAG 2.2 AA. Use `aria-*` attributes and semantic HTML.
5. **i18n** — All user-facing text must use `useTranslation()` from react-i18next. Add translations to `public/locales/en/*.json`.
6. **Environment variables** — Use `getEnvVar()` / `getRequiredEnvVar()` from `src/lib/env.ts`. Never access `process.env` directly.
7. **Logging** — Use `logger` from `src/lib/logger.ts` instead of `console.log`. Use child loggers for component context.
8. **SEO** — Use helpers from `src/lib/seo.ts` for metadata and JSON-LD structured data.
9. **Tests** — Place tests in `__tests__/` directories adjacent to the code. Minimum 70% coverage for new code.

## Branch Strategy

- `main` → Production
- `staging` → Staging / QA
- `development` → Active development
- Feature branches: `feature/description`, `fix/description`

## Deployment

- **Vercel**: Push to any branch triggers build. Config in `vercel.json`.
- **Netlify**: Push triggers build. Config in `netlify.toml`.
- **AWS Amplify**: Push to main triggers pipeline. Config in `amplify.yml`.

## Environment Detection

Use `src/lib/env.ts` which auto-detects Vercel, Netlify, or AWS Amplify environment. Feature flags control optional capabilities (analytics, error tracking, PWA, i18n).

## When Creating New Pages

1. Create the page in `src/pages/`
2. Add SEO metadata using `generatePageMeta()` from `src/lib/seo.ts`
3. Add translations to `public/locales/en/*.json`
4. Add navigation entry if needed
5. Write tests in `__tests__/`

## When Creating New Components

1. Place in `src/components/`
2. Use Material UI components with the project theme
3. Accept `className` and `sx` props for customization
4. Include TypeScript interface for props
5. Ensure accessibility (keyboard navigation, screen reader support)
6. Write unit tests

## When Modifying the Backend

1. Edit schema in `amplify/data/resource.ts`
2. Add authorization rules for each model
3. Run `npx ampx sandbox` to test locally
4. Create React Query hooks for data fetching

## UX / Design Work — Adopt the "Aria" Persona

For any UI/UX task (design system, components, wireframes, personas, empathy
maps, user flows, IA, sitemaps, journey maps, hi-fi mockups, Storybook,
theme audits), follow the dedicated agent persona defined in
[`CLAUDE.md`](../CLAUDE.md) and the slash-command specifications in
[`.claude/commands/`](../.claude/commands/).

Key rules carried over from Aria:

1. Read `design-system/tokens.ts` **before** any design decision; never hardcode colors, spacing, or typography.
2. Use MUI v6 primitives + the `sx` prop. Do not introduce Tailwind or other styling libraries.
3. Every new component gets a Storybook story under `src/stories/`.
4. Save UX artifacts (personas, flows, wireframes, etc.) under `ux-docs/<category>/`.
5. The MUI theme is derived from tokens via `design-system/mui-theme.ts` (`buildMuiTheme(mode)`); update tokens, not the theme directly.
