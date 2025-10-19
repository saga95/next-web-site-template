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
- **npm/yarn/pnpm** (npm 9+ preferred)
- **Git** with SSH or HTTPS access
- **Basic knowledge of**: Next.js, React, TypeScript, Material UI

### Initial Setup (5 minutes)

```bash
# 1. Fork or clone this repository
git clone https://github.com/saga95/next-web-site-template.git my-project-name
cd my-project-name

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.development .env.local

# 4. Configure EmailJS (optional for contact forms)
# Sign up at https://www.emailjs.com/ and add your keys to .env.local
# NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
# NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
# NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

### First Steps Checklist

After running `npm run dev`, verify:

- [ ] ✅ Server running on http://localhost:3000
- [ ] 🎨 Page displays with Material UI theme
- [ ] 🌍 Language switcher works (EN/ES/FR/DE/JA/ZH/AR)
- [ ] 🌓 Dark/light mode toggle functions
- [ ] 📧 Contact form submits (if EmailJS configured)
- [ ] 📝 No console errors in browser DevTools

**🎉 You're ready to start developing!**

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
# Fetch latest changes from upstream
git fetch upstream

# Check what's new
git log upstream/main --oneline

# Merge updates (preferably on a branch first)
git checkout -b update/sync-template
git merge upstream/main

# Resolve conflicts carefully - test thoroughly!
npm install  # Update dependencies
npm run dev  # Verify locally
npm run build  # Ensure build works
npm run test  # Run test suite

# Push and create PR for review
git push origin update/sync-template
```

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

- 🔍 **Dynamic Meta Tags** - Title, description, Open Graph
- 🗺️ **Sitemap Generation** - Automatic sitemap.xml
- 🤖 **robots.txt** - Search engine directives
- 📊 **Structured Data** - Schema.org implementation
- 🌐 **Open Graph** - Social media optimization
- 🐦 **Twitter Cards** - Twitter-specific metadata
- 📱 **Mobile-First** - Responsive and mobile-optimized

### Internationalization (i18n)

- 🌍 **7 Languages Supported** - EN, ES, FR, DE, JA, ZH, AR
- 🔄 **Dynamic Language Switching** - Runtime locale changes
- 🌐 **RTL Support** - Right-to-left language layouts
- 📅 **Locale-aware Formatting** - Dates, numbers, currencies
- 🏷️ **Namespaced Translations** - Organized by feature
- 💾 **Persistence** - Language preference saved

### Developer Experience

