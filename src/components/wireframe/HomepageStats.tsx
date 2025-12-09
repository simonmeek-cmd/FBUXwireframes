import React from 'react';

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface HomepageStatsProps {
  /** Section heading */
  heading?: string;
  /** Show section heading */
  showHeading?: boolean;
  /** Number of stats to display (1-4) */
  statCount?: 1 | 2 | 3 | 4;
  /** Stat items */
  items?: StatItem[];
  /** Show CTA button */
  showButton?: boolean;
  /** Button label */
  buttonLabel?: string;
  /** Button URL */
  buttonHref?: string;
  /** Background variant */
  variant?: 'default' | 'highlighted' | 'dark';
}

const defaultItems: StatItem[] = [
  { id: '1', value: '100', label: "Item's Title" },
  { id: '2', value: '100', label: "Item's Title" },
  { id: '3', value: '100', label: "Item's Title" },
  { id: '4', value: '100', label: "Item's Title" },
];

/**
 * HomepageStats
 * Row of impact statistics with large numbers.
 */
export const HomepageStats: React.FC<HomepageStatsProps> = ({
  heading = 'Impact Stats Area',
  showHeading = true,
  statCount = 4,
  items = defaultItems,
  showButton = true,
  buttonLabel = 'Button',
  buttonHref = '#',
  variant = 'default',
}) => {
  const displayItems = items.slice(0, statCount);

  const variantClasses = {
    default: 'bg-wire-50',
    highlighted: 'bg-wire-200',
    dark: 'bg-wire-800 text-wire-100',
  };

  const textClasses = {
    default: 'text-wire-800',
    highlighted: 'text-wire-800',
    dark: 'text-wire-100',
  };

  const subtextClasses = {
    default: 'text-wire-600',
    highlighted: 'text-wire-600',
    dark: 'text-wire-300',
  };

  const gridClasses = {
    1: 'grid-cols-1 max-w-xs mx-auto',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <section className={`py-12 px-4 ${variantClasses[variant]}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(showHeading || showButton) && (
          <div className="flex items-center justify-between mb-8">
            {showHeading && (
              <h2 className={`text-2xl font-bold ${textClasses[variant]}`}>{heading}</h2>
            )}
            {showButton && (
              <a
                href={buttonHref}
                className={`px-4 py-2 rounded transition-colors no-underline text-sm ${
                  variant === 'dark'
                    ? 'bg-wire-100 text-wire-800 hover:bg-wire-200'
                    : 'bg-wire-700 text-wire-100 hover:bg-wire-800'
                }`}
              >
                {buttonLabel}
              </a>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div className={`grid ${gridClasses[statCount]} gap-8`}>
          {displayItems.map((item) => (
            <div key={item.id} className="text-center">
              {/* Circular stat display */}
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 ${
                variant === 'dark' ? 'border-wire-600' : 'border-wire-300'
              } flex items-center justify-center`}>
                <span className={`text-3xl font-bold ${textClasses[variant]}`}>
                  {item.value}
                </span>
              </div>
              <p className={`font-medium ${subtextClasses[variant]}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageStats;

