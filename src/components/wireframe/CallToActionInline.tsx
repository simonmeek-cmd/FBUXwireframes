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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
        <div className="flex gap-3 shrink-0">
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
    </div>
  );
};

export default CallToActionInline;


