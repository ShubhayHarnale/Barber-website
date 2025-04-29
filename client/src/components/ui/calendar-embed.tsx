import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CalendarEmbed() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("haircut");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Barber's working days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const workingDays = [2, 3, 4, 5, 6]; // Tuesday through Saturday
  
  // Barber's working hours (10:00 AM to 5:00 PM)
  const allTimeSlots = [
    "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Fetch booked time slots when date changes
  useEffect(() => {
    const fetchBookedTimeSlots = async () => {
      if (!date) return;
      
      setLoading(true);
      setErrorMessage(null);
      try {
        const formattedDate = format(date, "PPP");
        const response = await fetch(`/api/bookings/slots/${encodeURIComponent(formattedDate)}`);
        const data = await response.json();
        
        if (data.success) {
          setBookedTimeSlots(data.data);
          setTime(""); // Reset time selection when date changes
        } else {
          console.error("Error fetching booked time slots:", data.message);
          setErrorMessage("Unable to load available times. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching booked time slots:", error);
        setErrorMessage("Unable to load available times. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (date) {
      fetchBookedTimeSlots();
    }
  }, [date]);
  
  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setTime("");
  };

  const handleBook = async () => {
    if (!date) return;
    
    setBookingInProgress(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          service,
          date: format(date, "PPP"),
          time
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setOpen(false);
        console.log("Booking created with ID:", data.data.id);
        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been successfully booked!",
        });
      } else {
        console.error("Error creating booking:", data.message);
        setErrorMessage(data.message || "There was an error saving your booking. Please try again.");
        
        // If time slot is no longer available, update booked slots
        if (response.status === 409) {
          setBookedTimeSlots(prev => [...prev, time]);
          setTime("");
        }
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("There was an error saving your booking. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <Card className="booking-embed shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h3 className="font-heading text-xl font-bold mb-2">Select a Date</h3>
            <p className="text-gray-600 mb-4">Choose a date for your appointment</p>
            <div className="text-sm bg-muted/50 rounded-md p-3 text-muted-foreground">
              <p><span className="font-medium">Working days:</span> Tuesday through Saturday</p>
              <p><span className="font-medium">Working hours:</span> 10:00 AM to 5:00 PM</p>
            </div>
          </div>

          <div className="flex justify-center">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              disabled={(date) => {
                // Disable dates in the past
                if (date < new Date()) return true;
                
                // Disable dates more than 2 months in the future
                if (date > new Date(new Date().setMonth(new Date().getMonth() + 2))) return true;
                
                // Disable days that are not working days (Tuesday-Saturday)
                const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
                return !workingDays.includes(dayOfWeek);
              }}
              className="rounded-md border"
            />
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => date && setOpen(true)} 
              disabled={!date}
              className="w-full sm:w-auto"
            >
              {date ? `Book for ${format(date, "MMMM d, yyyy")}` : "Select a Date First"}
            </Button>
          </div>

          {submitted && (
            <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Booking request sent!</p>
              <p className="text-sm">We'll confirm your appointment via email shortly.</p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Fill out the form below to book your appointment for {date && format(date, "MMMM d, yyyy")}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Your full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haircut">Haircut ($30)</SelectItem>
                  <SelectItem value="beardtrim">Beard Trim ($20)</SelectItem>
                  <SelectItem value="shave">Hot Towel Shave ($35)</SelectItem>
                  <SelectItem value="combo">Haircut & Beard Trim ($45)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2" />
                  <span className="text-sm text-muted-foreground">Loading available times...</span>
                </div>
              ) : (
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTimeSlots.map(timeSlot => (
                      <SelectItem 
                        key={timeSlot} 
                        value={timeSlot}
                        disabled={bookedTimeSlots.includes(timeSlot)}
                      >
                        {parseInt(timeSlot) < 12 
                          ? `${timeSlot} AM` 
                          : `${parseInt(timeSlot) === 12 ? '12:00' : (parseInt(timeSlot) - 12) + ':00'} PM`}
                        {bookedTimeSlots.includes(timeSlot) && " (Booked)"}
                      </SelectItem>
                    ))}
                    {allTimeSlots.length === bookedTimeSlots.length && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No times available. Please select another date.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleBook} 
              disabled={!name || !email || !service || !time || bookingInProgress}
            >
              {bookingInProgress ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Add Calendly types
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
    };
  }
}
