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
import { cartApi, productsApi, ProductDetailsResponse } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";

type ServerCartItem = {
  id?: string;
  product_id: string;
  name?: string;
  product_name?: string;
  price?: number;
  sale_price?: number;
  quantity?: number;
  qty?: number;
  image?: string;
  product_image?: string;
  mrp_price?: number;
  discount_percent?: string;
  discount_off_inpercent?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  cart_id?: string;
};

type LocalCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product_id?: string;
  pack_qty?: number;
  product_price_id?: string;
  product_details?: ProductDetailsResponse;
  mrp_price?: number;
  discount_percent?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  cart_id?: string;
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
  refreshCart: () => Promise<void>;
  refreshProductDetails: () => Promise<void>;
  cleanupCorruptedCart: () => void;
  clearLocalStorageAndSync: () => Promise<void>;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
};

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
  const enhancementInProgressRef = useRef<boolean>(false);
  useEffect(() => {
    const currentTimeoutRefs = timeoutRefs.current;
    return () => {
      currentTimeoutRefs.forEach((timeout) => {
        clearTimeout(timeout);
      });
      currentTimeoutRefs.clear();
    };
  }, []);

  const fetchProductDetails = useCallback(async (productId: string, userId?: string | number): Promise<ProductDetailsResponse | null> => {
    try {
      const response = await productsApi.getDetails(productId, userId);
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch product details for product ${productId}:`, error);
      return null;
    }
  }, []);

  // No longer needed - cart is server-only

  const syncWithServer = useCallback(async () => {
    if (!user || !sessionKey) {
      return;
    }

    // Prevent multiple simultaneous sync operations
    if (syncLockRef.current) {
      return;
    }

    syncLockRef.current = true;
    setLoading(true);

    try {
      console.log("🔄 Syncing with server");
      const response = await cartApi.getCart(sessionKey, user.id);
      console.log("🔄 Server response:", response);

      if (Array.isArray(response.data)) {
        console.log("🔄 Server cart items:", response.data.length);
        if (response.data.length > 0) {
          // Convert API cart items to local format with validation
          const serverCartItems: LocalCartItem[] = response.data
            .map((item: ServerCartItem) => {
              // Handle different server response formats
              const mappedItem = {
                id: item.id || item.product_id || `${item.product_id}-${item.qty || 1}`,
                name: item.name || item.product_name || 'Unknown Product',
                price: typeof item.price === 'number' ? item.price :
                  typeof item.sale_price === 'number' ? item.sale_price :
                    parseFloat(String(item.sale_price || 0)) || parseFloat(String(item.price || 0)) || 0,
                quantity: typeof item.quantity === 'number' ? item.quantity :
                  typeof item.qty === 'number' ? item.qty :
                    parseInt(String(item.qty || 1)) || parseInt(String(item.quantity || 1)) || 1,
                image: item.image || item.product_image || '/placeholder.png',
                product_id: item.product_id || item.id,
                // Additional fields that might be useful
                mrp_price: item.mrp_price ? parseFloat(String(item.mrp_price)) : undefined,
                discount_percent: item.discount_percent || item.discount_off_inpercent,
                short_description: item.short_description || item.product_description,
                product_description: item.product_description,
                in_stock: item.in_stock,
                cart_id: item.cart_id,
              };

              return mappedItem;
            })
            .filter((item: LocalCartItem) => {
              // Validate server cart items
              const isValid = item &&
                item.id &&
                item.name &&
                typeof item.price === 'number' &&
                !isNaN(item.price) &&
                typeof item.quantity === 'number' &&
                item.quantity > 0;

              if (!isValid) {
              }

              return isValid;
            });

          if (serverCartItems.length > 0) {
            // Set cart items directly - enhancement will happen in separate effect
            setCartItems(serverCartItems);
          }
        }
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
      // Don't show error toast for sync failures, just use local storage
      // This ensures the cart continues to work even when server is unavailable
    } finally {
      setLoading(false);
      syncLockRef.current = false; // Release the sync lock
    }
  }, [user, sessionKey]);


  // Load cart from server only (no local storage)
  useEffect(() => {
    setCartLoadedFromStorage(true);
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

  // Mark that this is no longer a page refresh once auth is initialized
  useEffect(() => {
    if (authInitialized) {
      setIsPageRefresh(false);
    }
  }, [authInitialized]);

  // No local storage - cart is server-only

  // Load cart from server when user logs in
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage) {
      console.log("🔄 User logged in, loading cart from server...");
      syncWithServer();
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage, syncWithServer]);

  // Enhance cart items with product details when cart items change
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartItems.length > 0) {
      // Only enhance if items don't already have product details and enhancement is not in progress
      const needsEnhancement = cartItems.some(item => !item.product_details);
      if (needsEnhancement && !enhancementInProgressRef.current) {
        enhancementInProgressRef.current = true;

        // Inline the enhancement logic to avoid dependency issues
        const enhanceItems = async () => {
          try {
            const enhancedItems = await Promise.all(
              cartItems.map(async (item) => {
                // Validate item data first
                if (!item || !item.id || !item.name) {
                  return null;
                }

                // Skip if already has product details
                if (item.product_details) {
                  return item;
                }

                // Only fetch product details if we have a product_id
                if (!item.product_id) {
                  return item;
                }

                try {
                  const productDetails = await fetchProductDetails(item.product_id, user.id);
                  if (productDetails) {
                    const packSize = item.pack_qty || item.quantity;
                    const matchingPriceTier = productDetails.prices?.find(tier =>
                      Number(tier.qty) === packSize
                    );

                    if (matchingPriceTier) {
                      return {
                        ...item,
                        product_details: productDetails,
                        mrp_price: parseFloat(matchingPriceTier.mrp) || 0,
                        discount_percent: matchingPriceTier.discount_off_inpercent,
                        price: parseFloat(matchingPriceTier.final_price) || 0,
                        product_price_id: matchingPriceTier.product_price_id,
                        short_description: productDetails.short_description || item.short_description,
                        product_description: productDetails.product_description || item.product_description,
                        in_stock: productDetails.in_stock || item.in_stock,
                        image: productDetails.image?.[0] || item.image,
                      };
                    }

                    return item;
                  } else {
                    return item; // Return original item if product details fetch fails
                  }
                } catch (error) {
                  console.error("Error enhancing cart item:", error);
                  return item; // Return original item if enhancement fails
                }
              })
            );

            // Filter out null items (invalid items)
            const validEnhancedItems = enhancedItems.filter((item): item is LocalCartItem => item !== null);
            setCartItems(validEnhancedItems);
          } catch (error) {
            console.error("Failed to enhance cart items:", error);
          } finally {
            enhancementInProgressRef.current = false;
          }
        };

        enhanceItems();
      }
    }
  }, [cartItems, user, sessionKey, authInitialized, fetchProductDetails]);

  // No complex sync logic needed - cart is server-only

  // When user logs out, clear the cart
  useEffect(() => {
    if (authInitialized && (!user || !sessionKey) && !isPageRefresh) {
      // This is a real logout, clear the cart
      setCartItems([]);
    }
  }, [user, sessionKey, authInitialized, isPageRefresh]);

  const addToCart = async (item: LocalCartItem) => {
    setLoading(true);
    try {
      // Require login before adding items
      if (!user || !sessionKey) {
        toast.info("Please login to add items to your cart.");
        return;
      }

      // Add to server cart
      if (item.product_id && item.product_price_id) {
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

          // Debug logging
          console.log("🛒 CartProvider - Cart data being sent to API:", {
            originalItem: item,
            cartData: cartData,
            userId: user.id
          });

          await cartApi.addToCart(cartData, sessionKey, user.id);

          // Refresh cart from server after adding
          await syncWithServer();
        } catch (apiError) {
          console.error("Failed to add to cart:", apiError);
          toast.error("Failed to add item to cart. Please try again.");
        }
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || !user || !sessionKey || !item.product_id) return;

    // Clear existing timeout for this item
    const existingTimeout = timeoutRefs.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Debounced server update after 1 second
    const timeout = setTimeout(async () => {
      try {
        // Add one more of the same item to server cart
        const cartData = {
          product_id: item.product_id!,
          quantity: 1, // Add just 1 more
          price_qty: Number(item.product_price_id) || 0,
          price_unit_name: item.name,
          product_price: item.mrp_price || 0,
          discount_price: item.price || 0,
          product_price_id: item.product_price_id!,
        };

        await cartApi.addToCart(cartData, sessionKey, user.id);

        // Refresh cart from server
        await syncWithServer();
      } catch (error) {
        console.error("Failed to increase quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
      }
      timeoutRefs.current.delete(id);
    }, 1000); // 1 second delay

    timeoutRefs.current.set(id, timeout);
  }, [cartItems, user, sessionKey, syncWithServer]);

  const decreaseItemQuantity = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || !user || !sessionKey || !item.product_id) return;

    // Clear existing timeout for this item
    const existingTimeout = timeoutRefs.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Debounced server update after 1 second
    const timeout = setTimeout(async () => {
      try {
        if (item.quantity <= 1) {
          // Remove item completely
          await cartApi.removeFromCart(item.product_id!, sessionKey, user.id, item.cart_id);
          toast.success(`${item.name} removed from cart!`);
        } else {
          // Decrease quantity by 1
          await cartApi.decreaseQuantity(item.product_id!, sessionKey);
        }

        // Refresh cart from server
        await syncWithServer();
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
      }
      timeoutRefs.current.delete(id);
    }, 1000); // 1 second delay

    timeoutRefs.current.set(id, timeout);
  }, [cartItems, user, sessionKey, syncWithServer]);

  const updateItemQuantity = useCallback(async (id: string, qty: number) => {
    // Validate quantity input
    if (typeof qty !== 'number' || isNaN(qty)) {
      console.error("Invalid quantity provided:", qty);
      return;
    }

    const newQuantity = Math.max(1, Math.min(10, Math.round(qty))); // Clamp between 1-10 and round
    const item = cartItems.find((i) => i.id === id);

    if (!item || !user || !sessionKey || !item.product_id) return;

    try {
      // Remove the item first, then add with new quantity
      await cartApi.removeFromCart(item.product_id, sessionKey, user.id, item.cart_id);

      // Add with new quantity
      const cartData = {
        product_id: item.product_id,
        quantity: newQuantity,
        price_qty: Number(item.product_price_id) || 0,
        price_unit_name: item.name,
        product_price: item.mrp_price || 0,
        discount_price: item.price || 0,
        product_price_id: item.product_price_id,
      };

      await cartApi.addToCart(cartData, sessionKey, user.id);

      // Refresh cart from server
      await syncWithServer();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  }, [cartItems, user, sessionKey, syncWithServer]);

  const removeFromCart = useCallback(async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || !user || !sessionKey || !item.product_id) return;

    setLoading(true);
    try {
      await cartApi.removeFromCart(item.product_id, sessionKey, user.id, item.cart_id);
      toast.success(`${item.name} removed from cart!`);

      // Refresh cart from server
      await syncWithServer();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cartItems, user, sessionKey, syncWithServer]);

  // syncWithServer function moved above

  // No local-to-server sync needed - cart is server-only

  const clearCart = async () => {
    setLoading(true);
    try {
      if (user && sessionKey) {
        await cartApi.removeAllFromCart(Number(user.id), sessionKey);
        setCartItems([]);
        toast.success("Your cart has been cleared successfully!");
      }
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

  // Manual refresh function for product details
  const refreshProductDetails = async () => {
    if (user && sessionKey && cartItems.length > 0) {
      // Reset the enhancement progress flag to allow re-enhancement
      enhancementInProgressRef.current = false;
      // Trigger re-enhancement by updating cart items
      setCartItems([...cartItems]);
    }
  };

  // Function to clean up corrupted cart data
  const cleanupCorruptedCart = () => {

    // Filter out invalid items
    const validItems = cartItems.filter((item) => {
      const isValid = item &&
        item.id &&
        item.name &&
        typeof item.price === 'number' &&
        !isNaN(item.price) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0;

      if (!isValid) {
        console.warn("Removing corrupted item:", item);
      }

      return isValid;
    });

    if (validItems.length !== cartItems.length) {
      setCartItems(validItems);
    }
  };

  // Function to force fresh sync (for debugging)
  const clearLocalStorageAndSync = async () => {
    try {
      // Clear current cart state
      setCartItems([]);

      // Force sync with server
      if (user && sessionKey) {
        await syncWithServer();
      }
    } catch (error) {
      console.error("Failed to clear and sync:", error);
    }
  };

  // Debug function to log current cart state
  const debugCartState = () => {
    console.log("🔍 Cart Debug Info:", {
      cartItems: cartItems.length,
      cartData: cartItems,
      userId: user?.id,
      hasSessionKey: !!sessionKey,
      authInitialized,
      cartLoadedFromStorage
    });
  };

  // Make debug function available globally for console access
  if (typeof window !== 'undefined') {
    (window as unknown as { debugCart: () => void }).debugCart = debugCartState;
  }

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
        cleanupCorruptedCart,
        clearLocalStorageAndSync,
        loading,
        // Cart UI controls
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

// Hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
