# Next.js Enterprise Template

> **A battle-tested, production-ready foundation for building client projects and rapid prototypes**

This template is designed for **forking and customization** to build:
- 🏢 **Client Marketing Sites** - SEO-optimized, accessible web presence
- 🔐 **Backoffice Applications** - Admin dashboards, content management
- ⚡ **Rapid Prototypes** - MVP validation and proof-of-concepts
- 🌐 **Multi-tenant SaaS** - Scalable multi-client applications

Built with enterprise-grade features, comprehensive documentation, and deployment-ready configurations for Vercel, Netlify, and AWS Amplify.



## 🚀 Features## 🚀 Features



### Core Stack### Performance (Core Web Vitals Optimized)

- **Next.js 14.2** - React framework with SSR/SSG- ⚡ **LCP ≤ 2.5s**: Optimized loading performance

- **TypeScript 5** - Type-safe development- 🎯 **INP < 200ms**: Excellent interactivity

- **React 18.2** - Latest React features- 📐 **CLS < 0.1**: Stable visual layout

- **Material UI v6** - Comprehensive component library- 📦 **Code Splitting**: Automatic and manual code splitting

- **React Query v4** - Data fetching and caching- 🖼️ **Image Optimization**: AVIF/WebP with responsive srcsets

- **React Hook Form** - Performant form validation- 🗜️ **Bundle Analysis**: Built-in bundle analyzer

- **Zod** - Runtime type validation- 🏎️ **HTTP/2+ Ready**: Server compression and CDN optimized



### Internationalization### Accessibility (WCAG 2.2 AA Compliant)

- **i18next** + **react-i18next** - Full i18n support- ♿ **Semantic HTML**: Proper landmarks and structure

- Multiple languages: EN, ES, FR, DE, JA, ZH, AR- ⌨️ **Keyboard Navigation**: Full keyboard accessibility

- Language detection and persistence- 🎨 **Focus Management**: Visible focus states and trapping

- RTL support ready- 🔗 **ARIA Support**: Comprehensive ARIA implementation

- 🌈 **Color Contrast**: 4.5:1 contrast ratio compliance

### Communication & Utilities- 🎭 **Screen Reader Support**: Live regions and announcements

- **EmailJS** - Email integration without backend- 📱 **Touch Targets**: 44×44px minimum size

- **Recharts** - Data visualization and charts

- **dayjs** - Modern date manipulation### Security

- **Emotion** - CSS-in-JS styling- 🛡️ **CSP Headers**: Content Security Policy

- 🔒 **HTTPS + HSTS**: Strict transport security

### Performance ⚡- 🍪 **Secure Cookies**: HttpOnly, Secure, SameSite

- ✅ Core Web Vitals optimized- 🏰 **CSRF Protection**: Cross-site request forgery protection

- ✅ Code splitting & tree shaking- 🔍 **Dependency Scanning**: Automated vulnerability checks

- ✅ Image optimization (AVIF/WebP)- 🚫 **XSS Protection**: Input sanitization and output escaping

- ✅ HTTP/2 headers

- ✅ Bundle analysis### SEO & Metadata

- 🔍 **Dynamic Meta Tags**: Title, description, Open Graph

### Accessibility ♿ (WCAG 2.2 AA)- 🗺️ **Sitemap Generation**: Automatic sitemap.xml

- ✅ Semantic HTML & ARIA- 🤖 **robots.txt**: Search engine directives

- ✅ Keyboard navigation- 📊 **Structured Data**: Schema.org implementation

- ✅ 44×44px touch targets- 🌐 **Open Graph**: Social media optimization

- ✅ Color contrast compliance- 🐦 **Twitter Cards**: Twitter-specific metadata

- ✅ Screen reader support- 📱 **Mobile-First**: Responsive and mobile-optimized

- ✅ Reduced motion support

### Developer Experience

### Security 🔒- 📝 **TypeScript**: Strict type checking

- ✅ CSP headers- 🎨 **Tailwind CSS**: Utility-first styling with design tokens

- ✅ HSTS- 🧪 **Testing**: Jest + React Testing Library + Playwright

- ✅ XSS protection- 📏 **ESLint**: Comprehensive linting rules

- ✅ Clickjacking protection- 💅 **Prettier**: Code formatting

- ✅ Referrer policy- 🐶 **Husky**: Git hooks for quality assurance

- 🔧 **Development Tools**: Hot reload, debugging, profiling

### SEO 🔍

- ✅ Meta tags### Internationalization

- ✅ Open Graph- 🌍 **i18n Ready**: Multi-language support

- ✅ Sitemap & Robots.txt- 📅 **Date/Number Formatting**: Locale-aware formatting

- ✅ Semantic markup- 🔄 **RTL Support**: Right-to-left language support

- 🏷️ **Language Switching**: Dynamic locale switching

## 📋 Quick Start

