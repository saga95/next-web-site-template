#!/bin/bash

# Environment Setup Script
# This script helps you set up environment files for different stages

set -e

echo "🌍 Environment Setup for Next.js Template"
echo "=========================================="
echo ""

# Function to create .env.local from example
setup_local_env() {
    if [ -f .env.local ]; then
        echo "⚠️  .env.local already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping .env.local creation"
            return
        fi
    fi
    
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 Please edit .env.local with your actual values"
}

# Function to check if git branch exists
branch_exists() {
    git rev-parse --verify "$1" >/dev/null 2>&1
}

# Function to create branch if it doesn't exist
create_branch() {
    local branch_name=$1
    local from_branch=$2
    
    if branch_exists "$branch_name"; then
        echo "✅ Branch '$branch_name' already exists"
    else
        echo "Creating branch '$branch_name' from '$from_branch'..."
        git checkout "$from_branch"
        git checkout -b "$branch_name"
        git push -u origin "$branch_name"
        echo "✅ Created and pushed branch '$branch_name'"
    fi
}

# Main menu
echo "What would you like to do?"
echo ""
echo "1) Setup local environment (.env.local)"
echo "2) Create standard branches (development, staging)"
echo "3) Both (setup local env + create branches)"
echo "4) Show environment info"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        setup_local_env
        ;;
    2)
        echo ""
        echo "Creating standard branches..."
        echo ""
        
        # Ensure we're on main and it's up to date
        git checkout main
        git pull origin main
        
        # Create development branch
        create_branch "development" "main"
        
        # Create staging branch
        create_branch "staging" "main"
        
        echo ""
        echo "✅ Branch setup complete!"
        echo ""
        echo "Branch structure:"
        echo "  main        → Production"
        echo "  staging     → Pre-production"
        echo "  development → Development"
        ;;
    3)
        setup_local_env
        echo ""
        echo "Creating standard branches..."
        echo ""
        
        git checkout main 2>/dev/null || git checkout -b main
        git pull origin main 2>/dev/null || true
        
        create_branch "development" "main"
        create_branch "staging" "main"
        
        echo ""
        echo "✅ Setup complete!"
        ;;
    4)
        echo ""
        echo "📊 Environment Information"
        echo "=========================="
        echo ""
        echo "Environment files:"
        ls -la .env* 2>/dev/null || echo "No .env files found"
        echo ""
        echo "Current branch:"
        git branch --show-current
        echo ""
        echo "All branches:"
        git branch -a
        echo ""
        echo "Environment variables (from .env.local):"
        if [ -f .env.local ]; then
            grep "^[^#]" .env.local | head -10
            echo "... (showing first 10 non-comment lines)"
        else
            echo "No .env.local file found"
        fi
        ;;
    5)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📚 Next steps:"
echo ""
echo "1. Edit .env.local with your actual values"
echo "2. Review BRANCHING_STRATEGY.md for workflow details"
echo "3. Set up environment variables in your deployment platform"
echo "4. Start development: npm run dev"
echo ""
echo "Happy coding! 🚀"
