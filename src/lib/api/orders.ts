/**
 * Orders API
 * Handles order listing and order details
 */

import { apiFetch, ApiResponse } from "./core";
import { buildAuthHeaders } from "../api-utils";
import type {
  Order,
  BackendOrderItem,
  OrderDetailsData,
} from "./types";

export const ordersApi = {
  getOrderList: async (
    sessionKey?: string,
    userId?: string,
    status: string = "PENDING"
  ): Promise<ApiResponse<Order[]>> => {
    try {
      const uid = userId ? Number(userId) : null;

      async function fetchAndMap(payload: { user_id: number | null; status?: string; session_key: string | null }): Promise<{ resp: ApiResponse<BackendOrderItem[]>; mapped: Order[] }> {
        const respLocal = await apiFetch<BackendOrderItem[]>("/api/order_list", {
          method: "POST",
          headers: buildAuthHeaders(sessionKey || undefined),
          body: JSON.stringify(payload),
        });
        
        const rawLocal = respLocal as ApiResponse<BackendOrderItem[]>;
        const listLocal: BackendOrderItem[] = Array.isArray(rawLocal?.data) 
          ? (rawLocal.data as BackendOrderItem[]) 
          : [];

        const mappedLocal: Order[] = listLocal.map((o): Order => {
          const id = String(o?.id ?? "");
          const productName = String(o?.product_name ?? o?.order_no ?? "Order");
          const description = `Order ${o?.order_no ?? id} • Qty ${o?.qty ?? "1"}`;
          const price = Math.round(parseFloat(String(o?.paid_amount ?? o?.gross_amount ?? 0)) || 0);
          const backendStatus = String(o?.status ?? "").toUpperCase();
          const payStatus = String(o?.pay_status ?? "").toUpperCase();
          const statusMapped: Order["status"] = backendStatus === "DELIVERED" || backendStatus === "COMPLETED"
            ? "delivered"
            : backendStatus === "CANCELLED" || payStatus === "FAILED"
              ? "cancelled"
              : "arriving";
          const date = String(o?.created_date ?? o?.updated_at ?? "");
          const image = o?.thumbnail || "/assets/img/product-1.png";
          const thumbnail = o?.thumbnail;
          const product_id = o?.product_id ? String(o.product_id) : undefined;

          return { id, productName, description, price, status: statusMapped, date, image, thumbnail, product_id };
        });
        
        return { resp: respLocal, mapped: mappedLocal };
      }

      // 1) Try with given status
      let { resp, mapped } = await fetchAndMap({ user_id: uid, status, session_key: sessionKey || null });
      
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
      if (error instanceof Error && error.message.includes("500")) {
        return {
          data: [],
          status: false,
          message:
            "Orders feature is currently under development. Please check back later.",
        };
      }

      if (error instanceof Error && error.message.includes("401")) {
        return {
          data: [],
          status: false,
          message: "Please log in to view your orders.",
        };
      }

      return {
        data: [],
        status: false,
        message: "Unable to load orders. Please try again later.",
      };
    }
  },
};

export const orderDetailsApi = {
  getOrderDetails: async (orderId: string, userId: string, sessionKey?: string): Promise<ApiResponse<OrderDetailsData>> => {
    try {
      const requestBody = {
        user_id: parseInt(userId),
        order_id: parseInt(orderId),
      };

      let requestBodyString: string;
      try {
        requestBodyString = JSON.stringify(requestBody);
      } catch {
        throw new Error("Failed to serialize request data");
      }

      return await apiFetch<OrderDetailsData>("/api/order_details/", {
        method: "POST",
        headers: buildAuthHeaders(sessionKey),
        body: requestBodyString,
      });
    } catch (error) {
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

