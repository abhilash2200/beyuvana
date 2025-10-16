"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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

interface Review {
    name: string;
    rating: number;
    message: string;
}

interface ProductReviewProps {
    productId: string; // product id for API
    productName?: string; // product name for display
}

const ProductReview = ({ productId, productName }: ProductReviewProps) => {
    const { user, sessionKey } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState<Review | null>(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [userReviews, setUserReviews] = useState<ApiReviewItem[]>([]);
    const [allReviews, setAllReviews] = useState<ApiReviewItem[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [existingReview, setExistingReview] = useState<ApiReviewItem | null>(null);

    // Memoize user reviews to prevent unnecessary re-renders
    const currentUserReviews = useMemo(() => {
        if (!user?.id) return [];

        return allReviews.filter(review => {
            // Use the actual API field names
            const reviewUserName = review.customer_name;
            const reviewUserId = review.customer_id;

            const matchesName = reviewUserName === user.name;
            const matchesId = reviewUserId === user.id || reviewUserId === parseInt(user.id).toString();

            return matchesName || matchesId;
        });
    }, [allReviews, user?.id, user?.name]);

    // Fetch reviews for this product from API
    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) {
                setReviewsLoading(false);
                return;
            }

            try {
                setReviewsLoading(true);
                const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);

                // Handle both possible response structures
                let reviews: ProductReviewItem[] = [];
                if (response.data && Array.isArray(response.data)) {
                    // Direct array in data field
                    reviews = response.data;
                } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                    // Array in data.reviews field
                    reviews = response.data.reviews;
                }

                if (reviews.length > 0) {
                    setAllReviews(reviews);
                } else {
                    setAllReviews([]);
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setAllReviews([]);
                // Don't show error to user for fetch failures, just log it
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [productId, sessionKey]); // Removed user?.id dependency to fetch all reviews regardless of user state

    // Refetch reviews when user changes (login/logout)
    useEffect(() => {
        if (user?.id && productId) {
            // User logged in, refetch reviews to get their review
            const refetchReviews = async () => {
                try {
                    const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);
                    // Handle both possible response structures
                    let reviews: ProductReviewItem[] = [];
                    if (response.data && Array.isArray(response.data)) {
                        reviews = response.data;
                    } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                        reviews = response.data.reviews;
                    }

                    if (reviews.length > 0) {
                        setAllReviews(reviews);
                    }
                } catch (err) {
                    console.error("Error refetching reviews after user change:", err);
                }
            };
            refetchReviews();
        } else if (!user?.id) {
            // User logged out, clear user-specific state but keep all reviews
            setUserReviews([]);
            setHasReviewed(false);
            setExistingReview(null);
        }
    }, [user?.id, productId, sessionKey]);

    // Update user reviews and hasReviewed when allReviews or user changes
    useEffect(() => {
        setUserReviews(currentUserReviews);
        setHasReviewed(currentUserReviews.length > 0);
        // Set the existing review (user can only have one review per product)
        setExistingReview(currentUserReviews.length > 0 ? currentUserReviews[0] : null);

        // Update state based on filtered reviews
    }, [currentUserReviews]);

    const toggleForm = useCallback(() => {
        if (hasReviewed && existingReview) {
            // If editing existing review, pre-fill the form
            setMessage(existingReview.review);
            setRating(existingReview.star_ratting);
            setIsEditing(true);
        } else {
            // If adding new review, clear the form
            setMessage("");
            setRating(0);
            setIsEditing(false);
        }
        setShowForm(!showForm);
    }, [showForm, hasReviewed, existingReview]);

    // Input validation and sanitization
    const validateInput = (text: string): string => {
        return text.trim().replace(/[<>]/g, ''); // Basic XSS prevention
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

        setLoading(true);
        setError(null);
        setSubmitError(null);
        setIsValidating(false);

        try {
            const reviewData: ProductReviewRequest = {
                product_id: parseInt(productId),
                user_id: parseInt(user.id),
                review: validateInput(trimmedMessage),
                star_ratting: rating,
            };

            // Debug: Review to submit

            const response = await reviewApi.addReview(reviewData, sessionKey || undefined);

            if (response.success !== false) {
                // Debug: Review saved successfully
                const successMessage = isEditing
                    ? "Your review has been updated successfully!"
                    : "Thank you for your review! Your feedback helps other customers.";
                toast.success(successMessage);

                // Create the updated/new review object with correct API field names
                const reviewItem: ApiReviewItem = {
                    id: existingReview?.id || Date.now(), // Use existing ID if editing
                    user_name: user.name || "Unknown",
                    customer_name: user.name || "Unknown", // API field name
                    customer_id: user.id, // API field name
                    review: validateInput(trimmedMessage),
                    star_ratting: rating,
                    created_at: existingReview?.created_at || new Date().toISOString(),
                };

                if (isEditing && existingReview) {
                    // Update existing review in both arrays
                    setUserReviews([reviewItem]);
                    setAllReviews(prev =>
                        prev.map(r => r.id === existingReview.id ? reviewItem : r)
                    );
                } else {
                    // Add new review
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

                // Refetch reviews from server to ensure we have the latest data
                setTimeout(async () => {
                    try {
                        const response = await reviewApi.getReviews(parseInt(productId), sessionKey || undefined);
                        // Handle both possible response structures
                        let reviews: ProductReviewItem[] = [];
                        if (response.data && Array.isArray(response.data)) {
                            reviews = response.data;
                        } else if (response.data?.reviews && Array.isArray(response.data.reviews)) {
                            reviews = response.data.reviews;
                        }

                        if (reviews.length > 0) {
                            setAllReviews(reviews);
                        }
                    } catch (err) {
                        console.error("Error refetching reviews after submission:", err);
                    }
                }, 1000); // Small delay to ensure server has processed the request
            } else {
                const errorMsg = response.message || "Failed to submit review. Please try again.";
                setSubmitError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error("Error saving review:", err);
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
            <div className="bg-[#F2F9F3] p-4 rounded-lg transition-all duration-300 ease-in-out">

                {/* Display User's Existing Reviews */}
                {userReviews.length > 0 && (
                    <div className="space-y-3 mb-4">
                        <h2 className="font-[Grafiels] text-[18px] text-[#1A2819]">Your Review:</h2>
                        {userReviews.map((review, index) => (
                            <div key={review.id || index} className="bg-white p-3 rounded border border-[#1A2819] transition-all duration-200 hover:shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FaUserCircle className="w-6 h-6 text-gray-400" />
                                        <span className="font-medium text-sm">{review.customer_name || review.user_name}</span>
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
                    <div className="flex items-center justify-center">
                        <Button
                            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={toggleForm}
                        >
                            {hasReviewed ? "Edit Review" : "Rate this Product"}
                        </Button>
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
                            className="px-6 py-3 font-normal"
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
};

export default ProductReview;
