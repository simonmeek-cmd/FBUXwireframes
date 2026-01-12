import type { ComponentType } from '../types/builder';

export type ComponentCategory = 
  | 'Layout'
  | 'Hero'
  | 'Content'
  | 'Homepage'
  | 'Forms'
  | 'Media'
  | 'Lists'
  | 'Social'
  | 'Navigation';

export interface ComponentInfo {
  type: ComponentType;
  label: string;
  description: string;
  category: ComponentCategory;
  alwaysActive?: boolean; // Components that cannot be disabled
}

// Always-active components (cannot be disabled)
export const ALWAYS_ACTIVE_COMPONENTS: ComponentType[] = [
  'PrimarySecondaryNavigation', // Header
  'HeroImage', // Hero
  'LocalBreadcrumbs', // Breadcrumbs
  'SocialShareTag', // Social
  'TextEditor', // Text Editor
  'FooterNavigation', // Footer
];

// Complete component registry with categories
export const COMPONENT_REGISTRY: ComponentInfo[] = [
  // Layout (Always Active)
  {
    type: 'PrimarySecondaryNavigation',
    label: 'Header / Navigation',
    description: 'Site-wide navigation with logo, menu, and CTAs',
    category: 'Layout',
    alwaysActive: true,
  },
  {
    type: 'FooterNavigation',
    label: 'Footer',
    description: 'Site footer with navigation links and contact info',
    category: 'Layout',
    alwaysActive: true,
  },
  {
    type: 'LocalBreadcrumbs',
    label: 'Breadcrumbs',
    description: 'Breadcrumb navigation trail',
    category: 'Layout',
    alwaysActive: true,
  },
  
  // Hero (Always Active)
  {
    type: 'HeroImage',
    label: 'Hero',
    description: 'Hero banner with heading, subheading, CTA, and optional image',
    category: 'Hero',
    alwaysActive: true,
  },
  
  // Content (Always Active)
  {
    type: 'TextEditor',
    label: 'Text Editor',
    description: 'Rich text content block for body copy',
    category: 'Content',
    alwaysActive: true,
  },
  
  // Social (Always Active)
  {
    type: 'SocialShareTag',
    label: 'Social Share',
    description: 'Social media sharing buttons',
    category: 'Social',
    alwaysActive: true,
  },
  
  // Hero (Optional)
  {
    type: 'HomepageHero',
    label: 'Homepage Hero',
    description: 'Special hero variant for homepage',
    category: 'Hero',
  },
  
  // Content (Optional)
  {
    type: 'AccordionInline',
    label: 'Accordion',
    description: 'Expandable/collapsible content sections',
    category: 'Content',
  },
  {
    type: 'QuoteInline',
    label: 'Quote',
    description: 'Blockquote component for testimonials',
    category: 'Content',
  },
  {
    type: 'CallToActionInline',
    label: 'Call to Action',
    description: 'Prominent call-to-action block',
    category: 'Content',
  },
  {
    type: 'OnPageContentsIndex',
    label: 'Table of Contents',
    description: 'Table of contents for long-form pages',
    category: 'Content',
  },
  {
    type: 'DownloadInline',
    label: 'Download List',
    description: 'List of downloadable files',
    category: 'Content',
  },
  {
    type: 'InformationOverviewInline',
    label: 'Information Overview',
    description: 'List or grid of information items',
    category: 'Content',
  },
  
  // Homepage (Optional)
  {
    type: 'HomepageOptionalCopy',
    label: 'Homepage Optional Copy',
    description: 'Optional copy section for homepage',
    category: 'Homepage',
  },
  {
    type: 'HomepageSignposts',
    label: 'Homepage Signposts',
    description: 'Grid of signpost links',
    category: 'Homepage',
  },
  {
    type: 'HomepageImpactOverview',
    label: 'Homepage Impact Overview',
    description: 'Complex impact overview with quotes and stats',
    category: 'Homepage',
  },
  {
    type: 'HomepageCTAs',
    label: 'Homepage CTAs',
    description: 'Call-to-action boxes for homepage',
    category: 'Homepage',
  },
  {
    type: 'HomepageStats',
    label: 'Homepage Stats',
    description: 'Statistics display for homepage',
    category: 'Homepage',
  },
  {
    type: 'HomepageContentFeed',
    label: 'Homepage Content Feed',
    description: 'Content feed for homepage',
    category: 'Homepage',
  },
  
  // Forms (Optional)
  {
    type: 'FormInline',
    label: 'Form',
    description: 'Form component for contact forms and sign-ups',
    category: 'Forms',
  },
  
  // Media (Optional)
  {
    type: 'MediaImage',
    label: 'Media Image',
    description: 'Single image component with optional caption',
    category: 'Media',
  },
  {
    type: 'MediaVideo',
    label: 'Media Video',
    description: 'Video player placeholder',
    category: 'Media',
  },
  {
    type: 'EmbedInline',
    label: 'Embed',
    description: 'Placeholder for embedded content',
    category: 'Media',
  },
  {
    type: 'GalleryInline',
    label: 'Gallery',
    description: 'Image gallery grid',
    category: 'Media',
  },
  
  // Lists (Optional)
  {
    type: 'ListingPage',
    label: 'Listing Page',
    description: 'Listing page with filters and cards',
    category: 'Lists',
  },
  {
    type: 'DetailPage',
    label: 'Detail Page',
    description: 'Detail page for content items',
    category: 'Lists',
  },
  {
    type: 'SearchResultsPage',
    label: 'Search Results',
    description: 'Search results page',
    category: 'Lists',
  },
  
  // Navigation (Optional)
  {
    type: 'LocalSideNavigation',
    label: 'Side Navigation',
    description: 'Side menu for page sections',
    category: 'Navigation',
  },
  {
    type: 'TextWithSideNav',
    label: 'Text with Side Nav',
    description: 'Text content with side navigation',
    category: 'Navigation',
  },
  
  // Promo (Optional)
  {
    type: 'FeaturedPromosInline',
    label: 'Featured Promos',
    description: 'Grid of promotional cards',
    category: 'Content',
  },
  {
    type: 'FeaturedPromosTitlesOnly',
    label: 'Featured Promos (Titles Only)',
    description: 'Compact list-style promotional cards',
    category: 'Content',
  },
];

