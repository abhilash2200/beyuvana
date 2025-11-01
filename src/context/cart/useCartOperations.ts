/**
 * Cart Operations Hook
 * Handles cart CRUD operations (add, remove, update quantity)
 */

import { useCallback } from "react";
import { cartApi } from "@/lib/api";
import { toast } from "react-toastify";
import { CART_CONFIG } from "@/lib/constants";
import type { LocalCartItem } from "./types";

interface UseCartOperationsParams {
    cartItems: LocalCartItem[];
    user: { id: string } | null;
    sessionKey: string | null;
    setCartItems: React.Dispatch<React.SetStateAction<LocalCartItem[]>>;
    setLoading: (loading: boolean) => void;
    syncWithServer: () => Promise<void>;
    timeoutRefs: React.MutableRefObject<Map<string, NodeJS.Timeout>>;
}

/**
 * Hook to manage cart operations (add, remove, update quantity)
 */
export function useCartOperations({
    cartItems,
    user,
    sessionKey,
    setCartItems,
    setLoading,
    syncWithServer,
    timeoutRefs,
}: UseCartOperationsParams) {
    const addToCart = useCallback(async (item: LocalCartItem) => {
        setLoading(true);
        try {
            if (!user || !sessionKey) {
                toast.info("Please login to add items to your cart.");
                return;
            }

            if (!item.product_id) {
                toast.error("Unable to add to cart: Missing product information.");
                return;
            }

            if (!item.product_price_id) {
                toast.error("Unable to add to cart: Missing price information. Please try again.");
                return;
            }

            try {
                const cartData = {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_qty: item.pack_qty || 0,
                    price_unit_name: item.name,
                    product_price: item.mrp_price || 0,
                    discount_price: item.price || 0,
                    product_price_id: item.product_price_id,
                };

                await cartApi.addToCart(cartData, sessionKey, user.id);
                await syncWithServer();
                toast.success(`${item.name} added to cart!`);
            } catch (apiError) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to add to cart:", apiError);
                }
                toast.error("Failed to add item to cart. Please try again.");
                throw apiError;
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to add to cart:", error);
            }
            toast.error("Failed to add item to cart. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [user, sessionKey, setLoading, syncWithServer]);

    const increaseItemQuantity = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.id === id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        );

        const existingTimeout = timeoutRefs.current.get(id);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(async () => {
            try {
                const cartData = {
                    product_id: item.product_id!,
                    quantity: 1,
                    price_qty: item.pack_qty || 0,
                    price_unit_name: item.name,
                    product_price: item.mrp_price || 0,
                    discount_price: item.price || 0,
                    product_price_id: item.product_price_id!,
                };

                await cartApi.addToCart(cartData, sessionKey, user.id);
                await syncWithServer();
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to increase quantity:", error);
                }
                toast.error("Failed to update quantity. Please try again.");
                await syncWithServer();
            }
            timeoutRefs.current.delete(id);
        }, CART_CONFIG.DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs]);

    const decreaseItemQuantity = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        setCartItems(prevItems => {
            if (item.quantity <= 1) {
                return prevItems.filter(cartItem => cartItem.id !== id);
            } else {
                return prevItems.map(cartItem =>
                    cartItem.id === id
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
            }
        });

        const existingTimeout = timeoutRefs.current.get(id);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(async () => {
            try {
                if (item.quantity <= 1) {
                    await cartApi.removeFromCart(item.product_id!, sessionKey, user.id, item.cart_id);
                    toast.success(`${item.name} removed from cart!`);
                } else {
                    await cartApi.decreaseQuantity(item.product_id!, sessionKey);
                }

                await syncWithServer();
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to decrease quantity:", error);
                }
                toast.error("Failed to update quantity. Please try again.");
                await syncWithServer();
            }
            timeoutRefs.current.delete(id);
        }, CART_CONFIG.DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs]);

    const updateItemQuantity = useCallback(async (id: string, qty: number) => {
        if (typeof qty !== 'number' || isNaN(qty)) {
            if (process.env.NODE_ENV === "development") {
                console.error("Invalid quantity provided:", qty);
            }
            return;
        }

        const newQuantity = Math.max(CART_CONFIG.MIN_QUANTITY, Math.min(CART_CONFIG.MAX_QUANTITY, Math.round(qty)));
        const item = cartItems.find((i) => i.id === id);

        if (!item || !user || !sessionKey || !item.product_id) return;

        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.id === id
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            )
        );

        const existingTimeout = timeoutRefs.current.get(id);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(async () => {
            try {
                await cartApi.removeFromCart(item.product_id!, sessionKey, user.id, item.cart_id);

                const cartData = {
                    product_id: item.product_id!,
                    quantity: newQuantity,
                    price_qty: Number(item.product_price_id) || 0,
                    price_unit_name: item.name,
                    product_price: item.mrp_price || 0,
                    discount_price: item.price || 0,
                    product_price_id: item.product_price_id!,
                };

                await cartApi.addToCart(cartData, sessionKey, user.id);
                await syncWithServer();
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to update quantity:", error);
                }
                toast.error("Failed to update quantity. Please try again.");
                await syncWithServer();
            }
            timeoutRefs.current.delete(id);
        }, CART_CONFIG.INPUT_DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs]);

    const removeFromCart = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        setLoading(true);
        try {
            await cartApi.removeFromCart(item.product_id, sessionKey, user.id, item.cart_id);
            toast.success(`${item.name} removed from cart!`);
            await syncWithServer();
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to remove from cart:", error);
            }
            toast.error("Failed to remove item. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [cartItems, user, sessionKey, setLoading, syncWithServer]);

    const clearCart = useCallback(async () => {
        setLoading(true);
        try {
            if (user && sessionKey) {
                await cartApi.removeAllFromCart(Number(user.id), sessionKey);
                setCartItems([]);
                toast.success("Your cart has been cleared successfully!");
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Failed to clear cart:", error);
            }
            toast.error("Failed to clear cart. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user, sessionKey, setCartItems, setLoading]);

    return {
        addToCart,
        removeFromCart,
        clearCart,
        increaseItemQuantity,
        decreaseItemQuantity,
        updateItemQuantity,
    };
}

