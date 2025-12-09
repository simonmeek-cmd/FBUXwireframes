import React, { useState, useRef, useCallback } from 'react';
import type { NavigationConfig } from '../../types/navigation';
import { defaultNavigationConfig, exampleNavigationJSON, validateNavigationConfig } from '../../types/navigation';
import { SiteNavigation } from '../wireframe/SiteNavigation';

interface NavigationSettingsProps {
  config: NavigationConfig | undefined;
  onSave: (config: NavigationConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationSettings: React.FC<NavigationSettingsProps> = ({
  config,
  onSave,
  isOpen,
  onClose,
}) => {
  const currentConfig = config || defaultNavigationConfig;
  const [jsonValue, setJsonValue] = useState(JSON.stringify(currentConfig, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // Constrain between 250px and 800px
    setPreviewWidth(Math.min(800, Math.max(250, newWidth)));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add/remove mouse event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      if (!validateNavigationConfig(parsed)) {
        setError('Invalid navigation config structure. Please check the format.');
        return;
      }
      onSave(parsed);
      setError(null);
      onClose();
    } catch {
      setError('Invalid JSON. Please check your syntax.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonValue(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleLoadExample = () => {
    setJsonValue(exampleNavigationJSON);
    setError(null);
  };

  const handleReset = () => {
    setJsonValue(JSON.stringify(defaultNavigationConfig, null, 2));
    setError(null);
  };

  // Parse for preview
  let previewConfig: NavigationConfig | null = null;
  try {
    const parsed = JSON.parse(jsonValue);
    if (validateNavigationConfig(parsed)) {
      previewConfig = parsed;
    }
  } catch {
    // Invalid JSON, no preview
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg shadow-xl flex flex-col transition-all duration-200 ${
        isExpanded 
          ? 'w-full h-full max-w-none max-h-none rounded-none' 
          : 'w-full max-w-5xl max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200">
          <div>
            <h2 className="text-lg font-bold text-wire-800">Navigation Settings</h2>
            <p className="text-sm text-wire-500">Configure the site navigation for all pages</p>
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
        <div ref={containerRef} className="flex-1 overflow-hidden flex">
          {/* JSON Editor */}
          <div className="flex-1 flex flex-col p-4">
            {/* Actions */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
              >
                📁 Upload JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={handleLoadExample}
                className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
              >
                📋 Load Example
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
              >
                ↺ Reset to Default
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([jsonValue], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'navigation-config.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
              >
                ⬇ Download JSON
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  showPreview ? 'bg-wire-600 text-white' : 'bg-wire-100 text-wire-700 hover:bg-wire-200'
                }`}
              >
                👁 {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isExpanded ? 'bg-wire-600 text-white' : 'bg-wire-100 text-wire-700 hover:bg-wire-200'
                }`}
                title={isExpanded ? 'Exit fullscreen' : 'Expand editor'}
              >
                {isExpanded ? '⊙ Collapse' : '⤢ Expand'}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* JSON textarea */}
            <div className="flex-1 relative">
              <textarea
                value={jsonValue}
                onChange={(e) => {
                  setJsonValue(e.target.value);
                  setError(null);
                }}
                className="w-full h-full p-3 font-mono text-sm bg-wire-50 border border-wire-300 rounded resize-none focus:outline-none focus:border-wire-500"
                spellCheck={false}
              />
            </div>

            {/* Help text */}
            <div className="mt-3 text-xs text-wire-500">
              <p className="font-medium mb-1">JSON Structure:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><code>showSecondaryNav</code>: Toggle secondary navigation bar</li>
                <li><code>primaryItems</code>: Main menu items (supports nested children)</li>
                <li><code>ctas</code>: Call-to-action buttons (0-3, primary/secondary)</li>
                <li><code>href</code>: Use page names to link between wireframe pages</li>
              </ul>
            </div>
          </div>

          {/* Preview panel with resize handle */}
          {showPreview && (
            <>
              {/* Resize handle */}
              <div
                onMouseDown={handleMouseDown}
                className={`w-2 bg-wire-200 hover:bg-wire-400 cursor-col-resize flex items-center justify-center transition-colors ${
                  isResizing ? 'bg-wire-400' : ''
                }`}
                title="Drag to resize"
              >
                <div className="w-0.5 h-8 bg-wire-400 rounded"></div>
              </div>

              {/* Preview panel */}
              <div 
                className="flex flex-col bg-wire-100 shrink-0"
                style={{ width: previewWidth }}
              >
                <div className="p-3 border-b border-wire-200 bg-wire-200 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-wire-700">Preview</h3>
                  <span className="text-xs text-wire-500">{previewWidth}px</span>
                </div>
                <div className="flex-1 overflow-auto">
                  {previewConfig ? (
                    <div 
                      className="origin-top-left"
                      style={{ 
                        transform: `scale(${Math.min(1, previewWidth / 600)})`,
                        width: `${100 / Math.min(1, previewWidth / 600)}%`
                      }}
                    >
                      <SiteNavigation config={previewConfig} />
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-wire-500 text-center">
                      Fix JSON errors to see preview
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-wire-200 bg-wire-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-wire-600 hover:text-wire-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors"
          >
            Save Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationSettings;
