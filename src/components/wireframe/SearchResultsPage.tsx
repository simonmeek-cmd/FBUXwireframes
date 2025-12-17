import React from 'react';
import { LocalBreadcrumbs } from './LocalBreadcrumbs';

export interface SearchResultItem {
  title?: string;
  date?: string;
  excerpt?: string;
}

export interface SearchResultsPageProps {
  /** Page title */
  title?: string;
  /** Intro/summary text */
  introCopy?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search button label */
  searchButtonLabel?: string;
  /** Number of results to display */
  resultCount?: number | string;
  /** Show pagination */
  showPagination?: boolean;
  // Featured results (editable)
  result1Title?: string;
  result1Date?: string;
  result1Excerpt?: string;
  result2Title?: string;
  result2Date?: string;
  result2Excerpt?: string;
  result3Title?: string;
  result3Date?: string;
  result3Excerpt?: string;
}

/**
 * SearchResultsPage
 * A search results listing page with search bar and list-style results.
 */
export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  title = 'Search result listing',
  introCopy,
  searchPlaceholder = 'Search',
  searchButtonLabel = 'Search',
  resultCount = 9,
  showPagination = true,
  result1Title,
  result1Date,
  result1Excerpt,
  result2Title,
  result2Date,
  result2Excerpt,
  result3Title,
  result3Date,
  result3Excerpt,
}) => {
  // Parse resultCount
  const parsedResultCount = typeof resultCount === 'string' ? parseInt(resultCount, 10) : resultCount;
  const displayResultCount = isNaN(parsedResultCount) ? 9 : parsedResultCount;

  // Build featured results from flat props
  const featuredResults: SearchResultItem[] = [
    { title: result1Title, date: result1Date, excerpt: result1Excerpt },
    { title: result2Title, date: result2Date, excerpt: result2Excerpt },
    { title: result3Title, date: result3Date, excerpt: result3Excerpt },
  ];

  // Generate remaining placeholder results
  const remainingCount = Math.max(0, displayResultCount - 3);
  const placeholderResults: SearchResultItem[] = Array.from({ length: remainingCount }, () => ({
    title: "Item's Title",
    date: '01/01/2026',
  }));

  const allResults = [...featuredResults, ...placeholderResults].slice(0, displayResultCount);

  // Calculate pagination
  const totalPages = Math.ceil(displayResultCount / 10);

  return (
    <div>
      {/* Hero with search bar */}
      <section className="bg-wire-200 border-b border-wire-300">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-wire-800 mb-4">
            {title}
          </h1>
          {introCopy && (
            <div 
              className="text-wire-600 mb-6 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: introCopy }}
            />
          )}
          {/* Search bar */}
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-wire-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white border border-wire-300 rounded text-wire-700 focus:outline-none focus:border-wire-500"
              />
            </div>
            <button className="px-6 py-3 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors font-medium">
              {searchButtonLabel}
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-wire-50 border-b border-wire-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <LocalBreadcrumbs
            items={[
              { id: 'home', label: 'Home', href: '#' },
              { id: 'search', label: 'Search Results' },
            ]}
          />
        </div>
      </div>

      {/* Results list */}
      <section className="bg-wire-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {allResults.map((result, idx) => (
              <article
                key={idx}
                className="bg-wire-50 border border-wire-200 rounded p-4 hover:border-wire-400 transition-colors"
              >
                <div className="flex gap-6">
                  {/* Content */}
                  <div className="flex-1">
                    <a href="#" className="block no-underline">
                      <h2 className="font-bold text-wire-800 text-lg mb-1 hover:text-wire-600 transition-colors">
                        {result.title || "Item's Title"}
                      </h2>
                    </a>
                    <p className="text-sm text-wire-500 mb-2">{result.date || '01/01/2026'}</p>
                    {result.excerpt ? (
                      <p className="text-wire-600 text-sm line-clamp-3">{result.excerpt}</p>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="h-2.5 bg-wire-200 rounded w-full" />
                        <div className="h-2.5 bg-wire-200 rounded w-full" />
                        <div className="h-2.5 bg-wire-200 rounded w-3/4" />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-32 h-24 shrink-0 bg-wire-200 rounded flex items-center justify-center">
                    <svg className="w-8 h-8 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="px-3 py-2 text-wire-500 hover:text-wire-700">←</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded ${
                    i === 0
                      ? 'bg-wire-800 text-wire-100'
                      : 'bg-wire-200 text-wire-600 hover:bg-wire-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button className="px-3 py-2 text-wire-500 hover:text-wire-700">→</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResultsPage;


