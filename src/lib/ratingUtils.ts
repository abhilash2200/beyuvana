// Rating calculation utilities

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewItem {
  id: number | string;
  star_ratting: number | string;
  user_name?: string;
  customer_name?: string;
  review?: string;
  created_at?: string;
  created_on?: string;
}

/**
 * Calculate rating statistics from a list of reviews
 * @param reviews Array of review items with star_ratting field
 * @returns Rating statistics including average, total count, and distribution
 */
export function calculateRatingStats(reviews: ReviewItem[]): RatingStats {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  let totalRating = 0;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let validReviews = 0;

  reviews.forEach(review => {
    // Handle both string and number ratings
    const rating = typeof review.star_ratting === 'string' 
      ? parseFloat(review.star_ratting) 
      : review.star_ratting;

    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      totalRating += rating;
      validReviews++;
      
      // Round to nearest integer for distribution
      const roundedRating = Math.round(rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        distribution[roundedRating as keyof typeof distribution]++;
      }
    }
  });

  const averageRating = validReviews > 0 ? totalRating / validReviews : 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalReviews: validReviews,
    ratingDistribution: distribution
  };
}

/**
 * Format rating for display (e.g., 4.5, 3.0)
 * @param rating The rating number
 * @returns Formatted rating string
 */
export function formatRating(rating: number): string {
  if (rating === 0) return "0.0";
  return rating.toFixed(1);
}

/**
 * Format review count for display (e.g., "1 review", "5 reviews")
 * @param count The number of reviews
 * @returns Formatted review count string
 */
export function formatReviewCount(count: number): string {
  if (count === 0) return "No reviews";
  if (count === 1) return "1 review";
  return `${count} reviews`;
}

/**
 * Get rating color based on rating value
 * @param rating The rating number (0-5)
 * @returns CSS color class or style
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-green-500";
  if (rating >= 3.0) return "text-yellow-500";
  if (rating >= 2.0) return "text-orange-500";
  return "text-red-500";
}

/**
 * Calculate rating from distribution (for cases where you have counts per star)
 * @param distribution Object with star counts
 * @returns Rating statistics
 */
export function calculateRatingFromDistribution(distribution: { [key: number]: number }): RatingStats {
  let totalRating = 0;
  let totalReviews = 0;
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Process each star rating
  Object.entries(distribution).forEach(([star, count]) => {
    const starNum = parseInt(star);
    const reviewCount = typeof count === 'number' ? count : parseInt(String(count));
    
    if (starNum >= 1 && starNum <= 5 && reviewCount > 0) {
      totalRating += starNum * reviewCount;
      totalReviews += reviewCount;
      ratingDistribution[starNum as keyof typeof ratingDistribution] = reviewCount;
    }
  });

  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution
  };
}
