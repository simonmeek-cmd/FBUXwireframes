import React from 'react';

export interface HomepageOptionalCopyProps {
  /** Heading text */
  heading?: string;
  /** Body copy - supports HTML */
  content?: string;
  /** Text alignment */
  alignment?: 'left' | 'center' | 'right';
  /** Background style */
  variant?: 'default' | 'highlighted';
  /** Show button */
  showButton?: boolean;
  /** Button label */
  buttonLabel?: string;
  /** Button URL */
  buttonHref?: string;
}

/**
 * HomepageOptionalCopy
 * Optional copy/positioning statement area below the hero.
 */
export const HomepageOptionalCopy: React.FC<HomepageOptionalCopyProps> = ({
  heading = 'Optional Copy',
  content = '<p>This area can be used to showcase your positioning statement, promote a campaign, or highlight an announcement. Use it to communicate key messages to your visitors.</p>',
  alignment = 'center',
  variant = 'default',
  showButton = false,
  buttonLabel = 'Button',
  buttonHref = '#',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const buttonAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const variantClasses = {
    default: 'bg-wire-100',
    highlighted: 'bg-wire-200 border-y border-wire-300',
  };

  return (
    <section className={`py-12 px-4 ${variantClasses[variant]}`}>
      <div className={`max-w-4xl mx-auto ${alignmentClasses[alignment]}`}>
        {heading && (
          <h2 className="text-2xl font-bold text-wire-800 mb-4">{heading}</h2>
        )}
        <div 
          className="text-wire-600 leading-relaxed prose-p:mb-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {showButton && (
          <div className={`mt-6 flex ${buttonAlignmentClasses[alignment]}`}>
            <a
              href={buttonHref}
              className="px-6 py-3 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors font-medium inline-block no-underline"
            >
              {buttonLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageOptionalCopy;

