import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigation } from '../components/wireframe/SiteNavigation';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { WelcomePage } from '../components/wireframe/WelcomePage';
import type { Project, Page } from '../types/builder';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

export const Publish: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId?: string }>();
  const [project, setProject] = useState<Project & { clientName?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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
  
  // If pageId is specified, find that page
  const currentPage = pageId 
    ? pages.find(p => p.id === pageId)
    : pages[currentPageIndex];

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
      />
    );
  }

  if (!currentPage) {
    return <Navigate to={`/publish/${projectId}`} replace />;
  }

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      // Update URL without navigation
      window.history.pushState({}, '', `/publish/${projectId}/${pages[index].id}`);
    }
  };

  return (
    <div className="min-h-screen bg-wire-50">
      {/* Page navigation tabs */}
      {pages.length > 1 && (
        <div className="bg-wire-200 border-b border-wire-300 px-4 py-2 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => goToPage(index)}
                className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors ${
                  index === currentPageIndex
                    ? 'bg-wire-600 text-white'
                    : 'bg-wire-100 text-wire-700 hover:bg-wire-300'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
                <ComponentRenderer
                  key={component.id}
                  type={component.type}
                  props={component.props}
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

