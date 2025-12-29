import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ComponentRenderer } from '../components/builder/ComponentRenderer';
import { SiteNavigation } from '../components/wireframe/SiteNavigation';
import { SiteFooter } from '../components/wireframe/SiteFooter';
import { WelcomePage } from '../components/wireframe/WelcomePage';
import { getHelpText } from '../utils/componentHelp';
import { getComponentMeta } from '../components/builder/componentRegistry';
import type { Project, PlacedComponent } from '../types/builder';
import { sortPagesForDisplay } from '../utils/pageSort';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

// Comment type matching the database schema
interface Comment {
  id: string;
  project_id: string;
  page_id: string | null;
  target_id: string | null;
  x_pct: number | null;
  y_pct: number | null;
  comment_text: string;
  author_name: string;
  author_email: string | null;
  status: 'new' | 'resolved' | 'archived';
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

// Comment marker component
const CommentMarker: React.FC<{
  comment: Comment;
  onClick: (e: React.MouseEvent) => void;
}> = ({ comment, onClick }) => {
  const style: React.CSSProperties = {};
  if (comment.x_pct !== null && comment.y_pct !== null) {
    style.position = 'absolute';
    style.left = `${comment.x_pct * 100}%`;
    style.top = `${comment.y_pct * 100}%`;
    style.transform = 'translate(-50%, -50%)';
  }

  // Get first initial of author name
  const initial = comment.author_name?.charAt(0).toUpperCase() || '?';

  return (
    <button
      onClick={onClick}
      className={`absolute w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-blue-600 transition-colors z-30 cursor-pointer ${
        comment.status === 'resolved' ? 'opacity-60' : ''
      }`}
      style={style}
      title={`Comment by ${comment.author_name}${comment.status === 'resolved' ? ' (resolved)' : ''}`}
    >
      {comment.status === 'resolved' ? '✓' : initial}
    </button>
  );
};

// Component wrapper with info icon for annotations and comment markers
const AnnotatedComponent: React.FC<{
  component: PlacedComponent;
  showAnnotations: boolean;
  onShowHelp: (component: PlacedComponent) => void;
  comments?: Comment[];
  onShowComment: (comment: Comment) => void;
  commentMode?: boolean;
  onAddComment?: (component: PlacedComponent, xPct: number, yPct: number) => void;
}> = ({ component, showAnnotations, onShowHelp, comments = [], onShowComment, commentMode = false, onAddComment }) => {
  const [isHovered, setIsHovered] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const meta = getComponentMeta(component.type);
  
  // Filter comments for this component
  const componentComments = useMemo(() => {
    const filtered = comments.filter(c => c.target_id === component.id);
    // Debug logging
    if (filtered.length > 0) {
      console.log('Component comments found:', filtered.length, 'for component', component.id);
    }
    return filtered;
  }, [comments, component.id]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentMode || !onAddComment || !componentRef.current) return;
    
    // Calculate click position relative to component
    const rect = componentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = rect.width > 0 ? x / rect.width : 0.5;
    const yPct = rect.height > 0 ? y / rect.height : 0.5;
    
    onAddComment(component, xPct, yPct);
  };

