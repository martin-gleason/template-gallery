import type { FC } from 'react';
import type { Template } from '../types';
import styles from './GalleryGrid.module.css';
import TemplateCard from './TemplateCard';

interface GalleryGridProps {
  templates: Template[];
  onSelect: (t: Template) => void;
  onTagClick: (category: string, value: string) => void;
}

const GalleryGrid: FC<GalleryGridProps> = ({ templates, onSelect, onTagClick }) => {
  return (
    <div data-testid="gallery-grid" className={styles.grid}>
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          onClick={() => onSelect(t)}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
