/**
 * Invoice API
 * Handles invoice fetching
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type { InvoiceData, InvoiceRequest } from "./types";

export const invoiceApi = {
    getInvoice: async (
        userId: number,
        orderNo: string,
        sessionKey?: string
    ): Promise<ApiResponse<InvoiceData>> => {
        try {
            const requestBody: InvoiceRequest = {
                user_id: userId,
                order_no: orderNo,
            };

            const response = await apiFetch<InvoiceData>("/api/invoice", {
                method: "POST",
                headers: buildAuthHeaders(sessionKey),
                body: JSON.stringify(requestBody),
            });

            // Ensure we return the response in the correct format
            // The API returns: { status: true, message: "...", code: 200, data: {...} }
            // apiFetch should parse this correctly, but let's ensure data is properly typed
            if (response && response.status && response.data && !Array.isArray(response.data)) {
                return response as ApiResponse<InvoiceData>;
            }

            return response;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("404")) {
                    throw new Error("Invoice not found. Please check the order number.");
                } else if (error.message.includes("401")) {
                    throw new Error("Authentication failed. Please log in again.");
                } else if (error.message.includes("timeout")) {
                    throw new Error("Request timeout. Please try again.");
                } else if (error.message.includes("Failed to fetch")) {
                    throw new Error("Network error. Please check your connection.");
                }
            }

            throw new Error("Failed to fetch invoice. Please try again later.");
        }
    },
};

