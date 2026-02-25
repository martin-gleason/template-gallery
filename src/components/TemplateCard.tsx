import type { FC } from 'react';
import type { Template } from '../types';
import styles from './TemplateCard.module.css';
import StatusBadge from './StatusBadge';
import ColorSwatch from './ColorSwatch';
import TagChip from './TagChip';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
  onTagClick: (category: string, value: string) => void;
}

const TemplateCard: FC<TemplateCardProps> = ({ template, onClick, onTagClick }) => {
  const allTags: { category: string; value: string }[] = [];
  for (const [category, values] of Object.entries(template.tags)) {
    for (const value of values) {
      allTags.push({ category, value });
    }
  }
  const visibleTags = allTags.slice(0, 4);
  const overflowCount = allTags.length - 4;

  return (
    <div
      data-testid={`template-card-${template.id}`}
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div className={styles.preview}>
        <img
          src={template.preview_path || '/previews/placeholder.svg'}
          alt={`${template.name} preview`}
          className={styles.previewImage}
        />
        <div data-testid={`card-status-${template.id}`} className={styles.statusOverlay}>
          <StatusBadge status={template.status} />
        </div>
        {template.variant_type === 'REFINED' && (
          <span className={styles.variantBadge}>REFINED</span>
        )}
      </div>

      <div className={styles.body}>
        <div data-testid={`card-category-${template.id}`} className={styles.category}>
          <ColorSwatch color={template.primary_color} />
          <span>{template.category}</span>
        </div>

        <div className={styles.source}>{template.source}</div>

        <div className={styles.tags}>
          {visibleTags.map((tag) => (
            <TagChip
              key={`${tag.category}-${tag.value}`}
              value={tag.value}
              category={tag.category}
              small
              onClick={() => onTagClick(tag.category, tag.value)}
            />
          ))}
          {overflowCount > 0 && (
            <span className={styles.overflowCount}>+{overflowCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
