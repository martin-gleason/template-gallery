import type { FC } from 'react';
import type { Template, CategoryWithVocabulary, AuditEntry } from '../types';
import styles from './TemplateDetail.module.css';
import StatusBadge from './StatusBadge';
import ColorSwatch from './ColorSwatch';
import TagChip from './TagChip';

interface TemplateDetailProps {
  template: Template;
  categories: CategoryWithVocabulary[];
  onBack: () => void;
  onTagClick: (category: string, value: string) => void;
}

function buildAuditTrail(template: Template): AuditEntry[] {
  const entries: AuditEntry[] = [
    { action: 'CREATED', by: 'System', date: template.created_at },
  ];

  if (template.status === 'APPROVED' && template.approved_by) {
    entries.push({
      action: 'APPROVED',
      by: template.approved_by,
      date: template.created_at,
    });
  }

  if (template.status === 'ARCHIVED') {
    if (template.approved_by) {
      entries.push({
        action: 'APPROVED',
        by: template.approved_by,
        date: template.created_at,
      });
    }
    entries.push({
      action: 'ARCHIVED',
      by: 'System',
      date: template.created_at,
    });
  }

  return entries;
}

function getDisplayLabel(
  categories: CategoryWithVocabulary[],
  categoryId: string,
  value: string
): string {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return value;
  const term = cat.vocabulary.find((v) => v.value === value);
  return term?.display_label || value;
}

function getTagColor(
  categories: CategoryWithVocabulary[],
  categoryId: string,
  value: string
): string | undefined {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return undefined;
  const term = cat.vocabulary.find((v) => v.value === value);
  return term?.color || undefined;
}

function getCategoryName(
  categories: CategoryWithVocabulary[],
  categoryId: string
): string {
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.name || categoryId;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const TemplateDetail: FC<TemplateDetailProps> = ({ template, categories, onBack, onTagClick }) => {
  const auditTrail = buildAuditTrail(template);

  const tagCategories = Object.entries(template.tags)
    .filter(([, values]) => values.length > 0);

  return (
    <div data-testid="template-detail" className={styles.detail}>
      <header className={styles.header}>
        <button
          data-testid="detail-back"
          className={styles.backButton}
          onClick={onBack}
          type="button"
        >
          &larr; Back to Gallery
        </button>
        <div className={styles.headerRight}>
          <StatusBadge status={template.status} />
        </div>
      </header>

      <h1 className={styles.name}>{template.name}</h1>

      <div className={styles.layout}>
        <div data-testid="detail-preview" className={styles.preview}>
          <img
            src={template.preview_path || '/previews/placeholder.svg'}
            alt={`${template.name} preview`}
            className={styles.previewImage}
          />
        </div>

        <div className={styles.details}>
          <section data-testid="detail-metadata" className={styles.metadata}>
            <h2 className={styles.sectionTitle}>Metadata</h2>
            <dl className={styles.metadataGrid}>
              <dt>Category</dt>
              <dd>{template.category}</dd>
              <dt>Source</dt>
              <dd>{template.source}</dd>
              <dt>Variant</dt>
              <dd>{template.variant_type}</dd>
              <dt>Layout</dt>
              <dd>{template.layout_pattern}</dd>
              <dt>Font</dt>
              <dd>{template.font_family}</dd>
              <dt>Color</dt>
              <dd className={styles.colorField}>
                <ColorSwatch color={template.primary_color} />
                <span>{template.color_label} ({template.primary_color})</span>
              </dd>
              <dt>WCAG</dt>
              <dd>{template.wcag_compliant ? 'Compliant' : 'Non-compliant'}</dd>
              <dt>Created</dt>
              <dd>{formatDate(template.created_at)}</dd>
              {template.approved_by && (
                <>
                  <dt>Approved by</dt>
                  <dd>{template.approved_by}</dd>
                </>
              )}
            </dl>
          </section>

          <section data-testid="detail-tags" className={styles.tagsSection}>
            <h2 className={styles.sectionTitle}>Tags</h2>
            {tagCategories.map(([categoryId, values]) => (
              <div key={categoryId} className={styles.tagGroup}>
                <h3 className={styles.tagGroupTitle}>
                  {getCategoryName(categories, categoryId)}
                </h3>
                <div className={styles.tagList}>
                  {values.map((value: string) => (
                    <TagChip
                      key={`${categoryId}-${value}`}
                      value={value}
                      category={categoryId}
                      displayLabel={getDisplayLabel(categories, categoryId, value)}
                      color={getTagColor(categories, categoryId, value)}
                      onClick={() => onTagClick(categoryId, value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section data-testid="detail-audit" className={styles.auditSection}>
            <h2 className={styles.sectionTitle}>Audit Trail</h2>
            <ul className={styles.auditList}>
              {auditTrail.map((entry, i) => (
                <li key={i} className={styles.auditEntry}>
                  <span className={styles.auditAction}>{entry.action}</span>
                  <span className={styles.auditBy}>by {entry.by}</span>
                  <span className={styles.auditDate}>{formatDate(entry.date)}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.actions}>
            <button
              data-testid="detail-download"
              className={styles.actionButton}
              type="button"
              onClick={() => {
                if (template.preview_path) {
                  window.open(template.preview_path, '_blank');
                }
              }}
            >
              Download PDF
            </button>
            <button
              data-testid="detail-export"
              className={styles.actionButtonSecondary}
              type="button"
            >
              Export HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