### Progressive Web App (PWA)

```bash- 📱 **Web App Manifest**: App-like experience

# Install dependencies- ⚡ **Service Worker**: Offline functionality

npm install- 📴 **Offline Fallback**: Graceful offline handling

- 🏠 **Add to Home Screen**: Native app feel

# Create environment file

cp .env.example .env.local## 🏗️ Architecture



# Start development### Project Structure

npm run dev```

```src/

├── components/          # Reusable UI components

## 🔧 Environment Variables├── hooks/              # Custom React hooks

├── lib/                # Utility functions and configurations

```env├── pages/              # Next.js pages (App Router)

# EmailJS (get from https://www.emailjs.com/)├── styles/             # Global styles and Tailwind config

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id├── types/              # TypeScript type definitions

NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id└── utils/              # Helper functions

NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key```

```

### Design System

## 📁 Project Structure- **Design Tokens**: Consistent spacing, colors, typography

- **Component Variants**: Using class-variance-authority

```- **Dark Mode**: System preference with manual toggle

src/- **Responsive Design**: Mobile-first approach

├── components/     # Reusable components- **Accessibility**: Built-in WCAG compliance

├── lib/           # Utilities & configs

│   ├── theme.ts   # Material UI theme## 🚀 Quick Start

│   ├── i18n.ts    # i18n config

│   ├── emailjs.ts # Email utilities### Prerequisites

│   └── utils.ts   # Common utilities- Node.js 18+ 

├── pages/         # Next.js pages- npm/yarn/pnpm

├── styles/        # Global styles

└── types/         # TypeScript types### Installation

```bash

public/git clone <your-repo>

└── locales/       # Translation filescd my-next-template

    └── en/npm install

        ├── common.json```

        ├── navigation.json

        └── forms.json### Development

``````bash

npm run dev          # Start development server

## 🎨 Themingnpm run build        # Build for production

npm run start        # Start production server

Material UI themes with light/dark mode:npm run lint         # Run ESLint

npm run type-check   # TypeScript type checking

```typescriptnpm run test         # Run tests

import { getTheme } from '@/lib/theme';```



const theme = getTheme('light'); // or 'dark'### Quality Assurance

``````bash

npm run lint         # Check linting

## 🌍 Using i18nnpm run type-check   # TypeScript validation

npm run test         # Unit tests

```typescriptnpm run test:e2e     # E2E tests (when configured)

import { useTranslation } from 'react-i18next';npm audit            # Security audit

```

function MyComponent() {

  const { t } = useTranslation('common');## 📋 Quality Checklist

  return <h1>{t('welcome')}</h1>;

}### Performance ✅

```- [ ] LCP ≤ 2.5s on 4G/low-end CPU

- [ ] INP < 200ms for all interactions

## 📧 Sending Emails- [ ] CLS < 0.1 on page load

- [ ] Initial JS bundle < 300 KB gzipped

```typescript- [ ] Images optimized and lazy-loaded

import { sendEmail } from '@/lib/emailjs';- [ ] Code splitting implemented

- [ ] Bundle analysis reviewed

await sendEmail({

  from_name: 'John',### Accessibility ✅

  from_email: 'john@example.com',- [ ] All UI reachable by keyboard

  message: 'Hello!',- [ ] Focus states visible and managed

});- [ ] Color contrast ≥ 4.5:1

```- [ ] Forms have proper labels and error handling

- [ ] ARIA attributes correctly implemented

## 📊 Charts with Recharts- [ ] Screen reader testing completed

- [ ] Touch targets ≥ 44×44px

```typescript

import { LineChart, Line } from 'recharts';### Security ✅

- [ ] HTTPS enforced with HSTS

<LineChart data={data}>- [ ] CSP headers configured

  <Line dataKey="value" />- [ ] Cookies secure (HttpOnly/Secure/SameSite)

</LineChart>- [ ] No secrets in client-side code

```- [ ] Dependencies scanned for vulnerabilities

- [ ] Input validation and output escaping

## 🚀 Deployment- [ ] CSRF protection enabled



### Vercel### SEO ✅

```bash- [ ] Meta titles and descriptions optimized

vercel- [ ] Open Graph and Twitter cards configured

```- [ ] Sitemap.xml generated

- [ ] robots.txt configured

### Netlify- [ ] Structured data implemented

```bash- [ ] Clean, semantic URLs

npm run build- [ ] Mobile-first responsive design

# Deploy .next folder

```### UX/UI ✅

- [ ] Loading states implemented

### AWS Amplify- [ ] Error states handled gracefully

Configure build settings in the console- [ ] Empty states designed

- [ ] Responsive design tested

## 📝 Scripts- [ ] Dark/light mode implemented

- [ ] Motion respects user preferences

