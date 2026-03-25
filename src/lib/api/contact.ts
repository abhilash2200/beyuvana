import { ApiResponse } from "./core";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  qualification?: string; // Optional field supported by backend
}

/**
 * Contact form endpoint:
 * - In production, this usually points to the root-level `sendmail.php`.
 * - For local development, it can be proxied through NEXT_PUBLIC_CONTACT_URL.
 */
const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_URL || "/sendmail.php";

export const contactApi = {
  submit: async (formData: ContactFormData): Promise<ApiResponse> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("name", formData.name.trim());
      searchParams.append("email", formData.email.trim());
      searchParams.append("phone", formData.phone.trim());
      searchParams.append("subject", formData.subject.trim());
      searchParams.append("service", formData.subject.trim()); // For backward compatibility
      searchParams.append("message", formData.message.trim());
      
      if (formData.qualification) {
        searchParams.append("qualification", formData.qualification.trim());
      }

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
      });

      // Handle non-OK responses (4xx, 5xx)
      if (!response.ok) {
        let errorMsg = "Service unavailable. Please try again later.";
        try {
          const data = await response.json();
          if (data?.message) errorMsg = data.message;
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMsg);
      }

      // Parse JSON response for successful submissions
      let result;
      try {
        result = await response.json();
      } catch {
        // Fallback for non-JSON success
        return { success: true, status: true };
      }

      // Return unified response structure
      return {
        success: result?.success !== false && result?.status !== false,
        status: result?.status !== false,
        message: result?.message || "Form submitted successfully"
      } as ApiResponse;

    } catch (error: any) {
      console.error("Contact API Error:", error);
      
      // Rethrow with a user-friendly message
      const message = error?.message || "Failed to submit form. Please check your connection.";
      throw new Error(message);
    }
  },
};
