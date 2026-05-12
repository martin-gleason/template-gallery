import type { Template, CategoryWithVocabulary, TagCloudEntry } from '../types';

export async function loadTemplates(): Promise<Template[]> {
  if (window.GALLERY_DATA?.templates) return window.GALLERY_DATA.templates;
  const response = await fetch('/data/templates.json');
  if (!response.ok) throw new Error('Failed to load templates');
  return response.json();
}

export async function loadCategories(): Promise<CategoryWithVocabulary[]> {
  if (window.GALLERY_DATA?.categories) return window.GALLERY_DATA.categories;
  const response = await fetch('/data/categories.json');
  if (!response.ok) throw new Error('Failed to load categories');
  return response.json();
}

export async function loadTagCloud(): Promise<TagCloudEntry[]> {
  if (window.GALLERY_DATA?.tagCloud) return window.GALLERY_DATA.tagCloud;
  const response = await fetch('/data/tags.json');
  if (!response.ok) throw new Error('Failed to load tag cloud');
  return response.json();
}
