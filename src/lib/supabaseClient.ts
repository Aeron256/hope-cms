import { createClient } from '@supabase/supabase-js';
// Retrieve environment variables 
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables are defined to prevent runtime errors
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

// Initialize the Supabase client 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);