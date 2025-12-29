import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useBuilderStore } from '../stores/useBuilderStore';

export const ClientView: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { getClient, getProjectsForClient, addProject, deleteProject, duplicateProject } = useBuilderStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const client = clientId ? getClient(clientId) : undefined;
  const projects = clientId ? getProjectsForClient(clientId) : [];

  if (!client) {
    return <Navigate to="/" replace />;
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && clientId) {
      addProject(clientId, newProjectName.trim());
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Delete project "${name}" and all its pages?`)) {
      deleteProject(id);
    }
  };

  const handleDuplicateProject = async (id: string, name: string) => {
    if (!confirm(`Duplicate project "${name}"? This will create a copy with all pages and settings, but without comments.`)) {
      return;
    }

    try {
      const newProjectId = await duplicateProject(id);
      // Navigate to the new project
      window.location.href = `/project/${newProjectId}`;
    } catch (err: any) {
      console.error('Failed to duplicate project:', err);
      alert('Failed to duplicate project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-wire-400 hover:text-wire-200 text-sm mb-2 inline-block">
            ← Back to Clients
          </Link>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-wire-400 mt-1">Wireframe projects</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-wire-800">Projects</h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
            >
              + New Project
            </button>
          )}
        </div>

        {/* Add project form */}
        {isAdding && (
          <form onSubmit={handleAddProject} className="mb-6 p-4 bg-wire-200 rounded border border-wire-300">
            <label className="block text-sm font-medium text-wire-700 mb-2">
              Project Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Website Redesign 2024"
                className="flex-1 px-3 py-2 bg-wire-50 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewProjectName('');
                }}
                className="px-4 py-2 border border-wire-400 text-wire-600 rounded hover:bg-wire-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Project list */}
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-wire-50 rounded border border-wire-200">
            <p className="text-wire-500 mb-4">No projects yet for this client</p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-wire-600 underline underline-offset-2 hover:text-wire-800"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-wire-50 border border-wire-200 rounded hover:bg-wire-100 transition-colors"
              >
                <div>
                  <Link
                    to={`/project/${project.id}`}
                    className="font-medium text-wire-800 hover:text-wire-600"
                  >
                    {project.name}
                  </Link>
                  <p className="text-sm text-wire-500">
                    {project.pages.length} page{project.pages.length !== 1 ? 's' : ''} • 
                    Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/project/${project.id}`}
                    className="px-3 py-1.5 text-sm bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors no-underline"
                  >
                    Edit Pages
                  </Link>
                  {project.pages.length > 0 && (
                    <Link
                      to={`/preview/${project.id}`}
                      className="px-3 py-1.5 text-sm bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors no-underline"
                    >
                      Preview
                    </Link>
                  )}
                  <button
                    onClick={() => handleDuplicateProject(project.id, project.name)}
                    className="px-3 py-1.5 text-sm text-wire-500 hover:text-wire-700 hover:bg-wire-100 rounded transition-colors"
                    title="Duplicate project"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
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
    </div>
  );
};

export default ClientView;


