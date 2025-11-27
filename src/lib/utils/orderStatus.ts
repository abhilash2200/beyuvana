/**
 * Order Status Utilities
 * Provides consistent status handling across the application
 * Displays all backend statuses directly without mapping
 */

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "PICKED"
    | "OUT_OF_DELIVERY"
    | "RESCHEDULED_DELIVERY"
    | "CANCELLED"
    | "ORDER_RETURN"
    | "NOT_DELIVERED"
    | "DELIVERED"
    | "COMPLETED";

export interface StatusMappingResult {
    mappedStatus: OrderStatus;
    displayStatus: string;
}

/**
 * Formats backend order status for display
 * Returns the actual backend status without mapping
 * 
 * @param backendStatus - The status from the backend API
 * @param payStatus - The payment status from the backend API (e.g., "SUCCESS", "FAILED")
 * @returns Object with mappedStatus (actual backend status) and displayStatus (formatted for UI)
 */
export function mapOrderStatus(
    backendStatus?: string | null,
    payStatus?: string | null
): StatusMappingResult {
    const backendStatusUpper = String(backendStatus ?? "").toUpperCase();
    const payStatusUpper = String(payStatus ?? "").toUpperCase();

    // If payment failed, treat as cancelled
    if (payStatusUpper === "FAILED" && !backendStatusUpper) {
        return {
            mappedStatus: "CANCELLED",
            displayStatus: "Cancelled",
        };
    }

    // Handle each backend status directly
    switch (backendStatusUpper) {
        case "PENDING":
            return {
                mappedStatus: "PENDING",
                displayStatus: "Pending",
            };
        case "CONFIRMED":
            return {
                mappedStatus: "CONFIRMED",
                displayStatus: "Confirmed",
            };
        case "SHIPPED":
            return {
                mappedStatus: "SHIPPED",
                displayStatus: "Shipped",
            };
        case "PICKED":
            return {
                mappedStatus: "PICKED",
                displayStatus: "Picked",
            };
        case "OUT_OF_DELIVERY":
            return {
                mappedStatus: "OUT_OF_DELIVERY",
                displayStatus: "Out for Delivery",
            };
        case "RESCHEDULED_DELIVERY":
            return {
                mappedStatus: "RESCHEDULED_DELIVERY",
                displayStatus: "Rescheduled Delivery",
            };
        case "CANCELLED":
            return {
                mappedStatus: "CANCELLED",
                displayStatus: "Cancelled",
            };
        case "ORDER_RETURN":
            return {
                mappedStatus: "ORDER_RETURN",
                displayStatus: "Order Returned",
            };
        case "NOT_DELIVERED":
            return {
                mappedStatus: "NOT_DELIVERED",
                displayStatus: "Not Delivered",
            };
        case "DELIVERED":
            return {
                mappedStatus: "DELIVERED",
                displayStatus: "Delivered",
            };
        case "COMPLETED":
            return {
                mappedStatus: "COMPLETED",
                displayStatus: "Completed",
            };
        default:
            // Default for unknown statuses
            return {
                mappedStatus: backendStatusUpper as OrderStatus || "PENDING",
                displayStatus: backendStatus || "Processing",
            };
    }
}

/**
 * Gets the color class for a status (for UI styling)
 */
export function getStatusColor(status: OrderStatus): string {
    switch (status) {
        case "DELIVERED":
        case "COMPLETED":
            return "text-green-500";
        case "CANCELLED":
        case "ORDER_RETURN":
        case "NOT_DELIVERED":
            return "text-red-500";
        case "PENDING":
        case "CONFIRMED":
        case "SHIPPED":
        case "PICKED":
        case "OUT_OF_DELIVERY":
        case "RESCHEDULED_DELIVERY":
        default:
            return "text-orange-500";
    }
}

