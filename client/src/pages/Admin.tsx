import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, Calendar, Clock, User, Mail, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsForm from "@/components/admin/SettingsForm";
import { Badge } from "@/components/ui/badge";

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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
        setError(null);
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

  useEffect(() => {
    fetchBookings();
  }, []);
  
  const handleDeleteBooking = async (id: number) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the booking from the state instead of refreshing the entire list
        setBookings(currentBookings => 
          currentBookings.filter(booking => booking.id !== id)
        );
        
        toast({
          title: "Booking deleted",
          description: "The booking has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the booking",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Function to get human-readable service names
  const getServiceName = (serviceId: string): string => {
    const services: Record<string, string> = {
      'haircut': 'Haircut',
      'beardtrim': 'Beard Trim',
      'shapeup': 'Shape up',
      'haircut&beardtrim': 'Haircut & Beard Trim'
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

  // Convert 24h time format to 12h format
  const formatTimeToStandard = (time: string): string => {
    if (!time) return '';
    const hour = parseInt(time.split(':')[0], 10);
    const minutes = time.split(':')[1];
    const period = hour >= 12 ? 'PM' : 'AM';
    const standardHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${standardHour}:${minutes} ${period}`;
  };

  return (
    <div className="container py-10">
      <Card className="mb-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Manage your Joel's Barber Lounge</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="bookings" className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
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
                <>
                  {/* Mobile view - Card layout */}
                  <div className="md:hidden space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{booking.name}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Mail className="h-3 w-3 mr-1" />
                                {booking.email}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">{getServiceName(booking.service)}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{formatTimeToStandard(booking.time)}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Booked on {formatTimestamp(booking.createdAt)}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={deletingId === booking.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === booking.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span>Cancel</span>
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Desktop view - Table layout */}
                  <div className="hidden md:block rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.name}</TableCell>
                              <TableCell>{booking.email}</TableCell>
                              <TableCell>{getServiceName(booking.service)}</TableCell>
                              <TableCell>{formatDate(booking.date)}</TableCell>
                              <TableCell>{formatTimeToStandard(booking.time)}</TableCell>
                              <TableCell>{formatTimestamp(booking.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  disabled={deletingId === booking.id}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  {deletingId === booking.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Delete booking</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}