# Sprint 13: Visual Template Gallery — TDD Spec & Claude Code Handoff

**Handoff Date:** February 23, 2026
**For:** Claude Code
**From:** Claude PM (chat project)
**Sprint:** 13 of 13
**Project:** template-gallery (NEW separate repo)
**Predecessor:** Sprint 12 (tag system upgrade in flyer-template-system)

---

## READ FIRST — Context

This is a NEW separate repo. It does NOT live inside flyer-template-system.

The template-gallery is a React + Vite + TypeScript static site that displays a browsable, filterable gallery of training flyer templates. It reads JSON data exported from the flyer-template-system backend. It will be deployed to Cloudflare Pages with Cloudflare Access for email-verified access control (6 users).

**The gallery has no backend, no database connection, no server.** It loads JSON files at runtime from `/data/` and renders everything client-side.

### What This Sprint Produces

1. A working React app at `http://localhost:5173`
2. 24 passing tests via Vitest + React Testing Library
3. A `npm run build` that produces a deployable `dist/` folder
4. Sample JSON data for development (real data comes from Sprint 12's export script)

---

## Part 1: Project Scaffolding

### Create with Vite

```bash
npm create vite@latest template-gallery -- --template react-ts
cd template-gallery
npm install
```

### Additional Dependencies

```bash
# UI
npm install @radix-ui/react-dialog @radix-ui/react-checkbox

# Testing
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Utilities
npm install clsx
```

**Do NOT install:** tailwindcss (use CSS modules instead — simpler for learning, no build config). Do NOT install any router (single-page app with state-based navigation). Do NOT install any state management library (useState is sufficient for this scale).

### Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true,
  },
});
```

### Test Setup

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom';
```

### File Structure

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
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryGrid.module.css
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateCard.module.css
│   │   ├── TemplateDetail.tsx
│   │   ├── TemplateDetail.module.css
│   │   ├── TagChip.tsx
│   │   ├── TagChip.module.css
│   │   ├── StatusBadge.tsx
│   │   ├── StatusBadge.module.css
│   │   ├── ColorSwatch.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterSidebar.module.css
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.module.css
│   │   └── EmptyState.tsx
│   └── styles/
│       ├── variables.css         # CSS custom properties (colors, spacing, fonts)
│       └── globals.css           # Reset + base styles
└── test/
    ├── components.test.tsx       # Ralph Loop 13.1
    ├── gallery-filter.test.tsx   # Ralph Loop 13.2
    └── detail-actions.test.tsx   # Ralph Loop 13.3
```

---

## Part 2: Types

### File: `src/types/index.ts`

```typescript
export type TemplateStatus = 'APPROVED' | 'DRAFT' | 'ARCHIVED';
export type VariantType = 'FAITHFUL' | 'REFINED';

export interface Template {
  id: string;
  name: string;
  status: TemplateStatus;
  layout_pattern: string;
  category: string;
  color_label: string;
  primary_color: string;
  font_family: string;
  wcag_compliant: boolean;
  source: string;
  variant_type: VariantType;
  created_at: string;
  approved_by: string | null;
  tags: TemplateTags;
  preview_path: string | null;    // Path to PNG thumbnail in /previews/
}

export interface TemplateTags {
  program: string[];
  audience: string[];
  compliance: string[];
  'time-period': string[];
  custom: string[];
}

export interface TagCategory {
  id: string;
  name: string;
  is_controlled: boolean;
  requires_role: string | null;
}

