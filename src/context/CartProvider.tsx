"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import type { CartContextType, LocalCartItem } from "./cart/types";
import { useCartSync } from "./cart/useCartSync";
import { useCartEnhancement } from "./cart/useCartEnhancement";
import { useCartOperations } from "./cart/useCartOperations";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [cartLoadedFromStorage, setCartLoadedFromStorage] = useState(false);
  const [isPageRefresh, setIsPageRefresh] = useState(true);
  const { user, sessionKey } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const syncLockRef = useRef<boolean>(false);

  // Cleanup timeouts on unmount
  useEffect(() => {
    const currentTimeoutRefs = timeoutRefs.current;
    return () => {
      currentTimeoutRefs.forEach((timeout) => {
        clearTimeout(timeout);
      });
      currentTimeoutRefs.clear();
    };
  }, []);

  // Cart sync hook
  const { syncWithServer } = useCartSync({
    user,
    sessionKey,
    setCartItems,
    setLoading,
    syncLockRef,
  });


  useEffect(() => {
    setCartLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    const hasStoredAuth = typeof window !== "undefined"
      ? (localStorage.getItem("user") || localStorage.getItem("session_key"))
      : null;
    if (hasStoredAuth) {
      if (user !== null || sessionKey !== null) {
        setAuthInitialized(true);
      }
    } else {
      setAuthInitialized(true);
    }
  }, [user, sessionKey]);

  useEffect(() => {
    if (authInitialized) {
      setIsPageRefresh(false);
    }
  }, [authInitialized]);


  // Cart enhancement hook
  const { enhanceCartItems, enhancementInProgressRef } = useCartEnhancement({
    cartItems,
    user,
    sessionKey,
    authInitialized,
    setCartItems,
  });

  // Cart operations hook
  const {
    addToCart,
    removeFromCart,
    clearCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    updateItemQuantity,
  } = useCartOperations({
    cartItems,
    user,
    sessionKey,
    setCartItems,
    setLoading,
    syncWithServer,
    timeoutRefs,
  });

  // Sync cart when auth and storage are ready
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage) {
      syncWithServer();
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage, syncWithServer]);

  // Enhance cart items with product details
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartItems.length > 0) {
      enhanceCartItems();
    }
  }, [cartItems, user, sessionKey, authInitialized, enhanceCartItems]);


  // Clear cart when user logs out
  useEffect(() => {
    if (authInitialized && (!user || !sessionKey) && !isPageRefresh) {
      setCartItems([]);
    }
  }, [user, sessionKey, authInitialized, isPageRefresh]);

  const refreshCart = async () => {
    if (user && sessionKey) {
      await syncWithServer();
    }
  };

  const refreshProductDetails = async () => {
    if (user && sessionKey && cartItems.length > 0) {
      enhancementInProgressRef.current = false;
      setCartItems([...cartItems]);
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
        refreshProductDetails,
        loading,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        setCartOpen: setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
