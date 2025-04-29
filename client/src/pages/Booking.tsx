import { CalendarEmbed } from "@/components/ui/calendar-embed";

export default function Booking() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Book Your Appointment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select your preferred service and time slot to schedule your next appointment at Sharp Cuts.
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <CalendarEmbed />
        </div>
      </div>
    </section>
  );
}
