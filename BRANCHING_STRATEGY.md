# Branching Strategy & Environment Management

This template follows a **Git Flow** inspired branching strategy optimized for modern web development with clear environment separation.

## 🌳 Branch Structure

### Primary Branches

#### `main` (Production)
- **Environment:** Production
- **Purpose:** Production-ready code
- **Protection:** Protected, requires PR reviews
- **Deployment:** Auto-deploys to production (Vercel/Netlify/AWS Amplify)
- **Environment Variables:** `.env.production` or production secrets

#### `staging` (Pre-Production)
- **Environment:** Staging
- **Purpose:** Final testing before production
- **Protection:** Protected, requires PR reviews
- **Deployment:** Auto-deploys to staging environment
- **Environment Variables:** `.env.staging`

#### `development` (Development)
- **Environment:** Development
- **Purpose:** Integration branch for features
- **Protection:** Protected, requires PR reviews
- **Deployment:** Auto-deploys to dev environment
- **Environment Variables:** `.env.development`

### Supporting Branches

#### `feature/*` (Feature Development)
- **Created from:** `development`
- **Merges into:** `development`
- **Naming:** `feature/user-authentication`, `feature/dashboard-ui`
- **Purpose:** New features and enhancements
- **Lifespan:** Deleted after merge

#### `bugfix/*` (Bug Fixes)
- **Created from:** `development`
- **Merges into:** `development`
- **Naming:** `bugfix/login-error`, `bugfix/memory-leak`
- **Purpose:** Bug fixes for upcoming releases
- **Lifespan:** Deleted after merge

#### `hotfix/*` (Production Hotfixes)
- **Created from:** `main`
- **Merges into:** `main` AND `development`
- **Naming:** `hotfix/critical-security-patch`, `hotfix/payment-error`
- **Purpose:** Critical production bug fixes
- **Lifespan:** Deleted after merge

#### `release/*` (Release Preparation)
- **Created from:** `development`
- **Merges into:** `main` AND `development`
- **Naming:** `release/v1.2.0`, `release/v2.0.0`
- **Purpose:** Release preparation, final testing
- **Lifespan:** Deleted after merge

## 📁 Environment Files

### Local Development
```bash
.env.local              # Local development (gitignored)
.env.development.local  # Local dev overrides (gitignored)
.env.test.local         # Local test overrides (gitignored)
```

### Committed Templates (with example values)
```bash
.env.example            # Example template for all environments
.env.development        # Development environment defaults
.env.staging            # Staging environment defaults
.env.production         # Production environment defaults (no secrets!)
```

### File Priority (Next.js)
1. `.env.{environment}.local` (highest priority)
2. `.env.local`
3. `.env.{environment}`
4. `.env`

## 🔐 Environment Variables Management

### Public Variables (Client-side)
```bash
# Must start with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

### Private Variables (Server-side only)
```bash
# Never exposed to browser
DATABASE_URL=postgresql://...
API_SECRET_KEY=xxx
EMAILJS_PRIVATE_KEY=xxx
```

### Environment-Specific Variables

**Development (.env.development):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Staging (.env.staging):**
```bash
NEXT_PUBLIC_API_URL=https://api-staging.example.com
NEXT_PUBLIC_APP_URL=https://staging.example.com
NODE_ENV=production
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://example.com
NODE_ENV=production
```

## 🔄 Workflow Examples

### Feature Development Flow
```bash
# 1. Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/user-profile

# 2. Develop with local environment
cp .env.example .env.local
# Edit .env.local with your local values

# 3. Commit and push
git add .
git commit -m "feat: add user profile page"
git push origin feature/user-profile

# 4. Create PR to development
# PR is reviewed and merged

# 5. Development branch auto-deploys to dev environment
```

### Release Flow
```bash
# 1. Create release branch from development
git checkout development
git pull origin development
git checkout -b release/v1.2.0

# 2. Bump version, update changelog
npm version minor
# Update CHANGELOG.md

# 3. Test with staging environment
git push origin release/v1.2.0
# Manually deploy to staging for testing

# 4. Merge to main (production)
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 5. Merge back to development
git checkout development
git merge --no-ff release/v1.2.0
git push origin development

# 6. Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Hotfix Flow
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Fix the critical issue
# Make necessary changes

# 3. Commit and test
git add .
git commit -m "fix: critical security vulnerability"

