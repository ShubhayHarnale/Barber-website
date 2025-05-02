import { createClient } from '@supabase/supabase-js';

// Supabase client for browser usage (public API)
// Use environment variables with fallbacks
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucgmttkscdxckdncnhcd.supabase.co';
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ210dGtzY2R4Y2tkbmNuaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDAwNjksImV4cCI6MjA2MTcxNjA2OX0.cbWwico5Re8tsXNTO6rhWmbXDpaHrHYTzLGYUBU3J-s';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for your database tables
export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export type Booking = {
  id: number;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  created_at: string;
};

export type BarberSettings = {
  id: number;
  working_days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    startTime: string;
    endTime: string;
  };
};