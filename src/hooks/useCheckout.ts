/**
 * Checkout Hook
 * Shared checkout logic for Cart and MobileCart components
 */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { checkoutApi, CheckoutRequest, SavedAddress } from "@/lib/api";
import { LocalCartItem } from "@/context/cart/types";
import { calculateCartTotals, transformCartItemsForCheckout, getPaymentRedirectUrl } from "@/lib/cart-utils";
import { PAYMENT_METHODS, ROUTES } from "@/lib/constants";

interface UseCheckoutParams {
    cartItems: LocalCartItem[];
    user: { id: string } | null;
    sessionKey: string | null;
    clearCart: () => Promise<void>;
    setCartError?: (error: string | null) => void;
    promoCode?: string;
    promoAmount?: number;
    discountedTotal?: number;
}

export function useCheckout({
    cartItems,
    user,
    sessionKey,
    clearCart,
    setCartError,
    promoCode = "",
    promoAmount = 0,
    discountedTotal,
}: UseCheckoutParams) {
    const router = useRouter();
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

    const processCheckout = useCallback(async (
        selectedPayment: "prepaid" | "cod",
        selectedAddress: SavedAddress
    ) => {
        // Prevent multiple simultaneous checkout attempts
        if (isProcessingCheckout) {
            return;
        }

        // Validation
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        if (!selectedPayment) {
            toast.warning("Please select a payment method!");
            return;
        }
        if (!selectedAddress) {
            toast.warning("Please select a delivery address!");
            return;
        }
        if (!user || !sessionKey) {
            toast.warning("Please login to proceed!");
            return;
        }

        setIsProcessingCheckout(true);
        setCartError?.(null);

        try {
            // Calculate totals using utility function
            const { total, grossAmount, discountAmount, totalQty } = calculateCartTotals(cartItems);

            // Use discounted total if provided (for prepaid with promo), otherwise use calculated total
            const finalPaidAmount = discountedTotal !== undefined ? discountedTotal : total;
            
            // Calculate total discount including promo discount
            const totalDiscountWithPromo = discountAmount + promoAmount;

            // Transform cart items using utility function
            const checkoutCartItems = transformCartItemsForCheckout(cartItems);

            if (checkoutCartItems.length === 0) {
                toast.error("No valid items in cart. Please add items and try again.");
                setIsProcessingCheckout(false);
                return;
            }

            // Prepare checkout request
            const checkoutRequest: CheckoutRequest = {
                cart: checkoutCartItems,
                user_id: typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id),
                qty: totalQty,
                paid_amount: Math.round(finalPaidAmount),
                discount_amount: discountAmount,
                gross_amount: Math.round(grossAmount),
                promo_amount: Math.round(promoAmount),
                total_discount: Math.round(totalDiscountWithPromo),
                promo_code: promoCode || "",
                pay_mode: selectedPayment === PAYMENT_METHODS.PREPAID ? "Online" : "COD",
                address_id: selectedAddress.id,
                gst_amount: "",
                payment_info: {
                    pay_gateway_name: selectedPayment === PAYMENT_METHODS.PREPAID ? "phonepe" : "cod",
                    pay_status: "",
                    txn_id: "",
                },
                type: "web",
                redirect_url: getPaymentRedirectUrl(),
                redirecturl: getPaymentRedirectUrl(),
            };

            // Call Checkout API
            const response = await checkoutApi.processCheckout(checkoutRequest, sessionKey);

            // Handle response
            if (response.status || response.success) {
                if (selectedPayment === PAYMENT_METHODS.PREPAID && response.data) {
                    const data = response.data;
                    const paymentResponse = data.payment_response;

                    // Handle different response structures
                    let paymentResponseItem: { orderId?: string; redirectUrl?: string } | null = null;

                    if (Array.isArray(paymentResponse) && paymentResponse.length > 0) {
                        paymentResponseItem = paymentResponse[0];
                    } else if (paymentResponse && typeof paymentResponse === "object" && !Array.isArray(paymentResponse)) {
                        paymentResponseItem = paymentResponse as { orderId?: string; redirectUrl?: string };
                    }

                    const redirectUrl = paymentResponseItem?.redirectUrl || data.order_details?.payment_redirect_url || null;
                    const orderId = paymentResponseItem?.orderId || data.order_details?.id || null;

                    if (redirectUrl && orderId) {
                        // Store orderId locally
                        localStorage.setItem("orderId", String(orderId));

                        // Redirect user to the payment page
                        window.location.replace(redirectUrl);
                        return;
                    } else {
                        toast.error(
                            !orderId
                                ? "Order was created but payment reference was not received. Please contact support."
                                : "Order was created but payment URL was not received. Please contact support."
                        );
                        setIsProcessingCheckout(false);
                        return;
                    }
                } else {
                    // COD payment - clear cart and redirect to success
                    await clearCart();
                    router.push(ROUTES.PAYMENT_SUCCESS);
                    setIsProcessingCheckout(false);
                }
            } else {
                toast.error(response.message || "Failed to place order. Please try again.");
                setIsProcessingCheckout(false);
            }
        } catch (error) {
            let errorMessage = "Failed to process checkout. Please try again.";
            if (error instanceof Error) {
                if (error.message.includes("401") || error.message.includes("Authentication")) {
                    errorMessage = "Your session has expired. Please log in again.";
                } else if (error.message.includes("Network") || error.message.includes("fetch")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                } else {
                    errorMessage = error.message;
                }
            }

            toast.error(errorMessage);
            setIsProcessingCheckout(false);
        }
    }, [cartItems, user, sessionKey, clearCart, isProcessingCheckout, setCartError, router, promoCode, promoAmount, discountedTotal]);

    return {
        processCheckout,
        isProcessingCheckout,
    };
}

