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
  const pageId = pathParts[pathParts.length - 1] !== 'pages' ? pathParts[pathParts.length - 1] : null;
  const projectId = event.queryStringParameters?.project_id;

  try {
    switch (httpMethod) {
      case 'GET':
        if (pageId) {
          // Get single page
          const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('id', pageId)
            .single();

          if (error) throw error;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          };
        } else if (projectId) {
          // Get all pages for a project
          const { data: pages, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .eq('project_id', projectId)
            .order('order_index', { ascending: true });

          if (pagesError) throw pagesError;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(pages || []),
          };
        } else {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Project ID or Page ID required' }),
          };
        }

      case 'POST':
        const newPage = JSON.parse(event.body || '{}');
        const { data: created, error: createError } = await supabase
          .from('pages')
          .insert(newPage)
          .select()
          .single();

        if (createError) throw createError;

        return {
          statusCode: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        };

      case 'PUT':
        if (!pageId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Page ID required' }),
          };
        }

        const updates = JSON.parse(event.body || '{}');
        const { data: updated, error: updateError } = await supabase
          .from('pages')
          .update(updates)
          .eq('id', pageId)
          .select()
          .single();

        if (updateError) throw updateError;

        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        };

      case 'DELETE':
        if (!pageId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Page ID required' }),
          };
        }

        const { error: deleteError } = await supabase
          .from('pages')
          .delete()
          .eq('id', pageId);

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

