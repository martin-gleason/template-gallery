import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import type { Template, CategoryWithVocabulary } from '../src/types';
import TemplateDetail from '../src/components/TemplateDetail';

import categoriesData from '../public/data/categories.json';

const mockCategories = categoriesData as CategoryWithVocabulary[];

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

describe('Detail View & Actions', () => {

  test('17. TemplateDetail shows full-size preview', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('template-detail')).toBeInTheDocument();
    expect(screen.getByTestId('detail-preview')).toBeInTheDocument();
  });

  test('18. TemplateDetail shows all metadata fields', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    const metadata = screen.getByTestId('detail-metadata');
    expect(metadata).toHaveTextContent(mockTemplate.layout_pattern);
    expect(metadata).toHaveTextContent(mockTemplate.font_family);
    expect(metadata).toHaveTextContent(mockTemplate.category);
  });

  test('19. TemplateDetail shows audit trail', () => {
    render(<TemplateDetail template={{ ...mockTemplate, status: 'APPROVED', approved_by: 'Marty' }}
      categories={mockCategories} onBack={vi.fn()} onTagClick={vi.fn()} />);
    const audit = screen.getByTestId('detail-audit');
    expect(audit).toHaveTextContent('CREATED');
    expect(audit).toHaveTextContent('APPROVED');
    expect(audit).toHaveTextContent('Marty');
  });

  test('20. TemplateDetail shows tags grouped by category', () => {
    const template = {
      ...mockTemplate,
      tags: { program: ['ileps'], audience: ['supervisors'], compliance: ['aoic-required'], 'time-period': [] as string[], custom: [] as string[] }
    };
    render(<TemplateDetail template={template} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    const tags = screen.getByTestId('detail-tags');
    expect(tags).toHaveTextContent('Program');
    expect(tags).toHaveTextContent('ILEPS/CCP');
    expect(tags).toHaveTextContent('Audience');
    expect(tags).toHaveTextContent('Supervisors');
    expect(tags).toHaveTextContent('Compliance');
    expect(tags).toHaveTextContent('AOIC Required');
  });

  test('21. Download PDF button is present', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('detail-download')).toBeInTheDocument();
    expect(screen.getByTestId('detail-download')).toHaveTextContent(/download pdf/i);
  });

  test('22. Export HTML button is present', () => {
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByTestId('detail-export')).toBeInTheDocument();
    expect(screen.getByTestId('detail-export')).toHaveTextContent(/export html/i);
  });

  test('23. Back button returns to gallery', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<TemplateDetail template={mockTemplate} categories={mockCategories}
      onBack={onBack} onTagClick={vi.fn()} />);
    await user.click(screen.getByTestId('detail-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('24. Tags in detail view are clickable', async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    const template = { ...mockTemplate, tags: { ...mockTemplate.tags, program: ['ileps'] } };
    render(<TemplateDetail template={template} categories={mockCategories}
      onBack={vi.fn()} onTagClick={onTagClick} />);
    await user.click(screen.getByTestId('tag-chip-program-ileps'));
    expect(onTagClick).toHaveBeenCalledWith('program', 'ileps');
  });

});
