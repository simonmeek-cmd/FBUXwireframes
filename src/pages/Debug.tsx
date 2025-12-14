import React, { useState } from 'react';
import { loadProjects, saveProjects, exportAllData } from '../utils/storage';
import type { Project, PlacedComponent } from '../types/builder';

export const Debug: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(loadProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [issues, setIssues] = useState<string[]>([]);
  const [fixed, setFixed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedPage = selectedProject?.pages.find(p => p.id === selectedPageId);

  const scanForIssues = () => {
    setScanning(true);
    setScanComplete(false);
    setIssues([]);
    
    // Small delay to show scanning state
    setTimeout(() => {
      const foundIssues: string[] = [];
      
      projects.forEach(project => {
        project.pages.forEach(page => {
          // Check if components array exists
          if (!Array.isArray(page.components)) {
            foundIssues.push(`❌ ${project.name} > ${page.name}: Missing or invalid components array`);
          } else {
            // Check each component
            page.components.forEach((comp, index) => {
              if (!comp || typeof comp !== 'object') {
                foundIssues.push(`❌ ${project.name} > ${page.name}: Component at index ${index} is invalid or null`);
                return;
              }
              if (!comp.id) {
                foundIssues.push(`❌ ${project.name} > ${page.name}: Component at index ${index} missing ID`);
              }
              if (!comp.type) {
                foundIssues.push(`❌ ${project.name} > ${page.name}: Component ${comp.id || `at index ${index}`} missing type`);
              }
              if (typeof comp.order !== 'number') {
                foundIssues.push(`❌ ${project.name} > ${page.name}: Component ${comp.id || `at index ${index}`} has invalid order`);
              }
              if (!comp.props || typeof comp.props !== 'object') {
                foundIssues.push(`❌ ${project.name} > ${page.name}: Component ${comp.id || `at index ${index}`} missing or invalid props`);
              }
            });
          }
        });
      });

      setIssues(foundIssues);
      setScanComplete(true);
      setScanning(false);
    }, 300);
  };

  const repairData = () => {
    const repaired = projects.map(project => ({
      ...project,
      pages: project.pages.map(page => {
        // Ensure components array exists
        if (!Array.isArray(page.components)) {
          console.log(`Repairing: ${project.name} > ${page.name} - adding empty components array`);
          return { ...page, components: [] };
        }

        // Repair each component
        const repairedComponents: PlacedComponent[] = page.components
          .map((comp, index) => {
            // Filter out invalid components
            if (!comp || typeof comp !== 'object') {
              console.log(`Removing invalid component at index ${index} in ${page.name}`);
              return null;
            }

            // Ensure required fields
            let props = comp.props && typeof comp.props === 'object' ? { ...comp.props } : {};
            
            // Fix common prop issues
            if (comp.type === 'DetailPage') {
              // Fix tags - should be array
              if (props.tags && !Array.isArray(props.tags)) {
                if (typeof props.tags === 'string') {
                  props.tags = props.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
                } else {
                  props.tags = [];
                }
                console.log(`Fixed tags for DetailPage in ${page.name}`);
              }
            }

            const order = typeof comp.order === 'number' ? comp.order : index;
            return {
              id: comp.id || `comp-${Date.now()}-${index}`,
              type: comp.type || 'TextEditor',
              props,
              order,
              helpText: comp.helpText,
            } as PlacedComponent;
          })
          .filter((comp): comp is PlacedComponent => comp !== null && comp.id !== undefined)
          .sort((a, b) => a.order - b.order);

        return {
          ...page,
          components: repairedComponents,
        };
      }),
    }));

    setProjects(repaired);
    saveProjects(repaired);
    setFixed(true);
    setIssues([]);
    alert('Data repaired! Please refresh the page.');
  };

  const exportData = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wireframe-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewRawData = () => {
    if (!selectedPage) return;
    const data = JSON.stringify(selectedPage, null, 2);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<pre style="padding: 20px; font-family: monospace; white-space: pre-wrap;">${data}</pre>`);
    }
  };

  return (
    <div className="min-h-screen bg-wire-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-wire-800 mb-6">Debug & Repair Tool</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-wire-800 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scanForIssues}
              disabled={scanning}
              className="px-4 py-2 bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? 'Scanning...' : 'Scan for Issues'}
            </button>
            <button
              onClick={repairData}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Repair All Data
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors"
            >
              Export Backup
            </button>
          </div>
        </div>

        {scanning && (
          <div className="bg-wire-50 border border-wire-200 rounded-lg p-6 mb-6">
            <p className="text-wire-700">🔍 Scanning for issues...</p>
          </div>
        )}

        {scanComplete && issues.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-wire-800 mb-4">Found Issues ({issues.length})</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {issues.map((issue, i) => (
                <li key={i} className="text-sm text-wire-700 font-mono">
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {scanComplete && issues.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-800 font-bold">✅ No issues found! Your data looks healthy.</p>
          </div>
        )}

        {fixed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-800 font-bold">✅ Data has been repaired! Please refresh the page.</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-wire-800 mb-4">Inspect Page Data</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-wire-700 mb-2">Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedPageId('');
              }}
              className="w-full px-3 py-2 border border-wire-300 rounded"
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-wire-700 mb-2">Page</label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full px-3 py-2 border border-wire-300 rounded"
              >
                <option value="">Select a page...</option>
                {selectedProject.pages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedPage && (
            <div className="mt-4 p-4 bg-wire-50 rounded border border-wire-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-wire-800">{selectedPage.name}</h3>
                <button
                  onClick={viewRawData}
                  className="text-sm text-wire-600 hover:text-wire-800 underline"
                >
                  View Raw JSON
                </button>
              </div>
              <div className="text-sm text-wire-600 space-y-1">
                <p>Type: {selectedPage.type}</p>
                <p className={Array.isArray(selectedPage.components) ? 'text-green-700' : 'text-red-700 font-bold'}>
                  Components: {Array.isArray(selectedPage.components) ? selectedPage.components.length : 'INVALID - This is the problem!'}
                </p>
                {!Array.isArray(selectedPage.components) && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 text-xs">
                      ⚠️ This page has an invalid components array. Click "Repair All Data" to fix it.
                    </p>
                  </div>
                )}
                {Array.isArray(selectedPage.components) && selectedPage.components.length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-xs">
                      ℹ️ This page has no components. That's why it's blank! Add some components in the page builder.
                    </p>
                  </div>
                )}
                {Array.isArray(selectedPage.components) && selectedPage.components.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium mb-1">Component Details ({selectedPage.components.length} total):</p>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {selectedPage.components.map((comp, i) => {
                        const isValid = comp.type && comp.id && typeof comp.order === 'number' && comp.props;
                        // Check for common prop issues
                        const propIssues: string[] = [];
                        if (comp.props && typeof comp.props === 'object') {
                          // Check DetailPage tags
                          if (comp.type === 'DetailPage' && comp.props.tags && !Array.isArray(comp.props.tags)) {
                            propIssues.push('⚠️ tags should be an array, got: ' + typeof comp.props.tags);
                          }
                        }
                        return (
                          <div 
                            key={i} 
                            className={`p-2 rounded border ${isValid && propIssues.length === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                          >
                            <div className="font-mono text-xs space-y-1">
                              <p className={comp.id ? '' : 'text-red-700'}>
                                ID: {comp.id || '❌ MISSING'}
                              </p>
                              <p className={comp.type ? '' : 'text-red-700'}>
                                Type: {comp.type || '❌ MISSING'}
                              </p>
                              <p className={typeof comp.order === 'number' ? '' : 'text-red-700'}>
                                Order: {typeof comp.order === 'number' ? comp.order : '❌ INVALID'}
                              </p>
                              <p className={comp.props && typeof comp.props === 'object' ? '' : 'text-red-700'}>
                                Props: {comp.props && typeof comp.props === 'object' 
                                  ? `${Object.keys(comp.props).length} keys` 
                                  : '❌ INVALID'}
                              </p>
                              {propIssues.length > 0 && (
                                <div className="mt-1 p-1 bg-red-100 rounded text-red-800 text-xs">
                                  {propIssues.map((issue, idx) => (
                                    <p key={idx}>{issue}</p>
                                  ))}
                                </div>
                              )}
                              {comp.props && typeof comp.props === 'object' && Object.keys(comp.props).length > 0 && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-wire-600 hover:text-wire-800">View props</summary>
                                  <pre className="mt-1 p-1 bg-white rounded text-xs overflow-x-auto">
                                    {JSON.stringify(comp.props, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-wire-200 rounded-lg p-4 text-sm text-wire-600">
          <p className="font-bold mb-2">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Scan for Issues" to find problems</li>
            <li>Click "Repair All Data" to fix issues automatically</li>
            <li>Use "Inspect Page Data" to view specific pages</li>
            <li>Export a backup before making changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

