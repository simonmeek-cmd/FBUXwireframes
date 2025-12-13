import JSZip from 'jszip';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import type { Project, Page } from '../types/builder';
import type { WelcomePageConfig } from '../types/welcomePage';
import { defaultWelcomePageConfig, defaultIntroCopy, fatBeehiveLogo } from '../types/welcomePage';
import { getHelpText } from './componentHelp';
import { getComponentMeta } from '../components/builder/componentRegistry';
import { getActiveComponents } from '../utils/componentRegistry';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigationStatic } from '../components/wireframe/SiteNavigationStatic';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { WireframeShowcase } from '../pages/WireframeShowcase';

// JavaScript for interactivity
const generateInteractivityJS = (): string => {
  return `
// Wireframe Interactivity Script
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Wireframe] Interactivity script loaded');
    initNavigation();
    initAccordions();
    initMobileMenu();
    initTabs();
    initHelpAnnotations();
  });

  // ============================================
  // NAVIGATION DROPDOWNS
  // ============================================
  function initNavigation() {
    console.log('[Wireframe] Initializing navigation...');
    
    // Handle all nav items with group class
    var groupItems = document.querySelectorAll('nav .group, header .group');
    console.log('[Wireframe] Found', groupItems.length, 'group items');
    
    // Also try to find any nav links
    var allNavLinks = document.querySelectorAll('header nav a');
    console.log('[Wireframe] Found', allNavLinks.length, 'nav links in header');
    
    // Debug: log header structure
    var header = document.querySelector('header');
    if (header) {
      console.log('[Wireframe] Header HTML preview:', header.innerHTML.substring(0, 500));
    }
    
    groupItems.forEach(function(item, index) {
      var dropdown = item.querySelector('.absolute, [class*="invisible"]');
      console.log('[Wireframe] Group item', index, 'has dropdown:', !!dropdown);
      if (!dropdown) return;
      
      // Helper to show dropdown
      function showDropdown() {
        dropdown.classList.remove('invisible', 'opacity-0', 'pointer-events-none', 'dropdown-closed');
        dropdown.classList.add('visible', 'opacity-100', 'dropdown-open');
        dropdown.style.cssText = 'opacity: 1 !important; visibility: visible !important; pointer-events: auto !important;';
        console.log('[Wireframe] Showing dropdown', index);
      }
      
      // Helper to hide dropdown
      function hideDropdown() {
        dropdown.classList.add('invisible', 'opacity-0', 'pointer-events-none', 'dropdown-closed');
        dropdown.classList.remove('visible', 'opacity-100', 'dropdown-open');
        dropdown.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
      }
      
      // Initially hide
      hideDropdown();
      
      // Desktop: show on hover
      item.addEventListener('mouseenter', function() {
        console.log('[Wireframe] Mouse enter on group', index);
        showDropdown();
      });
      item.addEventListener('mouseleave', function() {
        console.log('[Wireframe] Mouse leave on group', index);
        hideDropdown();
      });
      
      // Touch/click support
      var link = item.querySelector('a, button');
      if (link) {
        console.log('[Wireframe] Adding click listener to link in group', index);
        link.addEventListener('click', function(e) {
          console.log('[Wireframe] Click on link in group', index);
          var isVisible = dropdown.classList.contains('dropdown-open');
          
          // Close all other dropdowns
          document.querySelectorAll('nav .group .absolute, header .group .absolute, .relative.group .absolute').forEach(function(d) {
            if (d !== dropdown) {
              d.classList.add('dropdown-closed');
              d.classList.remove('dropdown-open');
              d.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
            }
          });
          
          if (isVisible) {
            hideDropdown();
          } else {
            showDropdown();
            e.preventDefault();
          }
        });
      }
    });
    
    // Also handle any .relative elements that contain .absolute dropdowns
    document.querySelectorAll('.relative').forEach(function(rel, index) {
      var dropdown = rel.querySelector(':scope > .absolute');
      if (!dropdown) return;
      if (rel.classList.contains('group')) return; // Already handled
      
      console.log('[Wireframe] Found relative container', index, 'with dropdown');
      
      rel.addEventListener('mouseenter', function() {
        dropdown.style.cssText = 'opacity: 1 !important; visibility: visible !important; pointer-events: auto !important;';
      });
      rel.addEventListener('mouseleave', function() {
        dropdown.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
      });
    });
    
    // Mega menu handling (full-width dropdowns with data-menu-for attribute)
    var megaMenus = document.querySelectorAll('[data-menu-for]');
    console.log('[Wireframe] Found', megaMenus.length, 'mega menus');
    
    if (megaMenus.length > 0) {
      var navItems = document.querySelectorAll('header nav .group');
      console.log('[Wireframe] Found', navItems.length, 'nav items for mega menus');
      
      navItems.forEach(function(navItem, index) {
        var megaMenu = document.querySelector('[data-menu-for="' + index + '"]');
        if (!megaMenu) {
          console.log('[Wireframe] No mega menu found for index', index);
          return;
        }
        
        console.log('[Wireframe] Setting up mega menu for nav item', index);
        
        navItem.addEventListener('mouseenter', function() {
          console.log('[Wireframe] Mouse enter nav item', index);
          // Hide all mega menus first
          megaMenus.forEach(function(m) {
            m.style.cssText = 'display: none;';
          });
          // Show this one
          megaMenu.style.cssText = 'display: block; opacity: 1; visibility: visible;';
          megaMenu.classList.remove('hidden', 'invisible', 'opacity-0');
        });
        
        megaMenu.addEventListener('mouseenter', function() {
          megaMenu.style.cssText = 'display: block; opacity: 1; visibility: visible;';
        });
        
        megaMenu.addEventListener('mouseleave', function() {
          megaMenu.style.cssText = 'display: none;';
        });
      });
      
      // Hide all mega menus when leaving nav area
      var nav = document.querySelector('header nav');
      if (nav) {
        nav.addEventListener('mouseleave', function(e) {
          // Check if we're entering a mega menu
          var relatedTarget = e.relatedTarget;
          if (relatedTarget && relatedTarget.closest && relatedTarget.closest('[data-menu-for]')) {
            return; // Don't hide if entering mega menu
          }
          // Small delay to allow entering mega menu
          setTimeout(function() {
            megaMenus.forEach(function(m) {
              if (!m.matches(':hover')) {
                m.style.cssText = 'display: none;';
              }
            });
          }, 100);
        });
      }
    }
    
    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && !e.target.closest('header')) {
        document.querySelectorAll('.absolute').forEach(function(d) {
          if (d.closest('nav') || d.closest('header')) {
            d.style.opacity = '0';
            d.style.visibility = 'hidden';
            d.style.pointerEvents = 'none';
          }
        });
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('nav .absolute, header .absolute').forEach(function(d) {
          d.style.opacity = '0';
          d.style.visibility = 'hidden';
          d.style.pointerEvents = 'none';
        });
      }
    });
  }

  // ============================================
  // ACCORDIONS
  // ============================================
  function initAccordions() {
    // Standard accordion with aria-expanded
    document.querySelectorAll('button[aria-expanded]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var panel = btn.nextElementSibling || document.getElementById(btn.getAttribute('aria-controls'));
        
        if (panel) {
          btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          panel.style.display = expanded ? 'none' : 'block';
          panel.classList.toggle('hidden', expanded);
          
          // Rotate chevron if present
          var svg = btn.querySelector('svg');
          if (svg) {
            svg.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
            svg.style.transition = 'transform 0.2s';
          }
        }
      });
    });
    
    // Clickable headers that toggle next sibling
    document.querySelectorAll('.cursor-pointer').forEach(function(header) {
      if (header.tagName === 'BUTTON') return;
      
      header.addEventListener('click', function() {
        var content = header.nextElementSibling;
        if (content && (content.classList.contains('hidden') || content.classList.contains('overflow-hidden'))) {
          var isHidden = content.style.display === 'none' || content.classList.contains('hidden');
          content.style.display = isHidden ? 'block' : 'none';
          content.classList.toggle('hidden', !isHidden);
          
          var svg = header.querySelector('svg');
          if (svg) {
            svg.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            svg.style.transition = 'transform 0.2s';
          }
        }
      });
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    console.log('[Wireframe] Initializing mobile menu...');
    
    // Find elements using our specific classes
    var hamburger = document.querySelector('.mobile-menu-trigger');
    var mobileMenu = document.querySelector('.mobile-menu');
    var closeBtn = document.querySelector('.mobile-menu-close');
    
    console.log('[Wireframe] Mobile menu elements:', {
      hamburger: !!hamburger,
      mobileMenu: !!mobileMenu,
      closeBtn: !!closeBtn
    });
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function() {
        console.log('[Wireframe] Opening mobile menu');
        mobileMenu.style.display = 'block';
      });
    }
    
    if (closeBtn && mobileMenu) {
      closeBtn.addEventListener('click', function() {
        console.log('[Wireframe] Closing mobile menu');
        mobileMenu.style.display = 'none';
      });
    }
    
    // Also try generic selectors as fallback
    var fallbackHamburger = document.querySelector('[aria-label="Open menu"]');
    var fallbackClose = document.querySelector('[aria-label="Close menu"]');
    var fallbackMenu = document.querySelector('.fixed.inset-0.z-50.bg-white');
    
    if (fallbackHamburger && fallbackMenu) {
      fallbackHamburger.addEventListener('click', function() {
        fallbackMenu.style.display = 'block';
      });
    }
    
    if (fallbackClose && fallbackMenu) {
      fallbackClose.addEventListener('click', function() {
        fallbackMenu.style.display = 'none';
      });
    }
  }

  // ============================================
  // TABS (e.g., content feed tabs)
  // ============================================
  function initTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function(tablist) {
      var tabs = tablist.querySelectorAll('[role="tab"]');
      var panels = tablist.parentElement.querySelectorAll('[role="tabpanel"]');
      
      tabs.forEach(function(tab, i) {
        tab.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Update tab states
          tabs.forEach(function(t, j) {
            var isActive = j === i;
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            t.classList.toggle('bg-wire-600', isActive);
            t.classList.toggle('text-white', isActive);
            t.classList.toggle('bg-transparent', !isActive);
            t.classList.toggle('text-wire-600', !isActive);
          });
          
          // Update panel visibility
          panels.forEach(function(p, j) {
            p.style.display = j === i ? 'block' : 'none';
            p.classList.toggle('hidden', j !== i);
          });
        });
      });
    });
    
    // Also handle button-based tabs
    document.querySelectorAll('.flex.gap-2 button, .flex.gap-1 button').forEach(function(btn) {
      if (btn.closest('[role="tablist"]')) return; // Skip if already handled
      
      btn.addEventListener('click', function() {
        var siblings = btn.parentElement.querySelectorAll('button');
        siblings.forEach(function(s) {
          s.classList.remove('bg-wire-600', 'text-white');
          s.classList.add('bg-wire-200', 'text-wire-600');
        });
        btn.classList.add('bg-wire-600', 'text-white');
        btn.classList.remove('bg-wire-200', 'text-wire-600');
      });
    });
  }

  // ============================================
  // HELP ANNOTATIONS (info buttons)
  // ============================================
  function initHelpAnnotations() {
    var infoButtons = document.querySelectorAll('.wf-info-btn');
    if (!infoButtons.length) return;
    console.log('[Wireframe] Initializing help annotations for', infoButtons.length, 'components');

    // Create overlay once
    var overlay = document.createElement('div');
    overlay.className = 'wf-help-overlay';
    overlay.innerHTML = [
      '<div class="wf-help-modal">',
      '  <div class="wf-help-header">',
      '    <div>',
      '      <div class="wf-help-title"></div>',
      '      <div class="wf-help-category"></div>',
      '    </div>',
      '    <button class="wf-help-close" aria-label="Close help">×</button>',
      '  </div>',
      '  <div class="wf-help-body"></div>',
      '  <div class="wf-help-footer">',
      '    <button class="wf-help-action" type="button">Got it</button>',
      '  </div>',
      '</div>',
    ].join('\\n');
    document.body.appendChild(overlay);

    var titleEl = overlay.querySelector('.wf-help-title');
    var categoryEl = overlay.querySelector('.wf-help-category');
    var bodyEl = overlay.querySelector('.wf-help-body');
    var closeBtn = overlay.querySelector('.wf-help-close');
    var actionBtn = overlay.querySelector('.wf-help-action');

    function closeOverlay() {
      overlay.classList.remove('open');
    }

    function openOverlay(title, text, category) {
      if (titleEl) titleEl.textContent = title || 'Component info';
      if (categoryEl) categoryEl.textContent = category || '';
      if (bodyEl) bodyEl.textContent = text || '';
      overlay.classList.add('open');
    }

    closeBtn && closeBtn.addEventListener('click', closeOverlay);
    actionBtn && actionBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeOverlay();
    });

    infoButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var container = btn.closest('.wf-annotated');
        if (!container) return;
        var title = container.getAttribute('data-help-title') || 'Component info';
        var text = container.getAttribute('data-help-text') || '';
        var category = container.getAttribute('data-help-category') || '';
        openOverlay(title, text, category);
      });
    });
  }

})();
`;
};

