import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const date = req.query.date as string;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

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
    const dayMap = {
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
