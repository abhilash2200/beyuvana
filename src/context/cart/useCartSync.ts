/**
 * Cart Sync Hook
 * Handles syncing cart with server
 */

import { useCallback } from "react";
import { cartApi } from "@/lib/api/cart";
import type { ServerCartItem, LocalCartItem } from "./types";

/**
 * Maps server cart response to local cart items. Shared so mutation responses
 * (e.g. remove/update) can update state without a separate refetch (avoids race/stale data).
 */
export function mapServerCartToLocal(
  data: unknown[],
): LocalCartItem[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  const mapped = (data as ServerCartItem[])
    .map((item) => {
      const mappedItem: LocalCartItem = {
        id:
          item.cart_id ||
          item.id ||
          `${item.product_id}-${item.qty || 1}`,
        name:
          item.price_unit_name ||
          item.name ||
          item.product_name ||
          "Unknown Product",
        price: Math.round(
          parseFloat(
            String(item.final_price || item.sale_price || 0),
          ) || 0,
        ),
        quantity:
          typeof item.qty === "number"
            ? item.qty
            : parseInt(String(item.qty || 1)) || 1,
        image: item.image || item.product_image || "/placeholder.png",
        product_id: item.product_id || item.id,
        cart_id: item.cart_id,
        mrp_price: Math.round(parseFloat(String(item.mrp || 0)) || 0),
        discount_percent:
          item.discount_off_inpercent || item.discount_percent,
        short_description:
          item.short_description || item.product_description,
        product_description: item.product_description,
        in_stock: item.in_stock,
        pack_qty:
          item.pack_qty || parseFloat(String(item.unit_qty || 1)) || 1,
        unit_name: item.unit_name || "Pack of",
        product_price_id: item.product_price_id,
      };
      return mappedItem;
    })
    .filter((item: LocalCartItem) => {
      return (
        item &&
        item.id &&
        item.name &&
        typeof item.quantity === "number" &&
        item.quantity > 0
      );
    });
  return mapped;
}

interface UseCartSyncParams {
  user: { id: string } | null;
  sessionKey: string | null;
  setCartItems: React.Dispatch<React.SetStateAction<LocalCartItem[]>>;
  setLoading: (loading: boolean) => void;
  syncLockRef: React.MutableRefObject<boolean>;
}

/**
 * Hook to manage cart synchronization with server
 */
export function useCartSync({
  user,
  sessionKey,
  setCartItems,
  setLoading,
  syncLockRef,
}: UseCartSyncParams) {
  const syncWithServer = useCallback(async () => {
    if (!user || !sessionKey) {
      return;
    }

    if (syncLockRef.current) {
      return;
    }

    syncLockRef.current = true;
    setLoading(true);

    try {
      const response = await cartApi.getCart(sessionKey, user.id);

      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          const serverCartItems = mapServerCartToLocal(response.data);
          if (serverCartItems.length > 0) {
            setCartItems(serverCartItems);
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      // Import error handler dynamically to avoid circular dependencies
      import("@/lib/error-handling")
        .then(({ handleError }) => {
          handleError(error, {
            context: "useCartSync",
            userMessage: "Failed to sync cart with server. Please try again.",
            showToast: false, // Don't show toast for background sync errors
            silent: false, // But still log it
          });
        })
        .catch(() => {
          // Fallback if import fails
        });
    } finally {
      setLoading(false);
      syncLockRef.current = false;
    }
  }, [user, sessionKey, setCartItems, setLoading, syncLockRef]);

  return { syncWithServer };
}
