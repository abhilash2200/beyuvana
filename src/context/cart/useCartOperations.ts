/**
 * Cart Operations Hook
 * Handles cart CRUD operations (add, remove, update quantity)
 */

import { useCallback } from "react";
import { cartApi } from "@/lib/api/cart";
import { toast } from "react-toastify";
import { CART_CONFIG } from "@/lib/constants";
import type { LocalCartItem } from "./types";
import { logger } from "@/lib/logger";
import { handleError } from "@/lib/error-handling";

interface UseCartOperationsParams {
    cartItems: LocalCartItem[];
    user: { id: string } | null;
    sessionKey: string | null;
    setCartItems: React.Dispatch<React.SetStateAction<LocalCartItem[]>>;
    setLoading: (loading: boolean) => void;
    syncWithServer: () => Promise<void>;
    timeoutRefs: React.MutableRefObject<Map<string, NodeJS.Timeout>>;
    abortControllersRef?: React.MutableRefObject<Map<string, AbortController>>;
    previousStateRef?: React.MutableRefObject<LocalCartItem[]>;
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
    abortControllersRef,
    previousStateRef,
}: UseCartOperationsParams) {
    // Helper to cancel previous operation for an item
    const cancelPreviousOperation = useCallback((id: string) => {
        // Cancel timeout
        const existingTimeout = timeoutRefs.current.get(id);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            timeoutRefs.current.delete(id);
        }

        // Cancel abort controller if exists
        if (abortControllersRef) {
            const existingController = abortControllersRef.current.get(id);
            if (existingController) {
                existingController.abort();
                abortControllersRef.current.delete(id);
            }
        }
    }, [timeoutRefs, abortControllersRef]);

    // Helper to save previous state for rollback
    const savePreviousState = useCallback(() => {
        if (previousStateRef) {
            previousStateRef.current = [...cartItems];
        }
    }, [cartItems, previousStateRef]);

    // Helper to rollback on error
    const rollbackState = useCallback(() => {
        if (previousStateRef && previousStateRef.current.length > 0) {
            setCartItems([...previousStateRef.current]);
        }
    }, [setCartItems, previousStateRef]);
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
                handleError(apiError, {
                    context: "useCartOperations",
                    userMessage: "Failed to add item to cart. Please try again.",
                });
                throw apiError;
            }
        } catch (error) {
            handleError(error, {
                context: "useCartOperations",
                userMessage: "Failed to add item to cart. Please try again.",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [user, sessionKey, setLoading, syncWithServer]);

    const increaseItemQuantity = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        // Cancel any pending operation for this item
        cancelPreviousOperation(id);

        // Save previous state for rollback
        savePreviousState();

        // Optimistic update
        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.id === id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        );

        // Create abort controller for this operation
        const abortController = new AbortController();
        if (abortControllersRef) {
            abortControllersRef.current.set(id, abortController);
        }

        const timeout = setTimeout(async () => {
            // Check if operation was cancelled
            if (abortController.signal.aborted) {
                return;
            }

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

                // Check again before sync (operation might have been cancelled)
                if (!abortController.signal.aborted) {
                    await syncWithServer();
                }
            } catch (error) {
                // Don't rollback if operation was cancelled (newer operation is in progress)
                if (abortController.signal.aborted) {
                    return;
                }

                logger.error("Failed to increase quantity", error, "useCartOperations");

                // Rollback optimistic update
                rollbackState();
                toast.error("Failed to update quantity. Please try again.");

                // Sync to get correct state from server
                await syncWithServer();
            } finally {
                timeoutRefs.current.delete(id);
                if (abortControllersRef) {
                    abortControllersRef.current.delete(id);
                }
            }
        }, CART_CONFIG.DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs, cancelPreviousOperation, savePreviousState, rollbackState, abortControllersRef]);

    const decreaseItemQuantity = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        cancelPreviousOperation(id);

        savePreviousState();

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

        const abortController = new AbortController();
        if (abortControllersRef) {
            abortControllersRef.current.set(id, abortController);
        }

        const timeout = setTimeout(async () => {
            if (abortController.signal.aborted) {
                return;
            }

            try {
                if (item.quantity <= 1) {
                    await cartApi.removeFromCart(item.product_id!, sessionKey, user.id, item.cart_id);
                    toast.success(`${item.name} removed from cart!`);
                } else {
                    await cartApi.decreaseQuantity(item.product_id!, sessionKey);
                }

                if (!abortController.signal.aborted) {
                    await syncWithServer();
                }
            } catch (error) {
                if (abortController.signal.aborted) {
                    return;
                }

                logger.error("Failed to decrease quantity", error, "useCartOperations");

                rollbackState();
                toast.error("Failed to update quantity. Please try again.");

                await syncWithServer();
            } finally {
                timeoutRefs.current.delete(id);
                if (abortControllersRef) {
                    abortControllersRef.current.delete(id);
                }
            }
        }, CART_CONFIG.DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs, cancelPreviousOperation, savePreviousState, rollbackState, abortControllersRef]);

    const updateItemQuantity = useCallback(async (id: string, qty: number) => {
        if (typeof qty !== 'number' || isNaN(qty)) {
            logger.warn("Invalid quantity provided", { qty }, "useCartOperations");
            return;
        }

        const newQuantity = Math.max(CART_CONFIG.MIN_QUANTITY, Math.min(CART_CONFIG.MAX_QUANTITY, Math.round(qty)));
        const item = cartItems.find((i) => i.id === id);

        if (!item || !user || !sessionKey || !item.product_id) return;

        cancelPreviousOperation(id);

        savePreviousState();

        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.id === id
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            )
        );

        const abortController = new AbortController();
        if (abortControllersRef) {
            abortControllersRef.current.set(id, abortController);
        }

        const timeout = setTimeout(async () => {
            if (abortController.signal.aborted) {
                return;
            }

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

                if (!abortController.signal.aborted) {
                    await syncWithServer();
                }
            } catch (error) {
                if (abortController.signal.aborted) {
                    return;
                }

                logger.error("Failed to update quantity", error, "useCartOperations");

                rollbackState();
                toast.error("Failed to update quantity. Please try again.");

                await syncWithServer();
            } finally {
                timeoutRefs.current.delete(id);
                if (abortControllersRef) {
                    abortControllersRef.current.delete(id);
                }
            }
        }, CART_CONFIG.INPUT_DEBOUNCE_DELAY);

        timeoutRefs.current.set(id, timeout);
    }, [cartItems, user, sessionKey, setCartItems, syncWithServer, timeoutRefs, cancelPreviousOperation, savePreviousState, rollbackState, abortControllersRef]);

    const removeFromCart = useCallback(async (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || !user || !sessionKey || !item.product_id) return;

        setLoading(true);
        try {
            await cartApi.removeFromCart(item.product_id, sessionKey, user.id, item.cart_id);
            toast.success(`${item.name} removed from cart!`);
            await syncWithServer();
        } catch (error) {
            logger.error("Failed to remove from cart", error, "useCartOperations");
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
                await syncWithServer();
                toast.success("Your cart has been cleared successfully!");
            }
        } catch (error) {
            logger.error("Failed to clear cart", error, "useCartOperations");
            toast.error("Failed to clear cart. Please try again.");
            await syncWithServer();
        } finally {
            setLoading(false);
        }
    }, [user, sessionKey, setCartItems, setLoading, syncWithServer]);

    return {
        addToCart,
        removeFromCart,
        clearCart,
        increaseItemQuantity,
        decreaseItemQuantity,
        updateItemQuantity,
    };
}

