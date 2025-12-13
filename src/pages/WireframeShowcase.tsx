import React, { useState } from 'react';
import { useBuilderStore } from '../stores/useBuilderStore';
import {
  getActiveComponents,
  getInactiveComponents,
  getCategories,
  getComponentsByCategory,
} from '../utils/componentRegistry';
import type { ComponentType } from '../types/builder';
import {
  PrimarySecondaryNavigation,
  LocalBreadcrumbs,
  LocalSideNavigation,
  FooterNavigation,
  HeroImage,
  TextWithSideNav,
  TextEditor,
  AccordionInline,
  QuoteInline,
  MediaImage,
  MediaVideo,
  EmbedInline,
  GalleryInline,
  FeaturedPromosInline,
  FeaturedPromosTitlesOnly,
  CallToActionInline,
  FormInline,
  InformationOverviewInline,
  OnPageContentsIndex,
  DownloadInline,
  SocialShareTag,
} from '../components/wireframe';

interface ShowcaseSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  isInactive?: boolean;
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  id,
  title,
  description,
  children,
  isInactive = false,
}) => (
  <section 
    id={id} 
    className={`mb-16 ${isInactive ? 'bg-red-50/30 border-2 border-red-200 rounded-lg p-6' : ''}`}
  >
    <div className="mb-6 pb-4 border-b-2 border-wire-300">
      <h2 className="text-2xl font-bold text-wire-800">
        {title}
        {isInactive && (
          <span className="ml-2 text-sm font-normal text-red-600">(Inactive - Not available for this project)</span>
        )}
      </h2>
      <p className="text-wire-600 mt-1">{description}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

interface WireframeShowcaseProps {
  /** Optional active components override (for static export) */
  activeComponentsOverride?: ComponentType[];
}

/**
 * WireframeShowcase
 * A page that renders all wireframe components for visual QA and documentation.
 * Shows active components normally and inactive components with muted red background.
 */
export const WireframeShowcase: React.FC<WireframeShowcaseProps> = ({ 
  activeComponentsOverride 
}) => {
  const { selectedProjectId, getProject } = useBuilderStore();
  const [showInactive, setShowInactive] = useState(false);
  
  const project = selectedProjectId ? getProject(selectedProjectId) : undefined;
  // Use override if provided (for static export), otherwise use project settings
  const activeComponents = activeComponentsOverride 
    ? activeComponentsOverride 
    : getActiveComponents(project?.activeComponents);
  const inactiveComponents = activeComponentsOverride
    ? getInactiveComponents(activeComponentsOverride)
    : getInactiveComponents(project?.activeComponents);
  const categories = getCategories();
  
  // Helper to check if a component is inactive (works for both in-app and static export)
  const isComponentInactive = (componentType: ComponentType): boolean => {
    return !activeComponents.includes(componentType);
  };

  return (
    <div className="min-h-screen bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Wireframe Component Library</h1>
              <p className="text-wire-300">
                Low-fidelity pagebuilder components for charity websites
              </p>
            </div>
            {(project || activeComponentsOverride) && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show inactive components</span>
                </label>
                <div className="text-xs text-wire-300">
                  {activeComponents.length} active • {inactiveComponents.length} inactive
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="bg-wire-200 border-b border-wire-300 py-4 px-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { id: 'navigation', label: '01 Navigation', componentType: 'PrimarySecondaryNavigation' },
              { id: 'hero', label: '02 Hero', componentType: 'HeroImage' },
              { id: 'breadcrumbs', label: '03 Breadcrumbs', componentType: 'LocalBreadcrumbs' },
              { id: 'social', label: '04 Social Share', componentType: 'SocialShareTag' },
              { id: 'text-editor', label: '05 Text Editor', componentType: 'TextEditor' },
              { id: 'side-nav', label: '06 Side Nav', componentType: 'LocalSideNavigation' },
              { id: 'accordion', label: '07 Accordion', componentType: 'AccordionInline' },
              { id: 'cta', label: '08 CTA', componentType: 'CallToActionInline' },
              { id: 'embed', label: '09 Embed', componentType: 'EmbedInline' },
              { id: 'promos', label: '10 Featured Promos', componentType: 'FeaturedPromosInline' },
              { id: 'form', label: '11 Form', componentType: 'FormInline' },
              { id: 'info-overview', label: '12 Info Overview', componentType: 'InformationOverviewInline' },
              { id: 'gallery', label: '13 Gallery', componentType: 'GalleryInline' },
              { id: 'media-image', label: '14 Media Image', componentType: 'MediaImage' },
              { id: 'media-video', label: '15 Media Video', componentType: 'MediaVideo' },
              { id: 'contents-index', label: '16 Contents Index', componentType: 'OnPageContentsIndex' },
              { id: 'quote', label: '17 Quote', componentType: 'QuoteInline' },
              { id: 'download', label: '18 Download', componentType: 'DownloadInline' },
              { id: 'footer', label: '19 Footer', componentType: 'FooterNavigation' },
            ].map((item) => {
              // Handle special cases where nav item maps to multiple component types
              let isInactive = false;
              if (item.id === 'side-nav') {
                isInactive = isComponentInactive('LocalSideNavigation') || isComponentInactive('TextWithSideNav');
              } else if (item.id === 'promos') {
                isInactive = isComponentInactive('FeaturedPromosInline') || isComponentInactive('FeaturedPromosTitlesOnly');
              } else if (item.componentType) {
                isInactive = isComponentInactive(item.componentType as ComponentType);
              }
              
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-2 py-1 rounded transition-colors no-underline ${
                    isInactive
                      ? 'bg-gray-200 border-gray-400 text-gray-500 opacity-50 grayscale line-through cursor-not-allowed'
                      : 'bg-wire-100 hover:bg-wire-300 text-wire-700 hover:underline'
                  }`}
                  title={isInactive ? 'This component is inactive for this project' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* 01 Primary & Secondary Navigation */}
          <ShowcaseSection
            id="navigation"
            title="01 PrimarySecondaryNavigation"
            description="Top-level site navigation with logo, primary nav links, search, and utility links."
            isInactive={isComponentInactive('PrimarySecondaryNavigation')}
          >
          <div className="border border-wire-300 rounded overflow-hidden">
            <PrimarySecondaryNavigation />
          </div>
        </ShowcaseSection>

        {/* 02 Hero Image */}
        <ShowcaseSection
          id="hero"
          title="02 HeroImage"
          description="A prominent hero banner with heading, subheading, CTA, and optional image."
          isInactive={isComponentInactive('HeroImage')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Image on right (default)</h3>
              <div className="border border-wire-300 rounded overflow-hidden">
                <HeroImage />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Background image variant</h3>
              <div className="border border-wire-300 rounded overflow-hidden">
                <HeroImage
                  imagePosition="background"
                  heading="Join our mission"
                  subheading="Together we can make a difference in communities across the country."
                  tag="Featured"
                />
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* 03 Local Breadcrumbs */}
        <ShowcaseSection
          id="breadcrumbs"
          title="03 LocalBreadcrumbs"
          description="Breadcrumb navigation trail showing page hierarchy."
          isInactive={isComponentInactive('LocalBreadcrumbs')}
        >
          <div className="border border-wire-300 rounded overflow-hidden">
            <LocalBreadcrumbs />
          </div>
        </ShowcaseSection>

        {/* 04 Social Share Tag */}
        <ShowcaseSection
          id="social"
          title="04 SocialShareTag"
          description="Social media sharing buttons for the current page."
          isInactive={isComponentInactive('SocialShareTag')}
        >
          <div className="bg-wire-50 border border-wire-300 rounded p-4">
            <SocialShareTag />
          </div>
        </ShowcaseSection>

        {/* 05 Text Editor */}
        <ShowcaseSection
          id="text-editor"
          title="05 TextEditor"
          description="Rich text content block for body copy, lists, and inline elements."
          isInactive={isComponentInactive('TextEditor')}
        >
          <div className="bg-wire-50 border border-wire-300 rounded p-6">
            <TextEditor heading="About our work" />
          </div>
        </ShowcaseSection>

        {/* 06 Local Side Navigation */}
        <ShowcaseSection
          id="side-nav"
          title="06 LocalSideNavigation + TextWithSideNav"
          description="Side menu for navigating sections within a page or section."
          isInactive={isComponentInactive('LocalSideNavigation') || isComponentInactive('TextWithSideNav')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Standalone side navigation</h3>
              <div className="max-w-xs">
                <LocalSideNavigation />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Combined with text content</h3>
              <div className="bg-wire-50 border border-wire-300 rounded p-6">
                <TextWithSideNav />
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* 07 Accordion Inline */}
        <ShowcaseSection
          id="accordion"
          title="07 AccordionInline"
          description="Expandable/collapsible content sections for FAQ-style content."
          isInactive={isComponentInactive('AccordionInline')}
        >
          <AccordionInline heading="Frequently Asked Questions" />
        </ShowcaseSection>

        {/* 08 Call to Action Inline */}
        <ShowcaseSection
          id="cta"
          title="08 CallToActionInline"
          description="A prominent call-to-action block encouraging user action."
          isInactive={isComponentInactive('CallToActionInline')}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Default variant</h3>
              <CallToActionInline
                heading="Ready to make a difference?"
                description="Join thousands of supporters helping communities thrive."
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Highlighted variant</h3>
              <CallToActionInline
                variant="highlighted"
                heading="Emergency appeal"
                description="Help us respond to the crisis."
                primaryLabel="Donate now"
                secondaryLabel="Learn more"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Minimal variant</h3>
              <CallToActionInline
                variant="minimal"
                heading="Stay updated"
                description="Subscribe to our newsletter."
                primaryLabel="Subscribe"
              />
            </div>
          </div>
        </ShowcaseSection>

        {/* 09 Embed Inline */}
        <ShowcaseSection
          id="embed"
          title="09 EmbedInline"
          description="Placeholder for embedded content like videos, maps, or external forms."
          isInactive={isComponentInactive('EmbedInline')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Video embed</h3>
              <EmbedInline embedType="video" caption="Our latest campaign video" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Map embed</h3>
              <EmbedInline embedType="map" caption="Find us on the map" />
            </div>
          </div>
        </ShowcaseSection>

        {/* 10 Featured Promos */}
        <ShowcaseSection
          id="promos"
          title="10 FeaturedPromosInline + FeaturedPromosTitlesOnly"
          description="Grid of promotional cards with optional images and metadata."
          isInactive={isComponentInactive('FeaturedPromosInline') || isComponentInactive('FeaturedPromosTitlesOnly')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Cards with images (3 columns)</h3>
              <FeaturedPromosInline heading="Latest news" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Titles only list</h3>
              <FeaturedPromosTitlesOnly heading="More stories" />
            </div>
          </div>
        </ShowcaseSection>

        {/* 11 Form Inline */}
        <ShowcaseSection
          id="form"
          title="11 FormInline"
          description="A form component for contact forms, sign-ups, etc."
          isInactive={isComponentInactive('FormInline')}
        >
          <div className="max-w-lg">
            <FormInline
              heading="Get in touch"
              description="We'd love to hear from you. Fill out the form below and we'll get back to you soon."
            />
          </div>
        </ShowcaseSection>

        {/* 12 Information Overview */}
        <ShowcaseSection
          id="info-overview"
          title="12 InformationOverviewInline"
          description="A list or grid of information items with titles and optional descriptions."
          isInactive={isComponentInactive('InformationOverviewInline')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">List layout</h3>
              <InformationOverviewInline heading="Quick links" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Grid layout</h3>
              <InformationOverviewInline
                heading="Our services"
                layout="grid"
                items={[
                  { id: '1', title: 'Counselling', description: 'Professional support when you need it' },
                  { id: '2', title: 'Housing', description: 'Help finding safe accommodation' },
                  { id: '3', title: 'Employment', description: 'Job training and placement services' },
                  { id: '4', title: 'Legal advice', description: 'Free legal consultations' },
                ]}
              />
            </div>
          </div>
        </ShowcaseSection>

        {/* 13 Gallery Inline */}
        <ShowcaseSection
          id="gallery"
          title="13 GalleryInline"
          description="An image gallery grid with optional captions."
          isInactive={isComponentInactive('GalleryInline')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Standard gallery (3 columns)</h3>
              <GalleryInline heading="Photo gallery" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">With captions (4 columns)</h3>
              <GalleryInline columns={4} showCaptions />
            </div>
          </div>
        </ShowcaseSection>

        {/* 14 Media Image */}
        <ShowcaseSection
          id="media-image"
          title="14 MediaImage"
          description="A single image component with optional caption and layout options."
          isInactive={isComponentInactive('MediaImage')}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">16:9 aspect ratio</h3>
              <MediaImage caption="A beautiful landscape" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Square</h3>
              <MediaImage aspectRatio="1:1" caption="Profile photo" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">4:3 aspect ratio</h3>
              <MediaImage aspectRatio="4:3" caption="Event photo" />
            </div>
          </div>
        </ShowcaseSection>

        {/* 15 Media Video */}
        <ShowcaseSection
          id="media-video"
          title="15 MediaVideo"
          description="A video player placeholder component."
          isInactive={isComponentInactive('MediaVideo')}
        >
          <div className="max-w-2xl">
            <MediaVideo
              title="Our impact in 2024"
              caption="Watch our annual review video to see the difference we've made together."
            />
          </div>
        </ShowcaseSection>

        {/* 16 On Page Contents Index */}
        <ShowcaseSection
          id="contents-index"
          title="16 OnPageContentsIndex"
          description="A table of contents for navigating long-form content pages."
          isInactive={isComponentInactive('OnPageContentsIndex')}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Default style</h3>
              <OnPageContentsIndex />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Bordered style</h3>
              <OnPageContentsIndex variant="bordered" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Compact style</h3>
              <OnPageContentsIndex variant="compact" />
            </div>
          </div>
        </ShowcaseSection>

        {/* 17 Quote Inline */}
        <ShowcaseSection
          id="quote"
          title="17 QuoteInline"
          description="A blockquote component for testimonials and pull quotes."
          isInactive={isComponentInactive('QuoteInline')}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Default style</h3>
              <QuoteInline />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Large style</h3>
              <QuoteInline
                variant="large"
                quote="This organisation changed my life. I couldn't have made it through without their support."
                attribution="Sarah Johnson"
                role="Programme participant"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Bordered style</h3>
              <QuoteInline
                variant="bordered"
                quote="The team went above and beyond to help our community recover."
                attribution="Community Leader"
              />
            </div>
          </div>
        </ShowcaseSection>

        {/* 18 Download Inline */}
        <ShowcaseSection
          id="download"
          title="18 DownloadInline"
          description="A list of downloadable files with file type and size information."
          isInactive={isComponentInactive('DownloadInline')}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">List layout</h3>
              <DownloadInline heading="Resources & downloads" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-wire-600 mb-2">Grid layout</h3>
              <DownloadInline
                heading="Policy documents"
                layout="grid"
                items={[
                  { id: '1', label: 'Privacy Policy', fileType: 'PDF', fileSize: '120 KB' },
                  { id: '2', label: 'Terms of Service', fileType: 'PDF', fileSize: '85 KB' },
                  { id: '3', label: 'Cookie Policy', fileType: 'PDF', fileSize: '64 KB' },
                ]}
              />
            </div>
          </div>
        </ShowcaseSection>

        {/* 19 Footer Navigation */}
        <ShowcaseSection
          id="footer"
          title="19 FooterNavigation"
          description="Site footer with navigation links, contact info, and legal text."
          isInactive={project && !activeComponents.includes('FooterNavigation')}
        >
          <div className="border border-wire-300 rounded overflow-hidden">
            <FooterNavigation />
          </div>
        </ShowcaseSection>

        {/* Inactive Components Section */}
        {(project || activeComponentsOverride) && showInactive && inactiveComponents.length > 0 && (
          <div className="mt-16 pt-8 border-t-4 border-red-300">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-red-700 mb-2">
                Inactive Components
              </h2>
              <p className="text-red-600">
                These components are not available for this project. They appear here for reference and can be enabled in Project Settings.
              </p>
            </div>
            
            {/* Render inactive components grouped by category */}
            {categories.map((category) => {
              const categoryComponents = getComponentsByCategory(category)
                .filter(c => inactiveComponents.includes(c.type));
              
              if (categoryComponents.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h3 className="text-xl font-semibold text-red-800 mb-4">{category}</h3>
                  <div className="space-y-8">
                    {categoryComponents.map((info) => {
                      // Map component type to showcase section
                      // For now, show a placeholder - we'd need to import and render each component
                      return (
                        <div key={info.type} className="bg-red-50/50 border-2 border-red-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-red-800 mb-2">{info.label}</h4>
                          <p className="text-red-600 text-sm mb-4">{info.description}</p>
                          <p className="text-xs text-red-500 italic">
                            Component preview not available (inactive)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Showcase Footer */}
      <footer className="bg-wire-200 border-t border-wire-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-wire-600">
            Wireframe Component Library • Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WireframeShowcase;

