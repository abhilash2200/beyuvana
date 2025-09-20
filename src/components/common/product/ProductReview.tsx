"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";

interface Review {
    name: string;
    rating: number;
    message: string;
}

interface ProductReviewProps {
    productId: string; // product id for API
}

const ProductReview = ({ productId }: ProductReviewProps) => {
    const { user, sessionKey } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState<Review | null>(null);
    const [hasReviewed, setHasReviewed] = useState(false); // user already reviewed

    useEffect(() => {
        // 🔹 Fetch existing review for this user and product from API
        // For now, we simulate by checking local storage or dummy logic
        const saved = localStorage.getItem(`review_${productId}_${user?.id}`);
        if (saved) {
            setReview(JSON.parse(saved));
            setHasReviewed(true);
        }
    }, [productId, user]);

    const toggleForm = () => setShowForm(!showForm);

    const handleSubmit = async () => {
        if (!message || rating === 0) {
            alert("Please give a rating and write a review!");
            return;
        }

        const reviewData: Review & { user_id: string; product_id: string } = {
            user_id: user?.id || "",
            name: user?.name || "Unknown",
            rating,
            message,
            product_id: productId,
        };

        console.log("Review to submit:", reviewData);

        // 🔹 API call to save review (uncomment when backend ready)
        /*
        try {
          const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "session_key": sessionKey || "",
            },
            body: JSON.stringify(reviewData),
          });
          if (!res.ok) throw new Error("Failed to save review");
          console.log("Review saved successfully!");
        } catch (err) {
          console.error("Error saving review:", err);
          return;
        }
        */

        // For now, save locally to simulate DB
        localStorage.setItem(`review_${productId}_${user?.id}`, JSON.stringify(reviewData));

        setReview({
            name: reviewData.name,
            rating: reviewData.rating,
            message: reviewData.message,
        });
        setHasReviewed(true); // hide the button
        setShowForm(false);
        setMessage("");
        setRating(0);
    };

    return (
        <div className="space-y-4 w-full">
            {/* Only show button if user has not reviewed */}
            {!hasReviewed && !showForm && (
                <div className="flex items-center justify-center">
                    <Button className="bg-green-700 hover:bg-green-800 text-white px-10 py-6" onClick={toggleForm}>
                        Rate this product
                    </Button>
                </div>
            )}

            {/* Review Form */}
            {showForm && !hasReviewed && (
                <div className="p-4 bg-green-50 rounded-lg space-y-3">
                    <p className="font-[Grafiels] text-lg text-[#1A2819] mb-0">Your Rating</p>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                                <FaStar
                                    key={i}
                                    className={`cursor-pointer text-2xl ${starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>

                    {/* Review Message */}
                    <Textarea
                        className="w-full p-2 border rounded text-sm bg-white text-gray-700"
                        placeholder="Write your review..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                    />

                    {/* Submit Button */}
                    <Button
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 font-normal"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            )}

            {/* Display saved review only after submit */}
            {review && (
                <div className="flex flex-col bg-white p-4 rounded-lg shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                        <span className="font-semibold">{review.name}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            />
                        ))}
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-sm">{review.message}</p>
                </div>
            )}
        </div>
    );
};

export default ProductReview;
