
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  totalStars?: number;
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
};

export function StarRating({ totalStars = 5, rating, setRating, interactive = false, className }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover || rating);
        const isHalfFilled = !isFilled && (hover || rating) > index && (hover || rating) < starValue;

        return (
          <div
            key={starValue}
            className={cn("relative", interactive ? "cursor-pointer" : "")}
            onClick={() => interactive && setRating?.(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
          >
            <Star
              className={cn(
                "w-5 h-5 text-gray-300",
                isFilled ? "text-yellow-400 fill-yellow-400" : ""
              )}
            />
            {isHalfFilled && (
                <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

    