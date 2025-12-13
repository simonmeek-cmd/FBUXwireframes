import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useParams } from 'react-router-dom';
import { useBuilderStore } from '../../stores/useBuilderStore';
import { componentsByCategory, categoryLabels } from './componentRegistry';
import { getActiveComponents } from '../../utils/componentRegistry';
import type { ComponentMeta } from '../../types/builder';

interface DraggablePaletteItemProps {
  component: ComponentMeta;
}

interface DraggablePaletteItemProps {
  component: ComponentMeta;
  isActive: boolean;
}

const DraggablePaletteItem: React.FC<DraggablePaletteItemProps> = ({ component, isActive }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${component.type}`,
    data: {
      type: 'palette-item',
      componentType: component.type,
      defaultProps: component.defaultProps,
    },
    disabled: !isActive, // Disable dragging for inactive components
  });

  if (!isActive) {
    // Inactive component - very clear visual distinction
    return (
      <div
        ref={setNodeRef}
        style={{
          backgroundColor: '#e5e7eb',
          borderColor: '#9ca3af',
          borderWidth: '1px',
          opacity: 0.5,
          filter: 'grayscale(100%)',
        }}
        className="p-3 border rounded cursor-not-allowed"
        title="This component is inactive. Enable it in Project Settings."
      >
        <div className="font-medium text-sm text-gray-600 line-through">
          {component.label}
          <span className="ml-2 text-xs font-normal text-gray-500">(inactive)</span>
        </div>
        <div className="text-xs mt-0.5 text-gray-500">
          {component.description}
        </div>
      </div>
    );
  }

  // Active component
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 bg-wire-50 border border-wire-200 rounded cursor-grab hover:bg-wire-100 hover:border-wire-300 transition-colors ${
        isDragging ? 'opacity-50 ring-2 ring-wire-400' : ''
      }`}
    >
      <div className="font-medium text-sm text-wire-800">
        {component.label}
      </div>
      <div className="text-xs mt-0.5 text-wire-500">
        {component.description}
      </div>
    </div>
  );
};

export const ComponentPalette: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject } = useBuilderStore();
  const project = projectId ? getProject(projectId) : undefined;
  const activeComponents = getActiveComponents(project?.activeComponents);

  return (
    <div className="w-64 bg-wire-100 border-r border-wire-300 overflow-y-auto h-full">
      <div className="p-4 border-b border-wire-300 bg-wire-200">
        <h2 className="font-bold text-wire-800">Components</h2>
        <p className="text-xs text-wire-500 mt-1">Drag to add to page</p>
        {project && (
          <p className="text-xs text-wire-600 mt-1">
            {activeComponents.length} active
          </p>
        )}
      </div>
      
      <div className="p-3 space-y-4">
        {Object.entries(componentsByCategory).map(([category, components]) => {
          // Separate active and inactive components
          const active = components.filter(c => activeComponents.includes(c.type));
          const inactive = components.filter(c => !activeComponents.includes(c.type));

          return (
            <div key={category}>
              <h3 className="text-xs font-bold text-wire-500 uppercase tracking-wider mb-2 px-1">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-2">
                {/* Active components first */}
                {active.map((component) => (
                  <DraggablePaletteItem 
                    key={component.type} 
                    component={component} 
                    isActive={true}
                  />
                ))}
                {/* Inactive components (grayed out) */}
                {inactive.map((component) => (
                  <DraggablePaletteItem 
                    key={component.type} 
                    component={component} 
                    isActive={false}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentPalette;


