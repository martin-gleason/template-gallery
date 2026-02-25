import type { FC } from 'react';
import styles from './TagChip.module.css';

interface TagChipProps {
  value: string;
  category: string;
  displayLabel?: string;
  color?: string;
  small?: boolean;
  onClick: () => void;
}

const TagChip: FC<TagChipProps> = ({ value, category, displayLabel, color, small, onClick }) => {
  const label = displayLabel || value;
  const chipColor = color || '#666666';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      data-testid={`tag-chip-${category}-${value}`}
      className={`${styles.chip} ${small ? styles.small : ''}`}
      style={{
        backgroundColor: `${chipColor}1a`,
        color: chipColor,
      }}
      onClick={handleClick}
      type="button"
    >
      <span
        className={styles.dot}
        style={{ backgroundColor: chipColor }}
      />
      {label}
    </button>
  );
};

export default TagChip;
