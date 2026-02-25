import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import type { Template } from '../src/types';
import TemplateCard from '../src/components/TemplateCard';
import TagChip from '../src/components/TagChip';
import StatusBadge from '../src/components/StatusBadge';
import ColorSwatch from '../src/components/ColorSwatch';
import EmptyState from '../src/components/EmptyState';

const mockTemplate: Template = {
  id: 't-001-ileps-basic',
  name: 'ILEPS-CCP Basic Training Flyer',
  status: 'APPROVED',
  layout_pattern: 'two-column-split',
  category: 'ILEPS-CCP',
  color_label: 'Forest Green',
  primary_color: '#1e8449',
  font_family: 'Poppins',
  wcag_compliant: true,
  source: 'ileps_basic_orientation_02-2026.pdf',
  variant_type: 'FAITHFUL',
  created_at: '2026-02-01T10:00:00Z',
  approved_by: 'Marty',
  tags: {
    program: ['ileps'],
    audience: ['supervisors', 'line-staff'],
    compliance: ['aoic-required'],
    'time-period': [],
    custom: [],
  },
  preview_path: null,
};

describe('Core Components', () => {

  test('1. TemplateCard renders name, category, and color swatch', () => {
    render(<TemplateCard template={mockTemplate} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId(`card-category-${mockTemplate.id}`)).toHaveTextContent('ILEPS-CCP');
    const swatch = screen.getByTestId(`card-category-${mockTemplate.id}`).querySelector('[data-testid="color-swatch"]');
    expect(swatch).toBeInTheDocument();
  });

  test('2. TemplateCard shows correct status badge', () => {
    render(<TemplateCard template={{ ...mockTemplate, status: 'APPROVED' }} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId(`card-status-${mockTemplate.id}`)).toHaveTextContent('APPROVED');
  });

  test('3. TemplateCard renders tag chips with correct colors', () => {
    const template = { ...mockTemplate, tags: { ...mockTemplate.tags, program: ['ileps', 'c5'] } };
    render(<TemplateCard template={template} onClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('tag-chip-program-ileps')).toBeInTheDocument();
    expect(screen.getByTestId('tag-chip-program-c5')).toBeInTheDocument();
  });

  test('4. TagChip click fires onFilter callback', async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    render(<TagChip value="ileps" category="program" displayLabel="ILEPS/CCP" onClick={onTagClick} />);
    await user.click(screen.getByTestId('tag-chip-program-ileps'));
    expect(onTagClick).toHaveBeenCalledTimes(1);
  });

  test('5. StatusBadge renders correct variant per status', () => {
    const { rerender } = render(<StatusBadge status="APPROVED" />);
    expect(screen.getByTestId('status-badge-APPROVED')).toHaveTextContent('APPROVED');
    rerender(<StatusBadge status="DRAFT" />);
    expect(screen.getByTestId('status-badge-DRAFT')).toHaveTextContent('DRAFT');
    rerender(<StatusBadge status="ARCHIVED" />);
    expect(screen.getByTestId('status-badge-ARCHIVED')).toHaveTextContent('ARCHIVED');
  });

  test('6. ColorSwatch renders correct hex color', () => {
    render(<ColorSwatch color="#1e8449" />);
    const swatch = screen.getByTestId('color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#1e8449' });
  });

  test('7. EmptyState renders when no templates match', () => {
    render(<EmptyState onClearFilters={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no templates match/i)).toBeInTheDocument();
  });

  test('8. TemplateCard click calls onSelect', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TemplateCard template={mockTemplate} onClick={onClick} onTagClick={vi.fn()} />);
    await user.click(screen.getByTestId(`template-card-${mockTemplate.id}`));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

});