  return (
    <div
      ref={componentRef}
      className={`relative group ${commentMode ? 'cursor-crosshair' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <ComponentRenderer type={component.type} props={component.props} />
      
      {/* Comment mode indicator */}
      {commentMode && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/20 pointer-events-none z-10">
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Click to add comment
          </div>
        </div>
      )}
      
      {/* Comment markers */}
      {componentComments.map((comment) => (
        <CommentMarker
          key={comment.id}
          comment={comment}
          onClick={(e) => {
            e.stopPropagation();
            onShowComment(comment);
          }}
        />
      ))}
      
      {/* Info icon - appears on hover when annotations are enabled */}
      {showAnnotations && isHovered && !commentMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowHelp(component);
          }}
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

// Comment popup/modal (for viewing existing comments)
const CommentPopup: React.FC<{
  comment: Comment | null;
  onClose: () => void;
}> = ({ comment, onClose }) => {
  if (!comment) return null;

  const date = new Date(comment.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200 bg-wire-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              💬
            </div>
            <div>
              <h3 className="font-bold text-wire-800">Comment</h3>
              <p className="text-xs text-wire-500">by {comment.author_name}</p>
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
          <p className="text-wire-700 leading-relaxed whitespace-pre-wrap mb-4">{comment.comment_text}</p>
          <div className="text-xs text-wire-500 space-y-1">
            <p>Posted: {date}</p>
            {comment.author_email && <p>Email: {comment.author_email}</p>}
            <p>Status: <span className="capitalize">{comment.status}</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-wire-200 bg-wire-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-wire-700 text-white rounded hover:bg-wire-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// General comments sidebar
const GeneralCommentsSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onSubmit: (data: { authorName: string; authorEmail: string; message: string }) => Promise<void>;
  onCommentClick: (comment: Comment) => void;
}> = ({ isOpen, onClose, comments, onSubmit, onCommentClick }) => {
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('commentAuthorName') || '';
  });
  const [authorEmail, setAuthorEmail] = useState(() => {
    return localStorage.getItem('commentAuthorEmail') || '';
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter general comments (no target_id)
  const generalComments = useMemo(() => {
    return comments.filter(c => !c.target_id).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a comment');
      return;
    }
    if (!authorName.trim()) {
      setError('Please enter your name');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Save to localStorage for convenience
      localStorage.setItem('commentAuthorName', authorName);
      if (authorEmail) {
        localStorage.setItem('commentAuthorEmail', authorEmail);
      }

      await onSubmit({ authorName, authorEmail, message });
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-wire-300 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-wire-200 bg-wire-100">
        <h2 className="font-bold text-wire-800">General Comments</h2>
        <button
          onClick={onClose}
          className="p-2 text-wire-500 hover:text-wire-800 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Existing comments */}
        <div className="p-4 space-y-4">
          {generalComments.length > 0 ? (
            generalComments.map((comment) => {
              const date = new Date(comment.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
              const initial = comment.author_name?.charAt(0).toUpperCase() || '?';
              
              return (
                <div
                  key={comment.id}
                  onClick={() => onCommentClick(comment)}
                  className="p-3 bg-wire-50 border border-wire-200 rounded cursor-pointer hover:bg-wire-100 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-wire-800 text-sm">{comment.author_name}</span>
                        <span className="text-xs text-wire-500">{date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-wire-700 whitespace-pre-wrap line-clamp-3">{comment.comment_text}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-wire-500 text-center py-8">No general comments yet</p>
          )}
        </div>
      </div>

      {/* Form - fixed at bottom */}
      <div className="border-t border-wire-200 bg-wire-50 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="generalAuthorName" className="block text-xs font-medium text-wire-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              id="generalAuthorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full px-2 py-1.5 text-sm border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="John Doe"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="generalAuthorEmail" className="block text-xs font-medium text-wire-700 mb-1">
              Your Email
            </label>
            <input
              id="generalAuthorEmail"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="john@example.com"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="generalMessage" className="block text-xs font-medium text-wire-700 mb-1">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="generalMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full px-2 py-1.5 text-sm border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="Add your general feedback here..."
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Comment form modal (for adding new comments)
const CommentForm: React.FC<{
  component: PlacedComponent | null;
  xPct: number;
  yPct: number;
  onClose: () => void;
  onSubmit: (data: { authorName: string; authorEmail: string; message: string }) => Promise<void>;
}> = ({ component, xPct, yPct, onClose, onSubmit }) => {
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('commentAuthorName') || '';
  });
  const [authorEmail, setAuthorEmail] = useState(() => {
    return localStorage.getItem('commentAuthorEmail') || '';
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!component) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a comment');
      return;
    }
    if (!authorName.trim()) {
      setError('Please enter your name');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Save to localStorage for convenience
      localStorage.setItem('commentAuthorName', authorName);
      if (authorEmail) {
        localStorage.setItem('commentAuthorEmail', authorEmail);
      }

      await onSubmit({ authorName, authorEmail, message });
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200 bg-wire-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              💬
            </div>
            <div>
              <h3 className="font-bold text-wire-800">Add Comment</h3>
              <p className="text-xs text-wire-500">{getComponentMeta(component.type)?.label || component.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-wire-500 hover:text-wire-800 rounded"
            disabled={submitting}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-wire-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="John Doe"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="authorEmail" className="block text-sm font-medium text-wire-700 mb-1">
              Your Email
            </label>
            <input
              id="authorEmail"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="w-full px-3 py-2 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="john@example.com"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-wire-700 mb-1">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
              placeholder="Add your feedback here..."
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-wire-300 text-wire-700 rounded hover:bg-wire-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </form>
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const [commentMode, setCommentMode] = useState(false);
  const [pendingComment, setPendingComment] = useState<{ component: PlacedComponent; xPct: number; yPct: number } | null>(null);
  const [showGeneralCommentsSidebar, setShowGeneralCommentsSidebar] = useState(false);

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

  // Fetch comments when projectId or pageId changes
  const fetchComments = useCallback(async () => {
    if (!projectId) return;

    try {
      const url = `${API_BASE_URL}/comments?projectId=${projectId}${pageId ? `&pageId=${pageId}` : ''}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const commentsArray = Array.isArray(data) ? data : [];
        console.log('Fetched comments:', commentsArray.length, 'for pageId:', pageId);
        console.log('Comments data:', commentsArray);
        setComments(commentsArray);
      } else {
        // Comments are optional, so we don't treat errors as fatal
        console.warn('Failed to fetch comments:', response.statusText);
        setComments([]);
      }
    } catch (err) {
      console.warn('Error fetching comments:', err);
      setComments([]);
    }
  }, [projectId, pageId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle adding a new comment
  const handleAddComment = useCallback((component: PlacedComponent, xPct: number, yPct: number) => {
    setPendingComment({ component, xPct, yPct });
  }, []);

  // Submit comment (component-specific)
  const handleSubmitComment = useCallback(async (data: { authorName: string; authorEmail: string; message: string }) => {
    if (!projectId || !pendingComment) return;

    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        pageId: pageId || null,
        targetId: pendingComment.component.id,
        xPct: pendingComment.xPct,
        yPct: pendingComment.yPct,
        authorName: data.authorName,
        authorEmail: data.authorEmail || null,
        message: data.message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit comment');
    }

    const newComment = await response.json();
    console.log('Comment submitted successfully:', newComment);

    // Refresh comments
    await fetchComments();
  }, [projectId, pageId, pendingComment, fetchComments]);

  // Submit general comment (no target_id, x_pct, y_pct)
  const handleSubmitGeneralComment = useCallback(async (data: { authorName: string; authorEmail: string; message: string }) => {
    if (!projectId) return;

    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        pageId: pageId || null,
        targetId: null,
        xPct: null,
        yPct: null,
        authorName: data.authorName,
        authorEmail: data.authorEmail || null,
        message: data.message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit comment');
    }

    const newComment = await response.json();
    console.log('General comment submitted successfully:', newComment);

    // Refresh comments
    await fetchComments();
  }, [projectId, pageId, fetchComments]);

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
  const sortedPages = sortPagesForDisplay(pages);
  
  // If no pageId specified, show welcome page
  const showWelcomePage = !pageId;
  
  // Derive current page directly (no extra state/effect)
  const currentPage = pageId
    ? sortedPages.find((p) => p.id === pageId) || sortedPages[0]
    : sortedPages[0];
  const currentPageIndex = currentPage ? sortedPages.findIndex((p) => p.id === currentPage.id) : 0;

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
        pages={sortedPages}
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
    if (index >= 0 && index < sortedPages.length) {
      // Navigate to the page using the page ID
      window.location.href = `/publish/${projectId}/${sortedPages[index].id}`;
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

          {/* Comment mode toggle */}
          <span className="h-6 w-px bg-wire-300 mx-1" aria-hidden="true" />
          <button
            onClick={() => setCommentMode(!commentMode)}
            className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
              commentMode
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-wire-50 text-wire-700 border-wire-400 hover:bg-wire-300'
            }`}
            title={commentMode ? 'Exit comment mode' : 'Enable comment mode'}
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
              <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
              <path d="M7 11h10"/>
              <path d="M7 15h6"/>
              <path d="M7 7h8"/>
            </svg>
          </button>

          {/* General comments button (only when comment mode is active) */}
          {commentMode && (
            <>
              <span className="h-6 w-px bg-wire-300 mx-1" aria-hidden="true" />
              <button
                onClick={() => setShowGeneralCommentsSidebar(!showGeneralCommentsSidebar)}
                className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors ${
                  showGeneralCommentsSidebar
                    ? 'bg-blue-500 text-white'
                    : 'bg-wire-100 text-wire-700 hover:bg-wire-300'
                }`}
                title="Add general comments"
              >
                📝 General Comments
              </button>
            </>
          )}

          {/* Page tabs */}
          {sortedPages.length > 1 && (
            <>
              <span className="h-6 w-px bg-wire-300 mx-1" aria-hidden="true" />
              {sortedPages.map((page, index) => {
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
              const targetPage = sortedPages.find(p => 
                p.name.toLowerCase() === href.replace(/^\//, '').toLowerCase() ||
                p.name.toLowerCase().replace(/\s+/g, '-') === href.replace(/^\//, '').toLowerCase()
              );
              if (targetPage) {
                const targetIndex = sortedPages.findIndex(p => p.id === targetPage.id);
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
                  comments={comments}
                  onShowComment={setActiveComment}
                  commentMode={commentMode}
                  onAddComment={handleAddComment}
                />
              ))}
          </div>
        )}

        {/* Help text popup */}
        <HelpPopup
          component={activeHelpComponent}
          onClose={() => setActiveHelpComponent(null)}
        />

        {/* Comment popup (view existing) */}
        <CommentPopup
          comment={activeComment}
          onClose={() => setActiveComment(null)}
        />

        {/* Comment form (add new) */}
        {pendingComment && (
          <CommentForm
            component={pendingComment.component}
            xPct={pendingComment.xPct}
            yPct={pendingComment.yPct}
            onClose={() => setPendingComment(null)}
            onSubmit={handleSubmitComment}
          />
        )}

        {/* General comments sidebar */}
        <GeneralCommentsSidebar
          isOpen={showGeneralCommentsSidebar}
          onClose={() => setShowGeneralCommentsSidebar(false)}
          comments={comments}
          onSubmit={handleSubmitGeneralComment}
          onCommentClick={setActiveComment}
        />

        {/* Site Footer */}
        {project.footerConfig && (
          <SiteFooter 
            config={project.footerConfig}
            onNavigate={(href) => {
              const targetPage = sortedPages.find(p => 
                p.name.toLowerCase() === href.replace(/^\//, '').toLowerCase() ||
                p.name.toLowerCase().replace(/\s+/g, '-') === href.replace(/^\//, '').toLowerCase()
              );
              if (targetPage) {
                const targetIndex = sortedPages.findIndex(p => p.id === targetPage.id);
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

