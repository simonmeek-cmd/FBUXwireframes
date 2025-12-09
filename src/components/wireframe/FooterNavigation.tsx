import React from 'react';

export interface FooterNavSection {
  id: string;
  title: string;
  links: { id: string; label: string; href?: string }[];
}

export interface FooterNavigationProps {
  /** Logo text or placeholder */
  logoText?: string;
  /** Tagline or description */
  tagline?: string;
  /** Navigation sections */
  sections?: FooterNavSection[];
  /** Copyright text */
  copyright?: string;
  /** Show social links */
  showSocialLinks?: boolean;
  /** Show newsletter signup */
  showNewsletter?: boolean;
}

const defaultSections: FooterNavSection[] = [
  {
    id: '1',
    title: 'About',
    links: [
      { id: '1', label: 'Our story' },
      { id: '2', label: 'Team' },
      { id: '3', label: 'Careers' },
      { id: '4', label: 'Press' },
    ],
  },
  {
    id: '2',
    title: 'Get involved',
    links: [
      { id: '1', label: 'Donate' },
      { id: '2', label: 'Volunteer' },
      { id: '3', label: 'Fundraise' },
      { id: '4', label: 'Partner with us' },
    ],
  },
  {
    id: '3',
    title: 'Resources',
    links: [
      { id: '1', label: 'News' },
      { id: '2', label: 'Reports' },
      { id: '3', label: 'FAQs' },
      { id: '4', label: 'Contact' },
    ],
  },
  {
    id: '4',
    title: 'Legal',
    links: [
      { id: '1', label: 'Privacy policy' },
      { id: '2', label: 'Terms of use' },
      { id: '3', label: 'Cookie policy' },
      { id: '4', label: 'Accessibility' },
    ],
  },
];

/**
 * FooterNavigation
 * Site footer with navigation links, contact info, and legal text.
 */
export const FooterNavigation: React.FC<FooterNavigationProps> = ({
  logoText = 'LOGO',
  tagline = 'Making a difference in communities across the country.',
  sections = defaultSections,
  copyright = `© ${new Date().getFullYear()} Charity Name. Registered charity number 123456.`,
  showSocialLinks = true,
  showNewsletter = true,
}) => {
  return (
    <footer className="bg-wire-800 text-wire-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and tagline */}
          <div className="lg:col-span-2">
            <div className="w-12 h-12 bg-wire-600 flex items-center justify-center text-xs text-wire-100 font-bold rounded mb-4">
              {logoText}
            </div>
            <p className="text-sm text-wire-400 mb-6">{tagline}</p>

            {/* Social links */}
            {showSocialLinks && (
              <div className="flex gap-2">
                {['f', '𝕏', 'in', 'yt'].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 bg-wire-700 hover:bg-wire-600 rounded flex items-center justify-center text-xs font-bold transition-colors no-underline"
                    aria-label={`Social link ${i + 1}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation sections */}
          {sections.map((section) => (
            <nav key={section.id} aria-label={section.title}>
              <h3 className="font-bold text-wire-100 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href || '#'}
                      className="text-sm text-wire-400 hover:text-wire-100 transition-colors underline underline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter signup */}
        {showNewsletter && (
          <div className="mt-12 pt-8 border-t border-wire-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-wire-100 mb-1">Stay updated</h3>
                <p className="text-sm text-wire-400">Subscribe to our newsletter for the latest news.</p>
              </div>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-wire-700 border border-wire-600 rounded text-wire-100 placeholder-wire-500 focus:outline-none focus:border-wire-500 w-48 md:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-500 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-wire-700">
          <p className="text-xs text-wire-500 text-center">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNavigation;

