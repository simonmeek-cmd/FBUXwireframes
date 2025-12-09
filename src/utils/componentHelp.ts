import type { ComponentType } from '../types/builder';

// Default contextual help text for each component type
export const defaultHelpText: Record<ComponentType, string> = {
  // Navigation
  PrimarySecondaryNavigation: 'The primary and secondary navigation provides the main way for users to navigate the site. The secondary nav contains utility links, while the primary nav contains the main site sections.',
  LocalBreadcrumbs: 'Breadcrumbs show users where they are in the site hierarchy and allow them to navigate back to parent pages. They improve orientation and reduce the number of clicks needed to reach higher-level pages.',
  LocalSideNavigation: 'Side navigation helps users explore content within a section. It provides quick access to related pages and helps users understand the structure of the current section.',
  FooterNavigation: 'The footer provides secondary navigation, legal links, social media links, and contact information. It appears on every page and helps users find important information.',

  // Hero
  HeroImage: 'The hero area is the first thing users see. It should communicate the main message or purpose of the page. On click/tap, the call to action button will take users to another page or display a video in a lightbox.',

  // Homepage
  HomepageHero: 'The homepage hero displays a headline and call to action button. It should immediately communicate who you are and what you do. Keep the message clear and the CTA action-oriented.',
  HomepageOptionalCopy: 'This area can be used to showcase your positioning statement (usually found on the hero) below the main hero area. It can also be used to promote something else, such as a campaign or announcement.',
  HomepageSignposts: 'Signposts help users quickly navigate to key pages. On desktop, they display in a grid (up to 8 items). On mobile, users can swipe left/right to see more. Users can click or tap on a signpost to view the page they relate to.',
  HomepageImpactOverview: 'An area with featured content demonstrating and showing to your users the impact of your work. This consists of slots filled with either a call to action, an image, a quote or a stat. On desktop, it\'s presented as rows of featured content. On mobile the content is presented stacked.',
  HomepageCTAs: 'On desktop, 1-3 call to action boxes may be presented in the area, side by side. On mobile, the area will stack with each call to action after the previous one and in such a way that image and text are both visible on the screen.',
  HomepageStats: 'On desktop, up to 4 stats will be presented with the same prominence (e.g. in a row) under a section title, optional summary and optional button. On mobile, these will be stacked one after the other.',
  HomepageContentFeed: 'On desktop, promoted items will be presented in a row. On mobile, they will be displayed one at a time so users can swipe left to see next (and right to see previous) items. This element displays content marked for promotion with image, title, date of publication, excerpt for each item, and allows users to switch between types.',

  // Content
  TextEditor: 'The text editor block allows for rich text content including paragraphs, headings, lists, and inline formatting. Use this for body copy and detailed information.',
  TextWithSideNav: 'Text content with an accompanying side navigation. The side nav helps users jump to different sections within long-form content.',
  AccordionInline: 'Accordions are useful for FAQ-style content or when you need to present a lot of information in a compact way. Users can expand sections to see more detail.',
  QuoteInline: 'Quotes and testimonials add credibility and human interest to your pages. They can be from beneficiaries, supporters, staff, or other stakeholders.',

  // Media
  MediaImage: 'Images help break up text and illustrate your message. Always include meaningful alt text for accessibility.',
  MediaVideo: 'Video content engages users and can communicate complex information quickly. Consider adding captions for accessibility.',
  EmbedInline: 'Embedded content allows you to include third-party content such as videos, maps, or forms within your page.',
  GalleryInline: 'Image galleries showcase multiple images in a grid format. Users can typically click to view images in a larger lightbox.',

  // Promo
  FeaturedPromosInline: 'Featured promos highlight important content, news, events, or services. They typically include an image, title, and link to learn more.',
  FeaturedPromosTitlesOnly: 'A compact list of promoted content, useful for sidebars or when space is limited.',
  CallToActionInline: 'A prominent call to action block encourages users to take a specific action. Make the message clear and the button text action-oriented.',

  // Form
  FormInline: 'Forms collect information from users. Keep forms as short as possible and only ask for essential information. Include clear labels and helpful error messages.',

  // Info
  InformationOverviewInline: 'Information overview blocks present key facts or details in an easy-to-scan format.',
  OnPageContentsIndex: 'An on-page contents index helps users navigate long pages by providing jump links to each section.',
  DownloadInline: 'Download blocks provide access to downloadable files such as PDFs, documents, or resources.',
  SocialShareTag: 'Social sharing buttons allow users to share your content on social media platforms.',
};

// Get help text for a component, using custom text if provided, otherwise falling back to default
export const getHelpText = (type: ComponentType, customText?: string): string => {
  return customText || defaultHelpText[type] || 'No help text available for this component.';
};

