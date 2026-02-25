# TDD Test Specification — Template Gallery (Sprint 13)

**Total Tests:** 24
**Organized by:** Ralph Loop (13.1, 13.2, 13.3)
**Testing Framework:** Vitest + React Testing Library
**Test Command:** `npx vitest run --reporter=verbose`

---

## Mock Data Definitions

### mockTemplate (single template)

```typescript
const mockTemplate: Template = {
  id: 't-001-ileps-basic',
  name: 'ILEPS-CCP Basic Training Flyer',
  status: 'APPROVED',
  layout_pattern: 'two-column-split',
  category: 'ILEPS-CCP',
  color_label: 'Forest Green',
  primary_color: '#1e8449',
  font_family: 'Poppins',
  wcag_compliant: true,
  source: 'ileps_basic_orientation_02-2026.pdf',
  variant_type: 'FAITHFUL',
  created_at: '2026-02-01T10:00:00Z',
  approved_by: 'Marty',
  tags: {
    program: ['ileps'],
    audience: ['supervisors', 'line-staff'],
    compliance: ['aoic-required'],
    'time-period': [],
    custom: [],
  },
  preview_path: null,
};
```

### mockTemplates (array of 12)

Use the full 12-template dataset from `public/data/templates.json`.

### mockCategories

Use the full categories dataset from `public/data/categories.json`.

### defaultFilters

```typescript
const defaultFilters: ActiveFilters = {
  status: 'ALL',
  search: '',
  tags: {},
};
```

---

## Ralph Loop 13.1: Core Components (8 tests)

**File:** `test/components.test.tsx`
**Command:** `npx vitest run test/components.test.tsx --reporter=verbose`
**Completion Criteria:** All 8 tests pass. Exit code 0.

### Test 1: TemplateCard renders name, category, and color swatch
- Render `<TemplateCard template={mockTemplate} onClick={vi.fn()} onTagClick={vi.fn()} />`
- Assert `card-category-{id}` contains "ILEPS-CCP"
- Assert color swatch is present inside the category element

### Test 2: TemplateCard shows correct status badge
- Render with `status: 'APPROVED'`
- Assert `card-status-{id}` contains "APPROVED"

### Test 3: TemplateCard renders tag chips with correct colors
- Render with `tags.program: ['ileps', 'c5']`
- Assert `tag-chip-program-ileps` is in the document
- Assert `tag-chip-program-c5` is in the document

### Test 4: TagChip click fires onFilter callback
- Render `<TagChip value="ileps" category="program" displayLabel="ILEPS/CCP" onClick={onTagClick} />`
- Click the chip
- Assert `onTagClick` called once

### Test 5: StatusBadge renders correct variant per status
- Render with "APPROVED", assert text
- Rerender with "DRAFT", assert text
- Rerender with "ARCHIVED", assert text

### Test 6: ColorSwatch renders correct hex color
- Render `<ColorSwatch color="#1e8449" />`
- Assert `backgroundColor: '#1e8449'`

### Test 7: EmptyState renders when no templates match
- Render `<EmptyState onClearFilters={vi.fn()} />`
- Assert `empty-state` testid is present
- Assert "no templates match" text present

### Test 8: TemplateCard click calls onSelect
- Click the card element
- Assert `onClick` called once

---

## Ralph Loop 13.2: Gallery & Filtering (8 tests)

**File:** `test/gallery-filter.test.tsx`
**Command:** `npx vitest run test/gallery-filter.test.tsx --reporter=verbose`
**Completion Criteria:** All 8 tests pass.

**Note:** Tests 12-16 render `<App />` and require mocking `global.fetch` to return sample JSON data.

### Test 9: GalleryGrid renders all templates
- Render `<GalleryGrid templates={mockTemplates} onSelect={vi.fn()} onTagClick={vi.fn()} />`
- Assert `gallery-grid` children count equals `mockTemplates.length`

### Test 10: GalleryGrid uses responsive CSS grid
- Render GalleryGrid
- Assert `getComputedStyle(grid).display === 'grid'`

### Test 11: FilterSidebar shows tag counts from tag cloud
- Render with tag cloud data containing `ileps: 4, c5: 2`
- Assert "(4)" and "(2)" text are in the document

### Test 12: Selecting program filter reduces visible cards
- Render `<App />`
- Click `filter-tag-program-ileps`
- Assert `gallery-grid` children count < total

### Test 13: Multiple filters AND across categories
- Render `<App />`
- Click `filter-tag-program-ileps` AND `filter-tag-audience-supervisors`
- Assert grid shows only templates with BOTH tags (>= 1)

### Test 14: Search bar filters by template name/category
- Render `<App />`
- Type "Wellness" into `filter-search`
- Assert all visible cards contain "wellness" (case insensitive)

### Test 15: Clear Filters resets to showing all
- Render `<App />`, apply filter, note reduced count
- Click `filter-clear`
- Assert grid shows more cards than filtered count

### Test 16: Filter state persists in URL search params
- Render `<App />`
- Click `filter-tag-program-ileps`
- Assert `window.location.search` contains `program=ileps`

---

## Ralph Loop 13.3: Detail View & Actions (8 tests)

**File:** `test/detail-actions.test.tsx`
**Command:** `npx vitest run test/detail-actions.test.tsx --reporter=verbose`
**Completion Criteria:** All 8 tests pass.

### Test 17: TemplateDetail shows full-size preview
- Render `<TemplateDetail template={mockTemplate} categories={mockCategories} onBack={vi.fn()} onTagClick={vi.fn()} />`
- Assert `template-detail` and `detail-preview` testids present

### Test 18: TemplateDetail shows all metadata fields
- Assert `detail-metadata` contains layout_pattern, font_family, and category

### Test 19: TemplateDetail shows audit trail
- Render with `status: 'APPROVED'`, `approved_by: 'Marty'`
- Assert `detail-audit` contains "CREATED", "APPROVED", "Marty"

### Test 20: TemplateDetail shows tags grouped by category
- Render with tags in program, audience, and compliance
- Assert `detail-tags` contains "Program", "ILEPS/CCP", "Audience", "Supervisors", "Compliance", "AOIC Required"

### Test 21: Download PDF button is present
- Assert `detail-download` testid present, text matches /download pdf/i

### Test 22: Export HTML button is present
- Assert `detail-export` testid present, text matches /export html/i

### Test 23: Back button returns to gallery
- Click `detail-back`
- Assert `onBack` called once

### Test 24: Tags in detail view are clickable
- Click `tag-chip-program-ileps`
- Assert `onTagClick` called with `('program', 'ileps')`

---

*Extracted from Sprint 13 Handoff Spec, Part 7*
