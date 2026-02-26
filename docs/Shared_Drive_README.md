# Shared Drive Template Gallery — Installation & Deployment Guide

**Project:** CCJCPS Training Flyer Template Gallery
**Sprint:** 13a (Shared Drive Adaptation)
**Branch:** `global-share`
**Date:** February 25, 2026

---

## Overview

The Template Gallery is a self-contained React application that lets staff browse, filter, and search training flyer templates. Sprint 13a adapts this gallery for deployment on a **Windows shared drive** (UNC path), so staff can open it directly in Microsoft Edge via the `file://` protocol — no web server, no internet connection, no Cloudflare.

### How It Works

The standard gallery uses `fetch()` to load template data from JSON files. The `file://` protocol blocks `fetch()` due to browser security (CORS). Sprint 13a solves this by injecting all gallery data into a JavaScript global variable (`window.GALLERY_DATA`) via a `<script>` tag that loads before the React app mounts. The app's data loader checks for this global first and only falls back to `fetch()` when it's absent.

```
Normal (Cloudflare):     Browser → fetch('/data/templates.json') → React renders
Shared Drive (file://):  Browser → <script src="gallery-data.js"> → window.GALLERY_DATA → React renders
```

Both paths produce identical gallery behavior. Existing tests validate the fetch path; Sprint 13a tests (SD.1–SD.3) validate the embedded data path.

---

## Prerequisites

- **Node.js** v18+ (v23 tested)
- **npm** v9+
- **Microsoft Edge** (government standard browser, used by staff)
- **Write access** to the target shared drive folder
- Access to the `flyer-template-system` SQLite database (for generating gallery data from production templates)

---

## Quick Start — Building the Gallery

From the `template-gallery` repo root:

```bash
# 1. Install dependencies
npm install

# 2. Run tests to confirm everything passes
npm test

# 3. Build the production bundle
npm run build
```

This produces the `dist/` directory containing the complete gallery application.

---

## What Goes on the Shared Drive

The shared drive folder needs these files and directories:

```
\\SERVER\Share\Training\TemplateGallery\     (example UNC path)
│
├── index.html                  ← from dist/index.html (MODIFIED — see below)
├── gallery-data.js             ← GENERATED (contains all template data)
│
├── assets/
│   ├── index-CBRKdZcd.js       ← from dist/assets/ (bundled React app)
│   └── index-B0PnOiYY.css     ← from dist/assets/ (bundled styles)
│
├── previews/
│   ├── t-001-ileps-basic.png   ← GENERATED preview thumbnails (400x300)
│   ├── t-002-wellness-mindfulness.png
│   └── ...                     (one PNG per approved template)
│
└── vite.svg                    ← from dist/ (favicon, optional)
```

**Note:** The `data/` directory from `dist/` (containing `templates.json`, `categories.json`, `tags.json`) is **not needed** on the shared drive. All data comes from `gallery-data.js` instead.

### File sizes

| File | Approximate Size |
|---|---|
| `index.html` | ~1 KB |
| `assets/index-*.js` | ~205 KB |
| `assets/index-*.css` | ~10 KB |
| `gallery-data.js` | ~5–15 KB (depends on template count) |
| `previews/` (per image) | ~20–40 KB each |
| **Total (12 templates)** | **~500 KB** |

Even with 100 templates and preview images, the total will be well under 10 MB.

---

## Step-by-Step Deployment

### Step 1: Build the Production Bundle

```bash
cd /path/to/template-gallery
npm run build
```

This creates/updates the `dist/` directory.

### Step 2: Create `gallery-data.js`

This file injects template data as a global variable. It must be created from your template data source.

**Structure:**

