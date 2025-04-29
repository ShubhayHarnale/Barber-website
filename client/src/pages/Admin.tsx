import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

interface Booking {
  id: number;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  createdAt: string;
}

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        
        if (data.success) {
          setBookings(data.data);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to get human-readable service names
  const getServiceName = (serviceId: string): string => {
    const services: Record<string, string> = {
      'haircut': 'Haircut',
      'beardtrim': 'Beard Trim',
      'shave': 'Hot Towel Shave',
      'combo': 'Haircut & Beard Trim'
    };
    
    return services[serviceId] || serviceId;
  };
  
  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      return dateStr;
    } catch (error) {
      return dateStr;
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className="container py-10">
      <Card className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>View all appointment bookings</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Total: {bookings.length} bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No bookings found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{getServiceName(booking.service)}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>{booking.time}</TableCell>
                      <TableCell>{formatTimestamp(booking.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}