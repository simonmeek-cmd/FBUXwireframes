import React from 'react';
import type { FooterConfig } from '../../types/footer';
import { defaultFooterConfig } from '../../types/footer';

export interface SiteFooterProps {
  config?: FooterConfig;
  onNavigate?: (href: string) => void;
}

const socialIcons: Record<string, string> = {
  Twitter: '𝕏',
  Facebook: 'f',
  Instagram: '○',
  LinkedIn: 'in',
  YouTube: '▶',
  TikTok: '♪',
  default: '•',
};

/**
 * SiteFooter
 * A comprehensive site footer with navigation sections, social links, newsletter signup, and legal links.
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({
  config = defaultFooterConfig,
  onNavigate,
}) => {
  const handleLinkClick = (e: React.MouseEvent, href?: string) => {
    if (onNavigate && href) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer className="bg-wire-800 text-wire-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and tagline */}
          <div className="lg:col-span-2">
            <div className="w-12 h-12 bg-wire-600 flex items-center justify-center text-xs text-wire-100 font-bold rounded mb-4">
              {config.logoText}
            </div>
            <p className="text-sm text-wire-400 mb-6">{config.tagline}</p>

            {/* Social links */}
            {config.showSocialLinks && config.socialLinks && config.socialLinks.length > 0 && (
              <div className="flex gap-2">
                {config.socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href || '#'}
                    onClick={(e) => handleLinkClick(e, social.href)}
                    className="w-8 h-8 bg-wire-700 hover:bg-wire-600 rounded flex items-center justify-center text-xs font-bold transition-colors no-underline"
                    aria-label={social.platform}
                  >
                    {socialIcons[social.platform] || socialIcons.default}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation sections */}
          {config.sections.map((section, idx) => (
            <nav key={idx} aria-label={section.title}>
              <h3 className="font-bold text-wire-100 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href || '#'}
                      onClick={(e) => handleLinkClick(e, link.href)}
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
        {config.showNewsletter && (
          <div className="mt-12 pt-8 border-t border-wire-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-wire-100 mb-1">{config.newsletterHeading}</h3>
                <p className="text-sm text-wire-400">{config.newsletterDescription}</p>
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

        {/* Copyright and legal links */}
        <div className="mt-8 pt-8 border-t border-wire-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs text-wire-500">{config.copyright}</p>
            {config.legalLinks && config.legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {config.legalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href || '#'}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-xs text-wire-500 hover:text-wire-300 transition-colors underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

