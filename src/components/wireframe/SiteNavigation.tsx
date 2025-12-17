import React, { useState } from 'react';
import type { NavigationConfig, NavItem, NavCTA } from '../../types/navigation';
import { defaultNavigationConfig } from '../../types/navigation';

export interface SiteNavigationProps {
  config?: NavigationConfig;
  onNavigate?: (href: string) => void;
}

// Simple dropdown for 2-tier navigation
const SimpleDropdown: React.FC<{
  item: NavItem;
  onNavigate?: (href: string) => void;
}> = ({ item, onNavigate }) => {
  if (!item.children || item.children.length === 0) return null;

  return (
    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
      <div className="bg-white border border-wire-200 shadow-lg py-1 min-w-[160px]">
        {item.children.map((child, idx) => (
          <a
            key={idx}
            href={child.href || '#'}
            onClick={(e) => {
              if (onNavigate && child.href) {
                e.preventDefault();
                onNavigate(child.href);
              }
            }}
            className="block px-4 py-2 text-sm text-wire-700 hover:bg-wire-100 hover:text-wire-800 no-underline"
          >
            {child.label}
          </a>
        ))}
      </div>
    </div>
  );
};

// Full-width mega menu for 3-tier navigation
const MegaMenuDropdown: React.FC<{
  item: NavItem;
  introText?: string;
  onNavigate?: (href: string) => void;
}> = ({ item, introText, onNavigate }) => {
  if (!item.children || item.children.length === 0) return null;

  // Check if any children have grandchildren (determines layout)
  const hasAnyGrandchildren = item.children.some(child => child.children && child.children.length > 0);

  return (
    <div className="bg-white border-t border-wire-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Optional intro copy on the left */}
          {introText && (
            <div className="w-48 shrink-0 pr-6 border-r border-wire-200">
              <p className="text-sm text-wire-600 leading-relaxed">{introText}</p>
            </div>
          )}

          {/* Menu content */}
          {hasAnyGrandchildren ? (
            // Horizontal layout with columns when there are grandchildren
            <div className="flex-1 flex gap-8">
              {item.children.map((child, idx) => (
                <div key={idx} className="min-w-[160px]">
                  <a
                    href={child.href || '#'}
                    onClick={(e) => {
                      if (onNavigate && child.href) {
                        e.preventDefault();
                        onNavigate(child.href);
                      }
                    }}
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
                          onClick={(e) => {
                            if (onNavigate && grandchild.href) {
                              e.preventDefault();
                              onNavigate(grandchild.href);
                            }
                          }}
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
            // Vertical stacked layout when only children (no grandchildren)
            <div className="flex-1">
              <div className="space-y-0.5">
                {item.children.map((child, idx) => (
                  <a
                    key={idx}
                    href={child.href || '#'}
                    onClick={(e) => {
                      if (onNavigate && child.href) {
                        e.preventDefault();
                        onNavigate(child.href);
                      }
                    }}
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
  );
};

// Mobile navigation component
const MobileNav: React.FC<{
  config: NavigationConfig;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}> = ({ config, isOpen, onClose, onNavigate }) => {
  const [navStack, setNavStack] = useState<{ title: string; items: NavItem[] }[]>([]);

  const currentLevel = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const displayItems = currentLevel ? currentLevel.items : config.primaryItems;

  const handleItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      setNavStack([...navStack, { title: item.label, items: item.children }]);
    } else if (item.href && onNavigate) {
      onNavigate(item.href);
      onClose();
      setNavStack([]);
    }
  };

  const handleBack = () => {
    setNavStack(navStack.slice(0, -1));
  };

  const handleClose = () => {
    onClose();
    setNavStack([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b border-wire-200">
        <a
          href="#"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('/');
            }
            handleClose();
          }}
          className="font-bold text-wire-800 no-underline hover:opacity-80 transition-opacity"
        >
          {config.logoText}
        </a>
        <button
          onClick={handleClose}
          className="p-2 text-wire-600 hover:text-wire-800"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CTA Button */}
      {config.ctas.length > 0 && (
        <div className="p-4 border-b border-wire-200">
          <button className="w-full py-3 bg-wire-700 text-white font-medium rounded">
            {config.ctas.find(c => c.variant === 'primary')?.label || config.ctas[0].label}
          </button>
        </div>
      )}

      {/* Back button */}
      {navStack.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 w-full px-4 py-3 text-wire-600 hover:bg-wire-50 border-b border-wire-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      {/* Current level title */}
      {currentLevel && (
        <div className="px-4 py-3 bg-wire-50 border-b border-wire-200">
          <span className="font-medium text-wire-800">{currentLevel.title}</span>
        </div>
      )}

      {/* Navigation items */}
      <nav className="overflow-y-auto">
        {displayItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleItemClick(item)}
            className="flex items-center justify-between w-full px-4 py-3 text-left text-wire-700 hover:bg-wire-50 border-b border-wire-100"
          >
            <span className="underline underline-offset-2">{item.label}</span>
            {item.children && item.children.length > 0 && (
              <svg className="w-4 h-4 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      {/* Search */}
      {config.showSearch && (
        <div className="p-4 border-t border-wire-200">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="w-full px-4 py-2 pl-10 bg-wire-50 border border-wire-300 rounded"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Secondary menu items */}
      {config.showSecondaryNav && config.secondaryItems.length > 0 && (
        <div className="p-4 border-t border-wire-200">
          {config.secondaryItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href || '#'}
              onClick={(e) => {
                if (onNavigate && item.href) {
                  e.preventDefault();
                  onNavigate(item.href);
                  handleClose();
                }
              }}
              className="block py-2 text-sm text-wire-600 underline underline-offset-2"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Social icons placeholder */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
        {['X', 'f', '○', 'in', '▶'].map((icon, idx) => (
          <div key={idx} className="w-8 h-8 bg-wire-800 rounded-full flex items-center justify-center text-white text-xs">
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * SiteNavigation
 * A comprehensive site navigation component with secondary nav, primary nav with dropdowns,
 * CTAs, and mobile hamburger menu with drill-down navigation.
 */
export const SiteNavigation: React.FC<SiteNavigationProps> = ({
  config = defaultNavigationConfig,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Check if an item has grandchildren (3-tier)
  const hasGrandchildren = (item: NavItem) => {
    return item.children?.some(child => child.children && child.children.length > 0);
  };

  // Check if ANY item in the nav has grandchildren (determines if we use mega menu for all)
  const anyItemHasGrandchildren = config.primaryItems.some(item => hasGrandchildren(item));

  // Get the active menu item
  const activeMenuItem = activeDropdown !== null 
    ? config.primaryItems[activeDropdown] 
    : null;

  // Show mega menu if we're in 3-tier mode and there's an active item with children
  const showMegaMenu = anyItemHasGrandchildren && activeMenuItem && activeMenuItem.children && activeMenuItem.children.length > 0;

  return (
    <>
      <header 
        className="bg-wire-700 text-white relative"
      >
        {/* Secondary Navigation */}
        {config.showSecondaryNav && (
          <div className="hidden md:block bg-wire-800">
            <div className="max-w-7xl mx-auto px-4 py-1 flex justify-end items-center gap-4">
              {config.secondaryItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href || '#'}
                  onClick={(e) => {
                    if (onNavigate && item.href) {
                      e.preventDefault();
                      onNavigate(item.href);
                    }
                  }}
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
            <a
              href="#"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/');
                }
              }}
              className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
            >
              <div className="max-w-[200px] px-3 py-1.5 bg-wire-500 rounded flex items-center justify-center">
                <span className="text-xs font-semibold text-wire-100 truncate">
                  {config.logoText || 'LOGO'}
                </span>
              </div>
            </a>

            {/* Desktop Primary Nav + CTAs (aligned right together) */}
            <div className="hidden md:flex items-center gap-2">
              {/* Primary Nav Items */}
              <nav className="flex items-center gap-1 mr-4">
                {config.primaryItems.map((item, idx) => {
                  const isActive = activeDropdown === idx;
                  const hasChildren = item.children && item.children.length > 0;
                  
                  return (
                    <div 
                      key={idx} 
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(idx)}
                      onMouseLeave={() => {
                        // Only clear if not using mega menu (mega menu handles its own leave)
                        if (!anyItemHasGrandchildren) {
                          setActiveDropdown(null);
                        }
                      }}
                    >
                      <a
                        href={item.href || '#'}
                        onClick={(e) => {
                          if (onNavigate && item.href) {
                            e.preventDefault();
                            onNavigate(item.href);
                          }
                        }}
                        className={`px-3 py-2 text-sm transition-colors no-underline ${
                          isActive 
                            ? 'text-white bg-wire-600' 
                            : 'text-wire-200 hover:text-white hover:bg-wire-600'
                        } rounded`}
                      >
                        {item.label}
                      </a>
                      {/* Simple dropdown only when NOT in 3-tier mode */}
                      {!anyItemHasGrandchildren && hasChildren && (
                        <SimpleDropdown item={item} onNavigate={onNavigate} />
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* CTAs */}
              <div className="flex items-center gap-2">
                {config.ctas.map((cta, idx) => (
                  <CTAButton key={idx} cta={cta} onNavigate={onNavigate} />
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-wire-200 hover:text-white"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Full-width Mega Menu (for 3-tier navigation) */}
        <div 
          className={`absolute left-0 right-0 top-full z-50 hidden md:block transition-all duration-150 ${
            showMegaMenu 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible pointer-events-none'
          }`}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {activeMenuItem && (
            <MegaMenuDropdown 
              item={activeMenuItem} 
              introText={activeMenuItem.intro}
              onNavigate={onNavigate} 
            />
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        config={config}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};

// CTA Button component
const CTAButton: React.FC<{ cta: NavCTA; onNavigate?: (href: string) => void }> = ({ cta, onNavigate }) => {
  const baseClasses = "px-4 py-1.5 text-sm font-medium rounded transition-colors no-underline";
  const variantClasses = cta.variant === 'primary'
    ? "bg-wire-900 text-white hover:bg-black"
    : "bg-wire-500 text-white hover:bg-wire-400";

  return (
    <a
      href={cta.href || '#'}
      onClick={(e) => {
        if (onNavigate && cta.href) {
          e.preventDefault();
          onNavigate(cta.href);
        }
      }}
      className={`${baseClasses} ${variantClasses}`}
    >
      {cta.label}
    </a>
  );
};

export default SiteNavigation;
