import { create } from 'zustand';
import type { Client, Project, Page, PlacedComponent, PageType, ComponentType } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';
import type { WelcomePageConfig } from '../types/welcomePage';
import { generateId } from '../types/builder';
import { loadClients, saveClients, loadProjects, saveProjects } from '../utils/storage';
import { clientsApi, projectsApi, pagesApi } from '../api/client';
import { sortPagesForDisplay } from '../utils/pageSort';

interface BuilderState {
  // Data
  clients: Client[];
  projects: Project[];
  loading: boolean;
  
  // UI State
  selectedClientId: string | null;
  selectedProjectId: string | null;
  selectedPageId: string | null;
  selectedComponentId: string | null;
  
  // Client actions
  addClient: (name: string) => Promise<void>;
  updateClient: (id: string, name: string) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Project actions
  addProject: (clientId: string, name: string) => void;
  updateProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (projectId: string) => Promise<string>;
  
  // Page actions
  addPage: (projectId: string, name: string, type: PageType) => Promise<void>;
  updatePage: (projectId: string, pageId: string, updates: Partial<Pick<Page, 'name' | 'type'>>) => Promise<void>;
  deletePage: (projectId: string, pageId: string) => Promise<void>;
  
  // Navigation config actions
  updateNavigationConfig: (projectId: string, config: NavigationConfig) => void;
  
  // Footer config actions
  updateFooterConfig: (projectId: string, config: FooterConfig) => void;
  
  // Welcome page config actions
  updateWelcomePageConfig: (projectId: string, config: WelcomePageConfig) => void;
  
  // Active components actions
  updateActiveComponents: (projectId: string, activeComponents: ComponentType[]) => void;
  
  // Component actions
  addComponent: (projectId: string, pageId: string, component: Omit<PlacedComponent, 'id' | 'order'>) => Promise<void>;
  updateComponent: (projectId: string, pageId: string, componentId: string, props: Record<string, unknown>) => Promise<void>;
  updateComponentHelpText: (projectId: string, pageId: string, componentId: string, helpText: string) => Promise<void>;
  deleteComponent: (projectId: string, pageId: string, componentId: string) => Promise<void>;
  reorderComponents: (projectId: string, pageId: string, componentIds: string[]) => Promise<void>;
  
  // Selection actions
  selectClient: (id: string | null) => void;
  selectProject: (id: string | null) => void;
  selectPage: (id: string | null) => void;
  selectComponent: (id: string | null) => void;
  
  // Getters
  getClient: (id: string) => Client | undefined;
  getProject: (id: string) => Project | undefined;
  getPage: (projectId: string, pageId: string) => Page | undefined;
  getProjectsForClient: (clientId: string) => Project[];
  
  // Initialization
  initialize: () => Promise<void>;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  clients: [],
  projects: [],
  loading: false,
  selectedClientId: null,
  selectedProjectId: null,
  selectedPageId: null,
  selectedComponentId: null,
  
  // Initialize from API
  initialize: async () => {
    set({ loading: true });
    try {
      const [clientsData, projectsData] = await Promise.all([
        clientsApi.getAll(),
        projectsApi.getAll(),
      ]);
      set({
        clients: clientsData,
        projects: projectsData,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ loading: false });
      // Fallback to empty arrays on error
      set({
        clients: [],
        projects: [],
      });
    }
  },
  
  // Client actions
  addClient: async (name) => {
    try {
      const newClient = await clientsApi.create({ name });
      set((state) => ({
        clients: [...state.clients, newClient],
      }));
    } catch (error) {
      console.error('Failed to add client:', error);
      throw error;
    }
  },
  
