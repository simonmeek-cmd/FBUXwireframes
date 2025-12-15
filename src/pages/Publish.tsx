import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigation } from '../components/wireframe/SiteNavigation';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { WelcomePage } from '../components/wireframe/WelcomePage';
import { getHelpText } from '../utils/componentHelp';
import { getComponentMeta } from '../components/builder/componentRegistry';
import type { Project, PlacedComponent } from '../types/builder';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

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
          className="absolute top-4 left-4 w-8 h-8 bg-wire-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-wire-800 transition-colors z-20"
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

export const Publish: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId?: string }>();
  const [project, setProject] = useState<Project & { clientName?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeHelpComponent, setActiveHelpComponent] = useState<PlacedComponent | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('Project ID required');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/publish/${projectId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Project not found');
          } else {
            setError('Failed to load project');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-wire-600">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wire-500 mb-4">{error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  const pages = project.pages || [];
  
  // If no pageId specified, show welcome page
  const showWelcomePage = !pageId;
  
  // Derive current page directly (no extra state/effect)
  const currentPage = pageId
    ? pages.find((p) => p.id === pageId) || pages[0]
    : pages[0];
  const currentPageIndex = currentPage ? pages.findIndex((p) => p.id === currentPage.id) : 0;

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wire-500 mb-4">This project has no pages</p>
        </div>
      </div>
    );
  }

  // Show welcome page if no pageId or if explicitly showing welcome
  if (showWelcomePage) {
    return (
      <WelcomePage
        config={project.welcomePageConfig}
        projectName={project.name}
        clientName={project.clientName || 'Client'}
        pages={pages}
        onNavigateToPage={(pageId) => {
          window.location.href = `/publish/${projectId}/${pageId}`;
        }}
        onOpenShowcase={() => {
          window.location.href = `/publish/${projectId}/showcase`;
        }}
      />
    );
  }

  if (!currentPage) {
    return <Navigate to={`/publish/${projectId}`} replace />;
  }

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      // Navigate to the page using the page ID
      window.location.href = `/publish/${projectId}/${pages[index].id}`;
    }
  };

  return (
    <div className="min-h-screen bg-wire-50">
      {/* Page navigation tabs + Home icon */}
      <div className="bg-wire-200 border-b border-wire-300 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto items-center">
          {/* Home icon tab */}
          <button
            onClick={() => {
              // Go back to welcome screen
              window.location.href = `/publish/${projectId}`;
            }}
            className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
              !pageId
                ? 'bg-wire-600 text-white border-wire-600'
                : 'bg-wire-50 text-wire-700 border-wire-400 hover:bg-wire-300'
            }`}
            title="Back to welcome page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </button>

          {/* Page tabs */}
          {pages.length > 1 && (
            <>
              <span className="h-6 w-px bg-wire-300 mx-1" aria-hidden="true" />
              {pages.map((page, index) => {
                const isActive = pageId ? page.id === pageId : index === currentPageIndex;
                return (
                  <button
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-wire-600 text-white'
                        : 'bg-wire-100 text-wire-700 hover:bg-wire-300'
                    }`}
                  >
                    {page.name}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Site Navigation */}
        {project.navigationConfig && (
          <SiteNavigation 
            config={project.navigationConfig} 
            onNavigate={(href) => {
              // Handle logo click (home/welcome)
              if (href === '/' || href === 'index.html') {
                goToPage(0);
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
                  goToPage(targetIndex);
                }
              }
            }}
          />
        )}

        {currentPage.components.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-wire-400">
            <div className="text-center">
              <p className="text-lg mb-2">This page is empty</p>
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

        {/* Help text popup */}
        <HelpPopup
          component={activeHelpComponent}
          onClose={() => setActiveHelpComponent(null)}
        />

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
                  goToPage(targetIndex);
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Publish;

