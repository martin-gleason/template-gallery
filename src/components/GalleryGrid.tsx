import type { FC } from 'react';
import type { Template } from '../types';

interface GalleryGridProps {
  templates: Template[];
  onSelect: (t: Template) => void;
  onTagClick: (category: string, value: string) => void;
}

const GalleryGrid: FC<GalleryGridProps> = () => {
  return null;
};

export default GalleryGrid;
