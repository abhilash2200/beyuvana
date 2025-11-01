/**
 * Contact API
 * Handles contact form submissions
 */

import { apiFetch, ApiResponse } from "./core";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactApi = {
  submit: async (formData: ContactFormData): Promise<ApiResponse> => {
    try {
      return await apiFetch("/contact/submit/v1/", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
    } catch (error: unknown) {
      // Extract error message if available
      if ((error as Error)?.message && (error as Error).message.includes("API error:")) {
        try {
          const errorText = (error as Error).message.split(" - ")[1];
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch {
          // Ignore parse errors
        }
      }

      throw new Error(
        "Failed to submit form. Please check your internet connection and try again."
      );
    }
  },
};

