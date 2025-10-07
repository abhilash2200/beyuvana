"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
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
  const [authInitialized, setAuthInitialized] = useState(false);
  const { user, sessionKey } = useAuth();

  // Store timeout references to clear them
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
      // Clear invalid cart data
      try {
        localStorage.removeItem("cart");
      } catch { }
    }
  }, []);

  // Track when auth is initialized to prevent premature cart clearing
  useEffect(() => {
    // Check if auth data exists in localStorage to determine if auth is initialized
    const hasStoredAuth = localStorage.getItem("user") || localStorage.getItem("session_key");
    if (hasStoredAuth) {
      // If there's stored auth data, wait for it to be loaded
      if (user !== null || sessionKey !== null) {
        setAuthInitialized(true);
      }
    } else {
      // If no stored auth data, auth is immediately initialized as "not logged in"
      setAuthInitialized(true);
    }
  }, [user, sessionKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // Sync with server when user logs in (only after auth is initialized)
  useEffect(() => {
    if (authInitialized && user && sessionKey) {
      syncWithServer();
    }
  }, [user, sessionKey, authInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // When user logs out, immediately clear local cart and storage
  // Only clear if auth is initialized to prevent clearing on page reload
  useEffect(() => {
    if (authInitialized && (!user || !sessionKey)) {
      setCartItems([]);
      try { localStorage.removeItem("cart"); } catch { }
    }
  }, [user, sessionKey, authInitialized]);

  const addToCart = async (item: LocalCartItem) => {
    setLoading(true);
    try {
      // Require login before adding items
      if (!user || !sessionKey) {
        toast.info("Please login to add items to your cart.");
        return;
      }
      // If user is logged in, sync with server
      if (item.product_id) {
        await cartApi.addToCart({
          product_id: item.product_id,
          quantity: item.quantity,
          price_qty: 0,
          price_unit_name: item.name,
        }, sessionKey, user.id);
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
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = useCallback(async (id: string) => {
    // Update local state immediately for better UX
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      const newQuantity = item.quantity + 1;

      // Clear existing timeout for this item
      const existingTimeout = timeoutRefs.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Debounced server update after 2 seconds
      if (user && sessionKey && item.product_id) {
        const timeout = setTimeout(() => {
          cartApi.updateCart({
            product_id: item.product_id!,
            quantity: newQuantity,
            price_qty: 0,
            price_unit_name: item.name,
          }, sessionKey, user.id).catch((apiError) => {
            console.warn("API update failed, using local storage:", apiError);
            toast.error("Failed to sync with server. Please try again.");
          });
          timeoutRefs.current.delete(id);
        }, 2000); // 2 seconds delay

        timeoutRefs.current.set(id, timeout);
      }

      return prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
    });
  }, [user, sessionKey]);

  const decreaseItemQuantity = useCallback(async (id: string) => {
    // Update local state immediately for better UX
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      // Clear existing timeout for this item
      const existingTimeout = timeoutRefs.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      if (item.quantity <= 1) {
        // Remove item
        if (user && sessionKey && item.product_id) {
          const timeout = setTimeout(() => {
            cartApi.removeFromCart(item.product_id!, sessionKey).catch((apiError) => {
              console.warn("API remove failed, using local storage:", apiError);
              toast.error("Failed to sync with server. Please try again.");
            });
            timeoutRefs.current.delete(id);
          }, 2000); // 2 seconds delay

          timeoutRefs.current.set(id, timeout);
        }
        return prev.filter((i) => i.id !== id);
      } else {
        // Decrease quantity
        const newQuantity = item.quantity - 1;

        if (user && sessionKey && item.product_id) {
          const timeout = setTimeout(() => {
            cartApi.decreaseQuantity(item.product_id!, sessionKey).catch((apiError) => {
              console.warn("API update failed, using local storage:", apiError);
              toast.error("Failed to sync with server. Please try again.");
            });
            timeoutRefs.current.delete(id);
          }, 2000); // 2 seconds delay

          timeoutRefs.current.set(id, timeout);
        }

        return prev.map((i) =>
          i.id === id ? { ...i, quantity: newQuantity } : i
        );
      }
    });
  }, [user, sessionKey]);

  const updateItemQuantity = useCallback(async (id: string, qty: number) => {
    const newQuantity = qty < 1 ? 1 : qty;

    // Update local state immediately for better UX
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      // Clear existing timeout for this item
      const existingTimeout = timeoutRefs.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Debounced server update after 2 seconds
      if (user && sessionKey && item.product_id) {
        const timeout = setTimeout(() => {
          cartApi.updateCart({
            product_id: item.product_id!,
            quantity: newQuantity,
            price_qty: 0,
            price_unit_name: item.name,
          }, sessionKey, user.id).catch((apiError) => {
            console.warn("API update failed, using local storage:", apiError);
            toast.error("Failed to sync with server. Please try again.");
          });
          timeoutRefs.current.delete(id);
        }, 2000); // 2 seconds delay

        timeoutRefs.current.set(id, timeout);
      }

      return prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
    });
  }, [user, sessionKey]);

  const removeFromCart = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    setLoading(true);
    try {
      // Try to sync with server if user is logged in
      if (user && sessionKey && item.product_id) {
        try {
          await cartApi.removeFromCart(item.product_id!, sessionKey);
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
      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
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
        } else {
          // Empty server cart → start fresh for this user
          setCartItems([]);
          try { localStorage.removeItem("cart"); } catch { }
        }
      }
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
