import type { FC } from 'react';
import type { TemplateStatus } from '../types';
import styles from './StatusBadge.module.css';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: TemplateStatus;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={clsx(styles.badge, styles[status.toLowerCase()])}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
