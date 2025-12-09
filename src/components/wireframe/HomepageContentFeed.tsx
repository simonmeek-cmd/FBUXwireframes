import React, { useState } from 'react';

export interface ContentFeedItem {
  id: string;
  title: string;
  date?: string;
  category: 'news' | 'events' | 'resources';
  featured?: boolean;
}

export interface HomepageContentFeedProps {
  /** Section heading */
  heading?: string;
  /** Show section heading */
  showHeading?: boolean;
  /** Show category tabs */
  showTabs?: boolean;
  /** Categories to show */
  categories?: ('news' | 'events' | 'resources')[];
  /** Feed items */
  items?: ContentFeedItem[];
  /** Show "See all" button */
  showSeeAll?: boolean;
  /** See all button label */
  seeAllLabel?: string;
  /** See all URL */
  seeAllHref?: string;
  /** Number of items to display per category */
  itemsPerCategory?: number;
}

const defaultItems: ContentFeedItem[] = [
  { id: '1', title: "Item's Title", date: '01/01/2025', category: 'news', featured: true },
  { id: '2', title: "Item's Title", date: '01/01/2025', category: 'news' },
  { id: '3', title: "Item's Title", date: '01/01/2025', category: 'news' },
  { id: '4', title: "Item's Title", date: '01/01/2025', category: 'events', featured: true },
  { id: '5', title: "Item's Title", date: '01/01/2025', category: 'events' },
  { id: '6', title: "Item's Title", date: '01/01/2025', category: 'resources', featured: true },
];

const categoryLabels: Record<string, string> = {
  news: 'News',
  events: 'Events',
  resources: 'Resources',
};

/**
 * HomepageContentFeed
 * Tabbed content feed showing news, events, and resources.
 */
export const HomepageContentFeed: React.FC<HomepageContentFeedProps> = ({
  heading = 'Latest Content Feed',
  showHeading = true,
  showTabs = true,
  categories = ['news', 'events', 'resources'],
  items = defaultItems,
  showSeeAll = true,
  seeAllLabel = 'See all',
  seeAllHref = '#',
  itemsPerCategory = 3,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'news');

  const filteredItems = items
    .filter((item) => item.category === activeCategory)
    .slice(0, itemsPerCategory);

  return (
    <section className="py-12 px-4 bg-wire-100">
      <div className="max-w-6xl mx-auto">
        {showHeading && (
          <h2 className="text-2xl font-bold text-wire-800 mb-6">{heading}</h2>
        )}

        {/* Category tabs */}
        {showTabs && categories.length > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-wire-700 text-wire-100'
                    : 'bg-wire-200 text-wire-600 hover:bg-wire-300'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        )}

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-wire-50 border border-wire-300 rounded overflow-hidden hover:border-wire-400 transition-colors"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-wire-200 relative flex items-center justify-center">
                <svg className="w-10 h-10 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-wire-700 text-wire-100 text-xs rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-wire-800 mb-1">{item.title}</h3>
                {item.date && (
                  <p className="text-sm text-wire-500">{item.date}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* See all button */}
        {showSeeAll && (
          <div className="text-center mt-8">
            <a
              href={seeAllHref}
              className="inline-block px-6 py-2 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors no-underline"
            >
              {seeAllLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageContentFeed;

