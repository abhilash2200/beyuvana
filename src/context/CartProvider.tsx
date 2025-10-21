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
  syncLocalToServer: () => Promise<void>;
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

  const isValidCartItem = (item: unknown): item is LocalCartItem => {
    if (item === null || typeof item !== 'object') return false;

    const obj = item as Record<string, unknown>;

    return 'id' in obj &&
      'name' in obj &&
      'price' in obj &&
      'quantity' in obj &&
      typeof obj.id === 'string' &&
      obj.id.length > 0 &&
      typeof obj.name === 'string' &&
      obj.name.length > 0 &&
      typeof obj.price === 'number' &&
      !isNaN(obj.price) &&
      obj.price >= 0 &&
      typeof obj.quantity === 'number' &&
      !isNaN(obj.quantity) &&
      obj.quantity > 0 &&
      obj.quantity <= 10;
  };

  const enhanceCartItemsWithDetails = useCallback(async (items: LocalCartItem[]): Promise<LocalCartItem[]> => {
    if (!user || !sessionKey) {
      return items;
    }

    const enhancedItems = await Promise.all(
      items.map(async (item) => {
        // Validate item data first
        if (!item || !item.id || !item.name) {
          return null;
        }

        // Always fetch fresh product details to ensure we have the latest pricing
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
    return enhancedItems.filter((item): item is LocalCartItem => item !== null);
  }, [user, sessionKey, fetchProductDetails]);

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    try {
      // Try to load user-specific cart if user is available
      if (user?.id) {
        const userCartKey = `cart_${user.id}`;
        const storedCart = localStorage.getItem(userCartKey);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            // Validate cart items before setting
            const validCartItems = parsedCart.filter(isValidCartItem);

            if (validCartItems.length !== parsedCart.length) {
            }

            setCartItems(validCartItems);
          }
        }
      } else {
        // If no user, try to load from legacy cart key for backward compatibility
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            // Validate cart items before setting
            const validCartItems = parsedCart.filter(isValidCartItem);

            if (validCartItems.length !== parsedCart.length) {
            }

            setCartItems(validCartItems);
          }
        }
      }
      setCartLoadedFromStorage(true);
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
      // Clear invalid cart data
      try {
        if (user?.id) {
          localStorage.removeItem(`cart_${user.id}`);
        } else {
          localStorage.removeItem("cart");
        }
      } catch { }
      setCartLoadedFromStorage(true);
    }
  }, [user?.id]); // Re-run when user changes

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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user?.id) {
        // Save to user-specific cart key
        const userCartKey = `cart_${user.id}`;
        localStorage.setItem(userCartKey, JSON.stringify(cartItems));
      } else {
        // Fallback to legacy cart key for non-authenticated users
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }, [cartItems, user?.id]);

  // Handle user login - restore user-specific cart
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage) {

      // Check if there's a user-specific cart to restore
      const userCartKey = `cart_${user.id}`;
      const userCart = localStorage.getItem(userCartKey);

      if (userCart) {
        try {
          const parsedUserCart = JSON.parse(userCart);
          if (Array.isArray(parsedUserCart) && parsedUserCart.length > 0) {
            setCartItems(parsedUserCart);

            // Enhance with product details
            enhanceCartItemsWithDetails(parsedUserCart).then((enhancedItems) => {
              setCartItems(enhancedItems);
            });
          }
        } catch (error) {
          console.warn(`Failed to parse user cart for ${user.id}:`, error);
          localStorage.removeItem(userCartKey);
        }
      }
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage, enhanceCartItemsWithDetails]);

  // Enhance cart items with product details when user logs in
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage && cartItems.length > 0) {
      enhanceCartItemsWithDetails(cartItems).then((enhancedItems) => {
        setCartItems(enhancedItems);
      });
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage, enhanceCartItemsWithDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync with server when user logs in (only after auth is initialized and cart is loaded)
  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage) {
      let isMounted = true;

      const performSync = async () => {
        try {
          // Store local cart items before server sync
          const localCartBeforeSync = [...cartItems];

          // First try to sync from server to local
          if (isMounted) {
            await syncWithServer();
          }

          // If we had local items before sync and component is still mounted, sync them to server
          if (isMounted && localCartBeforeSync.length > 0) {
            await syncLocalToServer();
          }
        } catch (error) {
          console.error("Cart sync error:", error);
        }
      };

      // Use a single timeout to prevent race conditions
      const timeoutId = setTimeout(performSync, 500);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage]); // eslint-disable-line react-hooks/exhaustive-deps

  // When user logs out, immediately clear local cart and storage
  // Only clear if auth is initialized and it's not a page refresh
  useEffect(() => {
    if (authInitialized && (!user || !sessionKey) && !isPageRefresh) {
      // This is a real logout, clear the cart
      setCartItems([]);
      try {
        // Clear both legacy and user-specific cart keys
        localStorage.removeItem("cart");
        // Clear all user-specific cart keys (in case there are multiple users)
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith("cart_")) {
            localStorage.removeItem(key);
          }
        });
      } catch { }
    } else if (authInitialized && (!user || !sessionKey) && isPageRefresh) {
      // This is a page refresh, don't clear the cart
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


      // If user is logged in, sync with server
      if (item.product_id && item.product_price_id) {
        try {
          const cartData = {
            product_id: item.product_id,
            quantity: item.quantity,
            price_qty: Number(item.product_price_id),
            price_unit_name: item.name,
            product_price: item.mrp_price || 0,
            discount_price: item.price || 0,
            product_price_id: item.product_price_id,
          };

          await cartApi.addToCart(cartData, sessionKey, user.id);
        } catch (apiError) {
          console.warn("API add to cart failed:", apiError);
        }
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
          // Extract pack size from item ID (format: productId-packSize)
          const packSize = item.id.includes('-') ? parseInt(item.id.split('-')[1]) : item.quantity;

          // Add new item with pack information
          const newItem = {
            ...item,
            pack_qty: packSize
          };
          const newItems = [...prev, newItem];

          // Fetch product details for the new item if it has a product_id
          if (item.product_id && user) {
            fetchProductDetails(item.product_id, user.id).then((productDetails) => {
              if (productDetails) {
                // Find the matching price tier based on pack size
                const matchingPriceTier = productDetails.prices?.find(tier =>
                  Number(tier.qty) === packSize
                );

                setCartItems((currentItems) =>
                  currentItems.map((currentItem) =>
                    currentItem.id === item.id
                      ? {
                        ...currentItem,
                        product_details: productDetails,
                        // Use the matching price tier data for the pack size
                        mrp_price: matchingPriceTier ? parseFloat(matchingPriceTier.mrp) : 0,
                        discount_percent: matchingPriceTier?.discount_off_inpercent,
                        price: matchingPriceTier ? parseFloat(matchingPriceTier.final_price) : currentItem.price,
                        product_price_id: matchingPriceTier?.product_price_id,
                        short_description: productDetails.short_description,
                        product_description: productDetails.product_description,
                        in_stock: productDetails.in_stock,
                        image: productDetails.image?.[0] || currentItem.image,
                      }
                      : currentItem
                  )
                );
              }
            }).catch((error) => {
              console.warn("Failed to fetch product details for cart item:", error);
            });
          }
          return newItems;
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
            price_qty: Number(item.product_price_id) || 0,
            price_unit_name: item.name,
          }, sessionKey, user.id).catch((apiError) => {
            console.warn("API update failed, using local storage:", apiError);
            // Don't show error toast for background sync failures
          });
          timeoutRefs.current.delete(id);
        }, 2000); // 2 seconds delay

        timeoutRefs.current.set(id, timeout);
      }

      // Update quantity and recalculate price tier if product details are available
      return prev.map((i) => {
        if (i.id === id) {
          const updatedItem = { ...i, quantity: newQuantity };

          // For pack-specific items, don't recalculate price tier on quantity change
          // The price tier is based on pack size, not quantity
          // Only recalculate if this is not a pack-specific item
          if (i.product_details?.prices && !i.pack_qty) {
            const matchingPriceTier = i.product_details.prices.find(tier =>
              Number(tier.qty) === newQuantity
            );

            if (matchingPriceTier) {
              updatedItem.mrp_price = parseFloat(matchingPriceTier.mrp);
              updatedItem.discount_percent = matchingPriceTier.discount_off_inpercent;
              updatedItem.price = parseFloat(matchingPriceTier.final_price);
            }
          }

          return updatedItem;
        }
        return i;
      });
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
              // Don't show error toast for background sync failures
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
              // Don't show error toast for background sync failures
            });
            timeoutRefs.current.delete(id);
          }, 2000); // 2 seconds delay

          timeoutRefs.current.set(id, timeout);
        }

        // Update quantity and recalculate price tier if product details are available
        return prev.map((i) => {
          if (i.id === id) {
            const updatedItem = { ...i, quantity: newQuantity };

            // Recalculate price tier for new quantity if product details exist
            if (i.product_details?.prices) {
              const matchingPriceTier = i.product_details.prices.find(tier =>
                Number(tier.qty) === newQuantity
              );

              if (matchingPriceTier) {
                updatedItem.mrp_price = parseFloat(matchingPriceTier.mrp);
                updatedItem.discount_percent = matchingPriceTier.discount_off_inpercent;
              }
            }

            return updatedItem;
          }
          return i;
        });
      }
    });
  }, [user, sessionKey]);

  const updateItemQuantity = useCallback(async (id: string, qty: number) => {
    // Validate quantity input
    if (typeof qty !== 'number' || isNaN(qty)) {
      console.error("Invalid quantity provided:", qty);
      return;
    }

    const newQuantity = Math.max(1, Math.min(10, Math.round(qty))); // Clamp between 1-10 and round

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
            price_qty: Number(item.product_price_id) || 0,
            price_unit_name: item.name,
          }, sessionKey, user.id).catch((apiError) => {
            console.warn("API update failed, using local storage:", apiError);
            // Don't show error toast for background sync failures
          });
          timeoutRefs.current.delete(id);
        }, 2000); // 2 seconds delay

        timeoutRefs.current.set(id, timeout);
      }

      // Update quantity and recalculate price tier if product details are available
      return prev.map((i) => {
        if (i.id === id) {
          const updatedItem = { ...i, quantity: newQuantity };

          // For pack-specific items, don't recalculate price tier on quantity change
          // The price tier is based on pack size, not quantity
          // Only recalculate if this is not a pack-specific item
          if (i.product_details?.prices && !i.pack_qty) {
            const matchingPriceTier = i.product_details.prices.find(tier =>
              Number(tier.qty) === newQuantity
            );

            if (matchingPriceTier) {
              updatedItem.mrp_price = parseFloat(matchingPriceTier.mrp);
              updatedItem.discount_percent = matchingPriceTier.discount_off_inpercent;
              updatedItem.price = parseFloat(matchingPriceTier.final_price);
            }
          }

          return updatedItem;
        }
        return i;
      });
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
          toast.success(`${item.name} removed from cart!`);
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
      const response = await cartApi.getCart(sessionKey, user.id);

      if (Array.isArray(response.data)) {
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
            // Enhance cart items with product details
            const enhancedItems = await enhanceCartItemsWithDetails(serverCartItems);
            setCartItems(enhancedItems);
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
  };

  // New function to sync local cart to server
  const syncLocalToServer = async () => {
    if (!user || !sessionKey) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }
    setLoading(true);

    try {
      // First check what's on the server
      await cartApi.getCart(sessionKey, user.id);

      // Send each local cart item to server
      for (const item of cartItems) {
        if (item.product_id && item.product_price_id) {
          try {
            const cartData = {
              product_id: item.product_id,
              quantity: item.quantity,
              price_qty: Number(item.product_price_id),
              price_unit_name: item.name,
              product_price: item.mrp_price || 0,
              discount_price: item.price || 0,
              product_price_id: item.product_price_id,
            };

            await cartApi.addToCart(cartData, sessionKey, user.id);
          } catch (itemError) {
            console.warn("Failed to sync item to server:", item.name, itemError);
          }
        }
      }
    } catch (error) {
      console.error("Failed to sync local cart to server:", error);
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
          // Use the new removeAllFromCart API function that matches the curl command
          await cartApi.removeAllFromCart(Number(user.id), sessionKey);
        } catch (apiError) {
          console.warn("API clear cart failed, using local storage:", apiError);
        }
      }

      // Always clear local state
      setCartItems([]);

      // Clear both legacy and user-specific cart keys
      try {
        localStorage.removeItem("cart");
        if (user?.id) {
          localStorage.removeItem(`cart_${user.id}`);
        }
      } catch { }

      toast.success("Your cart has been cleared successfully!");
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
    } else {
      await refreshProductDetails();
    }
  };

  // Manual refresh function for product details
  const refreshProductDetails = async () => {
    if (user && sessionKey && cartItems.length > 0) {
      const enhancedItems = await enhanceCartItemsWithDetails(cartItems);
      setCartItems(enhancedItems);
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

  // Function to clear localStorage and force fresh sync (for debugging)
  const clearLocalStorageAndSync = async () => {

    try {
      // Clear all cart-related localStorage
      if (user?.id) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      localStorage.removeItem("cart");

      // Clear current cart state
      setCartItems([]);

      // Force sync with server
      if (user && sessionKey) {
        await syncWithServer();
      }
    } catch (error) {
      console.error("Failed to clear localStorage and sync:", error);
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
        syncLocalToServer,
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
