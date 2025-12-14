import { supabase } from '../lib/supabase';
import type { Client, Project, Page, PlacedComponent, PageType } from '../types/builder';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

// Get auth token for API calls
const getAuthToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }
    
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

// Clients API
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    return apiRequest<Client[]>('/clients');
  },

  getById: async (id: string): Promise<Client> => {
    return apiRequest<Client>(`/clients/${id}`);
  },

  create: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    return apiRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    return apiRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Projects API
export const projectsApi = {
  getAll: async (clientId?: string): Promise<Project[]> => {
    const query = clientId ? `?client_id=${clientId}` : '';
    const data = await apiRequest<any[]>(`/projects${query}`);
    // Convert snake_case to camelCase
    return data.map((p: any) => ({
      id: p.id,
      clientId: p.client_id,
      name: p.name,
      pages: (p.pages || []).map((page: any) => ({
        id: page.id,
        name: page.name,
        type: page.type,
        components: page.components || [],
      })),
      createdAt: p.created_at,
      navigationConfig: p.navigation_config,
      footerConfig: p.footer_config,
      welcomePageConfig: p.welcome_page_config,
      activeComponents: p.active_components,
    }));
  },

  getById: async (id: string): Promise<Project & { pages: Page[] }> => {
    const data = await apiRequest<any>(`/projects/${id}`);
    // Convert snake_case to camelCase
    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      pages: (data.pages || []).map((page: any) => ({
        id: page.id,
        name: page.name,
        type: page.type,
        components: page.components || [],
      })),
      createdAt: data.created_at,
      navigationConfig: data.navigation_config,
      footerConfig: data.footer_config,
      welcomePageConfig: data.welcome_page_config,
      activeComponents: data.active_components,
    };
  },

  create: async (project: Omit<Project, 'id' | 'createdAt' | 'pages'>): Promise<Project> => {
    // Convert camelCase to snake_case for API
    const dbProject = {
      client_id: project.clientId,
      name: project.name,
      navigation_config: project.navigationConfig,
      footer_config: project.footerConfig,
      welcome_page_config: project.welcomePageConfig,
      active_components: project.activeComponents,
    };
    const data = await apiRequest<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(dbProject),
    });
    // Convert back to camelCase
    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      pages: [],
      createdAt: data.created_at,
      navigationConfig: data.navigation_config,
      footerConfig: data.footer_config,
      welcomePageConfig: data.welcome_page_config,
      activeComponents: data.active_components,
    };
  },

  update: async (id: string, updates: Partial<Project>): Promise<Project> => {
    // Convert camelCase to snake_case for API
    const dbUpdates: any = {};
    if (updates.clientId !== undefined) dbUpdates.client_id = updates.clientId;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.navigationConfig !== undefined) dbUpdates.navigation_config = updates.navigationConfig;
    if (updates.footerConfig !== undefined) dbUpdates.footer_config = updates.footerConfig;
    if (updates.welcomePageConfig !== undefined) dbUpdates.welcome_page_config = updates.welcomePageConfig;
    if (updates.activeComponents !== undefined) dbUpdates.active_components = updates.activeComponents;
    
    const data = await apiRequest<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbUpdates),
    });
    // Convert back to camelCase
    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      pages: [], // Pages are loaded separately
      createdAt: data.created_at,
      navigationConfig: data.navigation_config,
      footerConfig: data.footer_config,
      welcomePageConfig: data.welcome_page_config,
      activeComponents: data.active_components,
    };
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Pages API
export const pagesApi = {
  getAll: async (projectId: string): Promise<Page[]> => {
    const data = await apiRequest<any[]>(`/pages?project_id=${projectId}`);
    // Convert snake_case to camelCase
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      components: p.components || [],
    }));
  },

  getById: async (id: string): Promise<Page> => {
    const data = await apiRequest<any>(`/pages/${id}`);
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      components: data.components || [],
    };
  },

  create: async (page: { project_id: string; name: string; type: PageType; components: PlacedComponent[]; order_index?: number }): Promise<Page> => {
    const data = await apiRequest<any>('/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      components: data.components || [],
    };
  },

  update: async (id: string, updates: Partial<Page>): Promise<Page> => {
    const data = await apiRequest<any>(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      components: data.components || [],
    };
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/pages/${id}`, {
      method: 'DELETE',
    });
  },
};

