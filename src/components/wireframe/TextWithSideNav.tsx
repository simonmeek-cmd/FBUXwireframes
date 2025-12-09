import React from 'react';
import { LocalSideNavigation, SideNavItem } from './LocalSideNavigation';
import { TextEditor } from './TextEditor';

export interface TextSection {
  id: string;
  label: string;
  body: React.ReactNode;
}

export interface TextWithSideNavProps {
  /** Title for the side navigation */
  navTitle?: string;
  /** Content sections - each becomes a nav item and content block */
  sections?: TextSection[];
  /** Position of the side navigation */
  navPosition?: 'left' | 'right';
}

const defaultSections: TextSection[] = [
  {
    id: '1',
    label: 'Overview',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '2',
    label: 'Our mission',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: '3',
    label: 'Our values',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
];

/**
 * TextWithSideNav
 * Layout combining text content with a side navigation menu.
 */
export const TextWithSideNav: React.FC<TextWithSideNavProps> = ({
  navTitle = 'In this section',
  sections = defaultSections,
  navPosition = 'left',
}) => {
  const navItems: SideNavItem[] = sections.map((section, index) => ({
    id: section.id,
    label: section.label,
    href: `#section-${section.id}`,
    isActive: index === 0,
  }));

  const navComponent = (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-4">
        <LocalSideNavigation title={navTitle} items={navItems} />
      </div>
    </aside>
  );

  const contentComponent = (
    <div className="flex-1 space-y-8">
      {sections.map((section) => (
        <section key={section.id} id={`section-${section.id}`}>
          <TextEditor heading={section.label} content={section.body} />
        </section>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {navPosition === 'left' ? (
        <>
          {navComponent}
          {contentComponent}
        </>
      ) : (
        <>
          {contentComponent}
          {navComponent}
        </>
      )}
    </div>
  );
};

export default TextWithSideNav;


