"use client";

import { Rating } from "@mui/material";
import { RatingStats, formatRating, formatReviewCount, getRatingColor } from "@/lib/ratingUtils";

interface RatingDisplayProps {
    ratingStats: RatingStats;
    showCount?: boolean;
    showDistribution?: boolean;
    size?: "small" | "medium" | "large";
    className?: string;
}

function RatingDisplay({
    ratingStats,
    showCount = true,
    showDistribution = false,
    size = "medium",
    className = ""
}: RatingDisplayProps) {
    const { averageRating, totalReviews, ratingDistribution } = ratingStats;

    const sizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2">
                <Rating
                    name="read-only-rating"
                    value={averageRating}
                    precision={0.1}
                    readOnly
                    size={size}
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: '#fbbf24',
                        },
                        '& .MuiRating-iconEmpty': {
                            color: '#d1d5db',
                        },
                    }}
                />
                <span className={`${sizeClasses[size]} font-medium ${getRatingColor(averageRating)}`}>
                    {formatRating(averageRating)}
                </span>
                {showCount && (
                    <span className={`${sizeClasses[size]} text-gray-600`}>
                        ({formatReviewCount(totalReviews)})
                    </span>
                )}
            </div>

            {showDistribution && totalReviews > 0 && (
                <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star as keyof typeof ratingDistribution];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                            <div key={star} className="flex items-center gap-2 text-sm">
                                <span className="w-4 text-center">{star}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-gray-600">{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function CompactRatingDisplay({
    ratingStats,
    className = ""
}: {
    ratingStats: RatingStats;
    className?: string;
}) {
    const { averageRating, totalReviews } = ratingStats;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Rating
                name="compact-rating"
                value={averageRating}
                precision={0.1}
                readOnly
                size="small"
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: '#fbbf24',
                    },
                    '& .MuiRating-iconEmpty': {
                        color: '#d1d5db',
                    },
                }}
            />
            <span className="text-sm font-medium text-gray-700">
                {formatRating(averageRating)}
            </span>
            <span className="text-xs text-gray-500">
                ({formatReviewCount(totalReviews)})
            </span>
        </div>
    );
}

export { RatingDisplay };
export default RatingDisplay;
