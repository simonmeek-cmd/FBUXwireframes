import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { Project, Page, PlacedComponent } from '../types/builder';

// Generate inline CSS for wireframe styling
const generateCSS = (): string => `
/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f1f5f9;
  color: #1e293b;
  line-height: 1.5;
}

/* Wireframe color palette */
:root {
  --wire-50: #f8fafc;
  --wire-100: #f1f5f9;
  --wire-200: #e2e8f0;
  --wire-300: #cbd5e1;
  --wire-400: #94a3b8;
  --wire-500: #64748b;
  --wire-600: #475569;
  --wire-700: #334155;
  --wire-800: #1e293b;
  --wire-900: #0f172a;
}

/* Link styles */
a {
  text-decoration: underline;
  text-underline-offset: 2px;
  color: inherit;
}

/* Basic utility classes */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--wire-50);
  min-height: 100vh;
}

.page-nav {
  background: var(--wire-200);
  padding: 1rem;
  border-bottom: 1px solid var(--wire-300);
}

.page-nav a {
  margin-right: 1rem;
  color: var(--wire-600);
}

.page-nav a:hover {
  color: var(--wire-800);
}
`;

// Generate component placeholder HTML
const generateComponentHTML = (component: PlacedComponent): string => {
  const { type, props } = component;
  
  // Generate simplified HTML representations of components
  switch (type) {
    case 'PrimarySecondaryNavigation':
      return `
        <header style="background: var(--wire-200); border-bottom: 1px solid var(--wire-300); padding: 1rem;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; color: var(--wire-600);">${props.logoText || 'LOGO'}</div>
            <nav style="display: flex; gap: 1rem;">
              <a href="#">About</a>
              <a href="#">Services</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </header>`;

    case 'HeroImage':
      return `
        <section style="background: var(--wire-200); padding: 3rem 1rem;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; gap: 2rem; align-items: center;">
            <div style="flex: 1;">
              <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: var(--wire-800);">
                ${props.heading || 'Welcome'}
              </h1>
              <p style="color: var(--wire-600); margin-bottom: 1.5rem;">${props.subheading || 'Subheading text'}</p>
              <button style="background: var(--wire-600); color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
                ${props.ctaLabel || 'Learn more'}
              </button>
            </div>
            ${props.hasImage !== false ? `
            <div style="flex: 1;">
              <div style="background: var(--wire-400); aspect-ratio: 4/3; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--wire-500);">
                [ Image ]
              </div>
            </div>` : ''}
          </div>
        </section>`;

    case 'TextEditor':
      return `
        <section style="padding: 2rem 1rem; max-width: 800px; margin: 0 auto;">
          ${props.heading ? `<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: var(--wire-800);">${props.heading}</h2>` : ''}
          <p style="color: var(--wire-700); margin-bottom: 1rem;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p style="color: var(--wire-700);">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </section>`;

    case 'CallToActionInline':
      return `
        <section style="background: var(--wire-200); padding: 2rem 1rem; margin: 1rem 0; border-radius: 4px;">
          <div style="max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="font-weight: bold; color: var(--wire-800);">${props.heading || 'Call to Action'}</h3>
              ${props.description ? `<p style="color: var(--wire-600); font-size: 0.875rem;">${props.description}</p>` : ''}
            </div>
            <button style="background: var(--wire-600); color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
              ${props.primaryLabel || 'Get Started'}
            </button>
          </div>
        </section>`;

    case 'FooterNavigation':
      return `
        <footer style="background: var(--wire-800); color: var(--wire-300); padding: 3rem 1rem;">
          <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem;">
              <div>
                <div style="font-weight: bold; color: var(--wire-100); margin-bottom: 1rem;">${props.logoText || 'LOGO'}</div>
                <p style="font-size: 0.875rem; color: var(--wire-400);">${props.tagline || 'Company tagline'}</p>
              </div>
              <div>
                <h4 style="font-weight: bold; color: var(--wire-100); margin-bottom: 0.5rem;">About</h4>
                <ul style="list-style: none; font-size: 0.875rem;">
                  <li style="margin-bottom: 0.25rem;"><a href="#" style="color: var(--wire-400);">Our Story</a></li>
                  <li style="margin-bottom: 0.25rem;"><a href="#" style="color: var(--wire-400);">Team</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-weight: bold; color: var(--wire-100); margin-bottom: 0.5rem;">Contact</h4>
                <ul style="list-style: none; font-size: 0.875rem;">
                  <li style="margin-bottom: 0.25rem;"><a href="#" style="color: var(--wire-400);">Email</a></li>
                  <li style="margin-bottom: 0.25rem;"><a href="#" style="color: var(--wire-400);">Phone</a></li>
                </ul>
              </div>
            </div>
            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--wire-700); font-size: 0.75rem; color: var(--wire-500); text-align: center;">
              © ${new Date().getFullYear()} Company Name. All rights reserved.
            </div>
          </div>
        </footer>`;

    // Generic fallback for other components
    default:
      return `
        <section style="padding: 2rem 1rem; background: var(--wire-100); margin: 0.5rem 0; border: 1px dashed var(--wire-300); border-radius: 4px;">
          <div style="max-width: 800px; margin: 0 auto; text-align: center; color: var(--wire-500);">
            [ ${type} Component ]
          </div>
        </section>`;
  }
};

