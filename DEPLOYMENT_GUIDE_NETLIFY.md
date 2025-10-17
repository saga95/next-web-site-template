# Deployment Guide - Netlify Setup

This guide will help you deploy your Next.js template to Netlify with proper environment management for `main`, `staging`, and `development` branches.

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- GitHub account (already set up ✅)
- Netlify account (free tier is sufficient)

---

## Step-by-Step Deployment

### 1️⃣ Create Netlify Account & Install CLI

#### Create Account
1. Go to https://app.netlify.com/signup
2. Click **"Sign up with GitHub"**
3. Authorize Netlify to access your GitHub account

#### Install Netlify CLI (Optional but Recommended)
```bash
npm install -g netlify-cli
```

Then login:
```bash
netlify login
```

---

### 2️⃣ Import Your GitHub Repository

#### Via Netlify Dashboard:
1. Go to https://app.netlify.com/start
2. Click **"Import from Git"**
3. Select **"GitHub"**
4. Choose **saga95/web-site-template**
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)
6. Click **"Deploy site"**

#### Via CLI:
```bash
cd /Users/sagara/work/my-next-template
netlify init
```

Follow the prompts:
- **Create & configure a new site?** Yes
- **Team**: Your team/account
- **Site name**: web-site-template (or your preferred name)
- **Build command**: `npm run build`
- **Directory to deploy**: `.next`
- **Netlify Functions**: netlify/functions

---

### 3️⃣ Configure Branch Deployments

1. Go to your site dashboard
2. Navigate to **Site settings → Build & deploy → Continuous Deployment**
3. Under **Deploy contexts**:
   - **Production branch**: `main`
   - **Branch deploys**: All branches (or select: `staging`, `development`)
   - **Deploy previews**: Automatically build deploy previews for all pull requests

4. Click **"Save"**

Netlify will now deploy:
- `main` → Production URL
- `staging` → Branch deploy URL (staging--web-site-template.netlify.app)
- `development` → Branch deploy URL (development--web-site-template.netlify.app)

---

### 4️⃣ Install Required Netlify Plugins

The `netlify.toml` file already includes the required plugins, but you need to enable them:

1. Go to **Site settings → Build & deploy → Build plugins**
2. Search and install:
   - **@netlify/plugin-nextjs** (Essential for Next.js)
   - **netlify-plugin-cache-nextjs** (Optional, improves build speed)

Or via CLI:
```bash
netlify plugins:install @netlify/plugin-nextjs
netlify plugins:install netlify-plugin-cache-nextjs
```

---

### 5️⃣ Set Up Environment Variables

Go to: **Site settings → Build & deploy → Environment variables**

#### For ALL Environments:

Click **"Add a variable"** for each:

```bash
# Application
NEXT_PUBLIC_APP_NAME=My Next Template

# API
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key-here
```

#### Environment-Specific Variables:

Netlify allows you to set variables per deploy context:

##### **Production (main branch only)**

Select **"Production" scope**:
```bash
NEXT_PUBLIC_APP_URL=https://web-site-template.netlify.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=prod_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=prod_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=prod_public_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

##### **Branch Deploys (staging, development)**

Select **"Branch deploys" scope**:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=staging_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=staging_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=staging_public_key
```

##### **Deploy Previews**

