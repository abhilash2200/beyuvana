import { toast } from "react-toastify";

// Standardized notification system for BEYUVANA
export const notifications = {
  // Authentication notifications
  auth: {
    loginSuccess: (name: string) => toast.success(`Welcome back, ${name}!`),
    loginError: () => toast.error("Login failed. Please check your credentials and try again."),
    registerSuccess: (name: string) => toast.success(`Welcome to BEYUVANA, ${name}! Your account has been created successfully.`),
    registerError: () => toast.error("Registration failed. Please try again."),
    logoutSuccess: () => toast.success("You have been logged out successfully."),
    sessionExpired: () => toast.warning("Your session has expired. Please login again."),
    loginRequired: () => toast.info("Please login to continue."),
  },

  // Cart notifications
  cart: {
    addSuccess: (itemName: string) => toast.success(`${itemName} added to cart!`),
    removeSuccess: (itemName: string) => toast.success(`${itemName} removed from cart!`),
    clearSuccess: () => toast.success("Your cart has been cleared successfully!"),
    updateSuccess: () => toast.success("Cart updated successfully!"),
    syncError: () => toast.error("Failed to sync with server. Please try again."),
    emptyCart: () => toast.warning("Your cart is empty!"),
    loginRequired: () => toast.info("Please login to add items to your cart."),
  },

  // Product notifications
  product: {
    packSelectionRequired: () => toast.warning("Please select a pack size first!"),
    addToCartSuccess: (productName: string, packSize: number) =>
      toast.success(`${productName} (Pack of ${packSize}) added to cart!`),
    reviewSuccess: () => toast.success("Thank you for your review! Your feedback helps other customers."),
    reviewError: () => toast.error("Failed to submit review. Please try again."),
  },

  // Order notifications
  order: {
    placeSuccess: () => toast.success("🎉 Order placed successfully! You will receive a confirmation email shortly."),
    placeError: () => toast.error("Failed to place order. Please try again."),
    statusUpdate: (status: string) => toast.info(`Order status updated to: ${status}`),
  },

  // Address notifications
  address: {
    saveSuccess: () => toast.success("Address saved successfully!"),
    updateSuccess: () => toast.success("Address updated successfully!"),
    deleteSuccess: () => toast.success("Address deleted successfully!"),
    primaryUpdateSuccess: () => toast.success("Primary address updated successfully!"),
    saveError: () => toast.error("Failed to save address. Please try again."),
    updateError: () => toast.error("Failed to update address. Please try again."),
    deleteError: () => toast.error("Failed to delete address. Please try again."),
    primaryUpdateError: () => toast.error("Failed to set primary address. Please try again."),
  },

  // Contact notifications
  contact: {
    formSuccess: () => toast.success("Form submitted successfully! We'll get back to you soon."),
    formError: () => toast.error("Failed to submit form. Please try again."),
    validationError: () => toast.error("Please fill all required fields correctly!"),
  },

  // General notifications
  general: {
    loading: (message: string) => toast.info(message),
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),
  },

  // Network/API notifications
  network: {
    connectionError: () => toast.error("Connection error. Please check your internet connection."),
    serverError: () => toast.error("Server error. Please try again later."),
    timeoutError: () => toast.error("Request timeout. Please try again."),
    unauthorized: () => toast.error("Authentication failed. Please login again."),
  },
};

// Helper function to show loading state
export const showLoading = (message: string = "Loading...") => {
  return toast.loading(message);
};

// Helper function to dismiss loading and show result
export const dismissLoading = (toastId: string, type: 'success' | 'error' | 'info', message: string) => {
  toast.dismiss(toastId);
  toast[type](message);
};

// Helper function for form validation errors
export const showValidationError = (errors: Record<string, string>) => {
  const firstError = Object.values(errors)[0];
  if (firstError) {
    toast.error(firstError);
  }
};

// Helper function for API error handling
export const handleApiError = (error: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  const apiError = error as { response?: { status: number }; code?: string; message?: string };

  if (apiError?.response?.status === 401) {
    notifications.network.unauthorized();
  } else if ((apiError?.response?.status ?? 0) >= 500) {
    notifications.network.serverError();
  } else if (apiError?.code === 'NETWORK_ERROR') {
    notifications.network.connectionError();
  } else {
    notifications.general.error(apiError?.message || "Something went wrong. Please try again.");
  }
};
