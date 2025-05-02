const { createClient } = require('@supabase/supabase-js');

// Supabase client for server-side usage
const supabaseUrl = process.env.SUPABASE_URL || 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Main handler for /api/bookings
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle slots requests
  if (req.method === 'GET' && req.query.slots === 'true' && req.query.date) {
    try {
      const date = req.query.date;
      
      // Check if the date is valid
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
      
      // Get booked slots for the date
      const { data: bookedSlots, error } = await supabase
        .from('bookings')
        .select('time')
        .eq('date', date);
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while retrieving booked time slots'
        });
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
  
  // POST request - create a new booking (public)
  if (req.method === 'POST') {
    try {
      const { name, email, service, date, time } = req.body;
      
      // Basic validation
      if (!name || !email || !service || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      // Check if the time slot is available
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', date)
        .eq('time', time);
      
      if (checkError) {
        console.error('Supabase error:', checkError);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while checking availability'
        });
      }
      
      if (existingBookings && existingBookings.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'This time slot is already booked'
        });
      }
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ name, email, service, date, time }])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while creating the booking'
        });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Booking saved successfully',
        data
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the booking'
      });
    }
  }
  
  // For other methods, return method not allowed
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
};