```javascript
window.GALLERY_DATA = {
  "templates": [
    {
      "id": "t-001-ileps-basic",
      "name": "ILEPS-CCP Basic Training Flyer",
      "status": "APPROVED",
      "layout_pattern": "two-column-split",
      "category": "ILEPS-CCP",
      "color_label": "Forest Green",
      "primary_color": "#1e8449",
      "font_family": "Poppins",
      "wcag_compliant": true,
      "source": "ileps_basic_orientation_02-2026.pdf",
      "variant_type": "FAITHFUL",
      "created_at": "2026-02-01T10:00:00Z",
      "approved_by": "Marty",
      "tags": {
        "program": ["ileps"],
        "audience": ["supervisors", "line-staff"],
        "compliance": ["aoic-required"],
        "time-period": [],
        "custom": []
      },
      "preview_path": "previews/t-001-ileps-basic.png"
    }
    // ... more templates
  ],
  "categories": [
    {
      "id": "program",
      "name": "Program",
      "is_controlled": true,
      "requires_role": null,
      "vocabulary": [
        { "value": "ileps", "display_label": "ILEPS/CCP", "color": "#1e8449", "sort_order": 1, "is_active": true },
        { "value": "cope", "display_label": "COPE", "color": "#2e86c1", "sort_order": 2, "is_active": true },
        { "value": "c5", "display_label": "C5", "color": "#1a5276", "sort_order": 3, "is_active": true },
        { "value": "wellness", "display_label": "Wellness", "color": "#148f77", "sort_order": 4, "is_active": true },
        { "value": "leadership", "display_label": "Leadership", "color": "#1b2631", "sort_order": 5, "is_active": true },
        { "value": "success-planning", "display_label": "Success Planning", "color": "#6c3483", "sort_order": 6, "is_active": true },
        { "value": "data", "display_label": "Data", "color": "#566573", "sort_order": 7, "is_active": true },
        { "value": "ppp", "display_label": "PPP", "color": "#d4ac0d", "sort_order": 8, "is_active": true },
        { "value": "legal-framework", "display_label": "Legal Framework", "color": "#7d3c98", "sort_order": 9, "is_active": true }
      ]
    }
    // ... audience, compliance, time-period, custom categories
  ],
  "tagCloud": [
    { "category": "program", "value": "ileps", "display_label": "ILEPS/CCP", "color": "#1e8449", "count": 4 }
    // ... more tag entries with counts
  ],
  "lastUpdated": "2026-02-25T20:00:00Z",
  "colorSchemes": [
    { "category": "ILEPS-CCP", "label": "Forest Green", "primary": "#1e8449", "wcagCompliant": true },
    { "category": "COPE", "label": "Blue", "primary": "#2e86c1", "wcagCompliant": true },
    { "category": "C5", "label": "Navy", "primary": "#1a5276", "wcagCompliant": true },
    { "category": "Wellness", "label": "Teal", "primary": "#148f77", "wcagCompliant": true },
    { "category": "Leadership", "label": "Charcoal", "primary": "#1b2631", "wcagCompliant": true },
    { "category": "Success Planning", "label": "Deep Purple", "primary": "#6c3483", "wcagCompliant": true },
    { "category": "Data", "label": "Slate", "primary": "#566573", "wcagCompliant": true },
    { "category": "PPP", "label": "Gold", "primary": "#d4ac0d", "wcagCompliant": true },
    { "category": "Legal-Framework", "label": "Purple", "primary": "#7d3c98", "wcagCompliant": true }
  ]
};
```

**Key rules for `gallery-data.js`:**
- Only include **APPROVED** templates (filter out DRAFT and ARCHIVED)
- `preview_path` values must be relative paths (e.g., `"previews/t-001-ileps-basic.png"`)
- `lastUpdated` must be a valid ISO 8601 timestamp
- `colorSchemes` must include all 9 factory palette categories
- Tag cloud `count` values should reflect approved-only template counts

### Step 3: Modify `dist/index.html` for Shared Drive

The built `index.html` needs two changes for `file://` compatibility:

1. **Remove Google Fonts CDN links** (no network access on shared drive)
2. **Add the `gallery-data.js` script tag** before the app script
3. **Change asset paths from absolute to relative** (remove leading `/`)

Edit `dist/index.html` to look like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Template Gallery — CCJCPS</title>
    <script src="gallery-data.js"></script>
    <script type="module" crossorigin src="assets/index-CBRKdZcd.js"></script>
    <link rel="stylesheet" crossorigin href="assets/index-B0PnOiYY.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Changes from the original `dist/index.html`:**

