import type { ComponentMeta, ComponentType } from '../../types/builder';

// Component metadata for the palette and editor
// Note: PrimarySecondaryNavigation and FooterNavigation are removed as they are now configured at project level
export const componentRegistry: ComponentMeta[] = [
  // Homepage components
  {
    type: 'HomepageHero',
    label: 'Homepage Hero',
    description: 'Simple hero with heading and CTA',
    category: 'homepage',
    defaultProps: {
      heading: 'Who we are and what we do',
      ctaLabel: 'Button',
      showImage: true,
    },
  },
  {
    type: 'HomepageOptionalCopy',
    label: 'Optional Copy',
    description: 'Positioning statement or announcement',
    category: 'homepage',
    defaultProps: {
      heading: 'Optional Copy',
      alignment: 'center',
      variant: 'default',
    },
  },
  {
    type: 'HomepageSignposts',
    label: 'Signposts',
    description: 'Grid of quick navigation links',
    category: 'homepage',
    defaultProps: {
      heading: 'Signpost Area',
      showHeading: true,
      columns: 4,
      showButton: true,
      buttonLabel: 'Button',
    },
  },
  {
    type: 'HomepageImpactOverview',
    label: 'Impact Overview',
    description: 'Featured content with promos, quotes, stats',
    category: 'homepage',
    defaultProps: {
      heading: 'Impact Overview',
      showHeading: true,
      showIntroCopy: true,
      showQuoteImage: true,
      showPromoBox: true,
      showStatBox: true,
      showPromoBox2: false,
      showPromoBox3: false,
    },
  },
  {
    type: 'HomepageCTAs',
    label: 'CTA Boxes',
    description: '1-3 call to action boxes with images',
    category: 'homepage',
    defaultProps: {
      ctaCount: 3,
      showImages: true,
      variant: 'default',
    },
  },
  {
    type: 'HomepageStats',
    label: 'Impact Stats',
    description: 'Row of statistics with large numbers',
    category: 'homepage',
    defaultProps: {
      heading: 'Impact Stats Area',
      showHeading: true,
      statCount: 4,
      showButton: true,
      buttonLabel: 'Button',
      variant: 'default',
    },
  },
  {
    type: 'HomepageContentFeed',
    label: 'Content Feed',
    description: 'Tabbed news, events, and resources',
    category: 'homepage',
    defaultProps: {
      heading: 'Latest Content Feed',
      showHeading: true,
      showTabs: true,
      showSeeAll: true,
      seeAllLabel: 'See all',
    },
  },

  // Navigation (in-page navigation components only)
  {
    type: 'LocalBreadcrumbs',
    label: 'Breadcrumbs',
    description: 'Breadcrumb navigation trail',
    category: 'navigation',
    defaultProps: {},
  },

  // Hero
  {
    type: 'HeroImage',
    label: 'Hero',
    description: 'Hero banner with heading and CTA',
    category: 'hero',
    defaultProps: {
      heading: 'Welcome to our site',
      subheading: 'Your tagline goes here',
      ctaLabel: 'Learn more',
      hasImage: true,
      imagePosition: 'right',
    },
  },

  // Content
  {
    type: 'TextEditor',
    label: 'Text Block',
    description: 'Rich text content area',
    category: 'content',
    defaultProps: {
      heading: 'Section Title',
    },
  },
  {
    type: 'TextWithSideNav',
    label: 'Text with Side Nav',
    description: 'Text content with side navigation',
    category: 'content',
    defaultProps: {
      navTitle: 'In this section',
    },
  },
  {
    type: 'AccordionInline',
    label: 'Accordion',
    description: 'Expandable FAQ-style content',
    category: 'content',
    defaultProps: {
      heading: 'Frequently Asked Questions',
    },
  },
  {
    type: 'QuoteInline',
    label: 'Quote',
    description: 'Testimonial or blockquote',
    category: 'content',
    defaultProps: {
      quote: 'This is an inspiring quote that showcases a testimonial.',
      attribution: 'Jane Smith',
      role: 'Volunteer',
      variant: 'default',
    },
  },

  // Media
  {
    type: 'MediaImage',
    label: 'Image',
    description: 'Single image with caption',
    category: 'media',
    defaultProps: {
      alt: 'Image description',
      aspectRatio: '16:9',
    },
  },
  {
    type: 'MediaVideo',
    label: 'Video',
    description: 'Video player placeholder',
    category: 'media',
    defaultProps: {
      title: 'Video title',
      platform: 'YouTube',
    },
  },
  {
    type: 'EmbedInline',
    label: 'Embed',
    description: 'Embedded content (video, map, form)',
    category: 'media',
    defaultProps: {
      embedType: 'video',
      aspectRatio: '16:9',
    },
  },
  {
    type: 'GalleryInline',
    label: 'Gallery',
    description: 'Image gallery grid',
    category: 'media',
    defaultProps: {
      columns: 3,
      showCaptions: false,
    },
  },

  // Promo
  {
    type: 'FeaturedPromosInline',
    label: 'Featured Promos',
    description: 'Grid of promo cards with images',
    category: 'promo',
    defaultProps: {
      heading: 'Featured',
      columns: 3,
      showActions: true,
    },
  },
  {
    type: 'FeaturedPromosTitlesOnly',
    label: 'Promo List',
    description: 'Compact list of promos',
    category: 'promo',
    defaultProps: {
      heading: 'More stories',
      showThumbnails: true,
    },
  },
  {
    type: 'CallToActionInline',
    label: 'Call to Action',
    description: 'Prominent CTA block',
    category: 'promo',
    defaultProps: {
      heading: 'Ready to get started?',
      description: 'Join us today and make a difference.',
      primaryLabel: 'Get Started',
      variant: 'default',
    },
  },

  // Form
  {
    type: 'FormInline',
    label: 'Contact Form',
    description: 'Form with inputs',
    category: 'form',
    defaultProps: {
      heading: 'Get in touch',
      submitLabel: 'Submit',
      showPrivacyNotice: true,
    },
  },

  // Info
  {
    type: 'InformationOverviewInline',
    label: 'Info List',
    description: 'List of information items',
    category: 'info',
    defaultProps: {
      heading: 'Quick Links',
      layout: 'list',
    },
  },
  {
    type: 'OnPageContentsIndex',
    label: 'Contents Index',
    description: 'Table of contents',
    category: 'info',
    defaultProps: {
      title: 'On this page',
      variant: 'default',
    },
  },
  {
    type: 'DownloadInline',
    label: 'Downloads',
    description: 'List of downloadable files',
    category: 'info',
    defaultProps: {
      heading: 'Downloads',
      showIcons: true,
      layout: 'list',
    },
  },
  {
    type: 'SocialShareTag',
    label: 'Social Share',
    description: 'Social sharing buttons',
    category: 'info',
    defaultProps: {
      label: 'Share:',
    },
  },
  {
    type: 'LocalSideNavigation',
    label: 'Side Navigation',
    description: 'Section navigation menu',
    category: 'navigation',
    defaultProps: {
      title: 'In this section',
    },
  },
];

// Get component metadata by type
export const getComponentMeta = (type: ComponentType): ComponentMeta | undefined => {
  return componentRegistry.find((c) => c.type === type);
};

// Group components by category
export const componentsByCategory = componentRegistry.reduce((acc, component) => {
  if (!acc[component.category]) {
    acc[component.category] = [];
  }
  acc[component.category].push(component);
  return acc;
}, {} as Record<string, ComponentMeta[]>);

// Category labels
export const categoryLabels: Record<string, string> = {
  homepage: 'Homepage',
  navigation: 'Navigation',
  hero: 'Hero',
  content: 'Content',
  media: 'Media',
  promo: 'Promos & CTAs',
  form: 'Forms',
  info: 'Information',
};


