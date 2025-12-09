import React from 'react';

export interface SideNavItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
  children?: SideNavItem[];
}

export interface LocalSideNavigationProps {
  /** Title for the side navigation */
  title?: string;
  /** Navigation items */
  items?: SideNavItem[];
}

const defaultItems: SideNavItem[] = [
  { id: '1', label: 'Overview', isActive: true },
  { id: '2', label: 'Our mission' },
  { id: '3', label: 'Our values' },
  { id: '4', label: 'Our history' },
  { id: '5', label: 'Leadership team' },
  { id: '6', label: 'Annual reports' },
];

/**
 * LocalSideNavigation
 * Side menu for navigating sections within a page or section.
 */
export const LocalSideNavigation: React.FC<LocalSideNavigationProps> = ({
  title = 'In this section',
  items = defaultItems,
}) => {
  return (
    <nav aria-label="Section navigation" className="bg-wire-100 border border-wire-200 rounded p-4">
      {title && (
        <h3 className="text-sm font-bold text-wire-700 mb-3 pb-2 border-b border-wire-200">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href || '#'}
              className={`block px-3 py-2 text-sm rounded transition-colors underline underline-offset-2 ${
                item.isActive
                  ? 'bg-wire-300 text-wire-800 font-medium'
                  : 'text-wire-600 hover:bg-wire-200 hover:text-wire-800'
              }`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="ml-4 mt-1 space-y-1 border-l-2 border-wire-200">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href || '#'}
                      className={`block px-3 py-1.5 text-sm transition-colors underline underline-offset-2 ${
                        child.isActive
                          ? 'text-wire-800 font-medium'
                          : 'text-wire-500 hover:text-wire-800'
                      }`}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LocalSideNavigation;

