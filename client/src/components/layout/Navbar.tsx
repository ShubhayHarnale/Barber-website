import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href} className={`text-white hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-accent' : ''}`}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link 
      href={href} 
      className={`block px-3 py-2 text-white hover:text-accent text-base font-medium ${isActive ? 'text-accent' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  const closeSheet = () => setOpen(false);
  
  return (
    <header className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-heading text-xl font-bold">
              JOEL CUTS
            </Link>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/booking">Book Now</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-accent">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-primary pt-16">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <MobileNavLink href="/" onClick={closeSheet}>Home</MobileNavLink>
                  <MobileNavLink href="/booking" onClick={closeSheet}>Book Now</MobileNavLink>
                  <MobileNavLink href="/contact" onClick={closeSheet}>Contact</MobileNavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
