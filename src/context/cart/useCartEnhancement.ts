/**
 * Cart Enhancement Hook
 * Handles enhancing cart items with product details
 */

import { useCallback, useRef } from "react";
import { productsApi, ProductDetailsResponse } from "@/lib/api";
import type { LocalCartItem } from "./types";

interface UseCartEnhancementParams {
    cartItems: LocalCartItem[];
    user: { id: string } | null;
    sessionKey: string | null;
    authInitialized: boolean;
    setCartItems: React.Dispatch<React.SetStateAction<LocalCartItem[]>>;
}

/**
 * Hook to manage cart item enhancement with product details
 */
export function useCartEnhancement({
    cartItems,
    user,
    sessionKey,
    authInitialized,
    setCartItems,
}: UseCartEnhancementParams) {
    const enhancementInProgressRef = useRef<boolean>(false);

    const fetchProductDetails = useCallback(async (productId: string, userId?: string | number): Promise<ProductDetailsResponse | null> => {
        try {
            const response = await productsApi.getDetails(productId, userId);
            if (response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.warn(`Failed to fetch product details for product ${productId}:`, error);
            }
            return null;
        }
    }, []);

    const enhanceCartItems = useCallback(async () => {
        if (!authInitialized || !user || !sessionKey || cartItems.length === 0) {
            return;
        }

        const needsEnhancement = cartItems.some(item => !item.product_details);
        if (!needsEnhancement || enhancementInProgressRef.current) {
            return;
        }

        enhancementInProgressRef.current = true;

        try {
            const enhancedItems = await Promise.all(
                cartItems.map(async (item) => {
                    if (!item || !item.id || !item.name) {
                        return null;
                    }

                    if (item.product_details) {
                        return item;
                    }

                    if (!item.product_id) {
                        return item;
                    }

                    try {
                        const productDetails = await fetchProductDetails(item.product_id, user.id);
                        if (productDetails) {
                            const packSize = item.pack_qty || item.quantity;
                            const matchingPriceTier = productDetails.prices?.find(tier => {
                                const qtyMatches = Number(tier.qty) === packSize;
                                if (item.unit_name) {
                                    return qtyMatches && tier.unit_name === item.unit_name;
                                }
                                return qtyMatches;
                            });

                            if (matchingPriceTier) {
                                return {
                                    ...item,
                                    product_details: productDetails,
                                    mrp_price: Math.round(parseFloat(matchingPriceTier.mrp) || 0),
                                    discount_percent: matchingPriceTier.discount_off_inpercent,
                                    price: Math.round(parseFloat(matchingPriceTier.final_price) || 0),
                                    product_price_id: matchingPriceTier.product_price_id,
                                    short_description: productDetails.short_description || item.short_description,
                                    product_description: productDetails.product_description || item.product_description,
                                    in_stock: productDetails.in_stock || item.in_stock,
                                    image: productDetails.image?.[0] || item.image,
                                };
                            }

                            return item;
                        }
                        return item;
                    } catch (error) {
                        if (process.env.NODE_ENV === "development") {
                            console.error("Error enhancing cart item:", error);
                        }
                        return item;
                    }
                })
            );

            const validEnhancedItems = enhancedItems.filter((item): item is LocalCartItem => item !== null);
            setCartItems(validEnhancedItems);
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to enhance cart items:", error);
            }
        } finally {
            enhancementInProgressRef.current = false;
        }
    }, [cartItems, user, sessionKey, authInitialized, fetchProductDetails, setCartItems]);

    return { enhanceCartItems, enhancementInProgressRef };
}

