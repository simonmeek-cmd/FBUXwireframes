import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ComponentType } from '../types/builder';
import { WireframeShowcase } from './WireframeShowcase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

export const PublishShowcase: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeComponents, setActiveComponents] = useState<ComponentType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError('Project not found');
          setLoading(false);
          return;
        }
        const data = await response.json();
        // active_components comes from Supabase as text[] (ComponentType[])
        setActiveComponents(data.activeComponents || null);
      } catch (err) {
        console.error('Error loading project for showcase:', err);
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
        <div className="text-wire-600">Loading showcase...</div>
      </div>
    );
  }

  if (error || !activeComponents) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-wire-600">{error || 'Project not found'}</p>
          <p className="text-xs text-wire-400">
            Make sure this project has component availability configured.
          </p>
        </div>
      </div>
    );
  }

  return <WireframeShowcase activeComponentsOverride={activeComponents} />;
};

export default PublishShowcase;


