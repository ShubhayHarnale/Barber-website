import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";
import { contactMessageSchema, bookingSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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
      
      // Check if the selected date is a working day (Tuesday-Saturday)
      const dateObj = new Date(validatedData.date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const workingDays = [2, 3, 4, 5, 6]; // Tuesday through Saturday
      
      if (!workingDays.includes(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day. We are open Tuesday through Saturday."
        });
      }
      
      // Check if the selected time is during working hours (10:00 AM to 5:00 PM)
      const workingHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
      
      if (!workingHours.includes(validatedData.time)) {
        return res.status(400).json({
          success: false,
          message: "Selected time is outside working hours. We are open from 10:00 AM to 5:00 PM."
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

  // Get all bookings (for admin purposes)
  apiRouter.get("/bookings", async (req, res) => {
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
  
  // Delete a booking
  apiRouter.delete("/bookings/:id", async (req, res) => {
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
  
  // Get booked time slots for a specific date
  apiRouter.get("/bookings/slots/:date", async (req, res) => {
    try {
      const date = req.params.date;
      
      // Check if the selected date is a working day (Tuesday-Saturday)
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const workingDays = [2, 3, 4, 5, 6]; // Tuesday through Saturday
      
      if (!workingDays.includes(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day. We are open Tuesday through Saturday."
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
      
      // Check if the selected date is a working day (Tuesday-Saturday)
      const dateObj = new Date(date as string);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const workingDays = [2, 3, 4, 5, 6]; // Tuesday through Saturday
      
      if (!workingDays.includes(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "Selected date is not a working day. We are open Tuesday through Saturday."
        });
      }
      
      // Check if the selected time is during working hours (10:00 AM to 5:00 PM)
      const workingHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
      
      if (!workingHours.includes(time as string)) {
        return res.status(400).json({
          success: false,
          message: "Selected time is outside working hours. We are open from 10:00 AM to 5:00 PM."
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

  const httpServer = createServer(app);
  return httpServer;
}