Select **"Deploy previews" scope**:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=dev_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=dev_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=dev_public_key
```

#### How to Add Variables:

1. Click **"Add a variable"**
2. **Key**: e.g., `NEXT_PUBLIC_APP_URL`
3. **Values**: 
   - Select scope: Production, Branch deploys, or Deploy previews
   - Enter value for that scope
4. Click **"Create variable"**

**Tip:** You can set different values for the same variable across scopes!

---

### 6️⃣ Set Up Custom Domains (Optional)

#### For Production (main):
1. Go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `mywebsite.com`)
4. Follow DNS configuration instructions
5. Netlify will automatically provision SSL certificate

#### For Staging:
1. Click **"Add domain alias"**
2. Enter subdomain: `staging.mywebsite.com`
3. Configure DNS
4. Set branch deploy context to `staging`

---

### 7️⃣ Configure Build Settings

Go to **Site settings → Build & deploy → Build settings**

Verify these settings:

```
Base directory: (empty)
Build command: npm run build
Publish directory: .next
Functions directory: netlify/functions
```

#### Advanced Build Settings:

**Environment variables for build:**
- `NODE_VERSION`: 18.17.0
- `NEXT_TELEMETRY_DISABLED`: 1

**Post processing:**
- ✅ Snippet injection
- ✅ Asset optimization (optional)
- ✅ Pretty URLs
- ✅ Bundle CSS
- ✅ Minify CSS
- ✅ Minify JS

---

### 8️⃣ Test Your Deployment

#### Trigger a deployment:

```bash
# Make a small change
git checkout development
echo "# Netlify deployment test" >> NETLIFY_TEST.md
git add NETLIFY_TEST.md
git commit -m "test: trigger Netlify deployment"
git push origin development
```

#### Check deployment status:

1. Go to https://app.netlify.com/sites/web-site-template/deploys
2. You should see a new deployment for `development` branch
3. Click on it to see build logs
4. Once deployed, click "Preview deploy" to see your site

#### Via CLI:
```bash
netlify status
netlify watch
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
→ **Auto-deploys to:** `development--web-site-template.netlify.app`

### Staging Workflow:
```bash
# Merge development to staging
git checkout staging
git merge development
git push origin staging
```
→ **Auto-deploys to:** `staging--web-site-template.netlify.app`

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
→ **Auto-deploys to:** `web-site-template.netlify.app` (Production)

---

## 🔐 Security Best Practices

### 1. Use Netlify Environment Variables
- ✅ **Never commit** `.env.local` or files with real secrets
- ✅ **Use Netlify dashboard** to store sensitive data
- ✅ **Encrypt sensitive variables** (Netlify encrypts them automatically)

### 2. Separate Credentials Per Environment
- **Production:** Real API keys, production database
- **Branch deploys:** Test API keys, staging database
- **Deploy previews:** Development API keys, local/dev database

### 3. Use Different EmailJS Templates
- Create separate EmailJS templates for each environment
- Use different service IDs to track emails by environment

---

## 📊 Monitoring Deployments

### Netlify Dashboard
- **Deploys**: See all deployments and their status
- **Functions**: Monitor serverless function usage
- **Analytics**: Track visitors (requires Analytics add-on)
- **Logs**: View build and function logs

### CLI Commands
```bash
# Check site status
netlify status

# List recent deployments
netlify deploy:list

# Watch for new deploys
netlify watch

# Open site in browser
netlify open

# Open admin dashboard
netlify open:admin

# View logs
netlify logs:deploy
netlify logs:function FUNCTION_NAME
```

---

## 🎯 URL Structure

After setup, you'll have:

