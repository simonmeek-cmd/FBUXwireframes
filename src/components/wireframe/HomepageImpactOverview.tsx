import React from 'react';

export interface HomepageImpactOverviewProps {
  /** Section heading */
  heading?: string;
  /** Show section heading */
  showHeading?: boolean;
  /** Intro copy below the heading */
  introCopy?: string;
  /** Show intro copy */
  showIntroCopy?: boolean;

  // Quote with Image (top left)
  /** Show the quote with image box */
  showQuoteImage?: boolean;
  /** Quote text */
  quoteImageText?: string;
  /** Quote attribution */
  quoteImageAttribution?: string;

  // Promo Box (top right)
  /** Show the promo box */
  showPromoBox?: boolean;
  /** Promo title */
  promoTitle?: string;
  /** Promo button label */
  promoButtonLabel?: string;
  /** Promo button URL */
  promoButtonHref?: string;

  // Stat Box (bottom)
  /** Show the stat box */
  showStatBox?: boolean;
  /** Stat value (e.g. "28%") */
  statValue?: string;
  /** Stat title/description */
  statTitle?: string;

  // Additional promo boxes (bottom row)
  /** Show second promo box */
  showPromoBox2?: boolean;
  /** Promo 2 title */
  promo2Title?: string;
  /** Promo 2 button label */
  promo2ButtonLabel?: string;
  /** Promo 2 button URL */
  promo2ButtonHref?: string;

  /** Show third promo box */
  showPromoBox3?: boolean;
  /** Promo 3 title */
  promo3Title?: string;
  /** Promo 3 button label */
  promo3ButtonLabel?: string;
  /** Promo 3 button URL */
  promo3ButtonHref?: string;
}

/**
 * HomepageImpactOverview
 * Featured content area with configurable quote, promo, and stat boxes.
 */
export const HomepageImpactOverview: React.FC<HomepageImpactOverviewProps> = ({
  heading = 'Impact Overview',
  showHeading = true,
  introCopy = 'An area with featured content demonstrating and showing to your users the impact of your work.',
  showIntroCopy = true,

  showQuoteImage = true,
  quoteImageText = 'This is an inspiring quote that showcases testimonials or key messages from beneficiaries or supporters.',
  quoteImageAttribution = 'Person Name, Role',

  showPromoBox = true,
  promoTitle = 'Promo Title Text',
  promoButtonLabel = 'Button',
  promoButtonHref = '#',

  showStatBox = true,
  statValue = '28%',
  statTitle = 'Stat Title Text',

  showPromoBox2 = false,
  promo2Title = 'Promo Title Text',
  promo2ButtonLabel = 'Button',
  promo2ButtonHref = '#',

  showPromoBox3 = false,
  promo3Title = 'Promo Title Text',
  promo3ButtonLabel = 'Button',
  promo3ButtonHref = '#',
}) => {
  // Calculate how many bottom row items we have
  const bottomItems = [
    showStatBox,
    showPromoBox2,
    showPromoBox3,
  ].filter(Boolean).length;

  const bottomGridCols = bottomItems === 1 ? 'grid-cols-1' : bottomItems === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <section className="py-12 px-4 bg-wire-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {showHeading && (
          <h2 className="text-2xl font-bold text-wire-800 mb-4">{heading}</h2>
        )}

        {/* Intro Copy */}
        {showIntroCopy && introCopy && (
          <p className="text-wire-600 mb-8 max-w-3xl">{introCopy}</p>
        )}

        {/* Top row - adapts to 1 or 2 columns based on visible items */}
        {(showQuoteImage || showPromoBox) && (
          <div className={`grid grid-cols-1 ${showQuoteImage && showPromoBox ? 'md:grid-cols-2' : ''} gap-4 mb-4`}>
            {/* Quote with Image */}
            {showQuoteImage && (
              <div className={`bg-wire-700 text-wire-100 rounded overflow-hidden flex flex-col ${showPromoBox ? 'aspect-[4/3]' : 'aspect-[21/9]'}`}>
                {/* Image placeholder area */}
                <div className="flex-1 flex items-center justify-center bg-wire-600 relative">
                  <svg className="w-16 h-16 text-wire-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute top-4 left-4 text-5xl text-wire-400 opacity-50">"</div>
                </div>
                {/* Quote content */}
                <div className="p-5">
                  <blockquote className="text-wire-100 italic mb-2 text-sm leading-relaxed">
                    "{quoteImageText}"
                  </blockquote>
                  {quoteImageAttribution && (
                    <cite className="text-wire-300 text-sm not-italic">— {quoteImageAttribution}</cite>
                  )}
                </div>
              </div>
            )}

            {/* Promo Box */}
            {showPromoBox && (
              <div className={`bg-wire-700 text-wire-100 rounded overflow-hidden flex flex-col ${showQuoteImage ? 'aspect-[4/3]' : 'aspect-[21/9]'}`}>
                {/* Image/icon area */}
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-8xl text-wire-500 opacity-50">"</span>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3">{promoTitle}</h3>
                  <a
                    href={promoButtonHref}
                    className="inline-block px-4 py-2 bg-wire-100 text-wire-800 text-sm rounded hover:bg-wire-200 transition-colors no-underline"
                  >
                    {promoButtonLabel}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom row - stat and/or additional promos */}
        {bottomItems > 0 && (
          <div className={`grid grid-cols-1 md:${bottomGridCols} gap-4`}>
            {/* Stat Box */}
            {showStatBox && (
              <div className="bg-wire-100 border border-wire-300 rounded aspect-[4/3] md:aspect-auto md:py-8 flex flex-col items-center justify-center p-6">
                {/* Circular progress indicator */}
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-wire-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${parseFloat(statValue) * 2.83} 283`}
                      strokeLinecap="round"
                      className="text-wire-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-wire-800">
                    {statValue}
                  </div>
                </div>
                <p className="text-center text-wire-600 font-medium">{statTitle}</p>
              </div>
            )}

            {/* Promo Box 2 */}
            {showPromoBox2 && (
              <div className="bg-wire-700 text-wire-100 rounded overflow-hidden aspect-[4/3] md:aspect-auto md:py-8 flex flex-col items-center justify-center p-6">
                <span className="text-6xl text-wire-500 opacity-50 mb-4">"</span>
                <h3 className="font-bold text-lg mb-3 text-center">{promo2Title}</h3>
                <a
                  href={promo2ButtonHref}
                  className="inline-block px-4 py-2 bg-wire-100 text-wire-800 text-sm rounded hover:bg-wire-200 transition-colors no-underline"
                >
                  {promo2ButtonLabel}
                </a>
              </div>
            )}

            {/* Promo Box 3 */}
            {showPromoBox3 && (
              <div className="bg-wire-700 text-wire-100 rounded overflow-hidden aspect-[4/3] md:aspect-auto md:py-8 flex flex-col items-center justify-center p-6">
                <span className="text-6xl text-wire-500 opacity-50 mb-4">"</span>
                <h3 className="font-bold text-lg mb-3 text-center">{promo3Title}</h3>
                <a
                  href={promo3ButtonHref}
                  className="inline-block px-4 py-2 bg-wire-100 text-wire-800 text-sm rounded hover:bg-wire-200 transition-colors no-underline"
                >
                  {promo3ButtonLabel}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageImpactOverview;
