import type { FC } from 'react';
import type { CategoryWithVocabulary, TagCloudEntry, ActiveFilters } from '../types';

interface FilterSidebarProps {
  categories: CategoryWithVocabulary[];
  tagCloud: TagCloudEntry[];
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  templateCount: number;
  totalCount: number;
}

const FilterSidebar: FC<FilterSidebarProps> = () => {
  return null;
};

export default FilterSidebar;
