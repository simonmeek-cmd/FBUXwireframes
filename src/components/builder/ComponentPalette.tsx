import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { componentsByCategory, categoryLabels } from './componentRegistry';
import type { ComponentMeta } from '../../types/builder';

interface DraggablePaletteItemProps {
  component: ComponentMeta;
}

const DraggablePaletteItem: React.FC<DraggablePaletteItemProps> = ({ component }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${component.type}`,
    data: {
      type: 'palette-item',
      componentType: component.type,
      defaultProps: component.defaultProps,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 bg-wire-50 border border-wire-200 rounded cursor-grab hover:bg-wire-100 hover:border-wire-300 transition-colors ${
        isDragging ? 'opacity-50 ring-2 ring-wire-400' : ''
      }`}
    >
      <div className="font-medium text-wire-800 text-sm">{component.label}</div>
      <div className="text-xs text-wire-500 mt-0.5">{component.description}</div>
    </div>
  );
};

export const ComponentPalette: React.FC = () => {
  return (
    <div className="w-64 bg-wire-100 border-r border-wire-300 overflow-y-auto h-full">
      <div className="p-4 border-b border-wire-300 bg-wire-200">
        <h2 className="font-bold text-wire-800">Components</h2>
        <p className="text-xs text-wire-500 mt-1">Drag to add to page</p>
      </div>
      
      <div className="p-3 space-y-4">
        {Object.entries(componentsByCategory).map(([category, components]) => (
          <div key={category}>
            <h3 className="text-xs font-bold text-wire-500 uppercase tracking-wider mb-2 px-1">
              {categoryLabels[category] || category}
            </h3>
            <div className="space-y-2">
              {components.map((component) => (
                <DraggablePaletteItem key={component.type} component={component} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;


