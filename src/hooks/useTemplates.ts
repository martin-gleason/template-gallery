import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Template, CategoryWithVocabulary, TagCloudEntry, ActiveFilters } from '../types';
import { loadTemplates, loadCategories, loadTagCloud } from '../data/loader';
import { useTagCloud } from './useTagCloud';

function getInitialFilters(): ActiveFilters {
  const params = new URLSearchParams(window.location.search);
  const filters: ActiveFilters = {
    status: 'ALL',
    search: '',
    tags: {},
  };

  const status = params.get('status');
  if (status === 'APPROVED' || status === 'DRAFT' || status === 'ARCHIVED') {
    filters.status = status;
  }

  const search = params.get('search');
  if (search) {
    filters.search = search;
  }

  for (const [key, value] of params.entries()) {
    if (key !== 'status' && key !== 'search' && value) {
      filters.tags[key] = value.split(',');
    }
  }

  return filters;
}

function syncFiltersToUrl(filters: ActiveFilters) {
  const params = new URLSearchParams();

  if (filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  for (const [category, values] of Object.entries(filters.tags)) {
    if (values.length > 0) {
      params.set(category, values.join(','));
    }
  }

  const search = params.toString() ? `?${params.toString()}` : '';
  window.history.replaceState({}, '', `${window.location.pathname}${search}`);
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<CategoryWithVocabulary[]>([]);
  const [serverTagCloud, setServerTagCloud] = useState<TagCloudEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ActiveFilters>(getInitialFilters);

  useEffect(() => {
    Promise.all([loadTemplates(), loadCategories(), loadTagCloud()])
      .then(([t, c, tc]) => {
        setTemplates(t);
        setCategories(c);
        setServerTagCloud(tc);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const tagCloud = useTagCloud(templates, categories);

  const setFilters = useCallback((newFilters: ActiveFilters) => {
    setFiltersState(newFilters);
    syncFiltersToUrl(newFilters);
  }, []);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      // Status filter
      if (filters.status !== 'ALL' && t.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const searchable = `${t.name} ${t.category} ${t.source}`.toLowerCase();
        if (!searchable.includes(q)) {
          return false;
        }
      }

      // Tag filters: AND across categories, OR within a category
      for (const [category, values] of Object.entries(filters.tags)) {
        if (values.length === 0) continue;
        const templateTags = t.tags[category as keyof typeof t.tags] || [];
        const hasMatch = values.some((v) => templateTags.includes(v));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [templates, filters]);

  const toggleTag = useCallback((category: string, value: string) => {
    setFiltersState((prev) => {
      const currentValues = prev.tags[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      const newTags = { ...prev.tags };
      if (newValues.length === 0) {
        delete newTags[category];
      } else {
        newTags[category] = newValues;
      }

      const newFilters = { ...prev, tags: newTags };
      syncFiltersToUrl(newFilters);
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    const cleared: ActiveFilters = { status: 'ALL', search: '', tags: {} };
    setFiltersState(cleared);
    syncFiltersToUrl(cleared);
  }, []);

  return {
    templates,
    categories,
    tagCloud: tagCloud.length > 0 ? tagCloud : serverTagCloud,
    loading,
    error,
    filters,
    setFilters,
    filtered,
    toggleTag,
    clearFilters,
  };
}
