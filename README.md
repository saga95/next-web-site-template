# Next.js Enterprise Template

> **A battle-tested, production-ready foundation for building client projects and rapid prototypes**

This template is designed for **forking and customization** to build:

- 🏢 **Client Marketing Sites** - SEO-optimized, accessible web presence
- 🔐 **Backoffice Applications** - Admin dashboards, content management
- ⚡ **Rapid Prototypes** - MVP validation and proof-of-concepts
- 🌐 **Multi-tenant SaaS** - Scalable multi-client applications

Built with enterprise-grade features, comprehensive documentation, and deployment-ready configurations for Vercel, Netlify, and AWS Amplify.

---

## 📋 Table of Contents

1. [🎯 Getting Started for Developers](#-getting-started-for-developers)
2. [🔱 For Project Leads: Forking Strategy](#-for-project-leads-forking-strategy)
3. [🚀 Features Overview](#-features-overview)
4. [🏗️ Project Architecture](#-project-architecture)
5. [⚙️ Development Workflow](#-development-workflow)
   - [🤖 MCP-Powered Development (Agentic AI)](#-mcp-powered-development-agentic-ai)
6. [🏢 Building Client Projects](#-building-client-projects)
7. [⚡ Building Prototypes](#-building-prototypes)
8. [🚢 Deployment Guide](#-deployment-guide)
9. [✅ Quality Standards](#-quality-standards)
10. [🎨 Customization Guide](#-customization-guide)
11. [🔧 Troubleshooting](#-troubleshooting)

---

## 🎯 Getting Started for Developers

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **pnpm** (preferred), or npm/yarn
- **Git** with SSH or HTTPS access
- **Basic knowledge of**: Next.js, React, TypeScript, Material UI

### Initial Setup (5 minutes)

```bash
# 1. Fork or clone this repository
git clone https://github.com/saga95/next-web-site-template.git my-project-name
cd my-project-name

# 2. Run the bootstrap script (installs deps, sets up env, validates)
./scripts/bootstrap.sh

# 3. Start development server
pnpm dev   # or: pnpm dev

# 4. Open http://localhost:3000
```

**Or setup manually:**

```bash
pnpm install                      # Install dependencies
cp .env.example .env.local        # Create env config (edit with your values)
pnpm dev                          # Start dev server
```

**Optional: AWS Amplify backend**

```bash
npx ampx sandbox                  # Start local Amplify sandbox
```

### First Steps Checklist

After running `pnpm dev`, verify:

- [ ] ✅ Server running on http://localhost:3000
- [ ] 🎨 Page displays with Material UI theme
- [ ] 🌍 Language switcher works (EN/ES/FR/DE/JA/ZH/AR)
- [ ] 🌓 Dark/light mode toggle functions
- [ ] 📧 Contact form submits (if EmailJS configured)
- [ ] 📝 No console errors in browser DevTools

**🎉 You're ready to start developing!**

### 🤖 Optional: Enable AI-Powered Development (MCP)

Want to accelerate development with Figma-to-code workflows?

1. **Setup Figma token** (5 minutes): See [MCP Setup Guide](./MCP_SETUP_GUIDE.md)
2. **🚨 ALWAYS use "Copy Dev Mode link"** in Figma (not prototype link)
3. **Ask Copilot**: "Generate component from [Figma Dev Mode link]"

📚 **Full docs**: [MCP_SETUP_GUIDE.md](./MCP_SETUP_GUIDE.md) | [Quick Reference](./MCP_QUICK_REFERENCE.md)

---

## 🔱 For Project Leads: Forking Strategy

### When to Fork vs. Clone

**Fork This Template When:**

- ✅ Starting a new client project with ongoing maintenance
- ✅ Building a unique product/prototype that may evolve
- ✅ Need to maintain project-specific customizations
- ✅ Want to sync upstream template improvements periodically

**Clone Directly When:**

- ✅ Quick one-off prototype (no long-term maintenance)
- ✅ Learning/experimentation purposes
- ✅ Internal tools that won't need template updates

### Recommended Fork Workflow

```bash
# 1. Fork on GitHub UI (creates your-username/next-web-site-template)

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/next-web-site-template.git client-project-name
cd client-project-name

# 3. Add upstream remote to sync template updates
git remote add upstream https://github.com/saga95/next-web-site-template.git

# 4. Create your project branch
git checkout -b project/client-name-setup

# 5. Customize for your project (see Customization Guide below)
# - Update package.json (name, version, description)
# - Update this README.md with project specifics
# - Configure branding (colors, fonts, logos)
# - Remove unused features
# - Add project-specific components

# 6. Commit your baseline
git commit -am "feat: initialize [client-name] project baseline"
git push origin project/client-name-setup

# 7. Merge to main when ready
git checkout main
git merge project/client-name-setup
git push origin main
```

### Syncing Template Updates

Periodically pull improvements from the original template:

```bash
# 1. Fetch latest changes from upstream
git fetch upstream

# 2. Review what changed before merging
git log upstream/main --oneline --since="2 weeks ago"
git diff main..upstream/main --stat          # File-level summary
git diff main..upstream/main -- src/lib/     # Inspect specific directories

# 3. Create a sync branch (never merge directly to main)
git checkout -b update/sync-template

# 4. Merge upstream
git merge upstream/main

# 5. Resolve conflicts, then validate
pnpm install                                 # Update dependencies
pnpm type-check && pnpm lint && pnpm test    # Quality gates
pnpm build                                   # Full build verification

# 6. Push and create PR for team review
git push origin update/sync-template
```

#### What Merges Cleanly vs. What Conflicts

The template is structured so **infrastructure stays separate from your domain code**. Understanding this helps predict and resolve conflicts:

| Layer | Files | Merge Behavior |
|-------|-------|---------------|
| **Infra (clean merge)** | `src/lib/` (env, logger, seo, i18n, date, utils), `src/hooks/common.ts`, `src/components/ErrorBoundary.tsx`, `src/components/Toast.tsx`, `docs/`, `scripts/`, CI/CD, eslint/prettier configs | Merges cleanly — you typically don't modify these |
| **Auth & Layouts (may conflict)** | `src/contexts/AuthContext.tsx`, `src/components/AdminLayout.tsx`, `src/components/AccountLayout.tsx`, `src/pages/auth/*` | May conflict if you customized nav items, groups, or form fields |
| **Amplify backend (likely conflicts)** | `amplify/data/resource.ts`, `amplify/auth/resource.ts`, `amplify/storage/resource.ts`, `amplify/backend.ts` | Will conflict — you've added your own models and config |
| **Your domain (no conflict)** | `src/pages/` (your pages), `src/features/` (your modules), `src/components/` (your components) | No conflict — template doesn't touch your custom files |
| **Shared config (review carefully)** | `package.json`, `tsconfig.json`, `next.config.mjs`, `_app.tsx` | May conflict on dependency versions or provider order |

#### Conflict Resolution Strategy

```bash
# When you hit conflicts during merge:

# 1. See which files conflict
git diff --name-only --diff-filter=U

# 2. For each conflicted file, decide:
#    - KEEP YOURS: Your customizations take priority (schemas, themes, pages)
git checkout --ours amplify/data/resource.ts
#    - KEEP THEIRS: Template improvement is better (infra, utilities)
git checkout --theirs src/lib/logger.ts
#    - MANUAL MERGE: Both sides have valuable changes (package.json, _app.tsx)
#      Open the file, resolve <<<< markers, test

# 3. After resolving all conflicts
git add .
pnpm install                                 # In case package.json changed
pnpm type-check && pnpm test && pnpm build   # Validate everything
git commit
```

#### Recommended Sync Cadence

- **Monthly** — for active SaaS products (catches security patches and DX improvements)
- **Quarterly** — for stable client projects in maintenance mode
- **Before major milestones** — sync before starting a new feature sprint to bring in latest infra

### Multi-Client Organization Strategy

Organize your projects effectively:

```
📁 Your GitHub Organization/
├── 🔧 next-web-site-template (your fork - stays pristine)
├── 🏢 client-acme-marketing-site
├── 🏢 client-beta-backoffice
├── ⚡ client-gamma-prototype
├── 🔐 internal-admin-dashboard
└── 🌐 saas-product-main
```

**Pro Tips:**

- Use GitHub **Topics/Labels**: `client-project`, `prototype`, `backoffice`, `marketing-site`
- Tag releases: `v1.0.0-acme`, `v2.1.0-beta`
- Create a **private template** in your org for pre-configured client defaults
- Document client-specific customizations in `PROJECT_NOTES.md`

---

## 🚀 Features Overview

### Core Technology Stack

- **⚛️ Next.js 14.2** - React framework with SSR/SSG/ISR
- **📘 TypeScript 5** - Type-safe development
- **⚛️ React 18.2** - Latest React features (concurrent rendering, suspense)
- **🎨 Material UI v6** - Comprehensive component library with emotion styling
- **🔄 React Query v4** - Powerful data fetching and caching
- **📝 React Hook Form** - Performant form validation
- **✅ Zod** - Runtime type validation and schema validation
- **☁️ AWS Amplify Gen 2** - Auth (Cognito), API (AppSync/GraphQL), Storage (S3), Database (DynamoDB)

### Authentication & Authorization (Cognito RBAC)

- 🔐 **Cognito User Groups** - Admin and Shopper roles out of the box
- 📝 **Auth Pages** - Login, Register, Confirm Email, Forgot Password (React Hook Form + Zod)
- 🧩 **AuthContext** - `useAuth()` hook with `isAdmin`, `isShopper`, user profile, login/logout/register
- 🚀 **Post-Confirmation Lambda** - Auto-assigns default group on sign-up
- 🔒 **AdminLayout** - Protected sidebar layout for admin pages (responsive, role-gated)
- 👤 **AccountLayout** - Tabbed layout for authenticated user pages (profile, orders, settings)
- 🔑 **Dual Data Clients** - Public (API-key) and authenticated (userPool) AppSync clients
- 🛡️ **CDK Overrides** - Password policy, Admin IAM permissions, S3 CORS configuration
- 📋 **Reference Data Schema** - Product, Order, Category, ContactSubmission models with auth rules

### Performance (Core Web Vitals Optimized)

- ⚡ **LCP ≤ 2.5s** - Optimized loading performance
- 🎯 **INP < 200ms** - Excellent interactivity
- 📐 **CLS < 0.1** - Stable visual layout
- 📦 **Code Splitting** - Automatic and manual optimization
- 🖼️ **Image Optimization** - AVIF/WebP with responsive srcsets
- 🗜️ **Bundle Analysis** - Built-in bundle analyzer
- 🏎️ **HTTP/2+ Ready** - Server compression and CDN optimized

### Accessibility (WCAG 2.2 AA Compliant)

- ♿ **Semantic HTML** - Proper landmarks and document structure
- ⌨️ **Keyboard Navigation** - Full keyboard accessibility
- 🎨 **Focus Management** - Visible focus states and focus trapping
- 🔗 **ARIA Support** - Comprehensive ARIA implementation
- 🌈 **Color Contrast** - 4.5:1 contrast ratio compliance
- 🎭 **Screen Reader Support** - Live regions and announcements
- 📱 **Touch Targets** - 44×44px minimum size
- 🎬 **Reduced Motion** - Respects user preferences

### Security

- 🛡️ **CSP Headers** - Content Security Policy configured
- 🔒 **HTTPS + HSTS** - Strict transport security
- 🍪 **Secure Cookies** - HttpOnly, Secure, SameSite attributes
- 🏰 **CSRF Protection** - Cross-site request forgery protection
- 🔍 **Dependency Scanning** - Automated vulnerability checks
- 🚫 **XSS Protection** - Input sanitization and output escaping

### SEO & Metadata

- 🔍 **Dynamic Meta Tags** - Title, description, Open Graph via `generatePageMeta()`
- 🗺️ **Sitemap Generation** - Automatic sitemap.xml with search engine ping
- 🤖 **robots.txt** - Search engine directives
- 📊 **Structured Data** - JSON-LD helpers for Organization, Website, FAQ, Article, Product, LocalBusiness
- 🌐 **Open Graph** - Social media optimization
- 🐦 **Twitter Cards** - Twitter-specific metadata
- 📱 **Mobile-First** - Responsive and mobile-optimized
- 🤖 **AEO/GEO** - Answer Engine Optimization and Generative Engine Optimization ready

### Internationalization (i18n)

- 🌍 **7 Languages Supported** - EN, ES, FR, DE, JA, ZH, AR
- 🔄 **Dynamic Language Switching** - Runtime locale changes
- 🌐 **RTL Support** - Right-to-left language layouts
- 📅 **Locale-aware Formatting** - Dates, numbers, currencies
- 🏷️ **Namespaced Translations** - Organized by feature
- 💾 **Persistence** - Language preference saved

### Developer Experience

- 📝 **TypeScript** - 20+ strict mode flags (noImplicitAny, exactOptionalPropertyTypes, noUncheckedIndexedAccess, etc.)
- 🧪 **Testing Suite** - Jest + React Testing Library (unit) + Playwright (E2E)
- 📏 **ESLint** - Flat config with 30+ jsx-a11y accessibility rules (WCAG 2.2 AA)
- 💅 **Prettier** - Automatic code formatting
- 🐶 **Husky + lint-staged** - Git hooks for pre-commit quality (lint + format)
- 🛡️ **ErrorBoundary** - Global error boundary with graceful fallback UI
- 🔔 **Toast Notifications** - Snackbar system via `ToastProvider` + `useToast()` hook
- 🔐 **Auth Provider** - `AuthProvider` + `useAuth()` for Cognito session, groups, and role detection
- 🏗️ **DDD Feature Modules** - Reference domain-driven architecture (`src/features/todos/`)
- 📋 **Structured Logger** - Environment-aware logging with child loggers (`src/lib/logger.ts`)
- 📊 **ISO Compliance** - ISO 25010 quality model and ISO 27001 security compliance matrix
- 🔧 **Development Tools** - Hot reload, debugging, profiling
- 📊 **Bundle Analyzer** - Visualize bundle composition
- 🤖 **Agent Orchestration** - Role-based AI agent guides (`AGENTS.md`) and Copilot instructions
- 🤖 **MCP Configuration** - Agentic AI development with Figma, GitHub, Git, and Filesystem integration (see [MCP Setup Guide](./MCP_SETUP_GUIDE.md))
- 🚀 **Bootstrap Script** - One-command project setup (`./scripts/bootstrap.sh`)

### Communication & Utilities

- 📧 **EmailJS Integration** - Serverless email functionality
- 📊 **Recharts** - Data visualization library
- 📅 **dayjs** - Modern date manipulation
- 🎨 **Emotion** - CSS-in-JS styling solution

---

## 🏗️ Project Architecture

### Directory Structure

```
my-next-template/
├── .github/                    # GitHub configuration
│   ├── copilot-instructions.md # AI agent coding standards
│   ├── workflows/
│   │   └── ci-cd.yml         # CI/CD pipeline (lint, type-check, test, build)
│   ├── ISSUE_TEMPLATE/       # Bug report & feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── .husky/                    # Git hooks
│   └── pre-commit             # Lint-staged pre-commit hook
├── __tests__/                 # Root-level page tests
│   └── pages/
│       └── index.test.tsx
├── amplify/                   # AWS Amplify Gen 2 backend
│   ├── auth/resource.ts      # Cognito authentication (groups, MFA, phone)
│   ├── auth/post-confirmation/ # Lambda: auto-assign default group on sign-up
│   │   ├── resource.ts
│   │   └── handler.ts
│   ├── data/resource.ts      # AppSync/DynamoDB data schema (Product, Order, Category, Contact)
│   ├── storage/resource.ts   # S3 storage (uploads, assets, per-user files)
│   ├── backend.ts            # Backend entry + CDK overrides (password policy, Admin IAM, S3 CORS)
│   └── package.json          # Amplify dependencies
├── docs/                      # Project documentation
│   └── compliance.md         # ISO 25010 & ISO 27001 compliance matrix
├── e2e/                       # Playwright end-to-end tests
│   └── smoke.spec.ts         # Smoke tests (homepage, a11y, API, responsive)
├── public/                    # Static assets
│   ├── locales/              # Translation JSON files (7 languages)
│   │   ├── en/              # English (primary)
│   │   ├── es/, fr/, de/    # European languages
│   │   ├── ja/, zh/         # Asian languages
│   │   └── ar/              # Arabic (RTL)
│   ├── icons/
│   │   └── icon.svg          # App icon (TODO: replace with your icon)
│   ├── manifest.json         # PWA manifest
│   ├── og-image.svg          # Social preview placeholder (TODO: replace)
│   └── robots.txt            # Search engine directives
├── scripts/                   # Deployment and utility scripts
│   ├── bootstrap.sh          # One-command project setup
│   ├── deploy-vercel.sh      # Vercel deployment helper
│   ├── deploy-netlify.sh     # Netlify deployment helper
│   └── setup-env.sh          # Environment setup helper
├── src/
│   ├── components/           # Reusable React components
│   │   ├── AccountLayout.tsx # Authenticated user layout (tabs: profile, orders, settings)
│   │   ├── AdminLayout.tsx   # Admin dashboard layout (sidebar, role protection)
│   │   ├── ContactForm.tsx   # EmailJS-powered contact form
│   │   ├── ErrorBoundary.tsx # Global error boundary
│   │   ├── Toast.tsx         # Toast notification system (ToastProvider + useToast)
│   │   └── __tests__/        # Component tests
│   ├── contexts/             # React context providers
│   │   └── AuthContext.tsx   # Cognito auth (login, register, groups, isAdmin/isShopper)
│   ├── features/             # Domain-driven feature modules
│   │   └── todos/            # Reference DDD implementation
│   │       ├── types.ts      # Domain types
│   │       ├── repository.ts # Data access layer
│   │       ├── hooks.ts      # React Query hooks
│   │       └── index.ts      # Public API
│   ├── hooks/                # Custom React hooks
│   │   ├── common.ts         # Shared hooks (useDebounce, useLocalStorage, etc.)
│   │   └── __tests__/        # Hook tests
│   ├── lib/                  # Utilities and configurations
│   │   ├── amplify.ts       # AWS Amplify client configuration
│   │   ├── amplifyClient.ts # Dual data clients (public API-key + authenticated userPool)
│   │   ├── date.ts          # Date utilities (dayjs)
│   │   ├── emailjs.ts       # EmailJS utilities
│   │   ├── env.ts           # Environment detection & feature flags
│   │   ├── i18n.ts          # i18next configuration
│   │   ├── logger.ts        # Structured logger with child loggers
│   │   ├── seo.ts           # SEO/JSON-LD utilities
│   │   ├── theme.ts         # Material UI theme (TODO: customize colors)
│   │   ├── utils.ts         # Common utilities
│   │   └── __tests__/        # Utility tests
│   ├── pages/                # Next.js pages (file-based routing)
│   │   ├── _app.tsx         # App providers (ErrorBoundary, Amplify, Auth, React Query, Toast)
│   │   ├── _document.tsx    # Custom Document component
│   │   ├── index.tsx        # Template demo homepage (TODO: replace)
│   │   ├── 404.tsx          # Custom 404 page
│   │   ├── 500.tsx          # Custom 500 page
│   │   ├── auth/
│   │   │   ├── login.tsx    # Sign-in page (email + password)
│   │   │   ├── register.tsx # Create account (with validation)
│   │   │   ├── confirm.tsx  # Email verification code
│   │   │   └── forgot-password.tsx # Password reset flow
│   │   └── api/
│   │       ├── hello.ts     # Example API endpoint
│   │       └── sitemap.ts   # Dynamic sitemap.xml generator
│   ├── styles/
│   │   ├── globals.css      # Global CSS
│   │   └── Home.module.css  # CSS Modules example
│   └── types/
│       └── index.ts         # Global TypeScript types (Auth, RBAC, Ecommerce, UI, API)
├── amplify.yml               # AWS Amplify build specification
├── amplify_outputs.json      # Amplify client config stub (overwritten by sandbox)
├── eslint.config.mjs         # ESLint flat config
├── .prettierrc.json          # Prettier configuration
├── jest.config.js            # Jest testing configuration
├── playwright.config.ts      # Playwright E2E configuration
├── netlify.toml              # Netlify deployment config
├── next.config.mjs           # Next.js configuration
├── vercel.json               # Vercel deployment config
├── mcp.json                  # MCP server configuration (Figma, Git, GitHub)
├── AGENTS.md                 # AI agent orchestration guide
├── CONTRIBUTING.md            # Contribution guidelines
├── SECURITY.md                # Security policy
├── LICENSE                    # MIT License
└── README.md                 # This file
```

### Design Patterns & Conventions

#### Component Organization

```typescript
// ✅ Good: Organized, typed, documented
// src/components/common/Button/Button.tsx
import { ButtonProps } from '@/types';

/**
 * Primary button component for user actions
 * @param {ButtonProps} props - Button properties
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  return <button className={`btn-${variant}`} {...props}>{children}</button>;
};
```

#### Custom Hooks

```typescript
// ✅ Good: Reusable, typed, tested
// src/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Implementation with TypeScript generics
};
```

#### API Routes

```typescript
// ✅ Good: Type-safe, error-handled
// src/pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Implementation
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### State Management Strategy

**Local State**: React `useState` for component-specific state
**Shared State**: React Context API (`AuthContext` for auth/RBAC, theme, i18n)
**Server State**: React Query for API data fetching and caching
**Form State**: React Hook Form for complex forms

### Styling Approach

- **Material UI Components**: Pre-styled, accessible components
- **Emotion CSS-in-JS**: Component-scoped styling
- **Global Styles**: `globals.css` for resets and utilities
- **Theming**: Centralized theme in `src/lib/theme.ts`
- **Dark Mode**: System preference detection + manual toggle

---

## ☁️ AWS Amplify Backend

The template includes a pre-configured **AWS Amplify Gen 2** backend with authentication, data, and storage.

### Backend Structure

| Resource | Config File                   | Service                                    |
| -------- | ----------------------------- | ------------------------------------------ |
| Auth     | `amplify/auth/resource.ts`    | Amazon Cognito (email login, MFA optional) |
| Data     | `amplify/data/resource.ts`    | AWS AppSync + DynamoDB (GraphQL API)       |
| Storage  | `amplify/storage/resource.ts` | Amazon S3 (public/protected/private paths) |

### Local Development with Sandbox

```bash
# Start a personal cloud sandbox (creates real AWS resources)
npx ampx sandbox

# The sandbox generates amplify_outputs.json automatically
# _app.tsx loads it dynamically — no config needed

# Clean up when done
npx ampx sandbox delete
```

### Adding Data Models

Edit `amplify/data/resource.ts` to define your schema. The template ships with reference models (Product, Order, Category, ContactSubmission) that you can extend:

```typescript
const schema = a.schema({
  // Existing reference models: Product, Order, Category, ContactSubmission
  // Add your own below:
  BlogPost: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      status: a.enum(['DRAFT', 'PUBLISHED']),
    })
    .authorization(allow => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.group('Admin').to(['create', 'update', 'delete']),
    ]),
});
```

### Deployment

Push to `main` triggers the Amplify pipeline defined in `amplify.yml`. The pipeline builds the backend first, then the frontend.

---

## 📊 SEO Infrastructure

The template provides comprehensive SEO utilities in `src/lib/seo.ts`.

### Page Metadata

```typescript
import { generatePageMeta } from '@/lib/seo';

// In your page component
const meta = generatePageMeta({
  title: 'About Us',
  description: 'Learn about our company',
  path: '/about',
  image: '/images/about-og.jpg',
});
// Returns: { title, description, canonical, openGraph, twitter }
```

### JSON-LD Structured Data

```typescript
import { generateOrganizationJsonLd, generateFAQJsonLd, jsonLdScriptProps } from '@/lib/seo';

// Add to your page's <Head>
<script {...jsonLdScriptProps(generateOrganizationJsonLd())} />
<script {...jsonLdScriptProps(generateFAQJsonLd(faqItems))} />
```

Available JSON-LD generators: `Organization`, `WebSite`, `Breadcrumb`, `FAQ`, `Article`, `LocalBusiness`, `Product`.

---

## 📋 Structured Logger

Use `src/lib/logger.ts` instead of `console.log`. The logger is environment-aware and disabled in production.

```typescript
import { logger, authLogger } from '@/lib/logger';

logger.info('App started');
authLogger.warn('Token expiring soon', { userId: '123' });

// Create a child logger for component context
const log = logger.createChild('MyComponent');
log.debug('Rendering with props', props);
```

---

## 🤖 Agent Orchestration

This template includes AI agent instructions for accelerated development:

- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Coding standards and project rules for GitHub Copilot
- **[AGENTS.md](AGENTS.md)** — Role-based agent workflows (Setup, Feature, Localization, SEO, QA, Deploy agents)

Agents follow the conventions defined in these files to produce consistent, project-aligned code.

---

## ⚙️ Development Workflow

### 🤖 MCP-Powered Development (Agentic AI)

This template includes **Model Context Protocol (MCP)** configuration for enhanced AI-assisted development with GitHub Copilot.

#### Quick Start with MCP

1. **Setup tokens** (one-time, 5 minutes):

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Add your Figma token to .env.local
   FIGMA_PERSONAL_ACCESS_TOKEN=figd_your_token_here

   # Reload VS Code: Cmd/Ctrl + Shift + P → "Reload Window"
   ```

2. **🚨 CRITICAL: Always use "Copy Dev Mode Link" in Figma**:

   - Select node/component in Figma
   - Click **Share** button → **"Copy Dev Mode link"** ✅
   - Paste link in Copilot Chat

3. **Use in Copilot Chat**:
   ```
   "Extract design tokens from [paste Figma Dev Mode link]"
   "Generate a Material UI component from [paste link]"
   "Create a theme.ts file with colors from Figma"
   ```

#### Available MCP Servers

- 🎨 **Figma MCP** - Extract designs, tokens, components from Figma
- 📁 **Filesystem MCP** - Enhanced file operations
- 🔀 **Git MCP** - Automated git operations
- 🐙 **GitHub MCP** - Issues, PRs, and automation

#### Example Workflows

**Design-to-Code in 30 seconds**:

```
1. Design button component in Figma
2. Share → "Copy Dev Mode link"
3. Ask Copilot: "Generate Material UI Button from [link]"
4. Component generated with TypeScript + styles!
```

**Extract Design System**:

```
Ask Copilot:
"Extract all design tokens (colors, typography, spacing) from
[Figma Dev Mode link] and create a Material UI theme"
```

**Automated Git Operations**:

```
Ask Copilot:
"Show git diff for components folder"
"Create a commit with message 'feat: add user dashboard'"
```

📚 **Full Documentation**: See [MCP_SETUP_GUIDE.md](./MCP_SETUP_GUIDE.md) and [MCP_QUICK_REFERENCE.md](./MCP_QUICK_REFERENCE.md)

---

### Daily Development Commands

```bash
# Start development server (hot reload enabled)
pnpm dev

# Type checking (run before committing)
pnpm type-check

# Linting (run before committing)
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test -- __tests__/components/Button.test.tsx

# Build for production (test locally)
pnpm build

# Start production server locally
pnpm start

# Analyze bundle size
pnpm analyze
```

### Git Workflow (Git Flow Strategy)

This template uses a **three-branch strategy**:

```
main (production)
  ↑
staging (pre-production)
  ↑
development (active development)
  ↑
feature branches
```

#### Creating Features

```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/add-user-dashboard

# Make changes, commit frequently
git add .
git commit -m "feat: add user dashboard skeleton"

# Push and create PR to development
git push origin feature/add-user-dashboard
# Create PR on GitHub: feature/add-user-dashboard → development
```

#### Releasing to Staging

```bash
# Merge development → staging
git checkout staging
git pull origin staging
git merge development
git push origin staging

# Triggers staging deployment on Vercel/Netlify
```

#### Releasing to Production

```bash
# Merge staging → main (after testing)
git checkout main
git pull origin main
git merge staging
git push origin main

# Triggers production deployment on Vercel/Netlify
```

### Code Quality Checklist (Before Committing)

```bash
# Run this checklist before every commit
pnpm type-check  # ✅ No TypeScript errors
pnpm lint        # ✅ No linting errors
pnpm test        # ✅ All tests pass
pnpm build       # ✅ Build succeeds
```

**Automated via Husky** (if configured):

- Pre-commit: Lint staged files
- Pre-push: Run tests
- Commit-msg: Validate commit message format

### Commit Message Convention

Follow **Conventional Commits**:

```
feat: add user authentication
fix: resolve navigation bug on mobile
docs: update deployment guide
style: format code with prettier
refactor: simplify theme logic
test: add tests for contact form
chore: update dependencies
```

---

## 🏢 Building Client Projects

### Marketing Sites (Public-Facing)

**Best for**: Corporate websites, landing pages, promotional sites

#### Quick Start for Marketing Site

```bash
# 1. Fork template
git clone https://github.com/YOUR-ORG/next-web-site-template.git client-acme-marketing

# 2. Customize branding
cd client-acme-marketing
# Edit src/lib/theme.ts - update colors, fonts
# Replace public/images/ with client assets
# Update public/locales/ with client copy

# 3. Build pages
# src/pages/index.tsx - Homepage
# src/pages/about.tsx - About page
# src/pages/services.tsx - Services page
# src/pages/contact.tsx - Contact page

# 4. Configure SEO
# Add meta tags, Open Graph, structured data
# Generate sitemap
# Configure Google Analytics

# 5. Deploy
./scripts/deploy-vercel.sh  # or deploy-netlify.sh
```

#### Marketing Site Checklist

**Essential Features:**

- [ ] ✅ Homepage with hero section
- [ ] ✅ About/Services pages
- [ ] ✅ Contact form (EmailJS configured)
- [ ] ✅ SEO meta tags on all pages
- [ ] ✅ Google Analytics integrated
- [ ] ✅ Mobile responsive (test on devices)
- [ ] ✅ Performance score > 90 (Lighthouse)
- [ ] ✅ Accessibility score 100 (Lighthouse)
- [ ] ✅ SSL certificate configured
- [ ] ✅ Custom domain connected

**Optional Features:**

- [ ] Blog section (add `/src/pages/blog/`)
- [ ] Case studies/portfolio
- [ ] Newsletter signup
- [ ] Multi-language (already supported)
- [ ] Chat widget integration
- [ ] CMS integration (Contentful, Sanity)

#### Removing Unnecessary Features

```bash
# For simple marketing sites, you may remove:

# 1. Remove React Query (if no API calls)
pnpm remove @tanstack/react-query
# Remove from src/pages/_app.tsx

# 2. Remove Recharts (if no charts)
pnpm remove recharts
# Remove related imports

# 3. Simplify i18n (if single language)
# Keep English only in public/locales/
# Update src/lib/i18n.ts

# 4. Remove unused translations
# Delete public/locales/es, fr, de, ja, zh, ar
```

---

### Backoffice Applications (Private Admin Dashboards)

**Best for**: Admin panels, CMS, internal tools, data dashboards

#### Quick Start for Backoffice App

```bash
# 1. Fork template
git clone https://github.com/YOUR-ORG/next-web-site-template.git client-beta-backoffice

# 2. Auth is already built-in
# - Cognito with Admin/Shopper groups
# - Auth pages at /auth/login, /auth/register, etc.
# - AdminLayout with sidebar + route protection
# - AccountLayout with tabs for user pages
# - useAuth() hook for role detection (isAdmin, isShopper)

# 3. Create admin pages using AdminLayout
# src/pages/admin/
#   ├── index.tsx (dashboard)
#   ├── products.tsx (product management)
#   ├── categories.tsx (category management)
#   ├── orders.tsx (order management)
#   ├── users.tsx (user management)
#   └── settings.tsx (settings)

# 4. Add data tables and forms
# Use Material UI DataGrid
pnpm add @mui/x-data-grid

# 5. Use dual Amplify clients for data fetching
# publicClient (API-key) for public reads
# authClient (userPool) for authenticated operations
# See src/lib/amplifyClient.ts

# 6. Deploy
./scripts/deploy-vercel.sh  # or deploy-netlify.sh
```

#### Backoffice Checklist

**Essential Features:**

- [x] ✅ Authentication (Cognito with email + phone login, optional MFA)
- [x] ✅ Role-based access control (Admin, Shopper groups via Cognito)
- [x] ✅ Protected routes (AdminLayout redirects non-admins)
- [ ] ✅ User management interface
- [ ] ✅ Data tables (sorting, filtering, pagination)
- [ ] ✅ CRUD operations (Create, Read, Update, Delete)
- [x] ✅ Form validation (React Hook Form + Zod)
- [x] ✅ API integration (AppSync GraphQL via dual clients)
- [x] ✅ Error handling and logging
- [ ] ✅ Audit trails (who changed what when)

**Recommended Additions:**

- [ ] Data visualization (Recharts already included)
- [ ] File upload functionality
- [ ] Export to CSV/PDF
- [ ] Real-time updates (WebSockets or polling)
- [ ] Search and advanced filtering
- [ ] Batch operations
- [ ] Activity logs
- [ ] Email notifications

#### Authentication & Protected Routes (Built-in)

The template ships with Cognito authentication and role-based layouts:

```typescript
// src/pages/admin/products.tsx — Protected admin page
import AdminLayout from '@/components/AdminLayout';

export default function AdminProductsPage() {
  return (
    <AdminLayout title="Products">
      {/* AdminLayout auto-redirects non-admin users to / */}
      <ProductTable />
    </AdminLayout>
  );
}
```

```typescript
// src/pages/account/index.tsx — Protected user page
import AccountLayout from '@/components/AccountLayout';

export default function MyAccountPage() {
  return (
    <AccountLayout title="My Account">
      {/* AccountLayout auto-redirects unauthenticated users to /auth/login */}
      <ProfileForm />
    </AccountLayout>
  );
}
```

```typescript
// Using auth state in any component
import { useAuth } from '@/contexts/AuthContext';

function NavBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.givenName}</span>
          {isAdmin && <Link href="/admin">Admin Dashboard</Link>}
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <Link href="/auth/login">Sign In</Link>
      )}
    </nav>
  );
}
```

```typescript
// Using dual data clients for AppSync queries
import { publicClient, authClient } from '@/lib/amplifyClient';

// Public read (storefront — no login needed)
const { data: products } = await publicClient.models.Product.list();

// Authenticated write (admin only)
await authClient.models.Product.create({
  name: 'New Product',
  slug: 'new-product',
  price: 29.99,
  status: 'ACTIVE',
});
```

---

## ⚡ Building Prototypes

### Rapid Prototyping Strategy

**Goal**: Validate ideas quickly (1-2 weeks from concept to deployed MVP)

#### Prototype Development Process

```bash
# 1. Fork template (5 minutes)
git clone https://github.com/YOUR-ORG/next-web-site-template.git prototype-idea-name

# 2. Remove unnecessary features (15 minutes)
# - Keep only needed languages
# - Remove unused libraries
# - Simplify navigation

# 3. Build core pages (1-2 days)
# Focus on essential user flows only
# Use Material UI components (no custom design)
# Skip edge cases and error handling (for now)

# 4. Add mock data (1 day)
# Use static JSON data instead of backend
# Create src/data/mockData.ts

# 5. Deploy early and often (30 minutes)
./scripts/deploy-vercel.sh
# Share preview URL with stakeholders

# 6. Iterate based on feedback (ongoing)
# Make quick changes
# Deploy continuously
```

#### Prototype Checklist (MVP Features Only)

**Must Have:**

- [ ] ✅ Core user flow (1-3 pages max)
- [ ] ✅ Basic UI (Material UI components, no custom design)
- [ ] ✅ Mock data (no backend required initially)
- [ ] ✅ Mobile responsive
- [ ] ✅ Deployed URL for testing

**Nice to Have:**

- [ ] Form validation
- [ ] Loading states
- [ ] Error messages
- [ ] Analytics tracking

**Skip for Prototype:**

- ❌ Complex animations
- ❌ Edge case handling
- ❌ Production-grade error handling
- ❌ Comprehensive testing
- ❌ Full i18n (single language is fine)

#### Prototyping Tips

1. **Use Mock Data**: Create `src/data/mockData.ts`

```typescript
export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
```

2. **Fake API Calls**: Simulate async behavior

```typescript
export const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
  return mockUsers;
};
```

3. **Skip Backend**: Use local storage for state

```typescript
const saveData = data => {
  localStorage.setItem('prototypeData', JSON.stringify(data));
};
```

4. **Deploy Early**: Share work-in-progress

```bash
# Deploy to preview URL immediately
vercel --prod=false
# Share URL: https://prototype-idea-name-abc123.vercel.app
```

5. **Collect Feedback**: Add simple feedback form

```typescript
// Add EmailJS feedback form on every page
<FeedbackButton onClick={() => openFeedbackModal()} />
```

---

## 🚢 Deployment Guide

This template is configured for **Vercel**, **Netlify**, and **AWS Amplify** with automated deployments.

### Branch-Based Deployments

**Automatic deployments** configured for three environments:

| Branch        | Environment | URL Pattern                   |
| ------------- | ----------- | ----------------------------- |
| `main`        | Production  | `https://yourapp.com`         |
| `staging`     | Staging     | `https://staging.yourapp.com` |
| `development` | Development | `https://dev.yourapp.com`     |

### Quick Deploy - Vercel (Recommended)

**Option 1: Via Dashboard (Easiest)**

```bash
# 1. Run the interactive setup script
./scripts/deploy-vercel.sh

# 2. Follow the prompts:
#    - Connect GitHub repository
#    - Configure environment variables
#    - Set up custom domains

# 3. Push to trigger deployment
git push origin main
```

**Option 2: Via CLI (Fast)**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

**📚 Complete Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

### Quick Deploy - Netlify

**Option 1: Via Dashboard (Easiest)**

```bash
# 1. Run the interactive setup script
./scripts/deploy-netlify.sh

# 2. Follow the prompts:
#    - Connect GitHub repository
#    - Configure build settings
#    - Set environment variables

# 3. Push to trigger deployment
git push origin main
```

**Option 2: Via CLI (Fast)**

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --build --prod
```

**📚 Complete Guide**: See [DEPLOYMENT_GUIDE_NETLIFY.md](./DEPLOYMENT_GUIDE_NETLIFY.md)

---

### AWS Amplify

```bash
# 1. Build the project
pnpm build

# 2. Deploy via AWS Amplify Console:
#    - Go to AWS Amplify Console
#    - Click "New app" > "Host web app"
#    - Connect GitHub repository
#    - Configure build settings:
#      - Build command: pnpm build
#      - Output directory: .next
#    - Set environment variables
#    - Deploy!

# 3. Configure branch deployments:
#    - main → Production
#    - staging → Staging
#    - development → Development
```

---

### Environment Variables Setup

Each platform requires environment variables. Use the provided templates:

**For Vercel:**

```bash
# Copy template
cp .env.vercel .env.local

# Set variables in Vercel dashboard:
# Settings > Environment Variables
# Add for: Production, Preview, Development
```

**For Netlify:**

```bash
# Copy template
cp .env.netlify .env.local

# Set variables in Netlify dashboard:
# Site settings > Build & deploy > Environment variables
# Add for: Production, Deploy previews, Branch deploys
```

**Required Environment Variables:**

- `NEXT_PUBLIC_APP_NAME` - Your app/site name
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://myapp.com`)

**Optional Environment Variables:**

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking

See [.env.example](./.env.example) for the full list with descriptions.

---

### Custom Domains

**Vercel:**

```bash
# Add via dashboard or CLI
vercel domains add yourdomain.com
vercel domains add staging.yourdomain.com
vercel domains add dev.yourdomain.com
```

**Netlify:**

```bash
# Add via dashboard or CLI
netlify domains:add yourdomain.com
```

Configure DNS records as instructed by the platform.

---

### CI/CD Pipeline

**GitHub Actions** workflow is included and active (`.github/workflows/ci-cd.yml`).

The workflow runs on push to `main`, `staging`, and `development` branches:

- Type checking (`pnpm type-check`)
- Linting (`pnpm lint:check`)
- Tests (`pnpm test`)
- Build verification (`pnpm build`)

---

## ✅ Quality Standards

Before deploying to production, ensure all quality standards are met.

### Performance Checklist

- [ ] ✅ **LCP ≤ 2.5s** on 4G/low-end CPU (test with Lighthouse)
- [ ] ✅ **INP < 200ms** for all interactions
- [ ] ✅ **CLS < 0.1** on page load
- [ ] ✅ **Initial JS bundle < 300 KB** gzipped
- [ ] ✅ **Images optimized** (WebP/AVIF) and lazy-loaded
- [ ] ✅ **Code splitting** implemented for routes
- [ ] ✅ **Bundle analysis** reviewed (`pnpm analyze`)
- [ ] ✅ **HTTP/2** enabled on hosting
- [ ] ✅ **CDN** configured (automatic on Vercel/Netlify)

**Test with:**

```bash
# Lighthouse CI
pnpm add -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000

# Bundle analysis
pnpm analyze
```

---

### Accessibility Checklist

- [ ] ✅ **All UI reachable by keyboard** (test with Tab key)
- [ ] ✅ **Focus states visible** and properly managed
- [ ] ✅ **Color contrast ≥ 4.5:1** (use browser DevTools)
- [ ] ✅ **Forms have proper labels** and error handling
- [ ] ✅ **ARIA attributes** correctly implemented
- [ ] ✅ **Screen reader testing** completed (NVDA, JAWS, VoiceOver)
- [ ] ✅ **Touch targets ≥ 44×44px** on mobile
- [ ] ✅ **Semantic HTML** (header, nav, main, footer)
- [ ] ✅ **Alt text** for all images
- [ ] ✅ **Reduced motion** support for animations

**Test with:**

- Chrome DevTools > Lighthouse > Accessibility audit
- axe DevTools browser extension
- Screen reader (VoiceOver on Mac, NVDA on Windows)

---

### Security Checklist

- [ ] ✅ **HTTPS enforced** with HSTS headers
- [ ] ✅ **CSP headers** configured (check `next.config.ts`)
- [ ] ✅ **Cookies secure** (HttpOnly, Secure, SameSite)
- [ ] ✅ **No secrets in client-side code** (check .env files)
- [ ] ✅ **Dependencies scanned** for vulnerabilities (`pnpm audit`)
- [ ] ✅ **Input validation** on all forms
- [ ] ✅ **Output escaping** to prevent XSS
- [ ] ✅ **CSRF protection** enabled (if using forms/API)
- [ ] ✅ **Rate limiting** on API routes (if applicable)

**Test with:**

```bash
# Security audit
pnpm audit
ppnpm audit --fix

# Check for outdated packages
pnpm outdated
```

---

### SEO Checklist

- [ ] ✅ **Meta titles optimized** (50-60 characters)
- [ ] ✅ **Meta descriptions** (150-160 characters)
- [ ] ✅ **Open Graph tags** configured (title, description, image)
- [ ] ✅ **Twitter Cards** configured
- [ ] ✅ **Sitemap.xml** generated and submitted
- [ ] ✅ **robots.txt** configured
- [ ] ✅ **Structured data** implemented (Schema.org)
- [ ] ✅ **Clean URLs** (semantic, no query params)
- [ ] ✅ **Mobile-first** responsive design
- [ ] ✅ **Page speed optimized** (Core Web Vitals)
- [ ] ✅ **Internal linking** structure
- [ ] ✅ **Canonical URLs** set

**Test with:**

- Google Search Console
- Google Rich Results Test
- Lighthouse SEO audit

---

### UX/UI Checklist

- [ ] ✅ **Loading states** implemented (spinners, skeletons)
- [ ] ✅ **Error states** handled gracefully (friendly messages)
- [ ] ✅ **Empty states** designed (when no data)
- [ ] ✅ **Responsive design** tested (mobile, tablet, desktop)
- [ ] ✅ **Dark/light mode** implemented and tested
- [ ] ✅ **Motion respects user preferences** (prefers-reduced-motion)
- [ ] ✅ **Consistent design system** (colors, typography, spacing)
- [ ] ✅ **Forms have validation** (inline errors, success messages)
- [ ] ✅ **404 page** customized
- [ ] ✅ **Cross-browser testing** (Chrome, Firefox, Safari, Edge)

---

## 🎨 Customization Guide

### Theming & Branding

#### Update Theme Colors

Edit `src/lib/theme.ts`:

```typescript
export const getTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#YOUR_PRIMARY_COLOR', // Change to client brand color
      },
      secondary: {
        main: '#YOUR_SECONDARY_COLOR',
      },
      // ... more colors
    },
    typography: {
      fontFamily: '"YOUR_FONT", "Roboto", "Arial", sans-serif',
    },
  });
};
```

#### Update Fonts

1. **Google Fonts** (recommended):

```typescript
// src/pages/_document.tsx
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

2. **Custom Fonts**:

```css
/* src/styles/globals.css */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

#### Update Logo & Assets

Replace placeholder files in `public/`:

- `public/favicon.ico` - Browser favicon
- `public/icons/icon.svg` - App icon (used in PWA manifest)
- `public/og-image.svg` - Social media preview image (replace with 1200×630 JPG/PNG for best compatibility)

---

### Adding New Pages

```bash
# 1. Create page file
# src/pages/about.tsx

# 2. Add translations
# public/locales/en/about.json
# public/locales/es/about.json
# ... (all languages)

# 3. Add to navigation
# Update src/components/layout/Header.tsx

# 4. Add SEO meta tags
# Use next/head in the page component
```

Example page:

```typescript
// src/pages/about.tsx
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation('about');

  return (
    <>
      <Head>
        <title>{t('title')} | Your Company</title>
        <meta name="description" content={t('description')} />
      </Head>
      <main>
        <h1>{t('heading')}</h1>
        <p>{t('content')}</p>
      </main>
    </>
  );
}
```

---

### Adding New Languages

```bash
# 1. Create translation directory
mkdir public/locales/it

# 2. Copy English translations as template
cp public/locales/en/*.json public/locales/it/

# 3. Translate all JSON files
# public/locales/it/common.json
# public/locales/it/navigation.json
# ... etc

# 4. Register language in i18n config
# Edit src/lib/i18n.ts
```

```typescript
// src/lib/i18n.ts
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ar', 'it'], // Add 'it'
  // ... rest of config
});
```

---

### Integrating Backend APIs

#### Using React Query

```typescript
// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });
};
```

#### Creating API Routes

```typescript
// src/pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Fetch from database or external API
    const users = await fetchUsersFromDB();
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

### Adding Third-Party Integrations

#### Google Analytics

```typescript
// src/pages/_app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // ... rest of component
}
```

```typescript
// src/pages/_document.tsx
<Head>
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}');
      `,
    }}
  />
</Head>
```

#### Stripe Payments

```bash
pnpm add @stripe/stripe-js stripe
```

```typescript
// src/lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

---

### Database Integration

#### Prisma (Recommended)

```bash
pnpm add prisma @prisma/client
npx prisma init

# Define schema in prisma/schema.prisma
# Generate client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

#### Supabase

```bash
pnpm add @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Build Errors

**Issue**: `Module not found` errors

```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules package-lock.json
pnpm install
pnpm dev
```

**Issue**: TypeScript errors during build

```bash
# Solution: Run type check to see specific errors
pnpm type-check

# Fix errors or temporarily bypass (not recommended)
# Edit tsconfig.json: "strict": false
```

---

#### Deployment Failures

**Issue**: Build fails on Vercel/Netlify but works locally

```bash
# Common causes:
# 1. Environment variables not set on platform
# 2. Node version mismatch
# 3. Missing dependencies

# Solutions:
# 1. Check build logs for specific error
# 2. Ensure package.json engines matches platform
# 3. Set all required env vars in platform dashboard
# 4. Test production build locally:
pnpm build
pnpm start
```

**Issue**: Tests fail in src/pages directory

```bash
# Solution: Tests should be in __tests__/ directory
# Move test files:
mv src/pages/__tests__/*.test.tsx __tests__/pages/

# Update imports in test files
# Change: import Component from '../Component'
# To: import Component from '../../src/pages/Component'
```

---

#### Performance Issues

**Issue**: Slow page loads

```bash
# Solutions:
# 1. Analyze bundle size
pnpm analyze

# 2. Check for large images (compress with tinypng.com)
# 3. Implement code splitting
# 4. Use dynamic imports for heavy components

# Example dynamic import:
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

**Issue**: Large bundle size

```bash
# Identify large dependencies
pnpm analyze

# Remove unused imports
# Use tree-shaking-friendly libraries
# Consider lighter alternatives:
# - date-fns instead of moment
# - preact instead of react (for simple sites)
```

---

#### i18n Issues

**Issue**: Translations not loading

```bash
# Check:
# 1. Translation files exist in public/locales/[lang]/
# 2. Namespace matches in code and file name
# 3. i18n initialized in _app.tsx

# Debug:
# Add to src/lib/i18n.ts:
i18n.init({
  debug: true,  // Shows loading errors
  // ... rest of config
});
```

**Issue**: Language not persisting

```bash
# Ensure language is saved to localStorage/cookies
# Check browser console for errors
# Verify i18n configuration includes persistence
```

---

#### EmailJS Issues

**Issue**: Emails not sending

```bash
# Check:
# 1. Environment variables are set correctly
# 2. EmailJS service is active
# 3. Template ID matches
# 4. Public key is valid
# 5. Check browser console for errors

# Test with minimal setup:
import emailjs from '@emailjs/browser';

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
emailjs.send(
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  { message: 'Test' }
).then(
  () => console.log('✅ Email sent'),
  (error) => console.error('❌ Error:', error)
);
```

---

#### Dark Mode Issues

**Issue**: Flash of unstyled content (FOUC) on load

```bash
# Solution: Implement dark mode with no-flash script
# Add to src/pages/_document.tsx before <Head>
```

```typescript
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(theme);
      })();
    `,
  }}
/>
```

---

### Getting Help

**Resources:**

- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 📚 [Material UI Documentation](https://mui.com/)
- 📚 [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- 📚 [React Query Documentation](https://tanstack.com/query/latest)

**Community Support:**

- Stack Overflow (tag: next.js, material-ui, typescript)
- Next.js Discord
- GitHub Discussions on this repository

**Debugging Tools:**

- React DevTools (browser extension)
- Redux DevTools (if using Redux)
- Next.js built-in error overlay
- Browser DevTools (Console, Network, Performance)

---

## 📚 Additional Documentation

### Project-Specific Guides

- **[BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)** - Complete Git workflow documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed Vercel deployment instructions
- **[DEPLOYMENT_GUIDE_NETLIFY.md](./DEPLOYMENT_GUIDE_NETLIFY.md)** - Detailed Netlify deployment instructions
- **[MCP_SETUP_GUIDE.md](./MCP_SETUP_GUIDE.md)** - Figma MCP and agentic AI setup
- **[MCP_QUICK_REFERENCE.md](./MCP_QUICK_REFERENCE.md)** - MCP quick reference card
- **[docs/compliance.md](./docs/compliance.md)** - ISO 25010 & ISO 27001 compliance matrix
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[SECURITY.md](./SECURITY.md)** - Security policy

### Code Standards

- **TypeScript**: Strict mode (20+ flags) — no `any` types, prefer `unknown` when type is truly unknown
- **ESLint**: Flat config (`eslint.config.mjs`) with jsx-a11y; no warnings in production builds
- **Prettier**: Auto-format on save (configure in your editor)
- **Naming Conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Hooks: camelCase with `use` prefix (`useAuth.ts`)
  - Utils: camelCase (`formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Accessibility Guidelines

- Test with keyboard navigation (Tab, Shift+Tab, Enter, Space, Esc)
- Verify screen reader compatibility (VoiceOver, NVDA, JAWS)
- Ensure proper color contrast (use browser DevTools)
- Implement ARIA where semantic HTML isn't sufficient
- Test with browser extensions (axe, WAVE)

### Performance Guidelines

- Optimize images (WebP/AVIF, lazy loading, responsive sizes)
- Implement proper caching strategies
- Monitor bundle size (`pnpm analyze`)
- Use code splitting for routes and heavy components
- Test with Lighthouse and Web Vitals

---

## 🤝 Contributing

Improvements and contributions are welcome!

### How to Contribute

1. **Fork** this repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all quality checks pass (`pnpm type-check`, `pnpm lint`, `pnpm test`)
- Add accessibility considerations
- Include performance impact analysis

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

Free to use for client projects, commercial products, and prototypes.

---

## 🙏 Acknowledgments

Built with these amazing technologies:

- [Next.js](https://nextjs.org/) - The React Framework
- [Material UI](https://mui.com/) - React UI Components
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with Types
- [AWS Amplify](https://docs.amplify.aws/) - Auth, Data, Storage Backend
- [i18next](https://www.i18next.com/) - Internationalization Framework
- [React Query](https://tanstack.com/query) - Data Synchronization
- [EmailJS](https://www.emailjs.com/) - Email Integration
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: [Open an issue](https://github.com/saga95/next-web-site-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/saga95/next-web-site-template/discussions)
- **Email**: Create an [issue](https://github.com/saga95/next-web-site-template/issues)

---

**Built with ❤️ for modern web development**

_Ready for production use with industry best practices baked in._

_Last Updated: April 2026_