// Extract and inline all CSS from the page
const extractCSS = (): string => {
  const styles: string[] = [];
  
  // Get all stylesheets
  const styleSheets = document.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const sheet = styleSheets[i];
      const rules = sheet.cssRules || sheet.rules;
      for (let j = 0; j < rules.length; j++) {
        styles.push(rules[j].cssText);
      }
    } catch (e) {
      // Skip cross-origin stylesheets
      console.warn('Could not access stylesheet:', e);
    }
  }
  
  return styles.join('\n');
};

// Basic HTML escape for embedding help text in data attributes
const escapeHtml = (value: string | undefined): string => {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Render a page to static HTML
const renderPageToHTML = (
  page: Page,
  project: Project,
  allPages: Page[],
  css: string,
  clientName?: string
): string => {
  // Create navigation handler that generates proper href
  const getPageFilename = (pageName: string): string => {
    const targetPage = allPages.find(p => 
      p.name.toLowerCase() === pageName.toLowerCase() ||
      p.name.toLowerCase().replace(/\s+/g, '-') === pageName.toLowerCase().replace(/\s+/g, '-')
    );
    if (targetPage) {
      const index = allPages.indexOf(targetPage);
      return index === 0 ? 'index.html' : `${targetPage.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    }
    return '#';
  };

  // Render navigation using static-export-friendly component
  let navHtml = '';
  if (project.navigationConfig) {
    try {
      navHtml = renderToStaticMarkup(
        React.createElement(SiteNavigationStatic, {
          config: project.navigationConfig,
        })
      );
    } catch (e) {
      console.error('Error rendering navigation:', e);
    }
  }

  // Render components
  let componentsHtml = '';
  const sortedComponents = [...page.components].sort((a, b) => a.order - b.order);
  
  for (const component of sortedComponents) {
    try {
      const meta = getComponentMeta(component.type);
      const helpText = getHelpText(component.type, (component as any).helpText);
      const safeHelpText = escapeHtml(helpText);
      const safeTitle = escapeHtml(meta?.label || component.type);
      const html = renderToStaticMarkup(
        React.createElement(ComponentRenderer, {
          type: component.type,
          props: component.props,
        })
      );
      componentsHtml += `
        <div class="wf-annotated group relative" data-help-text="${safeHelpText}" data-help-title="${safeTitle}" data-help-category="${escapeHtml(meta?.category || '')}">
          <button class="wf-info-btn" type="button" aria-label="About ${safeTitle}">i</button>
          ${html}
        </div>
      `;
    } catch (e) {
      console.error(`Error rendering component ${component.type}:`, e);
      componentsHtml += `<div style="padding: 2rem; background: #fee; border: 1px solid #fcc; margin: 1rem 0;">Error rendering ${component.type}</div>`;
    }
  }

  // Render footer
  let footerHtml = '';
  if (project.footerConfig) {
    try {
      footerHtml = renderToStaticMarkup(
        React.createElement(SiteFooter, {
          config: project.footerConfig,
        })
      );
    } catch (e) {
      console.error('Error rendering footer:', e);
    }
  }

  // Additional CSS for static export interactivity
  const staticCSS = `
    /* Ensure dropdowns work on hover in static export */
    .group:hover > .absolute,
    .group:hover > .invisible,
    .group:hover > div > .absolute,
    .group:hover .dropdown-content,
    .relative.group:hover > .absolute {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }
    
    /* Tailwind group-hover equivalents */
    .group:hover .group-hover\\:opacity-100 {
      opacity: 1 !important;
    }
    .group:hover .group-hover\\:visible {
      visibility: visible !important;
    }
    
    /* Annotation info button */
    .wf-annotated {
      position: relative;
    }
    .wf-info-btn {
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      background: #243b53;
      color: white;
      border: none;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px rgba(0,0,0,0.12);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
      z-index: 30;
      cursor: pointer;
      transform: translateY(-4px);
    }
    .wf-annotated:hover .wf-info-btn,
    .wf-info-btn:focus-visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .wf-info-btn:hover {
      background: #102a43;
    }
    
    /* Help overlay */
    .wf-help-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 9999;
    }
    .wf-help-overlay.open {
      display: flex;
    }
    .wf-help-modal {
      background: white;
      border-radius: 12px;
      max-width: 480px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.18);
    }
    .wf-help-header, .wf-help-footer {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e1e7ef;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f5f7fb;
    }
    .wf-help-footer {
      border-top: 1px solid #e1e7ef;
      border-bottom: none;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    .wf-help-body {
      padding: 1rem 1.25rem;
      overflow-y: auto;
      color: #334e68;
      line-height: 1.6;
    }
    .wf-help-title {
      font-weight: 700;
      color: #102a43;
    }
    .wf-help-category {
      color: #829ab1;
      font-size: 0.875rem;
    }
    .wf-help-close {
      background: none;
      border: none;
      color: #627d98;
      cursor: pointer;
      font-size: 16px;
    }
    .wf-help-action {
      background: #243b53;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 0.9rem;
      cursor: pointer;
    }
    .wf-help-action:hover {
      background: #102a43;
    }
    
    /* Dropdown base styles */
    .absolute.invisible,
    .absolute.opacity-0 {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    
    /* Dropdown transitions */
    .absolute {
      transition: opacity 0.15s ease, visibility 0.15s ease;
    }
    
    /* Navigation dropdown - explicit selectors */
    nav .relative:hover > .absolute,
    header .relative:hover > .absolute,
    .relative.group:hover > .absolute {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }
    
    /* Ensure clickable elements have pointer cursor */
    .cursor-pointer, [aria-expanded], button, .group > a {
      cursor: pointer;
    }
    
    /* Accordion panels - initially hidden */
    [aria-expanded="false"] + * {
      display: none;
    }
    
    /* Mobile menu - initially hidden */
    .fixed.inset-0 {
      display: none;
    }
    
    /* JS-controlled visibility classes */
    .dropdown-open {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }
    .dropdown-closed {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  // Build the full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${clientName ? `${clientName}: ` : ''}${page.name} | ${project.name}</title>
  <style>
    ${css}
    ${staticCSS}
  </style>
</head>
<body class="bg-wire-100">
  ${navHtml}
  <main>
    ${componentsHtml || `
      <section class="bg-wire-200 py-12">
        <div class="max-w-6xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-wire-800">${page.name}</h1>
        </div>
      </section>
    `}
  </main>
  ${footerHtml}
  <script src="interactivity.js"></script>
</body>
</html>`;
};

// Fix relative links in the HTML to point to correct pages
const fixLinks = (html: string, allPages: Page[]): string => {
  let fixedHtml = html;
  
  // Fix all page links (no more index.html for first page)
  allPages.forEach((page) => {
    const filename = `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    
    // Match various href patterns that might reference this page
    const patterns = [
      new RegExp(`href="/${page.name.toLowerCase().replace(/\s+/g, '-')}"`, 'gi'),
      new RegExp(`href="/${page.name}"`, 'gi'),
      new RegExp(`href="#${page.name.toLowerCase().replace(/\s+/g, '-')}"`, 'gi'),
    ];
    
    patterns.forEach(pattern => {
      fixedHtml = fixedHtml.replace(pattern, `href="${filename}"`);
    });
  });
  
  // Fix home/root links to go to welcome page
  fixedHtml = fixedHtml.replace(/href="\/"/g, 'href="index.html"');
  fixedHtml = fixedHtml.replace(/href="#"/g, 'href="index.html"');
  
  return fixedHtml;
};

// Generate the welcome page HTML
const generateWelcomePageHTML = (
  project: Project,
  clientName: string,
  allPages: Page[],
  css: string
): string => {
  const config: WelcomePageConfig = project.welcomePageConfig || defaultWelcomePageConfig;
  const introCopy = config.introCopy || defaultIntroCopy;
  const projectDate = config.projectDate || new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Generate page list
  const pageListHtml = allPages.map((page, index) => {
    const filename = `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    return `<li><a href="${filename}" class="text-wire-700 hover:text-wire-900 underline">${page.name}</a></li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${clientName}: ${project.name} | Wireframes</title>
  <style>
    ${css}
    
    /* Welcome page specific styles */
    .welcome-logo-bar {
      background: white;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .welcome-logo-bar img,
    .welcome-logo-bar svg {
      height: 50px;
      max-width: 200px;
      object-fit: contain;
    }
    .welcome-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    .welcome-content h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: #243b53;
      margin-bottom: 0.5rem;
    }
    .welcome-content .date {
      color: #627d98;
      margin-bottom: 2rem;
    }
    .welcome-content .intro {
      color: #334e68;
      line-height: 1.7;
    }
    .welcome-content .intro h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #243b53;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #d9e2ec;
      padding-bottom: 0.5rem;
    }
    .welcome-content .intro h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #243b53;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .welcome-content .intro p {
      margin-bottom: 1rem;
    }
    .welcome-content .intro ul,
    .welcome-content .intro ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
      list-style-position: outside;
    }
    .welcome-content .intro ul {
      list-style-type: disc;
    }
    .welcome-content .intro ol {
      list-style-type: decimal;
    }
    .welcome-content .intro li {
      margin-bottom: 0.5rem;
      padding-left: 0.25rem;
    }
    .welcome-content .intro strong {
      font-weight: 600;
      color: #243b53;
    }
    .welcome-pages {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #bcccdc;
    }
    .welcome-pages h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #243b53;
      margin-bottom: 1rem;
    }
    .welcome-pages ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }
    .welcome-pages li {
      padding: 0.75rem 1rem;
      background: #f0f4f8;
      border-radius: 0.25rem;
      border-left: 3px solid #627d98;
    }
    .welcome-pages li:hover {
      background: #d9e2ec;
      border-left-color: #243b53;
    }
    .welcome-footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #bcccdc;
      display: flex;
      gap: 1.5rem;
    }
    .welcome-footer a {
      color: #627d98;
    }
  </style>