- 📝 **TypeScript** - Strict type checking enabled
- 🧪 **Testing Suite** - Jest + React Testing Library + Playwright ready
- 📏 **ESLint** - Comprehensive linting rules
- 💅 **Prettier** - Automatic code formatting
- 🐶 **Husky** - Git hooks for quality assurance
- 🔧 **Development Tools** - Hot reload, debugging, profiling
- 📊 **Bundle Analyzer** - Visualize bundle composition
- 🤖 **MCP Configuration** - Agentic AI development with Figma, GitHub, Git, and Filesystem integration (see [MCP Setup Guide](./MCP_SETUP_GUIDE.md))

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
│   └── workflows/             # CI/CD workflows (currently disabled)
├── .next/                     # Next.js build output (gitignored)
├── __tests__/                 # Test files (root level)
│   ├── components/           # Component tests
│   ├── hooks/                # Hook tests
│   └── pages/                # Page tests
├── node_modules/              # Dependencies (gitignored)
├── public/                    # Static assets
│   ├── locales/              # Translation JSON files
│   │   ├── en/              # English translations
│   │   ├── es/              # Spanish translations
│   │   ├── fr/              # French translations
│   │   ├── de/              # German translations
│   │   ├── ja/              # Japanese translations
│   │   ├── zh/              # Chinese translations
│   │   └── ar/              # Arabic translations
│   ├── favicon.ico
│   └── images/              # Image assets
├── scripts/                   # Deployment and utility scripts
│   ├── deploy-vercel.sh     # Vercel deployment helper
│   └── deploy-netlify.sh    # Netlify deployment helper
├── src/                       # Source code
│   ├── components/           # Reusable React components
│   │   ├── common/          # Shared components (Button, Input, etc.)
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   └── forms/           # Form components
│   ├── hooks/                # Custom React hooks
│   │   ├── useTranslation.ts
│   │   ├── useTheme.ts
│   │   └── useAuth.ts
│   ├── lib/                  # Utilities and configurations
│   │   ├── theme.ts         # Material UI theme configuration
│   │   ├── i18n.ts          # i18next configuration
│   │   ├── emailjs.ts       # EmailJS utilities
│   │   └── utils.ts         # Common utilities
│   ├── pages/                # Next.js pages (file-based routing)
│   │   ├── _app.tsx         # Custom App component
│   │   ├── _document.tsx    # Custom Document component
│   │   ├── index.tsx        # Home page
│   │   └── api/             # API routes
│   │       └── hello.ts     # Example API endpoint
│   ├── styles/               # Global styles
│   │   ├── globals.css      # Global CSS
│   │   └── Home.module.css  # Module CSS example
│   └── types/                # TypeScript type definitions
│       ├── index.ts         # Global types
│       └── api.ts           # API types
├── .env.development           # Development environment variables
├── .env.staging               # Staging environment variables
├── .env.production            # Production environment structure
├── .env.vercel                # Vercel-specific guide
├── .env.netlify               # Netlify-specific guide
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── jest.config.js            # Jest testing configuration
├── jest.setup.ts             # Jest setup file
├── netlify.toml              # Netlify deployment config
├── next.config.ts            # Next.js configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment config
├── BRANCHING_STRATEGY.md     # Git workflow documentation
├── DEPLOYMENT_GUIDE.md       # Vercel deployment guide
├── DEPLOYMENT_GUIDE_NETLIFY.md  # Netlify deployment guide
└── ENVIRONMENT_SETUP.md      # Environment variables guide
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
**Shared State**: React Context API for theme, i18n, auth
**Server State**: React Query for API data fetching and caching
**Form State**: React Hook Form for complex forms

### Styling Approach

- **Material UI Components**: Pre-styled, accessible components
- **Emotion CSS-in-JS**: Component-scoped styling
- **Global Styles**: `globals.css` for resets and utilities
- **Theming**: Centralized theme in `src/lib/theme.ts`
- **Dark Mode**: System preference detection + manual toggle

---

## ⚙️ Development Workflow

### Daily Development Commands

```bash
# Start development server (hot reload enabled)
npm run dev

# Type checking (run before committing)
npm run type-check

# Linting (run before committing)
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/components/Button.test.tsx

# Build for production (test locally)
npm run build

# Start production server locally
npm run start

# Analyze bundle size
npm run analyze
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
npm run type-check  # ✅ No TypeScript errors
npm run lint        # ✅ No linting errors
npm run test        # ✅ All tests pass
npm run build       # ✅ Build succeeds
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
npm uninstall @tanstack/react-query
# Remove from src/pages/_app.tsx

# 2. Remove Recharts (if no charts)
npm uninstall recharts
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

# 2. Add authentication
# Install NextAuth.js or Auth0
npm install next-auth

# 3. Create protected routes
# src/pages/admin/
#   ├── index.tsx (dashboard)
#   ├── users.tsx (user management)
#   ├── content.tsx (content management)
#   └── analytics.tsx (analytics dashboard)

# 4. Add data tables and forms
# Use Material UI DataGrid
npm install @mui/x-data-grid

# 5. Integrate backend API
# Configure React Query for data fetching
# Add API routes in src/pages/api/

# 6. Deploy with restricted access
# Configure Vercel/Netlify authentication
```

#### Backoffice Checklist

**Essential Features:**
- [ ] ✅ Authentication (NextAuth, Auth0, or custom)
- [ ] ✅ Role-based access control (admin, editor, viewer)
- [ ] ✅ Protected routes (redirect if unauthorized)
- [ ] ✅ User management interface
- [ ] ✅ Data tables (sorting, filtering, pagination)
- [ ] ✅ CRUD operations (Create, Read, Update, Delete)
- [ ] ✅ Form validation (React Hook Form + Zod)
- [ ] ✅ API integration (REST or GraphQL)
- [ ] ✅ Error handling and logging
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

