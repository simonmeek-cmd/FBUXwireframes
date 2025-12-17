import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key (for server-side operations)
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

// Helper to verify authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verify token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
};

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Verify authentication
  const user = await verifyAuth(event.headers.authorization || null);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const { httpMethod, path } = event;
  const clientId = path.split('/').pop();

  try {
    switch (httpMethod) {
      case 'GET':
        if (clientId && clientId !== 'clients') {
          // Get single client
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();

          if (error) throw error;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          };
        } else {
          // Get all clients
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          };
        }

      case 'POST':
        const newClient = JSON.parse(event.body || '{}');
        const { data: created, error: createError } = await supabase
          .from('clients')
          .insert({
            ...newClient,
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
        if (!clientId || clientId === 'clients') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Client ID required' }),
          };
        }

        const updates = JSON.parse(event.body || '{}');
        const { data: updated, error: updateError } = await supabase
          .from('clients')
          .update(updates)
          .eq('id', clientId)
          .select()
          .single();

        if (updateError) throw updateError;

        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        };

      case 'DELETE':
        if (!clientId || clientId === 'clients') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Client ID required' }),
          };
        }

        const { error: deleteError } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId);

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