| Line | Original | Shared Drive Version | Why |
|---|---|---|---|
| favicon | `href="/vite.svg"` | `href="vite.svg"` | Relative path for `file://` |
| fonts | 3 Google Fonts `<link>` tags | Removed entirely | No network access; DM Sans is bundled in the CSS |
| data | (none) | `<script src="gallery-data.js"></script>` | Injects `window.GALLERY_DATA` before React mounts |
| JS | `src="/assets/index-*.js"` | `src="assets/index-*.js"` | Relative path (no leading `/`) |
| CSS | `href="/assets/index-*.css"` | `href="assets/index-*.css"` | Relative path (no leading `/`) |

**Important:** The `gallery-data.js` script tag must appear **before** the app's `index-*.js` script tag so `window.GALLERY_DATA` is available when React initializes.

### Step 4: Generate Preview Images

Place a 400x300 PNG for each approved template in the `previews/` directory. The filename must match what's in the template's `preview_path` field in `gallery-data.js`.

```
previews/
├── t-001-ileps-basic.png
├── t-002-wellness-mindfulness.png
├── t-003-c5-resilience.png
└── ...
```

If preview images aren't available yet, the gallery will show a placeholder. Templates with `"preview_path": null` in the data will display the built-in placeholder SVG.

### Step 5: Copy to the Shared Drive

Copy the prepared files to the target location:

```
From dist/:                           To shared drive:
  index.html (modified)          →    \\SERVER\Share\...\index.html
  assets/                        →    \\SERVER\Share\...\assets\
  vite.svg                       →    \\SERVER\Share\...\vite.svg

Generated:
  gallery-data.js                →    \\SERVER\Share\...\gallery-data.js
  previews/                      →    \\SERVER\Share\...\previews\
```

**Do NOT copy** `dist/data/` — that directory contains JSON files used by the fetch-based (Cloudflare) loading path and is unnecessary for the shared drive version.

### Step 6: Verify

1. Navigate to the shared drive folder in Windows Explorer
2. Double-click `index.html`
3. Microsoft Edge should open and display the template gallery
4. Verify: template cards appear, filters work, search works, detail view opens

---

## Updating the Gallery

When templates change (new approvals, updated metadata, new preview images):

1. **Regenerate `gallery-data.js`** with the updated template data
2. **Add/replace preview PNGs** in the `previews/` folder for any new or changed templates
3. **Copy the updated files** to the shared drive (overwrite the old ones)

The app bundle (`assets/index-*.js`, `assets/index-*.css`, `index.html`) only needs to be updated when the gallery **code** changes (new features, bug fixes). Data-only updates only require replacing `gallery-data.js` and preview images.

---

## Running Tests

### All tests (full regression suite)

```bash
npm test
# or equivalently:
npx vitest run --reporter=verbose
```

Expected output: **37 passed, 9 todo, 0 failed** (46 total)

### Shared drive tests only

```bash
npm run test:loop13a1
# or equivalently:
npx vitest run test/shared-drive.test.ts --reporter=verbose
```

Expected output: **3 passed, 9 todo**

### Test breakdown

| File | Tests | Focus |
|---|---|---|
| `test/components.test.tsx` | 8 | Core components (cards, badges, chips, swatches) |
| `test/gallery-filter.test.tsx` | 8 | Filtering, search, URL state sync |
| `test/detail-actions.test.tsx` | 8 | Detail view, metadata, actions |
| `test/uat-automated.test.tsx` | 10 | User acceptance (loading, error, filter combos) |
| `test/shared-drive.test.ts` | 3 pass + 9 todo | Shared drive data loader and planned infrastructure |

### What the passing shared drive tests verify

| Test | ID | What It Proves |
|---|---|---|
| 35 | SD.1 | `loadTemplates()`, `loadCategories()`, `loadTagCloud()` all read from `window.GALLERY_DATA` and `fetch()` is never called |
| 36 | SD.2 | `GalleryData.lastUpdated` is a valid ISO 8601 timestamp |
| 37 | SD.3 | `GalleryData.colorSchemes` contains all 9 factory palette categories with valid hex colors |