| Branch | Environment | URL Pattern | Purpose |
|--------|-------------|-------------|---------|
| **main** | Production | `web-site-template.netlify.app` | Live production site |
| **staging** | Branch Deploy | `staging--web-site-template.netlify.app` | Pre-production testing |
| **development** | Branch Deploy | `development--web-site-template.netlify.app` | Development testing |
| **feature/*** | Deploy Preview | `deploy-preview-*--web-site-template.netlify.app` | PR previews |

---

## 🐛 Troubleshooting

### Build Fails on Netlify but Works Locally

**Check:**
1. Environment variables are set correctly
2. Node version matches (set `NODE_VERSION` env var)
3. All dependencies are in `package.json`
4. Build command is correct

**Fix:**
```bash
# Test build locally with exact Netlify environment
npm run build

# Set Node version in netlify.toml
[build.environment]
  NODE_VERSION = "18.17.0"
```

### Environment Variables Not Working

**Check:**
1. Variable names are correct (case-sensitive)
2. Variables starting with `NEXT_PUBLIC_` are exposed to browser
3. Variables without `NEXT_PUBLIC_` are server-side only
4. You've set the correct scope (Production/Branch/Preview)
5. You've redeployed after adding variables

**Fix:** Clear cache and redeploy:
```bash
netlify build --clear-cache
```

### Deployments Not Triggering

**Check:**
1. GitHub integration is connected
2. Branch deploys are enabled for your branch
3. No build errors in previous deployment
4. Build hook is configured correctly

**Fix:** Trigger manual deploy:
```bash
netlify deploy --build --prod  # For production
netlify deploy --build         # For preview
```

### Next.js Plugin Issues

**Check:**
1. `@netlify/plugin-nextjs` is installed
2. Plugin is listed in `netlify.toml`
3. Next.js version compatibility

**Fix:** Reinstall plugin:
```bash
npm uninstall @netlify/plugin-nextjs
npm install @netlify/plugin-nextjs --save-dev
```

### Function Deployment Issues

**Check:**
1. Functions are in `netlify/functions` directory
2. Function format is correct
3. Dependencies are installed

**Fix:** Test function locally:
```bash
netlify dev
```

---

## 🚀 Advanced Configuration

### Edge Functions (Faster than Serverless)

Create `netlify/edge-functions/`:

```javascript
// netlify/edge-functions/hello.js
export default async (request, context) => {
  return new Response("Hello from the edge!");
};

export const config = { path: "/api/hello" };
```

### Split Testing (A/B Testing)

In **Site settings → Build & deploy → Split testing**:

1. Create a branch: `experiment/new-design`
2. Set split percentage: 50/50
3. Deploy both branches
4. Monitor analytics

### Background Functions (Long-running)

```javascript
// netlify/functions/long-process.js
export async function handler(event, context) {
  // Can run up to 15 minutes (Pro plan)
  // Process heavy computation
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'processing' })
  };
}
```

### On-demand Builders (ISR Alternative)

```javascript
// netlify/functions/cached-page.js
import { builder } from '@netlify/functions';

async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: '<html>Cached content</html>',
    ttl: 3600, // Cache for 1 hour
  };
}

export { handler };
export const config = { path: '/cached' };
```

---

## 📝 Quick Reference Card

```bash
# Deploy via CLI
netlify deploy                   # Deploy preview
netlify deploy --prod            # Deploy to production
netlify deploy --build           # Build then deploy

# Site management
netlify init                     # Initialize new site
netlify link                     # Link to existing site
netlify unlink                   # Unlink from site

# Environment variables
netlify env:list                 # List all variables
netlify env:get VAR_NAME         # Get variable value
netlify env:set VAR_NAME value   # Set variable
netlify env:unset VAR_NAME       # Remove variable

# Functions
netlify functions:list           # List all functions
netlify functions:create         # Create new function
netlify functions:invoke NAME    # Test function

# Development
netlify dev                      # Start local dev server
netlify dev:exec command         # Run command in dev context

# Site operations
netlify open                     # Open site in browser
netlify open:admin               # Open admin dashboard
netlify status                   # Show site status
netlify watch                    # Watch for deploys
```

---

## ✅ Deployment Checklist

Before going to production:

- [ ] All environment variables configured on Netlify
- [ ] Production domain configured (if using custom domain)
- [ ] SSL certificate provisioned (automatic)
- [ ] EmailJS credentials set up for all environments
- [ ] Analytics tracking codes added
- [ ] Sentry error tracking configured (if using)
- [ ] Next.js plugin installed and configured
- [ ] Build caching enabled
- [ ] Custom 404 page created
- [ ] Performance tested on branch deploy
- [ ] SEO meta tags verified
- [ ] Security headers configured (already in netlify.toml)
- [ ] CORS settings verified (if using API)
- [ ] Rate limiting configured (if needed)
- [ ] Function deployment tested (if using)

---

## 🎉 You're All Set!

Your Next.js template is now configured for Netlify deployment with:
- ✅ Automatic deployments for main, staging, and development
- ✅ Environment-specific configurations
- ✅ Branch deploy URLs
- ✅ Secure environment variable management
- ✅ Next.js optimization plugins
- ✅ Security headers configured

**Next Steps:**
- Deploy your site to Netlify
- Configure environment variables
- Set up your custom domain
- Enable branch deploys for staging and development

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Branch Deploys](https://docs.netlify.com/site-deploys/overview/#branch-deploy-controls)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)

---

**Need help?** Check the troubleshooting section or visit [Netlify Support](https://answers.netlify.com/).
