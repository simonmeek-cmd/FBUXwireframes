import React from 'react';

export interface CallToActionInlineProps {
  /** Heading text */
  heading?: string;
  /** Description or supporting text */
  description?: string;
  /** Primary button label */
  primaryLabel?: string;
  /** Secondary button label (optional) */
  secondaryLabel?: string;
  /** Visual style variant */
  variant?: 'default' | 'highlighted' | 'minimal';
  /** Show image on the right */
  showImage?: boolean;
  /** Image URL */
  imageUrl?: string;
  /** Image alt text */
  imageAlt?: string;
}

/**
 * CallToActionInline
 * A prominent call-to-action block encouraging user action.
 */
export const CallToActionInline: React.FC<CallToActionInlineProps> = ({
  heading = 'Call to action (inline)',
  description,
  primaryLabel = 'Apply',
  secondaryLabel,
  variant = 'default',
  showImage = false,
  imageUrl,
  imageAlt = 'CTA image',
}) => {
  const variantStyles = {
    default: 'bg-wire-200 border border-wire-300',
    highlighted: 'bg-wire-700 text-wire-100',
    minimal: 'border border-wire-300',
  };

  const buttonStyles = {
    default: 'bg-wire-600 text-wire-100 hover:bg-wire-700',
    highlighted: 'bg-wire-100 text-wire-800 hover:bg-wire-200',
    minimal: 'bg-wire-600 text-wire-100 hover:bg-wire-700',
  };

  const secondaryButtonStyles = {
    default: 'border border-wire-400 text-wire-600 hover:bg-wire-300',
    highlighted: 'border border-wire-300 text-wire-200 hover:bg-wire-600',
    minimal: 'border border-wire-400 text-wire-600 hover:bg-wire-100',
  };

  return (
    <div className={`rounded p-6 ${variantStyles[variant]}`}>
      <div className={`flex flex-col ${showImage ? 'md:flex-row md:items-start' : 'md:flex-row md:items-center md:justify-between'} gap-4`}>
        <div className="flex-1">
          <div>
            <h3 className={`text-lg font-bold mb-1 ${variant === 'highlighted' ? 'text-wire-100' : 'text-wire-800'}`}>
              {heading}
            </h3>
            {description && (
              <p className={`text-sm ${variant === 'highlighted' ? 'text-wire-200' : 'text-wire-600'}`}>
                {description}
              </p>
            )}
          </div>
          <div className={`flex gap-3 shrink-0 ${showImage ? 'mt-4' : 'md:mt-0'}`}>
            {secondaryLabel && (
              <button className={`px-5 py-2 rounded transition-colors ${secondaryButtonStyles[variant]}`}>
                {secondaryLabel}
              </button>
            )}
            <button className={`px-5 py-2 rounded transition-colors ${buttonStyles[variant]}`}>
              {primaryLabel}
            </button>
          </div>
        </div>
        {showImage && (
          <div className="shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-[300px] h-[300px] object-cover rounded"
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-wire-300 rounded flex items-center justify-center">
                <div className="text-center text-wire-500">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <span className="text-sm">[ {imageAlt} ]</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallToActionInline;


