import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function RatingDisplay({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = true,
  className 
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = i === Math.floor(rating) && rating % 1 !== 0;
          
          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled || partial
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted-foreground"
              )}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={cn("font-medium text-foreground", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}