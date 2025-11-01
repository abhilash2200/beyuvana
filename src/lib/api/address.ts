/**
 * Address API
 * Handles address CRUD operations
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type {
    SaveAddressRequest,
    SavedAddress,
} from "./types";

export const addressApi = {
    saveAddress: async (addressData: SaveAddressRequest, sessionKey?: string): Promise<ApiResponse> => {
        try {
            const requestData = {
                user_id: addressData.user_id,
                fullname: addressData.fullname,
                address1: addressData.address1,
                address2: addressData.address2 || "",
                mobile: addressData.mobile,
                email: addressData.email,
                city: addressData.city,
                pincode: addressData.pincode,
                is_primary: addressData.is_primary,
                session_key: sessionKey,
            };

            return await apiFetch("/api/save_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify(requestData),
            });
        } catch {
            throw new Error("Failed to save address. Please try again later.");
        }
    },

    getAddresses: async (userId: number, sessionKey?: string): Promise<ApiResponse<SavedAddress[]>> => {
        try {
            return await apiFetch<SavedAddress[]>("/api/get_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify({
                    user_id: userId,
                    session_key: sessionKey,
                }),
            });
        } catch {
            return {
                data: [],
                status: false,
                message: "Failed to fetch addresses. Please try again later.",
            };
        }
    },

    getAddressById: async (
        userId: number,
        addressId: number,
        sessionKey?: string
    ): Promise<ApiResponse<SavedAddress>> => {
        try {
            return await apiFetch<SavedAddress>("/api/get_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify({
                    user_id: userId,
                    address_id: addressId,
                }),
            });
        } catch {
            throw new Error("Failed to fetch address. Please try again later.");
        }
    },

    updateAddress: async (
        addressData: SaveAddressRequest & { id: number },
        sessionKey?: string
    ): Promise<ApiResponse> => {
        try {
            const requestData = {
                user_id: addressData.user_id,
                fullname: addressData.fullname,
                address1: addressData.address1,
                address2: addressData.address2 || "",
                mobile: addressData.mobile,
                email: addressData.email,
                city: addressData.city,
                pincode: addressData.pincode,
                is_primary: addressData.is_primary,
                address_id: addressData.id,
                session_key: sessionKey,
            };

            return await apiFetch("/api/update_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify(requestData),
            });
        } catch {
            throw new Error("Failed to update address. Please try again later.");
        }
    },

    deleteAddress: async (
        userId: number,
        addressId: number,
        sessionKey?: string
    ): Promise<ApiResponse> => {
        try {
            const requestData = {
                user_id: userId,
                address_id: addressId,
                session_key: sessionKey,
            };

            return await apiFetch("/api/delete_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify(requestData),
            });
        } catch {
            throw new Error("Failed to delete address. Please try again later.");
        }
    },

    setPrimaryAddress: async (
        userId: number,
        addressId: number,
        sessionKey?: string
    ): Promise<ApiResponse> => {
        try {
            return await apiFetch("/api/set_primary_address/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify({
                    user_id: userId,
                    address_id: addressId,
                    session_key: sessionKey,
                }),
            });
        } catch {
            throw new Error("Failed to set primary address. Please try again later.");
        }
    },

    getAddressDetails: async (
        userId: number,
        addressId: number,
        sessionKey?: string
    ): Promise<ApiResponse<SavedAddress>> => {
        try {
            return await apiFetch<SavedAddress>("/api/get_address_details/", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify({
                    user_id: userId,
                    address_id: addressId,
                    session_key: sessionKey,
                }),
            });
        } catch {
            throw new Error("Failed to fetch address details. Please try again later.");
        }
    },
};

