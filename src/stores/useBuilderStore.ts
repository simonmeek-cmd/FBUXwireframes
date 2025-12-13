import { create } from 'zustand';
import type { Client, Project, Page, PlacedComponent, PageType, ComponentType } from '../types/builder';
import type { NavigationConfig } from '../types/navigation';
import type { FooterConfig } from '../types/footer';
import type { WelcomePageConfig } from '../types/welcomePage';
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
    const newPages: Page[] = [];
    
    // Pre-populate components based on page type
    const getDefaultComponents = (pageType: PageType, listingType?: 'news' | 'resources' | 'events'): PlacedComponent[] => {
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
    
    // Create the main page with pre-populated components
    const newPage: Page = {
      id: generateId(),
      name,
      type,
      components: getDefaultComponents(type),
    };
    newPages.push(newPage);
    
    // Auto-create paired detail page for listing types
    const listingDetailPairs: Record<string, { detailType: PageType; detailName: string }> = {
      'news-listing': { detailType: 'news-article', detailName: 'News Article' },
      'resources-listing': { detailType: 'resource-detail', detailName: 'Resource' },
      'events-listing': { detailType: 'event-detail', detailName: 'Event' },
    };
    
    if (listingDetailPairs[type]) {
      const { detailType, detailName } = listingDetailPairs[type];
      const detailPage: Page = {
        id: generateId(),
        name: detailName,
        type: detailType,
        components: getDefaultComponents(detailType),
      };
      newPages.push(detailPage);
    }
    
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, pages: [...p.pages, ...newPages] } : p
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
  
  updateWelcomePageConfig: (projectId, config) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, welcomePageConfig: config } : p
      );
      saveProjects(projects);
      return { projects };
    });
  },
  
  updateActiveComponents: (projectId, activeComponents) => {
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === projectId ? { ...p, activeComponents } : p
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


