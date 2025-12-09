import React from 'react';

export interface ContentSection {
  id: string;
  label: string;
  href?: string;
  level?: number;
}

export interface OnPageContentsIndexProps {
  /** Title for the contents index */
  title?: string;
  /** Array of content sections */
  sections?: ContentSection[];
  /** Visual style variant */
  variant?: 'default' | 'compact' | 'bordered';
}

const defaultSections: ContentSection[] = [
  { id: '1', label: 'Introduction', level: 1 },
  { id: '2', label: 'Background information', level: 1 },
  { id: '3', label: 'Key findings', level: 1 },
  { id: '4', label: 'Finding one', level: 2 },
  { id: '5', label: 'Finding two', level: 2 },
  { id: '6', label: 'Recommendations', level: 1 },
  { id: '7', label: 'Next steps', level: 1 },
];

/**
 * OnPageContentsIndex
 * A table of contents for navigating long-form content pages.
 */
export const OnPageContentsIndex: React.FC<OnPageContentsIndexProps> = ({
  title = 'On this page',
  sections = defaultSections,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-wire-100 p-4 rounded',
    compact: 'py-2',
    bordered: 'border border-wire-200 p-4 rounded',
  };

  return (
    <nav aria-label="Page contents" className={variantStyles[variant]}>
      {title && (
        <h2 className="text-sm font-bold text-wire-700 mb-3">{title}</h2>
      )}
      <ol className="space-y-1.5">
        {sections.map((section, index) => (
          <li
            key={section.id}
            style={{ paddingLeft: section.level && section.level > 1 ? `${(section.level - 1) * 1}rem` : undefined }}
          >
            <a
              href={section.href || `#section-${section.id}`}
              className={`text-sm hover:text-wire-800 transition-colors underline underline-offset-2 ${
                section.level && section.level > 1 ? 'text-wire-500' : 'text-wire-600'
              }`}
            >
              <span className="text-wire-400 mr-2">{index + 1}.</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default OnPageContentsIndex;

