import React from 'react';

export interface HeroImageProps {
  /** Main heading text */
  heading?: string;
  /** Subheading or description text */
  subheading?: string;
  /** Body copy - shown when no image, supports HTML */
  bodyText?: string;
  /** Call to action button label */
  ctaLabel?: string;
  /** Whether to show an image placeholder */
  hasImage?: boolean;
  /** Position of image: 'right' or 'background' */
  imagePosition?: 'right' | 'background';
  /** Optional tag/category label */
  tag?: string;
}

/**
 * HeroImage
 * A prominent hero banner with heading, subheading, CTA, and optional image.
 * When hasImage is false, displays a full-width text-based hero.
 */
export const HeroImage: React.FC<HeroImageProps> = ({
  heading = 'Pagebuilder full-width components (hero without image)',
  subheading,
  bodyText,
  ctaLabel = 'Button',
  hasImage = true,
  imagePosition = 'right',
  tag,
}) => {
  // No image layout - full width text hero
  if (!hasImage) {
    return (
      <section className="bg-wire-200 border-b border-wire-300">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            {tag && (
              <span className="inline-block px-2 py-1 bg-wire-600 text-wire-100 text-xs rounded mb-4">
                {tag}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-6">
              {heading}
            </h1>
            
            {/* Body text representation - shows as lines when no content provided */}
            {bodyText ? (
              <div 
                className="text-wire-600 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: bodyText }}
              />
            ) : (
              <div className="mb-8 space-y-2">
                <div className="h-3 bg-wire-300 rounded w-full max-w-2xl" />
                <div className="h-3 bg-wire-300 rounded w-full max-w-2xl" />
                <div className="h-3 bg-wire-300 rounded w-full max-w-2xl" />
                <div className="h-3 bg-wire-400 rounded w-3/4 max-w-xl" />
              </div>
            )}
            
            {ctaLabel && (
              <button className="px-6 py-3 bg-wire-800 text-wire-100 rounded hover:bg-wire-900 transition-colors font-medium">
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Background image layout
  if (imagePosition === 'background') {
    return (
      <section className="relative bg-wire-300 min-h-[300px] md:min-h-[400px] flex items-center">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-wire-400 flex items-center justify-center">
          <span className="text-wire-500 text-sm">[ Background Image ]</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="max-w-xl bg-wire-100/90 p-6 rounded">
            {tag && (
              <span className="inline-block px-2 py-1 bg-wire-600 text-wire-100 text-xs rounded mb-3">
                {tag}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-3">
              {heading}
            </h1>
            <p className="text-wire-600 mb-4">{subheading}</p>
            {ctaLabel && (
              <button className="px-6 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors">
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default: Image on right
  return (
    <section className="bg-wire-200 border-b border-wire-300">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          {/* Content */}
          <div className="flex-1">
            {tag && (
              <span className="inline-block px-2 py-1 bg-wire-600 text-wire-100 text-xs rounded mb-3">
                {tag}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wire-800 mb-3">
              {heading}
            </h1>
            <p className="text-wire-600 mb-6">{subheading}</p>
            {ctaLabel && (
              <button className="px-6 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors">
                {ctaLabel}
              </button>
            )}
          </div>

          {/* Image placeholder */}
          <div className="flex-1 w-full md:w-auto">
            <div className="aspect-[4/3] bg-wire-400 rounded flex items-center justify-center">
              <div className="text-center text-wire-500">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span className="text-sm">[ Image ]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImage;
