import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBuilderStore } from '../stores/useBuilderStore';
import { ComponentPalette } from '../components/builder/ComponentPalette';
import { Canvas } from '../components/builder/Canvas';
import { PropertyEditor } from '../components/builder/PropertyEditor';
import { getComponentMeta } from '../components/builder/componentRegistry';
import { getActiveComponents } from '../utils/componentRegistry';
import type { ComponentType } from '../types/builder';

export const PageBuilder: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const {
    getProject,
    getClient,
    getPage,
    addComponent,
    updateComponent,
    updateComponentHelpText,
    deleteComponent,
    reorderComponents,
    selectedComponentId,
    selectComponent,
  } = useBuilderStore();

  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);

  const project = projectId ? getProject(projectId) : undefined;
  const client = project ? getClient(project.clientId) : undefined;
  const page = projectId && pageId ? getPage(projectId, pageId) : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!project || !page) {
    return <Navigate to="/" replace />;
  }

  const selectedComponent = page.components.find((c) => c.id === selectedComponentId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (!over) return;

    // Check if dragging from palette
    const activeData = active.data.current;
    if (activeData?.type === 'palette-item') {
      const componentType = activeData.componentType as ComponentType;
      
      // Validate that the component is active for this project
      const activeComponents = getActiveComponents(project?.activeComponents);
      if (!activeComponents.includes(componentType)) {
        // Component is inactive - don't allow adding it
        alert(`"${getComponentMeta(componentType)?.label || componentType}" is not active for this project. Please enable it in Project Settings.`);
        return;
      }
      
      // Add new component
      addComponent(projectId!, pageId!, {
        type: componentType,
        props: activeData.defaultProps || {},
      }).catch((error) => {
        console.error('Failed to add component:', error);
        alert('Failed to add component. Please try again.');
      });
      return;
    }

    // Reordering existing components
    if (active.id !== over.id) {
      const oldIndex = page.components.findIndex((c) => c.id === active.id);
      const newIndex = page.components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(
          page.components.map((c) => c.id),
          oldIndex,
          newIndex
        );
        reorderComponents(projectId!, pageId!, newOrder).catch((error) => {
          console.error('Failed to reorder components:', error);
          alert('Failed to reorder components. Please try again.');
        });
      }
    }
  };

  const handleUpdateProps = (props: Record<string, unknown>) => {
    if (selectedComponentId && projectId && pageId) {
      updateComponent(projectId, pageId, selectedComponentId, props);
    }
  };

  const handleUpdateHelpText = (helpText: string) => {
    if (selectedComponentId && projectId && pageId) {
      updateComponentHelpText(projectId, pageId, selectedComponentId, helpText);
    }
  };

  const handleDeleteComponent = (componentId: string) => {
    if (projectId && pageId) {
      deleteComponent(projectId, pageId, componentId).catch((error) => {
        console.error('Failed to delete component:', error);
        alert('Failed to delete component. Please try again.');
      });
    }
  };

  // Get the label for the dragged item
  const getDragOverlayLabel = () => {
    if (!activeDragId) return null;
    
    if (activeDragId.startsWith('palette-')) {
      const type = activeDragId.replace('palette-', '') as ComponentType;
      const meta = getComponentMeta(type);
      return meta?.label || type;
    }
    
    const component = page.components.find((c) => c.id === activeDragId);
    if (component) {
      const meta = getComponentMeta(component.type);
      return meta?.label || component.type;
    }
    
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-wire-100">
      {/* Header */}
      <header className="bg-wire-800 text-wire-100 py-3 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to={`/project/${projectId}`}
            className="text-wire-400 hover:text-wire-200 text-sm"
          >
            ← Back to Pages
          </Link>
          <div className="h-4 w-px bg-wire-600" />
          <div>
            <div className="text-xs text-wire-400">
              {client?.name} / {project.name}
            </div>
            <h1 className="font-bold">{page.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/preview/${projectId}/${pageId}`}
            className="px-4 py-1.5 bg-wire-600 text-wire-100 rounded hover:bg-wire-500 transition-colors no-underline text-sm"
          >
            Preview
          </Link>
        </div>
      </header>

      {/* Main builder area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Component Palette */}
          <ComponentPalette />

          {/* Center: Canvas */}
          <Canvas
            components={page.components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={selectComponent}
            onDeleteComponent={handleDeleteComponent}
            navigationConfig={project.navigationConfig}
            footerConfig={project.footerConfig}
          />

          {/* Right: Property Editor */}
          <PropertyEditor
            component={selectedComponent}
            onUpdateProps={handleUpdateProps}
            onUpdateHelpText={handleUpdateHelpText}
            onClose={() => selectComponent(null)}
          />
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDragId && (
            <div className="px-4 py-2 bg-wire-600 text-wire-100 rounded shadow-lg text-sm font-medium">
              {getDragOverlayLabel()}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default PageBuilder;


