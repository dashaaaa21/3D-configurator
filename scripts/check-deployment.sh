#!/bin/bash

echo "🔍 Checking deployment status..."
echo ""

check_url() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$status" -eq 200 ]; then
        echo "✅ Online (HTTP $status)"
        return 0
    else
        echo "❌ Offline (HTTP $status)"
        return 1
    fi
}

echo "Deployment URLs:"
echo ""

if [ -z "$VERCEL_URL" ]; then
    echo "⚠️  VERCEL_URL not set"
    echo "   Set it with: export VERCEL_URL=https://your-project.vercel.app"
else
    check_url "$VERCEL_URL" "Vercel"
fi

echo ""

if [ -z "$RENDER_URL" ]; then
    echo "⚠️  RENDER_URL not set"
    echo "   Set it with: export RENDER_URL=https://your-app.onrender.com"
else
    check_url "$RENDER_URL" "Render"
fi

echo ""
echo "GitHub Actions:"
echo "  Check status at: https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
echo ""
echo "Dashboards:"
echo "  Vercel: https://vercel.com/dashboard"
echo "  Render: https://dashboard.render.com"
echo ""
