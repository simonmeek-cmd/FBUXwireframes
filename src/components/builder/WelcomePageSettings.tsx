import React, { useState, useRef, useEffect } from 'react';
import type { WelcomePageConfig } from '../../types/welcomePage';
import { defaultWelcomePageConfig, defaultIntroCopy, fatBeehiveLogo } from '../../types/welcomePage';

interface WelcomePageSettingsProps {
  config?: WelcomePageConfig;
  projectName: string;
  clientName: string;
  onSave: (config: WelcomePageConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomePageSettings: React.FC<WelcomePageSettingsProps> = ({
  config,
  projectName,
  clientName,
  onSave,
  isOpen,
  onClose,
}) => {
  const [localConfig, setLocalConfig] = useState<WelcomePageConfig>(
    config || defaultWelcomePageConfig
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(config?.clientLogo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // If no config exists, use default but ensure we use the current defaultIntroCopy
      const initialConfig = config || {
        ...defaultWelcomePageConfig,
        introCopy: defaultIntroCopy, // Always use current default, not the one from defaultWelcomePageConfig
      };
      setLocalConfig(initialConfig);
      setLogoPreview(initialConfig?.clientLogo || null);
      // Update editor content when opening
      if (editorRef.current) {
        editorRef.current.innerHTML = initialConfig.introCopy || defaultIntroCopy;
      }
    }
  }, [isOpen, config]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      alert('Logo file is too large. Please use an image under 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      setLocalConfig(prev => ({ ...prev, clientLogo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLocalConfig(prev => ({ ...prev, clientLogo: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    // Get content from contenteditable
    if (editorRef.current) {
      setLocalConfig(prev => ({ ...prev, introCopy: editorRef.current?.innerHTML || '' }));
    }
    onSave({
      ...localConfig,
      introCopy: editorRef.current?.innerHTML || localConfig.introCopy,
    });
    onClose();
  };

  const handleResetIntro = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = defaultIntroCopy;
    }
    setLocalConfig(prev => ({ ...prev, introCopy: defaultIntroCopy }));
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200">
          <h2 className="text-xl font-bold text-wire-800">Welcome Page Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-wire-500 hover:text-wire-800 rounded"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Preview Header */}
          <div className="bg-white border border-wire-200 rounded p-4">
            <p className="text-sm text-wire-500 mb-3">Logo Bar Preview:</p>
            <div className="flex items-center justify-between gap-4 py-4 px-6 bg-white border border-wire-200 rounded">
              {/* Fat Beehive Logo */}
              <div 
                className="h-12"
                dangerouslySetInnerHTML={{ __html: fatBeehiveLogo.replace('width="387"', 'width="200"').replace('height="60"', 'height="40"') }}
              />
              
              {/* Client Logo */}
              {logoPreview ? (
                <img src={logoPreview} alt="Client logo" className="h-12 max-w-[200px] object-contain" />
              ) : (
                <div className="h-12 w-32 bg-wire-100 border-2 border-dashed border-wire-300 rounded flex items-center justify-center text-xs text-wire-400">
                  Client Logo
                </div>
              )}
            </div>
          </div>

          {/* Client Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-wire-700 mb-2">
              Client Logo
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-wire-200 text-wire-700 rounded hover:bg-wire-300 transition-colors"
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              {logoPreview && (
                <button
                  onClick={handleRemoveLogo}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              )}
              <span className="text-xs text-wire-500">Max 500KB. PNG, JPG, or SVG recommended.</span>
            </div>
          </div>

          {/* Project Date */}
          <div>
            <label className="block text-sm font-medium text-wire-700 mb-2">
              Project Date
            </label>
            <input
              type="text"
              value={localConfig.projectDate || ''}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, projectDate: e.target.value }))}
              placeholder="e.g., December 2024"
              className="w-full max-w-xs px-3 py-2 border border-wire-300 rounded focus:outline-none focus:border-wire-500"
            />
          </div>

          {/* Title Preview */}
          <div className="bg-wire-100 border border-wire-200 rounded p-4">
            <p className="text-sm text-wire-500 mb-2">Title will appear as:</p>
            <h1 className="text-2xl font-bold text-wire-800">{clientName}: {projectName}</h1>
            <p className="text-wire-600 mt-1">{localConfig.projectDate}</p>
          </div>

          {/* Intro Copy Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-wire-700">
                Introduction Copy
              </label>
              <button
                onClick={handleResetIntro}
                className="text-xs text-wire-500 hover:text-wire-700 underline"
              >
                Reset to default
              </button>
            </div>
            
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-wire-100 border border-wire-300 border-b-0 rounded-t">
              <button
                onClick={() => execCommand('bold')}
                className="px-2 py-1 text-sm font-bold hover:bg-wire-200 rounded"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="px-2 py-1 text-sm italic hover:bg-wire-200 rounded"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => execCommand('underline')}
                className="px-2 py-1 text-sm underline hover:bg-wire-200 rounded"
                title="Underline"
              >
                U
              </button>
              <div className="w-px bg-wire-300 mx-1" />
              <button
                onClick={() => execCommand('formatBlock', 'h2')}
                className="px-2 py-1 text-sm hover:bg-wire-200 rounded"
                title="Heading"
              >
                H2
              </button>
              <button
                onClick={() => execCommand('formatBlock', 'h3')}
                className="px-2 py-1 text-sm hover:bg-wire-200 rounded"
                title="Subheading"
              >
                H3
              </button>
              <button
                onClick={() => execCommand('formatBlock', 'p')}
                className="px-2 py-1 text-sm hover:bg-wire-200 rounded"
                title="Paragraph"
              >
                P
              </button>
              <div className="w-px bg-wire-300 mx-1" />
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="px-2 py-1 text-sm hover:bg-wire-200 rounded"
                title="Bullet List"
              >
                • List
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="px-2 py-1 text-sm hover:bg-wire-200 rounded"
                title="Numbered List"
              >
                1. List
              </button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[300px] max-h-[400px] overflow-y-auto p-4 border border-wire-300 rounded-b bg-white focus:outline-none focus:border-wire-500 welcome-editor"
              dangerouslySetInnerHTML={{ __html: localConfig.introCopy || defaultIntroCopy }}
            />
            <style>{`
              .welcome-editor {
                color: #334e68;
                line-height: 1.7;
              }
              .welcome-editor h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #243b53;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                border-bottom: 1px solid #d9e2ec;
                padding-bottom: 0.5rem;
              }
              .welcome-editor h2:first-child {
                margin-top: 0;
              }
              .welcome-editor h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #243b53;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
              }
              .welcome-editor p {
                margin-bottom: 1rem;
              }
              .welcome-editor ul,
              .welcome-editor ol {
                margin-bottom: 1rem;
                padding-left: 1.5rem;
              }
              .welcome-editor ul {
                list-style-type: disc;
              }
              .welcome-editor ol {
                list-style-type: decimal;
              }
              .welcome-editor li {
                margin-bottom: 0.5rem;
              }
              .welcome-editor strong {
                font-weight: 600;
                color: #243b53;
              }
            `}</style>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-wire-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-wire-300 text-wire-600 rounded hover:bg-wire-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors"
          >
            Save Welcome Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePageSettings;

