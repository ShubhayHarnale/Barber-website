import { z } from 'zod';

// Contact message schema
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required")
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// Booking schema
export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required")
});

export type BookingInput = z.infer<typeof bookingSchema>;

// Barber settings schema
export const barberSettingsSchema = z.object({
  workingDays: z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
    startTime: z.string(),
    endTime: z.string()
  })
});

export type BarberSettings = z.infer<typeof barberSettingsSchema>;
