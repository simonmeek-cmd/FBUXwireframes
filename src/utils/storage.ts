// localStorage persistence utilities

import type { Client, Project } from '../types/builder';

const STORAGE_KEYS = {
  CLIENTS: 'wireframe-builder-clients',
  PROJECTS: 'wireframe-builder-projects',
} as const;

// Client storage
export const loadClients = (): Client[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to load clients from localStorage');
    return [];
  }
};

export const saveClients = (clients: Client[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch {
    console.error('Failed to save clients to localStorage');
  }
};

// Project storage
export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to load projects from localStorage');
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch {
    console.error('Failed to save projects to localStorage');
  }
};

// Export all data as JSON
export const exportAllData = (): string => {
  const clients = loadClients();
  const projects = loadProjects();
  return JSON.stringify({ clients, projects }, null, 2);
};

// Import data from JSON
export const importAllData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.clients) saveClients(data.clients);
    if (data.projects) saveProjects(data.projects);
    return true;
  } catch {
    console.error('Failed to import data');
    return false;
  }
};


