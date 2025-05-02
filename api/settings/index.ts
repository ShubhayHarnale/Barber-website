import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { barberSettingsSchema } from '../_lib/validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { createProtectedHandler } from '../_lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  // GET request - fetch barber settings
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('barber_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      const settings = {
        workingDays: data.working_days
      };
      
      return res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error fetching barber settings:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching barber settings'
      });
    }
  }
  
  // POST request - update barber settings
  if (req.method === 'POST') {
    try {
      // Validate the request body
      const validatedData = barberSettingsSchema.parse(req.body);
      
      // Update the settings
      const { data, error } = await supabase
        .from('barber_settings')
        .update({ working_days: validatedData.workingDays })
        .eq('id', 1) // Assuming there's only one settings record with ID 1
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      const updatedSettings = {
        workingDays: data.working_days
      };
      
      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: updatedSettings
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
}

// Export a protected handler that requires authentication
export default createProtectedHandler(handler);
