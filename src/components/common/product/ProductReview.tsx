"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";
import { reviewApi, ProductReviewRequest, ProductReviewItem } from "@/lib/api";

// Extended interface to match actual API response
interface ApiReviewItem extends ProductReviewItem {
    customer_name?: string;
    customer_id?: string;
    customer_logo?: string;
    product_id?: string;
}
import { toast } from "react-toastify";

interface ProductReviewProps {
    productId: string;
    productName?: string;
    orderStatus?: "arriving" | "cancelled" | "delivered"; // Optional: If provided from order detail page, use this instead of fetching
    skipOrderCheck?: boolean; // Optional: Skip order check (for admin/testing purposes)
}

const ProductReview = memo(({ productId, orderStatus, skipOrderCheck = false }: ProductReviewProps) => {
    const { user, sessionKey } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [userReviews, setUserReviews] = useState<ApiReviewItem[]>([]);
    const [allReviews, setAllReviews] = useState<ApiReviewItem[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [existingReview, setExistingReview] = useState<ApiReviewItem | null>(null);
    const [canReview, setCanReview] = useState<boolean | null>(null); // null = checking, true = can review, false = cannot
    const [reviewRestrictionReason, setReviewRestrictionReason] = useState<string | null>(null);
    const [checkingReviewEligibility, setCheckingReviewEligibility] = useState(false);

    const currentUserReviews = useMemo(() => {
        if (!user?.id) return [];

        return allReviews.filter(review => {
            const reviewUserName = review.customer_name;
            const reviewUserId = review.customer_id;

            const matchesName = reviewUserName === user.name;
            const matchesId = reviewUserId === user.id || reviewUserId === parseInt(user.id).toString();

            return matchesName || matchesId;
        });
    }, [allReviews, user?.id, user?.name]);

    // Check if user can review this product
    useEffect(() => {
        const checkReviewEligibility = async () => {
            // Skip check if explicitly disabled or if orderStatus is provided and is "delivered"
            if (skipOrderCheck) {
                setCanReview(true);
                return;
            }

            // If orderStatus is provided from order detail page, use it directly
            if (orderStatus !== undefined) {
                if (orderStatus === "delivered") {
                    setCanReview(true);
                    setReviewRestrictionReason(null);
                } else if (orderStatus === "cancelled") {
                    setCanReview(false);
                    setReviewRestrictionReason("Reviews are not allowed for cancelled or failed orders. Please place a new order.");
                } else {
                    setCanReview(false);
                    setReviewRestrictionReason("You can only review products after your order has been delivered. Please wait for delivery.");
                }
                return;
            }

            // Otherwise, check via API if user is logged in
            if (!user?.id || !sessionKey) {
                setCanReview(null); // Will show login message
                return;
            }

            try {
                setCheckingReviewEligibility(true);
                const eligibility = await reviewApi.canUserReview(productId, user.id, sessionKey);

                setCanReview(eligibility.canReview);
                setReviewRestrictionReason(eligibility.reason || null);
            } catch {
                // On error, allow review but backend should validate
                setCanReview(true);
                setReviewRestrictionReason(null);
            } finally {
                setCheckingReviewEligibility(false);
            }
        };

        checkReviewEligibility();
    }, [productId, user?.id, sessionKey, orderStatus, skipOrderCheck]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) {
                setReviewsLoading(false);
                return;
            }

            try {
                setReviewsLoading(true);
                const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);

                let reviews: ProductReviewItem[] = [];
                if (response.data && Array.isArray(response.data)) {
                    reviews = response.data;
                } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                    reviews = response.data.reviews;
                }

                if (reviews.length > 0) {
                    setAllReviews(reviews);
                } else {
                    setAllReviews([]);
                }
            } catch {
                setAllReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [productId, sessionKey]);

    // Refetch reviews when user changes (login/logout)
    useEffect(() => {
        if (user?.id && productId) {
            const refetchReviews = async () => {
                try {
                    const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);
                    let reviews: ProductReviewItem[] = [];
                    if (response.data && Array.isArray(response.data)) {
                        reviews = response.data;
                    } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                        reviews = response.data.reviews;
                    }

                    if (reviews.length > 0) {
                        setAllReviews(reviews);
                    }
                } catch {
                    // Silently handle error, reviews will remain as previous state
                }
            };
            refetchReviews();
        } else if (!user?.id) {
            setUserReviews([]);
            setHasReviewed(false);
            setExistingReview(null);
        }
    }, [user?.id, productId, sessionKey]);

    useEffect(() => {
        setUserReviews(currentUserReviews);
        setHasReviewed(currentUserReviews.length > 0);
        setExistingReview(currentUserReviews.length > 0 ? currentUserReviews[0] : null);

    }, [currentUserReviews]);

    const toggleForm = useCallback(() => {
        if (hasReviewed && existingReview) {
            setMessage(existingReview.review);
            setRating(existingReview.star_ratting);
            setIsEditing(true);
        } else {
            setMessage("");
            setRating(0);
            setIsEditing(false);
        }
        setShowForm(!showForm);
    }, [showForm, hasReviewed, existingReview]);

    const validateInput = (text: string): string => {
        // Enhanced XSS prevention - remove potentially dangerous characters
        return text.trim()
            .replace(/[<>]/g, '') // Remove angle brackets
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/script/gi, ''); // Remove script tags (basic)
    };

    const handleSubmit = async () => {
        setIsValidating(true);

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setSubmitError("Please write a review before submitting.");
            setIsValidating(false);
            return;
        }

        if (trimmedMessage.length < 10) {
            setSubmitError("Please write at least 10 characters for your review.");
            setIsValidating(false);
            return;
        }

        if (trimmedMessage.length > 1000) {
            setSubmitError("Review is too long. Please keep it under 1000 characters.");
            setIsValidating(false);
            return;
        }

        if (rating === 0) {
            setSubmitError("Please select a star rating before submitting.");
            setIsValidating(false);
            return;
        }

        if (!user?.id) {
            setSubmitError("Please login to submit a review");
            setIsValidating(false);
            return;
        }

        // Check review eligibility before submitting
        if (!skipOrderCheck && canReview === false) {
            setSubmitError(reviewRestrictionReason || "You are not eligible to review this product.");
            setIsValidating(false);
            return;
        }

        // If canReview is null and we don't have orderStatus, check eligibility
        if (!skipOrderCheck && canReview === null && orderStatus === undefined && user?.id && sessionKey) {
            try {
                setCheckingReviewEligibility(true);
                const eligibility = await reviewApi.canUserReview(productId, user.id, sessionKey);

                if (!eligibility.canReview) {
                    setCanReview(false);
                    setReviewRestrictionReason(eligibility.reason || null);
                    setSubmitError(eligibility.reason || "You are not eligible to review this product.");
                    setIsValidating(false);
                    setCheckingReviewEligibility(false);
                    return;
                }
                setCanReview(true);
            } catch {
                // Continue with submission, backend should validate
            } finally {
                setCheckingReviewEligibility(false);
            }
        }

        setLoading(true);
        setSubmitError(null);
        setIsValidating(false);

        try {
            const reviewData: ProductReviewRequest = {
                product_id: parseInt(productId),
                user_id: parseInt(user.id),
                review: validateInput(trimmedMessage),
                star_ratting: rating,
            };

            const response = await reviewApi.addReview(reviewData, sessionKey || undefined);

            if (response.success !== false) {
                const successMessage = isEditing
                    ? "Your review has been updated successfully!"
                    : "Thank you for your review! Your feedback helps other customers.";
                toast.success(successMessage);

                const reviewItem: ApiReviewItem = {
                    id: existingReview?.id || Date.now(),
                    user_name: user.name || "Unknown",
                    customer_name: user.name || "Unknown",
                    customer_id: user.id,
                    review: validateInput(trimmedMessage),
                    star_ratting: rating,
                    created_at: existingReview?.created_at || new Date().toISOString(),
                };

                if (isEditing && existingReview) {
                    setUserReviews([reviewItem]);
                    setAllReviews(prev =>
                        prev.map(r => r.id === existingReview.id ? reviewItem : r)
                    );
                } else {
                    setUserReviews([reviewItem]);
                    setAllReviews(prev => [...prev, reviewItem]);
                    setHasReviewed(true);
                }

                setExistingReview(reviewItem);
                setShowForm(false);
                setMessage("");
                setRating(0);
                setIsEditing(false);
                setIsValidating(false);

                setTimeout(async () => {
                    try {
                        const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);
                        let reviews: ProductReviewItem[] = [];
                        if (response.data && Array.isArray(response.data)) {
                            reviews = response.data;
                        } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                            reviews = response.data.reviews;
                        }

                        if (reviews.length > 0) {
                            setAllReviews(reviews);
                        }
                    } catch {
                        // Silently handle error
                    }
                }, 1000);
            } else {
                const errorMsg = response.message || "Failed to submit review. Please try again.";
                setSubmitError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to submit review. Please try again.";
            setSubmitError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = useCallback((rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    }, []);

    if (reviewsLoading) {
        return (
            <div className="space-y-4 w-full">
                <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <div className="text-gray-600 text-sm">Loading reviews...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {/* Review Summary */}
            <div className="bg-[#F2F9F3] border border-gray-200 p-4 rounded-[20px] transition-all duration-300 ease-in-out">

                {/* Display User's Existing Reviews */}
                {userReviews.length > 0 && (
                    <div className="space-y-3 mb-4">
                        <h2 className="font-[Grafiels] text-[18px] text-[#1A2819]">Your Review:</h2>
                        {userReviews.map((review, index) => (
                            <div key={review.id || index} className="p-3 rounded bg-white border border-gray-200 transition-all duration-200 hover:shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FaUserCircle className="w-6 h-6 text-gray-400" />
                                        <span className="font-medium capitalize text-sm">{review.customer_name || review.user_name}</span>
                                    </div>
                                    {renderStars(review.star_ratting)}
                                </div>
                                <p className="text-gray-700 capitalize text-sm">{review.review}</p>
                                {review.created_at && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Rate this Product Button */}
                {!showForm && (
                    <div className="space-y-3">
                        {/* Review eligibility messages */}
                        {checkingReviewEligibility && (
                            <div className="text-center text-gray-600 text-sm">
                                Verifying review eligibility...
                            </div>
                        )}

                        {!checkingReviewEligibility && canReview === false && reviewRestrictionReason && (
                            <div className="text-red-500 text-sm">
                                {reviewRestrictionReason}
                            </div>
                        )}

                        {!checkingReviewEligibility && canReview === null && !user?.id && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                                Please log in to leave a review for this product.
                            </div>
                        )}

                        {!checkingReviewEligibility && canReview !== false && (
                            <div className="flex items-center justify-center">
                                <Button
                                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={toggleForm}
                                    disabled={false}
                                >
                                    {hasReviewed ? "Edit Review" : "Rate this Product"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="p-4 bg-green-50 rounded-lg space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded animate-in slide-in-from-top-1 duration-200">
                            {submitError}
                        </div>
                    )}
                    <p className="font-[Grafiels] text-lg text-[#1A2819] mb-0">
                        {isEditing ? "Edit Your Review" : "Your Rating"}
                    </p>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                                <FaStar
                                    key={i}
                                    className={`cursor-pointer text-2xl transition-all duration-150 hover:scale-110 ${starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onClick={() => {
                                        setRating(starValue);
                                        if (submitError) setSubmitError(null);
                                    }}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>

                    {/* Review Message */}
                    <div className="space-y-1">
                        <Textarea
                            className="w-full p-2 border rounded text-sm bg-white text-gray-700"
                            placeholder="Write your review... (minimum 10 characters)"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                if (submitError) setSubmitError(null);
                            }}
                            rows={5}
                            maxLength={1000}
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {message.length}/1000 characters
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2">
                        <Button
                            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 font-normal transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            onClick={handleSubmit}
                            disabled={loading || isValidating}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {isEditing ? "Updating..." : "Submitting..."}
                                </div>
                            ) : isValidating ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-pulse h-4 w-4 bg-white rounded"></div>
                                    Validating...
                                </div>
                            ) : (
                                isEditing ? "Update Review" : "Submit Review"
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="px-6 py-3 font-normal border-red-700 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95 hover:cursor-pointer hover:text-red-900"
                            onClick={() => {
                                setShowForm(false);
                                setMessage("");
                                setRating(0);
                                setSubmitError(null);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
});

ProductReview.displayName = "ProductReview";

export default ProductReview;
