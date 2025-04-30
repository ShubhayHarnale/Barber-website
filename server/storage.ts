import { 
  users, type User, type InsertUser, 
  contactMessages, type ContactMessage, type ContactMessageInput,
  bookings, type Booking, type BookingInput,
  type BarberSettings, type WorkingDaySettings
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact messages methods
  createContactMessage(message: ContactMessageInput): Promise<ContactMessage>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Booking methods
  createBooking(booking: BookingInput): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  deleteBooking(id: number): Promise<boolean>;
  isTimeSlotAvailable(date: string, time: string): Promise<boolean>;
  getBookedTimeSlots(date: string): Promise<string[]>;
  
  // Settings methods
  getBarberSettings(): Promise<BarberSettings>;
  updateBarberSettings(settings: BarberSettings): Promise<BarberSettings>;
  isDayAvailable(dayOfWeek: number): Promise<boolean>;
  getWorkingHours(): Promise<{startTime: string, endTime: string}>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, ContactMessage>;
  private bookings: Map<number, Booking>;
  private settings: BarberSettings;
  private userCurrentId: number;
  private messageCurrentId: number;
  private bookingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.bookings = new Map();
    // Default settings - all weekdays available from 9am to 5pm
    this.settings = {
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
        startTime: "09:00",
        endTime: "17:00"
      }
    };
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.bookingCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact message methods
  async createContactMessage(messageData: ContactMessageInput): Promise<ContactMessage> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: ContactMessage = { 
      ...messageData, 
      id, 
      createdAt: timestamp,
      subject: messageData.subject || null
    };
    
    this.messages.set(id, message);
    return message;
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.messages.get(id);
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.messages.values()).sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  // Booking methods
  async createBooking(bookingData: BookingInput): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const timestamp = new Date();
    const booking: Booking = { 
      ...bookingData, 
      id, 
      createdAt: timestamp 
    };
    
    this.bookings.set(id, booking);
    return booking;
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }
  
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    // Check if there are any bookings for the given date and time
    const bookingsForSlot = Array.from(this.bookings.values()).find(
      (booking) => booking.date === date && booking.time === time
    );
    
    // If no booking is found for this date/time slot, it's available
    return !bookingsForSlot;
  }
  
  async getBookedTimeSlots(date: string): Promise<string[]> {
    // Find all bookings for the given date and return their time slots
    const bookedSlots = Array.from(this.bookings.values())
      .filter((booking) => booking.date === date)
      .map((booking) => booking.time);
    
    return bookedSlots;
  }
  
  // Settings methods
  async getBarberSettings(): Promise<BarberSettings> {
    return this.settings;
  }
  
  async updateBarberSettings(settings: BarberSettings): Promise<BarberSettings> {
    this.settings = settings;
    return this.settings;
  }
  
  async isDayAvailable(dayOfWeek: number): Promise<boolean> {
    // Always return true to make all days available
    return true;
  }
  
  async getWorkingHours(): Promise<{startTime: string, endTime: string}> {
    // Return a wide range of hours to allow all times
    return {
      startTime: "00:00",
      endTime: "23:00"
    };
  }
}

export const storage = new MemStorage();
