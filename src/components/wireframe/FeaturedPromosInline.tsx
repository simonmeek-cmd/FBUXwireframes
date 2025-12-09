import React from 'react';

export interface PromoItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  hasImage?: boolean;
  tag?: string;
}

export interface FeaturedPromosInlineProps {
  /** Optional heading above the promos */
  heading?: string;
  /** Array of promo items */
  items?: PromoItem[];
  /** Number of columns on desktop */
  columns?: 2 | 3 | 4;
  /** Show action button for each promo */
  showActions?: boolean;
  /** Action button label */
  actionLabel?: string;
}

const defaultItems: PromoItem[] = [
  {
    id: '1',
    title: 'Title',
    subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk',
    hasImage: true,
    tag: 'Event',
  },
  {
    id: '2',
    title: 'Title',
    subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk',
    hasImage: true,
    tag: 'News',
  },
  {
    id: '3',
    title: 'Title',
    subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk',
    hasImage: true,
    tag: 'Campaign',
  },
];

/**
 * FeaturedPromosInline
 * Grid of promotional cards with optional images and metadata.
 */
export const FeaturedPromosInline: React.FC<FeaturedPromosInlineProps> = ({
  heading,
  items = defaultItems,
  columns = 3,
  showActions = true,
  actionLabel = 'Read more',
}) => {
  const columnStyles = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div>
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div className={`grid grid-cols-1 ${columnStyles[columns]} gap-4`}>
        {items.map((item) => (
          <article
            key={item.id}
            className="bg-wire-100 border border-wire-200 rounded overflow-hidden hover:shadow-md transition-shadow"
          >
            {item.hasImage && (
              <div className="aspect-[16/10] bg-wire-300 flex items-center justify-center relative">
                <svg className="w-10 h-10 text-wire-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                {item.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-wire-600 text-wire-100 text-xs rounded">
                    {item.tag}
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              {item.meta && (
                <span className="text-xs text-wire-500 mb-1 block">{item.meta}</span>
              )}
              <h3 className="font-bold text-wire-800 mb-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-wire-600 mb-3">{item.subtitle}</p>
              )}
              {showActions && (
                <a href="#" className="text-sm text-wire-600 hover:text-wire-800 underline underline-offset-2">
                  {actionLabel} →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPromosInline;

