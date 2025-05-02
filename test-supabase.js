import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ210dGtzY2R4Y2tkbmNuaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjE0MDA2OSwiZXhwIjoyMDYxNzE2MDY5fQ.Qc2hlkXrTAOsrB8wzx3TT51ph56pabpsbrvqdSoSI4E';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test function
async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Try to fetch barber settings
    const { data, error } = await supabase
      .from('barber_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching barber settings:', error);
    } else {
      console.log('Successfully fetched barber settings:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
testConnection();
