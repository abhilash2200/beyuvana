"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { Loader2 } from "lucide-react";
import {
    callPaymentResponseAPI,
    extractRedirectPath,
    normalizeRedirectPath,
} from "@/lib/payment-utils";

function PaymentInitiateContent() {
    const router = useRouter();
    const { clearCart } = useCart();
    const [status, setStatus] = useState<"processing" | "error">("processing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const isProcessingRef = useRef(false);
    const hasProcessedRef = useRef(false);

    const verifyPaymentStatus = useCallback(
        async (storedOrderId: string) => {
            try {
                setStatus("processing");
                // Get promo_code from localStorage if available
                const promoCode = typeof window !== "undefined" ? localStorage.getItem("promo_code") : null;
                const response = await callPaymentResponseAPI(storedOrderId, promoCode || undefined);
                const result: unknown = response.data || response;

                localStorage.removeItem("orderId");
                // Clear promo_code after payment verification
                if (typeof window !== "undefined") {
                    localStorage.removeItem("promo_code");
                }

                // Extract redirect path based on API response status
                let redirectPath = extractRedirectPath(result, response);

                if (!redirectPath) {
                    // If no redirect path found, determine based on status
                    if (response.status === true) {
                        redirectPath = "/payment-success";
                    } else if (response.status === false) {
                        redirectPath = "/payment-failed";
                    } else {
                        setStatus("error");
                        setErrorMessage(response.message || "Backend did not provide payment status. Please check your orders or contact support.");
                        return;
                    }
                }

                redirectPath = normalizeRedirectPath(redirectPath);

                // Clear cart only on successful payment
                if (redirectPath.includes("payment-success")) {
                    try {
                        await clearCart();
                    } catch {
                        // Silently handle cart clear errors
                    }
                }

                router.replace(redirectPath);
            } catch {
                localStorage.removeItem("orderId");
                // Clear promo_code on error
                if (typeof window !== "undefined") {
                    localStorage.removeItem("promo_code");
                }
                setStatus("error");
                setErrorMessage("Unable to verify payment status. Please refresh or contact support.");
            } finally {
                isProcessingRef.current = false;
            }
        },
        [clearCart, router]
    );

    useEffect(() => {
        if (isProcessingRef.current || hasProcessedRef.current) {
            return;
        }

        // Ensure we're on the client side
        if (typeof window === "undefined") {
            return;
        }

        const processPaymentCallback = async () => {
            if (isProcessingRef.current || hasProcessedRef.current) return;

            isProcessingRef.current = true;

            try {
                let orderId = localStorage.getItem("orderId");

                if (!orderId) {
                    const urlParams = new URLSearchParams(window.location.search);
                    orderId =
                        urlParams.get("payment_request_id") ||
                        urlParams.get("orderId") ||
                        urlParams.get("paymentRequestId") ||
                        null;
                    if (orderId) {
                        localStorage.setItem("orderId", orderId);
                    }
                }

                if (orderId) {
                    hasProcessedRef.current = true;
                    await verifyPaymentStatus(orderId);
                } else {
                    setStatus("error");
                    setErrorMessage("No payment information found. Please start checkout from your cart.");
                    isProcessingRef.current = false;
                }
            } catch {
                isProcessingRef.current = false;
                hasProcessedRef.current = false;
                setStatus("error");
                setErrorMessage("Failed to process payment callback. Please try again or contact support.");
            }
        };

        processPaymentCallback();
    }, [router, verifyPaymentStatus]);

    if (status === "error") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h1 className="font-[Grafiels] text-[#1A2819] text-[28px] mb-2">
                                Payment Verification Failed
                            </h1>
                            <p className="text-[#3B3B3B] text-[15px] mb-6">{errorMessage}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push("/")}
                                className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={() => router.push("/orders")}
                                className="border-2 border-[#057A37] text-[#057A37] hover:bg-[#057A37] hover:text-white px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300"
                            >
                                Check My Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
                    <Loader2 className="w-12 h-12 text-[#057A37] animate-spin mx-auto mb-4" />
                    <h1 className="font-[Grafiels] text-[#1A2819] text-[28px] mb-2">
                        Verifying Payment
                    </h1>
                    <p className="text-[#3B3B3B] text-[15px]">
                        Please wait while we verify your payment...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PaymentInitiatePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057A37]"></div>
                </div>
            }
        >
            <PaymentInitiateContent />
        </Suspense>
    );
}
