import { supabase } from './supabase';

// Types
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Login function
export async function login(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the session in localStorage
    localStorage.setItem('auth_session', JSON.stringify(data.data.session));
    localStorage.setItem('auth_user', JSON.stringify(data.data.user));

    return data.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout function
export async function logout() {
  try {
    const session = getSession();
    if (!session) {
      return;
    }

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    // Clear the session from localStorage
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_user');

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get the current user
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const userJson = localStorage.getItem('auth_user');
  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user JSON:', error);
    return null;
  }
}

// Get the current session
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const sessionJson = localStorage.getItem('auth_session');
  if (!sessionJson) {
    return null;
  }

  try {
    const session = JSON.parse(sessionJson);
    
    // Check if the session is expired
    if (session.expires_at && session.expires_at < Date.now() / 1000) {
      // Session is expired, remove it
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error parsing session JSON:', error);
    return null;
  }
}

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  return !!getSession();
}

// Get the authentication token for API requests
export function getAuthToken(): string | null {
  const session = getSession();
  return session ? session.access_token : null;
}

// Helper function to make authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  
  return fetch(url, authOptions);
}
