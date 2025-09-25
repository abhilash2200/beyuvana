const API_BASE_URL = "https://beyuvana.com/api";
const PROXY_URL = "/api/proxy";

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

interface Product {
  id: string;
  category: string;
  categorykey: string;
  brand: string;
  brandkey: string;
  product_code: string;
  product_name: string;
  product_price: string;
  discount_price: string;
  discount_off_inpercent: string;
  sku_number: string;
  short_description: string;
  product_description: string;
  in_stock: string;
  image: string;
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

interface ProductsListRequest {
  category?: string;
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

// Generic API fetch function
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

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log(`🌐 Making API request to: ${url}`, { 
    config, 
    isBrowser,
    originalEndpoint: endpoint 
  });

  try {
    const response = await fetch(url, config);
    
    console.log(`📡 API Response for ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error Response:`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ API Success for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API fetch error for ${endpoint}:`, {
      error: error instanceof Error ? error.message : error,
      url,
      config,
      isBrowser
    });
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Network error: Unable to connect to ${url}. This might be a CORS issue or the server is unreachable.`);
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
      throw new Error("Login failed. Please check your internet connection and try again.");
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
      throw new Error("Registration failed. Please check your internet connection and try again.");
    }
  },
};

// Products API functions
export const productsApi = {
  getList: async (params: ProductsListRequest = {}) => {
    try {
      return await apiFetch<Product[]>("/products/lists/v1/", {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error("Products API failed:", error);
      throw new Error("Failed to fetch products. Please try again later.");
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
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/add/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify(cartData),
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
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<CartItem[]>("/cart/lists/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({}), // Empty body for cart list request
      });
    } catch (error) {
      console.error("Get cart API failed:", error);
      // Return empty array as fallback
      return { data: [], status: false, message: "Failed to fetch cart items" };
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
      throw new Error("Failed to remove item from cart. Please try again later.");
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
  getOrderList: async (sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (sessionKey) {
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
      }

      return await apiFetch<Order[]>("/order/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({}), // Empty body for order list request
      });
    } catch (error) {
      console.error("Get order list API failed:", error);
      // Return empty array as fallback instead of throwing error
      // This prevents the app from crashing when the API is not ready
      // TODO: Remove this fallback once the backend API is fully implemented
      return { 
        data: [], 
        status: false, 
        message: "Orders API is currently unavailable. The backend endpoint needs to be implemented or fixed." 
      };
    }
  },
};

// Utility function to convert API product to legacy format
export const convertToLegacyProduct = (apiProduct: Product): LegacyProduct => {
  return {
    id: parseInt(apiProduct.id),
    name: apiProduct.product_name,
    tagline: apiProduct.short_description,
    description: [apiProduct.product_description],
    price: parseFloat(apiProduct.discount_price) || 0,
    originalPrice: parseFloat(apiProduct.product_price) || 0,
    discount: `${apiProduct.discount_off_inpercent}% Off`,
    image: apiProduct.image || "/assets/img/green-product.png",
    bgColor: "#FAFAFA",
  };
};

// Export the generic apiFetch for custom use cases
export { apiFetch };
export type { ApiResponse, Product, LegacyProduct, LoginRequest, RegisterRequest, ProductsListRequest, AddToCartRequest, CartItem, Order };
