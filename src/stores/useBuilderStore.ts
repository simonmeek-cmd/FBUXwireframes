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
  addPage: (projectId: string, name: string, type: PageType) => void;
  updatePage: (projectId: string, pageId: string, updates: Partial<Pick<Page, 'name' | 'type'>>) => void;
  deletePage: (projectId: string, pageId: string) => void;
  
  // Navigation config actions
  updateNavigationConfig: (projectId: string, config: NavigationConfig) => void;
  
  // Footer config actions
  updateFooterConfig: (projectId: string, config: FooterConfig) => void;
  
  // Welcome page config actions
  updateWelcomePageConfig: (projectId: string, config: WelcomePageConfig) => void;
  
  // Active components actions
  updateActiveComponents: (projectId: string, activeComponents: ComponentType[]) => void;
  
  // Component actions
  addComponent: (projectId: string, pageId: string, component: Omit<PlacedComponent, 'id' | 'order'>) => void;
  updateComponent: (projectId: string, pageId: string, componentId: string, props: Record<string, unknown>) => void;
  updateComponentHelpText: (projectId: string, pageId: string, componentId: string, helpText: string) => void;
  deleteComponent: (projectId: string, pageId: string, componentId: string) => void;
  reorderComponents: (projectId: string, pageId: string, componentIds: string[]) => void;
  
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
  addPage: (projectId, name, type) => {
    const newPage: Page = {
      id: generateId(),
      name,
      type,
      components: [],
    };
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, pages: [...p.pages, newPage] } : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  updatePage: (projectId, pageId, updates) => {
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
      saveProjects(projects);
      return { projects };
    });
  },
  
  deletePage: (projectId, pageId) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? { ...p, pages: p.pages.filter((page) => page.id !== pageId) }
          : p
      );
      saveProjects(projects);
      return { projects };
    });
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
  addComponent: (projectId, pageId, component) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              pages: p.pages.map((page) => {
                if (page.id !== pageId) return page;
                const newComponent: PlacedComponent = {
                  ...component,
                  id: generateId(),
                  order: page.components.length,
                };
                return { ...page, components: [...page.components, newComponent] };
              }),
            }
          : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  updateComponent: (projectId, pageId, componentId, props) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              pages: p.pages.map((page) =>
                page.id === pageId
                  ? {
                      ...page,
                      components: page.components.map((c) =>
                        c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c
                      ),
                    }
                  : page
              ),
            }
          : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  updateComponentHelpText: (projectId, pageId, componentId, helpText) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              pages: p.pages.map((page) =>
                page.id === pageId
                  ? {
                      ...page,
                      components: page.components.map((c) =>
                        c.id === componentId ? { ...c, helpText } : c
                      ),
                    }
                  : page
              ),
            }
          : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  deleteComponent: (projectId, pageId, componentId) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              pages: p.pages.map((page) =>
                page.id === pageId
                  ? {
                      ...page,
                      components: page.components
                        .filter((c) => c.id !== componentId)
                        .map((c, i) => ({ ...c, order: i })),
                    }
                  : page
              ),
            }
          : p
      );
      saveProjects(projects);
      return { projects, selectedComponentId: null };
    });
  },
  
  reorderComponents: (projectId, pageId, componentIds) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              pages: p.pages.map((page) => {
                if (page.id !== pageId) return page;
                const componentMap = new Map(page.components.map((c) => [c.id, c]));
                const reordered = componentIds
                  .map((id, index) => {
                    const comp = componentMap.get(id);
                    return comp ? { ...comp, order: index } : null;
                  })
                  .filter((c): c is PlacedComponent => c !== null);
                return { ...page, components: reordered };
              }),
            }
          : p
      );
      saveProjects(projects);
      return { projects };
    });
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


