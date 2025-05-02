# BarberCraft - Joel's Barber Lounge

A modern web application for a barbershop that allows customers to book appointments and the barber to manage their schedule.

## Features

- **Appointment Booking**: Customers can book appointments based on available time slots
- **Admin Dashboard**: Manage bookings, working hours, and services
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Contact Form**: Customers can send messages to the barber

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Express.js, Vercel Serverless Functions
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth

## Deployment Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Vercel account

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Set up environment variables in Vercel:
   - Go to your project settings in the Vercel dashboard
   - Add the environment variables from your `.env` file
   - Make sure to add `SUPABASE_SERVICE_ROLE_KEY` as it's not included in the repository

## Database Setup

The application uses Supabase as the database provider. The following tables are required:

- `users`: For admin authentication
- `contact_messages`: To store contact form submissions
- `bookings`: To store appointment bookings
- `barber_settings`: To store working days and hours

Row Level Security (RLS) policies are configured to control data access based on user roles.

## License

MIT
