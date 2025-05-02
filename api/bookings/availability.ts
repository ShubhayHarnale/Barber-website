import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET request - check time slot availability
  if (req.method === 'GET') {
    try {
      const { date, time } = req.query;
      
      if (!date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Both date and time parameters are required'
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
      
      // Check if the selected time is during working hours
      const workingHours = {
        startTime: settingsData.working_days.startTime,
        endTime: settingsData.working_days.endTime
      };
      
      const selectedTime = parseInt((time as string).split(':')[0], 10);
      const startHour = parseInt(workingHours.startTime.split(':')[0], 10);
      const endHour = parseInt(workingHours.endTime.split(':')[0], 10);
      
      if (selectedTime < startHour || selectedTime >= endHour) {
        return res.status(400).json({
          success: false,
          message: `Selected time is outside working hours. We are open from ${workingHours.startTime} to ${workingHours.endTime}.`
        });
      }
      
      // Check if the time slot is already booked
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
        message: 'An error occurred while checking time slot availability'
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
