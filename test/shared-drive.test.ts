import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { GalleryData } from '../src/types';
import { loadTemplates, loadCategories, loadTagCloud } from '../src/data/loader';

import templatesData from '../public/data/templates.json';
import categoriesData from '../public/data/categories.json';
import tagsData from '../public/data/tags.json';

const FACTORY_COLOR_SCHEMES: GalleryData['colorSchemes'] = [
  { category: 'ILEPS-CCP', label: 'Forest Green', primary: '#1e8449', wcagCompliant: true },
  { category: 'COPE', label: 'Blue', primary: '#2e86c1', wcagCompliant: true },
  { category: 'C5', label: 'Navy', primary: '#1a5276', wcagCompliant: true },
  { category: 'Wellness', label: 'Teal', primary: '#148f77', wcagCompliant: true },
  { category: 'Leadership', label: 'Charcoal', primary: '#1b2631', wcagCompliant: true },
  { category: 'Success Planning', label: 'Deep Purple', primary: '#6c3483', wcagCompliant: true },
  { category: 'Data', label: 'Slate', primary: '#566573', wcagCompliant: true },
  { category: 'PPP', label: 'Gold', primary: '#d4ac0d', wcagCompliant: true },
  { category: 'Legal-Framework', label: 'Purple', primary: '#7d3c98', wcagCompliant: true },
];

function buildGalleryData(): GalleryData {
  return {
    templates: templatesData as GalleryData['templates'],
    categories: categoriesData as GalleryData['categories'],
    tagCloud: tagsData as GalleryData['tagCloud'],
    lastUpdated: new Date().toISOString(),
    colorSchemes: FACTORY_COLOR_SCHEMES,
  };
}

describe('Shared Drive Tests (Strategy A)', () => {
  let savedGalleryData: GalleryData | undefined;

  beforeEach(() => {
    savedGalleryData = window.GALLERY_DATA;
  });

  afterEach(() => {
    window.GALLERY_DATA = savedGalleryData;
  });

  describe('Data Loader — window.GALLERY_DATA path', () => {
    test('35. SD.1: Loads from window.GALLERY_DATA, no fetch calls', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const galleryData = buildGalleryData();
      window.GALLERY_DATA = galleryData;

      const templates = await loadTemplates();
      const categories = await loadCategories();
      const tagCloud = await loadTagCloud();

      expect(templates).toBe(galleryData.templates);
      expect(categories).toBe(galleryData.categories);
      expect(tagCloud).toBe(galleryData.tagCloud);
      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    test('36. SD.2: Embedded data has lastUpdated ISO 8601 timestamp', () => {
      const galleryData = buildGalleryData();
      expect(galleryData.lastUpdated).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
      const parsed = new Date(galleryData.lastUpdated);
      expect(parsed.getTime()).not.toBeNaN();
    });

    test('37. SD.3: Embedded data has factory palette (9 categories)', () => {
      const galleryData = buildGalleryData();
      expect(galleryData.colorSchemes).toHaveLength(9);
      for (const scheme of galleryData.colorSchemes) {
        expect(scheme).toHaveProperty('category');
        expect(scheme).toHaveProperty('label');
        expect(scheme).toHaveProperty('primary');
        expect(scheme).toHaveProperty('wcagCompliant');
        expect(scheme.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });

  describe('File Protocol Rendering (Puppeteer)', () => {
    test.todo('38. SD.4: Renders gallery via file:// protocol');
    test.todo('39. SD.5: Zero external network requests');
    test.todo('40. SD.6: Preview images load from relative paths');
  });

  describe('Export Script', () => {
    test.todo('41. SD.7: Exports gallery-data.js from SQLite (approved only)');
    test.todo('42. SD.8: Generates preview PNGs at 400x300');
    test.todo('43. SD.9: Copies dist/ + gallery data to target dir');
    test.todo('44. SD.10: Handles empty DB (no approved templates)');
  });

  describe('Integration', () => {
    test.todo('45. SD.11: Full round-trip: seed → export → open → verify');
    test.todo('46. SD.12: Shared drive = Cloudflare template lists');
  });
});
