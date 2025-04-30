import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact message schema
export const contactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  subject: z.string().optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  date: text("date").notNull(), // Store as text for simplicity
  time: text("time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking schema
export const bookingSchema = createInsertSchema(bookings).pick({
  name: true,
  email: true,
  service: true,
  date: true,
  time: true,
}).extend({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Settings schema
export const workingDaySettingsSchema = z.object({
  monday: z.boolean().default(false),
  tuesday: z.boolean().default(false),
  wednesday: z.boolean().default(false),
  thursday: z.boolean().default(false),
  friday: z.boolean().default(false),
  saturday: z.boolean().default(false),
  sunday: z.boolean().default(false),
  startTime: z.string().default("09:00"),
  endTime: z.string().default("17:00"),
});

export const barberSettingsSchema = z.object({
  workingDays: workingDaySettingsSchema,
});

export type WorkingDaySettings = z.infer<typeof workingDaySettingsSchema>;
export type BarberSettings = z.infer<typeof barberSettingsSchema>;
