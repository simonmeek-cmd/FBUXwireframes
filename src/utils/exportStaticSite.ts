import JSZip from 'jszip';
import type { Project, Page, PlacedComponent } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';

// Generate the CSS for the wireframe styles
const generateCSS = (): string => {
  return `
/* Wireframe Static Site Styles */
:root {
  --wire-50: #f0f4f8;
  --wire-100: #d9e2ec;
  --wire-200: #bcccdc;
  --wire-300: #9fb3c8;
  --wire-400: #829ab1;
  --wire-500: #627d98;
  --wire-600: #486581;
  --wire-700: #334e68;
  --wire-800: #243b53;
  --wire-900: #102a43;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--wire-100);
  color: var(--wire-800);
  line-height: 1.5;
}

a {
  color: var(--wire-700);
  text-decoration: underline;
}

a:hover {
  color: var(--wire-900);
}

.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.site-header {
  background-color: var(--wire-800);
  color: var(--wire-100);
}

.header-secondary {
  background-color: var(--wire-900);
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.header-secondary .container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.header-secondary a {
  color: var(--wire-300);
  text-decoration: none;
}

.header-secondary a:hover {
  color: var(--wire-100);
}

.header-primary {
  padding: 1rem 0;
}

.header-primary .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--wire-100);
  text-decoration: none;
}

.primary-nav {
  display: flex;
  gap: 1.5rem;
}

.primary-nav a {
  color: var(--wire-200);
  text-decoration: none;
  font-weight: 500;
}

.primary-nav a:hover {
  color: var(--wire-100);
}

.header-ctas {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: var(--wire-600);
  color: white;
}

.btn-primary:hover {
  background-color: var(--wire-700);
  color: white;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--wire-400);
  color: var(--wire-200);
}

.btn-secondary:hover {
  background-color: var(--wire-700);
  color: white;
}

/* Footer */
.site-footer {
  background-color: var(--wire-800);
  color: var(--wire-200);
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: var(--wire-100);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--wire-300);
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--wire-100);
}

.footer-bottom {
  border-top: 1px solid var(--wire-700);
  padding-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--wire-400);
}

/* Hero */
.hero {
  background-color: var(--wire-200);
  padding: 3rem 0;
  border-bottom: 1px solid var(--wire-300);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--wire-800);
}

.hero p {
  font-size: 1.125rem;
  color: var(--wire-600);
  max-width: 600px;
}

/* Content sections */
.section {
  padding: 2rem 0;
}

.section-light {
  background-color: var(--wire-100);
}

.section-white {
  background-color: var(--wire-50);
}

/* Cards grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--wire-50);
  border: 1px solid var(--wire-200);
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-image {
  background-color: var(--wire-200);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wire-400);
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin-bottom: 0.5rem;
}

.card-content p {
  color: var(--wire-600);
  font-size: 0.875rem;
}

/* Image placeholder */
.image-placeholder {
  background-color: var(--wire-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wire-400);
  font-size: 0.875rem;
}

/* Utility classes */
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.text-sm { font-size: 0.875rem; }
.text-muted { color: var(--wire-500); }
.font-bold { font-weight: 700; }

/* Responsive */
@media (max-width: 768px) {
  .header-primary .container {
    flex-wrap: wrap;
  }
  
  .primary-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    padding-top: 1rem;
  }
  
  .hero h1 {
    font-size: 1.75rem;
  }
}
`;
};

