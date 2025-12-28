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

## SEO Ranking Strategy

### Understanding What Drives Rankings

| Factor | Impact | Current Status |
|--------|--------|----------------|
| **Backlinks** (other sites linking to you) | 🔴 Very High | ❌ Need to build |
| **Content quality** (unique, helpful) | 🔴 Very High | ❌ Need real content |
| **Google Business Profile** | 🔴 Very High | ❌ Need to create |
| **Reviews** (Google, Practo, etc.) | 🔴 Very High | ❌ Need real reviews |
| **Domain age & authority** | 🟡 Medium | ⏳ Takes time |
| **Page speed** | 🟢 Low-Medium | ✅ Vite is fast |
| **Technical SEO** | 🟢 Low-Medium | ✅ Complete |

> **Important:** Technical SEO (what we built) = ~20% of ranking. Content + Backlinks + Reviews = ~80% of ranking.

---

## Off-Page SEO Tasks (Critical for Ranking)

### 1. Google Business Profile (HIGH PRIORITY)
- [ ] Create Google Business Profile for each clinic location
- [ ] Add consistent NAP (Name, Address, Phone) across all listings
- [ ] Upload high-quality photos of clinic, staff, equipment
- [ ] Add all services offered
- [ ] Set accurate business hours
- [ ] Enable messaging and booking

### 2. Healthcare Directory Listings
- [ ] **Practo** - Create clinic and doctor profiles
- [ ] **Lybrate** - List all doctors and services
- [ ] **Justdial** - Claim/create business listing
- [ ] **Sulekha** - Add to healthcare category
- [ ] **Credihealth** - Create provider profile
- [ ] **Clinicspots** - List physiotherapy clinic

### 3. Local Directory Listings
- [ ] **IndiaMART** - Add business listing
- [ ] **TradeIndia** - Create company profile
- [ ] **Yellow Pages India** - Submit business
- [ ] **Hotfrog** - Add business listing
- [ ] **Yelp India** - Claim business

### 4. Review Generation Strategy
- [ ] Ask satisfied patients to leave Google reviews
- [ ] Request reviews on Practo after appointments
- [ ] Create QR codes at clinic linking to review page
- [ ] Respond to all reviews (positive and negative)
- [ ] Aim for 50+ Google reviews per location

### 5. Backlink Building
- [ ] Guest post on health/wellness blogs
- [ ] Get listed in local business associations
- [ ] Partner with gyms, sports clubs for referrals
- [ ] Sponsor local sports events (get backlinks)
- [ ] Create shareable infographics about physiotherapy

### 6. Content Marketing
- [ ] Start a blog section on the website
- [ ] Write articles about common conditions (back pain, sports injuries)
- [ ] Create exercise/stretching guides with images
- [ ] Publish patient success stories (with consent)
- [ ] Add FAQ pages for each condition/service

### 7. Social Media Presence
- [ ] Create Instagram account with tips and exercises
- [ ] Facebook page with patient education content
- [ ] YouTube channel with exercise demonstrations
- [ ] LinkedIn for professional networking

---

## Timeline for SEO Results

| Milestone | Expected Timeline |
|-----------|-------------------|
| Google indexes sitemap | 1-2 weeks |
| Pages appear in search | 2-4 weeks |
| Initial rankings (page 2-5) | 1-3 months |
| Competitive rankings (page 1) | 3-6 months |
| Top 3 rankings | 6-12 months |

> **Note:** Rankings depend heavily on competition, backlinks, and content quality. Consistent effort is required.

---

*Generated: 28 December 2025*
