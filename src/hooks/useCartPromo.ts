/**
 * Hook for managing promo code logic in cart
 */

import { useState, useEffect, useCallback } from "react";
import { promoApi } from "@/lib/api";
import { getPrepaidPromoCode, isPromoCodeEnabled } from "@/lib/promo-utils";
import { handleError } from "@/lib/error-handling";

interface UseCartPromoProps {
    user: { id: string } | null;
    sessionKey: string | null;
    selectedPayment: "prepaid" | "cod" | null;
    cartTotal: number;
}

interface UseCartPromoReturn {
    promoValue: number;
    promoCode: string;
    handlePrepaidClick: () => Promise<void>;
    handleCODClick: () => void;
}

export function useCartPromo({
    user,
    sessionKey,
    selectedPayment,
    cartTotal,
}: UseCartPromoProps): UseCartPromoReturn {
    const [promoValue, setPromoValue] = useState<number>(0);
    const [promoCode, setPromoCode] = useState<string>("");

    const handlePrepaidClick = useCallback(async () => {
        if (!user?.id || !sessionKey) {
            // Reset promo value if user is not logged in
            setPromoValue(0);
            setPromoCode("");
            if (typeof window !== "undefined") {
                localStorage.removeItem("promo_code");
            }
            return;
        }

        // Get promo code from configuration
        const promoCodeValue = getPrepaidPromoCode();

        // If promo code is disabled or not configured, skip API call
        if (!isPromoCodeEnabled() || !promoCodeValue) {
            setPromoValue(0);
            setPromoCode("");
            if (typeof window !== "undefined") {
                localStorage.removeItem("promo_code");
            }
            return;
        }

        try {
            const userId = typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id);
            const response = await promoApi.getPromoDetails(
                {
                    user_id: userId,
                    promo_code: promoCodeValue,
                },
                sessionKey
            );

            // Type-safe promo value extraction
            const responseData = response.data;
            const promoValueFromResponse = (() => {
                if (!responseData || typeof responseData !== "object") {
                    return 0;
                }
                const data = responseData as Record<string, unknown>;

                // Try numeric values first
                if (typeof data.promo_value === "number") {
                    return data.promo_value;
                }
                if (typeof data.promo_amount === "number") {
                    return data.promo_amount;
                }
                if (typeof data.discount_amount === "number") {
                    return data.discount_amount;
                }

                // Try string values
                if (typeof data.promo_value === "string") {
                    const parsed = parseFloat(data.promo_value);
                    return isNaN(parsed) ? 0 : parsed;
                }
                if (typeof data.promo_amount === "string") {
                    const parsed = parseFloat(data.promo_amount);
                    return isNaN(parsed) ? 0 : parsed;
                }
                if (typeof data.discount_amount === "string") {
                    const parsed = parseFloat(data.discount_amount);
                    return isNaN(parsed) ? 0 : parsed;
                }

                return 0;
            })();

            setPromoValue(promoValueFromResponse);
            setPromoCode(promoCodeValue);

            // Store promo code in localStorage for payment response API
            if (typeof window !== "undefined") {
                localStorage.setItem("promo_code", promoCodeValue);
            }
        } catch {
            // Reset promo value on error
            setPromoValue(0);
            setPromoCode("");
            // Clear promo code from localStorage on error
            if (typeof window !== "undefined") {
                localStorage.removeItem("promo_code");
            }
            // Silently fail - don't block user from selecting prepaid
        }
    }, [user?.id, sessionKey]);

    // Call API with updated price when prepaid is selected and promo is applied
    useEffect(() => {
        if (selectedPayment === "prepaid" && promoValue > 0 && promoCode && user?.id && sessionKey) {
            const updatePriceWithPromo = async () => {
                try {
                    const userId = typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id);
                    // Call promo API again with updated total to validate/update the price
                    await promoApi.getPromoDetails(
                        {
                            user_id: userId,
                            promo_code: promoCode,
                        },
                        sessionKey
                    );
                    // The API call validates the promo with the current cart total
                    // Backend will receive the updated price through the checkout API
                } catch (error) {
                    // Silently handle error - promo validation already happened in handlePrepaidClick
                    handleError(error, {
                        context: "useCartPromo",
                        silent: true, // Don't show toast or log (already validated)
                        logLevel: "debug",
                    });
                }
            };

            updatePriceWithPromo();
        }
    }, [selectedPayment, promoValue, promoCode, cartTotal, user?.id, sessionKey]);

    // Reset promo when COD is selected
    const handleCODClick = useCallback(() => {
        setPromoValue(0);
        setPromoCode("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("promo_code");
        }
    }, []);

    return {
        promoValue,
        promoCode,
        handlePrepaidClick,
        handleCODClick,
    };
}

