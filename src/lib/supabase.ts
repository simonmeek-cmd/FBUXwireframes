import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase credentials not found!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('For local: set in .env.local');
  console.error('For Netlify: set in Site settings > Environment variables');
  console.error('Current values:', {
    url: supabaseUrl || 'MISSING',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  });
  
  // Show a visible error in the console that will help debug
  if (typeof window !== 'undefined') {
    console.error('🔴 Authentication will fail until Supabase credentials are configured!');
  }
}

// Create client with fallback empty strings to prevent crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to get the current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

