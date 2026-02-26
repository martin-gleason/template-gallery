# Sprint 13a: Shared Drive Flyer Template Gallery

## Adapting the React Gallery for Windows Shared Drive Deployment

**Prepared for:** Marty Gleason, DCPO
**Date:** February 25, 2026
**Version:** 1.0 — Updated with Sprint 13 Completion Data
**Parent Sprint:** Sprint 13 (React Template Gallery — ✅ Complete)
**Relationship:** Sprint 13a **adapts** Sprint 13's gallery for government-friendly offline hosting
**Depends on:** Sprint 13 (complete), Role Clarification Sprint (complete, merged)
**Repos:** `martin-gleason/template-gallery` (Sprint 13) · `martin-gleason/flyer-template-system` (backend)

---

## What Sprint 13 Built (Completed Feb 25, 2026)

Before planning 13a, here's what already exists and is tested:

### template-gallery Repo (24/24 tests, 3 Ralph loops)

**Stack:** React + Vite + TypeScript + CSS Modules (DM Sans font, Cook County professional palette)

**Components built and tested:**

| Loop | Components | Tests |
|---|---|---|
| 13.1 — Core | ColorSwatch, StatusBadge, TagChip, EmptyState, TemplateCard | 8 |
| 13.2 — Gallery & Filtering | useTemplates hook, useTagCloud hook, GalleryGrid, FilterSidebar, SearchBar, App (with URL state sync) | 8 |
| 13.3 — Detail View & Actions | TemplateDetail (full-page, not modal), metadata grid, tags grouped by category, audit trail, Download PDF / Export HTML buttons | 8 |

**Data:** 12 sample templates in JSON (7 APPROVED, 3 DRAFT, 2 ARCHIVED), 5 tag categories with controlled vocabularies.

**Data flow (Sprint 13 design):** SQLite → `export-gallery-data.ts` → JSON + PNG thumbnails → gallery repo → Cloudflare auto-deploy

**Key technical facts:**
- No router, no state library — `useState` only
- `global.fetch` loads template data (mocked in tests)
- Radix UI Dialog and Checkbox installed but not yet wired
- `npm run build` → dist/ folder. `npm run dev` → localhost:5173
- 4 commits on main, pushed to GitHub

### flyer-template-system Repo (543/543 tests, 56 files)

- Role Clarification merged: 35 tests, extension bridge working
- Factory palette is canonical source (9 categories, WCAG-validated)
- SQLite via better-sqlite3, database stored at `~/.flyer-template-system/`
- Sprint 12 (Tag System Upgrade) handoff ready but not yet executed

---

## Why Sprint 13a

Sprint 13 targets Cloudflare Pages with Cloudflare Access — great for external stakeholders, but it requires:
- Cloudflare account setup and configuration
- External hosting that Cook County IT might flag or block
- Internet access to view templates

Sprint 13a puts the **same gallery** on a **Windows shared drive** so staff can browse templates from their government machines without external dependencies. Double-click `index.html`, see templates.

**The core technical challenge:** The React gallery uses `fetch()` to load JSON data. The `file://` protocol that browsers use for local files blocks `fetch()` due to CORS security. Sprint 13a must solve this.

---

## Part 1: Clarifying Questions

> **Instructions:** Fill in every `[ YOUR ANSWER ]` field. Your answers directly drive the technical plan and test scope. Return this document to Claude when complete.

### 1.1 Shared Drive Environment