// Generate navigation HTML
const generateNavHTML = (config: NavigationConfig, pages: Page[], currentPageId: string): string => {
  const getPageUrl = (href: string): string => {
    // Try to match href to a page
    const page = pages.find(p => 
      `/${p.name.toLowerCase().replace(/\s+/g, '-')}` === href ||
      p.name.toLowerCase() === href.replace('/', '').replace(/-/g, ' ')
    );
    if (page) {
      return page.id === pages[0]?.id ? 'index.html' : `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    }
    return href === '/' ? 'index.html' : '#';
  };

  let html = '<header class="site-header">';
  
  // Secondary nav
  if (config.showSecondaryNav && config.secondaryItems.length > 0) {
    html += '<div class="header-secondary"><div class="container">';
    config.secondaryItems.forEach(item => {
      html += `<a href="${getPageUrl(item.href || '#')}">${item.label}</a>`;
    });
    html += '</div></div>';
  }
  
  // Primary nav
  html += '<div class="header-primary"><div class="container">';
  html += `<a href="index.html" class="logo">${config.logoText}</a>`;
  html += '<nav class="primary-nav">';
  config.primaryItems.forEach(item => {
    html += `<a href="${getPageUrl(item.href || '#')}">${item.label}</a>`;
  });
  html += '</nav>';
  
  // CTAs
  if (config.ctas.length > 0) {
    html += '<div class="header-ctas">';
    config.ctas.forEach(cta => {
      const btnClass = cta.variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
      html += `<a href="${getPageUrl(cta.href || '#')}" class="${btnClass}">${cta.label}</a>`;
    });
    html += '</div>';
  }
  
  html += '</div></div></header>';
  return html;
};

// Generate footer HTML
const generateFooterHTML = (config: FooterConfig, pages: Page[]): string => {
  let html = '<footer class="site-footer"><div class="container">';
  html += '<div class="footer-content">';
  
  // Logo/tagline section
  html += '<div class="footer-section">';
  html += `<div class="logo mb-4">${config.logoText}</div>`;
  if (config.tagline) {
    html += `<p class="text-sm">${config.tagline}</p>`;
  }
  html += '</div>';
  
  // Nav sections
  config.sections.forEach(section => {
    html += '<div class="footer-section">';
    html += `<h3>${section.title}</h3>`;
    html += '<ul>';
    section.links.forEach(link => {
      html += `<li><a href="${link.href || '#'}">${link.label}</a></li>`;
    });
    html += '</ul></div>';
  });
  
  html += '</div>';
  
  // Bottom
  html += '<div class="footer-bottom">';
  html += `<p>&copy; ${new Date().getFullYear()} ${config.logoText}. All rights reserved.</p>`;
  html += '</div>';
  
  html += '</div></footer>';
  return html;
};

// Generate component HTML (simplified version for static export)
const generateComponentHTML = (component: PlacedComponent): string => {
  const props = component.props as Record<string, unknown>;
  
  switch (component.type) {
    case 'HeroImage':
      return `
        <section class="hero">
          <div class="container">
            <h1>${props.heading || 'Page Title'}</h1>
            <p>${props.subheading || ''}</p>
            ${props.ctaLabel ? `<a href="#" class="btn btn-primary" style="margin-top: 1rem;">${props.ctaLabel}</a>` : ''}
          </div>
        </section>
      `;
      
    case 'HomepageHero':
      return `
        <section class="hero" style="padding: 4rem 0;">
          <div class="container">
            <h1 style="font-size: 3rem;">${props.heading || 'Welcome'}</h1>
            ${props.ctaLabel ? `<a href="#" class="btn btn-primary" style="margin-top: 1.5rem;">${props.ctaLabel}</a>` : ''}
          </div>
        </section>
      `;
      
    case 'TextEditor':
      return `
        <section class="section section-white">
          <div class="container">
            ${props.heading ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            <div>${props.content || '<p>Content goes here...</p>'}</div>
          </div>
        </section>
      `;
      
    case 'ListingPage': {
      const listingType = (props.listingType as string) || 'news';
      const itemCount = typeof props.itemCount === 'string' ? parseInt(props.itemCount, 10) : (props.itemCount as number) || 9;
      const showContactInfo = props.showContactInfo as boolean;
      
      // Build cards
      let cardsHtml = '';
      for (let i = 0; i < itemCount; i++) {
        const title = i === 0 ? (props.featured1Title || 'Featured Item') : 
                      i === 1 ? (props.featured2Title || 'Second Item') :
                      i === 2 ? (props.featured3Title || 'Third Item') : 'Item Title';
        const typeLabel = i === 0 ? (props.featured1TypeLabel || 'Type') :
                          i === 1 ? (props.featured2TypeLabel || 'Type') :
                          i === 2 ? (props.featured3TypeLabel || 'Type') : 'Type';
        const date = i === 0 ? (props.featured1Date || '01/01/2026') :
                     i === 1 ? (props.featured2Date || '01/01/2026') :
                     i === 2 ? (props.featured3Date || '01/01/2026') : '01/01/2026';
        const excerpt = i === 0 ? props.featured1Excerpt :
                        i === 1 ? props.featured2Excerpt :
                        i === 2 ? props.featured3Excerpt : null;
        
        if (listingType === 'events') {
          cardsHtml += `
            <div class="card">
              <div class="card-image">[ Image ]</div>
              <div class="card-content">
                <span class="text-sm text-muted">${typeLabel}</span>
                <h3>${title}</h3>
                <p class="text-sm"><strong>Date:</strong> ${date}</p>
                <p class="text-sm"><strong>Time:</strong> 18:00 - 20:00</p>
                <p class="text-sm"><strong>Location:</strong> Venue Name</p>
              </div>
            </div>
          `;
        } else {
          cardsHtml += `
            <div class="card">
              <div class="card-image">[ Image ]</div>
              <div class="card-content">
                <span class="text-sm text-muted">${typeLabel}</span>
                <h3>${title}</h3>
                <p class="text-sm text-muted">${date}</p>
                ${excerpt ? `<p class="text-sm" style="color: var(--wire-600); margin-top: 0.5rem;">${excerpt}</p>` : ''}
              </div>
            </div>
          `;
        }
      }
      
      // Pagination
      const totalPages = Math.ceil(itemCount / 9);
      let paginationHtml = '';
      if (totalPages > 1) {
        paginationHtml = '<div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;">';
        paginationHtml += '<button class="btn btn-secondary">←</button>';
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
          paginationHtml += `<button class="btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}">${i}</button>`;
        }
        paginationHtml += '<button class="btn btn-secondary">→</button>';
        paginationHtml += '</div>';
      }
      
      // Filter labels
      const filter1Label = (props.filter1Label as string) || 'Type';
      const filter2Label = (props.filter2Label as string) || 'Topic';
      
      return `
        <section class="hero">
          <div class="container">
            <h1>${props.title || listingType.charAt(0).toUpperCase() + listingType.slice(1)}</h1>
            ${props.introCopy ? `<div style="margin-bottom: 1rem; max-width: 600px;">${props.introCopy}</div>` : ''}
            ${showContactInfo ? `
              <div style="display: flex; gap: 1.5rem; font-size: 0.875rem; color: var(--wire-600);">
                <span><strong>Email:</strong> ${props.contactEmail || 'press@organisation.org.uk'}</span>
                <span><strong>Phone:</strong> ${props.contactPhone || '020 123 456 789'}</span>
              </div>
            ` : ''}
          </div>
        </section>
        <section style="background: var(--wire-50); border-bottom: 1px solid var(--wire-200); padding: 1rem 0;">
          <div class="container">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <span style="font-weight: 500; color: var(--wire-700);">Filters</span>
              <select style="padding: 0.5rem; border: 1px solid var(--wire-300); border-radius: 0.25rem; min-width: 150px;">
                <option>${filter1Label}: Any</option>
              </select>
              <select style="padding: 0.5rem; border: 1px solid var(--wire-300); border-radius: 0.25rem; min-width: 150px;">
                <option>${filter2Label}: Any</option>
              </select>
              ${listingType === 'events' ? `
                <select style="padding: 0.5rem; border: 1px solid var(--wire-300); border-radius: 0.25rem; min-width: 150px;">
                  <option>Location: Any</option>
                </select>
              ` : ''}
              <button class="btn btn-primary">Filter</button>
              <a href="#" style="color: var(--wire-600); text-decoration: underline;">Clear filters</a>
            </div>
          </div>
        </section>
        <section class="section section-light">
          <div class="container">
            <div class="card-grid">${cardsHtml}</div>
            ${paginationHtml}
          </div>
        </section>
      `;
    }
      
    case 'DetailPage': {
      const detailType = (props.detailType as string) || 'news';
      const showHeroImage = props.showHeroImage !== false;
      const showCtaButton = props.showCtaButton as boolean;
      
      // Build sidebar content based on type
      let sidebarHtml = '<aside style="width: 280px; flex-shrink: 0;">';
      sidebarHtml += '<div style="background: var(--wire-50); border: 1px solid var(--wire-200); border-radius: 0.5rem; padding: 1.5rem;">';
      
      if (detailType === 'events') {
        sidebarHtml += `
          <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--wire-200);">
            <p style="margin-bottom: 0.5rem;"><strong>Date:</strong> ${props.eventDate || '01/01/2026'}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Time:</strong> ${props.eventTime || '18:00 - 20:00'}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${props.eventLocation || 'Venue Name'}</p>
            <p><strong>Fee:</strong> ${props.registrationFee || '£8.00'}</p>
          </div>
        `;
      } else {
        sidebarHtml += `
          <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--wire-200);">
            <p style="margin-bottom: 0.5rem;"><strong>Published:</strong> ${props.publishedDate || '01/01/2026'}</p>
            <p><strong>Author:</strong> ${props.author || 'Author Name'}</p>
          </div>
        `;
      }
      
      sidebarHtml += `
        <h4 style="font-size: 0.875rem; margin-bottom: 0.75rem;">About this ${detailType === 'events' ? 'event' : detailType === 'resources' ? 'resource' : 'article'}</h4>
        <span style="display: inline-block; background: var(--wire-200); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin-bottom: 0.75rem;">${props.typeLabel || 'Type'}</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <a href="#" style="font-size: 0.75rem; color: var(--wire-600);">Topic 1</a>
          <a href="#" style="font-size: 0.75rem; color: var(--wire-600);">Topic 2</a>
          <a href="#" style="font-size: 0.75rem; color: var(--wire-600);">Topic 3</a>
        </div>
      `;
      
      if (detailType === 'resources') {
        sidebarHtml += `
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--wire-200);">
            <h4 style="font-size: 0.875rem; margin-bottom: 0.75rem;">Downloads</h4>
            <a href="#" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--wire-100); border-radius: 0.25rem; text-decoration: none; color: var(--wire-700); margin-bottom: 0.5rem;">
              📄 <span>Document.pdf</span> <span style="font-size: 0.75rem; color: var(--wire-500);">(2.4MB)</span>
            </a>
          </div>
        `;
      }
      
      sidebarHtml += '</div></aside>';
      
      return `
        <section class="hero">
          <div class="container">
            <div style="display: flex; gap: 2rem; align-items: flex-start;">
              <div style="flex: 1;">
                <h1>${props.title || 'Article Title'}</h1>
                ${props.introCopy ? `<div style="margin-top: 1rem; color: var(--wire-600);">${props.introCopy}</div>` : ''}
                ${showCtaButton ? `<a href="#" class="btn btn-primary" style="margin-top: 1rem;">${props.ctaButtonLabel || 'Register'}</a>` : ''}
              </div>
              ${showHeroImage ? `
                <div style="width: 180px; flex-shrink: 0;">
                  <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.5rem;">[ Image ]</div>
                </div>
              ` : ''}
            </div>
          </div>
        </section>
        <nav style="background: var(--wire-50); border-bottom: 1px solid var(--wire-200); padding: 0.75rem 0;">
          <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.875rem; color: var(--wire-600);">
              <a href="index.html" style="color: var(--wire-600);">Home</a> / 
              <a href="#" style="color: var(--wire-600);">${detailType.charAt(0).toUpperCase() + detailType.slice(1)}</a> / 
              <span>${props.title || 'Article'}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <span style="font-size: 0.875rem; color: var(--wire-500);">Share:</span>
              <a href="#" style="color: var(--wire-600);">𝕏</a>
              <a href="#" style="color: var(--wire-600);">f</a>
              <a href="#" style="color: var(--wire-600);">in</a>
            </div>
          </div>
        </nav>
        <section class="section section-light">
          <div class="container">
            <div style="display: flex; gap: 2rem;">
              <div style="flex: 1;">
                <div style="background: var(--wire-50); border: 2px dashed var(--wire-300); border-radius: 0.5rem; padding: 3rem; text-align: center; margin-bottom: 2rem;">
                  <p style="color: var(--wire-500);">[ Article content area ]</p>
                  <p style="font-size: 0.875rem; color: var(--wire-400);">Flexible components: text, images, quotes, etc.</p>
                </div>
              </div>
              ${sidebarHtml}
            </div>
          </div>
        </section>
      `;
    }
      
    case 'SearchResultsPage': {
      const resultCount = typeof props.resultCount === 'string' ? parseInt(props.resultCount, 10) : (props.resultCount as number) || 10;
      let resultsHtml = '';
      for (let i = 0; i < resultCount; i++) {
        const title = i === 0 ? (props.result1Title || "First Search Result") : 
                      i === 1 ? (props.result2Title || "Second Search Result") :
                      i === 2 ? (props.result3Title || "Third Search Result") : "Search Result Item";
        const date = i === 0 ? (props.result1Date || "01/01/2026") :
                     i === 1 ? (props.result2Date || "01/01/2026") :
                     i === 2 ? (props.result3Date || "01/01/2026") : "01/01/2026";
        const excerpt = i === 0 ? (props.result1Excerpt || "This search result contains relevant information matching your query.") :
                        i === 1 ? (props.result2Excerpt || "Another result with matching content from across the site.") :
                        i === 2 ? (props.result3Excerpt || "A third relevant result showing related content.") :
                        "Search result excerpt showing a preview of the matching content.";
        resultsHtml += `
          <article style="background: var(--wire-50); border: 1px solid var(--wire-200); border-radius: 0.5rem; padding: 1rem; display: flex; gap: 1.5rem;">
            <div style="flex: 1;">
              <a href="#" style="text-decoration: none;"><h3 style="margin-bottom: 0.25rem; color: var(--wire-800);">${title}</h3></a>
              <p style="font-size: 0.875rem; color: var(--wire-500); margin-bottom: 0.5rem;">${date}</p>
              <p style="color: var(--wire-600); font-size: 0.875rem;">${excerpt}</p>
            </div>
            <div class="image-placeholder" style="width: 140px; height: 100px; flex-shrink: 0; border-radius: 0.25rem;">[ Image ]</div>
          </article>
        `;
      }
      
      // Pagination
      const totalPages = Math.ceil(resultCount / 10);
      let paginationHtml = '';
      if (totalPages > 1) {
        paginationHtml = '<div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;">';
        paginationHtml += '<button class="btn btn-secondary">←</button>';
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
          paginationHtml += `<button class="btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}">${i}</button>`;
        }
        paginationHtml += '<button class="btn btn-secondary">→</button>';
        paginationHtml += '</div>';
      }
      
      return `
        <section class="hero">
          <div class="container">
            <h1>${props.title || 'Search result listing'}</h1>
            ${props.introCopy ? `<div style="margin-bottom: 1rem; color: var(--wire-600); max-width: 600px;">${props.introCopy}</div>` : ''}
            <div style="display: flex; gap: 0.5rem; max-width: 500px; margin-top: 1rem;">
              <div style="flex: 1; position: relative;">
                <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--wire-400);">🔍</span>
                <input type="text" placeholder="${props.searchPlaceholder || 'Search'}" style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 1px solid var(--wire-300); border-radius: 0.25rem;">
              </div>
              <button class="btn btn-primary">${props.searchButtonLabel || 'Search'}</button>
            </div>
          </div>
        </section>
        <nav style="background: var(--wire-50); border-bottom: 1px solid var(--wire-200); padding: 0.75rem 0;">
          <div class="container">
            <div style="font-size: 0.875rem; color: var(--wire-600);">
              <a href="index.html" style="color: var(--wire-600);">Home</a> / 
              <span>Search Results</span>
            </div>
          </div>
        </nav>
        <section class="section section-light">
          <div class="container">
            <div style="display: flex; flex-direction: column; gap: 1rem;">${resultsHtml}</div>
            ${paginationHtml}
          </div>
        </section>
      `;
    }
      
    case 'HomepageSignposts':
      return `
        <section class="section section-light">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div class="card-grid">
              <div class="card"><div class="card-content"><h3>Quick Link 1</h3></div></div>
              <div class="card"><div class="card-content"><h3>Quick Link 2</h3></div></div>
              <div class="card"><div class="card-content"><h3>Quick Link 3</h3></div></div>
              <div class="card"><div class="card-content"><h3>Quick Link 4</h3></div></div>
            </div>
          </div>
        </section>
      `;
      
    case 'HomepageImpactOverview':
      return `
        <section class="section section-white">
          <div class="container">
            ${props.heading && props.showHeading !== false ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            ${props.introCopy && props.showIntro !== false ? `<p class="mb-6">${props.introCopy}</p>` : ''}
            <div class="card-grid">
              <div class="card" style="padding: 2rem; text-align: center;"><h3>Impact Stat</h3><p>28%</p></div>
              <div class="card" style="padding: 2rem;"><h3>Quote</h3><p>"Inspiring testimonial..."</p></div>
            </div>
          </div>
        </section>
      `;
      
    case 'HomepageContentFeed':
      return `
        <section class="section section-light">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div class="card-grid">
              <div class="card"><div class="card-image">[ Image ]</div><div class="card-content"><h3>Latest News</h3><p class="text-sm">01/01/2026</p></div></div>
              <div class="card"><div class="card-image">[ Image ]</div><div class="card-content"><h3>Upcoming Event</h3><p class="text-sm">15/01/2026</p></div></div>
              <div class="card"><div class="card-image">[ Image ]</div><div class="card-content"><h3>New Resource</h3><p class="text-sm">10/01/2026</p></div></div>
            </div>
          </div>
        </section>
      `;

    case 'HomepageStats': {
      const statCount = typeof props.statCount === 'string' ? parseInt(props.statCount, 10) : (props.statCount as number) || 3;
      let statsHtml = '';
      const defaultStats = [
        { value: props.stat1Value || '1,234', label: props.stat1Label || 'People Helped' },
        { value: props.stat2Value || '£500k', label: props.stat2Label || 'Funds Raised' },
        { value: props.stat3Value || '50+', label: props.stat3Label || 'Volunteers' },
        { value: props.stat4Value || '100%', label: props.stat4Label || 'Commitment' },
      ];
      for (let i = 0; i < Math.min(statCount, 4); i++) {
        statsHtml += `
          <div class="card" style="padding: 2rem; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--wire-700);">${defaultStats[i].value}</div>
            <div style="color: var(--wire-600); margin-top: 0.5rem;">${defaultStats[i].label}</div>
          </div>
        `;
      }
      return `
        <section class="section section-light">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div class="card-grid" style="grid-template-columns: repeat(${statCount}, 1fr);">${statsHtml}</div>
          </div>
        </section>
      `;
    }

    case 'HomepageCTAs': {
      const ctaCount = typeof props.ctaCount === 'string' ? parseInt(props.ctaCount, 10) : (props.ctaCount as number) || 3;
      let ctasHtml = '';
      const defaultCTAs = [
        { title: props.cta1Title || 'Donate', description: props.cta1Description || 'Support our work with a donation', buttonLabel: props.cta1ButtonLabel || 'Give Now' },
        { title: props.cta2Title || 'Volunteer', description: props.cta2Description || 'Join our team of dedicated volunteers', buttonLabel: props.cta2ButtonLabel || 'Sign Up' },
        { title: props.cta3Title || 'Get Help', description: props.cta3Description || 'Access our services and support', buttonLabel: props.cta3ButtonLabel || 'Learn More' },
      ];
      for (let i = 0; i < Math.min(ctaCount, 3); i++) {
        ctasHtml += `
          <div class="card" style="padding: 2rem; display: flex; flex-direction: column;">
            <div class="card-image" style="height: 120px; margin: -2rem -2rem 1.5rem -2rem; border-radius: 0.5rem 0.5rem 0 0;">[ Image ]</div>
            <h3 style="margin-bottom: 0.5rem;">${defaultCTAs[i].title}</h3>
            <p style="flex: 1; color: var(--wire-600); margin-bottom: 1rem;">${defaultCTAs[i].description}</p>
            <a href="#" class="btn btn-primary">${defaultCTAs[i].buttonLabel}</a>
          </div>
        `;
      }
      return `
        <section class="section section-white">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div class="card-grid" style="grid-template-columns: repeat(${ctaCount}, 1fr);">${ctasHtml}</div>
          </div>
        </section>
      `;
    }

    case 'HomepageOptionalCopy':
      return `
        <section class="section section-white">
          <div class="container" style="max-width: 800px;">
            ${props.heading ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            <div style="color: var(--wire-600);">${props.content || '<p>Optional introductory copy about your organisation and mission.</p>'}</div>
          </div>
        </section>
      `;

    case 'AccordionInline': {
      const items = (props.items as Array<{title?: string; body?: string}>) || [
        { title: 'Accordion Item 1', body: 'Content for accordion item 1' },
        { title: 'Accordion Item 2', body: 'Content for accordion item 2' },
        { title: 'Accordion Item 3', body: 'Content for accordion item 3' },
      ];
      let accordionHtml = '';
      items.forEach((item, i) => {
        accordionHtml += `
          <div style="border: 1px solid var(--wire-200); border-radius: 0.25rem; margin-bottom: 0.5rem;">
            <div style="padding: 1rem; background: var(--wire-100); font-weight: 500;">${item.title || `Item ${i + 1}`}</div>
            <div style="padding: 1rem; color: var(--wire-600);">${item.body || 'Accordion content'}</div>
          </div>
        `;
      });
      return `
        <section class="section section-white">
          <div class="container">
            ${props.heading ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            ${accordionHtml}
          </div>
        </section>
      `;
    }

    case 'QuoteInline':
      return `
        <section class="section section-light">
          <div class="container" style="max-width: 800px;">
            <blockquote style="border-left: 4px solid var(--wire-400); padding-left: 1.5rem; margin: 0;">
              <p style="font-size: 1.25rem; font-style: italic; color: var(--wire-700); margin-bottom: 1rem;">"${props.quote || 'This is an inspiring quote that highlights the impact of our work.'}"</p>
              <footer style="color: var(--wire-500);">— ${props.attribution || 'Quote Attribution'}</footer>
            </blockquote>
          </div>
        </section>
      `;

    case 'CallToActionInline':
      return `
        <section class="section" style="background: var(--wire-700); color: white;">
          <div class="container" style="text-align: center; padding: 3rem 0;">
            <h2 style="margin-bottom: 1rem; color: white;">${props.heading || 'Take Action'}</h2>
            <p style="margin-bottom: 1.5rem; color: var(--wire-200);">${props.description || 'Join us in making a difference.'}</p>
            <a href="#" class="btn" style="background: white; color: var(--wire-700);">${props.buttonLabel || 'Get Involved'}</a>
          </div>
        </section>
      `;

    case 'FeaturedPromosInline': {
      const promoItems = (props.items as Array<{title?: string}>) || [
        { title: 'Featured Item 1' },
        { title: 'Featured Item 2' },
        { title: 'Featured Item 3' },
      ];
      let promosHtml = '';
      promoItems.forEach(item => {
        promosHtml += `
          <div class="card">
            <div class="card-image">[ Image ]</div>
            <div class="card-content">
              <h3>${item.title || 'Featured Item'}</h3>
              <p class="text-sm text-muted">Brief description of the featured item.</p>
            </div>
          </div>
        `;
      });
      return `
        <section class="section section-light">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div class="card-grid">${promosHtml}</div>
          </div>
        </section>
      `;
    }

    case 'FormInline':
      return `
        <section class="section section-white">
          <div class="container" style="max-width: 600px;">
            ${props.heading ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            <form style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.25rem; color: var(--wire-700);">Name</label>
                <input type="text" style="width: 100%; padding: 0.75rem; border: 1px solid var(--wire-300); border-radius: 0.25rem;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.25rem; color: var(--wire-700);">Email</label>
                <input type="email" style="width: 100%; padding: 0.75rem; border: 1px solid var(--wire-300); border-radius: 0.25rem;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.25rem; color: var(--wire-700);">Message</label>
                <textarea rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid var(--wire-300); border-radius: 0.25rem;"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">${props.submitLabel || 'Submit'}</button>
            </form>
          </div>
        </section>
      `;

    case 'GalleryInline':
      return `
        <section class="section section-light">
          <div class="container">
            ${props.heading ? `<h2 class="mb-6">${props.heading}</h2>` : ''}
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 1 ]</div>
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 2 ]</div>
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 3 ]</div>
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 4 ]</div>
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 5 ]</div>
              <div class="image-placeholder" style="aspect-ratio: 1; border-radius: 0.25rem;">[ Image 6 ]</div>
            </div>
          </div>
        </section>
      `;

    case 'MediaImage':
      return `
        <section class="section section-white">
          <div class="container">
            <div class="image-placeholder" style="aspect-ratio: 16/9; border-radius: 0.5rem;">[ Image: ${props.alt || 'Image description'} ]</div>
            ${props.caption ? `<p class="text-sm text-muted" style="margin-top: 0.5rem; text-align: center;">${props.caption}</p>` : ''}
          </div>
        </section>
      `;

    case 'MediaVideo':
      return `
        <section class="section section-white">
          <div class="container">
            <div class="image-placeholder" style="aspect-ratio: 16/9; border-radius: 0.5rem; position: relative;">
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
                <div style="width: 60px; height: 60px; background: var(--wire-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">▶</div>
              </div>
              [ Video ]
            </div>
          </div>
        </section>
      `;

    case 'EmbedInline':
      return `
        <section class="section section-white">
          <div class="container">
            <div class="image-placeholder" style="aspect-ratio: 16/9; border-radius: 0.5rem;">[ Embedded Content ]</div>
          </div>
        </section>
      `;

    case 'DownloadInline':
      return `
        <section class="section section-white">
          <div class="container">
            ${props.heading ? `<h2 class="mb-4">${props.heading}</h2>` : ''}
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <a href="#" style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--wire-100); border-radius: 0.25rem; text-decoration: none; color: var(--wire-700);">
                <span style="font-size: 1.5rem;">📄</span>
                <span style="flex: 1;">Document Name</span>
                <span class="text-sm text-muted">PDF (2.4MB)</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--wire-100); border-radius: 0.25rem; text-decoration: none; color: var(--wire-700);">
                <span style="font-size: 1.5rem;">📄</span>
                <span style="flex: 1;">Another Document</span>
                <span class="text-sm text-muted">PDF (1.2MB)</span>
              </a>
            </div>
          </div>
        </section>
      `;
      
    default:
      return `
        <section class="section section-white">
          <div class="container">
            <div class="image-placeholder" style="height: 200px; border-radius: 0.5rem;">[ ${component.type} Component ]</div>
          </div>
        </section>
      `;
  }
};

// Generate a default navigation if none configured
const generateDefaultNavHTML = (projectName: string, pages: Page[]): string => {
  let html = '<header class="site-header">';
  html += '<div class="header-primary"><div class="container">';
  html += `<a href="index.html" class="logo">${projectName}</a>`;
  html += '<nav class="primary-nav">';
  pages.slice(0, 6).forEach((page, index) => {
    const filename = index === 0 ? 'index.html' : `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    html += `<a href="${filename}">${page.name}</a>`;
  });
  html += '</nav>';
  html += '</div></div></header>';
  return html;
};