### What the todo tests are waiting for

| Tests | IDs | Blocked On |
|---|---|---|
| SD.4–SD.6 | File protocol rendering | Puppeteer/Playwright (Sprint 13a Loop 2) |
| SD.7–SD.10 | Export script | `scripts/export-shared-drive.ts` (Sprint 13a Loop 1/3) |
| SD.11–SD.12 | Integration | Both of the above + cross-repo SQLite access |

These are `test.todo()` (not `test.skip()`) because they can't even have meaningful test bodies written yet — the infrastructure doesn't exist.

---

## Architecture: How the Data Loader Works

The dual-source data loader lives in `src/data/loader.ts`:

```typescript
export async function loadTemplates(): Promise<Template[]> {
  if (window.GALLERY_DATA?.templates) return window.GALLERY_DATA.templates;
  const response = await fetch('/data/templates.json');
  if (!response.ok) throw new Error('Failed to load templates');
  return response.json();
}
```

**Flow:**

```
                    ┌─────────────────────────┐
                    │   window.GALLERY_DATA    │
                    │   defined?               │
                    └─────┬───────────┬────────┘
                          │ YES       │ NO
                          ▼           ▼
                  Return embedded   fetch() JSON
                  data instantly    from /data/
                          │           │
                          ▼           ▼
                    ┌─────────────────────────┐
                    │  useTemplates hook       │
                    │  (same for both paths)   │
                    └─────────────────────────┘
```

This means:
- **Shared drive:** `gallery-data.js` sets `window.GALLERY_DATA` → loader returns it directly → no network calls
- **Cloudflare:** No `gallery-data.js` → `window.GALLERY_DATA` is undefined → loader uses `fetch()`
- **Tests (existing 34):** Never set `window.GALLERY_DATA` → always use the mocked `fetch()` path → zero regressions

The `useTemplates` hook and all downstream components are completely unaware of which data source was used. The return type is always `Promise<T>`.

---

## TypeScript Interfaces

Sprint 13a adds these types to `src/types/index.ts`:

```typescript
export interface ColorScheme {
  category: string;      // e.g., "ILEPS-CCP", "C5", "PPP"
  label: string;         // e.g., "Forest Green", "Navy", "Gold"
  primary: string;       // hex color, e.g., "#1e8449"
  wcagCompliant: boolean;
}

export interface GalleryData {
  templates: Template[];
  categories: CategoryWithVocabulary[];
  tagCloud: TagCloudEntry[];
  lastUpdated: string;          // ISO 8601
  colorSchemes: ColorScheme[];  // 9 factory palette entries
}
```

The `Window` interface is extended globally so TypeScript recognizes `window.GALLERY_DATA`:

```typescript
declare global {
  interface Window {
    GALLERY_DATA?: GalleryData;
  }
}
```

---

## Factory Color Palette (9 Categories)

The color schemes come from the `flyer-template-system` factory palette, which is the canonical source for WCAG-validated program colors:

| Category | Label | Primary Color | WCAG AA |
|---|---|---|---|
| ILEPS-CCP | Forest Green | `#1e8449` | Yes |
| COPE | Blue | `#2e86c1` | Yes |
| C5 | Navy | `#1a5276` | Yes |
| Wellness | Teal | `#148f77` | Yes |
| Leadership | Charcoal | `#1b2631` | Yes |
| Success Planning | Deep Purple | `#6c3483` | Yes |
| Data | Slate | `#566573` | Yes |
| PPP | Gold | `#d4ac0d` | Yes |
| Legal-Framework | Purple | `#7d3c98` | Yes |

---

## Troubleshooting

### Gallery shows "Loading templates..." and never finishes

**Cause:** `gallery-data.js` is missing or not loading before the app.

**Fix:** Verify that:
1. `gallery-data.js` exists in the same folder as `index.html`
2. The `<script src="gallery-data.js"></script>` tag appears **before** the `<script type="module" ...>` tag in `index.html`
3. The file starts with `window.GALLERY_DATA = ` (not `const` or `let`)

