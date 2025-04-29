import { MapPin, Phone, Mail, Clock, CreditCard, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact-form";

export default function Contact() {
  return (
    <section className="py-12 md:py-20 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to us using any of the methods below.
          </p>
        </div>

        <div className="md:flex md:gap-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Card className="h-full">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <p className="text-gray-600">123 Main Street, Suite 101<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-gray-600">info@sharpcuts.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 7:00 PM<br />
                        Saturday: 10:00 AM - 5:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Payment Options</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      asChild
                      className="bg-[#3D95CE] hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <a href="https://venmo.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" /> Venmo
                      </a>
                    </Button>
                    
                    <Button
                      asChild
                      className="bg-[#6D39ED] hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <a href="https://www.zellepay.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" /> Zelle
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-1/2">
            <Card>
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-bold mb-6">Send Us a Message</h3>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
