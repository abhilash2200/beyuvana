/**
 * Hook for managing promo code logic in cart
 */

import { useState, useCallback } from "react";
import { promoApi } from "@/lib/api/promo";
import { getPrepaidPromoCode, isPromoCodeEnabled } from "@/lib/promo-utils";
import { hasTrialPack } from "@/lib/cart-utils";
import type { LocalCartItem } from "@/context/cart/types";

interface UseCartPromoProps {
  user: { id: string } | null;
  sessionKey: string | null;
  cartItems?: LocalCartItem[];
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
  cartItems = [],
}: UseCartPromoProps): UseCartPromoReturn {
  const [promoValue, setPromoValue] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>("");

  const handlePrepaidClick = useCallback(async () => {
    if (!user?.id || !sessionKey) {
      setPromoValue(0);
      setPromoCode("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("promo_code");
      }
      return;
    }

    // Skip promo code if cart contains trial pack
    if (hasTrialPack(cartItems)) {
      setPromoValue(0);
      setPromoCode("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("promo_code");
      }
      return;
    }

    const promoCodeValue = getPrepaidPromoCode();

    if (!isPromoCodeEnabled() || !promoCodeValue) {
      setPromoValue(0);
      setPromoCode("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("promo_code");
      }
      return;
    }

    try {
      const userId =
        typeof user.id === "string" ? parseInt(user.id, 10) : Number(user.id);
      const response = await promoApi.getPromoDetails(
        {
          user_id: userId,
          promo_code: promoCodeValue,
        },
        sessionKey,
      );

      const responseData = response.data;
      const promoValueFromResponse = (() => {
        if (!responseData || typeof responseData !== "object") {
          return 0;
        }
        const data = responseData as Record<string, unknown>;

        if (typeof data.promo_value === "number") {
          return data.promo_value;
        }
        if (typeof data.promo_amount === "number") {
          return data.promo_amount;
        }
        if (typeof data.discount_amount === "number") {
          return data.discount_amount;
        }

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

      if (typeof window !== "undefined") {
        localStorage.setItem("promo_code", promoCodeValue);
      }
    } catch {
      setPromoValue(0);
      setPromoCode("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("promo_code");
      }
    }
  }, [user?.id, sessionKey, cartItems]);

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
