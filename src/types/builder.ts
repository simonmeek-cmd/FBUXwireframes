// Core data types for the wireframe builder

import type { NavigationConfig } from './navigation';
import type { FooterConfig } from './footer';

export interface Client {
  id: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  pages: Page[];
  createdAt: string;
  navigationConfig?: NavigationConfig;
  footerConfig?: FooterConfig;
}

export type PageType = 'homepage' | 'content' | 'listing' | 'custom';

export interface Page {
  id: string;
  name: string;
  type: PageType;
  components: PlacedComponent[];
}

export interface PlacedComponent {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  order: number;
  /** Custom help/annotation text for this component instance */
  helpText?: string;
}

// All available wireframe component types
export type ComponentType =
  | 'PrimarySecondaryNavigation'
  | 'HeroImage'
  | 'LocalBreadcrumbs'
  | 'SocialShareTag'
  | 'TextEditor'
  | 'LocalSideNavigation'
  | 'TextWithSideNav'
  | 'AccordionInline'
  | 'CallToActionInline'
  | 'EmbedInline'
  | 'FeaturedPromosInline'
  | 'FeaturedPromosTitlesOnly'
  | 'FormInline'
  | 'InformationOverviewInline'
  | 'GalleryInline'
  | 'MediaImage'
  | 'MediaVideo'
  | 'OnPageContentsIndex'
  | 'QuoteInline'
  | 'DownloadInline'
  | 'FooterNavigation'
  // Homepage components
  | 'HomepageHero'
  | 'HomepageOptionalCopy'
  | 'HomepageSignposts'
  | 'HomepageImpactOverview'
  | 'HomepageCTAs'
  | 'HomepageStats'
  | 'HomepageContentFeed';

// Component metadata for the palette
export interface ComponentMeta {
  type: ComponentType;
  label: string;
  description: string;
  category: 'navigation' | 'hero' | 'content' | 'media' | 'promo' | 'form' | 'info' | 'homepage';
  defaultProps: Record<string, unknown>;
}

// Utility type for generating unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


