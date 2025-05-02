import { 
  type User, type InsertUser, 
  type ContactMessage, type ContactMessageInput,
  type Booking, type BookingInput,
  type BarberSettings
} from "@shared/schema";
import { IStorage } from "./storage";
import { supabaseAdmin } from "./lib/supabase-admin";

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([insertUser])
      .select()
      .single();
    
    if (error) throw new Error(`Error creating user: ${error.message}`);
    return data as User;
  }

  // Contact message methods
  async createContactMessage(messageData: ContactMessageInput): Promise<ContactMessage> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([{
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject || null,
        message: messageData.message
      }])
      .select()
      .single();
    
    if (error) throw new Error(`Error creating contact message: ${error.message}`);
    return data as ContactMessage;
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as ContactMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Error fetching contact messages: ${error.message}`);
    return data as ContactMessage[];
  }
  
  // Booking methods
  async createBooking(bookingData: BookingInput): Promise<Booking> {
    // First check if the time slot is available
    const isAvailable = await this.isTimeSlotAvailable(bookingData.date, bookingData.time);
    if (!isAvailable) {
      throw new Error('This time slot is already booked');
    }
    
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([{
        name: bookingData.name,
        email: bookingData.email,
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time
      }])
      .select()
      .single();
    
    if (error) throw new Error(`Error creating booking: ${error.message}`);
    return data as Booking;
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Booking;
  }
  
  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Error fetching bookings: ${error.message}`);
    return data as Booking[];
  }
  
  async deleteBooking(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', id);
    
    return !error;
  }
  
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time);
    
    if (error) throw new Error(`Error checking time slot availability: ${error.message}`);
    return data.length === 0; // If no bookings found, the slot is available
  }
  
  async getBookedTimeSlots(date: string): Promise<string[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('time')
      .eq('date', date);
    
    if (error) throw new Error(`Error fetching booked time slots: ${error.message}`);
    return data.map(booking => booking.time);
  }
  
  // Settings methods
  async getBarberSettings(): Promise<BarberSettings> {
    const { data, error } = await supabaseAdmin
      .from('barber_settings')
      .select('*')
      .single();
    
    if (error) throw new Error(`Error fetching barber settings: ${error.message}`);
    
    // Transform the data to match the expected format
    return {
      workingDays: data.working_days
    } as BarberSettings;
  }
  
  async updateBarberSettings(settings: BarberSettings): Promise<BarberSettings> {
    const { data, error } = await supabaseAdmin
      .from('barber_settings')
      .update({ working_days: settings.workingDays })
      .eq('id', 1) // Assuming there's only one settings record with ID 1
      .select()
      .single();
    
    if (error) throw new Error(`Error updating barber settings: ${error.message}`);
    
    // Transform the data to match the expected format
    return {
      workingDays: data.working_days
    } as BarberSettings;
  }
  
  async isDayAvailable(dayOfWeek: number): Promise<boolean> {
    const settings = await this.getBarberSettings();
    const dayMap: Record<number, keyof typeof settings.workingDays> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    const day = dayMap[dayOfWeek];
    return settings.workingDays[day] as boolean;
  }
  
  async getWorkingHours(): Promise<{startTime: string, endTime: string}> {
    const settings = await this.getBarberSettings();
    return {
      startTime: settings.workingDays.startTime,
      endTime: settings.workingDays.endTime
    };
  }
}

// Export a singleton instance of the Supabase storage
export const storage = new SupabaseStorage();
