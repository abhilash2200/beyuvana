/**
 * Authentication API
 * Handles OTP sending, registration, login, and logout
 * Note: OTP verification is handled through the login/register endpoints, not a separate verify endpoint
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type {
  SendOtpRequest,
} from "./types";

export const authApi = {
  sendOtp: async (otpData: SendOtpRequest): Promise<ApiResponse> => {
    try {
      const response = await apiFetch("/otp/send/v1/", {
        method: "POST",
        body: JSON.stringify(otpData),
      });

      return response;
    } catch (error: unknown) {

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
        "Failed to send OTP. Please check your internet connection and try again."
      );
    }
  },

  register: async (userData: { fullname: string; email: string; phonenumber: string; otp: string }): Promise<ApiResponse> => {
    try {
      const apiData = {
        fullname: userData.fullname,
        email: userData.email,
        phonenumber: userData.phonenumber,
        otp_code: userData.otp
      };

      // Log what's being sent to the backend
      console.log("🚀 Sending to backend /signup/v1/:", {
        fullname: apiData.fullname,
        email: apiData.email,
        phonenumber: apiData.phonenumber,
        otp_code: apiData.otp_code.substring(0, 2) + "****"
      });

      const response = await apiFetch("/signup/v1/", {
        method: "POST",
        body: JSON.stringify(apiData),
      });

      return response;
    } catch {
      throw new Error(
        "Registration failed. Please check your internet connection and try again."
      );
    }
  },

  login: async (loginData: { phonenumber: string; otp: string }): Promise<ApiResponse> => {
    try {
      const apiData = {
        phonenumber: loginData.phonenumber,
        otp_code: loginData.otp
      };

      return await apiFetch("/login/v1/", {
        method: "POST",
        body: JSON.stringify(apiData),
      });
    } catch {
      throw new Error(
        "Login failed. Please check your internet connection and try again."
      );
    }
  },

  logout: async (sessionKey: string, userId: string): Promise<ApiResponse> => {
    try {
      const response = await apiFetch("/logout/v1/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: JSON.stringify({ user_id: userId }),
      });

      return response;
    } catch {
      throw new Error(
        "Logout failed. Please check your internet connection and try again."
      );
    }
  },
};

