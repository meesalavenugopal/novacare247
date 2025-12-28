# NovaCare 24/7 - Production Action Items

## Required Assets to Create

| Asset | Size | Format | Location |
|-------|------|--------|----------|
| **og-image.jpg** | 1200×630 px | JPG | `frontend/public/og-image.jpg` |
| **icon-192.png** | 192×192 px | PNG | `frontend/public/icon-192.png` |
| **icon-512.png** | 512×512 px | PNG | `frontend/public/icon-512.png` |
| **logo.png** | 200×200 px (min) | PNG | `frontend/public/logo.png` |

---

## Design Specifications

### og-image.jpg (Social Sharing Preview)
- **Dimensions:** 1200×630 px
- **Format:** JPG (required for Facebook, LinkedIn, Twitter, WhatsApp)
- **Content:** NovaCare logo, tagline "Expert Physiotherapy Across India", brand colors
- **Reference:** Use `frontend/public/og-image.svg` as design template

### icon-192.png & icon-512.png (PWA Icons)
- **Dimensions:** 192×192 px and 512×512 px
- **Format:** PNG with transparency
- **Content:** NovaCare "N" logo with brand gradient, square with safe area
- **Reference:** Use `frontend/public/icon-192.svg` and `frontend/public/icon-512.svg` as templates

### logo.png (JSON-LD Structured Data)
- **Dimensions:** Minimum 200×200 px (square or horizontal)
- **Format:** PNG with transparent background preferred
- **Usage:** Google rich snippets, knowledge panel

---

## Post-Deployment Tasks

### 1. Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap: `https://novacare247.com/sitemap.xml`
- [ ] Request indexing for key pages

### 2. Bing Webmaster Tools
- [ ] Verify domain ownership
- [ ] Submit sitemap: `https://novacare247.com/sitemap.xml`

### 3. Google Analytics 4
- [ ] Create GA4 property
- [ ] Add tracking code to `index.html`
- [ ] Set up conversion events (booking, contact form)

### 4. Google Business Profile
- [ ] Create/claim business profile for each branch location
- [ ] Add consistent NAP (Name, Address, Phone)
- [ ] Upload photos, services, hours

---

## Update manifest.json After Creating PNG Icons

Once PNG icons are created, update `frontend/public/manifest.json`:

```json
"icons": [
  {
    "src": "/favicon.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  },
  {
    "src": "/icon-192.png",
    "type": "image/png",
    "sizes": "192x192",
    "purpose": "any maskable"
  },
  {
    "src": "/icon-512.png",
    "type": "image/png",
    "sizes": "512x512",
    "purpose": "any maskable"
  }
]
```

---

## Files Ready to Commit

All SEO implementation is complete. The following files are ready:

### New Files
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml` (302 city URLs)
- `frontend/public/manifest.json`
- `frontend/public/icon-192.svg` (design template)
- `frontend/public/icon-512.svg` (design template)
- `frontend/public/og-image.svg` (design template)
- `frontend/src/components/SEO.jsx`
- `frontend/src/data/indianCities.js` (500+ cities)
- `frontend/src/data/indiaLocations.js`
- `frontend/src/pages/LocationPage.jsx` (150+ conditions, 75+ services)
- `frontend/scripts/generateSitemap.js`

### Modified Files
- `frontend/index.html` (structured data, meta tags)
- `frontend/src/App.jsx` (routes)
- `frontend/src/main.jsx` (HelmetProvider)
- `frontend/package.json` (react-helmet-async)
- All 12 page files (SEO component added)

---

## Brand Colors Reference

- Primary: `#0ea5e9` (Sky Blue)
- Primary Dark: `#0284c7`
- Accent: `#10b981` (Emerald)
- Text: `#1e293b` (Slate)
- Background: `#f8fafc`

---

*Generated: 28 December 2025*