</head>
<body class="bg-wire-100">
  <!-- Logo Bar -->
  <div class="welcome-logo-bar">
    <div>
      ${fatBeehiveLogo.replace('width="387"', 'width="180"').replace('height="60"', 'height="45"')}
    </div>
    ${config.clientLogo 
      ? `<img src="${config.clientLogo}" alt="${clientName} logo" />`
      : `<div style="color: #9fb3c8; font-size: 0.875rem;">[ Client Logo ]</div>`
    }
  </div>

  <!-- Welcome Content -->
  <div class="welcome-content">
    <h1>${clientName}: ${project.name}</h1>
    <p class="date">${projectDate}</p>
    
    <div class="intro">
      ${introCopy}
    </div>

    <!-- Page List -->
    <div class="welcome-pages">
      <h2>Wireframe Pages</h2>
      <ul>
        ${pageListHtml}
      </ul>
    </div>

    <!-- Footer Links -->
    <div class="welcome-footer">
      <a href="showcase.html" class="underline">View Components Showcase</a>
    </div>
  </div>
</body>
</html>`;
};

// Generate components showcase HTML
const generateShowcaseHTML = (css: string, project: Project): string => {
  // Get active components for this project
  const activeComponents = getActiveComponents(project.activeComponents);
  
  // Render the actual WireframeShowcase component with active components override
  let showcaseHtml = '';
  try {
    showcaseHtml = renderToStaticMarkup(
      React.createElement(WireframeShowcase, { activeComponentsOverride: activeComponents })
    );
  } catch (e) {
    console.error('Error rendering showcase:', e);
    showcaseHtml = '<div class="p-8 text-center text-red-600">Error rendering components showcase</div>';
  }

  // Add back link at the top
  const backLink = '<div style="max-width: 6xl; margin: 0 auto; padding: 1rem 1rem 0;"><a href="index.html" style="color: #627d98; text-decoration: underline;">← Back to Welcome</a></div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Components Showcase | Wireframes</title>
  <style>
    ${css}
  </style>
</head>
<body class="bg-wire-100">
  ${backLink}
  ${showcaseHtml}
  <script src="interactivity.js"></script>
</body>
</html>`;
};

