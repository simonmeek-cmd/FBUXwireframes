import React, { useRef, useCallback, useState } from 'react';
import type { PlacedComponent } from '../../types/builder';
import { getComponentMeta } from './componentRegistry';
import { getComponentSchema, PropertyField } from './componentSchemas';
import { defaultHelpText } from '../../utils/componentHelp';

interface PropertyEditorProps {
  component: PlacedComponent | undefined;
  onUpdateProps: (props: Record<string, unknown>) => void;
  onUpdateHelpText?: (helpText: string) => void;
  onClose: () => void;
}

interface FieldRendererProps {
  field: PropertyField;
  value: unknown;
  onChange: (value: unknown) => void;
}

// Simple Rich Text Editor component
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSyncedValueRef = useRef<string>(value);
  const isUserTypingRef = useRef(false);

  // Initialize content on mount
  React.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
      lastSyncedValueRef.current = value;
    }
  }, []);

  // Only sync value prop to DOM when it changes externally (not from user typing)
  React.useEffect(() => {
    if (editorRef.current && !isUserTypingRef.current && value !== lastSyncedValueRef.current) {
      // Value changed externally (e.g., component switched, initial load)
      editorRef.current.innerHTML = value || '';
      lastSyncedValueRef.current = value;
    }
  }, [value]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Update the value after command execution
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      lastSyncedValueRef.current = newValue;
      onChange(newValue);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUserTypingRef.current = true;
      const newValue = editorRef.current.innerHTML;
      lastSyncedValueRef.current = newValue;
      onChange(newValue);
      // Reset flag after a short delay to allow external updates if needed
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div className="border border-wire-300 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1.5 bg-wire-200 border-b border-wire-300 flex-wrap">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 font-bold text-sm"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 italic text-sm"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 underline text-sm"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <div className="w-px h-5 bg-wire-400 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px h-5 bg-wire-400 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h2')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm font-bold"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h3')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm font-bold"
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'p')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm"
          title="Paragraph"
        >
          ¶
        </button>
        <div className="w-px h-5 bg-wire-400 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="p-1.5 hover:bg-wire-300 rounded text-wire-700 text-sm"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-3 bg-wire-50 text-sm text-wire-800 focus:outline-none prose-p:mb-2 prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-h2:text-lg prose-h2:font-bold prose-h2:mb-2 prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2"
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{
          minHeight: '200px',
        }}
      />

      {/* Helper text */}
      <div className="px-3 py-1.5 bg-wire-100 border-t border-wire-200 text-xs text-wire-500">
        Use toolbar or Ctrl+B/I/U for formatting
      </div>
    </div>
  );
};

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  const baseInputClasses =
    'w-full px-3 py-2 bg-wire-50 border border-wire-300 rounded text-sm focus:outline-none focus:border-wire-500';

  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClasses}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={baseInputClasses}
        />
      );

    case 'richtext':
      return (
        <RichTextEditor
          value={(value as string) || ''}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );

    case 'select':
      return (
        <select
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'toggle':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={(value as boolean) ?? true}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-wire-600"
          />
          <span className="text-sm text-wire-600">
            {value ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );

    case 'number':
      return (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          min={field.min}
          max={field.max}
          className={baseInputClasses}
        />
      );

    default:
      return null;
  }
};

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateProps,
  onUpdateHelpText,
  onClose,
}) => {
  const [showHelpText, setShowHelpText] = useState(false);

  // Local state for help text so typing stays fast and smooth
  const [helpTextValue, setHelpTextValue] = useState<string>('');
  const saveHelpTextTimeoutRef = React.useRef<number | null>(null);

  if (!component) {
    return (
      <div className="w-72 bg-wire-100 border-l border-wire-300 p-4">
        <div className="text-wire-500 text-sm text-center py-12">
          Select a component to edit its properties
        </div>
      </div>
    );
  }

  const meta = getComponentMeta(component.type);
  const schema = getComponentSchema(component.type);
  const defaultHelp = defaultHelpText[component.type] || '';

  // Sync local help text when component changes
  React.useEffect(() => {
    // If there is custom help text, use it; otherwise start from the default text
    setHelpTextValue(component.helpText ?? defaultHelp);
  }, [component.id, component.helpText, defaultHelp]);

  const handleFieldChange = (key: string, value: unknown) => {
    onUpdateProps({ [key]: value });
  };

  const handleHelpTextChange = (next: string) => {
    setHelpTextValue(next);
    if (!onUpdateHelpText) return;

    // Debounce saves so we don't hit the API on every keystroke
    if (saveHelpTextTimeoutRef.current) {
      window.clearTimeout(saveHelpTextTimeoutRef.current);
    }
    saveHelpTextTimeoutRef.current = window.setTimeout(() => {
      onUpdateHelpText(next);
    }, 400);
  };

  // Check if any field is a richtext field (needs more width)
  const hasRichText = schema?.fields.some(f => f.type === 'richtext');

  return (
    <div className={`${hasRichText ? 'w-96' : 'w-72'} bg-wire-100 border-l border-wire-300 overflow-y-auto h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-wire-300 bg-wire-200 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-wire-800">{meta?.label || component.type}</h2>
          <p className="text-xs text-wire-500 mt-0.5">Edit properties</p>
        </div>
        <button
          onClick={onClose}
          className="text-wire-500 hover:text-wire-800 p-1"
          title="Deselect"
        >
          ✕
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4">
        {schema?.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-wire-700 mb-1.5">
              {field.label}
            </label>
            <FieldRenderer
              field={field}
              value={component.props[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          </div>
        ))}

        {(!schema || schema.fields.length === 0) && (
          <p className="text-sm text-wire-500 italic">
            No editable properties for this component
          </p>
        )}
      </div>

      {/* Help Text / Annotation Section */}
      {onUpdateHelpText && (
        <div className="border-t border-wire-300">
          <button
            onClick={() => setShowHelpText(!showHelpText)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-wire-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-wire-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                i
              </span>
              <span className="text-sm font-medium text-wire-700">Annotation / Help Text</span>
            </div>
            <svg
              className={`w-4 h-4 text-wire-500 transition-transform ${showHelpText ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showHelpText && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-wire-500">
                This text appears when users click the info icon in preview mode. Customise it to explain this component's purpose for your client.
              </p>
              <textarea
                value={helpTextValue}
                onChange={(e) => handleHelpTextChange(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm bg-wire-50 border border-wire-300 rounded resize-none focus:outline-none focus:border-wire-500"
              />
              {helpTextValue !== defaultHelp && (
                <button
                  onClick={() => handleHelpTextChange(defaultHelp)}
                  className="text-xs text-wire-500 hover:text-wire-700 underline"
                >
                  Reset to default
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Component info */}
      <div className="p-4 border-t border-wire-200 mt-auto">
        <p className="text-xs text-wire-400">
          Component ID: {component.id.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default PropertyEditor;
