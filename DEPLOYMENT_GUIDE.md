# Deployment Guide - Vercel Setup

This guide will help you deploy your Next.js template to Vercel with proper environment management for `main`, `staging`, and `development` branches.

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- GitHub account (already set up ✅)
- Vercel account (free tier is sufficient)

---

## Step-by-Step Deployment

### 1️⃣ Create Vercel Account & Install CLI

#### Create Account
1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

#### Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

Then login:
```bash
vercel login
```

---

### 2️⃣ Import Your GitHub Repository

#### Via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **saga95/next-web-site-template**
4. Click **"Import"**

#### Via CLI:
```bash
cd /Users/sagara/work/my-next-template
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **What's your project's name?** next-web-site-template (or your preferred name)
- **In which directory is your code located?** ./
- **Override settings?** No

---

### 3️⃣ Configure Production Branch

1. Go to your project settings: https://vercel.com/saga95/next-web-site-template/settings
2. Navigate to **Git → Production Branch**
3. Change from `main` to: **`main`** (confirm it's set correctly)

---

### 4️⃣ Enable Branch Deployments

1. Still in **Git** settings
2. Scroll to **Deploy Hooks** section
3. Enable automatic deployments for:
   - ✅ **main** (Production)
   - ✅ **staging** (Preview)
   - ✅ **development** (Preview)

Vercel will now deploy:
- `main` → Production URL
- `staging` → Preview URL (staging-next-web-site-template-*.vercel.app)
- `development` → Preview URL (development-next-web-site-template-*.vercel.app)

---

### 5️⃣ Set Up Environment Variables

Go to: **Settings → Environment Variables**

#### For ALL Environments (Production, Preview, Development):

```bash
# Application
NEXT_PUBLIC_APP_NAME=My Next Template

# API (use different values per environment in the next step)
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key-here
```

#### Environment-Specific Variables:

##### **Production (main branch only)**
```bash
NEXT_PUBLIC_APP_URL=https://next-web-site-template.vercel.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=prod_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=prod_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=prod_public_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

##### **Preview - Staging branch**
```bash
NEXT_PUBLIC_APP_URL=https://staging-next-web-site-template.vercel.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=staging_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=staging_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=staging_public_key
```

##### **Preview - Development branch**
```bash
NEXT_PUBLIC_APP_URL=https://development-next-web-site-template.vercel.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=dev_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=dev_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=dev_public_key
```

#### How to Add Variables:

1. Click **"Add New"** button
2. Enter **Key** (e.g., `NEXT_PUBLIC_APP_URL`)
3. Enter **Value**
4. Select environments:
   - For shared variables: ✅ Production, ✅ Preview, ✅ Development
   - For environment-specific: Select only one environment
5. Click **"Save"**

**Tip:** You can also specify branch-specific variables by clicking "Add Override" after creating a variable.

---

### 6️⃣ Set Up Custom Domains (Optional)

#### For Production (main):
1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `mywebsite.com`)
3. Follow DNS configuration instructions

#### For Staging:
1. Add subdomain: `staging.mywebsite.com`
2. Configure it to deploy from `staging` branch

---

### 7️⃣ Configure Build Settings

Go to **Settings → General**

Verify these settings:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

**Root Directory:** Leave empty (uses root)

---

### 8️⃣ Test Your Deployment

#### Trigger a deployment:

```bash
# Make a small change
git checkout development
echo "# Deployment test" >> DEPLOYMENT_TEST.md
git add DEPLOYMENT_TEST.md
git commit -m "test: trigger Vercel deployment"
git push origin development
```

#### Check deployment status:

1. Go to https://vercel.com/saga95/next-web-site-template
2. You should see a new deployment for `development` branch
3. Click on it to see build logs
4. Once deployed, click "Visit" to see your site

#### Via CLI:
```bash
vercel ls
```

---

## 🔄 Deployment Workflow

### Development Workflow:
```bash
# Work on development branch
git checkout development
# ... make changes ...
git commit -m "feat: new feature"
git push origin development
```
→ **Auto-deploys to:** `development-next-web-site-template-*.vercel.app`

### Staging Workflow:
```bash
# Merge development to staging
git checkout staging
git merge development
git push origin staging
```
→ **Auto-deploys to:** `staging-next-web-site-template-*.vercel.app`

### Production Workflow:
```bash
# Create release branch
git checkout -b release/1.0.0 development
# ... final testing ...

# Merge to staging first
git checkout staging
git merge release/1.0.0
git push origin staging
# ... test on staging ...

# Then merge to main
git checkout main
git merge release/1.0.0
git push origin main
```
→ **Auto-deploys to:** `next-web-site-template.vercel.app` (Production)

