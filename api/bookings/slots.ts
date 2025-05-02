import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET request - get booked time slots for a date
  if (req.method === 'GET') {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date parameter is required'
        });
      }
      
      // Get barber settings to check if the day is available
      const { data: settingsData, error: settingsError } = await supabase
        .from('barber_settings')
        .select('*')
        .single();
      
      if (settingsError) throw settingsError;
      
      // Check if the selected date is a working day based on settings
      const dateObj = new Date(date as string);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayMap: Record<number, string> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      };
      
      const isDayAvailable = settingsData.working_days[dayMap[dayOfWeek]];
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Selected date is not a working day based on the barber\'s schedule.'
        });
      }
      
      // Get all booked time slots for the date
      const { data, error } = await supabase
        .from('bookings')
        .select('time')
        .eq('date', date);
      
      if (error) throw error;
      
      const bookedSlots = data.map(booking => booking.time);
      
      return res.status(200).json({
        success: true,
        data: bookedSlots
      });
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching booked time slots'
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
