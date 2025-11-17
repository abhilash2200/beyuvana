/**
 * Shared hook for payment verification logic
 * Used by both payment-initial and payment-initiate pages
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import {
    callPaymentResponseAPI,
    extractRedirectPath,
    normalizeRedirectPath,
} from "@/lib/payment-utils";

interface UsePaymentVerificationOptions {
    /** Custom error message when no payment information is found */
    noPaymentInfoMessage?: string;
}

export function usePaymentVerification(options: UsePaymentVerificationOptions = {}) {
    const router = useRouter();
    const { clearCart } = useCart();
    const [status, setStatus] = useState<"processing" | "error">("processing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const isProcessingRef = useRef(false);
    const hasProcessedRef = useRef(false);

    const defaultNoPaymentMessage = "No payment information found. Please check your orders or contact support.";
    const noPaymentInfoMessage = options.noPaymentInfoMessage || defaultNoPaymentMessage;

    const verifyPaymentStatus = useCallback(
        async (storedOrderId: string) => {
            try {
                setStatus("processing");
                const response = await callPaymentResponseAPI(storedOrderId);
                const result: unknown = response.data || response;

                // Safely remove orderId from localStorage
                try {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("orderId");
                    }
                } catch {
                    // Ignore localStorage errors
                }

                // Extract redirect path based on API response status
                // If status is true → success, if false → failed
                let redirectPath = extractRedirectPath(result, response);

                if (!redirectPath) {
                    // If no redirect path found, determine based on status
                    if (response.status === true) {
                        redirectPath = "/payment-success";
                    } else if (response.status === false) {
                        redirectPath = "/payment-failed";
                    } else {
                        setStatus("error");
                        setErrorMessage(
                            response.message ||
                            "Backend did not provide payment status. Please check your orders or contact support."
                        );
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
                // Safely remove orderId from localStorage on error
                try {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("orderId");
                    }
                } catch {
                    // Ignore localStorage errors
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
                let orderId: string | null = null;

                // Safely get orderId from localStorage
                try {
                    orderId = localStorage.getItem("orderId");
                } catch {
                    // Ignore localStorage errors
                }

                if (!orderId) {
                    const urlParams = new URLSearchParams(window.location.search);
                    orderId =
                        urlParams.get("payment_request_id") ||
                        urlParams.get("orderId") ||
                        urlParams.get("paymentRequestId") ||
                        null;

                    if (orderId) {
                        try {
                            localStorage.setItem("orderId", orderId);
                        } catch {
                            // Ignore localStorage errors
                        }
                    }
                }

                if (orderId) {
                    hasProcessedRef.current = true;
                    await verifyPaymentStatus(orderId);
                } else {
                    setStatus("error");
                    setErrorMessage(noPaymentInfoMessage);
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
    }, [router, verifyPaymentStatus, noPaymentInfoMessage]);

    return {
        status,
        errorMessage,
    };
}

