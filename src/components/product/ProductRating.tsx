"use client";

import { CompactRatingDisplay } from "../common/RatingDisplay";
import { useProductRating } from "@/hooks/useProductRating";

interface ProductRatingProps {
    productId: number | string;
    sessionKey?: string;
    className?: string;
}

export default function ProductRating({
    productId,
    sessionKey,
    className = ""
}: ProductRatingProps) {
    const { ratingStats, loading, error } = useProductRating({
        productId,
        sessionKey,
        enabled: !!productId
    });

    if (loading) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-1" />
                    ))}
                </div>
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <span className="text-sm text-gray-500">No ratings yet</span>
            </div>
        );
    }

    return (
        <CompactRatingDisplay
            ratingStats={ratingStats}
            className={className}
        />
    );
}
