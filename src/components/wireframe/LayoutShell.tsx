import React from 'react';
import { PrimarySecondaryNavigation, PrimarySecondaryNavigationProps } from './PrimarySecondaryNavigation';
import { FooterNavigation, FooterNavigationProps } from './FooterNavigation';

export interface LayoutShellProps {
  /** Child content to render in the main area */
  children: React.ReactNode;
  /** Props to pass to the navigation */
  navProps?: PrimarySecondaryNavigationProps;
  /** Props to pass to the footer */
  footerProps?: FooterNavigationProps;
  /** Show the header navigation */
  showNav?: boolean;
  /** Show the footer */
  showFooter?: boolean;
}

/**
 * LayoutShell
 * A page shell component that wraps content with header navigation and footer.
 */
export const LayoutShell: React.FC<LayoutShellProps> = ({
  children,
  navProps,
  footerProps,
  showNav = true,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-wire-50">
      {showNav && <PrimarySecondaryNavigation {...navProps} />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <FooterNavigation {...footerProps} />}
    </div>
  );
};

export default LayoutShell;


