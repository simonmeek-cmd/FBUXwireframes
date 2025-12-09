import React from 'react';

export interface CTABoxItem {
  id: string;
  heading: string;
  description?: string;
  buttonLabel: string;
  href?: string;
}

export interface HomepageCTAsProps {
  /** Number of CTA boxes to display (1-3) */
  ctaCount?: 1 | 2 | 3;
  /** CTA box items */
  items?: CTABoxItem[];
  /** Show images above each CTA */
  showImages?: boolean;
  /** Background variant */
  variant?: 'default' | 'highlighted';
}

const defaultItems: CTABoxItem[] = [
  {
    id: '1',
    heading: 'CTA 1',
    description: 'Supporting text for this call to action area.',
    buttonLabel: 'Learn more',
    href: '#',
  },
  {
    id: '2',
    heading: 'CTA 2',
    description: 'Supporting text for this call to action area.',
    buttonLabel: 'Learn more',
    href: '#',
  },
  {
    id: '3',
    heading: 'CTA 3',
    description: 'Supporting text for this call to action area.',
    buttonLabel: 'Learn more',
    href: '#',
  },
];

/**
 * HomepageCTAs
 * Row of 1-3 call to action boxes with images.
 */
export const HomepageCTAs: React.FC<HomepageCTAsProps> = ({
  ctaCount = 3,
  items = defaultItems,
  showImages = true,
  variant = 'default',
}) => {
  const displayItems = items.slice(0, ctaCount);
  
  const gridClasses = {
    1: 'grid-cols-1 max-w-md mx-auto',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  };

  const variantClasses = {
    default: 'bg-wire-100',
    highlighted: 'bg-wire-200',
  };

  return (
    <section className={`py-12 px-4 ${variantClasses[variant]}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`grid ${gridClasses[ctaCount]} gap-6`}>
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-wire-50 border border-wire-300 rounded overflow-hidden"
            >
              {/* Image placeholder */}
              {showImages && (
                <div className="aspect-[16/9] bg-wire-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-wire-800 mb-2">{item.heading}</h3>
                {item.description && (
                  <p className="text-wire-600 mb-4">{item.description}</p>
                )}
                <a
                  href={item.href || '#'}
                  className="inline-block px-4 py-2 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors no-underline"
                >
                  {item.buttonLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageCTAs;

