import React from 'react';

export interface ListingHeroProps {
  /** Page title */
  title?: string;
  /** Intro copy - supports HTML */
  introCopy?: string;
  /** Show hero image */
  showImage?: boolean;
  /** Image position */
  imagePosition?: 'right' | 'background';
  /** Show CTA button */
  showButton?: boolean;
  /** Button label */
  buttonLabel?: string;
  /** Button URL */
  buttonHref?: string;
  /** Show press/contact info */
  showContactInfo?: boolean;
  /** Contact email */
  contactEmail?: string;
  /** Contact phone */
  contactPhone?: string;
  /** Contact label (e.g., "Press team phone:") */
  contactPhoneLabel?: string;
}

/**
 * ListingHero
 * Hero component for listing pages with optional contact info and various layout options.
 */
export const ListingHero: React.FC<ListingHeroProps> = ({
  title = 'Listing Page',
  introCopy,
  showImage = false,
  imagePosition = 'right',
  showButton = false,
  buttonLabel = 'Button',
  buttonHref = '#',
  showContactInfo = false,
  contactEmail = 'presscontact@organisation.org.uk',
  contactPhone = '020 123 456 789',
  contactPhoneLabel = 'Press team phone:',
}) => {
  // Background image variant
  if (showImage && imagePosition === 'background') {
    return (
      <section className="relative bg-wire-400 min-h-[300px] flex items-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-wire-500 text-sm">[ Background Image ]</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="max-w-2xl bg-wire-100/95 p-6 rounded">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-4">
              {title}
            </h1>
            {introCopy ? (
              <div 
                className="text-wire-600 mb-4"
                dangerouslySetInnerHTML={{ __html: introCopy }}
              />
            ) : (
              <div className="mb-4 space-y-2">
                <div className="h-3 bg-wire-300 rounded w-full" />
                <div className="h-3 bg-wire-300 rounded w-full" />
                <div className="h-3 bg-wire-300 rounded w-3/4" />
              </div>
            )}
            {showButton && (
              <a
                href={buttonHref}
                className="inline-block px-6 py-2 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors no-underline"
              >
                {buttonLabel}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Image right variant
  if (showImage && imagePosition === 'right') {
    return (
      <section className="bg-wire-200 border-b border-wire-300">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-4">
                {title}
              </h1>
              {introCopy ? (
                <div 
                  className="text-wire-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: introCopy }}
                />
              ) : (
                <div className="mb-4 space-y-2">
                  <div className="h-3 bg-wire-300 rounded w-full" />
                  <div className="h-3 bg-wire-300 rounded w-full" />
                  <div className="h-3 bg-wire-300 rounded w-3/4" />
                </div>
              )}
              {showContactInfo && (
                <div className="flex flex-wrap gap-6 text-sm text-wire-600 mb-4">
                  <span><strong>Email:</strong> {contactEmail}</span>
                  <span><strong>{contactPhoneLabel}</strong> {contactPhone}</span>
                </div>
              )}
              {showButton && (
                <a
                  href={buttonHref}
                  className="inline-block px-6 py-2 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors no-underline"
                >
                  {buttonLabel}
                </a>
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] bg-wire-400 rounded flex items-center justify-center">
                <span className="text-wire-500 text-sm">[ Image ]</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No image variant (default for listings)
  return (
    <section className="bg-wire-200 border-b border-wire-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-4">
          {title}
        </h1>
        {introCopy ? (
          <div 
            className="text-wire-600 mb-4 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: introCopy }}
          />
        ) : (
          <div className="mb-4 space-y-2 max-w-3xl">
            <div className="h-3 bg-wire-300 rounded w-full" />
            <div className="h-3 bg-wire-300 rounded w-full" />
            <div className="h-3 bg-wire-300 rounded w-3/4" />
          </div>
        )}
        {showContactInfo && (
          <div className="flex flex-wrap gap-6 text-sm text-wire-600 mb-4">
            <span><strong>Email:</strong> {contactEmail}</span>
            <span><strong>{contactPhoneLabel}</strong> {contactPhone}</span>
          </div>
        )}
        {showButton && (
          <a
            href={buttonHref}
            className="inline-block px-6 py-2 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors no-underline"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
};

export default ListingHero;

