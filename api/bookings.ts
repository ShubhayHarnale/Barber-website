import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { bookingSchema } from './_lib/validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { createProtectedHandler } from './_lib/auth';

// Main handler for /api/bookings
async function bookingsHandler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - fetch all bookings (protected)
  if (req.method === 'GET' && !req.query.slots && !req.query.availability) {
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
  
  // DELETE request - delete a booking by ID
  if (req.method === 'DELETE' && req.query.id) {
    try {
      const id = parseInt(req.query.id as string, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking ID format'
        });
      }
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the booking'
      });
    }
  }
  
  // Handle slots requests
  if (req.method === 'GET' && req.query.slots === 'true' && req.query.date) {
    try {
      const date = req.query.date as string;
      
      // Check if the date is valid
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
  
      // Get barber settings to check if day is available
      const { data: settingsData, error: settingsError } = await supabase
        .from('barber_settings')
        .select('*')
        .single();
      
      if (settingsError) {
        throw settingsError;
      }
  
      // Check if the day is a working day
      const dayOfWeek = dateObj.getDay();
      const dayMap: Record<number, string> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      };
      
      const day = dayMap[dayOfWeek];
      const isDayAvailable = settingsData.working_days[day];
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Selected date is not a working day based on the barber\'s schedule.'
        });
      }
  
      // Get booked slots for the date
      const { data: bookedSlots, error } = await supabase
        .from('bookings')
        .select('time')
        .eq('date', date);
      
      if (error) {
        throw error;
      }
  
      return res.status(200).json({
        success: true,
        data: bookedSlots.map(slot => slot.time)
      });
    } catch (error) {
      console.error('Error retrieving booked time slots:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving booked time slots'
      });
    }
  }
  
  // Handle availability check
  if (req.method === 'GET' && req.query.availability === 'true' && req.query.date && req.query.time) {
    try {
      const date = req.query.date as string;
      const time = req.query.time as string;
      
      // Check if the date is valid
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
      
      // Get barber settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('barber_settings')
        .select('*')
        .single();
      
      if (settingsError) {
        throw settingsError;
      }
      
      // Check if the day is a working day
      const dayOfWeek = dateObj.getDay();
      const dayMap: Record<number, string> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      };
      
      const day = dayMap[dayOfWeek];
      const isDayAvailable = settingsData.working_days[day];
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Selected date is not a working day based on the barber\'s schedule.',
          available: false
        });
      }
      
      // Check if the time is within working hours
      const workingHours = {
        startTime: settingsData.working_days.startTime,
        endTime: settingsData.working_days.endTime
      };
      
      const selectedTime = parseInt(time.split(':')[0], 10);
      const startHour = parseInt(workingHours.startTime.split(':')[0], 10);
      const endHour = parseInt(workingHours.endTime.split(':')[0], 10);
      
      if (selectedTime < startHour || selectedTime >= endHour) {
        return res.status(400).json({
          success: false,
          message: `Selected time is outside working hours. We are open from ${workingHours.startTime} to ${workingHours.endTime}.`,
          available: false
        });
      }
      
      // Check if the time slot is available
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', date)
        .eq('time', time);
      
      if (checkError) throw checkError;
      
      const isAvailable = !existingBookings || existingBookings.length === 0;
      
      return res.status(200).json({
        success: true,
        available: isAvailable
      });
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while checking time slot availability',
        available: false
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}

// Export the handler function
export default async function(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // If it's a GET request for bookings list (not slots or availability), use the protected handler
  if (req.method === 'GET' && !req.query.slots && !req.query.availability) {
    return createProtectedHandler(bookingsHandler)(req, res);
  }
  
  // For other methods, use the public handler
  return bookingsHandler(req, res);
}
