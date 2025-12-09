import React from 'react';
import { ListingHero } from './ListingHero';
import { ListingFilters, FilterConfig } from './ListingFilters';
import { ListingCard, ListingType } from './ListingCard';
import { LocalBreadcrumbs } from './LocalBreadcrumbs';

export interface ListingItemConfig {
  typeLabel?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  topics?: string[];
  time?: string;
  location?: string;
  fee?: string;
  isFeatured?: boolean;
}

export interface ListingPageProps {
  /** Listing type */
  listingType?: ListingType;
  /** Hero title */
  title?: string;
  /** Hero intro copy */
  introCopy?: string;
  /** Show hero image */
  showHeroImage?: boolean;
  /** Hero image position */
  heroImagePosition?: 'right' | 'background';
  /** Show hero button */
  showHeroButton?: boolean;
  /** Hero button label */
  heroButtonLabel?: string;
  /** Show contact info in hero */
  showContactInfo?: boolean;
  /** Contact email */
  contactEmail?: string;
  /** Contact phone */
  contactPhone?: string;
  /** Filter configurations */
  filters?: FilterConfig[];
  /** Number of items to display (can be string from select) */
  itemCount?: number | string;
  /** Show pagination */
  showPagination?: boolean;
  // Featured item 1 - flat props
  featured1TypeLabel?: string;
  featured1Title?: string;
  featured1Date?: string;
  featured1Excerpt?: string;
  // Featured item 2 - flat props
  featured2TypeLabel?: string;
  featured2Title?: string;
  featured2Date?: string;
  featured2Excerpt?: string;
  // Featured item 3 - flat props
  featured3TypeLabel?: string;
  featured3Title?: string;
  featured3Date?: string;
  featured3Excerpt?: string;
  // Filter labels (for customization)
  filter1Label?: string;
  filter2Label?: string;
  filter3Label?: string;
}

// Default filters for each type
const defaultFiltersForType: Record<ListingType, FilterConfig[]> = {
  news: [
    { id: 'type', label: 'Type', options: [{ value: '', label: 'Any' }, { value: 'news', label: 'News' }, { value: 'press', label: 'Press Release' }, { value: 'announcement', label: 'Announcement' }] },
    { id: 'topic', label: 'Topic', options: [{ value: '', label: 'Any' }, { value: 'topic1', label: 'Topic 1' }, { value: 'topic2', label: 'Topic 2' }] },
  ],
  resources: [
    { id: 'type', label: 'Type', options: [{ value: '', label: 'Any' }, { value: 'guide', label: 'Guide' }, { value: 'report', label: 'Report' }] },
    { id: 'topic', label: 'Topic', options: [{ value: '', label: 'Any' }, { value: 'topic1', label: 'Topic 1' }, { value: 'topic2', label: 'Topic 2' }] },
  ],
  events: [
    { id: 'type', label: 'Event Type', options: [{ value: '', label: 'Any' }, { value: 'online', label: 'Online' }, { value: 'inperson', label: 'In-person' }] },
    { id: 'category', label: 'Event Category', options: [{ value: '', label: 'Any' }, { value: 'workshop', label: 'Workshop' }, { value: 'conference', label: 'Conference' }] },
    { id: 'location', label: 'Event Location', options: [{ value: '', label: 'Any' }, { value: 'london', label: 'London' }, { value: 'manchester', label: 'Manchester' }] },
  ],
};

const defaultTitles: Record<ListingType, string> = {
  news: 'News',
  resources: 'Resources',
  events: 'Events',
};

/**
 * ListingPage
 * A complete listing page component for News, Resources, or Events.
 */
export const ListingPage: React.FC<ListingPageProps> = ({
  listingType = 'news',
  title,
  introCopy,
  showHeroImage = false,
  heroImagePosition = 'right',
  showHeroButton = false,
  heroButtonLabel = 'Button',
  showContactInfo = false,
  contactEmail,
  contactPhone,
  filters,
  itemCount = 9,
  showPagination = true,
  // Featured items - flat props
  featured1TypeLabel,
  featured1Title,
  featured1Date,
  featured1Excerpt,
  featured2TypeLabel,
  featured2Title,
  featured2Date,
  featured2Excerpt,
  featured3TypeLabel,
  featured3Title,
  featured3Date,
  featured3Excerpt,
  filter1Label,
  filter2Label,
  filter3Label,
}) => {
  const displayTitle = title || defaultTitles[listingType];
  
  // Build custom filters if labels are provided
  const displayFilters = filters || (() => {
    const baseFilters = [...defaultFiltersForType[listingType]];
    if (filter1Label && baseFilters[0]) baseFilters[0] = { ...baseFilters[0], label: filter1Label };
    if (filter2Label && baseFilters[1]) baseFilters[1] = { ...baseFilters[1], label: filter2Label };
    if (filter3Label && baseFilters[2]) baseFilters[2] = { ...baseFilters[2], label: filter3Label };
    return baseFilters;
  })();

  // Build featured items array from flat props
  const featuredItems: ListingItemConfig[] = [
    { typeLabel: featured1TypeLabel, title: featured1Title, date: featured1Date, excerpt: featured1Excerpt, isFeatured: true },
    { typeLabel: featured2TypeLabel, title: featured2Title, date: featured2Date, excerpt: featured2Excerpt, isFeatured: true },
    { typeLabel: featured3TypeLabel, title: featured3Title, date: featured3Date, excerpt: featured3Excerpt, isFeatured: true },
  ];

  // Parse itemCount (could be string from select)
  const parsedItemCount = typeof itemCount === 'string' ? parseInt(itemCount, 10) : itemCount;
  const displayItemCount = isNaN(parsedItemCount) ? 9 : parsedItemCount;

  // Generate remaining placeholder items
  const remainingCount = Math.max(0, displayItemCount - 3);
  const placeholderItems: ListingItemConfig[] = Array.from({ length: remainingCount }, (_, i) => ({
    typeLabel: 'Type Label',
    title: 'Title',
    date: '01/01/2026',
    isFeatured: false,
  }));

  const allItems = [...featuredItems, ...placeholderItems].slice(0, displayItemCount);

  // Calculate pagination
  const totalPages = Math.ceil(displayItemCount / 9);

  return (
    <div>
      {/* Hero */}
      <ListingHero
        title={displayTitle}
        introCopy={introCopy}
        showImage={showHeroImage}
        imagePosition={heroImagePosition}
        showButton={showHeroButton}
        buttonLabel={heroButtonLabel}
        showContactInfo={showContactInfo}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
      />

      {/* Breadcrumbs */}
      <div className="bg-wire-50 border-b border-wire-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <LocalBreadcrumbs
            items={[
              { id: 'home', label: 'Home', href: '#' },
              { id: 'listing', label: displayTitle },
            ]}
          />
        </div>
      </div>

      {/* Filters */}
      <ListingFilters filters={displayFilters} />

      {/* Listing Grid */}
      <section className="bg-wire-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item, idx) => (
              <ListingCard
                key={idx}
                type={listingType}
                isFeatured={item.isFeatured}
                typeLabel={item.typeLabel || 'Type Label'}
                title={item.title || 'Title'}
                date={item.date || '01/01/2026'}
                excerpt={item.excerpt}
                topics={item.topics || ['Topic 1', 'Topic 2', 'Topic 3']}
                time={item.time || '18:00 - 20:00'}
                location={item.location || 'At this place'}
                fee={item.fee || '£8.00'}
              />
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

export default ListingPage;

