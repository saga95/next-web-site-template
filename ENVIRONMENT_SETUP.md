# Environment Management Quick Start

## 🚀 Quick Setup

### 1. Initial Setup
```bash
# Run the setup script
./scripts/setup-env.sh

# Or manually:
cp .env.example .env.local
# Edit .env.local with your values
```

### 2. Create Standard Branches
```bash
# Create development and staging branches
git checkout -b development
git push -u origin development

git checkout main
git checkout -b staging
git push -u origin staging
```

### 3. Configure Deployment Platform

#### Vercel
1. Go to **Project Settings → Environment Variables**
2. Add variables for each environment:
   - **Production** (main branch): Use `.env.production` values
   - **Preview** (staging branch): Use `.env.staging` values  
   - **Development**: Use `.env.development` values

#### Netlify
1. Go to **Site Settings → Build & deploy → Environment**
2. Set **Production branch** to `main`
3. Enable **Branch deploys** for `staging` and `development`
4. Add environment variables for each context

#### AWS Amplify
1. Create separate apps or use branch-based deployment
2. Configure environment variables per branch
3. Set build settings for each environment

## 📁 File Structure

```
my-next-template/
├── .env.example          # Template with all possible variables
├── .env.development      # Development defaults (committed)
├── .env.staging          # Staging defaults (committed)
├── .env.production       # Production structure (committed, no secrets)
├── .env.local            # Your local values (gitignored)
├── .env.development.local # Local dev overrides (gitignored)
└── .env.test.local       # Test overrides (gitignored)
```

## 🌳 Branch Overview

```
main (production)
  ├── staging (pre-production)
  └── development
      ├── feature/user-auth
      ├── feature/dashboard
      └── bugfix/login-error
```

## 🔑 Environment Variable Usage

### In Code
```typescript
import { config, isDevelopment, isProduction } from '@/lib/env'

// Use typed config
const apiUrl = config.api.url
const appName = config.app.name

// Environment checks
if (isDevelopment()) {
  console.log('Debug info')
}

if (isProduction()) {
  // Initialize analytics
}
```

### Feature Flags
```typescript
// Check if feature is enabled
if (config.features.analytics) {
  initializeAnalytics()
}

if (config.features.pwa) {
  registerServiceWorker()
}
```

## 🔄 Common Workflows

### Starting New Feature
```bash
git checkout development
git pull origin development
git checkout -b feature/my-feature

# Develop with local environment
npm run dev

# Commit and create PR
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Create PR to development
```

### Deploying to Staging
```bash
# Merge development to staging
git checkout staging
git pull origin staging
git merge development
git push origin staging

# Staging auto-deploys
```

### Deploying to Production
```bash
# Create release branch
git checkout development
git checkout -b release/v1.0.0

# Final testing and prep
npm version minor
# Update CHANGELOG.md

# Merge to main
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags

# Production auto-deploys
```

## 🔒 Security Best Practices

### ✅ DO
- Use `.env.local` for local secrets
- Set secrets in deployment platform
- Use different credentials per environment
- Rotate secrets regularly
- Use `NEXT_PUBLIC_` prefix for client-side vars only

### ❌ DON'T
- Commit `.env.local` or any file with real secrets
- Use production credentials in development
- Share secrets in code or chat
- Use the same API keys across environments
- Expose server-side variables to client

## 📊 Environment Variables Checklist

### Development
- [ ] `.env.local` created
- [ ] Local API running or pointing to dev API
- [ ] Test credentials configured
- [ ] Feature flags set for testing

### Staging
- [ ] Staging branch created
- [ ] Staging environment variables set
- [ ] Staging API/database configured
- [ ] Analytics with test/staging IDs
- [ ] Error tracking enabled

### Production
- [ ] Production branch protected
- [ ] Production secrets set in platform
- [ ] Production API/database configured
- [ ] Real analytics IDs configured
- [ ] Monitoring and alerts enabled
- [ ] Backup strategy in place

## 🆘 Troubleshooting

### Variables Not Loading
```bash
# 1. Check file name
ls -la .env*

# 2. Restart dev server
npm run dev

# 3. Clear Next.js cache
rm -rf .next

# 4. Check .gitignore
cat .gitignore | grep env
```

### Wrong Environment
```bash
# Check current environment
node -e "console.log(process.env.NODE_ENV)"

# Check loaded variables
node -e "console.log(process.env)"
```

### Deployment Issues
1. Verify environment variables in platform settings
2. Check build logs for missing variables
3. Ensure branch names match platform configuration
4. Verify API endpoints are accessible from platform

## 📚 Additional Resources

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Detailed branching strategy
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

## 🎯 Quick Reference

### Branch → Environment Mapping
| Branch | Environment | Auto-Deploy | URL Example |
|--------|-------------|-------------|-------------|
| `main` | Production | ✅ Yes | yourapp.com |
| `staging` | Staging | ✅ Yes | staging.yourapp.com |
| `development` | Development | ✅ Yes | dev.yourapp.com |
| `feature/*` | Preview | ⚠️ Optional | preview-xyz.yourapp.com |

### Environment Variable Prefixes
| Prefix | Available | Example |
|--------|-----------|---------|
| `NEXT_PUBLIC_` | Client & Server | `NEXT_PUBLIC_API_URL` |
| No prefix | Server Only | `DATABASE_URL` |

### File Load Priority
1. `.env.{environment}.local` (highest)
2. `.env.local`
3. `.env.{environment}`
4. `.env`

---

**Need Help?** Check [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for detailed workflows and examples.
