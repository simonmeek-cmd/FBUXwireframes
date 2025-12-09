import React from 'react';
import type { ComponentType } from '../../types/builder';

// Import all wireframe components
import {
  PrimarySecondaryNavigation,
  HeroImage,
  LocalBreadcrumbs,
  SocialShareTag,
  TextEditor,
  LocalSideNavigation,
  TextWithSideNav,
  AccordionInline,
  CallToActionInline,
  EmbedInline,
  FeaturedPromosInline,
  FeaturedPromosTitlesOnly,
  FormInline,
  InformationOverviewInline,
  GalleryInline,
  MediaImage,
  MediaVideo,
  OnPageContentsIndex,
  QuoteInline,
  DownloadInline,
  FooterNavigation,
  HomepageHero,
  HomepageOptionalCopy,
  HomepageSignposts,
  HomepageImpactOverview,
  HomepageCTAs,
  HomepageStats,
  HomepageContentFeed,
  ListingPage,
  DetailPage,
  SearchResultsPage,
} from '../wireframe';

interface ComponentRendererProps {
  type: ComponentType;
  props: Record<string, unknown>;
}

// Transform flat props to structured props for certain components
const transformProps = (type: ComponentType, props: Record<string, unknown>): Record<string, unknown> => {
  switch (type) {
    case 'HomepageSignposts': {
      // Build items array from individual item props
      const items = [];
      for (let i = 1; i <= 8; i++) {
        const title = props[`item${i}Title`] as string;
        if (title) {
          items.push({ id: String(i), title, href: '#' });
        } else {
          items.push({ id: String(i), title: "Item's Title", href: '#' });
        }
      }
      const { item1Title, item2Title, item3Title, item4Title, item5Title, item6Title, item7Title, item8Title, columns, ...rest } = props;
      return { 
        ...rest, 
        items,
        columns: columns ? Number(columns) : 4,
      };
    }

    case 'HomepageCTAs': {
      // Build items array from individual CTA props
      const items = [];
      for (let i = 1; i <= 3; i++) {
        items.push({
          id: String(i),
          heading: (props[`cta${i}Heading`] as string) || `CTA ${i}`,
          description: (props[`cta${i}Description`] as string) || 'Supporting text for this call to action area.',
          buttonLabel: (props[`cta${i}ButtonLabel`] as string) || 'Learn more',
          href: (props[`cta${i}Href`] as string) || '#',
        });
      }
      const { 
        cta1Heading, cta1Description, cta1ButtonLabel, cta1Href,
        cta2Heading, cta2Description, cta2ButtonLabel, cta2Href,
        cta3Heading, cta3Description, cta3ButtonLabel, cta3Href,
        ctaCount,
        ...rest 
      } = props;
      return { 
        ...rest, 
        items,
        ctaCount: ctaCount ? Number(ctaCount) : 3,
      };
    }

    case 'HomepageStats': {
      // Build items array from individual stat props
      const items = [];
      for (let i = 1; i <= 4; i++) {
        items.push({
          id: String(i),
          value: (props[`stat${i}Value`] as string) || '100',
          label: (props[`stat${i}Label`] as string) || "Item's Title",
        });
      }
      const { 
        stat1Value, stat1Label,
        stat2Value, stat2Label,
        stat3Value, stat3Label,
        stat4Value, stat4Label,
        statCount,
        ...rest 
      } = props;
      return { 
        ...rest, 
        items,
        statCount: statCount ? Number(statCount) : 4,
      };
    }

    default:
      return props;
  }
};

// Map component types to actual React components
const componentMap: Record<ComponentType, React.ComponentType<Record<string, unknown>>> = {
  PrimarySecondaryNavigation: PrimarySecondaryNavigation as React.ComponentType<Record<string, unknown>>,
  HeroImage: HeroImage as React.ComponentType<Record<string, unknown>>,
  LocalBreadcrumbs: LocalBreadcrumbs as React.ComponentType<Record<string, unknown>>,
  SocialShareTag: SocialShareTag as React.ComponentType<Record<string, unknown>>,
  TextEditor: TextEditor as React.ComponentType<Record<string, unknown>>,
  LocalSideNavigation: LocalSideNavigation as React.ComponentType<Record<string, unknown>>,
  TextWithSideNav: TextWithSideNav as React.ComponentType<Record<string, unknown>>,
  AccordionInline: AccordionInline as React.ComponentType<Record<string, unknown>>,
  CallToActionInline: CallToActionInline as React.ComponentType<Record<string, unknown>>,
  EmbedInline: EmbedInline as React.ComponentType<Record<string, unknown>>,
  FeaturedPromosInline: FeaturedPromosInline as React.ComponentType<Record<string, unknown>>,
  FeaturedPromosTitlesOnly: FeaturedPromosTitlesOnly as React.ComponentType<Record<string, unknown>>,
  FormInline: FormInline as React.ComponentType<Record<string, unknown>>,
  InformationOverviewInline: InformationOverviewInline as React.ComponentType<Record<string, unknown>>,
  GalleryInline: GalleryInline as React.ComponentType<Record<string, unknown>>,
  MediaImage: MediaImage as React.ComponentType<Record<string, unknown>>,
  MediaVideo: MediaVideo as React.ComponentType<Record<string, unknown>>,
  OnPageContentsIndex: OnPageContentsIndex as React.ComponentType<Record<string, unknown>>,
  QuoteInline: QuoteInline as React.ComponentType<Record<string, unknown>>,
  DownloadInline: DownloadInline as React.ComponentType<Record<string, unknown>>,
  FooterNavigation: FooterNavigation as React.ComponentType<Record<string, unknown>>,
  // Homepage components
  HomepageHero: HomepageHero as React.ComponentType<Record<string, unknown>>,
  HomepageOptionalCopy: HomepageOptionalCopy as React.ComponentType<Record<string, unknown>>,
  HomepageSignposts: HomepageSignposts as React.ComponentType<Record<string, unknown>>,
  HomepageImpactOverview: HomepageImpactOverview as React.ComponentType<Record<string, unknown>>,
  HomepageCTAs: HomepageCTAs as React.ComponentType<Record<string, unknown>>,
  HomepageStats: HomepageStats as React.ComponentType<Record<string, unknown>>,
  HomepageContentFeed: HomepageContentFeed as React.ComponentType<Record<string, unknown>>,
  // Listing components
  ListingPage: ListingPage as React.ComponentType<Record<string, unknown>>,
  DetailPage: DetailPage as React.ComponentType<Record<string, unknown>>,
  SearchResultsPage: SearchResultsPage as React.ComponentType<Record<string, unknown>>,
};

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ type, props }) => {
  const Component = componentMap[type];
  
  if (!Component) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
        Unknown component type: {type}
      </div>
    );
  }

  const transformedProps = transformProps(type, props);
  
  return <Component {...transformedProps} />;
};

export default ComponentRenderer;
