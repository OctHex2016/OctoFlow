# Rebranding Dify to OctoFlow

## ✅ Changes Made

### 1. Logo Alt Text
- **File**: `/web/app/components/base/logo/dify-logo.tsx`
- Changed alt text from "Dify logo" to "OctoFlow logo"

### 2. App Title (Mobile)
- **File**: `/web/app/layout.tsx`
- Changed `<meta name="apple-mobile-web-app-title" content="OctoFlow" />`

### 3. PWA Manifest
- **File**: `/web/public/manifest.json`
- Changed `name` and `short_name` from "Dify" to "OctoFlow"

## 🔄 Additional Changes Needed

### Logo Files (IMPORTANT!)
You need to replace the actual logo image files in `/web/public/logo/`:
- `/web/public/logo/logo.svg` - Main logo (light theme)
- `/web/public/logo/logo-monochrome-white.svg` - White logo (dark theme)
- `/web/public/logo/logo-site.svg` - Site logo variant

**Recommended sizes:**
- Default logo: ~120x40px (maintains current aspect ratio)
- Keep SVG format for scalability

### Favicon & App Icons
Replace these icon files in `/web/public/`:
- `favicon.ico`
- `icon-192x192.png`
- `icon-256x256.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-96x96.png`
- `apple-touch-icon.png`

### Text References (1152 matches found)
There are **1152 references to "Dify"** across 398 files. Most are in:

1. **Translation files** (`/web/i18n/*/` folders)
   - Login pages
   - Common translations
   - Education pages
   - All 21 language files

2. **Documentation/Comments**
   - Code comments
   - README files
   - Documentation

3. **User-facing text**
   - Page titles
   - Error messages
   - Help text

### Recommended Approach for Mass Replacement

```bash
# From /web directory
# 1. Replace in translation files
find i18n -type f -name "*.ts" -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 2. Replace in component files (carefully!)
find app/components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Dify/OctoFlow/g' {} +

# 3. Check specific files manually
grep -r "Dify" app/ --include="*.tsx" --include="*.ts" | less
```

**⚠️ WARNING**: Be careful with automated replacement! Some references might be:
- Import paths (e.g., `DifyLogo` component name)
- API endpoints
- Environment variables
- Third-party integrations

### Component Renaming (Optional)
Consider renaming the `DifyLogo` component:
- Rename file: `dify-logo.tsx` → `octoflow-logo.tsx` or `logo.tsx`
- Update all imports across the codebase
- Update component name from `DifyLogo` to `OctoFlowLogo` or just `Logo`

### Environment Variables
Check if any environment variables reference "DIFY":
```bash
grep -r "DIFY" .env* docker/
```

### Backend Changes (if needed)
The backend (`/api` folder) may also have references:
```bash
cd /Users/hillmantam/Downloads/dify-main/api
grep -r "Dify" . --include="*.py" | wc -l
```

## 🚀 Next Steps

1. **Create OctoFlow logo files** (SVG format recommended)
2. **Replace logo files** in `/web/public/logo/`
3. **Replace icon files** in `/web/public/`
4. **Run mass text replacement** (carefully!)
5. **Test thoroughly** - check all pages
6. **Rebuild Docker containers**:
   ```bash
   cd docker
   docker compose down
   docker compose up -d --build
   ```

## 📝 Testing Checklist

After rebranding:
- [ ] Logo displays correctly (light & dark theme)
- [ ] Page titles show "OctoFlow"
- [ ] PWA install shows "OctoFlow"
- [ ] Mobile app title is "OctoFlow"
- [ ] All translations updated
- [ ] No broken references
- [ ] Icons display correctly
- [ ] Footer copyright updated
- [ ] Login/signup pages updated
- [ ] Email templates updated (if any)

## 🎨 Design Considerations

For OctoFlow branding:
- Consider ocean/flow theme colors
- Octopus + flow visualization
- Modern, tech-forward aesthetic
- Maintain professional appearance
- Ensure good contrast for accessibility
