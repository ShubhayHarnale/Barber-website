import { Link } from "wouter";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="font-heading text-xl font-bold">
              JOEL CUTS
            </Link>
            <p className="mt-2 text-sm text-gray-300">Premium barbershop services since 2015</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-accent transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-accent transition-colors duration-200">
                    Book Now
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/joelthebarber93_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} Joel Cuts. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
