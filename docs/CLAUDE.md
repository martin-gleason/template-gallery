# CLAUDE.md — Template Gallery

**Project:** `template-gallery`
**Organization:** Cook County Juvenile Court & Probation Services (CCJCPS)
**Created:** February 25, 2026
**Runtime:** TypeScript / React + Vite (client-side only)
**Local Path:** `OCS-Ecosystem/template-gallery` (citizen submodule of the workspace)
**Companion Projects:** `flyer-template-system` (source data), `training-coordination-mcp` (MCP tools)

---

## What This Project Is

A **static React gallery** that displays a browsable, filterable collection of training flyer templates. It reads JSON data exported from `flyer-template-system` and renders everything client-side. No backend, no database, no server. Deployed to Cloudflare Pages with Cloudflare Access for email-verified access control (6 users).

### Relationship Diagram

```
flyer-template-system                    template-gallery (THIS PROJECT)
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ Ingest → Extract → Compose → │        │ Reads JSON exports from FTS  │
│ Render → Validate            │        │ Renders browsable gallery    │
│                              │───────▶│ Filter by status, tags,      │
│ Export script produces JSON  │  JSON  │ search. Detail view with     │
│ (templates, tags, categories)│  files │ metadata, audit trail, tags  │
└──────────────────────────────┘        └──────────────────────────────┘
                                                     │
training-coordination-mcp                            │
┌──────────────────────────────┐                     │
│ MCP tools: generate_flyer,   │                     │
│ render_flyer, render_teams   │  (no direct link — │
│ Uses FTS templates to        │   both consume FTS  │
│ customize per-training       │   output)           │
└──────────────────────────────┘                     │
```

**Do NOT:**
- Add a backend or database connection
- Install tailwindcss, react-router, or state management libraries
- Modify files in `flyer-template-system` or `training-coordination-mcp`

**DO:**
- Use CSS Modules for all styling
- Use `useState` for state management (sufficient at this scale)
- Use state-based navigation (no router)
- Follow the same professional aesthetic as `flyer-template-system`

---

## Architecture

```
template-gallery/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   ├── data/
│   │   ├── templates.json        # Sample data (12 templates)
│   │   ├── tags.json             # Tag cloud data
│   │   └── categories.json       # Category + vocabulary definitions
│   └── previews/
│       └── placeholder.svg       # Fallback preview image
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── test-setup.ts
│   ├── types/
│   │   └── index.ts              # All TypeScript types
│   ├── data/
│   │   └── loader.ts             # Fetch JSON + type validation
│   ├── hooks/
│   │   ├── useTemplates.ts       # Load, filter, search templates
│   │   └── useTagCloud.ts        # Tag frequency for sidebar
│   ├── components/
│   │   ├── GalleryGrid.tsx + .module.css
│   │   ├── TemplateCard.tsx + .module.css
│   │   ├── TemplateDetail.tsx + .module.css
│   │   ├── TagChip.tsx + .module.css
│   │   ├── StatusBadge.tsx + .module.css
│   │   ├── ColorSwatch.tsx
│   │   ├── FilterSidebar.tsx + .module.css
│   │   ├── SearchBar.tsx + .module.css
│   │   └── EmptyState.tsx
│   └── styles/
│       ├── variables.css         # CSS custom properties
│       └── globals.css           # Reset + base styles
├── test/
│   ├── components.test.tsx       # Ralph Loop 13.1 (8 tests)
│   ├── gallery-filter.test.tsx   # Ralph Loop 13.2 (8 tests)
│   └── detail-actions.test.tsx   # Ralph Loop 13.3 (8 tests)
└── docs/
    ├── CLAUDE.md                 # THIS FILE
    ├── TDD_Test_Specification.md # All 24 tests
    └── Sprint_13_Handoff.md      # Original handoff spec
```

---

## Development Methodology

### TDD — Red -> Green -> Refactor

Every feature follows this cycle:

1. **RED** — Write the test. Run it. Confirm it fails.
2. **GREEN** — Write minimum code to pass the test.
3. **REFACTOR** — Clean up without changing behavior.

**Tests are written BEFORE implementation code.**

### Ralph Wiggum Loops

| Loop | Focus | Test File | Tests | Max Iterations |
|---|---|---|---|---|
| 13.1 | Core Components | test/components.test.tsx | 8 | 40 |
| 13.2 | Gallery & Filtering | test/gallery-filter.test.tsx | 8 | 40 |
| 13.3 | Detail View & Actions | test/detail-actions.test.tsx | 8 | 40 |

---

## Locked Design Decisions

| Decision | Value | Source |
|---|---|---|
| Styling approach | CSS Modules (no Tailwind) | Sprint 13 spec |
| Navigation | State-based (no router) | Sprint 13 spec |
| State management | useState only (no Redux/Zustand) | Sprint 13 spec |
| Primary font | DM Sans (400, 500, 600, 700) | Sprint 13 spec |
| Testing framework | Vitest + React Testing Library | Sprint 13 spec |
| Test environment | jsdom with css: true | Sprint 13 spec |
| Deployment target | Cloudflare Pages | Sprint 13 spec |
| UI primitives | Radix UI (Dialog, Checkbox) | Sprint 13 spec |
| Utility library | clsx | Sprint 13 spec |

---

## Quality Standards

### The Chief Judge Bulletin Board Test
> "Would I be comfortable if the Chief Judge saw this on a bulletin board?"

Every output must pass. Professional, warm, authoritative. Government-appropriate at all times.

### WCAG AA Compliance
- Body text: contrast ratio >= 4.5:1
- Large text / headers: contrast ratio >= 3.0:1
- Interactive elements must have visible focus states

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-checkbox": "^1",
    "clsx": "^2"
  },
  "devDependencies": {
    "typescript": "~5.9",
    "vite": "^7",
    "@vitejs/plugin-react": "^5",
    "vitest": "(bundled with vite)",
    "@testing-library/react": "^16",
    "@testing-library/jest-dom": "^6",
    "@testing-library/user-event": "^14",
    "jsdom": "^27"
  }
}
```

---

## npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start dev server at localhost:5173 |
| `build` | `tsc -b && vite build` | Type-check + production build |
| `test` | `vitest run` | Run all 24 tests |
| `test:watch` | `vitest` | Watch mode |
| `test:coverage` | `vitest run --coverage` | Coverage report |
| `test:loop1` | `vitest run test/components.test.tsx` | Loop 13.1 only |
| `test:loop2` | `vitest run test/gallery-filter.test.tsx` | Loop 13.2 only |
| `test:loop3` | `vitest run test/detail-actions.test.tsx` | Loop 13.3 only |

---

## Session Protocol

At the start of every Claude Code session:

1. Read this `CLAUDE.md` file
2. Run `npx vitest run` to confirm current test state
3. Check which Ralph Loop you're working on
4. Read the relevant test file
5. Follow Red -> Green -> Refactor for every test

At the end of every session:

1. Run `npx vitest run` — report pass/fail/skip counts
2. Commit with message format: `feat: [description] (Sprint 13, Loop N)`
3. Note any tests still RED that need design decisions from Marty

---

*02/25/2026*

#AI/Claude