// Main export function using SSR
export const exportStaticSiteSSR = async (project: Project, clientName: string = 'Client'): Promise<void> => {
  const zip = new JSZip();
  
  // Extract CSS from the current page
  const css = extractCSS();
  
  // Add interactivity JavaScript
  zip.file('interactivity.js', generateInteractivityJS());
  
  // Generate welcome page as index.html
  const welcomeHtml = generateWelcomePageHTML(project, clientName, project.pages, css);
  zip.file('index.html', welcomeHtml);
  
  // Generate components showcase
  const showcaseHtml = generateShowcaseHTML(css, project);
  zip.file('showcase.html', showcaseHtml);
  
  // Generate HTML for each page (NO longer using index.html for first page)
  for (let i = 0; i < project.pages.length; i++) {
    const page = project.pages[i];
    // All pages get named files (not index.html anymore)
    const filename = `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    
    try {
      let html = renderPageToHTML(page, project, project.pages, css, clientName);
      html = fixLinks(html, project.pages);
      zip.file(filename, html);
    } catch (e) {
      console.error(`Error generating ${filename}:`, e);
      zip.file(filename, `<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Error generating ${page.name}</h1><p>${e}</p></body></html>`);
    }
  }
  
  // Add README
  zip.file('README.txt', `${project.name} Wireframes
  
Generated on ${new Date().toLocaleDateString()}

To deploy:
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. Get your shareable link!

Files included:
- index.html (Welcome page)
- showcase.html (Components showcase)
${project.pages.map(p => `- ${p.name.toLowerCase().replace(/\s+/g, '-')}.html (${p.name})`).join('\n')}

Note: This export was generated using server-side rendering of the actual React components,
so it should closely match what you see in the preview.
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

