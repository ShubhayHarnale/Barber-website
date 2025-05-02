const { createClient } = require('@supabase/supabase-js');

// Supabase client for server-side usage
const supabaseUrl = process.env.SUPABASE_URL || 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Main handler for /api/settings
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - fetch barber settings (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('barber_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while fetching barber settings'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          workingDays: data.working_days
        }
      });
    } catch (error) {
      console.error('Error fetching barber settings:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching barber settings'
      });
    }
  }
  
  // For other methods, return method not allowed
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
};
