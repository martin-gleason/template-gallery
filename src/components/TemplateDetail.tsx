import type { FC } from 'react';
import type { Template, CategoryWithVocabulary } from '../types';

interface TemplateDetailProps {
  template: Template;
  categories: CategoryWithVocabulary[];
  onBack: () => void;
  onTagClick: (category: string, value: string) => void;
}

const TemplateDetail: FC<TemplateDetailProps> = () => {
  return null;
};

export default TemplateDetail;
