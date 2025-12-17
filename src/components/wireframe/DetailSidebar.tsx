import React from 'react';
import { ListingType } from './ListingCard';

export interface DownloadItem {
  id: string;
  label: string;
  fileType?: string;
  fileSize?: string;
}

export interface DetailSidebarProps {
  /** Sidebar type */
  type?: ListingType;
  /** Published date */
  publishedDate?: string;
  /** Author name */
  author?: string;
  /** About section title */
  aboutTitle?: string;
  /** Type label */
  typeLabel?: string;
  /** Topic/category tags */
  tags?: string[];
  /** Show press contact section */
  showPressContact?: boolean;
  /** Press contact email */
  pressEmail?: string;
  /** Press contact phone */
  pressPhone?: string;
  /** Event date (events only) */
  eventDate?: string;
  /** Event time (events only) */
  eventTime?: string;
  /** Event location (events only) */
  eventLocation?: string;
  /** Registration fee (events only) */
  registrationFee?: string;
  /** Downloads (resources only) */
  downloads?: DownloadItem[];
  /** Show downloads section */
  showDownloads?: boolean;
}

/**
 * DetailSidebar
 * Metadata sidebar for detail pages - adapts to News, Resources, or Events.
 */
export const DetailSidebar: React.FC<DetailSidebarProps> = ({
  type = 'news',
  publishedDate = '01/01/0000',
  author = 'Jon Doe',
  aboutTitle,
  typeLabel = 'Type',
  tags = ['Topic 1', 'Topic 2', 'Topic 3'],
  showPressContact = false,
  pressEmail = 'email@email.com',
  pressPhone = '01632 960251',
  eventDate = '01/01/0000 - 01/01/0000',
  eventTime = '18:00 - 20:00',
  eventLocation = 'At this place',
  registrationFee = '£8.00',
  downloads = [
    { id: '1', label: 'Document name', fileType: 'PDF', fileSize: '2.4MB' },
    { id: '2', label: 'Document name', fileType: 'PDF', fileSize: '1.2MB' },
  ],
  showDownloads = false,
}) => {
  const defaultAboutTitle = {
    news: 'About this article',
    resources: 'About this Library single',
    events: 'About this event',
  };

  const displayAboutTitle = aboutTitle || defaultAboutTitle[type];

  return (
    <aside className="bg-wire-50 border border-wire-200 rounded p-4 space-y-6">
      {/* Event-specific: Date, Time, Location, Fee */}
      {type === 'events' && (
        <div className="space-y-2 pb-4 border-b border-wire-200">
          <p className="text-sm">
            <span className="font-medium text-wire-700">Date:</span>{' '}
            <span className="text-wire-600">{eventDate}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-wire-700">Time:</span>{' '}
            <span className="text-wire-600">{eventTime}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-wire-700">Location:</span>{' '}
            <span className="text-wire-600">{eventLocation}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-wire-700">Registration fee:</span>{' '}
            <span className="text-wire-600">{registrationFee}</span>
          </p>
        </div>
      )}

      {/* News/Resources: Published date & Author */}
      {(type === 'news' || type === 'resources') && (
        <div className="space-y-1 pb-4 border-b border-wire-200">
          <p className="text-sm">
            <span className="font-medium text-wire-700">Published:</span>{' '}
            <span className="text-wire-600">{publishedDate}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-wire-700">Author:</span>{' '}
            <span className="text-wire-600">{author}</span>
          </p>
        </div>
      )}

      {/* About section with type and tags */}
      <div className="space-y-3">
        <h3 className="font-bold text-wire-800 text-sm">{displayAboutTitle}</h3>
        
        {/* Type label */}
        <div>
          <span className="inline-block px-2 py-1 bg-wire-200 text-wire-600 text-xs rounded">
            {typeLabel}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <a
                key={idx}
                href="#"
                className="text-xs text-wire-600 underline underline-offset-2 hover:text-wire-800"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Downloads section (resources only) */}
      {(type === 'resources' || showDownloads) && downloads.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-wire-200">
          <h3 className="font-bold text-wire-800 text-sm">Downloads</h3>
          <div className="space-y-2">
            {downloads.map((download) => (
              <a
                key={download.id}
                href="#"
                className="flex items-center gap-2 text-sm text-wire-600 hover:text-wire-800 no-underline group"
              >
                <span className="w-6 h-6 bg-wire-200 rounded flex items-center justify-center text-xs">
                  ⬇
                </span>
                <span className="flex-1 group-hover:underline">
                  {download.label}
                </span>
                {download.fileType && (
                  <span className="text-xs text-wire-400">
                    {download.fileType} {download.fileSize && `(${download.fileSize})`}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Press contact */}
      {showPressContact && (
        <div className="space-y-2 pt-4 border-t border-wire-200">
          <h3 className="font-bold text-wire-800 text-sm">Press contact (Optional)</h3>
          <div className="space-y-1 text-sm text-wire-600">
            <p className="flex items-center gap-2">
              <span className="text-wire-400">✉</span>
              <a href={`mailto:${pressEmail}`} className="underline underline-offset-2 hover:text-wire-800">
                {pressEmail}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-wire-400">☎</span>
              <span>{pressPhone}</span>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DetailSidebar;


