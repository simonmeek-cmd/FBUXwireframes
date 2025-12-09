import React from 'react';

export interface HomepageHeroProps {
  /** Main heading */
  heading?: string;
  /** Call to action button label */
  ctaLabel?: string;
  /** Call to action URL */
  ctaHref?: string;
  /** Show the image area */
  showImage?: boolean;
}

/**
 * HomepageHero
 * Simple hero banner for homepage with heading and CTA button.
 */
export const HomepageHero: React.FC<HomepageHeroProps> = ({
  heading = 'Who we are and what we do',
  ctaLabel = 'Button',
  ctaHref = '#',
  showImage = true,
}) => {
  return (
    <section className="bg-wire-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Content */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-wire-800 mb-6">
              {heading}
            </h1>
            {ctaLabel && (
              <a
                href={ctaHref}
                className="inline-block px-6 py-3 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors no-underline"
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* Image placeholder */}
          {showImage && (
            <div className="flex-1 w-full">
              <div className="aspect-video bg-wire-200 rounded flex items-center justify-center">
                <div className="text-wire-400 text-sm">Hero Image</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;