---

## 🔐 Security Best Practices

### 1. Use Vercel Environment Variables
- ✅ **Never commit** `.env.local` or files with real secrets
- ✅ **Use Vercel dashboard** to store sensitive data
- ✅ **Encrypt sensitive variables** (Vercel encrypts them automatically)

### 2. Separate Credentials Per Environment
- **Production:** Real API keys, production database
- **Staging:** Test API keys, staging database
- **Development:** Development API keys, local/dev database

### 3. Use Different EmailJS Templates
- Create separate EmailJS templates for each environment
- Use different service IDs to track emails by environment

---

## 📊 Monitoring Deployments

### Vercel Dashboard
- **Deployments:** See all deployments and their status
- **Analytics:** Track page views, performance (requires Pro plan)
- **Logs:** View runtime logs for debugging

### CLI Commands
```bash
# List recent deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Promote a deployment to production
vercel promote [deployment-url]

# Alias a deployment to a custom domain
vercel alias [deployment-url] [custom-domain]
```

---

## 🎯 URL Structure

After setup, you'll have:

| Branch | Environment | URL Pattern | Purpose |
|--------|-------------|-------------|---------|
| **main** | Production | `next-web-site-template.vercel.app` | Live production site |
| **staging** | Preview | `staging-*-saga95.vercel.app` | Pre-production testing |
| **development** | Preview | `development-*-saga95.vercel.app` | Development testing |
| **feature/*** | Preview | `next-web-site-template-*-saga95.vercel.app` | Feature branch previews |

---

## 🐛 Troubleshooting

### Build Fails on Vercel but Works Locally

**Check:**
1. Environment variables are set correctly
2. Node version matches (Vercel uses Node 18 by default)
3. All dependencies are in `package.json`

**Fix:**
```bash
# Specify Node version in package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Environment Variables Not Working

**Check:**
1. Variable names are correct (case-sensitive)
2. Variables starting with `NEXT_PUBLIC_` are exposed to browser
3. Variables without `NEXT_PUBLIC_` are server-side only
4. You've redeployed after adding variables

**Fix:** Redeploy after adding variables:
```bash
vercel --prod  # For production
# or trigger via git push
```

### Deployments Not Triggering

**Check:**
1. GitHub integration is connected
2. Branch deployments are enabled
3. No build errors in previous deployment

**Fix:** Reconnect GitHub integration:
- Settings → Git → Disconnect → Reconnect

---

## 🚀 Advanced Configuration

### Custom Build for Each Environment

Create `vercel-build` script in `package.json`:

```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### Ignore Build Step for Certain Branches

Create `vercel-ignore-build-step.sh`:

```bash
#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "development" ]] ; then
  # Don't build if only documentation changed
  git diff HEAD^ HEAD --quiet . ':!*.md'
else
  # Always build other branches
  exit 1
fi
```

---

## 📝 Quick Reference Card

```bash
# Deploy to production
git push origin main

# Deploy to staging
git push origin staging

# Deploy to development
git push origin development

# Deploy via CLI
vercel --prod                    # Deploy to production
vercel                           # Deploy to preview

# View deployments
vercel ls                        # List deployments
vercel inspect [url]             # Get deployment details
vercel logs [url]                # View logs

# Environment variables
vercel env add [name]            # Add new variable
vercel env ls                    # List variables
vercel env rm [name]             # Remove variable

# Domains
vercel domains ls                # List domains
vercel domains add [domain]      # Add domain
```

---

## ✅ Deployment Checklist

Before going to production:

- [ ] All environment variables configured on Vercel
- [ ] Production domain configured (if using custom domain)
- [ ] EmailJS credentials set up for all environments
- [ ] Analytics tracking codes added
- [ ] Sentry error tracking configured (if using)
- [ ] Custom 404 and 500 pages created
- [ ] Performance tested on staging
- [ ] SEO meta tags verified
- [ ] Security headers configured
- [ ] CORS settings verified (if using API)
- [ ] Rate limiting configured (if needed)

---

## 🎉 You're All Set!

Your Next.js template is now deployed with:
- ✅ Automatic deployments for main, staging, and development
- ✅ Environment-specific configurations
- ✅ Preview URLs for every branch
- ✅ Secure environment variable management

**Next Steps:**
- Test a deployment by pushing to development
- Configure your custom domain
- Set up real EmailJS credentials
- Enable analytics and monitoring

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)

---

**Need help?** Check the troubleshooting section or contact Vercel support.
