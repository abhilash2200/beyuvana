/**
 * Cart Sync Hook
 * Handles syncing cart with server
 */

import { useCallback } from "react";
import { cartApi } from "@/lib/api";
import type { ServerCartItem, LocalCartItem } from "./types";

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
                    const serverCartItems: LocalCartItem[] = response.data
                        .map((item: ServerCartItem) => {
                            const mappedItem: LocalCartItem = {
                                id: item.cart_id || item.id || `${item.product_id}-${item.qty || 1}`,
                                name: item.price_unit_name || item.name || item.product_name || 'Unknown Product',
                                price: Math.round(parseFloat(String(item.final_price || item.sale_price || 0)) || 0),
                                quantity: typeof item.qty === 'number' ? item.qty :
                                    parseInt(String(item.qty || 1)) || 1,
                                image: item.image || item.product_image || '/placeholder.png',
                                product_id: item.product_id || item.id,
                                cart_id: item.cart_id,
                                mrp_price: Math.round(parseFloat(String(item.mrp || 0)) || 0),
                                discount_percent: item.discount_off_inpercent || item.discount_percent,
                                short_description: item.product_description,
                                product_description: item.product_description,
                                in_stock: item.in_stock,
                                pack_qty: parseFloat(String(item.unit_qty || 1)) || 1,
                                unit_name: item.unit_name || 'Pack of',
                            };

                            return mappedItem;
                        })
                        .filter((item: LocalCartItem) => {
                            const isValid = item &&
                                item.id &&
                                item.name &&
                                typeof item.quantity === 'number' &&
                                item.quantity > 0;

                            return isValid;
                        });

                    if (serverCartItems.length > 0) {
                        setCartItems(serverCartItems);
                    }
                }
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to sync cart with server:", error);
            }
        } finally {
            setLoading(false);
            syncLockRef.current = false;
        }
    }, [user, sessionKey, setCartItems, setLoading, syncLockRef]);

    return { syncWithServer };
}

