import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";
import { contactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to handle contact form submissions
  app.post("/api/contact", async (req, res) => {
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
  app.get("/api/contact", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
