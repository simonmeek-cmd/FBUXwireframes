import React from 'react';
import { ListingType } from './ListingCard';
import { DetailSidebar, DownloadItem } from './DetailSidebar';
import { LocalBreadcrumbs } from './LocalBreadcrumbs';
import { SocialShareTag } from './SocialShareTag';

export interface DetailPageProps {
  /** Page type */
  detailType?: ListingType;
  /** Page title */
  title?: string;
  /** Hero intro/summary - supports HTML */
  introCopy?: string;
  /** Show hero image */
  showHeroImage?: boolean;
  /** Show CTA button (events) */
  showCtaButton?: boolean;
  /** CTA button label */
  ctaButtonLabel?: string;
  /** CTA button URL */
  ctaButtonHref?: string;
  /** Published date */
  publishedDate?: string;
  /** Author */
  author?: string;
  /** Type label */
  typeLabel?: string;
  /** Topic/category tags */
  tags?: string[];
  /** Show press contact */
  showPressContact?: boolean;
  /** Press email */
  pressEmail?: string;
  /** Press phone */
  pressPhone?: string;
  /** Event date (events) */
  eventDate?: string;
  /** Event time (events) */
  eventTime?: string;
  /** Event location (events) */
  eventLocation?: string;
  /** Registration fee (events) */
  registrationFee?: string;
  /** Downloads (resources) */
  downloads?: DownloadItem[];
  /** Parent listing page name */
  parentPageName?: string;
}

const defaultTitles: Record<ListingType, string> = {
  news: 'News Article',
  resources: 'Resource',
  events: 'Event',
};

const defaultParentNames: Record<ListingType, string> = {
  news: 'News',
  resources: 'Resources',
  events: 'Events',
};

/**
 * DetailPage
 * A detail/single page layout for News Articles, Resources, or Events.
 */
export const DetailPage: React.FC<DetailPageProps> = ({
  detailType = 'news',
  title,
  introCopy,
  showHeroImage = true,
  showCtaButton = false,
  ctaButtonLabel = 'Button (optional)',
  ctaButtonHref = '#',
  publishedDate = '01/01/0000',
  author = 'Jon Doe',
  typeLabel = 'Type',
  tags = ['Topic 1', 'Topic 2', 'Topic 3'],
  showPressContact = false,
  pressEmail,
  pressPhone,
  eventDate = '01/01/0000 - 01/01/0000',
  eventTime = '18:00 - 20:00',
  eventLocation = 'At this place',
  registrationFee = '£8.00',
  downloads,
  parentPageName,
}) => {
  const displayTitle = title || defaultTitles[detailType];
  const displayParentName = parentPageName || defaultParentNames[detailType];
  const showEventButton = detailType === 'events' || showCtaButton;

  return (
    <div>
      {/* Hero */}
      <section className="bg-wire-200 border-b border-wire-300">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-4">
                {displayTitle}
              </h1>
              {introCopy ? (
                <div 
                  className="text-wire-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: introCopy }}
                />
              ) : (
                <div className="mb-4 space-y-2 max-w-2xl">
                  <div className="h-3 bg-wire-300 rounded w-full" />
                  <div className="h-3 bg-wire-300 rounded w-full" />
                  <div className="h-3 bg-wire-300 rounded w-3/4" />
                </div>
              )}
              {showEventButton && (
                <a
                  href={ctaButtonHref}
                  className="inline-block px-6 py-2 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors no-underline"
                >
                  {ctaButtonLabel}
                </a>
              )}
            </div>

            {/* Hero image */}
            {showHeroImage && (
              <div className="w-full md:w-48 shrink-0">
                <div className="aspect-square bg-wire-300 rounded flex items-center justify-center">
                  <svg className="w-10 h-10 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumbs + Social Share */}
      <div className="bg-wire-50 border-b border-wire-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <LocalBreadcrumbs
            items={[
              { id: 'home', label: 'Home', href: '#' },
              { id: 'parent', label: displayParentName, href: '#' },
              { id: 'current', label: displayTitle },
            ]}
          />
          <SocialShareTag />
        </div>
      </div>

      {/* Main content area with sidebar */}
      <section className="bg-wire-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1">
              {/* Flexible components area placeholder */}
              <div className="bg-wire-50 border-2 border-dashed border-wire-300 rounded p-8 text-center mb-8">
                <h2 className="text-lg font-bold text-wire-700 mb-2">Flexible components area</h2>
                <p className="text-sm text-wire-500 mb-1">Inline Components First</p>
                <p className="text-xs text-wire-400">
                  All inline components available as shown in pagebuilder wireframe
                </p>
              </div>

              {/* Full-width components area placeholder */}
              <div className="bg-wire-50 border-2 border-dashed border-wire-300 rounded p-8 text-center">
                <h2 className="text-lg font-bold text-wire-700 mb-2">Flexible components area</h2>
                <p className="text-sm text-wire-500 mb-1">Full-width Components Second</p>
                <p className="text-xs text-wire-400">
                  All full-width components available as shown in pagebuilder wireframe
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-72 shrink-0">
              <DetailSidebar
                type={detailType}
                publishedDate={publishedDate}
                author={author}
                typeLabel={typeLabel}
                tags={tags}
                showPressContact={showPressContact}
                pressEmail={pressEmail}
                pressPhone={pressPhone}
                eventDate={eventDate}
                eventTime={eventTime}
                eventLocation={eventLocation}
                registrationFee={registrationFee}
                downloads={downloads}
                showDownloads={detailType === 'resources'}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;

