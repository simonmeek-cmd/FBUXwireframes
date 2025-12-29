import React from 'react';
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
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  id,
  title,
  description,
  children,
}) => (
  <section id={id} className="mb-16">
    <div className="mb-6 pb-4 border-b-2 border-wire-300">
      <h2 className="text-2xl font-bold text-wire-800">{title}</h2>
      <p className="text-wire-600 mt-1">{description}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

interface WireframeShowcaseProps {
  activeComponentsOverride?: ComponentType[];
}

/**
 * WireframeShowcase
 * A page that renders all wireframe components for visual QA and documentation.
 * If activeComponentsOverride is provided, only those components will be shown.
 */
export const WireframeShowcase: React.FC<WireframeShowcaseProps> = ({ activeComponentsOverride }) => {
  return (
    <div className="min-h-screen bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Wireframe Component Library</h1>
          <p className="text-wire-300">
            Low-fidelity pagebuilder components for charity websites
          </p>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="bg-wire-200 border-b border-wire-300 py-4 px-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { id: 'navigation', label: '01 Navigation' },
              { id: 'hero', label: '02 Hero' },
              { id: 'breadcrumbs', label: '03 Breadcrumbs' },
              { id: 'social', label: '04 Social Share' },
              { id: 'text-editor', label: '05 Text Editor' },
              { id: 'side-nav', label: '06 Side Nav' },
              { id: 'accordion', label: '07 Accordion' },
              { id: 'cta', label: '08 CTA' },
              { id: 'embed', label: '09 Embed' },
              { id: 'promos', label: '10 Featured Promos' },
              { id: 'form', label: '11 Form' },
              { id: 'info-overview', label: '12 Info Overview' },
              { id: 'gallery', label: '13 Gallery' },
              { id: 'media-image', label: '14 Media Image' },
              { id: 'media-video', label: '15 Media Video' },
              { id: 'contents-index', label: '16 Contents Index' },
              { id: 'quote', label: '17 Quote' },
              { id: 'download', label: '18 Download' },
              { id: 'footer', label: '19 Footer' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-2 py-1 bg-wire-100 hover:bg-wire-300 rounded text-wire-700 transition-colors no-underline hover:underline"
              >
                {item.label}
              </a>
            ))}
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
        >
          <AccordionInline heading="Frequently Asked Questions" />
        </ShowcaseSection>

        {/* 08 Call to Action Inline */}
        <ShowcaseSection
          id="cta"
          title="08 CallToActionInline"
          description="A prominent call-to-action block encouraging user action."
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
        >
          <div className="border border-wire-300 rounded overflow-hidden">
            <FooterNavigation />
          </div>
        </ShowcaseSection>
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

