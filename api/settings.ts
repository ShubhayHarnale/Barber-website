import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { barberSettingsSchema } from './_lib/validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { createProtectedHandler } from './_lib/auth';

// Main handler for /api/settings
async function settingsHandler(req: VercelRequest, res: VercelResponse) {
  try {
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
        
        if (error) throw error;
        
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
    
    // POST request - update barber settings (protected)
    if (req.method === 'POST') {
      try {
        // Validate the request body
        const validatedData = barberSettingsSchema.parse(req.body);
        
        // Update the settings
        const { data, error } = await supabase
          .from('barber_settings')
          .update({ working_days: validatedData.workingDays })
          .eq('id', 1)
          .select()
          .single();
        
        if (error) throw error;
        
        return res.status(200).json({
          success: true,
          message: 'Settings updated successfully',
          data: {
            workingDays: data.working_days
          }
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validationError.details
          });
        }
        
        console.error('Error updating barber settings:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while updating barber settings'
        });
      }
    }
    
    // Handle unsupported methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Unhandled error in settings handler:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred'
    });
  }
}

// For POST requests (update settings), we need authentication
// For GET requests (public settings), we don't need authentication
export default async function(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // If it's a POST request, use the protected handler
    if (req.method === 'POST') {
      return createProtectedHandler(settingsHandler)(req, res);
    }
    
    // For other methods (GET), use the public handler
    return settingsHandler(req, res);
  } catch (error) {
    console.error('Unhandled error in settings default handler:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred'
    });
  }
}
