import React from 'react';

export interface PromoTitleItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  hasImage?: boolean;
}

export interface FeaturedPromosTitlesOnlyProps {
  /** Optional heading above the promos */
  heading?: string;
  /** Array of promo items */
  items?: PromoTitleItem[];
  /** Show small thumbnail images */
  showThumbnails?: boolean;
}

const defaultItems: PromoTitleItem[] = [
  {
    id: '1',
    title: 'Featured promos, titles and first only (inline)',
    hasImage: true,
  },
  {
    id: '2',
    title: 'Featured promos, titles and first only (inline)',
    hasImage: true,
  },
  {
    id: '3',
    title: 'Featured promos, titles and first only (inline)',
    hasImage: true,
  },
];

/**
 * FeaturedPromosTitlesOnly
 * A compact list-style variant of featured promos showing titles with optional thumbnails.
 */
export const FeaturedPromosTitlesOnly: React.FC<FeaturedPromosTitlesOnlyProps> = ({
  heading,
  items = defaultItems,
  showThumbnails = true,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-4">{heading}</h2>
      )}
      <div className="border border-wire-200 rounded overflow-hidden divide-y divide-wire-200">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex items-center gap-4 p-4 bg-wire-50 hover:bg-wire-100 transition-colors cursor-pointer"
          >
            {showThumbnails && item.hasImage && (
              <div className="w-16 h-16 shrink-0 bg-wire-300 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-wire-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              {item.meta && (
                <span className="text-xs text-wire-500 block mb-1">{item.meta}</span>
              )}
              <h3 className="font-medium text-wire-800 truncate">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-wire-500 truncate">{item.subtitle}</p>
              )}
            </div>
            <span className="text-wire-400 shrink-0">→</span>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPromosTitlesOnly;


