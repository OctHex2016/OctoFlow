#!/bin/bash

# OctoFlow Rebranding Script
# This script replaces all "Dify" references with "OctoFlow" in the codebase

echo "🐙 Starting OctoFlow rebranding..."

# Change to project root
cd "$(dirname "$0")"

# 1. Replace in translation files (i18n)
echo "📝 Updating translation files..."
find web/i18n -type f \( -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 2. Replace in component files (careful with imports)
echo "🎨 Updating component files..."
find web/app/components -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 3. Replace in public files
echo "📄 Updating public files..."
find web/public -type f \( -name "*.json" -o -name "*.html" \) -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 4. Replace in app pages
echo "📱 Updating app pages..."
find web/app -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -not -path "*/components/*" \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 5. Update meta descriptions
echo "🔍 Updating meta descriptions..."
sed -i '' 's/Dify/OctoFlow/g' web/app/layout.tsx
sed -i '' 's/Dify/OctoFlow/g' web/app/page.tsx 2>/dev/null || true

# 6. Update README and documentation
echo "📚 Updating documentation..."
sed -i '' 's/Dify/OctoFlow/g' README.md 2>/dev/null || true
sed -i '' 's/Dify/OctoFlow/g' web/README.md 2>/dev/null || true

# 7. Update package.json
echo "📦 Updating package.json..."
sed -i '' 's/"name": "dify"/"name": "octoflow"/g' web/package.json 2>/dev/null || true
sed -i '' 's/"description": ".*Dify.*"/"description": "OctoFlow - Build Production Ready Agentic AI Solutions"/g' web/package.json 2>/dev/null || true

# 8. Update backend templates (if any)
echo "🔧 Updating backend templates..."
find api/templates -type f -name "*.html" -exec sed -i '' 's/Dify/OctoFlow/g' {} + 2>/dev/null || true

# 9. Update environment example files
echo "⚙️  Updating environment files..."
sed -i '' 's/Dify/OctoFlow/g' .env.example 2>/dev/null || true
sed -i '' 's/dify/octoflow/g' docker/.env.example 2>/dev/null || true

echo "✅ Rebranding complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace logo files in web/public/logo/"
echo "2. Update favicon files in web/public/"
echo "3. Review and test all changes"
echo "4. Run: cd docker && docker compose down && docker compose up -d --build"
echo ""
echo "🎉 Your OctoFlow instance is ready!"
