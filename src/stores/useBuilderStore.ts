import { create } from 'zustand';
import type { Client, Project, Page, PlacedComponent, PageType, ComponentType } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';
import type { WelcomePageConfig } from '../types/welcomePage';
import { generateId } from '../types/builder';
import { clientsApi, projectsApi, pagesApi } from '../api/client';

interface BuilderState {
  // Data
  clients: Client[];
  projects: Project[];
  
  // Loading/Error states
  loading: boolean;
  error: string | null;
  
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
  addProject: (clientId: string, name: string) => Promise<void>;
  updateProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Page actions
  addPage: (projectId: string, name: string, type: PageType) => Promise<void>;
  updatePage: (projectId: string, pageId: string, updates: Partial<Pick<Page, 'name' | 'type'>>) => Promise<void>;
  deletePage: (projectId: string, pageId: string) => Promise<void>;
  
  // Navigation config actions
  updateNavigationConfig: (projectId: string, config: NavigationConfig) => Promise<void>;
  
  // Footer config actions
  updateFooterConfig: (projectId: string, config: FooterConfig) => Promise<void>;
  
  // Welcome page config actions
  updateWelcomePageConfig: (projectId: string, config: WelcomePageConfig) => Promise<void>;
  
  // Active components actions
  updateActiveComponents: (projectId: string, activeComponents: ComponentType[]) => Promise<void>;
  
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
  refreshProject: (projectId: string) => Promise<void>;
}


