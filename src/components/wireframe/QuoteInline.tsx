import React from 'react';

export interface QuoteInlineProps {
  /** The quote text */
  quote?: string;
  /** Attribution - who said it */
  attribution?: string;
  /** Role/title of the person quoted */
  role?: string;
  /** Show decorative quote marks */
  showQuoteMarks?: boolean;
  /** Visual style variant */
  variant?: 'default' | 'large' | 'bordered';
}

/**
 * QuoteInline
 * A blockquote component for testimonials and pull quotes.
 */
export const QuoteInline: React.FC<QuoteInlineProps> = ({
  quote = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  attribution = 'Jane Smith',
  role = 'Volunteer Coordinator',
  showQuoteMarks = true,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-wire-100 p-6 rounded',
    large: 'bg-wire-200 p-8 rounded-lg',
    bordered: 'border-l-4 border-wire-400 pl-6 py-2',
  };

  const quoteTextStyles = {
    default: 'text-lg text-wire-700',
    large: 'text-xl md:text-2xl text-wire-800 font-light',
    bordered: 'text-lg text-wire-700 italic',
  };

  return (
    <figure className={variantStyles[variant]}>
      <blockquote>
        <div className="relative">
          {showQuoteMarks && (
            <span className="absolute -left-2 -top-2 text-4xl text-wire-300 font-serif leading-none" aria-hidden="true">
              "
            </span>
          )}
          <p className={`${quoteTextStyles[variant]} ${showQuoteMarks ? 'pl-6' : ''}`}>
            {quote}
          </p>
          {showQuoteMarks && (
            <span className="text-4xl text-wire-300 font-serif leading-none" aria-hidden="true">
              "
            </span>
          )}
        </div>
      </blockquote>
      {(attribution || role) && (
        <figcaption className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-wire-300 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-wire-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            {attribution && (
              <cite className="not-italic font-medium text-wire-800 block">
                {attribution}
              </cite>
            )}
            {role && (
              <span className="text-sm text-wire-500">{role}</span>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  );
};

export default QuoteInline;


