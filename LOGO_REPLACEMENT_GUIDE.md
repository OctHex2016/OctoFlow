# OctoFlow Logo Replacement Guide

## ✅ Changes Already Made

1. **Removed GitHub & Roadmap links** from account dropdown menu
2. **Changed default plan** to "Enterprise" for self-hosted
3. **Updated branding** in manifest.json and layout

## 🎨 Logo Files You Need to Replace

You have an OctoFlow logo image. Here's how to use it:

### Step 1: Convert Your Logo to SVG

Your logo appears to be a PNG. You need to convert it to SVG format for best quality.

**Option A: Use an online converter**
- Go to https://convertio.co/png-svg/
- Upload your OctoFlow logo
- Download the SVG file

**Option B: Use Inkscape (free software)**
```bash
# Install Inkscape
brew install inkscape

# Convert to SVG
inkscape your-logo.png --export-type=svg --export-filename=logo.svg
```

### Step 2: Create Two Versions

You need two versions of your logo:

1. **logo.svg** - Regular version (dark blue octopus on light background)
2. **logo-monochrome-white.svg** - White version for dark theme

For the white version, you can:
- Open the SVG in a text editor
- Change `fill="#0a2540"` (or whatever your dark blue color is) to `fill="#ffffff"`
- Save as `logo-monochrome-white.svg`

### Step 3: Replace Logo Files

Copy your logo files to:

```bash
cd /Users/hillmantam/Downloads/dify-main/web/public/logo/

# Replace these files:
cp /path/to/your/logo.svg logo.svg
cp /path/to/your/logo-white.svg logo-monochrome-white.svg

# Optional: Replace embedded chat logos (if you use embedded chat)
cp /path/to/your/logo.png logo-embedded-chat-avatar.png
cp /path/to/your/logo.png logo-embedded-chat-header.png
```

### Step 4: Update Database Plan

Run this SQL command to update existing workspaces to Enterprise plan:

```bash
cd /Users/hillmantam/Downloads/dify-main/docker

docker compose exec db psql -U postgres -d dify -c "UPDATE tenants SET plan = 'enterprise';"
```

### Step 5: Rebuild and Deploy

```bash
cd /Users/hillmantam/Downloads/dify-main/docker
docker compose down
docker compose up -d --build
```

## 📋 Logo Specifications

### Recommended Sizes

- **SVG logos**: Vector format, will scale automatically
- **PNG logos** (for embedded chat):
  - `logo-embedded-chat-avatar.png`: 80x80px
  - `logo-embedded-chat-header.png`: 120x40px
  - `logo-embedded-chat-header@2x.png`: 240x80px
  - `logo-embedded-chat-header@3x.png`: 360x120px

### Color Specifications

Based on your OctoFlow logo:
- **Primary color**: Dark blue (#0a2540 or similar)
- **White version**: #ffffff for dark theme
- **Background**: Transparent

## ✅ What's Been Removed

- ❌ GitHub link from account dropdown
- ❌ Roadmap link from account dropdown  
- ❌ GitHub star counter

## 🔄 What Still Shows "Dify"

There are **1,152 references** to "Dify" in the codebase. To replace them all:

```bash
cd /Users/hillmantam/Downloads/dify-main/web

# Replace in translation files
find i18n -type f -name "*.ts" -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# Replace in components (review carefully!)
find app/components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Dify/OctoFlow/g' {} +
```

**⚠️ WARNING**: Review changes before committing! Some references might be:
- Import paths
- API endpoints
- Environment variables

## 🎯 Quick Summary

1. ✅ Convert your logo to SVG (both regular and white versions)
2. ✅ Copy logo files to `/web/public/logo/`
3. ✅ Update database: `UPDATE tenants SET plan = 'enterprise';`
4. ✅ Rebuild: `docker compose up -d --build`
5. ✅ Verify in browser

Your OctoFlow branding will be complete! 🐙
