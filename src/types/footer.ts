// Footer configuration types

export interface FooterNavSection {
  title: string;
  links: { label: string; href?: string }[];
}

export interface FooterConfig {
  logoText: string;
  tagline: string;
  sections: FooterNavSection[];
  showSocialLinks: boolean;
  socialLinks: { platform: string; href?: string }[];
  showNewsletter: boolean;
  newsletterHeading: string;
  newsletterDescription: string;
  copyright: string;
  legalLinks: { label: string; href?: string }[];
}

export const defaultFooterConfig: FooterConfig = {
  logoText: 'LOGO',
  tagline: 'Making a difference in communities across the country.',
  sections: [
    {
      title: 'About',
      links: [
        { label: 'Our story', href: '#' },
        { label: 'Team', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Get involved',
      links: [
        { label: 'Donate', href: '#' },
        { label: 'Volunteer', href: '#' },
        { label: 'Fundraise', href: '#' },
        { label: 'Partner with us', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'News', href: '#' },
        { label: 'Reports', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  ],
  showSocialLinks: true,
  socialLinks: [
    { platform: 'Twitter', href: '#' },
    { platform: 'Facebook', href: '#' },
    { platform: 'Instagram', href: '#' },
    { platform: 'LinkedIn', href: '#' },
    { platform: 'YouTube', href: '#' },
  ],
  showNewsletter: true,
  newsletterHeading: 'Stay updated',
  newsletterDescription: 'Subscribe to our newsletter for the latest news.',
  copyright: '© 2024 Charity Name. Registered charity number 123456.',
  legalLinks: [
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms of use', href: '#' },
    { label: 'Cookie policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
};

export const exampleFooterJSON = `{
  "logoText": "LOGO",
  "tagline": "Your organisation tagline here.",
  "sections": [
    {
      "title": "About",
      "links": [
        { "label": "Our story", "href": "/about" },
        { "label": "Team", "href": "/team" }
      ]
    },
    {
      "title": "Services",
      "links": [
        { "label": "What we do", "href": "/services" },
        { "label": "Get help", "href": "/help" }
      ]
    }
  ],
  "showSocialLinks": true,
  "socialLinks": [
    { "platform": "Twitter", "href": "#" },
    { "platform": "Facebook", "href": "#" }
  ],
  "showNewsletter": true,
  "newsletterHeading": "Stay updated",
  "newsletterDescription": "Get our latest news delivered to your inbox.",
  "copyright": "© 2024 Organisation Name. All rights reserved.",
  "legalLinks": [
    { "label": "Privacy", "href": "/privacy" },
    { "label": "Terms", "href": "/terms" }
  ]
}`;

// Validate footer config structure
export const validateFooterConfig = (config: unknown): config is FooterConfig => {
  if (typeof config !== 'object' || config === null) return false;
  
  const c = config as Record<string, unknown>;
  
  if (typeof c.logoText !== 'string') return false;
  if (typeof c.tagline !== 'string') return false;
  if (!Array.isArray(c.sections)) return false;
  if (typeof c.showSocialLinks !== 'boolean') return false;
  if (typeof c.showNewsletter !== 'boolean') return false;
  if (typeof c.copyright !== 'string') return false;
  
  return true;
};