### Gallery shows error state

**Cause:** `window.GALLERY_DATA` is not set AND `fetch()` fails (expected on `file://`).

**Fix:** Same as above — ensure `gallery-data.js` is present and loading.

### Blank page, no content at all

**Cause:** JavaScript may be blocked for local files, or asset paths are wrong.

**Fix:**
1. Open Edge DevTools (F12) and check the Console tab for errors
2. Verify asset paths in `index.html` are **relative** (no leading `/`)
3. Check Edge settings: `edge://settings/content/javascript` — ensure local file access is not blocked

### Images not showing

**Cause:** Preview PNG files are missing or `preview_path` in the data doesn't match the filename.

**Fix:** Verify that:
1. The `previews/` folder exists alongside `index.html`
2. Each PNG filename matches the `preview_path` value (e.g., `"previews/t-001-ileps-basic.png"` → file at `previews/t-001-ileps-basic.png`)
3. Templates without preview images should have `"preview_path": null` in the data

### Fonts look different from the Cloudflare version

**Cause:** The development `index.html` loads DM Sans from Google Fonts CDN. The shared drive version has no network access.

**Note:** DM Sans is bundled in the CSS file (`assets/index-*.css`) at build time, so fonts should render correctly. If they don't, the system font (Segoe UI on Windows) will be used as a fallback — this is acceptable for government machines.

---

## Project Structure Reference

```
template-gallery/
├── src/
│   ├── types/index.ts          # All TypeScript types including GalleryData
│   ├── data/loader.ts          # Dual-source loader (window.GALLERY_DATA → fetch)
│   ├── hooks/
│   │   ├── useTemplates.ts     # Load, filter, search — consumes loader
│   │   └── useTagCloud.ts      # Tag frequency computation
│   ├── components/             # 10 React components (CSS Modules)
│   └── styles/                 # CSS variables and globals
├── public/data/                # JSON for Cloudflare path (not used on shared drive)
├── dist/                       # Build output — basis for shared drive deployment
├── test/
│   ├── components.test.tsx     # 8 tests — Sprint 13 Loop 1
│   ├── gallery-filter.test.tsx # 8 tests — Sprint 13 Loop 2
│   ├── detail-actions.test.tsx # 8 tests — Sprint 13 Loop 3
│   ├── uat-automated.test.tsx  # 10 tests — Sprint 13 UAT
│   └── shared-drive.test.ts   # 3+9 tests — Sprint 13a
├── docs/
│   ├── CLAUDE.md               # AI assistant instructions
│   ├── Shared_Drive_README.md  # THIS FILE
│   └── ...                     # Sprint specs and test docs
└── package.json                # Scripts including test:loop13a1
```

---

## npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Local dev server at localhost:5173 |
| `npm run build` | `tsc -b && vite build` | Production build to `dist/` |
| `npm test` | `vitest run` | Run all tests |
| `npm run test:loop13a1` | `vitest run test/shared-drive.test.ts --reporter=verbose` | Shared drive tests only |

---

## What's Next (Planned for Sprint 13a Loops 2–3)

| Item | Sprint Loop | What It Enables |
|---|---|---|
| `vite.config.ts` `base: './'` | 13a.2 | Relative asset paths in build output (no manual `index.html` editing) |
| Remove Google Fonts from `index.html` | 13a.2 | Zero external network requests in dev mode too |
| Puppeteer/Playwright | 13a.2 | Automated `file://` protocol testing (SD.4–SD.6) |
| `scripts/export-shared-drive.ts` | 13a.3 | One-command export: SQLite → `gallery-data.js` + previews |
| `npm run export:shared-drive` | 13a.3 | Full pipeline: build + export + copy to target directory |
| Cross-repo SQLite access | 13a.3 | Read approved templates from `flyer-template-system` database |

Once these are complete, the deployment steps above will be replaced by a single command:

```bash
npm run export:shared-drive -- --output "\\SERVER\Share\Training\TemplateGallery"
```

---

*February 25, 2026 — Sprint 13a, Loop 13a.1*
