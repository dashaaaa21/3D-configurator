#!/bin/bash

set -e

echo "🚀 Setting up deployment for Vercel and Render..."
echo ""

echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🔧 Checking configuration files..."

if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    exit 1
fi

if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    exit 1
fi

echo "✅ Configuration files found"
echo ""

echo "🏗️  Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🧪 Running linter..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting issues found (run 'npm run lint:fix')"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Vercel Setup:"
echo "  1. Create account at https://vercel.com"
echo "  2. Run: npm i -g vercel && vercel login && vercel link"
echo "  3. Get credentials from .vercel/project.json"
echo "  4. Add GitHub secrets:"
echo "     - VERCEL_TOKEN"
echo "     - VERCEL_ORG_ID"
echo "     - VERCEL_PROJECT_ID"
echo ""
echo "Render Setup:"
echo "  1. Create account at https://render.com"
echo "  2. Create new Web Service"
echo "  3. Connect GitHub repository"
echo "  4. Get deploy hook URL"
echo "  5. Add GitHub secret:"
echo "     - RENDER_DEPLOY_HOOK_URL"
echo ""
echo "📖 Full guide: ./VERCEL-RENDER-SETUP.md"
echo ""
echo "✅ Setup complete! Ready to deploy."
echo ""
echo "Next steps:"
echo "  1. Add GitHub secrets"
echo "  2. git push origin main"
echo "  3. Check GitHub Actions"
echo ""
