const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://beyuvana.com/api";
const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || "/api/proxy";

// Environment detection
const isBrowser = typeof window !== "undefined";
const isDevelopment = process.env.NODE_ENV === "development";

interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  code?: number;
  status?: boolean;
}

interface PriceTier {
  product_price_id: string;
  qty: number;
  unit_id: string;
  unit_name: string;
  mrp: string;
  discount: string;
  discount_off_inpercent: string;
  discount_amount: number;
  sale_price: string;
  final_price: string;
}

interface Product {
  id: string;
  category: string;
  categorykey: string;
  brand: string;
  brandkey: string;
  product_code: string;
  product_name: string;
  // Legacy flat prices (some backends)
  product_price?: string;
  discount_price?: string;
  discount_off_inpercent?: string;
  // New tiered pricing structure
  prices?: PriceTier[];
  sku_number: string;
  short_description: string;
  product_description: string;
  in_stock: string;
  // Image fields may vary per backend
  image?: string;
  image_single?: string;
  image_all?: string[];
  // Optional design type used to select layout on product detail page
  design_type?: "green" | "pink" | "GREEN" | "PINK";
}

// Legacy product interface for backward compatibility
interface LegacyProduct {
  id: number;
  name: string;
  tagline?: string;
  description: string[];
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  bgColor: string;
  // Bubble through the design type if backend sends it
  design_type?: "green" | "pink";
  // Pass-through fields so frontend can show everything when needed
  category?: string;
  categorykey?: string;
  brand?: string;
  brandkey?: string;
  product_code?: string;
  sku_number?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  image_single?: string;
  image_all?: string[];
  prices?: PriceTier[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullname: string;
  email: string;
  phonenumber: string;
  password: string;
}

// Dynamic product list request to match backend (filter/sort/search/pagination)
interface ProductsListRequest {
  filter?: {
    brandkey?: string[];
    categorykey?: string[];
    product_name?: string[];
    product_price?: [number, number];
    [key: string]: unknown; // allow future filters
  };
  sort?: Record<string, "ASC" | "DESC">;
  searchTerms?: string;
  page?: number;
  limit?: number;
}

interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  productName: string;
  description: string;
  price: number;
  status: "arriving" | "cancelled" | "delivered";
  date?: string; // cancelled/delivered date
  image: string;
}

interface SaveAddressRequest {
  user_id: number;
  fullname: string;
  address1: string;
  address2: string;
  mobile: string;
  email: string;
  city: string;
  pincode: string;
  is_primary: number;
}

interface SavedAddress {
  id: number;
  user_id: number;
  fullname: string;
  address1: string;
  address2: string;
  mobile: string;
  email: string;
  city: string;
  pincode: string;
  is_primary: number;
  created_at?: string;
  updated_at?: string;
}

interface ProductReviewRequest {
  product_id: number;
  user_id: number;
  review: string;
  star_ratting: number;
}

