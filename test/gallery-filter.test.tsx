import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { Template, CategoryWithVocabulary, TagCloudEntry, ActiveFilters } from '../src/types';
import GalleryGrid from '../src/components/GalleryGrid';
import FilterSidebar from '../src/components/FilterSidebar';
import App from '../src/App';

import templatesData from '../public/data/templates.json';
import categoriesData from '../public/data/categories.json';
import tagsData from '../public/data/tags.json';

const mockTemplates = templatesData as Template[];
const mockCategories = categoriesData as CategoryWithVocabulary[];

const defaultFilters: ActiveFilters = {
  status: 'ALL',
  search: '',
  tags: {},
};

function mockFetch() {
  global.fetch = vi.fn((url: string | URL | Request) => {
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;
    if (urlStr.includes('templates.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(templatesData) } as Response);
    }
    if (urlStr.includes('categories.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(categoriesData) } as Response);
    }
    if (urlStr.includes('tags.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(tagsData) } as Response);
    }
    return Promise.resolve({ ok: false } as Response);
  }) as typeof fetch;
}

describe('Gallery & Filtering', () => {

  beforeEach(() => {
    mockFetch();
    // Reset URL state
    window.history.replaceState({}, '', '/');
  });

  test('9. GalleryGrid renders all templates', () => {
    render(<GalleryGrid templates={mockTemplates} onSelect={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('gallery-grid').children).toHaveLength(mockTemplates.length);
  });

  test('10. GalleryGrid uses responsive CSS grid', () => {
    render(<GalleryGrid templates={mockTemplates} onSelect={vi.fn()} onTagClick={vi.fn()} />);
    const grid = screen.getByTestId('gallery-grid');
    expect(grid.className).toMatch(/grid/i);
  });

  test('11. FilterSidebar shows tag counts from tag cloud', () => {
    const tagCloud: TagCloudEntry[] = [
      { category: 'program', value: 'ileps', display_label: 'ILEPS/CCP', color: '#1e8449', count: 4 },
      { category: 'program', value: 'c5', display_label: 'C5', color: '#1a5276', count: 2 },
    ];
    render(<FilterSidebar categories={mockCategories} tagCloud={tagCloud}
      filters={defaultFilters} onFilterChange={vi.fn()} templateCount={12} totalCount={12} />);
    expect(screen.getByText('(4)')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  test('12. selecting program filter reduces visible cards', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    const totalBefore = screen.getByTestId('gallery-grid').children.length;
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    await waitFor(() => {
      const grid = screen.getByTestId('gallery-grid');
      expect(grid.children.length).toBeLessThan(totalBefore);
    });
  });

  test('13. multiple filters AND across categories', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    fireEvent.click(screen.getByTestId('filter-tag-audience-supervisors'));
    await waitFor(() => {
      const grid = screen.getByTestId('gallery-grid');
      expect(grid.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('14. search bar filters by template name/category', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    const search = screen.getByTestId('filter-search');
    await user.type(search, 'Wellness');
    await waitFor(() => {
      const grid = screen.getByTestId('gallery-grid');
      const cards = grid.querySelectorAll('[data-testid^="template-card-"]');
      cards.forEach(card => {
        expect(card).toHaveTextContent(/wellness/i);
      });
    });
  });

  test('15. Clear Filters resets to showing all', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    const totalBefore = screen.getByTestId('gallery-grid').children.length;
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children.length).toBeLessThan(totalBefore);
    });
    await user.click(screen.getByTestId('filter-clear'));
    await waitFor(() => {
      const gridAll = screen.getByTestId('gallery-grid');
      expect(gridAll.children.length).toBe(totalBefore);
    });
  });

  test('16. filter state persists in URL search params', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    await waitFor(() => {
      expect(window.location.search).toContain('program=ileps');
    });
  });

});
