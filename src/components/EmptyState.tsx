import type { FC } from 'react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: FC<EmptyStateProps> = () => {
  return null;
};

export default EmptyState;
