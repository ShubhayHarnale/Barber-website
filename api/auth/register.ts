import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Registration schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters")
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for registration
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Validate the request body
    const validatedData = registerSchema.parse(req.body);
    
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password
    });
    
    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }
    
    // Create a user record in our users table
    if (authData.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          username: validatedData.username,
        }]);
      
      if (userError) {
        // If there was an error creating the user record, delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        return res.status(500).json({
          success: false,
          message: 'Error creating user record'
        });
      }
    }
    
    // Return success
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: authData.user
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationError.details
      });
    }
    
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
}
