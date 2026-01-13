import React, { useRef, useCallback, useState, useEffect } from 'react';
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
  // Local state for props - allows instant typing
  const [localProps, setLocalProps] = useState<Record<string, unknown>>({});
  const localPropsRef = useRef<Record<string, unknown>>({});
  const [localHelpText, setLocalHelpText] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const helpTextTimerRef = useRef<NodeJS.Timeout | null>(null);
  const componentIdRef = useRef<string | undefined>(undefined);

  // Helper to convert items array to flat fields for FeaturedPromosInline
  const itemsToFlatFields = (items: unknown[] | undefined): Record<string, unknown> => {
    const flat: Record<string, unknown> = {};
    // Default items from FeaturedPromosInline component
    const defaultItems = [
      { id: '1', title: 'Title', subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk', hasImage: true, tag: 'Event' },
      { id: '2', title: 'Title', subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk', hasImage: true, tag: 'News' },
      { id: '3', title: 'Title', subtitle: 'asddjskdddskdsdkskdjsk dskjdskjdskjdjskdjskdjsk', hasImage: true, tag: 'Campaign' },
    ];
    
    const itemsToUse = Array.isArray(items) && items.length > 0 ? items : defaultItems;
    
    itemsToUse.forEach((item: any, index: number) => {
      if (index < 3) {
        flat[`item${index}Title`] = item?.title || '';
        flat[`item${index}Subtitle`] = item?.subtitle || '';
        flat[`item${index}Meta`] = item?.meta || '';
        flat[`item${index}Tag`] = item?.tag || '';
      }
    });
    
    return flat;
  };

  // Helper to convert flat fields back to items array for FeaturedPromosInline
  const flatFieldsToItems = (props: Record<string, unknown>): unknown[] | undefined => {
    const items: any[] = [];
    for (let i = 0; i < 3; i++) {
      const title = props[`item${i}Title`] as string;
      if (title && title.trim()) {
        items.push({
          id: String(i + 1),
          title: title.trim(),
          subtitle: (props[`item${i}Subtitle`] as string)?.trim() || undefined,
          meta: (props[`item${i}Meta`] as string)?.trim() || undefined,
          tag: (props[`item${i}Tag`] as string)?.trim() || undefined,
          hasImage: true, // Default to true
        });
      }
    }
    // Return undefined if no items (component will use defaultItems)
    return items.length > 0 ? items : undefined;
  };

  // Helper to convert items array to flat fields for FeaturedPromosTitlesOnly
  const titlesOnlyItemsToFlatFields = (items: unknown[] | undefined): Record<string, unknown> => {
    const flat: Record<string, unknown> = {};
    // Default items from FeaturedPromosTitlesOnly component
    const defaultItems = [
      { id: '1', title: 'Featured promos, titles and first only (inline)', hasImage: true },
      { id: '2', title: 'Featured promos, titles and first only (inline)', hasImage: true },
      { id: '3', title: 'Featured promos, titles and first only (inline)', hasImage: true },
    ];
    
    const itemsToUse = Array.isArray(items) && items.length > 0 ? items : defaultItems;
    
    itemsToUse.forEach((item: any, index: number) => {
      if (index < 3) {
        flat[`item${index}Title`] = item?.title || '';
        flat[`item${index}Subtitle`] = item?.subtitle || '';
        flat[`item${index}Meta`] = item?.meta || '';
      }
    });
    
    return flat;
  };

  // Helper to convert flat fields back to items array for FeaturedPromosTitlesOnly
  const titlesOnlyFlatFieldsToItems = (props: Record<string, unknown>): unknown[] | undefined => {
    const items: any[] = [];
    for (let i = 0; i < 3; i++) {
      const title = props[`item${i}Title`] as string;
      if (title && title.trim()) {
        items.push({
          id: String(i + 1),
          title: title.trim(),
          subtitle: (props[`item${i}Subtitle`] as string)?.trim() || undefined,
          meta: (props[`item${i}Meta`] as string)?.trim() || undefined,
          hasImage: true, // Default to true
        });
      }
    }
    // Return undefined if no items (component will use defaultItems)
    return items.length > 0 ? items : undefined;
  };

  // Helper to convert accordion items array to flat fields
  const accordionItemsToFlatFields = (items: unknown[] | undefined): Record<string, unknown> => {
    const flat: Record<string, unknown> = {};
    const defaultItems = [
      { id: '1', title: 'Enim cillum dolore eu fugiat nulla pariatur', body: '<p>Lorem ipsum dolor sit amet...</p>', defaultOpen: true },
      { id: '2', title: 'Enim cillum dolore eu fugiat nulla pariatur', body: '<p>Duis aute irure dolor...</p>' },
      { id: '3', title: 'Enim cillum dolore eu fugiat nulla pariatur', body: '<p>Sed ut perspiciatis...</p>' },
    ];
    
    const itemsToUse = Array.isArray(items) && items.length > 0 ? items : defaultItems;
    
    itemsToUse.forEach((item: any, index: number) => {
      flat[`accordionItem${index}Title`] = item?.title || '';
      flat[`accordionItem${index}Body`] = item?.body || '';
      flat[`accordionItem${index}Id`] = item?.id || String(index + 1);
      flat[`accordionItem${index}DefaultOpen`] = item?.defaultOpen || false;
    });
    
    flat.accordionItemCount = itemsToUse.length;
    
    return flat;
  };

  // Helper to convert flat fields back to accordion items array
  const accordionFlatFieldsToItems = (props: Record<string, unknown>): unknown[] | undefined => {
    const items: any[] = [];
    const count = (props.accordionItemCount as number) || 0;
    
    for (let i = 0; i < count; i++) {
      const title = props[`accordionItem${i}Title`] as string;
      const body = props[`accordionItem${i}Body`] as string;
      if (title && title.trim()) {
        items.push({
          id: (props[`accordionItem${i}Id`] as string) || String(i + 1),
          title: title.trim(),
          body: (body && body.trim()) || '<p></p>',
          defaultOpen: props[`accordionItem${i}DefaultOpen`] || false,
        });
      }
    }
    
    // Return undefined if no items (component will use defaultItems)
    return items.length > 0 ? items : undefined;
  };

  // Sync local props when component changes (by ID, not props to avoid loops)
  useEffect(() => {
    if (component && component.id !== componentIdRef.current) {
      componentIdRef.current = component.id;
      const props = { ...component.props };
      
      // Convert items array to flat fields for FeaturedPromosInline
      if (component.type === 'FeaturedPromosInline') {
        const flatFields = itemsToFlatFields(props.items as unknown[]);
        delete props.items; // Remove items from props
        Object.assign(props, flatFields); // Add flat fields
      }
      
      // Convert items array to flat fields for FeaturedPromosTitlesOnly
      if (component.type === 'FeaturedPromosTitlesOnly') {
        const flatFields = titlesOnlyItemsToFlatFields(props.items as unknown[]);
        delete props.items; // Remove items from props
        Object.assign(props, flatFields); // Add flat fields
      }
      
      // Convert items array to flat fields for AccordionInline
      if (component.type === 'AccordionInline') {
        const flatFields = accordionItemsToFlatFields(props.items as unknown[]);
        delete props.items; // Remove items from props
        Object.assign(props, flatFields); // Add flat fields
        // Ensure we have at least one item
        if (!props.accordionItemCount || (props.accordionItemCount as number) === 0) {
          props.accordionItemCount = 3;
          props.accordionItem0Id = '1';
          props.accordionItem0Title = 'Enim cillum dolore eu fugiat nulla pariatur';
          props.accordionItem0Body = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>';
          props.accordionItem0DefaultOpen = true;
          props.accordionItem1Id = '2';
          props.accordionItem1Title = 'Enim cillum dolore eu fugiat nulla pariatur';
          props.accordionItem1Body = '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>';
          props.accordionItem1DefaultOpen = false;
          props.accordionItem2Id = '3';
          props.accordionItem2Title = 'Enim cillum dolore eu fugiat nulla pariatur';
          props.accordionItem2Body = '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>';
          props.accordionItem2DefaultOpen = false;
        }
      }
      
      setLocalProps(props);
      localPropsRef.current = props;
      const defaultHelp = defaultHelpText[component.type] || '';
      setLocalHelpText(component.helpText ?? defaultHelp);
    }
  }, [component?.id, component?.type]);

  // Debounced save function
  const debouncedUpdate = useCallback((key: string, value: unknown) => {
    // Update local state immediately for instant UI feedback
    setLocalProps(prev => {
      const updated = { ...prev, [key]: value };
      localPropsRef.current = updated;
      return updated;
    });

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to save after 300ms of no typing
    debounceTimerRef.current = setTimeout(() => {
      // For FeaturedPromosInline, convert flat fields back to items array
      if (component?.type === 'FeaturedPromosInline') {
        const currentProps = localPropsRef.current;
        const items = flatFieldsToItems(currentProps);
        const propsToSave: Record<string, unknown> = { ...currentProps };
        if (items) {
          propsToSave.items = items;
        }
        // Remove flat fields from props to save
        ['item0Title', 'item0Subtitle', 'item0Meta', 'item0Tag', 
         'item1Title', 'item1Subtitle', 'item1Meta', 'item1Tag',
         'item2Title', 'item2Subtitle', 'item2Meta', 'item2Tag'].forEach(field => {
          delete propsToSave[field];
        });
        onUpdateProps(propsToSave);
      } else if (component?.type === 'FeaturedPromosTitlesOnly') {
        // For FeaturedPromosTitlesOnly, convert flat fields back to items array
        const currentProps = localPropsRef.current;
        const items = titlesOnlyFlatFieldsToItems(currentProps);
        const propsToSave: Record<string, unknown> = { ...currentProps };
        if (items) {
          propsToSave.items = items;
        }
        // Remove flat fields from props to save
        ['item0Title', 'item0Subtitle', 'item0Meta',
         'item1Title', 'item1Subtitle', 'item1Meta',
         'item2Title', 'item2Subtitle', 'item2Meta'].forEach(field => {
          delete propsToSave[field];
        });
        onUpdateProps(propsToSave);
      } else if (component?.type === 'AccordionInline') {
        // For AccordionInline, convert flat fields back to items array
        const currentProps = localPropsRef.current;
        const items = accordionFlatFieldsToItems(currentProps);
        const propsToSave: Record<string, unknown> = { ...currentProps };
        if (items) {
          propsToSave.items = items;
        }
        // Remove flat fields from props to save
        const fieldsToRemove: string[] = [];
        const count = (currentProps.accordionItemCount as number) || 0;
        for (let i = 0; i < count; i++) {
          fieldsToRemove.push(`accordionItem${i}Title`, `accordionItem${i}Body`, `accordionItem${i}Id`, `accordionItem${i}DefaultOpen`);
        }
        fieldsToRemove.push('accordionItemCount');
        fieldsToRemove.forEach(field => {
          delete propsToSave[field];
        });
        onUpdateProps(propsToSave);
      } else {
        onUpdateProps({ [key]: value });
      }
    }, 300);
  }, [onUpdateProps, component?.type]);

  // Debounced help text update
  const debouncedHelpTextUpdate = useCallback((text: string) => {
    // Update local state immediately
    setLocalHelpText(text);

    // Clear existing timer
    if (helpTextTimerRef.current) {
      clearTimeout(helpTextTimerRef.current);
    }

    // Set new timer to save after 300ms of no typing
    helpTextTimerRef.current = setTimeout(() => {
      onUpdateHelpText?.(text);
    }, 300);
  }, [onUpdateHelpText]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (helpTextTimerRef.current) {
        clearTimeout(helpTextTimerRef.current);
      }
    };
  }, []);

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

  const handleFieldChange = (key: string, value: unknown) => {
    debouncedUpdate(key, value);
  };

  // Check if any field is a richtext field (needs more width)
  const hasRichText = schema?.fields.some((f) => f.type === 'richtext');

  return (
    <div className={`${hasRichText ? "w-96" : "w-72"} bg-wire-100 border-l border-wire-300 overflow-y-auto h-full`}>
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
              value={localProps[field.key] ?? component.props[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          </div>
        ))}

        {/* Accordion Items Editor */}
        {component?.type === 'AccordionInline' && (
          <div className="border-t border-wire-300 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-wire-700">
                Accordion Items
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentCount = (localProps.accordionItemCount as number) || 0;
                  const newCount = currentCount + 1;
                  const newId = `accordion-${Date.now()}`;
                  handleFieldChange('accordionItemCount', newCount);
                  handleFieldChange(`accordionItem${currentCount}Id`, newId);
                  handleFieldChange(`accordionItem${currentCount}Title`, 'New Item');
                  handleFieldChange(`accordionItem${currentCount}Body`, '<p></p>');
                  handleFieldChange(`accordionItem${currentCount}DefaultOpen`, false);
                }}
                className="px-3 py-1.5 text-xs bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors"
              >
                + Add Item
              </button>
            </div>
            {Array.from({ length: (localProps.accordionItemCount as number) || 0 }).map((_, index) => (
              <div key={index} className="mb-4 p-3 border border-wire-300 rounded bg-wire-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-wire-600">Item {index + 1}</span>
                  {(localProps.accordionItemCount as number) > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentCount = (localProps.accordionItemCount as number) || 0;
                        // Remove this item by shifting all items after it
                        for (let i = index; i < currentCount - 1; i++) {
                          handleFieldChange(`accordionItem${i}Title`, localProps[`accordionItem${i + 1}Title`] || '');
                          handleFieldChange(`accordionItem${i}Body`, localProps[`accordionItem${i + 1}Body`] || '');
                          handleFieldChange(`accordionItem${i}Id`, localProps[`accordionItem${i + 1}Id`] || String(i + 1));
                          handleFieldChange(`accordionItem${i}DefaultOpen`, localProps[`accordionItem${i + 1}DefaultOpen`] || false);
                        }
                        // Clear the last item
                        const lastIndex = currentCount - 1;
                        handleFieldChange(`accordionItem${lastIndex}Title`, '');
                        handleFieldChange(`accordionItem${lastIndex}Body`, '');
                        handleFieldChange(`accordionItem${lastIndex}Id`, '');
                        handleFieldChange(`accordionItem${lastIndex}DefaultOpen`, false);
                        handleFieldChange('accordionItemCount', currentCount - 1);
                      }}
                      className="text-xs text-wire-500 hover:text-wire-700 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-wire-600 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={(localProps[`accordionItem${index}Title`] as string) || ''}
                      onChange={(e) => handleFieldChange(`accordionItem${index}Title`, e.target.value)}
                      placeholder="Item title"
                      className="w-full px-2 py-1.5 text-sm bg-white border border-wire-300 rounded focus:outline-none focus:border-wire-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-wire-600 mb-1">
                      Content
                    </label>
                    <RichTextEditor
                      value={(localProps[`accordionItem${index}Body`] as string) || '<p></p>'}
                      onChange={(value) => handleFieldChange(`accordionItem${index}Body`, value)}
                      placeholder="Item content..."
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!localProps.accordionItemCount || (localProps.accordionItemCount as number) === 0) && (
              <p className="text-xs text-wire-500 italic text-center py-4">
                No items yet. Click "Add Item" to create one.
              </p>
            )}
          </div>
        )}

        {(!schema || schema.fields.length === 0) && component?.type !== 'AccordionInline' && (
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
                value={localHelpText}
                onChange={(e) => debouncedHelpTextUpdate(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm bg-wire-50 border border-wire-300 rounded resize-none focus:outline-none focus:border-wire-500"
              />
              {localHelpText !== defaultHelp && onUpdateHelpText && (
                <button
                  onClick={() => {
                    setLocalHelpText(defaultHelp);
                    onUpdateHelpText(defaultHelp);
                  }}
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
