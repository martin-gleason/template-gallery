import type { FC } from 'react';
import type { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  onTagClick: (category: string, value: string) => void;
}

const TemplateCard: FC<TemplateCardProps> = () => {
  return null;
};

export default TemplateCard;
