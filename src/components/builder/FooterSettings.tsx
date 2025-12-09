import React, { useState, useRef } from 'react';
import type { FooterConfig } from '../../types/footer';
import { defaultFooterConfig, exampleFooterJSON, validateFooterConfig } from '../../types/footer';
import { SiteFooter } from '../wireframe/SiteFooter';

interface FooterSettingsProps {
  config: FooterConfig | undefined;
  onSave: (config: FooterConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FooterSettings: React.FC<FooterSettingsProps> = ({
  config,
  onSave,
  isOpen,
  onClose,
}) => {
  const currentConfig = config || defaultFooterConfig;
  const [jsonValue, setJsonValue] = useState(JSON.stringify(currentConfig, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      if (!validateFooterConfig(parsed)) {
        setError('Invalid footer config structure. Please check the format.');
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
    setJsonValue(exampleFooterJSON);
    setError(null);
  };

  const handleReset = () => {
    setJsonValue(JSON.stringify(defaultFooterConfig, null, 2));
    setError(null);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonValue], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'footer-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  let previewConfig: FooterConfig | null = null;
  try {
    const parsed = JSON.parse(jsonValue);
    if (validateFooterConfig(parsed)) {
      previewConfig = parsed;
    }
  } catch {
    previewConfig = null;
  }

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = previewWidth;

    const doResize = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      setPreviewWidth(Math.max(300, Math.min(900, newWidth)));
    };

    const stopResizing = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResizing);
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResizing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg shadow-xl flex flex-col transition-all duration-200 ${
        isExpanded
          ? 'w-full h-full max-w-none max-h-none rounded-none'
          : 'w-full max-w-4xl max-h-[90vh]'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-wire-200">
          <div>
            <h2 className="text-lg font-bold text-wire-800">Footer Settings</h2>
            <p className="text-sm text-wire-500">Configure the site footer for all pages</p>
          </div>
          <button onClick={onClose} className="p-2 text-wire-500 hover:text-wire-800 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 flex flex-col p-4 border-r border-wire-200">
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors">
                Upload JSON
              </button>
              <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
              <button onClick={handleLoadExample} className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors">
                Load Example
              </button>
              <button onClick={handleReset} className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors">
                Reset
              </button>
              <button onClick={handleDownloadJson} className="px-3 py-1.5 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors">
                Download
              </button>
              <button onClick={() => setShowPreview(!showPreview)} className={`px-3 py-1.5 text-sm rounded transition-colors ${showPreview ? 'bg-wire-600 text-white' : 'bg-wire-100 text-wire-700 hover:bg-wire-200'}`}>
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className={`px-3 py-1.5 text-sm rounded transition-colors ${isExpanded ? 'bg-wire-600 text-white' : 'bg-wire-100 text-wire-700 hover:bg-wire-200'}`}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
            )}

            <div className="flex-1 relative">
              <textarea
                value={jsonValue}
                onChange={(e) => { setJsonValue(e.target.value); setError(null); }}
                className="w-full h-full p-3 font-mono text-sm bg-wire-50 border border-wire-300 rounded resize-none focus:outline-none focus:border-wire-500"
                spellCheck={false}
              />
            </div>

            <div className="mt-3 text-xs text-wire-500">
              <p className="font-medium mb-1">JSON Structure:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><code>sections</code>: Array of nav sections with title and links</li>
                <li><code>showSocialLinks</code>: Toggle social media icons</li>
                <li><code>showNewsletter</code>: Toggle newsletter signup form</li>
              </ul>
            </div>
          </div>

          {showPreview && (
            <div className="flex flex-col bg-wire-100 relative" style={{ width: previewWidth }}>
              <div onMouseDown={startResizing} className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-wire-300 hover:bg-wire-400 transition-colors -ml-1" />
              <div className="p-3 border-b border-wire-200 bg-wire-200 flex justify-between items-center">
                <h3 className="text-sm font-medium text-wire-700">Preview</h3>
                <span className="text-xs text-wire-500">{previewWidth}px</span>
              </div>
              <div className="flex-1 overflow-auto">
                {previewConfig ? (
                  <SiteFooter config={previewConfig} />
                ) : (
                  <div className="p-4 text-sm text-wire-500 text-center">Fix JSON errors to see preview</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-wire-200 bg-wire-50">
          <button onClick={onClose} className="px-4 py-2 text-wire-600 hover:text-wire-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors">Save Footer</button>
        </div>
      </div>
    </div>
  );
};

export default FooterSettings;

