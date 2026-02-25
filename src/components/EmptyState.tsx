import type { FC } from 'react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div data-testid="empty-state" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 8 }}>
        No templates match your filters
      </h2>
      <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Try removing some filters or searching for something different.
      </p>
      <button
        data-testid="empty-clear"
        onClick={onClearFilters}
        type="button"
        style={{
          padding: '8px 20px',
          borderRadius: 'var(--input-radius)',
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-md)',
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default EmptyState;
