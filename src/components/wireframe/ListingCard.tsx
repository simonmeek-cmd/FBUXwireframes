import React from 'react';

export type ListingType = 'news' | 'resources' | 'events';

export interface ListingCardProps {
  /** Card variant */
  type?: ListingType;
  /** Is this a featured item */
  isFeatured?: boolean;
  /** Type/category label */
  typeLabel?: string;
  /** Card title */
  title?: string;
  /** Date string */
  date?: string;
  /** Excerpt/description (for news/resources) */
  excerpt?: string;
  /** Topic tags (for news/resources) */
  topics?: string[];
  /** Time (for events) */
  time?: string;
  /** Location (for events) */
  location?: string;
  /** Registration fee (for events) */
  fee?: string;
  /** Link URL */
  href?: string;
}

/**
 * ListingCard
 * A card component for listing pages - adapts to News, Resources, or Events.
 */
export const ListingCard: React.FC<ListingCardProps> = ({
  type = 'news',
  isFeatured = false,
  typeLabel = 'Type Label',
  title = 'Title',
  date = '01/01/2026',
  excerpt,
  topics = ['Topic 1', 'Topic 2', 'Topic 3'],
  time = '18:00 - 20:00',
  location = 'At this place',
  fee = '£8.00',
  href = '#',
}) => {
  return (
    <article className="bg-wire-50 border border-wire-200 rounded overflow-hidden hover:border-wire-400 transition-colors group">
      {/* Image placeholder */}
      <a href={href} className="block no-underline">
        <div className="aspect-[16/10] bg-wire-200 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isFeatured && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-wire-700 text-wire-100 text-xs rounded">
              Featured
            </span>
          )}
        </div>
      </a>

      {/* Content */}
      <div className="p-4">
        {/* Type label */}
        <span className="inline-block px-2 py-0.5 bg-wire-200 text-wire-600 text-xs rounded mb-2">
          {typeLabel}
        </span>

        {/* Title */}
        <a href={href} className="block no-underline">
          <h3 className="font-bold text-wire-800 mb-1 group-hover:text-wire-600 transition-colors">
            {title}
          </h3>
        </a>

        {/* News/Resources: Date + Excerpt */}
        {(type === 'news' || type === 'resources') && (
          <>
            <p className="text-sm text-wire-500 mb-2">{date}</p>
            {excerpt ? (
              <p className="text-sm text-wire-600 mb-3 line-clamp-2">{excerpt}</p>
            ) : (
              <div className="mb-3 space-y-1.5">
                <div className="h-2.5 bg-wire-200 rounded w-full" />
                <div className="h-2.5 bg-wire-200 rounded w-full" />
                <div className="h-2.5 bg-wire-200 rounded w-3/4" />
              </div>
            )}
            {/* Topic tags */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-xs text-wire-600 underline underline-offset-2 hover:text-wire-800"
                  >
                    {topic}
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* Events: Date/Time, Location, Fee */}
        {type === 'events' && (
          <div className="text-sm space-y-1">
            <p className="text-wire-600">
              <span className="font-medium">Date & Time:</span> {date}, {time}
            </p>
            <p className="text-wire-600">
              <span className="font-medium">Location:</span> {location}
            </p>
            <p className="text-wire-600">
              <span className="font-medium">Registration fee:</span> {fee}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default ListingCard;

