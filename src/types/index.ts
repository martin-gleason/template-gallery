export type TemplateStatus = 'APPROVED' | 'DRAFT' | 'ARCHIVED';
export type VariantType = 'FAITHFUL' | 'REFINED';

export interface Template {
  id: string;
  name: string;
  status: TemplateStatus;
  layout_pattern: string;
  category: string;
  color_label: string;
  primary_color: string;
  font_family: string;
  wcag_compliant: boolean;
  source: string;
  variant_type: VariantType;
  created_at: string;
  approved_by: string | null;
  tags: TemplateTags;
  preview_path: string | null;
}

export interface TemplateTags {
  program: string[];
  audience: string[];
  compliance: string[];
  'time-period': string[];
  custom: string[];
}

export interface TagCategory {
  id: string;
  name: string;
  is_controlled: boolean;
  requires_role: string | null;
}

export interface VocabularyTerm {
  value: string;
  display_label: string;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CategoryWithVocabulary extends TagCategory {
  vocabulary: VocabularyTerm[];
}

export interface TagCloudEntry {
  category: string;
  value: string;
  display_label: string;
  color: string | null;
  count: number;
}

export interface ActiveFilters {
  status: TemplateStatus | 'ALL';
  search: string;
  tags: Record<string, string[]>;
}

export interface AuditEntry {
  action: string;
  by: string;
  date: string;
}
