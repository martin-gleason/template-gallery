import type { Template, CategoryWithVocabulary, TagCloudEntry } from '../types';

export async function loadTemplates(): Promise<Template[]> {
  const response = await fetch('/data/templates.json');
  if (!response.ok) throw new Error('Failed to load templates');
  return response.json();
}

export async function loadCategories(): Promise<CategoryWithVocabulary[]> {
  const response = await fetch('/data/categories.json');
  if (!response.ok) throw new Error('Failed to load categories');
  return response.json();
}

export async function loadTagCloud(): Promise<TagCloudEntry[]> {
  const response = await fetch('/data/tags.json');
  if (!response.ok) throw new Error('Failed to load tag cloud');
  return response.json();
}
