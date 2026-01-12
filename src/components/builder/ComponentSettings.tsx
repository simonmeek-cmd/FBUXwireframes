import React, { useState, useEffect } from 'react';
import type { ComponentType } from '../../types/builder';
import {
  COMPONENT_REGISTRY,
  getCategories,
  getComponentsByCategory,
  getAlwaysActiveComponents,
  getOptionalComponents,
  getAllComponents,
  type ComponentCategory,
} from '../../utils/componentRegistry';

interface ComponentSettingsProps {
  activeComponents: ComponentType[] | undefined;
  onSave: (activeComponents: ComponentType[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ComponentSettings: React.FC<ComponentSettingsProps> = ({
  activeComponents,
  onSave,
  isOpen,
  onClose,
}) => {
  // If undefined, all components are active (backward compatible)
  const initialActive = activeComponents || getAllComponents();
  const [selectedComponents, setSelectedComponents] = useState<Set<ComponentType>>(
    new Set(initialActive)
  );

  // Reset when modal opens or activeComponents changes
  useEffect(() => {
    if (isOpen) {
      const active = activeComponents || getAllComponents();
      setSelectedComponents(new Set(active));
    }
  }, [isOpen, activeComponents]);

  const alwaysActive = getAlwaysActiveComponents();
  const optional = getOptionalComponents();
  const categories = getCategories();

  const handleToggle = (type: ComponentType) => {
    // Can't toggle always-active components
    if (alwaysActive.includes(type)) return;

    setSelectedComponents((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleSelectAllInCategory = (category: ComponentCategory) => {
    const categoryComponents = getComponentsByCategory(category)
      .filter(c => !c.alwaysActive)
      .map(c => c.type);
    
    setSelectedComponents((prev) => {
      const next = new Set(prev);
      categoryComponents.forEach(type => next.add(type));
      return next;
    });
  };

  const handleDeselectAllInCategory = (category: ComponentCategory) => {
    const categoryComponents = getComponentsByCategory(category)
      .filter(c => !c.alwaysActive)
      .map(c => c.type);
    
    setSelectedComponents((prev) => {
      const next = new Set(prev);
      categoryComponents.forEach(type => next.delete(type));
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedComponents(new Set(getAllComponents()));
  };

  const handleDeselectAll = () => {
    setSelectedComponents(new Set(alwaysActive));
  };

  const handleSave = () => {
    // Convert Set to array and ensure always-active are included
    const active = Array.from(selectedComponents);
    onSave(active);
    onClose();
  };

  const activeCount = selectedComponents.size;
  const totalCount = getAllComponents().length;
  const optionalCount = optional.length;
  const selectedOptionalCount = Array.from(selectedComponents).filter(
    type => !alwaysActive.includes(type)
  ).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wire-200">
          <div>
            <h2 className="text-lg font-bold text-wire-800">Component Settings</h2>
            <p className="text-sm text-wire-500">
              Select which components are available for this project
            </p>
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
        <div className="flex-1 overflow-y-auto p-4">
          {/* Summary */}
          <div className="mb-4 p-3 bg-wire-50 border border-wire-200 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-wire-800">
                  {activeCount} of {totalCount} components active
                </p>
                <p className="text-xs text-wire-600 mt-1">
                  {alwaysActive.length} always active • {selectedOptionalCount} of {optionalCount} optional selected
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 text-xs bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 text-xs bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
                >
                  Deselect All Optional
                </button>
              </div>
            </div>
          </div>

          {/* Always Active Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-wire-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-wire-600 rounded-full"></span>
              Always Active Components
            </h3>
            <p className="text-xs text-wire-600 mb-3">
              These components are always available and cannot be disabled
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alwaysActive.map((type) => {
                const info = COMPONENT_REGISTRY.find(c => c.type === type);
                if (!info) return null;
                return (
                  <label
                    key={type}
                    className="flex items-start gap-2 p-2 bg-wire-50 border border-wire-200 rounded cursor-not-allowed opacity-75"
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-wire-800">{info.label}</div>
                      <div className="text-xs text-wire-600">{info.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Optional Components by Category */}
          {categories.map((category) => {
            const categoryComponents = getComponentsByCategory(category)
              .filter(c => !c.alwaysActive);
            
            if (categoryComponents.length === 0) return null;

            const categoryActive = categoryComponents.filter(c => 
              selectedComponents.has(c.type)
            ).length;

            return (
              <div key={category} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-wire-800">
                    {category} ({categoryActive} of {categoryComponents.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectAllInCategory(category)}
                      className="px-2 py-1 text-xs bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleDeselectAllInCategory(category)}
                      className="px-2 py-1 text-xs bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryComponents.map((info) => (
                    <label
                      key={info.type}
                      className="flex items-start gap-2 p-2 bg-white border border-wire-300 rounded hover:bg-wire-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComponents.has(info.type)}
                        onChange={() => handleToggle(info.type)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-wire-800">{info.label}</div>
                        <div className="text-xs text-wire-600">{info.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-wire-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-wire-100 text-wire-700 rounded hover:bg-wire-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-wire-600 text-white rounded hover:bg-wire-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};



