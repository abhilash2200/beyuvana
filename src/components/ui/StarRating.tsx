import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    className?: string;
}

/**
 * A reusable star rating component that displays filled and empty stars
 * @param rating - The current rating (0 to maxRating)
 * @param maxRating - Maximum number of stars (default: 5)
 * @param size - Size of the stars in pixels (default: 18)
 * @param className - Additional CSS classes
 */
export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 18,
    className = "",
}) => {
    return (
        <div className={`flex gap-1 ${className}`}>
            {Array.from({ length: maxRating }).map((_, index) => (
                <Star
                    key={index}
                    size={size}
                    fill={index < rating ? "gold" : "none"}
                    stroke="gold"
                    className="text-yellow-500"
                />
            ))}
        </div>
    );
};
