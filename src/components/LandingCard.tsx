import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LandingCardProps {
  title: string;
  image: string;
  alt: string;
  href: string;
  gradient: string;
}

export const LandingCard = ({ title, image, alt, href, gradient }: LandingCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 ease-smooth",
        "hover:scale-105 hover:shadow-hover",
        "shadow-card cursor-pointer",
        gradient
      )}
    >
      {/* Card Content */}
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Image Container */}
        <div className="w-full max-w-xs overflow-hidden rounded-xl shadow-soft">
          <img
            src={image}
            alt={alt}
            className="w-full h-48 object-cover transition-transform duration-300 ease-smooth group-hover:scale-110"
          />
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
      </div>
      
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </Link>
  );
};