import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { Template, CategoryWithVocabulary, TagCloudEntry, ActiveFilters } from '../src/types';
import App from '../src/App';

import templatesData from '../public/data/templates.json';
import categoriesData from '../public/data/categories.json';
import tagsData from '../public/data/tags.json';

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

describe('UAT Automated Tests', () => {

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  test('25. UAT-A01: App shows loading state before data arrives', async () => {
    let resolveAll!: () => void;
    const gate = new Promise<void>((r) => { resolveAll = r; });

    global.fetch = vi.fn((url: string | URL | Request) => {
      const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;
      return gate.then(() => {
        if (urlStr.includes('templates.json')) {
          return { ok: true, json: () => Promise.resolve(templatesData) } as Response;
        }
        if (urlStr.includes('categories.json')) {
          return { ok: true, json: () => Promise.resolve(categoriesData) } as Response;
        }
        if (urlStr.includes('tags.json')) {
          return { ok: true, json: () => Promise.resolve(tagsData) } as Response;
        }
        return { ok: false } as Response;
      });
    }) as typeof fetch;

    render(<App />);
    expect(screen.getByText('Loading templates...')).toBeInTheDocument();

    resolveAll();

    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading templates...')).not.toBeInTheDocument();
  });

  test('26. UAT-A02: App shows error state when fetch fails', async () => {
    global.fetch = vi.fn(() => {
      return Promise.resolve({ ok: false } as Response);
    }) as typeof fetch;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('gallery-grid')).not.toBeInTheDocument();
  });

  test('27. UAT-A03: Status filter shows correct count per status', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    // ALL → 12 cards
    expect(screen.getByTestId('gallery-grid').children).toHaveLength(12);

    // APPROVED → 7 cards
    fireEvent.click(screen.getByTestId('filter-status-APPROVED'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(7);
    });

    // DRAFT → 3 cards
    fireEvent.click(screen.getByTestId('filter-status-DRAFT'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(3);
    });

    // ARCHIVED → 2 cards
    fireEvent.click(screen.getByTestId('filter-status-ARCHIVED'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(2);
    });

    // Back to ALL → 12 cards
    fireEvent.click(screen.getByTestId('filter-status-ALL'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(12);
    });
  });

  test('28. UAT-A04: OR within category — ileps + wellness shows 7 templates', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    fireEvent.click(screen.getByTestId('filter-tag-program-wellness'));

    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(7);
    });
  });

  test('29. UAT-A05: AND across categories narrows results — ileps AND aoic-required', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    fireEvent.click(screen.getByTestId('filter-tag-compliance-aoic-required'));

    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(4);
    });
  });

  test('30. UAT-A06: Search matches source filename case-insensitively', async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    const search = screen.getByTestId('filter-search');
    await user.type(search, 'ppp_new');

    await waitFor(() => {
      const grid = screen.getByTestId('gallery-grid');
      expect(grid.children).toHaveLength(1);
      expect(screen.getByTestId('template-card-t-005-ppp-orientation')).toBeInTheDocument();
    });
  });

  test('31. UAT-A07: Empty state for impossible filter combo', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('filter-status-ARCHIVED'));
    fireEvent.click(screen.getByTestId('filter-tag-program-c5'));

    await waitFor(() => {
      expect(screen.queryByTestId('gallery-grid')).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  test('32. UAT-A08: Card click opens detail, back returns to gallery', async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    // Click first card
    await user.click(screen.getByTestId('template-card-t-001-ileps-basic'));

    await waitFor(() => {
      expect(screen.getByTestId('template-detail')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('gallery-grid')).not.toBeInTheDocument();

    // Click back
    await user.click(screen.getByTestId('detail-back'));

    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('template-detail')).not.toBeInTheDocument();
  });

  test('33. UAT-A09: Tag click in detail filters gallery and closes detail', async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    // Open detail for t-001 (has program: ileps)
    await user.click(screen.getByTestId('template-card-t-001-ileps-basic'));
    await waitFor(() => {
      expect(screen.getByTestId('template-detail')).toBeInTheDocument();
    });

    // Click the ileps program tag in detail
    await user.click(screen.getByTestId('tag-chip-program-ileps'));

    // Should return to gallery with ileps filter active
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('template-detail')).not.toBeInTheDocument();

    // Should show only 4 ileps templates
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(4);
    });
    expect(window.location.search).toContain('program=ileps');
  });

  test('34. UAT-A10: URL round-trip preserves filters', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    // Apply filter
    fireEvent.click(screen.getByTestId('filter-tag-program-ileps'));
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(4);
    });

    // Capture the URL
    const filteredUrl = window.location.search;
    expect(filteredUrl).toContain('program=ileps');

    // Cleanup and set URL before re-render
    cleanup();
    window.history.replaceState({}, '', `/${filteredUrl}`);

    // Re-render — App reads filters from URL on mount
    mockFetch();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid')).toBeInTheDocument();
    });

    // Filters should be restored from URL — only 4 ileps templates
    await waitFor(() => {
      expect(screen.getByTestId('gallery-grid').children).toHaveLength(4);
    });
  });

});
