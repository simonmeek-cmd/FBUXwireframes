import React, { useState } from 'react';
import { clientsApi, projectsApi, pagesApi } from '../api/client';
import { supabase } from '../lib/supabase';

// Helper to read from localStorage (old format)
const loadClients = (): any[] => {
  try {
    const data = localStorage.getItem('wireframe-builder-clients');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadProjects = (): any[] => {
  try {
    const data = localStorage.getItem('wireframe-builder-projects');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const MigrateData: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [jsonData, setJsonData] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setJsonData(data);
        setStatus('✅ JSON file loaded successfully!');
      } catch (error) {
        setStatus('❌ Error: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const migrateFarleighHospice = async () => {
    setLoading(true);
    setStatus('Starting migration...');

    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in first');
      }

      // Load data from JSON file or localStorage
      let clients: any[] = [];
      let projects: any[] = [];

      if (jsonData) {
        // Use uploaded JSON data
        setStatus('Using uploaded JSON data...');
        // Handle different JSON structures
        if (Array.isArray(jsonData)) {
          // If JSON is an array, it might be the projects array
          projects = jsonData;
          clients = [];
        } else if (jsonData.clients && jsonData.projects) {
          // Standard structure: { clients: [], projects: [] }
          clients = jsonData.clients || [];
          projects = jsonData.projects || [];
        } else if (jsonData.clients) {
          // Only clients in JSON
          clients = jsonData.clients || [];
          projects = [];
        } else if (jsonData.projects) {
          // Only projects in JSON - try to extract client info from projects
          projects = jsonData.projects || [];
          // Extract unique clients from projects
          const clientMap = new Map();
          projects.forEach((p: any) => {
            if (p.clientId && !clientMap.has(p.clientId)) {
              // Try to find client name from project data or use a placeholder
              clientMap.set(p.clientId, {
                id: p.clientId,
                name: p.clientName || 'Unknown Client',
              });
            }
          });
          clients = Array.from(clientMap.values());
        } else {
          throw new Error('Invalid JSON structure. Expected { "clients": [], "projects": [] }');
        }
        setStatus(`Loaded ${clients.length} client(s) and ${projects.length} project(s) from JSON`);
      } else {
        // Fall back to localStorage
        setStatus('Loading data from localStorage...');
        clients = loadClients();
        projects = loadProjects();
      }

      // Find Farleigh Hospice client
      const farleighClient = clients.find((c: any) =>
        c.name.toLowerCase().includes('farleigh') ||
        c.name.toLowerCase().includes('hospice')
      );

      if (!farleighClient) {
        const clientNames = clients.map((c: any) => c.name).join(', ');
        throw new Error(
          `Farleigh Hospice client not found. Available clients: ${clientNames || 'none'}. ` +
          `Please check your JSON file structure. Expected: { "clients": [...], "projects": [...] }`
        );
      }

      setStatus(`Found client: ${farleighClient.name}`);

      // Find all projects for this client
      const farleighProjects = projects.filter((p: any) => p.clientId === farleighClient.id);
      setStatus(`Found ${farleighProjects.length} project(s) for this client`);

      // Step 1: Create the client in Supabase
      setStatus('Creating client in Supabase...');
      const newClient = await clientsApi.create({
        name: farleighClient.name,
      });
      setStatus(`✅ Client created: ${newClient.name}`);

      // Step 2: Create each project
      let pagesMigrated = 0;
      for (const oldProject of farleighProjects) {
        setStatus(`Creating project: ${oldProject.name}...`);

        // Create project
        const newProject = await projectsApi.create({
          clientId: newClient.id,
          name: oldProject.name,
          navigationConfig: oldProject.navigationConfig,
          footerConfig: oldProject.footerConfig,
          welcomePageConfig: oldProject.welcomePageConfig,
          activeComponents: oldProject.activeComponents,
        });

        // Step 3: Create all pages for this project
        if (oldProject.pages && oldProject.pages.length > 0) {
          setStatus(`Creating ${oldProject.pages.length} page(s) for ${oldProject.name}...`);

          for (let i = 0; i < oldProject.pages.length; i++) {
            const oldPage = oldProject.pages[i];
            await pagesApi.create({
              project_id: newProject.id,
              name: oldPage.name,
              type: oldPage.type,
              components: oldPage.components || [],
              order_index: i,
            });
            pagesMigrated++;
          }
        }
      }

      setStatus(
        `🎉 Migration complete! Migrated ${farleighProjects.length} project(s) with ${pagesMigrated} page(s)`
      );
      setMigrated(true);
    } catch (error: any) {
      console.error('Migration failed:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if data exists in JSON or localStorage
  const clients = jsonData?.clients || loadClients();
  const projects = jsonData?.projects || loadProjects();
  const farleighClient = clients.find((c: any) =>
    c.name.toLowerCase().includes('farleigh') ||
    c.name.toLowerCase().includes('hospice')
  );
  const farleighProjects = farleighClient
    ? projects.filter((p: any) => p.clientId === farleighClient.id)
    : [];

  return (
    <div className="min-h-screen bg-wire-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-wire-800 mb-4">Data Migration</h1>
        <p className="text-wire-600 mb-6">
          Migrate Farleigh Hospice client from JSON backup or localStorage to Supabase
        </p>

        {/* File Upload Section */}
        <div className="bg-wire-50 border border-wire-300 rounded p-6 mb-6">
          <h2 className="font-bold text-wire-800 mb-3">Upload JSON Backup</h2>
          <p className="text-sm text-wire-600 mb-3">
            If you have a JSON backup file, upload it here. Otherwise, we'll try to use localStorage.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-wire-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-wire-600 file:text-white hover:file:bg-wire-700"
          />
          {jsonData && (
            <div className="text-sm text-green-700 mt-2">
              <p className="font-semibold">✅ JSON loaded successfully</p>
              <div className="mt-2 text-xs text-wire-600">
                <p>Structure detected:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Clients: {jsonData.clients?.length || 0}</li>
                  <li>Projects: {jsonData.projects?.length || 0}</li>
                </ul>
                {jsonData.clients && jsonData.clients.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Client names found:</p>
                    <ul className="list-disc list-inside ml-2">
                      {jsonData.clients.map((c: any, i: number) => (
                        <li key={i}>{c.name || `Client ${i + 1}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {farleighClient ? (
          <div className="bg-wire-50 border border-wire-300 rounded p-6 mb-6">
            <h2 className="font-bold text-wire-800 mb-2">Found in localStorage:</h2>
            <ul className="list-disc list-inside text-wire-700 space-y-1">
              <li>Client: {farleighClient.name}</li>
              <li>Projects: {farleighProjects.length}</li>
              <li>
                Total pages:{' '}
                {farleighProjects.reduce((sum: number, p: any) => sum + (p.pages?.length || 0), 0)}
              </li>
            </ul>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-6 mb-6">
            <p className="text-yellow-800">
              ⚠️ Farleigh Hospice client not found. Please upload your JSON backup file above, or
              make sure you're on the same browser/device where you have the localStorage data.
            </p>
          </div>
        )}

        <div className="bg-white border border-wire-300 rounded p-6">
          <h2 className="font-bold text-wire-800 mb-4">Migration Status</h2>
          {status && (
            <div className="mb-4 p-3 bg-wire-50 rounded text-sm text-wire-700 whitespace-pre-wrap">
              {status}
            </div>
          )}

          {migrated ? (
            <div className="p-4 bg-green-50 border border-green-300 rounded">
              <p className="text-green-800 font-semibold">✅ Migration successful!</p>
              <p className="text-green-700 text-sm mt-2">
                Please refresh the page to see your migrated data.
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={migrateFarleighHospice}
                disabled={loading || (!farleighClient && !jsonData)}
                className="px-4 py-2 bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Migrating...' : 'Start Migration'}
              </button>
              {!farleighClient && jsonData && (
                <p className="text-sm text-wire-600 mt-2">
                  Note: Will migrate from uploaded JSON file
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrateData;

