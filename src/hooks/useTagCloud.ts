import { useMemo } from 'react';
import type { Template, TagCloudEntry, CategoryWithVocabulary } from '../types';

export function useTagCloud(
  templates: Template[],
  categories: CategoryWithVocabulary[]
): TagCloudEntry[] {
  return useMemo(() => {
    const counts = new Map<string, number>();

    for (const template of templates) {
      for (const [category, values] of Object.entries(template.tags)) {
        for (const value of values) {
          const key = `${category}:${value}`;
          counts.set(key, (counts.get(key) || 0) + 1);
        }
      }
    }

    const entries: TagCloudEntry[] = [];

    for (const cat of categories) {
      for (const term of cat.vocabulary) {
        const key = `${cat.id}:${term.value}`;
        const count = counts.get(key) || 0;
        if (count > 0) {
          entries.push({
            category: cat.id,
            value: term.value,
            display_label: term.display_label,
            color: term.color,
            count,
          });
        }
      }
    }

    entries.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return b.count - a.count;
    });

    return entries;
  }, [templates, categories]);
}
