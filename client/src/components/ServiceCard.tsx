import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
}

export default function ServiceCard({ icon: Icon, title, description, price }: ServiceCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Icon className="text-white h-5 w-5" />
        </div>
        <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <p className="font-bold">{price}</p>
      </CardContent>
    </Card>
  );
}
