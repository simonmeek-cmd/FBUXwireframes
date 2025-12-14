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

const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
};

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const user = await verifyAuth(event.headers.authorization || null);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const projectId = pathParts[pathParts.length - 1] !== 'projects' ? pathParts[pathParts.length - 1] : null;

  try {
    switch (httpMethod) {
      case 'GET':
        if (projectId) {
          // Get single project with pages
          const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (projectError) throw projectError;

          const { data: pages, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .eq('project_id', projectId)
            .order('order_index', { ascending: true });

          if (pagesError) throw pagesError;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...project, pages: pages || [] }),
          };
        } else {
          // Get all projects (optionally filtered by client_id)
          const clientId = event.queryStringParameters?.client_id;
          let query = supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (clientId) {
            query = query.eq('client_id', clientId);
          }

          const { data, error } = await query;

          if (error) throw error;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          };
        }

      case 'POST':
        const newProject = JSON.parse(event.body || '{}');
        const { data: created, error: createError } = await supabase
          .from('projects')
          .insert({
            ...newProject,
            created_by: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;

        return {
          statusCode: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        };

      case 'PUT':
        if (!projectId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Project ID required' }),
          };
        }

        const updates = JSON.parse(event.body || '{}');
        const { data: updated, error: updateError } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', projectId)
          .select()
          .single();

        if (updateError) throw updateError;

        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        };

      case 'DELETE':
        if (!projectId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Project ID required' }),
          };
        }

        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

        if (deleteError) throw deleteError;

        return {
          statusCode: 204,
          headers,
          body: '',
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

