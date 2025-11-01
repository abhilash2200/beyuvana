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
  price_unit_name?: string;
  price?: number;
  sale_price?: string | number;
  final_price?: string | number;
  quantity?: number;
  qty?: string | number;
  image?: string;
  product_image?: string;
  mrp?: string | number;
  mrp_price?: number;
  discount_percent?: string;
  discount_off_inpercent?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  cart_id?: string;
  unit_qty?: string | number;
  unit_name?: string;
  product_code?: string;
  sku_number?: string;
  posted_on?: string;
  discount_amount?: number;
};

type LocalCartItem = {
  id: string;
  name: string;
  price?: number;
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
  unit_name?: string;
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
      if (process.env.NODE_ENV === "development") {
        console.warn(`Failed to fetch product details for product ${productId}:`, error);
      }
      return null;
    }
  }, []);


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
              const mappedItem = {
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
  }, [user, sessionKey]);


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


  useEffect(() => {
    if (authInitialized && user && sessionKey && cartLoadedFromStorage) {
      syncWithServer();
    }
  }, [user, sessionKey, authInitialized, cartLoadedFromStorage, syncWithServer]);

  useEffect(() => {
    if (authInitialized && user && sessionKey && cartItems.length > 0) {
      const needsEnhancement = cartItems.some(item => !item.product_details);

      if (needsEnhancement && !enhancementInProgressRef.current) {
        enhancementInProgressRef.current = true;

        const enhanceItems = async () => {
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
                  } else {
                    return item;
                  }
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
        };

        enhanceItems();
      }
    }
  }, [cartItems, user, sessionKey, authInitialized, fetchProductDetails]);


  useEffect(() => {

    if (authInitialized && (!user || !sessionKey) && !isPageRefresh) {
      setCartItems([]);
    }
  }, [user, sessionKey, authInitialized, isPageRefresh]);

  const addToCart = async (item: LocalCartItem) => {
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
  };

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
    }, 500);

    timeoutRefs.current.set(id, timeout);
  }, [cartItems, user, sessionKey, syncWithServer]);

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
    }, 500);

    timeoutRefs.current.set(id, timeout);
  }, [cartItems, user, sessionKey, syncWithServer]);

  const updateItemQuantity = useCallback(async (id: string, qty: number) => {
    if (typeof qty !== 'number' || isNaN(qty)) {
      if (process.env.NODE_ENV === "development") {
        console.error("Invalid quantity provided:", qty);
      }
      return;
    }

    const newQuantity = Math.max(1, Math.min(10, Math.round(qty)));
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
    }, 800);

    timeoutRefs.current.set(id, timeout);
  }, [cartItems, user, sessionKey, syncWithServer]);

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
  }, [cartItems, user, sessionKey, syncWithServer]);


  const clearCart = async () => {
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
  };

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
