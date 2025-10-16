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

// Product Details API response interface
interface ProductDetailsResponse {
  total_star_ratting: string;
  id: string;
  categorykey: string;
  category: string;
  product_code: string;
  product_name: string;
  product_price: string;
  discount_price: string;
  discount_off_inpercent: string;
  sku_number: string;
  short_description: string;
  product_description: string;
  in_stock: string;
  image: string[];
  prices?: PriceTier[];
  my_review: ProductReview[];
  review: ProductReview[];
}

interface ProductReview {
  id: string;
  product_id: string;
  customer_logo: string;
  customer_name: string;
  review: string;
  created_id: string;
  created_on: string;
  status: string;
  review_added_by: string;
  user_id: string;
  star_ratting: string;
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
  price_qty?: number;
  price_unit_name?: string;
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
  thumbnail?: string; // Direct image URL from API
  product_id?: string; // Add product_id for better product matching
}

// Raw order shape from backend
interface BackendOrderItem {
  id?: string | number;
  user_id?: string | number;
  status?: string;
  pay_status?: string;
  created_date?: string;
  order_no?: string;
  paid_amount?: string | number;
  gross_amount?: string | number;
  qty?: string | number;
  product_name?: string;
  product_id?: string | number;
  updated_at?: string;
  thumbnail?: string; // Direct image URL from API
}

interface SaveAddressRequest {
  user_id: number;
  fullname: string;
  address1: string;
  address2: string; // Required by API, but can be empty string
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

// Order Details API interfaces
interface OrderDetailsItem {
  product_code: string;
  product_name: string;
  sku_number: string;
  image: string;
  id: string;
  user_id: string;
  product_id: string;
  sale_price: string;
  sale_unit: string;
  qty: string;
  mrp_price: string;
  total_mrp_price: string;
  total_sale_price: string;
  discount_amount: string;
  created_at: string;
  created_date: string;
  updated_at: string;
  order_id: string;
  rate_star: string;
  review: string | null;
  review_date: string | null;
  gst_amount: string;
}

interface OrderDetailsAddress {
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  fullname: string;
  email: string;
  mobile: string;
}

interface OrderDetailsPayment {
  id: string;
  order_no: string;
  pay_gateway_name: string;
  payment_request_id: string;
  txn_id: string;
  txn_date: string;
  pay_status: string;
  paid_amount: string;
  created_at: string;
  updated_at: string;
  other_info: string;
  user_id: string;
}

interface OrderDetailsData {
  order_details: {
    id: string;
    user_id: string;
    txn_id: string;
    status: string;
    pay_status: string;
    created_date: string;
    order_no: string;
    paid_amount: string;
    discount_amount: string;
    gross_amount: string;
    promo_amount: string;
    promo_code: string;
    qty: string;
    pay_mode: string;
    pay_gateway_name: string;
    session_key: string;
    awb_no: string | null;
    courier_name: string | null;
    created_at: string;
    updated_at: string;
    total_discount: string;
    gst_amount: string;
    gst_no: string | null;
    address_id: string;
    completed_date: string | null;
    remarks: string | null;
    thumbnail: string; // Direct image URL from API
    shipment_shipment_id: string;
    shipment_order_id: string;
    payment_app_type: string;
    payment_redirect_url: string;
  };
  item_list: OrderDetailsItem[];
  address: OrderDetailsAddress;
  payment_details: OrderDetailsPayment;
}

// Checkout API interfaces
interface CheckoutCartItem {
  product_id: number;
  sale_price: number;
  mrp_price: number;
  sale_unit: number;
  qty: number;
  total_mrp_price: number;
  total_sale_price: number;
  discount_amount: number;
}

interface PaymentInfo {
  pay_gateway_name: string;
  pay_status: string;
  txn_id: string;
}

interface CheckoutRequest {
  cart: CheckoutCartItem[];
  user_id: number;
  qty: number;
  paid_amount: number;
  discount_amount: number;
  gross_amount: number;
  promo_amount: number;
  total_discount: number;
  promo_code: string;
  pay_mode: string;
  address_id: number;
  gst_amount: string;
  payment_info: PaymentInfo;
}

// Product review list types
export interface ProductReviewItem {
  id: number;
  user_name: string;
  review: string;
  star_ratting: number;
  created_at?: string;
}

export type ReviewsListResponse = {
  reviews: ProductReviewItem[];
};

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


