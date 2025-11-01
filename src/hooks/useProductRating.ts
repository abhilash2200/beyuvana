"use client";

import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '@/lib/api';
import { calculateRatingStats, RatingStats } from '@/lib/ratingUtils';

interface UseProductRatingProps {
  productId: number | string;
  sessionKey?: string;
  enabled?: boolean;
}

interface UseProductRatingReturn {
  ratingStats: RatingStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProductRating({
  productId,
  sessionKey,
  enabled = true
}: UseProductRatingProps): UseProductRatingReturn {
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatingData = useCallback(async () => {
    if (!enabled || !productId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.getReviews(Number(productId), sessionKey);

      let reviews = [];
      if (response?.data) {
        const data = response.data as Record<string, unknown>;
        if (Array.isArray(data.reviews)) {
          reviews = data.reviews;
        } else if (Array.isArray(data)) {
          reviews = data;
        } else if (Array.isArray(data.data)) {
          reviews = data.data;
        }
      }

      const stats = calculateRatingStats(reviews);
      setRatingStats(stats);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error('Error fetching rating data:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch rating data');

      setRatingStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setLoading(false);
    }
  }, [enabled, productId, sessionKey]);

  useEffect(() => {
    fetchRatingData();
  }, [productId, sessionKey, enabled, fetchRatingData]);

  return {
    ratingStats,
    loading,
    error,
    refetch: fetchRatingData
  };
}
