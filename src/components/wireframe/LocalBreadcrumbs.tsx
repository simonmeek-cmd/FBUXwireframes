import React from 'react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface LocalBreadcrumbsProps {
  /** Array of breadcrumb items from root to current page */
  items?: BreadcrumbItem[];
  /** Separator character between items */
  separator?: string;
}

const defaultItems: BreadcrumbItem[] = [
  { id: '1', label: 'Home', href: '#' },
  { id: '2', label: 'About us', href: '#' },
  { id: '3', label: 'Current page' },
];

/**
 * LocalBreadcrumbs
 * Breadcrumb navigation trail showing page hierarchy.
 */
export const LocalBreadcrumbs: React.FC<LocalBreadcrumbsProps> = ({
  items = defaultItems,
  separator = '/',
}) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 bg-wire-100 border-b border-wire-200">
      <div className="max-w-6xl mx-auto">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-wire-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              {item.href && index < items.length - 1 ? (
                <a
                  href={item.href}
                  className="text-wire-600 hover:text-wire-800 underline underline-offset-2"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className="text-wire-500"
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default LocalBreadcrumbs;

