"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { cartApi, CartItem } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";

// Type for a cart item (local format)
type LocalCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product_id?: string; // Add product_id for API integration
};

type CartContextType = {
  cartItems: LocalCartItem[];
  addToCart: (item: LocalCartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  increaseItemQuantity: (id: string) => Promise<void>;
  decreaseItemQuantity: (id: string) => Promise<void>;
  updateItemQuantity: (id: string, qty: number) => Promise<void>;
  syncWithServer: () => Promise<void>;
  refreshCart: () => Promise<void>; // Manual refresh function
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, sessionKey } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync with server when user logs in
  useEffect(() => {
    if (user && sessionKey) {
      syncWithServer();
    }
  }, [user, sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async (item: LocalCartItem) => {
    setLoading(true);
    try {
      // If user is logged in, sync with server
      if (user && sessionKey && item.product_id) {
        await cartApi.addToCart({
          product_id: item.product_id,
          quantity: item.quantity,
        }, sessionKey);
        toast.success("Item added to cart!");
      }

      // Update local state
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          // Increment quantity if item already exists
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          return [...prev, item];
        }
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");

      // Still add to local cart as fallback
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          return [...prev, item];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    // Update local state immediately for better UX
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

    // Sync with server in background (no loading state)
    if (user && sessionKey && item.product_id) {
      try {
        await cartApi.updateCart({
          product_id: item.product_id,
          quantity: item.quantity + 1,
        }, sessionKey);
      } catch (apiError) {
        console.warn("API update failed, using local storage:", apiError);
        // Revert local state if API fails
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
        toast.error("Failed to sync with server. Please try again.");
      }
    }
  }, [cartItems, user, sessionKey]);

  const decreaseItemQuantity = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    // Update local state immediately for better UX
    setCartItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      if (target.quantity <= 1) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });

    // Sync with server in background (no loading state)
    if (user && sessionKey && item.product_id) {
      try {
        if (item.quantity <= 1) {
          await cartApi.removeFromCart(item.product_id, sessionKey);
        } else {
          await cartApi.decreaseQuantity(item.product_id, sessionKey);
        }
      } catch (apiError) {
        console.warn("API update failed, using local storage:", apiError);
        // Revert local state if API fails
        setCartItems((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (existing) {
            return prev.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            // Re-add item if it was removed
            return [...prev, { ...item, quantity: 1 }];
          }
        });
        toast.error("Failed to sync with server. Please try again.");
      }
    }
  }, [cartItems, user, sessionKey]);

  const updateItemQuantity = useCallback(async (id: string, qty: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = qty < 1 ? 1 : qty;
    const oldQuantity = item.quantity;

    // Update local state immediately for better UX
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    );

    // Sync with server in background (no loading state)
    if (user && sessionKey && item.product_id) {
      try {
        await cartApi.updateCart({
          product_id: item.product_id,
          quantity: newQuantity,
        }, sessionKey);
      } catch (apiError) {
        console.warn("API update failed, using local storage:", apiError);
        // Revert local state if API fails
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: oldQuantity } : i
          )
        );
        toast.error("Failed to sync with server. Please try again.");
      }
    }
  }, [cartItems, user, sessionKey]);

  const removeFromCart = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    setLoading(true);
    try {
      // Try to sync with server if user is logged in
      if (user && sessionKey && item.product_id) {
        try {
          await cartApi.removeFromCart(item.product_id, sessionKey);
          toast.success("Item removed from cart!");
        } catch (apiError) {
          console.warn("API remove failed, using local storage:", apiError);
        }
      }

      // Always update local state
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cartItems, user, sessionKey]);

  const syncWithServer = async () => {
    if (!user || !sessionKey) return;

    setLoading(true);
    try {
      const response = await cartApi.getCart(sessionKey);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Convert API cart items to local format
        const serverCartItems: LocalCartItem[] = response.data.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product_id: item.product_id,
        }));
        setCartItems(serverCartItems);
      }
      // If no server data, keep using local storage
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
      // Don't show error toast for sync failures, just use local storage
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      // Try to sync with server if user is logged in
      if (user && sessionKey) {
        try {
          await cartApi.clearCart(sessionKey);
        } catch (apiError) {
          console.warn("API clear cart failed, using local storage:", apiError);
        }
      }

      // Always clear local state
      setCartItems([]);
      localStorage.removeItem("cart");

      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function that can be called from components
  const refreshCart = async () => {
    if (user && sessionKey) {
      await syncWithServer();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseItemQuantity,
        decreaseItemQuantity,
        updateItemQuantity,
        syncWithServer,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
