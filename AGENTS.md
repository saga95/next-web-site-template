# Agent Configuration — Next.js Enterprise Template

## Available Agents

### Default Agent

The default coding agent for general development tasks. Follows instructions from `.github/copilot-instructions.md`.

### Explore Agent

Fast read-only codebase exploration. Use for:

- Finding where something is implemented
- Understanding code dependencies
- Answering questions about the codebase

### Custom Agent Templates

Below are role-based instruction sets that agents (human or AI) can follow when performing specific tasks.

---

## 🚀 Setup Agent (for new project initialization)

**Goal**: Get a new project from template to deployed in minimum time.

**Steps**:

1. Clone the template: `git clone <template-url> <project-name>`
2. Run bootstrap: `npm run bootstrap` (or `bash scripts/bootstrap.sh`)
3. Update `package.json` with project name and description
4. Update `.env.local` with project-specific values
5. Update `public/manifest.json` with app name, colors, icons
6. Update `src/lib/seo.ts` SITE_URL and SITE_NAME
7. Choose deployment target (Vercel/Netlify/Amplify) and configure
8. If using Amplify backend: `npx ampx sandbox` to start local backend
9. Verify: `npm run dev`, `npm run lint`, `npm run test`, `npm run build`

---

## 🔧 Feature Agent (for adding new features)

**Pre-conditions**: Understand the feature requirements fully.

**Steps**:

1. Create feature branch: `git checkout -b feature/<name>`
2. Define types in `src/types/index.ts` if needed
3. Create/update data models in `amplify/data/resource.ts` if needed
4. Create React Query hooks for data fetching
5. Build UI components with MUI, following existing patterns
6. Add i18n translations to `public/locales/en/*.json`
7. Add SEO metadata using `src/lib/seo.ts` helpers
8. Write tests (components, hooks, utilities)
9. Run quality checks: `npm run lint && npm run type-check && npm run test`
10. Submit PR to `development` branch

---

## 🌍 Localization Agent (for i18n tasks)

**Steps**:

1. Identify all user-facing strings in the feature/page
2. Add translation keys to `public/locales/en/*.json` (English first)
3. Copy to other locale directories and translate
4. Use `useTranslation('namespace')` hook in components
5. Test language switching
6. Verify RTL layout if adding Arabic

---

## 🔍 SEO Agent (for SEO optimization)

**Steps**:

1. Review page metadata using `generatePageMeta()` from `src/lib/seo.ts`
2. Add JSON-LD structured data (Organization, BreadcrumbList, FAQ, Article, etc.)
3. Verify `robots.txt` allows the page
4. Add page to sitemap
5. Check Open Graph and Twitter Card previews
6. Verify canonical URLs
7. Test with Google Rich Results Test

---

## 🧪 QA Agent (for quality assurance)

**Steps**:

1. Run full test suite: `npm run test:coverage`
2. Check type safety: `npm run type-check`
3. Check lint: `npm run lint:check`
4. Check formatting: `npm run format:check`
5. Build all environments: `npm run build`
6. Verify accessibility with axe-core or WAVE
7. Test responsive design (mobile, tablet, desktop)
8. Test with screen reader
9. Check Core Web Vitals in Lighthouse

---

## 🚢 Deploy Agent (for deployment tasks)

**Steps**:

1. Ensure all checks pass (lint, types, tests, build)
2. Choose platform:
   - **Vercel**: `bash scripts/deploy-vercel.sh`
   - **Netlify**: `bash scripts/deploy-netlify.sh`
   - **Amplify**: Push to main for auto-deploy
3. Set environment variables on the platform
4. Verify deployment URL loads correctly
5. Run smoke tests on deployed URL
6. Verify SEO (structured data, meta tags, sitemap)
