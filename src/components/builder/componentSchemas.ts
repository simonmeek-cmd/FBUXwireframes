import type { ComponentType } from '../../types/builder';

// Property field types for the editor
export type FieldType = 'text' | 'textarea' | 'select' | 'toggle' | 'number' | 'richtext';

export interface PropertyField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface ComponentSchema {
  type: ComponentType;
  fields: PropertyField[];
}

// Define editable properties for each component
export const componentSchemas: ComponentSchema[] = [
  // Homepage Components
  {
    type: 'HomepageHero',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Who we are and what we do' },
      { key: 'ctaLabel', label: 'Button Label', type: 'text', placeholder: 'Button' },
      { key: 'ctaHref', label: 'Button URL', type: 'text', placeholder: '#' },
      { key: 'showImage', label: 'Show Image', type: 'toggle' },
    ],
  },
  {
    type: 'HomepageOptionalCopy',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Optional Copy' },
      { key: 'content', label: 'Content', type: 'richtext', placeholder: 'Your content here...' },
      {
        key: 'alignment',
        label: 'Text Alignment',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'highlighted', label: 'Highlighted' },
        ],
      },
    ],
  },
  {
    type: 'HomepageSignposts',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Signpost Area' },
      { key: 'showHeading', label: 'Show Heading', type: 'toggle' },
      {
        key: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { value: '2', label: '2 columns' },
          { value: '3', label: '3 columns' },
          { value: '4', label: '4 columns' },
        ],
      },
      { key: 'showButton', label: 'Show Button', type: 'toggle' },
      { key: 'buttonLabel', label: 'Button Label', type: 'text', placeholder: 'Button' },
      { key: 'buttonHref', label: 'Button URL', type: 'text', placeholder: '#' },
      { key: 'item1Title', label: 'Item 1 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item2Title', label: 'Item 2 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item3Title', label: 'Item 3 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item4Title', label: 'Item 4 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item5Title', label: 'Item 5 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item6Title', label: 'Item 6 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item7Title', label: 'Item 7 Title', type: 'text', placeholder: "Item's Title" },
      { key: 'item8Title', label: 'Item 8 Title', type: 'text', placeholder: "Item's Title" },
    ],
  },
  {
    type: 'HomepageImpactOverview',
    fields: [
      // Header section
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Impact Overview' },
      { key: 'showHeading', label: 'Show Heading', type: 'toggle' },
      { key: 'introCopy', label: 'Intro Copy', type: 'textarea', placeholder: 'Introduction text...' },
      { key: 'showIntroCopy', label: 'Show Intro Copy', type: 'toggle' },

      // Quote with Image (top left)
      { key: 'showQuoteImage', label: 'Show Quote with Image', type: 'toggle' },
      { key: 'quoteImageText', label: 'Quote Text', type: 'textarea', placeholder: 'Quote text...' },
      { key: 'quoteImageAttribution', label: 'Quote Attribution', type: 'text', placeholder: 'Person Name, Role' },

      // Promo Box (top right)
      { key: 'showPromoBox', label: 'Show Promo Box', type: 'toggle' },
      { key: 'promoTitle', label: 'Promo Title', type: 'text', placeholder: 'Promo Title Text' },
      { key: 'promoButtonLabel', label: 'Promo Button Label', type: 'text', placeholder: 'Button' },
      { key: 'promoButtonHref', label: 'Promo Button URL', type: 'text', placeholder: '#' },

      // Stat Box (bottom)
      { key: 'showStatBox', label: 'Show Stat Box', type: 'toggle' },
      { key: 'statValue', label: 'Stat Value', type: 'text', placeholder: '28%' },
      { key: 'statTitle', label: 'Stat Title', type: 'text', placeholder: 'Stat Title Text' },

      // Promo Box 2
      { key: 'showPromoBox2', label: 'Show Promo Box 2', type: 'toggle' },
      { key: 'promo2Title', label: 'Promo 2 Title', type: 'text', placeholder: 'Promo Title Text' },
      { key: 'promo2ButtonLabel', label: 'Promo 2 Button', type: 'text', placeholder: 'Button' },
      { key: 'promo2ButtonHref', label: 'Promo 2 URL', type: 'text', placeholder: '#' },

      // Promo Box 3
      { key: 'showPromoBox3', label: 'Show Promo Box 3', type: 'toggle' },
      { key: 'promo3Title', label: 'Promo 3 Title', type: 'text', placeholder: 'Promo Title Text' },
      { key: 'promo3ButtonLabel', label: 'Promo 3 Button', type: 'text', placeholder: 'Button' },
      { key: 'promo3ButtonHref', label: 'Promo 3 URL', type: 'text', placeholder: '#' },
    ],
  },
  {
    type: 'HomepageCTAs',
    fields: [
      {
        key: 'ctaCount',
        label: 'Number of CTAs',
        type: 'select',
        options: [
          { value: '1', label: '1 CTA' },
          { value: '2', label: '2 CTAs' },
          { value: '3', label: '3 CTAs' },
        ],
      },
      { key: 'showImages', label: 'Show Images', type: 'toggle' },
      {
        key: 'variant',
        label: 'Background',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'highlighted', label: 'Highlighted' },
        ],
      },
      { key: 'cta1Heading', label: 'CTA 1 Heading', type: 'text', placeholder: 'CTA 1' },
      { key: 'cta1Description', label: 'CTA 1 Description', type: 'text', placeholder: 'Description' },
      { key: 'cta1ButtonLabel', label: 'CTA 1 Button', type: 'text', placeholder: 'Learn more' },
      { key: 'cta1Href', label: 'CTA 1 URL', type: 'text', placeholder: '#' },
      { key: 'cta2Heading', label: 'CTA 2 Heading', type: 'text', placeholder: 'CTA 2' },
      { key: 'cta2Description', label: 'CTA 2 Description', type: 'text', placeholder: 'Description' },
      { key: 'cta2ButtonLabel', label: 'CTA 2 Button', type: 'text', placeholder: 'Learn more' },
      { key: 'cta2Href', label: 'CTA 2 URL', type: 'text', placeholder: '#' },
      { key: 'cta3Heading', label: 'CTA 3 Heading', type: 'text', placeholder: 'CTA 3' },
      { key: 'cta3Description', label: 'CTA 3 Description', type: 'text', placeholder: 'Description' },
      { key: 'cta3ButtonLabel', label: 'CTA 3 Button', type: 'text', placeholder: 'Learn more' },
      { key: 'cta3Href', label: 'CTA 3 URL', type: 'text', placeholder: '#' },
    ],
  },
  {
    type: 'HomepageStats',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Impact Stats Area' },
      { key: 'showHeading', label: 'Show Heading', type: 'toggle' },
      {
        key: 'statCount',
        label: 'Number of Stats',
        type: 'select',
        options: [
          { value: '1', label: '1 stat' },
          { value: '2', label: '2 stats' },
          { value: '3', label: '3 stats' },
          { value: '4', label: '4 stats' },
        ],
      },
      { key: 'showButton', label: 'Show Button', type: 'toggle' },
      { key: 'buttonLabel', label: 'Button Label', type: 'text', placeholder: 'Button' },
      { key: 'buttonHref', label: 'Button URL', type: 'text', placeholder: '#' },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default (Light)' },
          { value: 'highlighted', label: 'Highlighted' },
          { value: 'dark', label: 'Dark' },
        ],
      },
      { key: 'stat1Value', label: 'Stat 1 Value', type: 'text', placeholder: '100' },
      { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', placeholder: "Item's Title" },
      { key: 'stat2Value', label: 'Stat 2 Value', type: 'text', placeholder: '100' },
      { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', placeholder: "Item's Title" },
      { key: 'stat3Value', label: 'Stat 3 Value', type: 'text', placeholder: '100' },
      { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', placeholder: "Item's Title" },
      { key: 'stat4Value', label: 'Stat 4 Value', type: 'text', placeholder: '100' },
      { key: 'stat4Label', label: 'Stat 4 Label', type: 'text', placeholder: "Item's Title" },
    ],
  },
  {
    type: 'HomepageContentFeed',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Latest Content Feed' },
      { key: 'showHeading', label: 'Show Heading', type: 'toggle' },
      { key: 'showTabs', label: 'Show Category Tabs', type: 'toggle' },
      { key: 'showSeeAll', label: 'Show "See All" Button', type: 'toggle' },
      { key: 'seeAllLabel', label: 'See All Label', type: 'text', placeholder: 'See all' },
      { key: 'seeAllHref', label: 'See All URL', type: 'text', placeholder: '#' },
    ],
  },

  // Navigation & Utility
  {
    type: 'PrimarySecondaryNavigation',
    fields: [
      { key: 'logoText', label: 'Logo Text', type: 'text', placeholder: 'LOGO' },
      { key: 'hasSearch', label: 'Show Search', type: 'toggle' },
    ],
  },
  {
    type: 'HeroImage',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Main heading' },
      { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Subheading text' },
      { key: 'bodyText', label: 'Body Text (no image)', type: 'richtext', placeholder: 'Body copy shown when no image...' },
      { key: 'ctaLabel', label: 'Button Label', type: 'text', placeholder: 'Learn more' },
      { key: 'tag', label: 'Tag', type: 'text', placeholder: 'Optional tag' },
      { key: 'hasImage', label: 'Show Image', type: 'toggle' },
      {
        key: 'imagePosition',
        label: 'Image Position',
        type: 'select',
        options: [
          { value: 'right', label: 'Right' },
          { value: 'background', label: 'Background' },
        ],
      },
    ],
  },
  {
    type: 'LocalBreadcrumbs',
    fields: [
      { key: 'separator', label: 'Separator', type: 'text', placeholder: '/' },
    ],
  },
  {
    type: 'SocialShareTag',
    fields: [
      { key: 'label', label: 'Label', type: 'text', placeholder: 'Share:' },
    ],
  },
  {
    type: 'TextEditor',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Section heading' },
      { key: 'content', label: 'Content', type: 'richtext', placeholder: 'Enter your content here...' },
    ],
  },
  {
    type: 'LocalSideNavigation',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'In this section' },
    ],
  },
  {
    type: 'TextWithSideNav',
    fields: [
      { key: 'navTitle', label: 'Nav Title', type: 'text', placeholder: 'In this section' },
      {
        key: 'navPosition',
        label: 'Nav Position',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
      },
    ],
  },
  {
    type: 'AccordionInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'FAQ heading' },
      { key: 'allowMultiple', label: 'Allow Multiple Open', type: 'toggle' },
    ],
  },
  {
    type: 'CallToActionInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'CTA heading' },
      { key: 'description', label: 'Description', type: 'text', placeholder: 'Description text' },
      { key: 'primaryLabel', label: 'Primary Button', type: 'text', placeholder: 'Get Started' },
      { key: 'secondaryLabel', label: 'Secondary Button', type: 'text', placeholder: 'Optional' },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'highlighted', label: 'Highlighted' },
          { value: 'minimal', label: 'Minimal' },
        ],
      },
    ],
  },
  {
    type: 'EmbedInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Optional heading' },
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional caption' },
      {
        key: 'embedType',
        label: 'Embed Type',
        type: 'select',
        options: [
          { value: 'video', label: 'Video' },
          { value: 'map', label: 'Map' },
          { value: 'form', label: 'Form' },
          { value: 'generic', label: 'Generic' },
        ],
      },
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9' },
          { value: '4:3', label: '4:3' },
          { value: '1:1', label: 'Square' },
        ],
      },
    ],
  },
  {
    type: 'FeaturedPromosInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Featured' },
      {
        key: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { value: '2', label: '2 columns' },
          { value: '3', label: '3 columns' },
          { value: '4', label: '4 columns' },
        ],
      },
      { key: 'showActions', label: 'Show Actions', type: 'toggle' },
      { key: 'actionLabel', label: 'Action Label', type: 'text', placeholder: 'Read more' },
      // Promo Item 0
      { key: 'item0Title', label: 'Item 1 - Title', type: 'text', placeholder: 'Title' },
      { key: 'item0Subtitle', label: 'Item 1 - Subtitle', type: 'text', placeholder: 'Subtitle' },
      { key: 'item0Meta', label: 'Item 1 - Meta', type: 'text', placeholder: 'Meta text (optional)' },
      { key: 'item0Tag', label: 'Item 1 - Tag', type: 'text', placeholder: 'Tag (optional)' },
      // Promo Item 1
      { key: 'item1Title', label: 'Item 2 - Title', type: 'text', placeholder: 'Title' },
      { key: 'item1Subtitle', label: 'Item 2 - Subtitle', type: 'text', placeholder: 'Subtitle' },
      { key: 'item1Meta', label: 'Item 2 - Meta', type: 'text', placeholder: 'Meta text (optional)' },
      { key: 'item1Tag', label: 'Item 2 - Tag', type: 'text', placeholder: 'Tag (optional)' },
      // Promo Item 2
      { key: 'item2Title', label: 'Item 3 - Title', type: 'text', placeholder: 'Title' },
      { key: 'item2Subtitle', label: 'Item 3 - Subtitle', type: 'text', placeholder: 'Subtitle' },
      { key: 'item2Meta', label: 'Item 3 - Meta', type: 'text', placeholder: 'Meta text (optional)' },
      { key: 'item2Tag', label: 'Item 3 - Tag', type: 'text', placeholder: 'Tag (optional)' },
    ],
  },
  {
    type: 'FeaturedPromosTitlesOnly',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'More stories' },
      { key: 'showThumbnails', label: 'Show Thumbnails', type: 'toggle' },
    ],
  },
  {
    type: 'FormInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Contact us' },
      { key: 'description', label: 'Description', type: 'text', placeholder: 'Optional description' },
      { key: 'submitLabel', label: 'Submit Button', type: 'text', placeholder: 'Submit' },
      { key: 'showPrivacyNotice', label: 'Show Privacy Notice', type: 'toggle' },
    ],
  },
  {
    type: 'InformationOverviewInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Information' },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ],
      },
    ],
  },
  {
    type: 'GalleryInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Gallery' },
      {
        key: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { value: '2', label: '2 columns' },
          { value: '3', label: '3 columns' },
          { value: '4', label: '4 columns' },
          { value: '6', label: '6 columns' },
        ],
      },
      { key: 'showCaptions', label: 'Show Captions', type: 'toggle' },
    ],
  },
  {
    type: 'MediaImage',
    fields: [
      { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional caption' },
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9' },
          { value: '4:3', label: '4:3' },
          { value: '1:1', label: 'Square' },
          { value: '3:2', label: '3:2' },
        ],
      },
      {
        key: 'alignment',
        label: 'Alignment',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
    ],
  },
  {
    type: 'MediaVideo',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Video title' },
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Optional caption' },
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'YouTube' },
      { key: 'showControls', label: 'Show Controls', type: 'toggle' },
    ],
  },
  {
    type: 'OnPageContentsIndex',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'On this page' },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'compact', label: 'Compact' },
          { value: 'bordered', label: 'Bordered' },
        ],
      },
    ],
  },
  {
    type: 'QuoteInline',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Quote text' },
      { key: 'attribution', label: 'Attribution', type: 'text', placeholder: 'Name' },
      { key: 'role', label: 'Role', type: 'text', placeholder: 'Title/role' },
      { key: 'showQuoteMarks', label: 'Show Quote Marks', type: 'toggle' },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'large', label: 'Large' },
          { value: 'bordered', label: 'Bordered' },
        ],
      },
    ],
  },
  {
    type: 'DownloadInline',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Downloads' },
      { key: 'showIcons', label: 'Show Icons', type: 'toggle' },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ],
      },
    ],
  },
  {
    type: 'FooterNavigation',
    fields: [
      { key: 'logoText', label: 'Logo Text', type: 'text', placeholder: 'LOGO' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Company tagline' },
      { key: 'showSocialLinks', label: 'Show Social Links', type: 'toggle' },
      { key: 'showNewsletter', label: 'Show Newsletter', type: 'toggle' },
    ],
  },

  // Listing Page Components
  {
    type: 'ListingPage',
    fields: [
      {
        key: 'listingType',
        label: 'Listing Type',
        type: 'select',
        options: [
          { value: 'news', label: 'News' },
          { value: 'resources', label: 'Resources' },
          { value: 'events', label: 'Events' },
        ],
      },
      { key: 'title', label: 'Page Title', type: 'text', placeholder: 'News' },
      { key: 'introCopy', label: 'Intro Copy', type: 'richtext', placeholder: 'Introduction text...' },
      { key: 'showHeroImage', label: 'Show Hero Image', type: 'toggle' },
      {
        key: 'heroImagePosition',
        label: 'Hero Image Position',
        type: 'select',
        options: [
          { value: 'right', label: 'Right' },
          { value: 'background', label: 'Background' },
        ],
      },
      { key: 'showHeroButton', label: 'Show Hero Button', type: 'toggle' },
      { key: 'heroButtonLabel', label: 'Hero Button Label', type: 'text', placeholder: 'Button' },
      { key: 'showContactInfo', label: 'Show Press Contact (News only)', type: 'toggle' },
      { key: 'contactEmail', label: 'Press Email', type: 'text', placeholder: 'press@org.uk' },
      { key: 'contactPhone', label: 'Press Phone', type: 'text', placeholder: '020 123 456 789' },
      {
        key: 'itemCount',
        label: 'Number of Items',
        type: 'select',
        options: [
          { value: '3', label: '3 items' },
          { value: '6', label: '6 items' },
          { value: '9', label: '9 items' },
          { value: '12', label: '12 items' },
        ],
      },
      { key: 'showPagination', label: 'Show Pagination', type: 'toggle' },
      // Featured item 1
      { key: 'featured1TypeLabel', label: 'Featured 1: Type', type: 'text', placeholder: 'Type Label' },
      { key: 'featured1Title', label: 'Featured 1: Title', type: 'text', placeholder: 'Title' },
      { key: 'featured1Date', label: 'Featured 1: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'featured1Excerpt', label: 'Featured 1: Excerpt', type: 'textarea', placeholder: 'Excerpt...' },
      // Featured item 2
      { key: 'featured2TypeLabel', label: 'Featured 2: Type', type: 'text', placeholder: 'Type Label' },
      { key: 'featured2Title', label: 'Featured 2: Title', type: 'text', placeholder: 'Title' },
      { key: 'featured2Date', label: 'Featured 2: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'featured2Excerpt', label: 'Featured 2: Excerpt', type: 'textarea', placeholder: 'Excerpt...' },
      // Featured item 3
      { key: 'featured3TypeLabel', label: 'Featured 3: Type', type: 'text', placeholder: 'Type Label' },
      { key: 'featured3Title', label: 'Featured 3: Title', type: 'text', placeholder: 'Title' },
      { key: 'featured3Date', label: 'Featured 3: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'featured3Excerpt', label: 'Featured 3: Excerpt', type: 'textarea', placeholder: 'Excerpt...' },
      // Filter labels
      { key: 'filter1Label', label: 'Filter 1 Label', type: 'text', placeholder: 'Type' },
      { key: 'filter2Label', label: 'Filter 2 Label', type: 'text', placeholder: 'Topic' },
      { key: 'filter3Label', label: 'Filter 3 Label (Events)', type: 'text', placeholder: 'Location' },
    ],
  },
  {
    type: 'DetailPage',
    fields: [
      {
        key: 'detailType',
        label: 'Detail Type',
        type: 'select',
        options: [
          { value: 'news', label: 'News Article' },
          { value: 'resources', label: 'Resource' },
          { value: 'events', label: 'Event' },
        ],
      },
      { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Article Title' },
      { key: 'introCopy', label: 'Intro/Summary', type: 'richtext', placeholder: 'Article summary...' },
      { key: 'showHeroImage', label: 'Show Hero Image', type: 'toggle' },
      { key: 'showCtaButton', label: 'Show CTA Button', type: 'toggle' },
      { key: 'ctaButtonLabel', label: 'CTA Button Label', type: 'text', placeholder: 'Register' },
      { key: 'publishedDate', label: 'Published Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'author', label: 'Author', type: 'text', placeholder: 'Author Name' },
      { key: 'typeLabel', label: 'Type Label', type: 'text', placeholder: 'Type' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'text', placeholder: 'Topic 1, Topic 2' },
      { key: 'showPressContact', label: 'Show Press Contact', type: 'toggle' },
      { key: 'pressEmail', label: 'Press Email', type: 'text', placeholder: 'press@org.uk' },
      { key: 'pressPhone', label: 'Press Phone', type: 'text', placeholder: '01234 567890' },
      // Events specific
      { key: 'eventDate', label: 'Event Date', type: 'text', placeholder: '01/01/2026 - 02/01/2026' },
      { key: 'eventTime', label: 'Event Time', type: 'text', placeholder: '18:00 - 20:00' },
      { key: 'eventLocation', label: 'Event Location', type: 'text', placeholder: 'Venue Name' },
      { key: 'registrationFee', label: 'Registration Fee', type: 'text', placeholder: '£8.00' },
    ],
  },
  {
    type: 'SearchResultsPage',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Search result listing' },
      { key: 'introCopy', label: 'Intro Copy', type: 'richtext', placeholder: 'Introduction text...' },
      { key: 'searchPlaceholder', label: 'Search Placeholder', type: 'text', placeholder: 'Search' },
      { key: 'searchButtonLabel', label: 'Search Button Label', type: 'text', placeholder: 'Search' },
      {
        key: 'resultCount',
        label: 'Number of Results',
        type: 'select',
        options: [
          { value: '5', label: '5 results' },
          { value: '10', label: '10 results' },
          { value: '15', label: '15 results' },
          { value: '20', label: '20 results' },
        ],
      },
      { key: 'showPagination', label: 'Show Pagination', type: 'toggle' },
      // Result 1
      { key: 'result1Title', label: 'Result 1: Title', type: 'text', placeholder: "Item's Title" },
      { key: 'result1Date', label: 'Result 1: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'result1Excerpt', label: 'Result 1: Excerpt', type: 'textarea', placeholder: 'Result excerpt...' },
      // Result 2
      { key: 'result2Title', label: 'Result 2: Title', type: 'text', placeholder: "Item's Title" },
      { key: 'result2Date', label: 'Result 2: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'result2Excerpt', label: 'Result 2: Excerpt', type: 'textarea', placeholder: 'Result excerpt...' },
      // Result 3
      { key: 'result3Title', label: 'Result 3: Title', type: 'text', placeholder: "Item's Title" },
      { key: 'result3Date', label: 'Result 3: Date', type: 'text', placeholder: '01/01/2026' },
      { key: 'result3Excerpt', label: 'Result 3: Excerpt', type: 'textarea', placeholder: 'Result excerpt...' },
    ],
  },
];

// Get schema for a component type
export const getComponentSchema = (type: ComponentType): ComponentSchema | undefined => {
  return componentSchemas.find((s) => s.type === type);
};