// Helper functions
export const getAllComponents = (): ComponentType[] => {
  return COMPONENT_REGISTRY.map(c => c.type);
};

export const getAlwaysActiveComponents = (): ComponentType[] => {
  return ALWAYS_ACTIVE_COMPONENTS;
};

export const getOptionalComponents = (): ComponentType[] => {
  return COMPONENT_REGISTRY
    .filter(c => !c.alwaysActive)
    .map(c => c.type);
};

export const getComponentsByCategory = (category: ComponentCategory): ComponentInfo[] => {
  return COMPONENT_REGISTRY.filter(c => c.category === category);
};

export const getComponentInfo = (type: ComponentType): ComponentInfo | undefined => {
  return COMPONENT_REGISTRY.find(c => c.type === type);
};

export const getActiveComponents = (
  projectActiveComponents: ComponentType[] | undefined
): ComponentType[] => {
  // If undefined, all components are active (backward compatibility)
  if (!projectActiveComponents) {
    return getAllComponents();
  }
  // Always include always-active components
  return [...new Set([...ALWAYS_ACTIVE_COMPONENTS, ...projectActiveComponents])];
};

export const getInactiveComponents = (
  projectActiveComponents: ComponentType[] | undefined
): ComponentType[] => {
  const active = getActiveComponents(projectActiveComponents);
  return getAllComponents().filter(type => !active.includes(type));
};

export const getCategories = (): ComponentCategory[] => {
  const categories = new Set<ComponentCategory>();
  COMPONENT_REGISTRY.forEach(c => categories.add(c.category));
  return Array.from(categories).sort();
};



