import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { createProtectedHandler } from '../_lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for logout
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Sign out the user
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
}

// Export a protected handler that requires authentication
export default createProtectedHandler(handler);