  try {

    const response = await fetch(url, config);
    clearTimeout(timeoutId);


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Check if response is JSON before trying to parse
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');


    // Always read the response as text first to validate content
    const responseText = await response.text();


    // Check if response body is actually HTML despite content-type claims
    if (responseText.trim().startsWith('<') || responseText.includes('<html') || responseText.includes('<div')) {
      throw new Error(
        `Backend returned HTML error page instead of JSON data. This indicates a server error. Status: ${response.status}`
      );
    }

    if (!isJson) {

      throw new Error(
        `Expected JSON response but got ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}`
      );
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(
        `Failed to parse JSON response. The server may be returning invalid JSON or HTML. Error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
      );
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout: API call to ${endpoint} took too long`);
    }


    // Provide more specific error messages
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${url}. This might be a CORS issue or the server is unreachable.`
      );
    }

    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timeout: API call to ${endpoint} took too long (15s timeout)`
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
  getDetails: async (productId: string | number, userId?: string | number) => {
    try {
      return await apiFetch<ProductDetailsResponse>("/products/details/v1/", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
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
  addToCart: async (
    cartData: AddToCartRequest & { price_qty?: number; price_unit_name?: string },
    sessionKey?: string,
    userId?: string | number
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Broad header coverage (match getCart/orders/get_address)
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      const payload = {
        user_id: userId != null ? Number(userId) : undefined,
        product_id: Number(cartData.product_id),
        qty: Number(cartData.quantity),
        price_qty: cartData.price_qty ?? 0,
        price_unit_name: cartData.price_unit_name ?? "",
      };

      return await apiFetch<CartItem[]>("/cart/add/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
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

  updateCart: async (cartData: AddToCartRequest, sessionKey?: string, userId?: string | number) => {
    // This endpoint doesn't exist yet, use add to cart instead
    console.warn("Update cart API not implemented yet, using add to cart");
    return await cartApi.addToCart(cartData, sessionKey, userId);
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

// Order Details API functions
export const orderDetailsApi = {
  getOrderDetails: async (orderId: string, userId: string, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Use sessionkey header as shown in the API documentation
        headers["sessionkey"] = sessionKey;
      }

      const requestBody = {
        user_id: parseInt(userId),
        order_id: parseInt(orderId),
      };


      // Validate request body before sending
      let requestBodyString;
      try {
        requestBodyString = JSON.stringify(requestBody);
        if (isDevelopment) {
          // Debug: Sending order details request
        }
      } catch (jsonError) {
        console.error("❌ Failed to serialize request body:", {
          error: jsonError,
          requestBody,
          orderId
        });
        throw new Error("Failed to serialize request data");
      }

      return await apiFetch<OrderDetailsData>("/api/order_details/", {
        method: "POST",
        headers,
        body: requestBodyString,
      });
    } catch (error) {
      // Enhanced error logging for order details
      console.error("Order details API failed:", {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        errorType: typeof error,
        errorString: String(error),
        orderId,
        userId,
        sessionKeyPresent: !!sessionKey,
        timestamp: new Date().toISOString()
      });

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          throw new Error("Order not found. Please check the order ID.");
        } else if (error.message.includes("401")) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (error.message.includes("timeout")) {
          throw new Error("Request timeout. Please try again.");
        } else if (error.message.includes("Failed to fetch")) {
          throw new Error("Network error. Please check your connection.");
        }
      }

      throw new Error("Failed to fetch order details. Please try again later.");
    }
  },
};

// Orders API functions
export const ordersApi = {
  getOrderList: async (sessionKey?: string, userId?: string, status: string = "PENDING") => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Broad header coverage (match cart/get_address behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        console.log("🔑 Orders API Debug - Session Key:", sessionKey);
        console.log("🔑 Session Key Type:", typeof sessionKey);
        console.log("🔑 Session Key Length:", sessionKey?.length || 0);
        console.log("🔑 Headers being sent:", headers);
      }

      const uid = userId ? Number(userId) : null;

      async function fetchAndMap(payload: { user_id: number | null; status?: string; session_key: string | null }) {
        if (isDevelopment) {
          console.log("🔑 fetchAndMap - Payload session_key:", payload.session_key);
          console.log("🔑 fetchAndMap - Full payload:", payload);
        }
        
        const respLocal = await apiFetch<BackendOrderItem[]>("/api/order_list", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        const rawLocal = respLocal as ApiResponse<BackendOrderItem[]>;
        const listLocal: BackendOrderItem[] = Array.isArray(rawLocal?.data) ? (rawLocal.data as BackendOrderItem[]) : [];

        // Debug: Log the raw backend response to see what fields are available
        const mappedLocal: Order[] = listLocal.map((o): Order => {
          const id = String(o?.id ?? "");
          const productName = String(o?.product_name ?? o?.order_no ?? "Order");
          const description = `Order ${o?.order_no ?? id} • Qty ${o?.qty ?? "1"}`;
          const price = parseFloat(String(o?.paid_amount ?? o?.gross_amount ?? 0)) || 0;
          const backendStatus = String(o?.status ?? "").toUpperCase();
          const payStatus = String(o?.pay_status ?? "").toUpperCase();
          const statusMapped: Order["status"] = backendStatus === "DELIVERED" || backendStatus === "COMPLETED"
            ? "delivered"
            : backendStatus === "CANCELLED" || payStatus === "FAILED"
              ? "cancelled"
              : "arriving";
          const date = String(o?.created_date ?? o?.updated_at ?? "");
          // Use thumbnail from API response, fallback to default image
          const image = o?.thumbnail || "/assets/img/product-1.png";
          const thumbnail = o?.thumbnail;
          const product_id = o?.product_id ? String(o.product_id) : undefined;

          // Debug: Order mapping

          return { id, productName, description, price, status: statusMapped, date, image, thumbnail, product_id };
        });
        return { resp: respLocal, mapped: mappedLocal } as { resp: ApiResponse<BackendOrderItem[]>; mapped: Order[] };
      }

      // 1) Try with given status
      let { resp: resp, mapped } = await fetchAndMap({ user_id: uid, status, session_key: sessionKey || null });
      // Note: response mapped below from subsequent fetches if needed
      // 2) If empty, try without status
      if (mapped.length === 0) {
        const result = await fetchAndMap({ user_id: uid, session_key: sessionKey || null });
        resp = result.resp;
        mapped = result.mapped;
      }

      // 3) If still empty, swap between "PENDING" and "Upcoming"
      if (mapped.length === 0) {
        const alt = status?.toUpperCase() === "Upcoming" ? "PENDING" : "Upcoming";
        const result = await fetchAndMap({ user_id: uid, status: alt, session_key: sessionKey || null });
        resp = result.resp;
        mapped = result.mapped;
      }
      return { ...resp, data: mapped } as ApiResponse<Order[]>;
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
        // Broad header coverage (match cart/orders behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        // Debug: Save Address API Debug
      }

      // Ensure all required fields are present
      const requestData = {
        user_id: addressData.user_id,
        fullname: addressData.fullname,
        address1: addressData.address1,
        address2: addressData.address2 || "", // Explicitly ensure address2 is present
        mobile: addressData.mobile,
        email: addressData.email,
        city: addressData.city,
        pincode: addressData.pincode,
        is_primary: addressData.is_primary,
        session_key: sessionKey,
      };

      // Debug: API Request Data

      return await apiFetch("/api/save_address/", {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
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
        // Broad header coverage - match cart/orders behavior
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations some backends expect
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers - Force show for debugging

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
        // Broad header coverage (match other address API behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        // Debug: Update Address API Debug
      }

      // Ensure all required fields are present with correct field names
      const requestData = {
        user_id: addressData.user_id,
        fullname: addressData.fullname,
        address1: addressData.address1,
        address2: addressData.address2 || "", // Ensure address2 is present
        mobile: addressData.mobile,
        email: addressData.email,
        city: addressData.city,
        pincode: addressData.pincode,
        is_primary: addressData.is_primary,
        address_id: addressData.id, // Use address_id instead of id
        session_key: sessionKey, // Add session key to request body as well
      };

      // Debug: API Update Request Data

      return await apiFetch("/api/update_address/", {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
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
        // Broad header coverage (match other address API behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        // Debug: Delete Address API Debug
      }

      const requestData = {
        user_id: userId,
        address_id: addressId,
        session_key: sessionKey, // Add session key to request body as well
      };

      // Debug: API Delete Request Data

      return await apiFetch("/api/delete_address/", {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      });
    } catch (error) {
      console.error("Delete address API failed:", error);
      throw new Error("Failed to delete address. Please try again later.");
    }
  },

  // Set primary address
  setPrimaryAddress: async (
    userId: number,
    addressId: number,
    sessionKey?: string
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Broad header coverage (match other address API behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        // Debug: Set Primary Address API Debug
      }

      return await apiFetch("/api/set_primary_address/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
          session_key: sessionKey, // Add session key to request body as well
        }),
      });
    } catch (error) {
      console.error("Set primary address API failed:", error);
      throw new Error("Failed to set primary address. Please try again later.");
    }
  },

