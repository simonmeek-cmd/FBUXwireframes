import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    const projectId = event.queryStringParameters?.projectId;
    const pageId = event.queryStringParameters?.pageId;
    if (!projectId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'projectId required' }) };
    }
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .maybeSingle(false);

    if (error) {
      console.error('comments GET error', error);
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }

    const filtered = pageId ? data?.filter((c) => c.page_id === pageId) : data;
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered || []),
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      const {
        projectId,
        pageId,
        targetId,
        xPct,
        yPct,
        authorName,
        authorEmail,
        message,
      } = payload;

      if (!projectId || !authorName || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'projectId, authorName, message are required' }),
        };
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            project_id: projectId,
            page_id: pageId || null,
            target_id: targetId || null,
            x_pct: xPct ?? null,
            y_pct: yPct ?? null,
            comment_text: message,
            author_name: authorName,
            author_email: authorEmail || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('comments POST error', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
      }

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    } catch (e: any) {
      console.error('comments POST parse error', e);
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};


