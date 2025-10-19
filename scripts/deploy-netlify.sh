#!/bin/bash

# Netlify Deployment Setup Script
# This script helps you quickly deploy your Next.js template to Netlify

set -e

echo "🚀 Netlify Deployment Setup"
echo "==========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found${NC}"
    echo ""
    read -p "Would you like to install Netlify CLI globally? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Installing Netlify CLI...${NC}"
        npm install -g netlify-cli
        echo -e "${GREEN}✅ Netlify CLI installed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  You can install it later with: npm install -g netlify-cli${NC}"
        echo ""
        echo "For now, you can deploy via the Netlify dashboard:"
        echo "👉 https://app.netlify.com/start"
        echo ""
        exit 0
    fi
fi

echo ""
echo -e "${GREEN}✅ Netlify CLI is installed${NC}"
echo ""

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Netlify login status...${NC}"
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Netlify${NC}"
    echo ""
    read -p "Would you like to login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        netlify login
    else
        echo -e "${YELLOW}⚠️  Please login with: netlify login${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Logged in to Netlify${NC}"
fi

echo ""
echo "========================================="
echo "Choose your deployment option:"
echo "========================================="
echo ""
echo "1) 🌐 Deploy via Netlify Dashboard (Recommended for first time)"
echo "2) 💻 Deploy via CLI (Quick deploy)"
echo "3) 🔧 Initialize site only (no deploy)"
echo "4) 🔌 Install Netlify Plugins"
echo "5) ℹ️  Show deployment information"
echo "6) ❌ Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📖 Opening Netlify Dashboard Setup Guide...${NC}"
        echo ""
        echo "Follow these steps:"
        echo "==================="
        echo ""
        echo "1. Open: https://app.netlify.com/start"
        echo "2. Click 'Import from Git'"
        echo "3. Select 'GitHub'"
        echo "4. Choose: saga95/next-web-site-template"
        echo "5. Configure build settings:"
        echo "   - Build command: npm run build"
        echo "   - Publish directory: .next"
        echo "6. Click 'Deploy site'"
        echo ""
        echo "📚 For detailed instructions, see: DEPLOYMENT_GUIDE_NETLIFY.md"
        echo ""
        read -p "Press Enter to open Netlify dashboard in browser..." 
        
        # Try to open browser
        if command -v open &> /dev/null; then
            open "https://app.netlify.com/start"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://app.netlify.com/start"
        else
            echo "Please open: https://app.netlify.com/start"
        fi
        ;;
    
    2)
        echo ""
        echo -e "${BLUE}🚀 Deploying via CLI...${NC}"
        echo ""
        
        # Check if already linked
        if [ -f ".netlify/state.json" ]; then
            echo -e "${YELLOW}⚠️  Site already linked to Netlify${NC}"
            read -p "Deploy to production? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                netlify deploy --prod --build
            else
                echo "Deploying to preview..."
                netlify deploy --build
            fi
        else
            echo "This will initialize and deploy your project to Netlify"
            echo ""
            netlify deploy --build
        fi
        
        echo ""
        echo -e "${GREEN}✅ Deployment initiated!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Configure environment variables on Netlify dashboard"
        echo "2. Set up branch deploys (main, staging, development)"
        echo "3. Install Netlify plugins (@netlify/plugin-nextjs)"
        echo "4. Configure custom domain (optional)"
        echo ""
        echo "📚 See DEPLOYMENT_GUIDE_NETLIFY.md for detailed configuration"
        ;;
    
    3)
        echo ""
        echo -e "${BLUE}🔧 Site Initialization (no deploy)${NC}"
        echo ""
        netlify init
        echo ""
        echo -e "${GREEN}✅ Site initialized${NC}"
        echo ""
        echo "You can deploy later with:"
        echo "  netlify deploy --build         # Deploy to preview"
        echo "  netlify deploy --prod --build  # Deploy to production"
        ;;
    
    4)
        echo ""
        echo -e "${BLUE}🔌 Installing Netlify Plugins...${NC}"
        echo ""
        
        # Check if site is linked
        if [ ! -f ".netlify/state.json" ]; then
            echo -e "${RED}❌ Site not linked to Netlify${NC}"
            echo "Please initialize your site first (option 3)"
            exit 1
        fi
        
        echo "Installing required plugins..."
        echo ""
        
        # Install Next.js plugin
        echo -e "${BLUE}📦 Installing @netlify/plugin-nextjs...${NC}"
        npm install -D @netlify/plugin-nextjs
        
        # Install cache plugin
        echo -e "${BLUE}📦 Installing netlify-plugin-cache-nextjs...${NC}"
        npm install -D netlify-plugin-cache-nextjs || echo "⚠️  Cache plugin installation optional"
        
        echo ""
        echo -e "${GREEN}✅ Plugins installed!${NC}"
        echo ""
        echo "The plugins are already configured in netlify.toml"
        echo "They will be used on next deployment"
        ;;
    
    5)
        echo ""
        echo -e "${BLUE}ℹ️  Deployment Information${NC}"
        echo ""
        echo "Project: next-web-site-template"
        echo "Owner: saga95"
        echo "Framework: Next.js 14.2.0"
        echo ""
        echo "Branches:"
        echo "  - main (Production)"
        echo "  - staging (Branch Deploy)"
        echo "  - development (Branch Deploy)"
        echo ""
        echo "Configuration Files:"
        echo "  - netlify.toml (Build configuration)"
        echo "  - .netlifyignore (Ignore patterns)"
        echo "  - .env.netlify (Environment variables template)"
        echo ""
        echo "Required Netlify Plugins:"
        echo "  - @netlify/plugin-nextjs (Essential)"
        echo "  - netlify-plugin-cache-nextjs (Optional)"
        echo ""
        echo "Environment Variables Needed:"
        echo "  - NEXT_PUBLIC_APP_NAME"
        echo "  - NEXT_PUBLIC_APP_URL"
        echo "  - NEXT_PUBLIC_API_URL"
        echo "  - NEXT_PUBLIC_EMAILJS_SERVICE_ID"
        echo "  - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"
        echo "  - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
        echo "  - API_SECRET_KEY"
        echo ""
        echo "📚 Full guide: DEPLOYMENT_GUIDE_NETLIFY.md"
        echo ""
        
        if [ -f ".netlify/state.json" ]; then
            echo -e "${GREEN}✅ Site Status: Linked to Netlify${NC}"
            echo ""
            echo "Site details:"
            netlify status 2>/dev/null || echo "Run 'netlify status' to see site details"
        else
            echo -e "${YELLOW}⚠️  Site Status: Not linked to Netlify${NC}"
        fi
        ;;
    
    6)
        echo ""
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
    
    *)
        echo ""
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "📚 Additional Resources:"
echo "========================================="
echo ""
echo "• Netlify Deployment Guide: DEPLOYMENT_GUIDE_NETLIFY.md"
echo "• Environment Variables: .env.netlify"
echo "• Environment Setup: ENVIRONMENT_SETUP.md"
echo "• Branching Strategy: BRANCHING_STRATEGY.md"
echo "• Netlify Docs: https://docs.netlify.com/"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