```bash- [ ] Consistent design system

npm run dev          # Start development

npm run build        # Build for production## 🔧 Configuration

npm start            # Start production server

npm run lint         # Check code quality### Environment Variables

npm run type-check   # TypeScript validationCreate `.env.local`:

``````bash

# Analytics

## 📚 DocumentationNEXT_PUBLIC_GA_ID=your-ga-id



- [Next.js Docs](https://nextjs.org/docs)# Error Tracking

- [Material UI Docs](https://mui.com/)NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

- [i18next Docs](https://www.i18next.com/)

- [EmailJS Docs](https://www.emailjs.com/docs/)# API Configuration

- [Recharts Docs](https://recharts.org/)NEXT_PUBLIC_API_URL=your-api-url

```

## 🎯 Standards Compliance

### Tailwind Configuration

✅ Performance: Core Web Vitals  The template includes a comprehensive Tailwind setup with:

✅ Accessibility: WCAG 2.2 AA  - Design tokens for consistent theming

✅ Security: OWASP Top 10  - Accessibility utilities

✅ SEO: Best practices  - Dark mode support

✅ Privacy: GDPR-ready  - Custom components

- Typography and form plugins

## 📄 License

### ESLint Configuration

MITStrict ESLint setup including:

- TypeScript rules

## 🤝 Contributing- React and React Hooks rules

- Accessibility rules (jsx-a11y)

Contributions welcome! Please open an issue or PR.- Performance best practices
- Security-focused rules

## 🚀 Deployment

This template is configured for deployment to multiple platforms with automated environment management.

### Quick Deploy - Vercel (Recommended)

**Option 1: Via Dashboard (Easiest)**
```bash
# Run the setup script
./scripts/deploy-vercel.sh
```
Then follow the interactive guide to deploy via Vercel dashboard.

**Option 2: Via CLI (Quick)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel
```

**📚 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete Vercel instructions**

---

### Quick Deploy - Netlify

**Option 1: Via Dashboard (Easiest)**
```bash
# Run the setup script
./scripts/deploy-netlify.sh
```
Then follow the interactive guide to deploy via Netlify dashboard.

**Option 2: Via CLI (Quick)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --build
```

**📚 See [DEPLOYMENT_GUIDE_NETLIFY.md](./DEPLOYMENT_GUIDE_NETLIFY.md) for complete Netlify instructions**

---

### AWS Amplify

```bash
# Build the project
npm run build

# Deploy via AWS Amplify Console
# 1. Connect your GitHub repository
# 2. Configure build settings:
#    - Build command: npm run build
#    - Output directory: .next
# 3. Set environment variables in Amplify console
# 4. Deploy!
```

### Environment Management

Each deployment platform supports our three-branch strategy:
- **main** → Production environment
- **staging** → Staging environment  
- **development** → Development environment

**Environment Files:**
- `.env.development` - Development defaults
- `.env.staging` - Staging defaults
- `.env.production` - Production structure
- `.env.vercel` - Vercel-specific guide
- `.env.netlify` - Netlify-specific guide

**📚 See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for environment configuration**

### Build Configuration
The template supports:
- Server-side rendering (SSR)
- Static site generation (SSG)
- Incremental Static Regeneration (ISR)
- API routes
- Automatic environment detection
- Branch-based deployments

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with custom utilities
- Utility function testing
- Accessibility testing

### Integration Tests
- User journey testing
- Form submission flows
- API integration testing
- Cross-browser compatibility

### E2E Tests (Optional Setup)
- Critical user paths
- Performance monitoring
- Visual regression testing
- Mobile device testing

## 📊 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Bundle analysis
- Lighthouse CI integration

### Error Tracking
- Sentry integration ready
- Error boundary implementation
- User feedback collection
- Performance issue alerting

### Analytics
- Google Analytics 4 ready
- Custom event tracking
- Conversion funnel analysis
- A/B testing framework ready

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation
4. Ensure accessibility compliance
5. Run quality checks before committing

## 📚 Documentation

### Project Documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete Vercel deployment guide
- **[DEPLOYMENT_GUIDE_NETLIFY.md](./DEPLOYMENT_GUIDE_NETLIFY.md)** - Complete Netlify deployment guide
- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment variable management
- **[BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)** - Git workflow and branching strategy
- **[TESTING.md](./TESTING.md)** - Testing setup and guidelines
- **[BRANCHES_CREATED.md](./BRANCHES_CREATED.md)** - Current branch status and next steps

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write self-documenting code
- Add JSDoc comments for complex functions

### Accessibility Guidelines
- Test with keyboard navigation
- Verify screen reader compatibility
- Ensure proper color contrast
- Implement ARIA where needed

### Performance Guidelines
- Optimize images and assets
- Implement proper caching strategies
- Monitor bundle size
- Use code splitting effectively

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Material UI](https://mui.com/)
- [i18next Documentation](https://www.i18next.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for modern web development. Ready for production use with industry best practices baked in.
