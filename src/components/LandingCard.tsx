import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, GraduationCap, LucideIcon } from "lucide-react";

interface LandingCardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  gradient: string;
  icon: "Users" | "GraduationCap";
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  GraduationCap,
};

export const LandingCard = ({ title, description, image, alt, href, gradient, icon }: LandingCardProps) => {
  const IconComponent = iconMap[icon];
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ease-smooth",
        "hover:scale-[1.02] hover:shadow-hover",
        "shadow-card cursor-pointer flex-1 min-w-0",
        gradient
      )}
    >
      {/* Card Content */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
          <IconComponent className="w-8 h-8 text-foreground" />
        </div>
        
        {/* Image Container - Smaller on mobile */}
        <div className="w-full max-w-[200px] sm:max-w-xs overflow-hidden rounded-xl shadow-soft">
          <img
            src={image}
            alt={alt}
            className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 ease-smooth group-hover:scale-110"
          />
        </div>
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300 px-2">
          {description}
        </p>
      </div>
      
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </Link>
  );
};