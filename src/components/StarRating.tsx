"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export default function StarRating({
  rating,
  max = 5,
  onRatingChange,
  readOnly = false,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => onRatingChange?.(starValue)}
            className={cn(
              "transition-all duration-200 focus:outline-none",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95",
              isActive ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground opacity-30"
            )}
          >
            <Star size={readOnly ? 14 : 24} />
          </button>
        );
      })}
    </div>
  );
}
