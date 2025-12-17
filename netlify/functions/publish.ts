import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const pathParts = event.path.split('/').filter(Boolean);
  const projectId = pathParts[pathParts.length - 1];

  if (!projectId || projectId === 'publish') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Project ID required' }),
    };
  }

  try {
    // Fetch project with pages (public access - no auth required)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    // Fetch pages for this project
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
    }

    // Fetch client name
    const { data: client } = await supabase
      .from('clients')
      .select('name')
      .eq('id', project.client_id)
      .single();

    // Convert to camelCase for frontend
    const response = {
      id: project.id,
      clientId: project.client_id,
      name: project.name,
      clientName: client?.name || 'Client',
      pages: (pages || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        components: p.components || [],
      })),
      navigationConfig: project.navigation_config,
      footerConfig: project.footer_config,
      welcomePageConfig: project.welcome_page_config,
      activeComponents: project.active_components,
      createdAt: project.created_at,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};


