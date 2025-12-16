import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useBuilderStore } from '../stores/useBuilderStore';
import { NavigationSettings } from '../components/builder/NavigationSettings';
import { FooterSettings } from '../components/builder/FooterSettings';
import { ComponentSettings } from '../components/builder/ComponentSettings';
import { WelcomePageSettings } from '../components/builder/WelcomePageSettings';
import { exportStaticSiteSSR } from '../utils/exportStaticSiteSSR';
import { exportProjectJSON } from '../utils/exportStaticSite';
import type { PageType, ComponentType } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';
import type { WelcomePageConfig } from '../types/welcomePage';

const PAGE_TYPES: { value: PageType; label: string }[] = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'content', label: 'Content Page' },
  { value: 'news-listing', label: 'News Listing (with Article)' },
  { value: 'resources-listing', label: 'Resources Listing (with Resource)' },
  { value: 'events-listing', label: 'Events Listing (with Event)' },
  { value: 'custom', label: 'Custom' },
];

export const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject, getClient, addPage, deletePage, updateNavigationConfig, updateFooterConfig, updateWelcomePageConfig, updateActiveComponents } = useBuilderStore();
  const [newPageName, setNewPageName] = useState('');
  const [newPageType, setNewPageType] = useState<PageType>('content');
  const [isAdding, setIsAdding] = useState(false);
  const [showNavSettings, setShowNavSettings] = useState(false);
  const [showFooterSettings, setShowFooterSettings] = useState(false);
  const [showWelcomePageSettings, setShowWelcomePageSettings] = useState(false);
  const [showComponentSettings, setShowComponentSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const project = projectId ? getProject(projectId) : undefined;
  const client = project ? getClient(project.clientId) : undefined;

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim() && projectId) {
      addPage(projectId, newPageName.trim(), newPageType);
      setNewPageName('');
      setNewPageType('content');
      setIsAdding(false);
    }
  };

  const handleDeletePage = (pageId: string, pageName: string) => {
    if (confirm(`Delete page "${pageName}"?`)) {
      deletePage(projectId!, pageId);
    }
  };

  const handleSaveNavigation = (config: NavigationConfig) => {
    if (projectId) {
      updateNavigationConfig(projectId, config);
    }
  };

  const handleSaveFooter = (config: FooterConfig) => {
    if (projectId) {
      updateFooterConfig(projectId, config);
    }
  };

  const handleSaveActiveComponents = (activeComponents: ComponentType[]) => {
    if (projectId) {
      updateActiveComponents(projectId, activeComponents);
    }
  };

  const handleSaveWelcomePage = (config: WelcomePageConfig) => {
    if (projectId) {
      updateWelcomePageConfig(projectId, config);
    }
  };

  const handleExportForHosting = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      await exportStaticSiteSSR(project, client?.name || 'Client');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
    setIsExporting(false);
  };

  const handleExportBackup = () => {
    if (!project) return;
    exportProjectJSON(project);
  };

  const getPublishUrl = () => {
    if (!projectId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/publish/${projectId}`;
  };

  const handleCopyPublishUrl = async () => {
    const url = getPublishUrl();
    try {
      await navigator.clipboard.writeText(url);
      alert('Publish URL copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Publish URL copied to clipboard!');
    }
  };

  const getPageTypeLabel = (type: PageType) => {
    return PAGE_TYPES.find((t) => t.value === type)?.label || type;
  };

  // Sort pages: homepage first, then alphabetically
  const sortedPages = [...project.pages].sort((a, b) => {
    // Homepage always first
    if (a.type === 'homepage' && b.type !== 'homepage') return -1;
    if (a.type !== 'homepage' && b.type === 'homepage') return 1;
    // Then alphabetical by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-wire-400 text-sm mb-2">
            <Link to="/" className="hover:text-wire-200">Clients</Link>
            <span>/</span>
            <Link to={`/client/${project.clientId}`} className="hover:text-wire-200">
              {client?.name || 'Client'}
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-wire-400 mt-1">Wireframe pages</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Publish Section */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-green-800">Publish & Share</h3>
              <p className="text-sm text-green-700 mt-1">
                Get a shareable link to view this project (no login required)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyPublishUrl}
                disabled={project.pages.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                🔗 Copy Publish Link
              </button>
              <a
                href={getPublishUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300 transition-colors no-underline"
              >
                Open in New Tab
              </a>
            </div>
          </div>
          {project.pages.length === 0 && (
            <p className="text-xs text-green-600 mt-2">Add at least one page to publish</p>
          )}
          {project.pages.length > 0 && (
            <div className="mt-3 p-2 bg-white rounded border border-green-200">
              <p className="text-xs text-green-700 font-mono break-all">{getPublishUrl()}</p>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="mb-8 p-4 bg-wire-50 border border-wire-200 rounded">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-wire-800">Export</h3>
              <p className="text-sm text-wire-600 mt-1">
                Download static files for hosting or backup
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportForHosting}
                disabled={isExporting || project.pages.length === 0}
                className="px-4 py-2 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                    🚀 Export for Netlify
                  </>
                )}
              </button>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors"
              >
                💾 Backup JSON
              </button>
            </div>
          </div>
          {project.pages.length === 0 && (
            <p className="text-xs text-wire-500 mt-2">Add at least one page to export</p>
          )}
        </div>

        {/* Site-wide Settings Section */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Navigation Settings */}
          <div className="p-4 bg-wire-200 border border-wire-300 rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-wire-800">Header / Navigation</h3>
                <p className="text-sm text-wire-600 mt-1">
                  Configure the header navigation
                </p>
              </div>
              <button
                onClick={() => setShowNavSettings(true)}
                className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                {project.navigationConfig ? 'Edit' : 'Configure'}
              </button>
            </div>
            {project.navigationConfig ? (
              <div className="text-sm text-wire-600 flex flex-wrap gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Configured
                </span>
                <span>{project.navigationConfig.primaryItems.length} menu items</span>
                <span>{project.navigationConfig.ctas.length} CTA{project.navigationConfig.ctas.length !== 1 ? 's' : ''}</span>
              </div>
            ) : (
              <div className="text-sm text-wire-500 italic">Not configured</div>
            )}
          </div>

          {/* Footer Settings */}
          <div className="p-4 bg-wire-200 border border-wire-300 rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-wire-800">Footer</h3>
                <p className="text-sm text-wire-600 mt-1">
                  Configure the site footer
                </p>
              </div>
              <button
                onClick={() => setShowFooterSettings(true)}
                className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                {project.footerConfig ? 'Edit' : 'Configure'}
              </button>
            </div>
            {project.footerConfig ? (
              <div className="text-sm text-wire-600 flex flex-wrap gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Configured
                </span>
                <span>{project.footerConfig.sections.length} nav sections</span>
                {project.footerConfig.showNewsletter && <span>Newsletter</span>}
                {project.footerConfig.showSocialLinks && <span>Social links</span>}
              </div>
            ) : (
              <div className="text-sm text-wire-500 italic">Not configured</div>
            )}
          </div>

          {/* Welcome Page Settings */}
          <div className="p-4 bg-wire-200 border border-wire-300 rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-wire-800">Welcome Page</h3>
                <p className="text-sm text-wire-600 mt-1">
                  Configure the client-facing welcome page
                </p>
              </div>
              <button
                onClick={() => setShowWelcomePageSettings(true)}
                className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                {project.welcomePageConfig ? 'Edit' : 'Configure'}
              </button>
            </div>
            {project.welcomePageConfig ? (
              <div className="text-sm text-wire-600 flex flex-wrap gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Configured
                </span>
                {project.welcomePageConfig.clientLogo && <span>Client logo</span>}
                {project.welcomePageConfig.projectDate && <span>Date set</span>}
                {project.welcomePageConfig.introCopy && <span>Intro copy</span>}
              </div>
            ) : (
              <div className="text-sm text-wire-500 italic">Not configured</div>
            )}
          </div>
        </div>

        {/* Component Settings */}
        <div className="mb-8 p-4 bg-wire-200 border border-wire-300 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-wire-800">Available Components</h3>
              <p className="text-sm text-wire-600 mt-1">
                Select which components are available for this project
              </p>
            </div>
            <button
              onClick={() => setShowComponentSettings(true)}
              className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
            >
              Configure
            </button>
          </div>
          {project.activeComponents ? (
            <div className="text-sm text-wire-600 mt-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {project.activeComponents.length} components active
              </span>
            </div>
          ) : (
            <div className="text-sm text-wire-600 mt-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-wire-400 rounded-full"></span>
                All components active (default)
              </span>
            </div>
          )}
        </div>

        {/* Pages Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-wire-800">Pages</h2>
          <div className="flex gap-3">
            {project.pages.length > 0 && (
              <Link
                to={`/preview/${projectId}`}
                className="px-4 py-2 bg-wire-700 text-wire-100 rounded hover:bg-wire-800 transition-colors no-underline"
              >
                Preview All
              </Link>
            )}
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                + Add Page
              </button>
            )}
          </div>
        </div>

        {/* Add page form */}
        {isAdding && (
          <form onSubmit={handleAddPage} className="mb-6 p-4 bg-wire-200 rounded border border-wire-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-wire-700 mb-2">
                  Page Name
                </label>
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="e.g., About Us"
                  className="w-full px-3 py-2 bg-wire-50 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wire-700 mb-2">
                  Page Type
                </label>
                <select
                  value={newPageType}
                  onChange={(e) => setNewPageType(e.target.value as PageType)}
                  className="w-full px-3 py-2 bg-wire-50 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                >
                  {PAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                Create Page
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewPageName('');
                  setNewPageType('content');
                }}
                className="px-4 py-2 border border-wire-400 text-wire-600 rounded hover:bg-wire-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Page list */}
        {project.pages.length === 0 ? (
          <div className="text-center py-12 bg-wire-50 rounded border border-wire-200">
            <p className="text-wire-500 mb-4">No pages in this project yet</p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-wire-600 underline underline-offset-2 hover:text-wire-800"
              >
                Add your first page
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 bg-wire-50 border border-wire-200 rounded hover:bg-wire-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-wire-300 rounded flex items-center justify-center text-wire-500 text-xs font-medium">
                    {page.type.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      to={`/project/${projectId}/page/${page.id}`}
                      className="font-medium text-wire-800 hover:text-wire-600"
                    >
                      {page.name}
                    </Link>
                    <p className="text-sm text-wire-500">
                      {getPageTypeLabel(page.type)} • {page.components.length} component{page.components.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/project/${projectId}/page/${page.id}`}
                    className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors no-underline"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/preview/${projectId}/${page.id}`}
                    className="px-3 py-1.5 text-sm bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors no-underline"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDeletePage(page.id, page.name)}
                    className="px-3 py-1.5 text-sm text-wire-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Navigation Settings Modal */}
      <NavigationSettings
        config={project.navigationConfig}
        onSave={handleSaveNavigation}
        isOpen={showNavSettings}
        onClose={() => setShowNavSettings(false)}
      />

      {/* Footer Settings Modal */}
      <FooterSettings
        config={project.footerConfig}
        onSave={handleSaveFooter}
        isOpen={showFooterSettings}
        onClose={() => setShowFooterSettings(false)}
      />

      {/* Component Settings Modal */}
      <ComponentSettings
        activeComponents={project.activeComponents}
        onSave={handleSaveActiveComponents}
        isOpen={showComponentSettings}
        onClose={() => setShowComponentSettings(false)}
      />

      {/* Welcome Page Settings Modal */}
      <WelcomePageSettings
        config={project.welcomePageConfig}
        projectName={project.name}
        clientName={client?.name || 'Client'}
        onSave={handleSaveWelcomePage}
        isOpen={showWelcomePageSettings}
        onClose={() => setShowWelcomePageSettings(false)}
      />
    </div>
  );
};

export default ProjectView;
