import React from 'react';
import type { NavigationConfig, NavItem } from '../../types/navigation';
import { defaultNavigationConfig } from '../../types/navigation';

export interface SiteNavigationStaticProps {
  config?: NavigationConfig;
}

/**
 * SiteNavigationStatic
 * A static-export-friendly version of SiteNavigation that renders ALL dropdowns
 * so they can be shown/hidden with CSS and JS.
 */
export const SiteNavigationStatic: React.FC<SiteNavigationStaticProps> = ({
  config = defaultNavigationConfig,
}) => {
  // Check if ANY item has grandchildren (determines mega menu vs simple dropdown)
  const hasGrandchildren = (item: NavItem) => {
    return item.children?.some(child => child.children && child.children.length > 0);
  };
  const anyItemHasGrandchildren = config.primaryItems.some(item => hasGrandchildren(item));

  return (
    <header className="bg-wire-700 text-white relative">
      {/* Secondary Navigation */}
      {config.showSecondaryNav && (
        <div className="hidden md:block bg-wire-800">
          <div className="max-w-7xl mx-auto px-4 py-1 flex justify-end items-center gap-4">
            {config.secondaryItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href || '#'}
                className="text-xs text-wire-300 hover:text-white underline underline-offset-2"
              >
                {item.label}
              </a>
            ))}
            {config.showSearch && (
              <div className="flex items-center gap-1 text-xs text-wire-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </div>
            )}
          </div>
        </div>
      )}

      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="index.html" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-wire-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-wire-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-white">{config.logoText}</span>
          </a>

          {/* Desktop Primary Nav + CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1 mr-4">
              {config.primaryItems.map((item, idx) => {
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={idx} className="relative group">
                    <a
                      href={item.href || '#'}
                      className="px-3 py-2 text-sm transition-colors no-underline text-wire-200 hover:text-white hover:bg-wire-600 rounded"
                    >
                      {item.label}
                      {hasChildren && (
                        <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </a>
                    
                    {/* Always render dropdown if has children */}
                    {hasChildren && !anyItemHasGrandchildren && (
                      <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 dropdown-menu">
                        <div className="bg-white border border-wire-200 shadow-lg py-1 min-w-[160px] rounded">
                          {item.children!.map((child, childIdx) => (
                            <a
                              key={childIdx}
                              href={child.href || '#'}
                              className="block px-4 py-2 text-sm text-wire-700 hover:bg-wire-100 hover:text-wire-800 no-underline"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              {config.ctas.map((cta, idx) => (
                <a
                  key={idx}
                  href={cta.href || '#'}
                  className={`px-4 py-1.5 text-sm font-medium rounded transition-colors no-underline ${
                    cta.variant === 'primary'
                      ? 'bg-wire-900 text-white hover:bg-black'
                      : 'bg-wire-500 text-white hover:bg-wire-400'
                  }`}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-wire-200 hover:text-white mobile-menu-trigger"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mega Menu - Rendered for each item with grandchildren */}
      {anyItemHasGrandchildren && config.primaryItems.map((item, idx) => {
        if (!item.children || item.children.length === 0) return null;
        
        const hasAnyGrandchildren = item.children.some(child => child.children && child.children.length > 0);
        
        return (
          <div 
            key={idx}
            className="absolute left-0 right-0 top-full z-50 hidden mega-menu opacity-0 invisible transition-all duration-150"
            data-menu-for={idx}
          >
            <div className="bg-white border-t border-wire-200 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-8">
                  {/* Optional intro copy */}
                  {item.intro && (
                    <div className="w-48 shrink-0 pr-6 border-r border-wire-200">
                      <p className="text-sm text-wire-600 leading-relaxed">{item.intro}</p>
                    </div>
                  )}

                  {/* Menu content */}
                  {hasAnyGrandchildren ? (
                    <div className="flex-1 flex gap-8">
                      {item.children.map((child, childIdx) => (
                        <div key={childIdx} className="min-w-[160px]">
                          <a
                            href={child.href || '#'}
                            className="block text-sm font-medium text-wire-800 mb-2 no-underline hover:bg-wire-100 px-2 py-1 -mx-2 rounded transition-colors"
                          >
                            {child.label}
                          </a>
                          {child.children && child.children.length > 0 && (
                            <div className="space-y-0.5">
                              {child.children.map((grandchild, gIdx) => (
                                <a
                                  key={gIdx}
                                  href={grandchild.href || '#'}
                                  className="block text-sm text-wire-600 no-underline px-2 py-1.5 -mx-2 rounded hover:bg-wire-100 hover:text-wire-800 transition-colors"
                                >
                                  {grandchild.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="space-y-0.5">
                        {item.children.map((child, childIdx) => (
                          <a
                            key={childIdx}
                            href={child.href || '#'}
                            className="block text-sm text-wire-700 no-underline px-2 py-2 -mx-2 rounded hover:bg-wire-100 hover:text-wire-800 transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Mobile Menu - Always rendered but hidden */}
      <div className="fixed inset-0 z-50 bg-white mobile-menu" style={{ display: 'none' }}>
        <div className="flex items-center justify-between p-4 border-b border-wire-200">
          <a href="index.html" className="font-bold text-wire-800 no-underline hover:opacity-80 transition-opacity">{config.logoText}</a>
          <button className="p-2 text-wire-600 hover:text-wire-800 mobile-menu-close" aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {config.ctas.length > 0 && (
          <div className="p-4 border-b border-wire-200">
            <a 
              href={config.ctas[0].href || '#'}
              className="block w-full py-3 bg-wire-700 text-white font-medium rounded text-center no-underline"
            >
              {config.ctas.find(c => c.variant === 'primary')?.label || config.ctas[0].label}
            </a>
          </div>
        )}

        <nav className="overflow-y-auto">
          {config.primaryItems.map((item, idx) => (
            <div key={idx}>
              <a
                href={item.href || '#'}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-wire-700 hover:bg-wire-50 border-b border-wire-100 no-underline"
              >
                <span className="underline underline-offset-2">{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <svg className="w-4 h-4 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </a>
            </div>
          ))}
        </nav>

        {config.showSecondaryNav && config.secondaryItems.length > 0 && (
          <div className="p-4 border-t border-wire-200">
            {config.secondaryItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href || '#'}
                className="block py-2 text-sm text-wire-600 underline underline-offset-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default SiteNavigationStatic;

