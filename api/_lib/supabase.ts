import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side usage (admin API)
// This uses the service role key which has higher privileges
const supabaseUrl = process.env.SUPABASE_URL || 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
}

// Create a supabase client with the service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
