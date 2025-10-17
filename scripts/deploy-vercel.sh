#!/bin/bash

# Vercel Deployment Setup Script
# This script helps you quickly deploy your Next.js template to Vercel

set -e

echo "🚀 Vercel Deployment Setup"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
    echo ""
    read -p "Would you like to install Vercel CLI globally? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Installing Vercel CLI...${NC}"
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI installed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  You can install it later with: npm install -g vercel${NC}"
        echo ""
        echo "For now, you can deploy via the Vercel dashboard:"
        echo "👉 https://vercel.com/new"
        echo ""
        exit 0
    fi
fi

echo ""
echo -e "${GREEN}✅ Vercel CLI is installed${NC}"
echo ""

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Vercel login status...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo ""
    read -p "Would you like to login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel login
    else
        echo -e "${YELLOW}⚠️  Please login with: vercel login${NC}"
        exit 1
    fi
else
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ Logged in as: ${VERCEL_USER}${NC}"
fi

echo ""
echo "========================================="
echo "Choose your deployment option:"
echo "========================================="
echo ""
echo "1) 🌐 Deploy via Vercel Dashboard (Recommended for first time)"
echo "2) 💻 Deploy via CLI (Quick deploy)"
echo "3) 🔧 Setup project only (no deploy)"
echo "4) ℹ️  Show deployment information"
echo "5) ❌ Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📖 Opening Vercel Dashboard Setup Guide...${NC}"
        echo ""
        echo "Follow these steps:"
        echo "==================="
        echo ""
        echo "1. Open: https://vercel.com/new"
        echo "2. Click 'Import Git Repository'"
        echo "3. Select: saga95/web-site-template"
        echo "4. Click 'Import'"
        echo "5. Configure project settings (or use defaults)"
        echo "6. Click 'Deploy'"
        echo ""
        echo "📚 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
        echo ""
        read -p "Press Enter to open Vercel dashboard in browser..." 
        
        # Try to open browser
        if command -v open &> /dev/null; then
            open "https://vercel.com/new"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://vercel.com/new"
        else
            echo "Please open: https://vercel.com/new"
        fi
        ;;
    
    2)
        echo ""
        echo -e "${BLUE}🚀 Deploying via CLI...${NC}"
        echo ""
        
        # Check if already linked
        if [ -f ".vercel/project.json" ]; then
            echo -e "${YELLOW}⚠️  Project already linked to Vercel${NC}"
            read -p "Deploy to production? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                vercel --prod
            else
                echo "Deploying to preview..."
                vercel
            fi
        else
            echo "This will link and deploy your project to Vercel"
            echo ""
            vercel
        fi
        
        echo ""
        echo -e "${GREEN}✅ Deployment initiated!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Configure environment variables on Vercel dashboard"
        echo "2. Set up branch deployments (main, staging, development)"
        echo "3. Configure custom domain (optional)"
        echo ""
        echo "📚 See DEPLOYMENT_GUIDE.md for detailed configuration"
        ;;
    
    3)
        echo ""
        echo -e "${BLUE}🔧 Project Setup (no deploy)${NC}"
        echo ""
        vercel link
        echo ""
        echo -e "${GREEN}✅ Project linked to Vercel${NC}"
        echo ""
        echo "You can deploy later with:"
        echo "  vercel        # Deploy to preview"
        echo "  vercel --prod # Deploy to production"
        ;;
    
    4)
        echo ""
        echo -e "${BLUE}ℹ️  Deployment Information${NC}"
        echo ""
        echo "Project: web-site-template"
        echo "Owner: saga95"
        echo "Framework: Next.js 14.2.0"
        echo ""
        echo "Branches:"
        echo "  - main (Production)"
        echo "  - staging (Preview)"
        echo "  - development (Preview)"
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
        echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
        echo ""
        
        if [ -f ".vercel/project.json" ]; then
            echo -e "${GREEN}✅ Project Status: Linked to Vercel${NC}"
            echo ""
            echo "Recent deployments:"
            vercel ls 2>/dev/null || echo "Run 'vercel ls' to see deployments"
        else
            echo -e "${YELLOW}⚠️  Project Status: Not linked to Vercel${NC}"
        fi
        ;;
    
    5)
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
echo "• Deployment Guide: DEPLOYMENT_GUIDE.md"
echo "• Environment Setup: ENVIRONMENT_SETUP.md"
echo "• Branching Strategy: BRANCHING_STRATEGY.md"
echo "• Vercel Docs: https://vercel.com/docs"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