  // Get address details by ID
  getAddressDetails: async (
    userId: number,
    addressId: number,
    sessionKey?: string
  ) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Broad header coverage (match other address API behavior)
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["sessionkey"] = sessionKey;
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for headers
      if (isDevelopment) {
        // Debug: Get Address Details API Debug
      }

      return await apiFetch<SavedAddress>("/api/get_address_details/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
          session_key: sessionKey, // Add session key to request body as well
        }),
      });
    } catch (error) {
      console.error("Get address details API failed:", error);
      throw new Error("Failed to fetch address details. Please try again later.");
    }
  },
};

// Checkout API functions
export const checkoutApi = {
  processCheckout: async (checkoutData: CheckoutRequest, sessionKey?: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Use sessionkey header as shown in the curl example
        headers["sessionkey"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["session_key"] = sessionKey;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for checkout API
      if (isDevelopment) {
        // Debug: Checkout API Debug
      }

      return await apiFetch("/api/checkout/", {
        method: "POST",
        headers,
        body: JSON.stringify(checkoutData),
      });
    } catch (error) {
      console.error("Checkout API failed:", error);
      throw new Error("Failed to process checkout. Please try again later.");
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
        // Use comprehensive header coverage like other API functions
        headers["sessionkey"] = sessionKey;
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      // Debug logging for review API
      if (isDevelopment) {
        // Debug: Review API Debug
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
  getReviews: async (
    productId: number,
    sessionKey?: string
  ): Promise<ApiResponse<ReviewsListResponse>> => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionKey) {
        // Use comprehensive header coverage like other API functions
        headers["sessionkey"] = sessionKey;
        headers["session_key"] = sessionKey;
        headers["Authorization"] = `Bearer ${sessionKey}`;
        headers["X-Session-Key"] = sessionKey;
        headers["X-Auth-Token"] = sessionKey;
        headers["X-API-Key"] = sessionKey;
        headers["token"] = sessionKey;
        headers["auth-token"] = sessionKey;
        headers["Session-Key"] = sessionKey;
        headers["Auth-Token"] = sessionKey;
        headers["API-Key"] = sessionKey;
        // More variations
        headers["session-key"] = sessionKey;
        headers["authkey"] = sessionKey;
        headers["auth_key"] = sessionKey;
        headers["apikey"] = sessionKey;
        headers["api_key"] = sessionKey;
        headers["access_token"] = sessionKey;
        headers["access-token"] = sessionKey;
        // Authorization without Bearer
        headers["Authorization"] = sessionKey;
        headers["X-Authorization"] = sessionKey;
        headers["X-Token"] = sessionKey;
        headers["X-Access-Token"] = sessionKey;
      }

      return await apiFetch<ReviewsListResponse>("/product-reviews/lists/v1/", {
        method: "POST",
        headers,
        body: JSON.stringify({ product_id: productId }),
      });
    } catch (error) {
      console.error("Get reviews API failed:", error);
      // Return empty structure on failure to avoid UI crash
      return {
        data: { reviews: [] },
        status: false,
        message: "Failed to fetch reviews",
      } as ApiResponse<ReviewsListResponse>;
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
  ProductDetailsResponse,
  ProductReview,
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
  CheckoutRequest,
  CheckoutCartItem,
  PaymentInfo,
  OrderDetailsData,
  OrderDetailsItem,
  OrderDetailsAddress,
  OrderDetailsPayment,
};
