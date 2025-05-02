/// <reference path="../../vercel.d.ts" />
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { createProtectedHandler } from '../_lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking ID'
    });
  }
  
  // DELETE request - delete a booking
  if (req.method === 'DELETE') {
    try {
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
  
  // GET request - get a specific booking
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the booking'
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
