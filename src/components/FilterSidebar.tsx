import type { FC } from 'react';
import type { CategoryWithVocabulary, TagCloudEntry, ActiveFilters, TemplateStatus } from '../types';
import styles from './FilterSidebar.module.css';
import SearchBar from './SearchBar';

interface FilterSidebarProps {
  categories: CategoryWithVocabulary[];
  tagCloud: TagCloudEntry[];
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  templateCount: number;
  totalCount: number;
}

const STATUS_OPTIONS: Array<{ value: TemplateStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const FilterSidebar: FC<FilterSidebarProps> = ({
  categories,
  tagCloud,
  filters,
  onFilterChange,
  templateCount,
  totalCount,
}) => {
  const hasActiveFilters = filters.status !== 'ALL' || filters.search !== '' || Object.keys(filters.tags).length > 0;

  const getTagCount = (category: string, value: string): number => {
    const entry = tagCloud.find((t) => t.category === category && t.value === value);
    return entry?.count || 0;
  };

  const handleStatusChange = (status: TemplateStatus | 'ALL') => {
    onFilterChange({ ...filters, status });
  };

  const handleTagToggle = (category: string, value: string) => {
    const currentValues = filters.tags[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newTags = { ...filters.tags };
    if (newValues.length === 0) {
      delete newTags[category];
    } else {
      newTags[category] = newValues;
    }

    onFilterChange({ ...filters, tags: newTags });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handleClear = () => {
    onFilterChange({ status: 'ALL', search: '', tags: {} });
  };

  const tagCategories = categories.filter((c) => c.vocabulary.length > 0);

  return (
    <aside data-testid="filter-sidebar" className={styles.sidebar}>
      <div className={styles.section}>
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Status</h3>
        {STATUS_OPTIONS.map((opt) => (
          <label key={opt.value} className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              data-testid={`filter-status-${opt.value}`}
              checked={filters.status === opt.value}
              onChange={() => handleStatusChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {tagCategories.map((cat) => (
        <div key={cat.id} className={styles.section}>
          <h3 className={styles.sectionTitle}>{cat.name}</h3>
          {cat.vocabulary.filter((term) => term.is_active).map((term) => {
            const count = getTagCount(cat.id, term.value);
            const isChecked = (filters.tags[cat.id] || []).includes(term.value);
            return (
              <label key={term.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  data-testid={`filter-tag-${cat.id}-${term.value}`}
                  checked={isChecked}
                  onChange={() => handleTagToggle(cat.id, term.value)}
                />
                {term.color && (
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: term.color }}
                  />
                )}
                <span>{term.display_label}</span>
                {count > 0 && <span className={styles.count}>({count})</span>}
              </label>
            );
          })}
        </div>
      ))}

      <div className={styles.section}>
        <div className={styles.resultCount}>
          {templateCount} of {totalCount} templates
        </div>
      </div>

      {hasActiveFilters && (
        <button
          data-testid="filter-clear"
          className={styles.clearButton}
          onClick={handleClear}
          type="button"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
};

export default FilterSidebar;
