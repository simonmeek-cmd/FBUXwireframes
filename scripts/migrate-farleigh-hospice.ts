/**
 * Migration script to export Farleigh Hospice client from localStorage
 * and import it into Supabase
 * 
 * Run this in the browser console on the deployed site or locally
 */

import { clientsApi, projectsApi, pagesApi } from '../src/api/client';
import { supabase } from '../src/lib/supabase';

// Helper to read from localStorage (same format as old storage.ts)
const loadClients = (): any[] => {
  try {
    const data = localStorage.getItem('wireframe-clients');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadProjects = (): any[] => {
  try {
    const data = localStorage.getItem('wireframe-projects');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const migrateFarleighHospice = async () => {
  console.log('🚀 Starting Farleigh Hospice migration...');
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Please log in first before running migration');
  }
  
  // Load data from localStorage
  const clients = loadClients();
  const projects = loadProjects();
  
  // Find Farleigh Hospice client
  const farleighClient = clients.find((c: any) => 
    c.name.toLowerCase().includes('farleigh') || 
    c.name.toLowerCase().includes('hospice')
  );
  
  if (!farleighClient) {
    throw new Error('Farleigh Hospice client not found in localStorage');
  }
  
  console.log('✅ Found client:', farleighClient.name);
  
  // Find all projects for this client
  const farleighProjects = projects.filter((p: any) => p.clientId === farleighClient.id);
  console.log(`✅ Found ${farleighProjects.length} project(s) for this client`);
  
  try {
    // Step 1: Create the client in Supabase
    console.log('📤 Creating client in Supabase...');
    const newClient = await clientsApi.create({
      name: farleighClient.name,
    });
    console.log('✅ Client created:', newClient.id);
    
    // Step 2: Create each project
    for (const oldProject of farleighProjects) {
      console.log(`📤 Creating project: ${oldProject.name}...`);
      
      // Create project
      const newProject = await projectsApi.create({
        clientId: newClient.id,
        name: oldProject.name,
        navigationConfig: oldProject.navigationConfig,
        footerConfig: oldProject.footerConfig,
        welcomePageConfig: oldProject.welcomePageConfig,
        activeComponents: oldProject.activeComponents,
      });
      console.log('✅ Project created:', newProject.id);
      
      // Step 3: Create all pages for this project
      if (oldProject.pages && oldProject.pages.length > 0) {
        console.log(`📤 Creating ${oldProject.pages.length} page(s)...`);
        
        for (let i = 0; i < oldProject.pages.length; i++) {
          const oldPage = oldProject.pages[i];
          console.log(`  - Creating page: ${oldPage.name}...`);
          
          const newPage = await pagesApi.create({
            project_id: newProject.id,
            name: oldPage.name,
            type: oldPage.type,
            components: oldPage.components || [],
            order_index: i,
          });
          console.log(`  ✅ Page created: ${newPage.id}`);
        }
      }
    }
    
    console.log('🎉 Migration complete!');
    console.log(`✅ Migrated client: ${newClient.name}`);
    console.log(`✅ Migrated ${farleighProjects.length} project(s)`);
    console.log('🔄 Please refresh the page to see your migrated data');
    
    return {
      success: true,
      clientId: newClient.id,
      projectsMigrated: farleighProjects.length,
    };
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// For browser console usage
if (typeof window !== 'undefined') {
  (window as any).migrateFarleighHospice = migrateFarleighHospice;
  console.log('💡 Migration function ready! Run: migrateFarleighHospice()');
}