#### Authentication Setup Example

```typescript
// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials against your backend
        const user = await validateUser(credentials);
        if (user) {
          return user;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session(session, token) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
});
```

```typescript
// src/components/ProtectedRoute.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const ProtectedRoute: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return session ? <>{children}</> : null;
};
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
- ❌ Authentication (use hardcoded "logged in" state)
- ❌ Complex animations
- ❌ Edge case handling
- ❌ Production-grade error handling
- ❌ Comprehensive testing

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
const saveData = (data) => {
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

| Branch | Environment | URL Pattern |
|--------|-------------|-------------|
| `main` | Production | `https://yourapp.com` |
| `staging` | Staging | `https://staging.yourapp.com` |
| `development` | Development | `https://dev.yourapp.com` |

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
npm install -g vercel

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
npm install -g netlify-cli

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
npm run build

# 2. Deploy via AWS Amplify Console:
#    - Go to AWS Amplify Console
#    - Click "New app" > "Host web app"
#    - Connect GitHub repository
#    - Configure build settings:
#      - Build command: npm run build
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
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

**📚 Complete Guide**: See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

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

**GitHub Actions** workflow is included but currently **disabled** (`.github/workflows/ci-cd.yml.disabled`).

To enable:
```bash
# Rename to activate
mv .github/workflows/ci-cd.yml.disabled .github/workflows/ci-cd.yml

# Workflow will run on push to main/staging/development
# - Type checking
# - Linting
# - Tests
# - Build verification
```

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
- [ ] ✅ **Bundle analysis** reviewed (`npm run analyze`)
- [ ] ✅ **HTTP/2** enabled on hosting
- [ ] ✅ **CDN** configured (automatic on Vercel/Netlify)

**Test with:**
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000

# Bundle analysis
npm run analyze
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
- [ ] ✅ **Dependencies scanned** for vulnerabilities (`npm audit`)
- [ ] ✅ **Input validation** on all forms
- [ ] ✅ **Output escaping** to prevent XSS
- [ ] ✅ **CSRF protection** enabled (if using forms/API)
- [ ] ✅ **Rate limiting** on API routes (if applicable)

**Test with:**
```bash
# Security audit
npm audit
npm audit fix

# Check for outdated packages
npm outdated
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
        main: '#YOUR_PRIMARY_COLOR',  // Change to client brand color
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

#### Update Logo

Replace files in `public/`:
- `public/logo.svg` - Main logo
- `public/favicon.ico` - Browser favicon
- `public/apple-touch-icon.png` - iOS home screen icon
- `public/og-image.png` - Social media preview image (1200x630px)

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
npm install @stripe/stripe-js stripe
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
npm install prisma @prisma/client
npx prisma init

# Define schema in prisma/schema.prisma
# Generate client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

#### Supabase

```bash
npm install @supabase/supabase-js
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
npm install
npm run dev
```

**Issue**: TypeScript errors during build

```bash
# Solution: Run type check to see specific errors
npm run type-check

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
npm run build
npm run start
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
npm run analyze

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
npm run analyze

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
- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment variable management
- **[BRANCHES_CREATED.md](./BRANCHES_CREATED.md)** - Current branch status and next steps

### Code Standards

- **TypeScript**: Use strict mode, define types for all props and functions
- **ESLint**: Follow configuration, no warnings in production builds
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
- Monitor bundle size (`npm run analyze`)
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
- Ensure all quality checks pass (`npm run type-check`, `npm run lint`, `npm run test`)
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
- [i18next](https://www.i18next.com/) - Internationalization Framework
- [React Query](https://tanstack.com/query) - Data Synchronization
- [EmailJS](https://www.emailjs.com/) - Email Integration
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Open an issue](https://github.com/saga95/next-web-site-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/saga95/next-web-site-template/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ for modern web development**

*Ready for production use with industry best practices baked in.*

*Last Updated: October 2025*
