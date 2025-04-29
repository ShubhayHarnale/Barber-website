import { Scissors, PencilRuler, Droplets } from "lucide-react";

export const services = [
  {
    id: 1,
    title: "Haircut",
    description: "Precision cuts tailored to your style and face shape.",
    price: "$30",
    icon: Scissors
  },
  {
    id: 2,
    title: "Beard Trim",
    description: "Professional beard shaping and maintenance.",
    price: "$20",
    icon: PencilRuler
  },
  {
    id: 3,
    title: "Hot Towel Shave",
    description: "Classic hot towel shave for the ultimate experience.",
    price: "$35",
    icon: Droplets
  }
];

export const socialLinks = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/"
};

export const contactInfo = {
  address: "123 Main Street, Suite 101, New York, NY 10001",
  phone: "(555) 123-4567",
  email: "info@sharpcuts.com",
  hours: {
    monday: "9:00 AM - 7:00 PM",
    tuesday: "9:00 AM - 7:00 PM",
    wednesday: "9:00 AM - 7:00 PM",
    thursday: "9:00 AM - 7:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 5:00 PM",
    sunday: "Closed"
  }
};

export const paymentLinks = {
  venmo: "https://venmo.com",
  zelle: "https://www.zellepay.com/"
};
