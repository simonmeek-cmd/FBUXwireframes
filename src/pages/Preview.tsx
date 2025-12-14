import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useBuilderStore } from '../stores/useBuilderStore';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigation } from '../components/wireframe/SiteNavigation';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { exportToHTML, exportToPDF } from '../utils/export';
import { getHelpText } from '../utils/componentHelp';
import { getComponentMeta } from '../components/builder/componentRegistry';
import type { PlacedComponent } from '../types/builder';

// Component wrapper with info icon for annotations
const AnnotatedComponent: React.FC<{
  component: PlacedComponent;
  showAnnotations: boolean;
  onShowHelp: (component: PlacedComponent) => void;
}> = ({ component, showAnnotations, onShowHelp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const meta = getComponentMeta(component.type);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ComponentRenderer type={component.type} props={component.props} />
      
      {/* Info icon - appears on hover when annotations are enabled */}
      {showAnnotations && isHovered && (
        <button
          onClick={() => onShowHelp(component)}
          className="absolute top-4 left-4 w-8 h-8 bg-wire-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-wire-800 transition-colors z-20 animate-fade-in"
          title={`About: ${meta?.label || component.type}`}
        >
          i
        </button>
      )}
    </div>
  );
};

// Help text popup/modal
const HelpPopup: React.FC<{
  component: PlacedComponent | null;
  onClose: () => void;
}> = ({ component, onClose }) => {
  if (!component) return null;

  const meta = getComponentMeta(component.type);
  const helpText = getHelpText(component.type, component.helpText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200 bg-wire-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-wire-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
              i
            </div>
            <div>
              <h3 className="font-bold text-wire-800">{meta?.label || component.type}</h3>
              <p className="text-xs text-wire-500">{meta?.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-wire-500 hover:text-wire-800 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <p className="text-wire-700 leading-relaxed whitespace-pre-wrap">{helpText}</p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-wire-200 bg-wire-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-wire-700 text-white rounded hover:bg-wire-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export const Preview: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId?: string }>();
  const { getProject, getClient, loading, initialize } = useBuilderStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeHelpComponent, setActiveHelpComponent] = useState<PlacedComponent | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Ensure store is initialized
  useEffect(() => {
    if (!initialized && !loading) {
      initialize().then(() => setInitialized(true));
    }
  }, [initialized, loading, initialize]);

  const project = projectId ? getProject(projectId) : undefined;
  const client = project ? getClient(project.clientId) : undefined;

  // Show loading state while initializing
  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-wire-600">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // If pageId is provided, show that specific page; otherwise show navigation between all pages
  const pages = project.pages;
  const currentPage = pageId
    ? pages.find((p) => p.id === pageId)
    : pages[currentPageIndex];

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wire-500 mb-4">No pages to preview</p>
          <Link
            to={`/project/${projectId}`}
            className="text-wire-600 hover:text-wire-800 underline"
          >
            Add pages to this project
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return <Navigate to={`/project/${projectId}`} replace />;
  }

  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      await exportToHTML(project, client?.name || 'Client');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    }
    setIsExporting(false);
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await exportToPDF(previewRef.current, `${project.name} - ${currentPage.name}`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    }
    setIsExporting(false);
  };

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-wire-800 flex flex-col">
      {/* Preview toolbar */}
      <header className="bg-wire-900 text-wire-100 py-2 px-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            to={pageId ? `/project/${projectId}/page/${pageId}` : `/project/${projectId}`}
            className="text-wire-400 hover:text-wire-200 text-sm"
          >
            ← Exit Preview
          </Link>
          <div className="h-4 w-px bg-wire-700" />
          <div className="text-sm">
            <span className="text-wire-400">{client?.name} / {project.name}</span>
            <span className="mx-2 text-wire-600">/</span>
            <span className="text-wire-100 font-medium">{currentPage.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Annotations toggle */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-2 ${
              showAnnotations
                ? 'bg-wire-600 text-wire-100'
                : 'bg-wire-700 text-wire-400 hover:text-wire-200'
            }`}
            title={showAnnotations ? 'Hide annotations' : 'Show annotations'}
          >
            <span className="w-5 h-5 bg-wire-500 rounded-full flex items-center justify-center text-xs font-bold">
              i
            </span>
            {showAnnotations ? 'Annotations On' : 'Annotations Off'}
          </button>

          {/* Page navigation (when viewing all pages) */}
          {!pageId && pages.length > 1 && (
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => goToPage(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
                className="px-2 py-1 text-wire-400 hover:text-wire-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm text-wire-400">
                {currentPageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={() => goToPage(currentPageIndex + 1)}
                disabled={currentPageIndex === pages.length - 1}
                className="px-2 py-1 text-wire-400 hover:text-wire-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Export buttons */}
          <button
            onClick={handleExportHTML}
            disabled={isExporting}
            className="px-3 py-1.5 text-sm bg-wire-700 text-wire-100 rounded hover:bg-wire-600 transition-colors disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export HTML'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-500 transition-colors disabled:opacity-50"
          >
            Export PDF
          </button>
        </div>
      </header>

      {/* Page navigation tabs (when viewing all pages) */}
      {!pageId && pages.length > 1 && (
        <div className="bg-wire-700 px-4 py-2 flex gap-2 overflow-x-auto">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setCurrentPageIndex(index)}
              className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors ${
                index === currentPageIndex
                  ? 'bg-wire-100 text-wire-800'
                  : 'bg-wire-600 text-wire-200 hover:bg-wire-500'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      )}

      {/* Preview content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div
          ref={previewRef}
          className="max-w-6xl mx-auto bg-wire-50 min-h-[600px] shadow-2xl"
        >
          {/* Site Navigation */}
          {project.navigationConfig && (
            <SiteNavigation 
              config={project.navigationConfig} 
              onNavigate={(href) => {
                // Handle logo click (home/welcome)
                if (href === '/' || href === 'index.html') {
                  setCurrentPageIndex(0);
                  return;
                }
                // Find page by name and navigate
                const targetPage = pages.find(p => 
                  p.name.toLowerCase() === href.replace(/^\//, '').toLowerCase() ||
                  p.name.toLowerCase().replace(/\s+/g, '-') === href.replace(/^\//, '').toLowerCase()
                );
                if (targetPage) {
                  const targetIndex = pages.findIndex(p => p.id === targetPage.id);
                  if (targetIndex !== -1) {
                    setCurrentPageIndex(targetIndex);
                  }
                }
              }}
            />
          )}

          {currentPage.components.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-wire-400">
              <div className="text-center">
                <p className="text-lg mb-2">This page is empty</p>
                <Link
                  to={`/project/${projectId}/page/${currentPage.id}`}
                  className="text-wire-600 underline hover:text-wire-800"
                >
                  Add components
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {currentPage.components
                .sort((a, b) => a.order - b.order)
                .map((component) => (
                  <AnnotatedComponent
                    key={component.id}
                    component={component}
                    showAnnotations={showAnnotations}
                    onShowHelp={setActiveHelpComponent}
                  />
                ))}
            </div>
          )}

          {/* Site Footer */}
          {project.footerConfig && (
            <SiteFooter 
              config={project.footerConfig}
              onNavigate={(href) => {
                const targetPage = pages.find(p => 
                  p.name.toLowerCase() === href.replace(/^\//, '').toLowerCase() ||
                  p.name.toLowerCase().replace(/\s+/g, '-') === href.replace(/^\//, '').toLowerCase()
                );
                if (targetPage) {
                  const targetIndex = pages.findIndex(p => p.id === targetPage.id);
                  if (targetIndex !== -1) {
                    setCurrentPageIndex(targetIndex);
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Help text popup */}
      <HelpPopup
        component={activeHelpComponent}
        onClose={() => setActiveHelpComponent(null)}
      />
    </div>
  );
};

export default Preview;