// Generate HTML for a single page
const generatePageHTML = (page: Page, isStandalone: boolean = true): string => {
  const componentsHTML = page.components
    .sort((a, b) => a.order - b.order)
    .map((c) => generateComponentHTML(c))
    .join('\n');

  if (!isStandalone) {
    return `
      <div id="page-${page.id}" class="page-content">
        ${componentsHTML}
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <style>${generateCSS()}</style>
</head>
<body>
  <div class="page-container">
    ${componentsHTML}
  </div>
</body>
</html>`;
};

// Export project to HTML files (as a downloadable zip-like structure via multiple files)
export const exportToHTML = async (project: Project, clientName: string): Promise<void> => {
  // For simplicity, we'll create a single HTML file with all pages and navigation
  const pagesHTML = project.pages
    .map((page, index) => `
      <section id="page-${index}" style="display: ${index === 0 ? 'block' : 'none'};" class="page-section">
        <h2 style="background: var(--wire-700); color: white; padding: 0.5rem 1rem; margin: 0;">${page.name}</h2>
        ${page.components
          .sort((a, b) => a.order - b.order)
          .map((c) => generateComponentHTML(c))
          .join('\n')}
      </section>
    `)
    .join('\n');

  const navHTML = project.pages
    .map((page, index) => `<a href="#" onclick="showPage(${index}); return false;" id="nav-${index}">${page.name}</a>`)
    .join('\n');

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - ${clientName} Wireframes</title>
  <style>
    ${generateCSS()}
    .page-section { display: none; }
    .page-section.active { display: block; }
    .page-nav a.active { font-weight: bold; color: var(--wire-800); }
  </style>
</head>
<body>
  <div class="page-container">
    <nav class="page-nav">
      <strong style="margin-right: 1rem;">${project.name}</strong>
      ${navHTML}
    </nav>
    ${pagesHTML}
  </div>
  <script>
    function showPage(index) {
      document.querySelectorAll('.page-section').forEach((el, i) => {
        el.style.display = i === index ? 'block' : 'none';
      });
      document.querySelectorAll('.page-nav a').forEach((el, i) => {
        el.classList.toggle('active', i === index);
      });
    }
    // Show first page by default
    showPage(0);
    document.getElementById('nav-0')?.classList.add('active');
  </script>
</body>
</html>`;

  // Download the HTML file
  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-wireframes.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export current view to PDF
export const exportToPDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // Convert the element to an image
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#f8fafc',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit the page
    const img = new Image();
    img.src = dataUrl;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Center the image on the page
    const x = (pdfWidth - scaledWidth) / 2;
    const y = 20; // Add some top margin

    pdf.addImage(dataUrl, 'PNG', x, y, scaledWidth, scaledHeight);
    pdf.save(`${filename.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};