export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  clients: [],
  projects: [],
  loading: false,
  error: null,
  selectedClientId: null,
  selectedProjectId: null,
  selectedPageId: null,
  selectedComponentId: null,
  
  // Initialize from API
  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const [clientsData, projectsData] = await Promise.all([
        clientsApi.getAll(),
        projectsApi.getAll(),
      ]);

      // Load pages for each project
      const projectsWithPages = await Promise.all(
        projectsData.map(async (project) => {
          const pages = await pagesApi.getAll(project.id);
          return { ...project, pages };
        })
      );

      set({
        clients: clientsData,
        projects: projectsWithPages,
        loading: false,
      });
    } catch (err: any) {
      console.error('Failed to initialize:', err);
      set({
        error: err.message || 'Failed to load data',
        loading: false,
      });
    }
  },

  // Refresh a single project (useful after updates)
  refreshProject: async (projectId: string) => {
    try {
      const project = await projectsApi.getById(projectId);
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? project : p)),
      }));
    } catch (err: any) {
      console.error('Failed to refresh project:', err);
    }
  },
  
  // Client actions
  addClient: async (name) => {
    try {
      const newClient = await clientsApi.create({ name });
      set((state) => ({
        clients: [...state.clients, newClient],
      }));
    } catch (err: any) {
      console.error('Failed to add client:', err);
      set({ error: err.message || 'Failed to add client' });
      throw err;
    }
  },
  
  updateClient: async (id, name) => {
    try {
      const updated = await clientsApi.update(id, { name });
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (err: any) {
      console.error('Failed to update client:', err);
      set({ error: err.message || 'Failed to update client' });
      throw err;
    }
  },
  
  deleteClient: async (id) => {
    try {
      await clientsApi.delete(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        projects: state.projects.filter((p) => p.clientId !== id),
      }));
    } catch (err: any) {
      console.error('Failed to delete client:', err);
      set({ error: err.message || 'Failed to delete client' });
      throw err;
    }
  },
  
  // Project actions
  addProject: async (clientId, name) => {
    try {
      const newProject = await projectsApi.create({
        clientId,
        name,
      });
      
      const project = { ...newProject, pages: [] };
      
      set((state) => ({
        projects: [...state.projects, project],
      }));
    } catch (err: any) {
      console.error('Failed to add project:', err);
      set({ error: err.message || 'Failed to add project' });
      throw err;
    }
  },
  
  updateProject: async (id, name) => {
    try {
      const updated = await projectsApi.update(id, { name });
      const existingProject = get().projects.find(p => p.id === id);
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...updated, pages: existingProject?.pages || [] } : p)),
      }));
    } catch (err: any) {
      console.error('Failed to update project:', err);
      set({ error: err.message || 'Failed to update project' });
      throw err;
    }
  },
  
  deleteProject: async (id) => {
    try {
      await projectsApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      set({ error: err.message || 'Failed to delete project' });
      throw err;
    }
  },
  
  // Page actions - helper for default components
  addPage: async (projectId, name, type) => {
    const getDefaultComponents = (pageType: PageType): PlacedComponent[] => {
      switch (pageType) {
        case 'news-listing':
          return [{
            id: generateId(),
            type: 'ListingPage',
            props: {
              listingType: 'news',
              title: 'News',
              itemCount: 9,
              showPagination: true,
              showContactInfo: true,
              contactEmail: 'press@organisation.org.uk',
              contactPhone: '020 123 456 789',
              featured1Title: 'Featured News Article',
              featured1TypeLabel: 'News',
              featured1Date: '01/01/2026',
              featured1Excerpt: 'This is a featured news article that will appear at the top of the listing.',
              featured2Title: 'Second Featured Article',
              featured2TypeLabel: 'Press Release',
              featured2Date: '01/01/2026',
              featured2Excerpt: 'Another important story highlighted for visitors.',
              featured3Title: 'Third Featured Article',
              featured3TypeLabel: 'Announcement',
              featured3Date: '01/01/2026',
              featured3Excerpt: 'A third featured item to complete the top row.',
            },
            order: 0,
          }];
        case 'resources-listing':
          return [{
            id: generateId(),
            type: 'ListingPage',
            props: {
              listingType: 'resources',
              title: 'Resources',
              itemCount: 9,
              showPagination: true,
              showContactInfo: false,
              featured1Title: 'Featured Resource Guide',
              featured1TypeLabel: 'Guide',
              featured1Date: '01/01/2026',
              featured1Excerpt: 'A comprehensive guide to help you get started.',
              featured2Title: 'Research Report 2026',
              featured2TypeLabel: 'Report',
              featured2Date: '01/01/2026',
              featured2Excerpt: 'Our latest research findings and insights.',
              featured3Title: 'Toolkit Download',
              featured3TypeLabel: 'Toolkit',
              featured3Date: '01/01/2026',
              featured3Excerpt: 'Practical tools and templates for your work.',
            },
            order: 0,
          }];
        case 'events-listing':
          return [{
            id: generateId(),
            type: 'ListingPage',
            props: {
              listingType: 'events',
              title: 'Events',
              itemCount: 9,
              showPagination: true,
              showContactInfo: false,
              featured1Title: 'Annual Conference 2026',
              featured1TypeLabel: 'Conference',
              featured1Date: '15/03/2026',
              featured2Title: 'Community Workshop',
              featured2TypeLabel: 'Workshop',
              featured2Date: '22/04/2026',
              featured3Title: 'Fundraising Gala',
              featured3TypeLabel: 'Fundraiser',
              featured3Date: '10/05/2026',
            },
            order: 0,
          }];
        case 'news-article':
          return [{
            id: generateId(),
            type: 'DetailPage',
            props: {
              detailType: 'news',
              title: 'News Article Title',
              introCopy: '<p>This is the introduction to the news article. It provides a summary of the content and encourages users to read on.</p>',
              showHeroImage: true,
              publishedDate: '01/01/2026',
              author: 'Author Name',
              typeLabel: 'News',
              tags: ['Topic 1', 'Topic 2', 'Topic 3'],
            },
            order: 0,
          }];
        case 'resource-detail':
          return [{
            id: generateId(),
            type: 'DetailPage',
            props: {
              detailType: 'resources',
              title: 'Resource Title',
              introCopy: '<p>This resource provides valuable information and tools to support your work.</p>',
              showHeroImage: true,
              publishedDate: '01/01/2026',
              author: 'Author Name',
              typeLabel: 'Guide',
              tags: ['Topic 1', 'Topic 2'],
            },
            order: 0,
          }];
        case 'event-detail':
          return [{
            id: generateId(),
            type: 'DetailPage',
            props: {
              detailType: 'events',
              title: 'Event Title',
              introCopy: '<p>Join us for this exciting event. Learn more about what to expect and how to register.</p>',
              showHeroImage: true,
              showCtaButton: true,
              ctaButtonLabel: 'Register Now',
              eventDate: '15/03/2026',
              eventTime: '10:00 - 16:00',
              eventLocation: 'Conference Centre, London',
              registrationFee: '£25.00',
              typeLabel: 'Conference',
              tags: ['Networking', 'Learning'],
            },
            order: 0,
          }];
        case 'search-results':
          return [{
            id: generateId(),
            type: 'SearchResultsPage',
            props: {
              title: 'Search result listing',
              resultCount: 10,
              showPagination: true,
              result1Title: 'First Search Result',
              result1Date: '01/01/2026',
              result1Excerpt: 'This is the first search result showing relevant content matching the user query.',
              result2Title: 'Second Search Result',
              result2Date: '15/12/2025',
              result2Excerpt: 'Another relevant result from the search with matching keywords.',
              result3Title: 'Third Search Result',
              result3Date: '10/12/2025',
              result3Excerpt: 'A third matching result to demonstrate the search results layout.',
            },
            order: 0,
          }];
        case 'homepage':
          return [
            { id: generateId(), type: 'HomepageHero', props: { heading: 'Welcome to Our Organisation', ctaLabel: 'Learn More' }, order: 0 },
            { id: generateId(), type: 'HomepageSignposts', props: { heading: 'Quick Links', columns: 4 }, order: 1 },
            { id: generateId(), type: 'HomepageImpactOverview', props: { heading: 'Our Impact', showHeading: true, showIntro: true, showQuoteWithImage: true, showPromoBox: true, showStatBox: true }, order: 2 },
            { id: generateId(), type: 'HomepageContentFeed', props: { heading: 'Latest Updates', showTabs: true }, order: 3 },
          ];
        default:
          return [];
      }
    };
    
    try {
      const newPage: Page = {
        id: generateId(),
        name,
        type,
        components: getDefaultComponents(type),
      };
      
      // Create page in database
      const created = await pagesApi.create({
        project_id: projectId,
        name: newPage.name,
        type: newPage.type,
        components: newPage.components,
        order_index: 0,
      });
      
      // Auto-create paired detail page for listing types
      const listingDetailPairs: Record<string, { detailType: PageType; detailName: string }> = {
        'news-listing': { detailType: 'news-article', detailName: 'News Article' },
        'resources-listing': { detailType: 'resource-detail', detailName: 'Resource' },
        'events-listing': { detailType: 'event-detail', detailName: 'Event' },
      };
      
      const pagesToAdd: Page[] = [{
        id: created.id,
        name: created.name,
        type: created.type,
        components: created.components || [],
      }];
      
      if (listingDetailPairs[type]) {
        const { detailType, detailName } = listingDetailPairs[type];
        const detailPage: Page = {
          id: generateId(),
          name: detailName,
          type: detailType,
          components: getDefaultComponents(detailType),
        };
        
        const detailCreated = await pagesApi.create({
          project_id: projectId,
          name: detailPage.name,
          type: detailPage.type,
          components: detailPage.components,
          order_index: 1,
        });
        
        pagesToAdd.push({
          id: detailCreated.id,
          name: detailCreated.name,
          type: detailCreated.type,
          components: detailCreated.components || [],
        });
      }
      
      // Update local state
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, pages: [...p.pages, ...pagesToAdd] } : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to add page:', err);
      set({ error: err.message || 'Failed to add page' });
      throw err;
    }
  },
  
  updatePage: async (projectId, pageId, updates) => {
    try {
      await pagesApi.update(pageId, updates);
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId ? { ...page, ...updates } : page
                ),
              }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update page:', err);
      set({ error: err.message || 'Failed to update page' });
      throw err;
    }
  },
  
  deletePage: async (projectId, pageId) => {
    try {
      await pagesApi.delete(pageId);
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, pages: p.pages.filter((page) => page.id !== pageId) }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to delete page:', err);
      set({ error: err.message || 'Failed to delete page' });
      throw err;
    }
  },
  
  // Navigation config actions
  updateNavigationConfig: async (projectId, config) => {
    try {
      await projectsApi.update(projectId, { navigationConfig: config });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, navigationConfig: config } : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update navigation config:', err);
      set({ error: err.message || 'Failed to update navigation config' });
      throw err;
    }
  },
  
  // Footer config actions
  updateFooterConfig: async (projectId, config) => {
    try {
      await projectsApi.update(projectId, { footerConfig: config });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, footerConfig: config } : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update footer config:', err);
      set({ error: err.message || 'Failed to update footer config' });
      throw err;
    }
  },
  
  updateWelcomePageConfig: async (projectId, config) => {
    try {
      await projectsApi.update(projectId, { welcomePageConfig: config });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, welcomePageConfig: config } : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update welcome page config:', err);
      set({ error: err.message || 'Failed to update welcome page config' });
      throw err;
    }
  },
  
  updateActiveComponents: async (projectId, activeComponents) => {
    try {
      await projectsApi.update(projectId, { activeComponents });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, activeComponents } : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update active components:', err);
      set({ error: err.message || 'Failed to update active components' });
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
      
      await pagesApi.update(pageId, { components: updatedComponents });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId
                    ? { ...page, components: updatedComponents }
                    : page
                ),
              }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to add component:', err);
      set({ error: err.message || 'Failed to add component' });
      throw err;
    }
  },
  
  updateComponent: async (projectId, pageId, componentId, props) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');
      
      const updatedComponents = page.components.map((c) =>
        c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c
      );
      
      await pagesApi.update(pageId, { components: updatedComponents });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId
                    ? { ...page, components: updatedComponents }
                    : page
                ),
              }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update component:', err);
      set({ error: err.message || 'Failed to update component' });
      throw err;
    }
  },
  
  updateComponentHelpText: async (projectId, pageId, componentId, helpText) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');
      
      const updatedComponents = page.components.map((c) =>
        c.id === componentId ? { ...c, helpText } : c
      );
      
      await pagesApi.update(pageId, { components: updatedComponents });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId
                    ? { ...page, components: updatedComponents }
                    : page
                ),
              }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to update component help text:', err);
      set({ error: err.message || 'Failed to update component help text' });
      throw err;
    }
  },
  
  deleteComponent: async (projectId, pageId, componentId) => {
    try {
      const page = get().getPage(projectId, pageId);
      if (!page) throw new Error('Page not found');
      
      const updatedComponents = page.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => ({ ...c, order: i }));
      
      await pagesApi.update(pageId, { components: updatedComponents });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId
                    ? { ...page, components: updatedComponents }
                    : page
                ),
              }
            : p
        ),
        selectedComponentId: null,
      }));
    } catch (err: any) {
      console.error('Failed to delete component:', err);
      set({ error: err.message || 'Failed to delete component' });
      throw err;
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
      
      await pagesApi.update(pageId, { components: reordered });
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                pages: p.pages.map((page) =>
                  page.id === pageId ? { ...page, components: reordered } : page
                ),
              }
            : p
        ),
      }));
    } catch (err: any) {
      console.error('Failed to reorder components:', err);
      set({ error: err.message || 'Failed to reorder components' });
      throw err;
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