export interface VocabularyTerm {
  value: string;
  display_label: string;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CategoryWithVocabulary extends TagCategory {
  vocabulary: VocabularyTerm[];
}

export interface TagCloudEntry {
  category: string;
  value: string;
  display_label: string;
  color: string | null;
  count: number;
}

export interface ActiveFilters {
  status: TemplateStatus | 'ALL';
  search: string;
  tags: Record<string, string[]>;  // { program: ['ileps'], audience: ['supervisors'] }
}

export interface AuditEntry {
  action: string;
  by: string;
  date: string;
}
```

---

## Part 3: Sample Data

### File: `public/data/templates.json`

Use 12 templates matching the UAT database. Each template must have:
- Unique `id` (UUID format)
- `status`: mix of APPROVED (7), DRAFT (3), ARCHIVED (2)
- `category`: spread across ILEPS-CCP, Wellness, C5, Leadership, PPP, Legal-Framework, IT-Technology
- `variant_type`: mix of FAITHFUL and REFINED
- `tags`: realistic tag assignments using seed vocabulary values
- `preview_path`: null (placeholder SVG used when null)
- `source`: realistic PDF filenames from UAT fixtures

### File: `public/data/categories.json`

```json
[
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
  },
  {
    "id": "audience",
    "name": "Audience",
    "is_controlled": true,
    "requires_role": null,
    "vocabulary": [
      { "value": "supervisors", "display_label": "Supervisors", "color": "#e67e22", "sort_order": 1, "is_active": true },
      { "value": "line-staff", "display_label": "Line Staff", "color": "#3498db", "sort_order": 2, "is_active": true },
      { "value": "new-hires", "display_label": "New Hires", "color": "#27ae60", "sort_order": 3, "is_active": true },
      { "value": "all-staff", "display_label": "All Staff", "color": "#95a5a6", "sort_order": 4, "is_active": true }
    ]
  },
  {
    "id": "time-period",
    "name": "Time Period",
    "is_controlled": false,
    "requires_role": null,
    "vocabulary": []
  },
  {
    "id": "compliance",
    "name": "Compliance",
    "is_controlled": true,
    "requires_role": "approver",
    "vocabulary": [
      { "value": "aoic-required", "display_label": "AOIC Required", "color": "#c0392b", "sort_order": 1, "is_active": true },
      { "value": "elective", "display_label": "Elective", "color": "#2ecc71", "sort_order": 2, "is_active": true },
      { "value": "mandatory-annual", "display_label": "Mandatory Annual", "color": "#e67e22", "sort_order": 3, "is_active": true }
    ]
  },
  {
    "id": "custom",
    "name": "Custom",
    "is_controlled": false,
    "requires_role": null,
    "vocabulary": []
  }
]
```

### File: `public/data/tags.json`

Generate from templates.json — aggregate tag counts:

```json
[
  { "category": "program", "value": "ileps", "display_label": "ILEPS/CCP", "color": "#1e8449", "count": 4 },
  { "category": "program", "value": "wellness", "display_label": "Wellness", "color": "#148f77", "count": 3 },
  ...
]
```

---

## Part 4: Design System

### File: `src/styles/variables.css`

```css
:root {
  /* Colors — Cook County professional palette */
  --color-bg: #f5f6f7;
  --color-surface: #ffffff;
  --color-border: #e8e8e8;
  --color-border-light: #f0f0f0;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-text-faint: #bbbbbb;
  --color-accent: #1a5276;
  --color-accent-light: #e8f0f7;
  --color-header-bg: #1a2332;

  /* Status colors */
  --color-approved-bg: #e8f5e9;
  --color-approved-text: #2e7d32;
  --color-approved-border: #a5d6a7;
  --color-draft-bg: #fff3e0;
  --color-draft-text: #e65100;
  --color-draft-border: #ffcc80;
  --color-archived-bg: #f3e5f5;
  --color-archived-text: #6a1b9a;
  --color-archived-border: #ce93d8;

  /* Typography */
  --font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 13px;
  --font-size-md: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 22px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;

  /* Layout */
  --sidebar-width: 260px;
  --header-height: 72px;
  --card-radius: 12px;
  --chip-radius: 20px;
  --input-radius: 8px;
  --max-width: 1400px;

  /* Shadows */
  --shadow-card: 0 1px 4px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-panel: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-preview: 0 4px 16px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
}
```

### Font Loading

In `index.html`, add in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Part 5: Component Specifications

### GalleryGrid

**Props:** `templates: Template[]`, `onSelect: (t: Template) => void`, `onTagClick: (category: string, value: string) => void`

**Behavior:**
- CSS Grid: `repeat(auto-fill, minmax(260px, 1fr))` with `gap: 20px`
- Renders one TemplateCard per template
- Responsive: 3 columns on desktop (>1024px), 2 on tablet (>640px), 1 on mobile

**Test IDs:** `data-testid="gallery-grid"`, each card: `data-testid="template-card-{id}"`

### TemplateCard

**Props:** `template: Template`, `onClick: () => void`, `onTagClick: (category: string, value: string) => void`

**Behavior:**
- Shows preview thumbnail (placeholder SVG if `preview_path` is null)
- StatusBadge in top-right corner of preview
- REFINED badge in top-left if variant_type === 'REFINED'
- Below preview: ColorSwatch + category name, source filename, up to 4 TagChips
- If >4 tags, show "+N" count
- Hover: translateY(-3px) + elevated shadow
- Click anywhere (except tag chips) → onSelect

**Test IDs:** `data-testid="template-card-{id}"`, `data-testid="card-status-{id}"`, `data-testid="card-category-{id}"`

### TemplateDetail

**Props:** `template: Template`, `categories: CategoryWithVocabulary[]`, `onBack: () => void`, `onTagClick: (category: string, value: string) => void`

**Behavior:**
- Full-page overlay (replaces grid view — NOT a modal)
- Header with "← Back to Gallery" button + StatusBadge
- Two-column layout: preview (left, fixed 360px) + details (right, fluid)
- Detail panel shows: category, source, variant type, layout, font, color (with swatch), WCAG status, created date, approved by
- Tags section: grouped by category with category labels
- Audit trail section: chronological list of CREATED → APPROVED → ARCHIVED events
- Action buttons: "Download PDF" and "Export HTML" (both trigger file download if preview_path exists; show toast/message if no file available)

**Test IDs:** `data-testid="template-detail"`, `data-testid="detail-back"`, `data-testid="detail-metadata"`, `data-testid="detail-tags"`, `data-testid="detail-audit"`, `data-testid="detail-download"`, `data-testid="detail-export"`

### TagChip

**Props:** `value: string`, `category: string`, `displayLabel?: string`, `color?: string`, `small?: boolean`, `onClick: () => void`

**Behavior:**
- Small colored circle + label text
- Background: color at 10% opacity; text: full color
- Hover: background opacity increases to 20%
- Click fires onClick (used for filtering)
- `small` variant: reduced padding/font for card context

**Test IDs:** `data-testid="tag-chip-{category}-{value}"`

### StatusBadge

**Props:** `status: TemplateStatus`

**Behavior:**
- APPROVED: green background, checkmark icon
- DRAFT: orange background, dot icon
- ARCHIVED: purple background, square icon

**Test IDs:** `data-testid="status-badge-{status}"`

### ColorSwatch

**Props:** `color: string`, `size?: number`

**Behavior:**
- Circle filled with the hex color
- White border + subtle shadow for contrast on any background
- Default size 14px

### FilterSidebar

**Props:** `categories: CategoryWithVocabulary[]`, `tagCloud: TagCloudEntry[]`, `filters: ActiveFilters`, `onFilterChange: (filters: ActiveFilters) => void`, `templateCount: number`, `totalCount: number`

**Behavior:**
- Search input at top (debounced 200ms)
- Status radio buttons: All, Approved, Draft, Archived (with counts)
- One section per tag category (Program, Audience, Compliance)
- Each section: checkboxes with colored dot + label + count
- Counts show how many templates have each tag (from tagCloud data)
- "Clear All Filters" button at bottom (visible only when filters active)

**Test IDs:** `data-testid="filter-sidebar"`, `data-testid="filter-search"`, `data-testid="filter-status-{status}"`, `data-testid="filter-tag-{category}-{value}"`, `data-testid="filter-clear"`

### SearchBar

**Props:** `value: string`, `onChange: (value: string) => void`, `placeholder?: string`

**Behavior:**
- Text input with search icon (or just placeholder text)
- Calls onChange on every keystroke (parent debounces if needed)

### EmptyState

**Props:** `onClearFilters: () => void`

**Behavior:**
- Centered message: "No templates match your filters"
- Subtext: "Try removing some filters or searching for something different."
- "Clear Filters" button

**Test IDs:** `data-testid="empty-state"`, `data-testid="empty-clear"`

---

## Part 6: Hooks

### useTemplates

```typescript
function useTemplates(): {
  templates: Template[];
  categories: CategoryWithVocabulary[];
  tagCloud: TagCloudEntry[];
  loading: boolean;
  error: string | null;
  filters: ActiveFilters;
  setFilters: (filters: ActiveFilters) => void;
  filtered: Template[];
  toggleTag: (category: string, value: string) => void;
  clearFilters: () => void;
}
```

**Behavior:**
- On mount: fetch templates.json, categories.json, tags.json
- `filtered`: applies all active filters to templates
  - Status: exact match (or show all)
  - Search: case-insensitive substring match against category, source, name
  - Tags: AND across categories, OR within a category
    - If `filters.tags.program = ['ileps', 'c5']` → match templates tagged ileps OR c5
    - If `filters.tags.program = ['ileps']` AND `filters.tags.audience = ['supervisors']` → match templates tagged ileps AND supervisors
- `toggleTag`: adds tag to filter if not present, removes if present
- `clearFilters`: resets to `{ status: 'ALL', search: '', tags: {} }`

### useTagCloud

```typescript
function useTagCloud(templates: Template[]): TagCloudEntry[]
```

**Behavior:**
- Computes tag frequency from current template list
- Returns array sorted by count descending within each category
- Used by FilterSidebar to show "(N)" counts

---

## Part 7: Test Plan — 24 Tests

### Ralph Loop 13.1: Core Components (8 tests, 40 iterations max)

**File:** `test/components.test.tsx`

**Completion criteria:** All 8 tests pass. `npx vitest run test/components.test.tsx` exits 0.

```typescript
describe('Core Components', () => {

  test('1. TemplateCard renders name, category, and color swatch', () => {
    render(<TemplateCard template={mockTemplate} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId(`card-category-${mockTemplate.id}`)).toHaveTextContent('ILEPS-CCP');
    // Color swatch should be visible
    const swatch = screen.getByTestId(`card-category-${mockTemplate.id}`).querySelector('[data-testid="color-swatch"]');
    expect(swatch).toBeInTheDocument();
  });

  test('2. TemplateCard shows correct status badge', () => {
    render(<TemplateCard template={{ ...mockTemplate, status: 'APPROVED' }} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId(`card-status-${mockTemplate.id}`)).toHaveTextContent('APPROVED');
  });

  test('3. TemplateCard renders tag chips with correct colors', () => {
    const template = { ...mockTemplate, tags: { ...mockTemplate.tags, program: ['ileps', 'c5'] } };
    render(<TemplateCard template={template} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('tag-chip-program-ileps')).toBeInTheDocument();
    expect(screen.getByTestId('tag-chip-program-c5')).toBeInTheDocument();
  });

  test('4. TagChip click fires onFilter callback', async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    render(<TagChip value="ileps" category="program" displayLabel="ILEPS/CCP" onClick={onTagClick} />);
    await user.click(screen.getByTestId('tag-chip-program-ileps'));
    expect(onTagClick).toHaveBeenCalledTimes(1);
  });

  test('5. StatusBadge renders correct variant per status', () => {
    const { rerender } = render(<StatusBadge status="APPROVED" />);
    expect(screen.getByTestId('status-badge-APPROVED')).toHaveTextContent('APPROVED');
    rerender(<StatusBadge status="DRAFT" />);
    expect(screen.getByTestId('status-badge-DRAFT')).toHaveTextContent('DRAFT');
    rerender(<StatusBadge status="ARCHIVED" />);
    expect(screen.getByTestId('status-badge-ARCHIVED')).toHaveTextContent('ARCHIVED');
  });

  test('6. ColorSwatch renders correct hex color', () => {
    render(<ColorSwatch color="#1e8449" />);
    const swatch = screen.getByTestId('color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#1e8449' });
  });

  test('7. EmptyState renders when no templates match', () => {
    render(<EmptyState onClearFilters={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no templates match/i)).toBeInTheDocument();
  });

  test('8. TemplateCard click calls onSelect', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TemplateCard template={mockTemplate} onClick={onClick} onTagClick={vi.fn()} />);
    await user.click(screen.getByTestId(`template-card-${mockTemplate.id}`));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

});
```

### Ralph Loop 13.2: Gallery & Filtering (8 tests, 40 iterations max)

**File:** `test/gallery-filter.test.tsx`

**Completion criteria:** All 8 tests pass.

```typescript
describe('Gallery & Filtering', () => {

  test('9. GalleryGrid renders all templates', () => {
    render(<GalleryGrid templates={mockTemplates} onSelect={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('gallery-grid').children).toHaveLength(mockTemplates.length);
  });

  test('10. GalleryGrid uses responsive CSS grid', () => {
    render(<GalleryGrid templates={mockTemplates} onSelect={vi.fn()} onTagClick={vi.fn()} />);
    const grid = screen.getByTestId('gallery-grid');
    const style = window.getComputedStyle(grid);
    expect(style.display).toBe('grid');
  });

  test('11. FilterSidebar shows tag counts from tag cloud', () => {
    const tagCloud = [
      { category: 'program', value: 'ileps', display_label: 'ILEPS/CCP', color: '#1e8449', count: 4 },
      { category: 'program', value: 'c5', display_label: 'C5', color: '#1a5276', count: 2 },
    ];
    render(<FilterSidebar categories={mockCategories} tagCloud={tagCloud}
      filters={defaultFilters} onFilterChange={vi.fn()} templateCount={12} totalCount={12} />);
    expect(screen.getByText('(4)')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  test('12. selecting program filter reduces visible cards', () => {
    // Render App with all templates, click ILEPS filter
    render(<App />);
    const ilepsFilter = screen.getByTestId('filter-tag-program-ileps');
    fireEvent.click(ilepsFilter);
    const grid = screen.getByTestId('gallery-grid');
    // Should show fewer than total
    expect(grid.children.length).toBeLessThan(mockTemplates.length);
  });

  test('13. multiple filters AND across categories', () => {
    // Filter: program=ileps AND audience=supervisors
    render(<App />);
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    fireEvent.click(screen.getByTestId('filter-tag-audience-supervisors'));
    const grid = screen.getByTestId('gallery-grid');
    // Only templates with BOTH ileps AND supervisors
    expect(grid.children.length).toBeGreaterThanOrEqual(1);
  });

  test('14. search bar filters by template name/category', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByTestId('filter-search');
    await user.type(search, 'Wellness');
    const grid = screen.getByTestId('gallery-grid');
    // All visible cards should be Wellness category
    const cards = grid.querySelectorAll('[data-testid^="template-card-"]');
    cards.forEach(card => {
      expect(card).toHaveTextContent(/wellness/i);
    });
  });

  test('15. Clear Filters resets to showing all', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Apply a filter
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    const gridFiltered = screen.getByTestId('gallery-grid');
    const filteredCount = gridFiltered.children.length;
    // Clear
    await user.click(screen.getByTestId('filter-clear'));
    const gridAll = screen.getByTestId('gallery-grid');
    expect(gridAll.children.length).toBeGreaterThan(filteredCount);
  });

  test('16. filter state persists in URL search params', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    // Check URL was updated (or that the filter state is reflected in URL)
    expect(window.location.search).toContain('program=ileps');
  });

});
```

### Ralph Loop 13.3: Detail View & Actions (8 tests, 40 iterations max)

**File:** `test/detail-actions.test.tsx`

**Completion criteria:** All 8 tests pass.

```typescript
describe('Detail View & Actions', () => {

  test('17. TemplateDetail shows full-size preview', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('template-detail')).toBeInTheDocument();
    // Preview area should exist
    expect(screen.getByTestId('detail-preview')).toBeInTheDocument();
  });

  test('18. TemplateDetail shows all metadata fields', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    const metadata = screen.getByTestId('detail-metadata');
    expect(metadata).toHaveTextContent(mockTemplate.layout_pattern);
    expect(metadata).toHaveTextContent(mockTemplate.font_family);
    expect(metadata).toHaveTextContent(mockTemplate.category);
  });

  test('19. TemplateDetail shows audit trail', () => {
    render(<TemplateDetail template={{ ...mockTemplate, status: 'APPROVED', approved_by: 'Marty' }}
      categories={mockCategories} onBack={vi.fn()} onTagClick={vi.fn()} />);
    const audit = screen.getByTestId('detail-audit');
    expect(audit).toHaveTextContent('CREATED');
    expect(audit).toHaveTextContent('APPROVED');
    expect(audit).toHaveTextContent('Marty');
  });

  test('20. TemplateDetail shows tags grouped by category', () => {
    const template = {
      ...mockTemplate,
      tags: { program: ['ileps'], audience: ['supervisors'], compliance: ['aoic-required'], 'time-period': [], custom: [] }
    };
    render(<TemplateDetail template={template} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    const tags = screen.getByTestId('detail-tags');
    expect(tags).toHaveTextContent('Program');
    expect(tags).toHaveTextContent('ILEPS/CCP');
    expect(tags).toHaveTextContent('Audience');
    expect(tags).toHaveTextContent('Supervisors');
    expect(tags).toHaveTextContent('Compliance');
    expect(tags).toHaveTextContent('AOIC Required');
  });

  test('21. Download PDF button is present', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('detail-download')).toBeInTheDocument();
    expect(screen.getByTestId('detail-download')).toHaveTextContent(/download pdf/i);
  });

  test('22. Export HTML button is present', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('detail-export')).toBeInTheDocument();
    expect(screen.getByTestId('detail-export')).toHaveTextContent(/export html/i);
  });

  test('23. Back button returns to gallery', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={onBack} onTagClick={vi.fn()} />);
    await user.click(screen.getByTestId('detail-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('24. Tags in detail view are clickable', async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    const template = { ...mockTemplate, tags: { ...mockTemplate.tags, program: ['ileps'] } };
    render(<TemplateDetail template={template} categories={mockCategories}
      onBack={vi.fn()} onTagClick={onTagClick} />);
    await user.click(screen.getByTestId('tag-chip-program-ileps'));
    expect(onTagClick).toHaveBeenCalledWith('program', 'ileps');
  });

});
```

---

## Part 8: Ralph Loop Configuration

### Loop 13.1
```
Task: Scaffold Vite + React project. Implement TemplateCard, TagChip, StatusBadge, ColorSwatch, EmptyState.
Tests: test/components.test.tsx
Command: npx vitest run test/components.test.tsx --reporter=verbose
Max iterations: 40
Success: 8/8 pass
```

### Loop 13.2
```
Task: Implement GalleryGrid, FilterSidebar, SearchBar, useTemplates hook, URL state sync.
Tests: test/gallery-filter.test.tsx
Command: npx vitest run test/gallery-filter.test.tsx --reporter=verbose
Max iterations: 40
Success: 8/8 pass (+ previous 8 still pass)
```

### Loop 13.3
```
Task: Implement TemplateDetail with metadata, tags, audit trail, action buttons.
Tests: test/detail-actions.test.tsx
Command: npx vitest run test/detail-actions.test.tsx --reporter=verbose
Max iterations: 40
Success: 8/8 pass (+ previous 16 still pass)
```

### Final Verification

```bash
# All gallery tests pass
npx vitest run --reporter=verbose
# Expected: 24/24 pass

# Build succeeds
npm run build
# Expected: dist/ folder created with index.html + assets

# Dev server starts
npm run dev
# Expected: http://localhost:5173 serves the gallery
```

---

## Part 9: npm Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Commit Messages

### After Loop 13.1
```
feat: scaffold React gallery with core components (Sprint 13, Loop 1)
```

### After Loop 13.2
```
feat: gallery grid with sidebar filtering and URL state (Sprint 13, Loop 2)
```

### After Loop 13.3
```
feat: template detail view with metadata, tags, and actions (Sprint 13, Loop 3)
```

-----
February 23, 2026

#AI/Claude
