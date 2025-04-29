import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function CalendarEmbed() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("haircut");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBook = () => {
    setSubmitted(true);
    setOpen(false);
    
    // Would typically send this data to a backend API
    console.log({
      name,
      email,
      service,
      date: date ? format(date, "PPP") : "",
      time
    });
  };

  return (
    <Card className="booking-embed shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h3 className="font-heading text-xl font-bold mb-2">Select a Date</h3>
            <p className="text-gray-600 mb-4">Choose a date for your appointment</p>
          </div>

          <div className="flex justify-center">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
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
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleBook} 
              disabled={!name || !email || !service || !time}
            >
              Book Appointment
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
