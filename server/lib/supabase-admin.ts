import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side usage (admin API)
// This uses the service role key which has higher privileges
// IMPORTANT: This should ONLY be used in server-side code, never in the browser
const supabaseUrl = 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
