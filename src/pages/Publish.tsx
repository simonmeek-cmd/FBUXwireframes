import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigation } from '../components/wireframe/SiteNavigation';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { WelcomePage } from '../components/wireframe/WelcomePage';
import { getHelpText } from '../utils/componentHelp';
import { getComponentMeta } from '../components/builder/componentRegistry';
import type { Project, Page, PlacedComponent } from '../types/builder';

// Temporary switch to isolate React #310 loop; set to true to re-enable comments
const COMMENTS_ENABLED = false;

type CommentRecord = {
  id: string;
  project_id: string;
  page_id: string | null;
  target_id: string | null;
  x_pct: number | null;
  y_pct: number | null;
  comment_text: string;
  author_name: string;
  author_email: string | null;
  created_at: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';
// Diagnostic flags to isolate render loop – adjust one at a time
const PUBLISH_DIAG = false; // when true, bypasses publish rendering
const SHOW_NAV = false;     // render site navigation
const SHOW_TABS = false;    // render page tabs
const SHOW_CONTENT = false; // render page components
const SHOW_FOOTER = false;  // render site footer

// Component wrapper with info icon for annotations
const AnnotatedComponent: React.FC<{
  component: PlacedComponent;
  showAnnotations: boolean;
  onShowHelp: (component: PlacedComponent) => void;
  commentMode: boolean;
  comments: CommentRecord[];
  onAddComment: (targetId: string, xPct: number, yPct: number) => void;
}> = ({ component, showAnnotations, onShowHelp, commentMode, comments, onAddComment }) => {
  const [isHovered, setIsHovered] = useState(false);
  const meta = getComponentMeta(component.type);

  return (
    <div
      className="relative group"
      onClick={(e) => {
        if (!commentMode) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const xPct = (e.clientX - rect.left) / rect.width;
        const yPct = (e.clientY - rect.top) / rect.height;
        onAddComment(component.id, xPct, yPct);
      }}
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

      {/* Comment markers */}
      {comments.map((c) => {
        if (c.x_pct == null || c.y_pct == null) return null;
        return (
          <div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x_pct * 100}%`, top: `${c.y_pct * 100}%` }}
            title={`${c.author_name}: ${c.comment_text}`}
          >
            <div className="w-8 h-8 rounded-full bg-wire-700 text-white text-sm font-bold flex items-center justify-center shadow">
              {c.author_name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        );
      })}
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
  const [commentMode, setCommentMode] = useState(false);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [authorName, setAuthorName] = useState<string>(() => localStorage.getItem('wb_comment_author') || '');

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
  
  // Load comments for this project/page
  useEffect(() => {
    if (!COMMENTS_ENABLED) return;
    let isMounted = true;
    const fetchComments = async () => {
      if (!projectId) return;
      try {
        const qs = new URLSearchParams({ projectId });
        if (pageId) qs.set('pageId', pageId);
        const res = await fetch(`${API_BASE_URL}/comments?${qs.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setComments(data || []);
      } catch (err) {
        console.error('Error fetching comments', err);
      }
    };
    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [projectId, pageId]);
  
  // Derive current page directly (no extra state/effect)
  const currentPage = pageId
    ? pages.find((p) => p.id === pageId) || pages[0]
    : pages[0];
  const currentPageIndex = currentPage ? pages.findIndex((p) => p.id === currentPage.id) : 0;

  const handleAddComment = async (targetId: string, xPct: number, yPct: number) => {
    if (!COMMENTS_ENABLED) return;
    let name = authorName;
    if (!name) {
      name = window.prompt('Your name (shown with comment):', '') || '';
      if (!name.trim()) return;
      setAuthorName(name);
      localStorage.setItem('wb_comment_author', name);
    }
    const message = window.prompt('Add comment:', '');
    if (!message || !message.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pageId: pageId || null,
          targetId,
          xPct,
          yPct,
          authorName: name.trim(),
          message: message.trim(),
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error('Error posting comment', err);
    }
  };

  const pageComments = comments.filter((c) => {
    if (pageId) return c.page_id === pageId;
    return !c.page_id;
  });

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
    if (PUBLISH_DIAG) {
      return (
        <div className="min-h-screen bg-wire-50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-wire-700 font-semibold">Publish diagnostic mode</p>
            <p className="text-wire-500 text-sm">Welcome page view is temporarily disabled while isolating a render loop.</p>
          </div>
        </div>
      );
    }
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

  if (PUBLISH_DIAG) {
    return (
      <div className="min-h-screen bg-wire-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-wire-700 font-semibold">Publish diagnostic mode</p>
          <p className="text-wire-500 text-sm">Page rendering temporarily disabled while isolating a render loop.</p>
        </div>
      </div>
    );
  }

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      // Navigate to the page using the page ID
      window.location.href = `/publish/${projectId}/${pages[index].id}`;
    }
  };

  return (
    <div className="min-h-screen bg-wire-50">
      {/* Comment mode toggle (disabled while isolating loop) */}
      {COMMENTS_ENABLED && (
        <div className="bg-wire-200 border-b border-wire-300 px-4 py-2 sticky top-0 z-50 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={commentMode}
              onChange={(e) => setCommentMode(e.target.checked)}
            />
            <span>Add comments</span>
          </label>
          {commentMode && <span className="text-xs text-wire-500">Click on a component to place a comment</span>}
        </div>
      )}

      {/* Page navigation tabs */}
      {SHOW_TABS && pages.length > 1 && (
        <div className="bg-wire-200 border-b border-wire-300 px-4 py-2 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
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
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Site Navigation */}
        {SHOW_NAV && project.navigationConfig && (
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

        {SHOW_CONTENT ? (
          currentPage.components.length === 0 ? (
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
                    commentMode={COMMENTS_ENABLED ? commentMode : false}
                    comments={COMMENTS_ENABLED ? pageComments.filter((c) => c.target_id === component.id) : []}
                    onAddComment={handleAddComment}
                  />
                ))}
            </div>
          )
        ) : (
          <div className="p-8 text-center text-wire-500 text-sm">Content disabled (diagnostic)</div>
        )}

        {/* Help text popup */}
        <HelpPopup
          component={activeHelpComponent}
          onClose={() => setActiveHelpComponent(null)}
        />

        {/* Site Footer */}
        {SHOW_FOOTER && project.footerConfig && (
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

