# Wireframe Component Library

Low-fidelity pagebuilder wireframe components for charity websites built with React, TypeScript, and Tailwind CSS.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Components

### Navigation Components
| Component | Description |
|-----------|-------------|
| `PrimarySecondaryNavigation` | Top-level site navigation with logo, primary nav links, search, and utility links |
| `LocalBreadcrumbs` | Breadcrumb navigation trail showing page hierarchy |
| `LocalSideNavigation` | Side menu for navigating sections within a page |
| `FooterNavigation` | Site footer with navigation links, contact info, and legal text |

### Hero & Layout Components
| Component | Description |
|-----------|-------------|
| `HeroImage` | Prominent hero banner with heading, subheading, CTA, and optional image |
| `LayoutShell` | Page shell component that wraps content with header and footer |
| `TextWithSideNav` | Layout combining text content with side navigation |

### Content Components
| Component | Description |
|-----------|-------------|
| `TextEditor` | Rich text content block for body copy, lists, and inline elements |
| `AccordionInline` | Expandable/collapsible content sections for FAQ-style content |
| `QuoteInline` | Blockquote component for testimonials and pull quotes |

### Media Components
| Component | Description |
|-----------|-------------|
| `MediaImage` | Single image component with optional caption and layout options |
| `MediaVideo` | Video player placeholder component |
| `EmbedInline` | Placeholder for embedded content (videos, maps, forms) |
| `GalleryInline` | Image gallery grid with optional captions |

### Promo & Feature Components
| Component | Description |
|-----------|-------------|
| `FeaturedPromosInline` | Grid of promotional cards with images and metadata |
| `FeaturedPromosTitlesOnly` | Compact list-style variant of featured promos |
| `CallToActionInline` | Prominent call-to-action block |

### Form & Interactive Components
| Component | Description |
|-----------|-------------|
| `FormInline` | Form component for contact forms, sign-ups, etc. |

### Information Components
| Component | Description |
|-----------|-------------|
| `InformationOverviewInline` | List or grid of information items |
| `OnPageContentsIndex` | Table of contents for long-form pages |
| `DownloadInline` | List of downloadable files with file type and size |

### Social Components
| Component | Description |
|-----------|-------------|
| `SocialShareTag` | Social media sharing buttons |

## File Structure

```
src/
├── components/
│   └── wireframe/
│       ├── index.ts                    # Barrel export
│       ├── PrimarySecondaryNavigation.tsx
│       ├── HeroImage.tsx
│       ├── LocalBreadcrumbs.tsx
│       ├── SocialShareTag.tsx
│       ├── TextEditor.tsx
│       ├── LocalSideNavigation.tsx
│       ├── TextWithSideNav.tsx
│       ├── AccordionInline.tsx
│       ├── CallToActionInline.tsx
│       ├── EmbedInline.tsx
│       ├── FeaturedPromosInline.tsx
│       ├── FeaturedPromosTitlesOnly.tsx
│       ├── FormInline.tsx
│       ├── InformationOverviewInline.tsx
│       ├── GalleryInline.tsx
│       ├── MediaImage.tsx
│       ├── MediaVideo.tsx
│       ├── OnPageContentsIndex.tsx
│       ├── QuoteInline.tsx
│       ├── DownloadInline.tsx
│       ├── FooterNavigation.tsx
│       └── LayoutShell.tsx
├── pages/
│   └── WireframeShowcase.tsx           # Component showcase page
├── App.tsx
├── main.tsx
└── index.css
```

## Usage Example

```tsx
import { 
  HeroImage, 
  TextEditor, 
  CallToActionInline,
  LayoutShell 
} from './components/wireframe';

function MyPage() {
  return (
    <LayoutShell>
      <HeroImage 
        heading="Welcome to our charity"
        subheading="Making a difference together"
        ctaLabel="Get involved"
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TextEditor heading="Our mission" />
        <CallToActionInline 
          heading="Ready to help?"
          primaryLabel="Donate now"
        />
      </div>
    </LayoutShell>
  );
}
```

## Design Principles

- **Wireframe aesthetic**: Grey color palette, simple borders, placeholder shapes
- **Mobile-first**: Responsive layouts using Tailwind's responsive utilities
- **Accessible**: Semantic HTML, ARIA attributes, keyboard navigation
- **Composable**: Self-contained components with sensible defaults
- **Customizable**: Props for all user-visible text and key structural options


