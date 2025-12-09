import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface PrimarySecondaryNavigationProps {
  /** Logo text or placeholder */
  logoText?: string;
  /** Primary navigation items */
  primaryItems?: NavItem[];
  /** Secondary/utility navigation items */
  secondaryItems?: NavItem[];
  /** Show search input */
  hasSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

const defaultPrimaryItems: NavItem[] = [
  { id: '1', label: 'About us', isActive: true },
  { id: '2', label: 'What we do' },
  { id: '3', label: 'Get involved' },
  { id: '4', label: 'News' },
  { id: '5', label: 'Contact' },
];

const defaultSecondaryItems: NavItem[] = [
  { id: '1', label: 'Cymraeg' },
  { id: '2', label: 'Login' },
];

/**
 * PrimarySecondaryNavigation
 * Top-level site navigation with logo, primary nav links, search, and utility links.
 */
export const PrimarySecondaryNavigation: React.FC<PrimarySecondaryNavigationProps> = ({
  logoText = 'LOGO',
  primaryItems = defaultPrimaryItems,
  secondaryItems = defaultSecondaryItems,
  hasSearch = true,
  searchPlaceholder = 'Search...',
}) => {
  return (
    <header className="bg-wire-200 border-b border-wire-300">
      {/* Secondary nav row */}
      <div className="bg-wire-300 px-4 py-1">
        <div className="max-w-6xl mx-auto flex justify-end gap-4 text-xs text-wire-600">
          {secondaryItems.map((item) => (
            <a
              key={item.id}
              href={item.href || '#'}
              className="hover:text-wire-800 transition-colors underline underline-offset-2"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Primary nav row */}
      <div className="px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-wire-400 flex items-center justify-center text-xs text-wire-100 font-bold rounded">
              {logoText}
            </div>
          </div>

          {/* Primary navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {primaryItems.map((item) => (
              <a
                key={item.id}
                href={item.href || '#'}
                className={`px-3 py-2 text-sm rounded transition-colors underline underline-offset-2 ${
                  item.isActive
                    ? 'bg-wire-700 text-wire-100'
                    : 'text-wire-700 hover:bg-wire-300'
                }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search and CTA */}
          <div className="flex items-center gap-3">
            {hasSearch && (
              <div className="relative">
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-32 md:w-40 px-3 py-1.5 text-sm bg-wire-100 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-wire-400 text-xs">
                  🔍
                </span>
              </div>
            )}
            <button className="px-4 py-1.5 bg-wire-600 text-wire-100 text-sm rounded hover:bg-wire-700 transition-colors">
              Donate
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-wire-600 hover:bg-wire-300 rounded"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PrimarySecondaryNavigation;

