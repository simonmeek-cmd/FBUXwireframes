import React from 'react';

export interface SignpostItem {
  id: string;
  title: string;
  href?: string;
}

export interface HomepageSignpostsProps {
  /** Section heading */
  heading?: string;
  /** Show section heading */
  showHeading?: boolean;
  /** Signpost items (up to 8) */
  items?: SignpostItem[];
  /** Number of columns on desktop */
  columns?: 2 | 3 | 4;
  /** Show CTA button */
  showButton?: boolean;
  /** Button label */
  buttonLabel?: string;
  /** Button URL */
  buttonHref?: string;
}

const defaultItems: SignpostItem[] = [
  { id: '1', title: "Item's Title", href: '#' },
  { id: '2', title: "Item's Title", href: '#' },
  { id: '3', title: "Item's Title", href: '#' },
  { id: '4', title: "Item's Title", href: '#' },
  { id: '5', title: "Item's Title", href: '#' },
  { id: '6', title: "Item's Title", href: '#' },
  { id: '7', title: "Item's Title", href: '#' },
  { id: '8', title: "Item's Title", href: '#' },
];

/**
 * HomepageSignposts
 * Grid of signpost links for quick navigation to key pages.
 */
export const HomepageSignposts: React.FC<HomepageSignpostsProps> = ({
  heading = 'Signpost Area',
  showHeading = true,
  items = defaultItems,
  columns = 4,
  showButton = true,
  buttonLabel = 'Button',
  buttonHref = '#',
}) => {
  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <section className="py-12 px-4 bg-wire-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {showHeading && (
            <h2 className="text-2xl font-bold text-wire-800">{heading}</h2>
          )}
          {showButton && (
            <a
              href={buttonHref}
              className="px-4 py-2 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors no-underline text-sm"
            >
              {buttonLabel}
            </a>
          )}
        </div>

        {/* Signpost grid */}
        <div className={`grid grid-cols-2 ${columnClasses[columns]} gap-4`}>
          {items.slice(0, 8).map((item) => (
            <a
              key={item.id}
              href={item.href || '#'}
              className="block p-6 bg-wire-50 border border-wire-300 rounded hover:bg-wire-100 hover:border-wire-400 transition-colors no-underline group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-wire-700 group-hover:text-wire-900">
                  {item.title}
                </span>
                <span className="text-wire-400 group-hover:text-wire-600">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageSignposts;

