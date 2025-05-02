import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './supabase';

// Middleware to check if the user is authenticated
export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
  next: () => Promise<void>
) {
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
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token'
      });
    }

    // Add the user to the request for later use
    (req as any).user = user;
    
    // Continue to the next middleware or route handler
    return next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
}

// Helper function to create a protected API handler
export function createProtectedHandler(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    await requireAuth(req, res, async () => {
      await handler(req, res);
    });
  };
}
