import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PlacedComponent } from '../../types/builder';
import type { NavigationConfig } from '../../types/navigation';
import type { FooterConfig } from '../../types/footer';
import { ComponentRenderer } from './ComponentRenderer';
import { getComponentMeta } from './componentRegistry';
import { SiteNavigation } from '../wireframe/SiteNavigation';
import { SiteFooter } from '../wireframe/SiteFooter';

interface SortableComponentProps {
  component: PlacedComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableComponent: React.FC<SortableComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = getComponentMeta(component.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      {/* Component wrapper with selection */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`relative border-2 transition-colors cursor-pointer ${
          isSelected
            ? 'border-wire-500 ring-2 ring-wire-300'
            : 'border-transparent hover:border-wire-300'
        }`}
      >
        {/* Drag handle and controls */}
        <div
          className={`absolute -top-8 left-0 right-0 flex items-center justify-between px-2 py-1 bg-wire-700 text-wire-100 text-xs rounded-t z-10 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity`}
        >
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:bg-wire-600 px-1.5 py-0.5 rounded"
              title="Drag to reorder"
            >
              ⋮⋮
            </button>
            <span>{meta?.label || component.type}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="hover:bg-red-600 px-1.5 py-0.5 rounded"
            title="Delete component"
          >
            ✕
          </button>
        </div>

        {/* The actual component */}
        <div className="pointer-events-none">
          <ComponentRenderer type={component.type} props={component.props} />
        </div>
      </div>
    </div>
  );
};

interface CanvasProps {
  components: PlacedComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  navigationConfig?: NavigationConfig;
  footerConfig?: FooterConfig;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  navigationConfig,
  footerConfig,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const componentIds = components.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-wire-200 overflow-y-auto transition-colors ${
        isOver ? 'bg-wire-300' : ''
      }`}
      onClick={() => onSelectComponent(null)}
    >
      <div className="max-w-5xl mx-auto my-8 bg-wire-50 min-h-[600px] shadow-lg overflow-hidden">
        {/* Site Navigation (always shown if configured) */}
        {navigationConfig && (
          <div className="pointer-events-none border-b-2 border-dashed border-wire-300">
            <SiteNavigation config={navigationConfig} />
          </div>
        )}
        
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-wire-400">
            <div className="text-center">
              <p className="text-lg mb-2">Drop components here</p>
              <p className="text-sm">Drag from the palette on the left</p>
            </div>
          </div>
        ) : (
          <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            <div className="pt-10">
              {components.map((component) => (
                <SortableComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onSelect={() => onSelectComponent(component.id)}
                  onDelete={() => onDeleteComponent(component.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}

        {/* Site Footer (always shown if configured) */}
        {footerConfig && (
          <div className="pointer-events-none border-t-2 border-dashed border-wire-300 mt-8">
            <SiteFooter config={footerConfig} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;

