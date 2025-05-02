/// <reference path="../../vercel.d.ts" />
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { bookingSchema } from '../_lib/validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { createProtectedHandler } from '../_lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  // GET request - fetch all bookings (protected)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching bookings'
      });
    }
  }
  
  // POST request - create a new booking (public)
  if (req.method === 'POST') {
    try {
      // Validate the request body
      const validatedData = bookingSchema.parse(req.body);
      
      // Check if the time slot is available
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', validatedData.date)
        .eq('time', validatedData.time);
      
      if (checkError) throw checkError;
      
      if (existingBookings && existingBookings.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([validatedData])
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({
        success: true,
        message: 'Booking saved successfully',
        data
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
      
      console.error('Error creating booking:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the booking'
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}

// For GET requests (admin), we need authentication
// For POST requests (public booking), we don't need authentication
export default async function(req: VercelRequest, res: VercelResponse) {
  // If it's a GET request, use the protected handler
  if (req.method === 'GET') {
    return createProtectedHandler(handler)(req, res);
  }
  
  // For other methods (POST), use the public handler
  return handler(req, res);
}