// Generate a default footer if none configured
const generateDefaultFooterHTML = (projectName: string): string => {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="logo mb-4">${projectName}</div>
            <p class="text-sm">Wireframe prototype</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
};

// Generate full HTML page
const generatePageHTML = (
  page: Page,
  project: Project,
  allPages: Page[],
  isIndex: boolean
): string => {
  const navHTML = project.navigationConfig 
    ? generateNavHTML(project.navigationConfig, allPages, page.id)
    : generateDefaultNavHTML(project.name, allPages);
    
  const footerHTML = project.footerConfig
    ? generateFooterHTML(project.footerConfig, allPages)
    : generateDefaultFooterHTML(project.name);
    
  const componentsHTML = page.components
    .sort((a, b) => a.order - b.order)
    .map(c => generateComponentHTML(c))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name} | ${project.name}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${navHTML}
  
  <main>
    ${componentsHTML || `
      <section class="hero">
        <div class="container">
          <h1>${page.name}</h1>
        </div>
      </section>
    `}
  </main>
  
  ${footerHTML}
</body>
</html>`;
};

// Main export function
export const exportStaticSite = async (project: Project): Promise<void> => {
  const zip = new JSZip();
  
  // Add CSS
  zip.file('styles.css', generateCSS());
  
  // Add HTML pages
  project.pages.forEach((page, index) => {
    const isIndex = index === 0;
    const filename = isIndex ? 'index.html' : `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    const html = generatePageHTML(page, project, project.pages, isIndex);
    zip.file(filename, html);
  });
  
  // Add a simple README
  zip.file('README.txt', `${project.name} Wireframes

Generated on ${new Date().toLocaleDateString()}

To deploy:
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. Get your shareable link!

Pages included:
${project.pages.map((p, i) => `- ${i === 0 ? 'index.html' : p.name.toLowerCase().replace(/\s+/g, '-') + '.html'} (${p.name})`).join('\n')}
`);
  
  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-wireframes.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export project data as JSON (for backup)
export const exportProjectJSON = (project: Project): void => {
  const data = JSON.stringify(project, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export all data as JSON (full backup)
export const exportAllDataJSON = (clients: { id: string; name: string; createdAt: string }[], projects: Project[]): void => {
  const data = JSON.stringify({ clients, projects, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wireframe-builder-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

