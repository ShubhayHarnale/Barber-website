import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/constants";
import websiteImage1 from "@/assets/WebsiteImage1.png";
import websiteImage2 from "@/assets/WebsiteImage2.png";
import websiteImage3 from "@/assets/WebsiteImage3.png";
import websiteImage4 from "@/assets/WebsiteImage4.png";
import websiteImage5 from "@/assets/WebsiteImage5.png";

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
              Experience the art of barbering at Joel Cuts, where tradition meets modern style.
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
            src={websiteImage5} 
            alt="Barber shop interior" 
            className="object-cover h-full w-full"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-8">
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-heading text-3xl font-bold mb-4">About Joel Cuts</h2>
            <p className="mb-4">
              Founded in 2015, Joel Cuts has established itself as the premier destination for quality haircuts and grooming services. With a commitment to excellence and attention to detail, we've built a loyal clientele who trust us with their style.
            </p>
            <p className="mb-4">
              Our expert barbers combine traditional techniques with modern styles to deliver an exceptional experience for every client. Each member of our team undergoes rigorous training and stays current with the latest trends and techniques in men's grooming.
            </p>
            <p className="mb-6">
              At Joel Cuts, we believe that a great haircut is more than just a service—it's an experience. From the moment you walk in, you'll enjoy our relaxed atmosphere, complimentary beverages, and personalized consultations to ensure you get exactly the look you want.
            </p>
            <div className="flex items-center">
              <a 
                href="https://www.instagram.com/joelthebarber93_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
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
                src={websiteImage1} 
                alt="Barber shop image" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src={websiteImage2} 
                alt="Haircut in progress" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src={websiteImage3} 
                alt="Beard trimming" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
              <img 
                src={websiteImage4} 
                alt="Barber tools" 
                className="rounded-lg shadow-lg h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-neutral py-12">
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
