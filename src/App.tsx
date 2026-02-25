import { useState } from 'react';
import styles from './App.module.css';
import { useTemplates } from './hooks/useTemplates';
import FilterSidebar from './components/FilterSidebar';
import GalleryGrid from './components/GalleryGrid';
import EmptyState from './components/EmptyState';
import TemplateDetail from './components/TemplateDetail';
import type { Template } from './types';

function App() {
  const {
    templates,
    categories,
    tagCloud,
    loading,
    error,
    filters,
    setFilters,
    filtered,
    toggleTag,
    clearFilters,
  } = useTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSelect = (t: Template) => {
    setSelectedTemplate(t);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleDetailTagClick = (category: string, value: string) => {
    toggleTag(category, value);
    setSelectedTemplate(null);
  };

  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Template Gallery</h1>
        <span className={styles.subtitle}>CCJCPS Training Flyer Templates</span>
      </header>

      {selectedTemplate ? (
        <TemplateDetail
          template={selectedTemplate}
          categories={categories}
          onBack={handleBack}
          onTagClick={handleDetailTagClick}
        />
      ) : (
        <div className={styles.content}>
          <FilterSidebar
            categories={categories}
            tagCloud={tagCloud}
            filters={filters}
            onFilterChange={setFilters}
            templateCount={filtered.length}
            totalCount={templates.length}
          />

          <main className={styles.main}>
            {filtered.length > 0 ? (
              <GalleryGrid
                templates={filtered}
                onSelect={handleSelect}
                onTagClick={toggleTag}
              />
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
