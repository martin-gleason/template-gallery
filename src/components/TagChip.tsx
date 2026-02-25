import type { FC } from 'react';

interface TagChipProps {
  value: string;
  category: string;
  displayLabel?: string;
  color?: string;
  small?: boolean;
  onClick: () => void;
}

const TagChip: FC<TagChipProps> = () => {
  return null;
};

export default TagChip;
