import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Return API status
  return res.status(200).json({
    status: 'ok',
    message: 'BarberCraft API is running'
  });
}
