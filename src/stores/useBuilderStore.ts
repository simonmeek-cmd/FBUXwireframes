import { create } from 'zustand';
import type { Client, Project, Page, PlacedComponent, PageType } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';
import { generateId } from '../types/builder';
import { loadClients, saveClients, loadProjects, saveProjects } from '../utils/storage';

interface BuilderState {
  // Data
  clients: Client[];
  projects: Project[];
  
  // UI State
  selectedClientId: string | null;
  selectedProjectId: string | null;
  selectedPageId: string | null;
  selectedComponentId: string | null;
  
  // Client actions
  addClient: (name: string) => void;
  updateClient: (id: string, name: string) => void;
  deleteClient: (id: string) => void;
  
  // Project actions
  addProject: (clientId: string, name: string) => void;
  updateProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  
  // Page actions
  addPage: (projectId: string, name: string, type: PageType) => void;
  updatePage: (projectId: string, pageId: string, updates: Partial<Pick<Page, 'name' | 'type'>>) => void;
  deletePage: (projectId: string, pageId: string) => void;
  
  // Navigation config actions
  updateNavigationConfig: (projectId: string, config: NavigationConfig) => void;
  
  // Footer config actions
  updateFooterConfig: (projectId: string, config: FooterConfig) => void;
  
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
  initialize: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  clients: [],
  projects: [],
  selectedClientId: null,
  selectedProjectId: null,
  selectedPageId: null,
  selectedComponentId: null,
  
  // Initialize from localStorage
  initialize: () => {
    set({
      clients: loadClients(),
      projects: loadProjects(),
    });
  },
  
  // Client actions
  addClient: (name) => {
    const newClient: Client = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const clients = [...state.clients, newClient];
      saveClients(clients);
      return { clients };
    });
  },
  
  updateClient: (id, name) => {
    set((state) => {
      const clients = state.clients.map((c) =>
        c.id === id ? { ...c, name } : c
      );
      saveClients(clients);
      return { clients };
    });
  },
  
  deleteClient: (id) => {
    set((state) => {
      const clients = state.clients.filter((c) => c.id !== id);
      const projects = state.projects.filter((p) => p.clientId !== id);
      saveClients(clients);
      saveProjects(projects);
      return { clients, projects };
    });
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


