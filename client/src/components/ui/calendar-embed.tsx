import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function CalendarEmbed() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize Calendly widget once script is loaded
    script.onload = () => {
      if (calendarRef.current && window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/sharp-cuts/haircut',
          parentElement: calendarRef.current,
          prefill: {},
          utm: {}
        });
      }
    };

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="booking-embed shadow-lg">
      <CardContent className="p-0 h-full">
        <div 
          ref={calendarRef}
          className="calendly-inline-widget h-[650px] w-full"
          data-auto-load="false"
        >
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <Calendar className="w-16 h-16 mx-auto mb-6 text-secondary" />
              <h3 className="font-heading text-xl font-bold mb-4">Booking Calendar</h3>
              <p className="text-gray-600 mb-4">Loading booking calendar...</p>
            </div>
          </div>
        </div>
      </CardContent>
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
