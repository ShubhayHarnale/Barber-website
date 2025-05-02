import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { contactMessageSchema } from '../_lib/validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET request - fetch all contact messages
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching contact messages'
      });
    }
  }
  
  // POST request - create a new contact message
  if (req.method === 'POST') {
    try {
      // Validate the request body
      const validatedData = contactMessageSchema.parse(req.body);
      
      // Create the contact message
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject || null,
          message: validatedData.message
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({
        success: true,
        message: 'Contact message saved successfully',
        data: { id: data.id }
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
      
      console.error('Error creating contact message:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while saving your message'
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
