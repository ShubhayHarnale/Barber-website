import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./supabase-storage";
import { contactMessageSchema, bookingSchema, barberSettingsSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { supabaseAdmin } from "./lib/supabase-admin";

// Middleware to check if the user is authenticated
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Missing or invalid token'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token'
      });
    }

    // Add the user to the request for later use
    (req as any).user = user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a dedicated router for API endpoints to ensure they take precedence
  const apiRouter = express.Router();
  app.use('/api', apiRouter);
  
  // API endpoint to handle contact form submissions
  apiRouter.post("/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactMessageSchema.parse(req.body);
      
      // Store the message
      const message = await storage.createContactMessage(validatedData);
      
      // Return success
      return res.status(201).json({
        success: true,
        message: "Contact message saved successfully",
        data: { id: message.id }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      console.error("Error saving contact message:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while saving your message"
      });
    }
  });

  // Get all contact messages (could be used for admin purposes)
  apiRouter.get("/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Error retrieving contact messages:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving messages"
      });
    }
  });
  
  // API endpoint to handle booking submissions
  apiRouter.post("/bookings", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = bookingSchema.parse(req.body);
      
      // Check if the selected date is a working day based on settings
      const dateObj = new Date(validatedData.date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isDayAvailable = await storage.isDayAvailable(dayOfWeek);
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day based on the barber's schedule."
        });
      }
      
      // Check if the selected time is during working hours based on settings
      const workingHours = await storage.getWorkingHours();
      const selectedTime = parseInt(validatedData.time.split(':')[0], 10);
      const startHour = parseInt(workingHours.startTime.split(':')[0], 10);
      const endHour = parseInt(workingHours.endTime.split(':')[0], 10);
      
      // Fix: Allow booking at the endHour (e.g., 20:00 if endHour is 20)
      if (selectedTime < startHour || selectedTime > endHour) {
        return res.status(400).json({
          success: false,
          message: `Selected time is outside working hours. We are open from ${workingHours.startTime} to ${workingHours.endTime}.`
        });
      }
      
      // Check if the selected time slot is available
      const isAvailable = await storage.isTimeSlotAvailable(validatedData.date, validatedData.time);
      
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: "This time slot is no longer available. Please select another time.",
        });
      }
      
      // Store the booking
      const booking = await storage.createBooking(validatedData);
      
      // Return success
      return res.status(201).json({
        success: true,
        message: "Booking saved successfully",
        data: { id: booking.id }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      console.error("Error saving booking:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while saving your booking"
      });
    }
  });

  // Get all bookings (for admin dashboard) - PROTECTED
  apiRouter.get("/bookings", requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      
      return res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving bookings"
      });
    }
  });
  
  // Delete a booking - PROTECTED
  apiRouter.delete("/bookings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID format"
        });
      }
      
      const deleted = await storage.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Booking deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the booking"
      });
    }
  });
  
  // Get available time slots for a specific date
  apiRouter.get("/bookings/slots/:date", async (req, res) => {
    try {
      const date = req.params.date;
      
      // Check if the selected date is a working day based on settings
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isDayAvailable = await storage.isDayAvailable(dayOfWeek);
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day based on the barber's schedule."
        });
      }
      
      const bookedSlots = await storage.getBookedTimeSlots(date);
      
      return res.status(200).json({
        success: true,
        data: bookedSlots
      });
    } catch (error) {
      console.error("Error retrieving booked time slots:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving booked time slots"
      });
    }
  });
  
  // Check if a specific time slot is available
  apiRouter.get("/bookings/availability", async (req, res) => {
    try {
      const { date, time } = req.query;
      
      if (!date || !time) {
        return res.status(400).json({
          success: false,
          message: "Both date and time parameters are required"
        });
      }
      
      // Check if the selected date is a working day based on settings
      const dateObj = new Date(date as string);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isDayAvailable = await storage.isDayAvailable(dayOfWeek);
      
      if (!isDayAvailable) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day based on the barber's schedule."
        });
      }
      
      // Check if the selected time is during working hours based on settings
      const workingHours = await storage.getWorkingHours();
      const selectedTime = parseInt((time as string).split(':')[0], 10);
      const startHour = parseInt(workingHours.startTime.split(':')[0], 10);
      const endHour = parseInt(workingHours.endTime.split(':')[0], 10);
      
      if (selectedTime < startHour || selectedTime > endHour) {
        return res.status(400).json({
          success: false,
          message: `Selected time is outside working hours. We are open from ${workingHours.startTime} to ${workingHours.endTime}.`
        });
      }
      
      const isAvailable = await storage.isTimeSlotAvailable(date as string, time as string);
      
      return res.status(200).json({
        success: true,
        available: isAvailable
      });
    } catch (error) {
      console.error("Error checking time slot availability:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while checking time slot availability"
      });
    }
  });

  // Get barber settings
  apiRouter.get("/settings", async (req, res) => {
    try {
      const settings = await storage.getBarberSettings();
      
      return res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error("Error retrieving barber settings:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving barber settings"
      });
    }
  });

  // Update barber settings - PROTECTED
  apiRouter.post("/settings", requireAuth, async (req, res) => {
    try {
      // Validate the request body
      const validatedData = barberSettingsSchema.parse(req.body);
      
      // Update the settings
      const updatedSettings = await storage.updateBarberSettings(validatedData);
      
      return res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        data: updatedSettings
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      console.error("Error updating barber settings:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating barber settings"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
