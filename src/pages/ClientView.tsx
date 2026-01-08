import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useBuilderStore } from '../stores/useBuilderStore';

export const ClientView: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { getClient, getProjectsForClient, addProject, deleteProject, duplicateProject, updateProject } = useBuilderStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renamingProjectName, setRenamingProjectName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const client = clientId ? getClient(clientId) : undefined;
  const projects = clientId ? getProjectsForClient(clientId) : [];

  // Update page title
  useEffect(() => {
    if (client) {
      document.title = `FBUX | ${client.name}`;
    } else {
      document.title = 'FBUX';
    }
    return () => {
      document.title = 'FBUX';
    };
  }, [client]);

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
    setOpenMenuId(null);
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

  const handleRenameProject = (id: string, currentName: string) => {
    setOpenMenuId(null);
    setRenamingProjectId(id);
    setRenamingProjectName(currentName);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingProjectId || !renamingProjectName.trim()) return;

    try {
      await updateProject(renamingProjectId, renamingProjectName.trim());
      setRenamingProjectId(null);
      setRenamingProjectName('');
    } catch (err: any) {
      console.error('Failed to rename project:', err);
      alert('Failed to rename project. Please try again.');
    }
  };

  const handleCancelRename = () => {
    setRenamingProjectId(null);
    setRenamingProjectName('');
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
              <div key={project.id}>
                {renamingProjectId === project.id ? (
                  <form onSubmit={handleSaveRename} className="p-4 bg-wire-50 border border-wire-200 rounded">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={renamingProjectName}
                        onChange={(e) => setRenamingProjectName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="px-4 py-2 border border-wire-400 text-wire-600 rounded hover:bg-wire-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-wire-50 border border-wire-200 rounded hover:bg-wire-100 transition-colors">
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
                    <div className="flex gap-2 items-center">
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
                      
                      {/* Three-dot menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                          className="p-1.5 text-wire-500 hover:text-wire-700 hover:bg-wire-100 rounded transition-colors"
                          title="Project options"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </button>
                        
                        {openMenuId === project.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-8 z-20 bg-white border border-wire-300 rounded shadow-lg min-w-[160px]">
                              <button
                                onClick={() => handleRenameProject(project.id, project.name)}
                                className="w-full text-left px-4 py-2 text-sm text-wire-700 hover:bg-wire-50 transition-colors"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => handleDuplicateProject(project.id, project.name)}
                                className="w-full text-left px-4 py-2 text-sm text-wire-700 hover:bg-wire-50 transition-colors"
                              >
                                Duplicate
                              </button>
                              <div className="border-t border-wire-200" />
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleDeleteProject(project.id, project.name);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientView;


