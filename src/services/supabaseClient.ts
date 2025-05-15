import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables should be in your .env file
// For development purposes, you can directly use your Supabase URL and anon key here,
// but in production, always use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
