// Navigation configuration types

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  /** Optional intro copy shown in the mega menu for this section (top-level items only) */
  intro?: string;
}

export interface NavCTA {
  label: string;
  href?: string;
  variant: 'primary' | 'secondary';
}

export interface NavigationConfig {
  logoText: string;
  showSecondaryNav: boolean;
  showSearch: boolean;
  secondaryItems: NavItem[];
  primaryItems: NavItem[];
  ctas: NavCTA[];
}

export const defaultNavigationConfig: NavigationConfig = {
  logoText: 'LOGO',
  showSecondaryNav: true,
  showSearch: true,
  secondaryItems: [
    { label: 'Secondary Menu item 1', href: '#' },
    { label: 'Menu item 2', href: '#' },
    { label: 'Menu item 3', href: '#' },
    { label: 'Menu item 4', href: '#' },
  ],
  primaryItems: [
    {
      label: 'About Us',
      href: '#',
      intro: 'Learn about our organisation, our mission, and the people who make our work possible.',
      children: [
        { 
          label: 'Our Mission', 
          href: '#', 
          children: [
            { label: 'Vision & Values', href: '#' },
            { label: 'History', href: '#' },
            { label: 'Annual Reports', href: '#' },
          ]
        },
        { 
          label: 'Our Team', 
          href: '#', 
          children: [
            { label: 'Leadership', href: '#' },
            { label: 'Staff', href: '#' },
            { label: 'Trustees', href: '#' },
          ]
        },
        { 
          label: 'Our Impact', 
          href: '#', 
          children: [
            { label: 'Case Studies', href: '#' },
            { label: 'Statistics', href: '#' },
          ]
        },
        { label: 'Partners', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      label: 'What We Do',
      href: '#',
      intro: 'Discover our services and programmes that support communities across the country.',
      children: [
        { label: 'Service One', href: '#' },
        { label: 'Service Two', href: '#' },
        { label: 'Service Three', href: '#' },
        { label: 'Service Four', href: '#' },
      ],
    },
    { label: 'News', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  ctas: [
    { label: 'Donate', variant: 'secondary', href: '#' },
    { label: 'Get Help', variant: 'primary', href: '#' },
  ],
};

// Example JSON for users to copy/modify
export const exampleNavigationJSON = `{
  "logoText": "LOGO",
  "showSecondaryNav": true,
  "showSearch": true,
  "secondaryItems": [
    { "label": "Menu item 1", "href": "/page-1" },
    { "label": "Menu item 2", "href": "/page-2" }
  ],
  "primaryItems": [
    {
      "label": "About Us",
      "href": "/about",
      "intro": "Learn about our organisation, our history, and the people behind our mission.",
      "children": [
        { "label": "Our Story", "href": "/about/story" },
        { 
          "label": "Our Team", 
          "href": "/about/team",
          "children": [
            { "label": "Leadership", "href": "/about/team/leadership" },
            { "label": "Staff", "href": "/about/team/staff" }
          ]
        }
      ]
    },
    {
      "label": "Services",
      "href": "/services",
      "intro": "Explore the programmes and services we offer to support our community.",
      "children": [
        { "label": "Service One", "href": "/services/one" },
        { "label": "Service Two", "href": "/services/two" }
      ]
    },
    {
      "label": "Contact",
      "href": "/contact"
    }
  ],
  "ctas": [
    { "label": "Donate", "variant": "secondary" },
    { "label": "Get Help", "variant": "primary" }
  ]
}`;

// Validate navigation config structure
export const validateNavigationConfig = (config: unknown): config is NavigationConfig => {
  if (typeof config !== 'object' || config === null) return false;
  
  const c = config as Record<string, unknown>;
  
  if (typeof c.logoText !== 'string') return false;
  if (typeof c.showSecondaryNav !== 'boolean') return false;
  if (typeof c.showSearch !== 'boolean') return false;
  if (!Array.isArray(c.secondaryItems)) return false;
  if (!Array.isArray(c.primaryItems)) return false;
  if (!Array.isArray(c.ctas)) return false;
  
  return true;
};
