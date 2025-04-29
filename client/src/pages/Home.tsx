import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/constants";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:w-2/3">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Premium Cuts & Classic Styles
            </h1>
            <p className="text-lg mb-8">
              Experience the art of barbering at Sharp Cuts, where tradition meets modern style.
            </p>
            <Link href="/booking">
              <Button className="bg-secondary hover:bg-accent text-white font-medium py-3 px-6 rounded-md transition-colors duration-200">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full hidden md:block overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
            alt="Barber shop interior" 
            className="object-cover h-full w-full"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-heading text-3xl font-bold mb-4">About Sharp Cuts</h2>
            <p className="mb-4">
              Founded in 2015, Sharp Cuts has established itself as the premier destination for quality haircuts and grooming services.
            </p>
            <p className="mb-6">
              Our expert barbers combine traditional techniques with modern styles to deliver an exceptional experience for every client.
            </p>
            <div className="flex items-center">
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-secondary hover:text-accent transition-colors duration-200"
              >
                <Instagram className="h-5 w-5 mr-2" />
                <span>Follow us on Instagram</span>
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Barber shop service" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Haircut in progress" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Beard trimming" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Barber tools" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-neutral py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                price={service.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
