"use client";

import { RatingDisplay } from "../common/RatingDisplay";
import { calculateRatingFromDistribution } from "@/lib/ratingUtils";

/**
 * Example component demonstrating the rating system
 * Based on your example: 10 people gave 4 stars, 7 people gave 3 stars, and 3 people gave 5 stars
 */
export default function RatingExample() {
    // Example data from your request
    const exampleDistribution = {
        5: 3,  // 3 people gave 5 stars
        4: 10, // 10 people gave 4 stars  
        3: 7,  // 7 people gave 3 stars
        2: 0,  // 0 people gave 2 stars
        1: 0   // 0 people gave 1 stars
    };

    // Calculate rating stats from the distribution
    const ratingStats = calculateRatingFromDistribution(exampleDistribution);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Rating System Example</h2>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Input Data:</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>10 people gave 4 stars</li>
                    <li>7 people gave 3 stars</li>
                    <li>3 people gave 5 stars</li>
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Calculated Results:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <RatingDisplay
                        ratingStats={ratingStats}
                        showCount={true}
                        showDistribution={true}
                        size="large"
                    />
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p><strong>Total Reviews:</strong> {ratingStats.totalReviews}</p>
                <p><strong>Average Rating:</strong> {ratingStats.averageRating.toFixed(2)}</p>
                <p><strong>Calculation:</strong> (3×5 + 10×4 + 7×3) ÷ 20 = {ratingStats.averageRating.toFixed(2)}</p>
            </div>
        </div>
    );
}