// Generic API fetch function with timeout and environment-based logging
async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Use proxy for browser requests to avoid CORS issues
  const url = isBrowser
    ? `${PROXY_URL}?endpoint=${encodeURIComponent(endpoint)}`
    : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  };

  // Environment-based logging
  if (isDevelopment) {
    console.log(`🌐 Making API request to: ${url}`, {
      config,
      isBrowser,
      originalEndpoint: endpoint,
      headers: config.headers,
    });
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (isDevelopment) {
      console.log(`📡 API Response for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      if (isDevelopment) {
        console.error(`❌ API Error Response:`, errorText);
      }
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    if (isDevelopment) {
      console.log(`✅ API Success for ${endpoint}:`, data);
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout: API call to ${endpoint} took too long`);
    }

    if (isDevelopment) {
      console.error(`❌ API fetch error for ${endpoint}:`, {
        error: error instanceof Error ? error.message : error,
        url,
        config,
        isBrowser,
      });
    }

    // Provide more specific error messages
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${url}. This might be a CORS issue or the server is unreachable.`
      );
    }

    throw error;
  }
}

// Auth API functions with fallback
export const authApi = {
  login: async (credentials: LoginRequest) => {
    try {
      return await apiFetch("/login/v1/", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error("Login API failed, this might be a CORS issue:", error);
      throw new Error(
        "Login failed. Please check your internet connection and try again."
      );
    }
  },

  register: async (userData: RegisterRequest) => {
    try {
      return await apiFetch("/signup/v1/", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Register API failed, this might be a CORS issue:", error);
      throw new Error(
        "Registration failed. Please check your internet connection and try again."
      );
    }
  },
};

// Products API functions
export const productsApi = {
  getList: async (params: ProductsListRequest = {}) => {
    try {
      return await apiFetch<Product[]>("/products/lists/v1/", {
        method: "POST",
        body: JSON.stringify({
          // provide safe defaults if caller omits values
          page: 1,
          limit: 10,
          filter: {},
          ...params,
        }),
      });
    } catch (error) {
      console.error("Products API failed:", error);
      throw new Error("Failed to fetch products. Please try again later.");
    }
  },
  getDetails: async (productId: string | number) => {
    try {
      return await apiFetch<Product>("/products/details/v1/", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
        }),
      });
    } catch (error) {
      console.error("Product details API failed:", error);
      throw new Error("Failed to fetch product details. Please try again later.");
    }
  },
};

// Cart API functions
export const cartApi = {
  addToCart: async (cartData: AddToCartRequest, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Try different header combinations - prioritize session_key
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        // Additional formats
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/add/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...cartData,
          session_key: sessionKey, // Add session key to request body as well
        }),
      });
    } catch (error) {
      console.error("Add to cart API failed:", error);
      throw new Error("Failed to add item to cart. Please try again later.");
    }
  },

  // Note: These endpoints may not be implemented yet on the server
  // For now, we'll use local storage and only sync add operations

  getCart: async (sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Try different header combinations - prioritize session_key
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        // Additional formats
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // Try more variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Try specific format that might be expected
        headers["Authorization"] = sessionKey; // Without Bearer prefix
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for cart API
      console.log("🔍 Cart API Debug:", {
        sessionKey: sessionKey ? "Present" : "Missing",
        sessionKeyLength: sessionKey?.length || 0,
        headers,
        endpoint: "/cart/lists/v1/",
      });

      // Try query parameter approach
      const endpoint = sessionKey
        ? `/cart/lists/v1/?session_key=${encodeURIComponent(sessionKey)}`
        : "/cart/lists/v1/";

      return await apiFetch<CartItem[]>(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          session_key: sessionKey, // Add session key to request body as well
        }),
      });
    } catch (error) {
      console.error("Get cart API failed:", error);

      // Check if it's a 401 error (authentication issue)
      if (error instanceof Error && error.message.includes("401")) {
        return {
          data: [],
          status: false,
          message: "Please log in to sync your cart.",
        };
      }

      // Return empty array as fallback for other errors
      return {
        data: [],
        status: false,
        message: "Failed to fetch cart items. Using local cart.",
      };
    }
  },

  updateCart: async (cartData: AddToCartRequest, sessionKey?: string) => {
    // This endpoint doesn't exist yet, use add to cart instead
    console.warn("Update cart API not implemented yet, using add to cart");
    return await cartApi.addToCart(cartData, sessionKey);
  },

  removeFromCart: async (productId: string, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/removeone/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId }),
      });
    } catch (error) {
      console.error("Remove from cart API failed:", error);
      throw new Error(
        "Failed to remove item from cart. Please try again later."
      );
    }
  },

  // Specific function for decreasing quantity by one
  decreaseQuantity: async (productId: string, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/removeone/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId }),
      });
    } catch (error) {
      console.error("Decrease quantity API failed:", error);
      throw new Error("Failed to decrease quantity. Please try again later.");
    }
  },

  // Function for clearing the entire cart
  clearCart: async (sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/remove/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({}), // Empty body for clearing entire cart
      });
    } catch (error) {
      console.error("Clear cart API failed:", error);
      throw new Error("Failed to clear cart. Please try again later.");
    }
  },
};

// Orders API functions
// Note: The /order/v1/ endpoint currently returns internal server error
// This might be due to the endpoint not being fully implemented yet
// or requiring different parameters/authentication format
export const ordersApi = {
  getOrderList: async (sessionKey?: string, userId?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        // Alternative header formats that some backends expect
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        console.log("🔍 Orders API Debug:", {
          sessionKey: sessionKey ? "Present" : "Missing",
          sessionKeyLength: sessionKey?.length || 0,
          headers,
          endpoint: "/api/order_list",
        });
      }

      return await apiFetch<Order[]>("/api/order_list", {
        method: "POST",
        headers,
        body: JSON.stringify({
          // Send user_id if available
          user_id: userId || null,
        }),
      });
    } catch (error) {
      console.error("Get order list API failed:", error);

      // Check if it's a 500 error (backend method not implemented)
      if (error instanceof Error && error.message.includes("500")) {
        return {
          data: [],
          status: false,
          message:
            "Orders feature is currently under development. Please check back later.",
        };
      }

      // Check if it's a 401 error (authentication issue)
      if (error instanceof Error && error.message.includes("401")) {
        return {
          data: [],
          status: false,
          message: "Please log in to view your orders.",
        };
      }

      // Generic fallback for other errors
      return {
        data: [],
        status: false,
        message: "Unable to load orders. Please try again later.",
      };
    }
  },
};

// Address API functions
export const addressApi = {
  saveAddress: async (addressData: SaveAddressRequest, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        // Add additional header formats that some backends expect
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        console.log("🔍 Save Address API Debug:", {
          addressData,
          sessionKey: sessionKey ? "Present" : "Missing",
          sessionKeyLength: sessionKey?.length || 0,
          headers,
          endpoint: "/api/save_address/",
        });
      }

      return await apiFetch("/api/save_address/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...addressData,
          session_key: sessionKey, // Add session key to request body as well
        }),
      });
    } catch (error) {
      console.error("Save address API failed:", error);
      throw new Error("Failed to save address. Please try again later.");
    }
  },

  // Get all addresses for a user
  getAddresses: async (userId: number, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Try different header combinations - prioritize session_key
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        // Additional formats
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
      }

      // Debug logging for headers - Force show for debugging
      console.log("🔍 Address API Debug:", {
        userId,
        sessionKey: sessionKey ? "Present" : "Missing",
        sessionKeyLength: sessionKey?.length || 0,
        headers,
        endpoint: "/api/get_address/",
      });
      console.log("📋 Exact Headers Being Sent:", headers);
      console.log(
        "🔑 Session Key Preview:",
        sessionKey?.substring(0, 20) + "..."
      );
      console.log("🌍 Environment:", process.env.NODE_ENV);

      return await apiFetch<SavedAddress[]>("/api/get_address/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          session_key: sessionKey, // Add session key to request body as well
          // address_id is optional - if not provided, returns all addresses for user
        }),
      });
    } catch (error) {
      console.error("Get addresses API failed:", error);
      // Return empty array as fallback instead of throwing error
      return {
        data: [],
        status: false,
        message: "Failed to fetch addresses. Please try again later.",
      };
    }
  },

  // Get a specific address by ID
  getAddressById: async (
    userId: number,
    addressId: number,
    sessionKey?: string
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<SavedAddress>("/api/get_address/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
        }),
      });
    } catch (error) {
      console.error("Get address by ID API failed:", error);
      throw new Error("Failed to fetch address. Please try again later.");
    }
  },

  // Update an existing address
  updateAddress: async (
    addressData: SaveAddressRequest & { id: number },
    sessionKey?: string
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch("/api/update_address/", {
        method: "POST",
        headers,
        body: JSON.stringify(addressData),
      });
    } catch (error) {
      console.error("Update address API failed:", error);
      throw new Error("Failed to update address. Please try again later.");
    }
  },

  // Delete an address
  deleteAddress: async (
    userId: number,
    addressId: number,
    sessionKey?: string
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch("/api/delete_address/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
        }),
      });
    } catch (error) {
      console.error("Delete address API failed:", error);
      throw new Error("Failed to delete address. Please try again later.");
    }
  },
};

// Product Review API functions
export const reviewApi = {
  addReview: async (reviewData: ProductReviewRequest, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch("/product-reviews/add/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify(reviewData),
      });
    } catch (error) {
      console.error("Add review API failed:", error);
      throw new Error("Failed to submit review. Please try again later.");
    }
  },
};

// Utility function to convert API product to legacy format
export const convertToLegacyProduct = (apiProduct: Product): LegacyProduct => {
  // Choose best available image
  const image =
    apiProduct.image_single ||
    apiProduct.image ||
    (Array.isArray(apiProduct.image_all) && apiProduct.image_all.length > 0
      ? apiProduct.image_all[0]
      : "/assets/img/green-product.png");

  // Determine pricing: prefer first tier if provided
  const firstTier = Array.isArray(apiProduct.prices) && apiProduct.prices.length > 0
    ? apiProduct.prices[0]
    : undefined;

  const price = firstTier
    ? parseFloat(firstTier.final_price)
    : parseFloat(apiProduct.discount_price || "0") || 0;

  const originalPrice = firstTier
    ? parseFloat(firstTier.mrp)
    : parseFloat(apiProduct.product_price || "0") || 0;

  const discountPercent = firstTier
    ? firstTier.discount_off_inpercent
    : apiProduct.discount_off_inpercent || "0";

  // Normalize design type to lowercase for UI switching
  const normalizedDesign = (() => {
    const dt = apiProduct.design_type;
    if (!dt) return undefined;
    const lower = (typeof dt === "string" ? dt.toLowerCase() : "") as "green" | "pink";
    return lower === "green" || lower === "pink" ? lower : undefined;
  })();

  return {
    id: parseInt(apiProduct.id),
    name: apiProduct.product_name,
    tagline: apiProduct.short_description,
    description: [apiProduct.product_description],
    price,
    originalPrice,
    discount: `${discountPercent}% Off`,
    image,
    bgColor: "#FAFAFA",
    design_type: normalizedDesign,
    // Pass-throughs
    category: apiProduct.category,
    categorykey: apiProduct.categorykey,
    brand: apiProduct.brand,
    brandkey: apiProduct.brandkey,
    product_code: apiProduct.product_code,
    sku_number: apiProduct.sku_number,
    short_description: apiProduct.short_description,
    product_description: apiProduct.product_description,
    in_stock: apiProduct.in_stock,
    image_single: apiProduct.image_single,
    image_all: apiProduct.image_all,
    prices: apiProduct.prices,
  };
};

// Export the generic apiFetch for custom use cases
export { apiFetch };
export type {
  ApiResponse,
  Product,
  LegacyProduct,
  PriceTier,
  LoginRequest,
  RegisterRequest,
  ProductsListRequest,
  AddToCartRequest,
  CartItem,
  Order,
  SaveAddressRequest,
  SavedAddress,
  ProductReviewRequest,
};