  updateClient: async (id, name) => {
    try {
      const updatedClient = await clientsApi.update(id, { name });
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
      }));
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  },
  
  deleteClient: async (id) => {
    try {
      await clientsApi.delete(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        projects: state.projects.filter((p) => p.clientId !== id),
      }));
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  },
  
  // Project actions
  addProject: (clientId, name) => {
    const newProject: Project = {
      id: generateId(),
      clientId,
      name,
      pages: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const projects = [...state.projects, newProject];
      saveProjects(projects);
      return { projects };
    });
  },
  
  updateProject: (id, name) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === id ? { ...p, name } : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  deleteProject: (id) => {
    set((state) => {
      const projects = state.projects.filter((p) => p.id !== id);
      saveProjects(projects);
      return { projects };
    });
  },

  duplicateProject: async (projectId: string): Promise<string> => {
    try {
      const originalProject = get().projects.find(p => p.id === projectId);
      if (!originalProject) {
        throw new Error('Project not found');
      }

      // Create new project with "(Copy)" suffix
      const newProjectName = `${originalProject.name} (Copy)`;
      const newProject = await projectsApi.create({
        clientId: originalProject.clientId,
        name: newProjectName,
      });

      // Copy project-level configs
      if (originalProject.navigationConfig) {
        await projectsApi.update(newProject.id, { navigationConfig: originalProject.navigationConfig });
      }
      if (originalProject.footerConfig) {
        await projectsApi.update(newProject.id, { footerConfig: originalProject.footerConfig });
      }
      if (originalProject.welcomePageConfig) {
        await projectsApi.update(newProject.id, { welcomePageConfig: originalProject.welcomePageConfig });
      }
      if (originalProject.activeComponents) {
        await projectsApi.update(newProject.id, { activeComponents: originalProject.activeComponents });
      }

      // Deep clone all pages with new IDs
      const sortedPages = sortPagesForDisplay(originalProject.pages || []);
      for (let i = 0; i < sortedPages.length; i++) {
        const originalPage = sortedPages[i];
        
        // Clone components with new IDs
        const clonedComponents: PlacedComponent[] = originalPage.components.map((comp) => ({
          ...comp,
          id: generateId(),
        }));

        // Create the page
        await pagesApi.create({
          project_id: newProject.id,
          name: originalPage.name,
          type: originalPage.type,
          components: clonedComponents,
          order_index: i,
        });
      }

      // Refresh projects to get the new one with pages
      const updatedProject = await projectsApi.getById(newProject.id);
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === newProject.id ? updatedProject : p)),
      }));

      return newProject.id;
    } catch (err: any) {
      console.error('Failed to duplicate project:', err);
      throw err;
    }
  },
  
  // Page actions
  addPage: async (projectId, name, type) => {
    try {
      const project = get().getProject(projectId);
      if (!project) throw new Error('Project not found');

      // Get current page count for order_index
      const currentPageCount = project.pages.length;

      // Create the main page
      const newPage = await pagesApi.create({
        project_id: projectId,
        name,
        type,
        components: [],
        order_index: currentPageCount,
      });

      // Handle paired pages (listing pages that need a detail page)
      let detailPage: Page | null = null;
      if (type === 'news-listing') {
        detailPage = await pagesApi.create({
          project_id: projectId,
          name: `${name} Article`,
          type: 'news-article',
          components: [],
          order_index: currentPageCount + 1,
        });
      } else if (type === 'resources-listing') {
        detailPage = await pagesApi.create({
          project_id: projectId,
          name: `${name} Resource`,
          type: 'resource-detail',
          components: [],
          order_index: currentPageCount + 1,
        });
      } else if (type === 'events-listing') {
        detailPage = await pagesApi.create({
          project_id: projectId,
          name: `${name} Event`,
          type: 'event-detail',
          components: [],
          order_index: currentPageCount + 1,
        });
      }

      // Refresh project to get updated pages
      const updatedProject = await projectsApi.getById(projectId);

      // Update local state
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
      }));
    } catch (error) {
      console.error('Failed to add page:', error);
      throw error;
    }
  },
  
  updatePage: async (projectId, pageId, updates) => {
    try {
      await pagesApi.update(pageId, updates);
      
      // Update local state
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId ? { ...page, ...updates } : page
                ),
              }
            : p
        );
        return { projects };
      });
    } catch (error) {
      console.error('Failed to update page:', error);
      throw error;
    }
  },
  
  deletePage: async (projectId, pageId) => {
    try {
      await pagesApi.delete(pageId);
      
      // Refresh project to get updated pages
      const updatedProject = await projectsApi.getById(projectId);

      // Update local state
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
      }));
    } catch (error) {
      console.error('Failed to delete page:', error);
      throw error;
    }
  },
  
  // Navigation config actions
  updateNavigationConfig: (projectId, config) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, navigationConfig: config } : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  // Footer config actions
  updateFooterConfig: (projectId, config) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, footerConfig: config } : p
      );
      saveProjects(projects);
      return { projects };
    });
  },

  // Welcome page config actions
  updateWelcomePageConfig: async (projectId, config) => {
    try {
      await projectsApi.update(projectId, { welcomePageConfig: config });
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId ? { ...p, welcomePageConfig: config } : p
        );
        return { projects };
      });
    } catch (err: any) {
      console.error('Failed to update welcome page config:', err);
      throw err;
    }
  },

  // Active components actions
  updateActiveComponents: async (projectId, activeComponents) => {
    try {
      await projectsApi.update(projectId, { activeComponents });
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId ? { ...p, activeComponents } : p
        );
        return { projects };
      });
    } catch (err: any) {
      console.error('Failed to update active components:', err);
      throw err;
    }
  },
  
  // Component actions
  addComponent: async (projectId, pageId, component) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');

      const newComponent: PlacedComponent = {
        ...component,
        id: generateId(),
        order: page.components.length,
      };

      const updatedComponents = [...page.components, newComponent];

      // Save to API
      await pagesApi.update(pageId, { components: updatedComponents });

      // Update local state
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((pg) =>
                  pg.id === pageId ? { ...pg, components: updatedComponents } : pg
                ),
              }
            : p
        );
        return { projects };
      });
    } catch (error) {
      console.error('Failed to add component:', error);
      throw error;
    }
  },
  
  updateComponent: async (projectId, pageId, componentId, props) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');

      const updatedComponents = page.components.map((c) =>
        c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c
      );

      // Save to API
      await pagesApi.update(pageId, { components: updatedComponents });

      // Update local state
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((pg) =>
                  pg.id === pageId ? { ...pg, components: updatedComponents } : pg
                ),
              }
            : p
        );
        return { projects };
      });
    } catch (error) {
      console.error('Failed to update component:', error);
      throw error;
    }
  },
  
  updateComponentHelpText: async (projectId, pageId, componentId, helpText) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');

      const updatedComponents = page.components.map((c) =>
        c.id === componentId ? { ...c, helpText } : c
      );

      // Save to API
      await pagesApi.update(pageId, { components: updatedComponents });

      // Update local state
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((pg) =>
                  pg.id === pageId ? { ...pg, components: updatedComponents } : pg
                ),
              }
            : p
        );
        return { projects };
      });
    } catch (error) {
      console.error('Failed to update component help text:', error);
      throw error;
    }
  },
  
  deleteComponent: async (projectId, pageId, componentId) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');

      const updatedComponents = page.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => ({ ...c, order: i }));

      // Save to API
      await pagesApi.update(pageId, { components: updatedComponents });

      // Update local state
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((pg) =>
                  pg.id === pageId ? { ...pg, components: updatedComponents } : pg
                ),
              }
            : p
        ),
        selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
      }));
    } catch (error) {
      console.error('Failed to delete component:', error);
      throw error;
    }
  },
  
  reorderComponents: async (projectId, pageId, componentIds) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');

      const componentMap = new Map(page.components.map((c) => [c.id, c]));
      const reordered = componentIds
        .map((id, index) => {
          const comp = componentMap.get(id);
          return comp ? { ...comp, order: index } : null;
        })
        .filter((c): c is PlacedComponent => c !== null);

      // Save to API
      await pagesApi.update(pageId, { components: reordered });

      // Update local state
      set((state) => {
        const projects = state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((pg) =>
                  pg.id === pageId ? { ...pg, components: reordered } : pg
                ),
              }
            : p
        );
        return { projects };
      });
    } catch (error) {
      console.error('Failed to reorder components:', error);
      throw error;
    }
  },
  
  // Selection actions
  selectClient: (id) => set({ selectedClientId: id }),
  selectProject: (id) => set({ selectedProjectId: id }),
  selectPage: (id) => set({ selectedPageId: id }),
  selectComponent: (id) => set({ selectedComponentId: id }),
  
  // Getters
  getClient: (id) => get().clients.find((c) => c.id === id),
  getProject: (id) => get().projects.find((p) => p.id === id),
  getPage: (projectId, pageId) => {
    const project = get().projects.find((p) => p.id === projectId);
    return project?.pages.find((page) => page.id === pageId);
  },
  getProjectsForClient: (clientId) => get().projects.filter((p) => p.clientId === clientId),
}));


