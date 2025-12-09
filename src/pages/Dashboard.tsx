import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBuilderStore } from '../stores/useBuilderStore';
import { exportAllDataJSON } from '../utils/exportStaticSite';

export const Dashboard: React.FC = () => {
  const { clients, projects, addClient, deleteClient, initialize } = useBuilderStore();
  const [newClientName, setNewClientName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName.trim()) {
      addClient(newClientName.trim());
      setNewClientName('');
      setIsAdding(false);
    }
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Delete client "${name}" and all their projects?`)) {
      deleteClient(id);
    }
  };

  const handleExportBackup = () => {
    exportAllDataJSON(clients, projects);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Validate structure
        if (!data.clients || !data.projects || !Array.isArray(data.clients) || !Array.isArray(data.projects)) {
          throw new Error('Invalid backup file format');
        }

        // Confirm import
        const clientCount = data.clients.length;
        const projectCount = data.projects.length;
        if (!confirm(`Import ${clientCount} client(s) and ${projectCount} project(s)?\n\nThis will REPLACE all existing data.`)) {
          return;
        }

        // Save to localStorage
        localStorage.setItem('wireframe-builder-clients', JSON.stringify(data.clients));
        localStorage.setItem('wireframe-builder-projects', JSON.stringify(data.projects));
        
        // Reload store
        initialize();
        
        setImportStatus(`Successfully imported ${clientCount} client(s) and ${projectCount} project(s)`);
        setTimeout(() => setImportStatus(null), 5000);
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('Import failed. Please check the file format.');
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Wireframe Builder</h1>
          <p className="text-wire-400 mt-1">Manage clients and create wireframe prototypes</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Backup/Restore Section */}
        <div className="mb-8 p-4 bg-wire-50 border border-wire-200 rounded">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-wire-800">Backup & Restore</h3>
              <p className="text-sm text-wire-600 mt-1">
                {clients.length} client(s), {projects.length} project(s)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportBackup}
                disabled={clients.length === 0}
                className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Export All Data
              </button>
              <label className="px-4 py-2 bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors cursor-pointer">
                📂 Import Backup
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {importStatus && (
            <p className={`mt-2 text-sm ${importStatus.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
              {importStatus}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-wire-800">Clients</h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
            >
              + Add Client
            </button>
          )}
        </div>

        {/* Add client form */}
        {isAdding && (
          <form onSubmit={handleAddClient} className="mb-6 p-4 bg-wire-200 rounded border border-wire-300">
            <label className="block text-sm font-medium text-wire-700 mb-2">
              Client Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Enter client name..."
                className="flex-1 px-3 py-2 bg-wire-50 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewClientName('');
                }}
                className="px-4 py-2 border border-wire-400 text-wire-600 rounded hover:bg-wire-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Client list */}
        {clients.length === 0 ? (
          <div className="text-center py-12 bg-wire-50 rounded border border-wire-200">
            <p className="text-wire-500 mb-4">No clients yet</p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-wire-600 underline underline-offset-2 hover:text-wire-800"
              >
                Add your first client
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 bg-wire-50 border border-wire-200 rounded hover:bg-wire-100 transition-colors"
              >
                <div>
                  <Link
                    to={`/client/${client.id}`}
                    className="font-medium text-wire-800 hover:text-wire-600"
                  >
                    {client.name}
                  </Link>
                  <p className="text-sm text-wire-500">
                    Created {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/client/${client.id}`}
                    className="px-3 py-1.5 text-sm bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors no-underline"
                  >
                    View Projects
                  </Link>
                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="px-3 py-1.5 text-sm text-wire-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer link to showcase */}
        <div className="mt-12 pt-6 border-t border-wire-200 text-center">
          <Link
            to="/showcase"
            className="text-sm text-wire-500 hover:text-wire-700"
          >
            View Component Showcase →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