| # | Question | Your Answer | Why This Matters |
|---|---|---|---|
| Q1 | What is the UNC path to the shared drive? (e.g., `\\CCJFS01\Training\`) | [ YOUR ANSWER ] | Path conventions, filename limits, special character escaping |
| Q2 | Is this drive mapped to a letter on your machine? (e.g., `S:\Training\`) | [ YOUR ANSWER ] | Easier for scripts to target during development |
| Q3 | Who has **write** access? (just you? Tammi? IT?) | [ YOUR ANSWER ] | Determines who can deploy updates |
| Q4 | Who has **read** access? (all 320 staff? specific groups?) | [ YOUR ANSWER ] | Whether we need access control beyond the drive's existing permissions |
| Q5 | Approximate storage limit on the shared drive? | [ YOUR ANSWER ] | Preview PNGs add up — need to know if 500MB is fine or tight |
| Q6 | Existing folder structure convention? (e.g., `Training Materials > 2026 > Templates`) | [ YOUR ANSWER ] | Follow existing patterns so it doesn't look alien to staff |
| Q7 | Can staff open `.html` files from the shared drive in their browser? | [ YOUR ANSWER ] | **Critical.** If IT blocks local HTML execution, we pivot to a PDF catalog. |

### 1.2 Browser Access Model

| # | Question | Your Answer | Why This Matters |
|---|---|---|---|
| Q8 | Which browser access model do you want? | [ PICK ONE OR DESCRIBE ] | Each has different requirements |
| | **Option A:** Double-click `index.html` → opens in Edge (`file://` protocol) | | Simplest. No server. Some JS limitations — solvable with Vite build. |
| | **Option B:** Lightweight local web server serves the folder (e.g., `http://localhost:8080/templates`) | | Full JS capability. Requires a running process on a machine. |
| | **Option C:** IIS on the file server with a virtual directory | | Best experience. Requires IT to configure. |
| | **Option D:** Something else | | |
| Q9 | What browser do staff use? | [ YOUR ANSWER ] | Edge is standard on government machines. Affects CSS/JS targets. |
| Q10 | Is JavaScript enabled for local files in the browser? | [ YOUR ANSWER or UNSURE ] | If unsure, we'll test early and build a no-JS fallback. |

### 1.3 Gallery Scope — What Should Staff See?

The Sprint 13 React gallery already supports all of these. The question is which ones matter for the shared drive audience.

| # | Feature (Sprint 13 status) | Include in 13a? | Notes |
|---|---|---|---|
| Q11a | Browse templates by training type (✅ built) | [ YES / NO ] | |
| Q11b | Visual preview thumbnails per template (✅ built) | [ YES / NO ] | |
| Q11c | Template details: name, category, status, colors (✅ built) | [ YES / NO ] | |
| Q11d | Filter by training type — C5, ILEPS, etc. (✅ built) | [ YES / NO ] | |
| Q11e | Filter by status — Approved, Draft, Archived (✅ built) | [ YES / NO ] | |
| Q11f | Search bar (✅ built) | [ YES / NO ] | |
| Q11g | Tag cloud with 5 tag categories (✅ built) | [ YES / NO ] | |
| Q11h | Detail view with metadata grid + audit trail (✅ built) | [ YES / NO ] | |
| Q11i | Download PDF / Export HTML buttons (✅ built) | [ YES / NO ] | Download only works if files are co-located on the drive |
| Q11j | Print a template catalog (all on one page) | [ YES / NO / NICE TO HAVE ] | New feature — not in Sprint 13 |
| Q11k | Copy template name to clipboard (for MCP request) | [ YES / NO / NICE TO HAVE ] | New feature |
| Q12 | Show only approved templates, or also drafts? | [ YOUR ANSWER ] | Approved-only is cleaner. Drafts useful if approvers (Tammi, Bridgitt) use this too. |
| Q13 | Display bridge compatibility indicators? (`bridgeCompatible`, `mcpCategoryKey`) | [ YOUR ANSWER ] | Useful for technical users; may confuse non-technical staff |

### 1.4 Data Flow and Update Cadence

| # | Question | Your Answer | Why This Matters |
|---|---|---|---|
| Q14 | How should gallery data get updated? | [ PICK ONE ] | |
| | **Option A:** You run `npm run export:shared-drive` on your Mac, then copy to the drive | | Simplest. You control when. |
| | **Option B:** Script copies directly to the UNC path (one command) | | Still manual trigger, but fewer steps. |
| | **Option C:** Scheduled nightly export | | Hands-off. Needs a running machine. |
| Q15 | Should the gallery show "Last updated: [date]"? | [ YOUR ANSWER ] | Helps staff know if data is current |

### 1.5 Relationship to Sprint 13 (Cloudflare)

| # | Question | Your Answer | Why This Matters |
|---|---|---|---|
| Q16 | Does Sprint 13a **replace** Sprint 13, or do both coexist? | [ PICK ONE ] | |
| | **Option A:** Replace — shared drive only, no Cloudflare | | |
| | **Option B:** Both — shared drive for internal staff, Cloudflare for external (AOIC, Annie E. Casey) | | |
| | **Option C:** Shared drive now, Cloudflare later (sequential) | | |
| Q17 | Should the MCP's `list_available_templates` tool return the same data the gallery shows? | [ YOUR ANSWER ] | Keeps gallery and MCP in sync — staff see the same templates everywhere |

---

## Part 2: Architecture — Two Build Strategies

Sprint 13a has two viable approaches. Your answers to Q7–Q10 determine which one we use.

### Strategy A: Vite Static Build (Preferred if JS works with `file://`)

**Concept:** Take the existing React gallery, modify data loading to use embedded JS instead of `fetch()`, and run `npm run build` to produce a self-contained `dist/` folder that works offline.

```
template-gallery/ (existing repo)
├── src/                     # Existing React code
│   ├── data-loader.ts       # MODIFY: support embedded data via <script> tag
│   └── ...                  # All other components unchanged
├── scripts/
│   └── export-shared-drive.ts   # NEW: builds + copies to shared drive path
├── dist/                    # Vite output — this IS the shared drive content
│   ├── index.html           # Self-contained, all JS/CSS bundled
│   ├── assets/
│   │   ├── index-[hash].js  # Bundled React app
│   │   └── index-[hash].css # Bundled styles
│   ├── gallery-data.js      # Template metadata as JS variable
│   └── previews/
│       ├── default-c5.png
│       └── ...
└── tests/
    └── shared-drive.test.ts # NEW: Sprint 13a-specific tests
```

**Why this works:** Vite bundles everything into static files. The only change is how data loads — instead of `fetch('/data/templates.json')`, the app reads from `window.GALLERY_DATA` populated by a `<script>` tag. All existing components, filtering, search, detail view, and styling carry over untouched.

**Advantages:**
- Reuses 100% of Sprint 13's tested components
- Vite's build is already working (`npm run build` confirmed)
- CSS Modules get compiled to regular CSS in the build
- DM Sans font bundled (no Google Fonts CDN)
- One repo, two deployment targets (Cloudflare + shared drive)

**Risk:** If `file://` blocks JS execution on government machines, this doesn't work. Mitigated by Q7 answer.

### Strategy B: Static HTML Generator (Fallback if JS is blocked)

**Concept:** A Node script reads the same gallery data and **pre-renders** a pure HTML/CSS page with no JavaScript required. Filtering happens via CSS `:target` selectors or simply shows everything on one page.

```
flyer-template-system/ (existing repo)
├── src/export/
│   └── export-static-gallery.ts  # NEW: generates pure HTML gallery
├── gallery-output/                # Generated output for shared drive
│   ├── index.html                 # Pre-rendered, zero JS
│   ├── gallery.css                # Inlined or linked
│   └── previews/
│       └── ...
└── tests/
    └── static-gallery.test.ts     # NEW: Sprint 13a tests
```

**Advantages:**
- Works even with JS disabled
- No browser compatibility concerns
- Printable by default

**Disadvantages:**
- No interactive filtering (or limited CSS-only filtering)
- No search
- No detail view (or all details always visible)
- Doesn't reuse Sprint 13 components — new code

### Decision Matrix

| Factor | Strategy A (Vite Build) | Strategy B (Static HTML) |
|---|---|---|
| Reuses Sprint 13 code | ✅ 100% | ❌ New build |
| Interactive filtering | ✅ Full | ❌ Limited/none |
| Search | ✅ Yes | ❌ No |
| Detail view | ✅ Yes | ❌ All-on-page or none |
| Works without JS | ❌ No | ✅ Yes |
| Test count | ~10 new (existing 24 still run) | ~20 new |
| Build complexity | Low (modify data loader) | Medium (new generator) |

**Recommendation:** Start with Strategy A. Test Q7 early — if HTML+JS works from the shared drive, we're done with minimal new code. If not, pivot to Strategy B.

---

## Part 3: TDD Test Specification

### Strategy A Tests (Vite Build for Shared Drive)

These tests are **additive** to Sprint 13's existing 24 tests. They test the shared-drive-specific adaptations.

```typescript
// tests/shared-drive.test.ts

import { describe, it, expect } from 'vitest';

describe('Sprint 13a — Shared Drive Adaptation', () => {

  // === DATA LOADING (3 tests) ===

  it('13a.SD.1: should load gallery data from embedded <script> tag instead of fetch', async () => {
    // Setup: gallery-data.js with window.GALLERY_DATA = {...}
    // Open built index.html in Puppeteer via file:// protocol
    // Verify: templates render (card count matches data)
    // Verify: no fetch() calls made (check network activity)
  });

  it('13a.SD.2: should include lastUpdated timestamp in embedded data', async () => {
    // Run: export script
    // Parse gallery-data.js
    // Verify: window.GALLERY_DATA.lastUpdated is valid ISO 8601
    // Verify: timestamp within 1 minute of export time
  });

  it('13a.SD.3: should include factory color palette in embedded data', async () => {
    // Run: export script
    // Parse gallery-data.js
    // Verify: window.GALLERY_DATA.colorSchemes has all 9 categories
    // Verify: colors match factory's WCAG-validated palette
    // (9 categories, not the MCP's original 6)
  });

  // === FILE:// PROTOCOL COMPATIBILITY (3 tests) ===

  it('13a.SD.4: should render gallery when opened via file:// protocol', async () => {
    // Build: npm run build
    // Copy dist/ to temp directory
    // Add gallery-data.js with sample data
    // Open via file:///tmp/gallery-test/index.html in Puppeteer
    // Verify: page loads without errors, template cards render
  });

  it('13a.SD.5: should have zero external network requests', async () => {
    // Open built gallery via file:// in Puppeteer
    // Monitor all network requests
    // Verify: zero requests to any external domain
    // (no CDN, no Google Fonts, no analytics)
  });

  it('13a.SD.6: should load all preview images from relative paths', async () => {
    // Setup: dist/ with previews/ directory containing PNGs
    // Open via file://
    // Check each <img> element: naturalWidth > 0 (loaded successfully)
    // Verify: all src attributes use relative paths (no absolute URLs)
  });

  // === EXPORT SCRIPT (4 tests) ===

  it('13a.SD.7: should export gallery-data.js from SQLite registry', async () => {
    // Setup: seed SQLite with 3 approved templates
    // Run: exportForSharedDrive(db, outputDir)
    // Verify: gallery-data.js exists in outputDir
    // Verify: starts with "window.GALLERY_DATA = "
    // Verify: contains 3 templates (not drafts)
  });

  it('13a.SD.8: should generate preview PNGs at thumbnail size', async () => {
    // Run: exportForSharedDrive(db, outputDir)
    // Verify: previews/ directory has PNGs for each template × category
    // Verify: dimensions are 400×300 (or proportional)
  });

  it('13a.SD.9: should copy built dist/ plus gallery data to target directory', async () => {
    // Run: npm run export:shared-drive -- --output /tmp/sd-test
    // Verify: index.html exists
    // Verify: assets/ directory with JS + CSS bundles
    // Verify: gallery-data.js exists
    // Verify: previews/ directory exists
  });

  it('13a.SD.10: should handle export when no approved templates exist', async () => {
    // Setup: empty SQLite
    // Run: exportForSharedDrive(db, outputDir)
    // Verify: gallery-data.js created with templates: []
    // Verify: gallery renders "No templates available" (EmptyState component)
  });

  // === INTEGRATION (2 tests) ===

  it('13a.SD.11: should survive full round-trip: seed DB → export → open → verify', async () => {
    // Seed SQLite with known data
    // Run full export pipeline
    // Open via file:// in Puppeteer
    // Extract displayed template names and descriptions
    // Verify: matches seeded data exactly
  });

  it('13a.SD.12: should produce identical template list as Cloudflare gallery', async () => {
    // Run: export for shared drive (gallery-data.js)
    // Run: export for Cloudflare (templates.json)
    // Compare: template IDs, names, categories, statuses
    // Verify: same data, different format (JS variable vs JSON file)
  });
});
```

### Strategy B Tests (Static HTML Fallback — Only if Strategy A fails)

```typescript
// tests/static-gallery.test.ts
// Only used if Q7 reveals JS is blocked on government machines

describe('Sprint 13a — Static HTML Gallery (No-JS Fallback)', () => {

  it('13a.STATIC.1: should generate valid HTML with zero <script> tags', async () => {
    // Run: generateStaticGallery(db, outputDir)
    // Read index.html
    // Verify: no <script> tags anywhere
    // Verify: valid HTML5 document
  });

  it('13a.STATIC.2: should display all approved templates as visible cards', async () => {
    // Setup: 5 approved templates
    // Generate static HTML
    // Open in Puppeteer
    // Verify: 5 template cards visible without any interaction
  });

  it('13a.STATIC.3: should include color swatches as inline CSS backgrounds', async () => {
    // Generate static HTML
    // Verify: each .color-swatch has inline style with background-color
    // Verify: colors match factory palette
  });

  it('13a.STATIC.4: should be printable on one page for catalogs up to 10 templates', async () => {
    // Generate static HTML with 10 templates
    // Use Puppeteer page.pdf() to render
    // Verify: PDF is ≤ 3 pages
  });

  it('13a.STATIC.5: should include preview thumbnails as embedded images', async () => {
    // Generate static HTML
    // Verify: <img> tags have src pointing to relative previews/ path
    // Verify: images load successfully
  });

  it('13a.STATIC.6: should meet WCAG AA contrast for all text', async () => {
    // Generate static HTML
    // Open in Puppeteer
    // Verify: all text meets >= 4.5:1 contrast ratio
  });

  it('13a.STATIC.7: should display last-updated timestamp', async () => {
    // Generate static HTML
    // Verify: contains formatted date string
  });

  it('13a.STATIC.8: should include README.txt in output directory', async () => {
    // Run: generateStaticGallery(db, outputDir)
    // Verify: README.txt exists with plain-text explanation
  });
});
```

### Test Count Summary

| Scenario | New Tests | Existing Tests | Total |
|---|---|---|---|
| **Strategy A** (Vite build works with file://) | 12 | 24 (Sprint 13) | 36 |
| **Strategy B** (JS blocked, static fallback) | 8 | 24 (Sprint 13) | 32 |
| **Both** (if Q16 = "both coexist") | 12 + 8 | 24 (Sprint 13) | 44 |

---

## Part 4: Ralph Wiggum Loop Plan

### Strategy A Loops (Primary Path)

| Loop | Target | Tests | Max Iterations | Success Criteria |
|---|---|---|---|---|
| **Loop 13a.1** | Modify data loader for embedded `<script>` + export script | 13a.SD.1–3, 13a.SD.7, 13a.SD.10 | 25 | 5/5 tests green |
| **Loop 13a.2** | `file://` compatibility + preview generation | 13a.SD.4–6, 13a.SD.8 | 20 | 4/4 tests green |
| **Loop 13a.3** | Export pipeline + integration | 13a.SD.9, 13a.SD.11–12 | 15 | 3/3 tests green |
| **Total** | | **12 tests** | **60 iterations** | All green + Sprint 13's 24 still green |

### Strategy B Loops (Fallback — only if A fails)

| Loop | Target | Tests | Max Iterations | Success Criteria |
|---|---|---|---|---|
| **Loop 13a.F1** | Static HTML generator + content | 13a.STATIC.1–5 | 25 | 5/5 green |
| **Loop 13a.F2** | Accessibility + polish | 13a.STATIC.6–8 | 15 | 3/3 green |
| **Total** | | **8 tests** | **40 iterations** | All green |

### Ralph Loop Commands (Strategy A)

```bash
# Loop 13a.1: Data loading adaptation + export script
/ralph-loop "Adapt template-gallery for shared drive deployment:
1. Modify src/data-loader.ts to support window.GALLERY_DATA from <script> tag
   (keep fetch() as fallback for Cloudflare — feature-detect which source is available)
2. Create scripts/export-shared-drive.ts:
   - Read approved templates from SQLite (flyer-template-system DB path via env var)
   - Write gallery-data.js as: window.GALLERY_DATA = { lastUpdated, templates, colorSchemes }
   - Color schemes from factory palette (9 categories, WCAG-validated)
   - Handle empty registry gracefully (empty array, no error)
3. Update vite.config.ts if needed for file:// base path

Tests: tests/shared-drive.test.ts (13a.SD.1-3, 13a.SD.7, 13a.SD.10)
Run: npx vitest run tests/shared-drive.test.ts -t '13a.SD.[1-3]|13a.SD.7|13a.SD.10'
IMPORTANT: Existing 24 tests must still pass: npx vitest run tests/
Output <promise>DONE</promise> when all targeted tests pass AND existing tests still green."
--max-iterations 25
--completion-promise "DONE"
```

```bash
# Loop 13a.2: file:// protocol + preview generation
/ralph-loop "Ensure gallery works via file:// protocol:
1. Run npm run build to generate dist/
2. Copy gallery-data.js into dist/
3. Verify index.html loads via file:// in Puppeteer without errors
4. Verify zero external network requests (no CDN, no Google Fonts)
5. Generate preview PNGs (400×300) for each template × category
6. Verify all <img> elements load from relative paths

Tests: tests/shared-drive.test.ts (13a.SD.4-6, 13a.SD.8)
Run: npx vitest run tests/shared-drive.test.ts -t '13a.SD.[4-8]'
Output <promise>DONE</promise> when tests 13a.SD.4-6 and 13a.SD.8 pass."
--max-iterations 20
--completion-promise "DONE"
```

```bash
# Loop 13a.3: Export pipeline npm script + integration
/ralph-loop "Wire the full shared drive export pipeline:
1. Add npm script: export:shared-drive with --output flag
   Pipeline: build → generate gallery-data.js → generate previews → copy to output
2. Full round-trip test: seed DB → export → open via file:// → verify data matches
3. Verify shared drive export and Cloudflare export produce identical template lists

Tests: tests/shared-drive.test.ts (13a.SD.9, 13a.SD.11-12)
Run: npx vitest run tests/shared-drive.test.ts -t '13a.SD.(9|1[12])'
Output <promise>DONE</promise> when tests 13a.SD.9, 13a.SD.11-12 pass."
--max-iterations 15
--completion-promise "DONE"
```

### Post-Loop Verification

```bash
# All Sprint 13a tests green
npx vitest run tests/shared-drive.test.ts
# Expected: 12 pass, 0 fail

# All Sprint 13 tests still green (regression check)
npx vitest run tests/
# Expected: 36 pass (24 original + 12 new), 0 fail

# Build still works
npm run build

# Export pipeline works end-to-end
npm run export:shared-drive -- --output /tmp/gallery-verify
ls -la /tmp/gallery-verify/
# Expected: index.html, assets/, gallery-data.js, previews/
```

---

## Part 5: Deliverables

| # | Deliverable | Description | Done When |
|---|---|---|---|
| D1 | Modified `src/data-loader.ts` | Supports both `fetch()` (Cloudflare) and `window.GALLERY_DATA` (shared drive) | Tests 13a.SD.1–3 pass |
| D2 | `scripts/export-shared-drive.ts` | Reads SQLite → builds → generates gallery-data.js + previews → copies to target | Tests 13a.SD.7–10 pass |
| D3 | `npm run export:shared-drive` | One-command pipeline with `--output` flag | Test 13a.SD.9 passes |
| D4 | `gallery-data.js` format | `window.GALLERY_DATA = {...}` for `file://` compatibility | Tests 13a.SD.1, 13a.SD.7 pass |
| D5 | Preview PNGs | Thumbnails at 400×300 per template × category | Test 13a.SD.8 passes |
| D6 | 12 passing tests | All new tests green, all 24 Sprint 13 tests still green | `npx vitest run` → 36 pass |
| D7 | README.txt | Plain text for the shared drive folder: "What is this? How do I use it?" | Manual review |
| D8 | Deployment instructions | Step-by-step for copying export output to the shared drive | In README or docs/ |

---

## Part 6: Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `file://` + JS blocked on government machines | Medium | High — Strategy A doesn't work | Test Q7 immediately. Pivot to Strategy B (static HTML) if blocked. Strategy B tests are pre-written. |
| Vite build output too large for shared drive | Low | Low | Vite tree-shakes aggressively. React + gallery is likely < 500KB bundled. |
| DM Sans font not available on government machines | Medium | Low | Vite bundles the font in the CSS. If file too large, fall back to system fonts (Segoe UI on Windows). |
| Preview PNGs consume too much drive space | Low | Medium | Compress with Sharp (quality 80). At 400×300, ~30KB each. Even 100 previews = 3MB. |
| Staff confusion: "nice gallery, now what?" | High | Medium | Clear instructions in README.txt and on the gallery page: "To create a flyer, contact [training inbox] or use the MCP tool." |
| Export script can't reach SQLite DB from gallery repo | Medium | Low | Pass DB path via env var `FLYER_TEMPLATE_DB_PATH`. Document in `.env.example`. |
| Sprint 13 tests break when data loader is modified | Medium | High | Feature-detect data source: check `window.GALLERY_DATA` first, fall back to `fetch()`. Both paths tested. |

---

## Part 7: Cost Estimate

| Item | Iterations | Estimated API Cost |
|---|---|---|
| Loop 13a.1 (data loader + export) | 25 max | $3–5 |
| Loop 13a.2 (file:// + previews) | 20 max | $3–4 |
| Loop 13a.3 (pipeline + integration) | 15 max | $2–3 |
| **Total (Strategy A)** | **60 max** | **$8–12** |
| Strategy B fallback (if needed) | 40 max | +$5–8 |

Significantly less than the original Sprint 13a estimate ($18–28) because we're reusing Sprint 13's components instead of rebuilding.

---

## Part 8: What Changed from Sprint 13a v0.1

| Area | v0.1 (Draft) | v1.0 (This Version) | Why |
|---|---|---|---|
| Starting point | Built from scratch — 28 new tests, 6 Ralph loops | Adapts Sprint 13's existing gallery — 12 new tests, 3 loops | Sprint 13 completed. No reason to rebuild. |
| Architecture | Self-contained HTML + `gallery-data.js` | Vite build of React app + `window.GALLERY_DATA` injection | Reuses all 24 tested components from Sprint 13 |
| Color palette | 6 training types (MCP's original) | 9 categories (factory's WCAG-validated palette) | Factory palette is canonical since Role Clarification |
| Iteration budget | 140 iterations, $18–28 | 60 iterations, $8–12 | Less work because we're adapting, not building |
| Fallback plan | None — just hoped HTML would work | Strategy B (static HTML) pre-written with 8 tests | Government IT is unpredictable |
| Data format | `const GALLERY_DATA = {...}` | `window.GALLERY_DATA = {...}` | `window.` prefix makes it accessible to bundled React app |
| Questions removed | — | Q5 (storage), Q15 (request feature), Q18 (version display) simplified | Existing gallery already handles most of these |

---

## Part 9: Sprint 13 / 13a Coexistence

If Q16 = "both coexist," the architecture is clean:

```
template-gallery repo
├── src/                          # React components (shared)
│   ├── data-loader.ts            # Feature-detects: window.GALLERY_DATA → fetch()
│   └── ...
├── scripts/
│   ├── export-shared-drive.ts    # SQLite → build → gallery-data.js → target dir
│   └── export-cloudflare.ts      # SQLite → templates.json → git push (triggers CF deploy)
├── dist/                         # Vite build output
├── public/
│   └── data/
│       └── templates.json        # For Cloudflare (fetch-based loading)
└── tests/
    ├── *.test.ts                 # Sprint 13 tests (24)
    └── shared-drive.test.ts      # Sprint 13a tests (12)
```

**One codebase. Two deployment targets. Same data. Different delivery mechanisms.**

---

## Next Steps

1. **Marty fills in Part 1** (Questions Q1–Q17)
2. **Critical early test:** Answer Q7 and Q10 first — if JS is blocked, we pivot to Strategy B immediately
3. **Claude revises architecture** based on answers (Strategy A or B)
4. **Tests written** (RED phase)
5. **3 Ralph loops execute** (GREEN phase) — estimated 2–3 hours
6. **Export to shared drive** (or staging directory first)
7. **Staff testing** — have Tammi or Leanne open it on their machine

---

*February 25, 2026*

#AI/Claude