# 4. Merge to main
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix: Security patch"
git push origin main --tags

# 5. Merge to development
git checkout development
git merge --no-ff hotfix/security-patch
git push origin development

# 6. Delete hotfix branch
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

## 🚀 Deployment Configuration

### Vercel
**Project Settings → Environment Variables:**

**Production (main branch):**
- Load from `.env.production`
- Add production secrets

**Preview (development, staging):**
- Load from `.env.staging` or `.env.development`
- Add staging secrets

**Development:**
- Load from `.env.development`
- Add dev secrets

### Netlify
**Site Settings → Build & deploy → Environment:**

**Production branch:** `main`
**Branch deploys:** `development`, `staging`

Configure environment variables per deploy context:
- Production
- Deploy Preview
- Branch deploys

### AWS Amplify
**App Settings → Environment variables:**

Create separate apps for each environment or use branch-based deployment.

## 📋 Branch Protection Rules

### `main` Branch
```yaml
Required:
  - At least 2 approvals
  - Status checks must pass (tests, lint, build)
  - Up-to-date with base branch
  - No force push
  - No deletions

Restrictions:
  - Only release/* and hotfix/* can merge
```

### `staging` Branch
```yaml
Required:
  - At least 1 approval
  - Status checks must pass
  - Up-to-date with base branch
  - No force push

Restrictions:
  - Only development and release/* can merge
```

### `development` Branch
```yaml
Required:
  - Status checks must pass
  - Linear history preferred
  - No force push

Restrictions:
  - Feature/* and bugfix/* can merge
```

## 🏷️ Commit Convention

Follow **Conventional Commits** for automatic changelog generation:

```bash
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
perf: Performance improvements
test: Test changes
build: Build system changes
ci: CI/CD changes
chore: Other changes
```

Examples:
```bash
git commit -m "feat(auth): add social login with Google"
git commit -m "fix(api): resolve timeout issue in user endpoint"
git commit -m "docs(readme): update installation instructions"
```

## 🔍 Environment Detection

Use this utility to detect the current environment:

```typescript
// src/lib/env.ts
export const getEnvironment = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return 'production'
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return 'staging'
  return 'development'
}

export const isDevelopment = () => getEnvironment() === 'development'
export const isStaging = () => getEnvironment() === 'staging'
export const isProduction = () => getEnvironment() === 'production'
```

## 📊 Monitoring by Environment

### Development
- Console logging enabled
- Verbose error messages
- Source maps enabled
- Hot reload active

### Staging
- Limited logging
- User-friendly errors
- Source maps enabled
- Same as production config

### Production
- Minimal logging
- Generic error messages
- Source maps disabled (or separate)
- Performance monitoring
- Error tracking (Sentry)

## 🔐 Secrets Management

### Never Commit Secrets!
```bash
# ❌ NEVER
DATABASE_URL=postgresql://user:password@host:5432/db

# ✅ DO THIS
DATABASE_URL=<your-database-url>
```

### Use Platform Secret Managers
- **Vercel:** Environment Variables (encrypted)
- **Netlify:** Environment variables
- **AWS:** AWS Secrets Manager
- **GitHub:** Repository Secrets (for CI/CD)

### Local Development
```bash
# Copy example and fill in your values
cp .env.example .env.local

# Never commit .env.local
# It's already in .gitignore
```

## 📝 Checklist for New Environments

When setting up a new environment:

- [ ] Create branch (if needed)
- [ ] Create `.env.{environment}` file
- [ ] Configure deployment platform
- [ ] Set environment variables on platform
- [ ] Configure branch protection rules
- [ ] Set up monitoring/logging
- [ ] Test deployment
- [ ] Document environment-specific setup
- [ ] Update CI/CD pipeline

## 🆘 Troubleshooting

### Environment Variables Not Working
1. Check file naming (must be `.env.{environment}`)
2. Restart dev server after changes
3. Verify `NEXT_PUBLIC_` prefix for client-side vars
4. Clear Next.js cache: `rm -rf .next`

### Wrong Environment Loaded
1. Check `NODE_ENV` value
2. Verify deployment branch mapping
3. Check platform environment settings
4. Review `.env` file priority

### Secrets Exposed
1. Immediately rotate compromised secrets
2. Check `.gitignore` includes all `.env.local` files
3. Review commit history
4. Use `git-secrets` or similar tools

## 📚 Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
