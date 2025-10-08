"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PiFilePdfBold } from "react-icons/pi";
import ProductReview from "@/components/common/product/ProductReview";
import BillingPrice from "@/components/common/product/BillingPrice";
import { orderDetailsApi, OrderDetailsData } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

interface Order {
    id: string;
    productName: string;
    productImage: string;
    shortdecs: string;
    quantity: number;
    status: string;
    address: string;
    bagPrice: number;
    discount: number;
    deliveryPrice: number;
}

// Helper function to validate and sanitize order ID
const sanitizeOrderId = (id: string): string => {
    if (!id) return '';

    // Decode URL component and trim whitespace
    const decoded = decodeURIComponent(id).trim();

    // Remove any potentially dangerous characters but keep alphanumeric, hyphens, underscores
    const sanitized = decoded.replace(/[^a-zA-Z0-9\-_]/g, '');

    return sanitized;
};

// Helper function to handle image URLs with proper fallback
const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl || imageUrl.trim() === "") {
        return "/assets/img/product-1.png";
    }

    // If it's already a full URL or starts with /, use as is
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
        return imageUrl;
    }

    // Otherwise, assume it's a filename and prepend the assets path
    return `/assets/img/${imageUrl}`;
};

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const rawOrderId = params.id as string;
    const orderId = sanitizeOrderId(rawOrderId);
    const { user, sessionKey } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    // Retry function for failed requests
    const retryFetch = () => {
        if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setError(null);
            setLoading(true);
        }
    };

    // Get logged-in user name
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userObj = JSON.parse(storedUser);
            setUserName(userObj.name || "User");
        } else {
            setUserName("User");
        }
    }, []);

    // Fetch order details from API
    useEffect(() => {
        const fetchOrderDetails = async () => {
            // Validate order ID parameter
            if (!orderId || orderId === '') {
                setError("Invalid order ID provided");
                setLoading(false);
                return;
            }

            // Additional validation for order ID
            if (orderId.length < 1) {
                setError("Order ID is too short");
                setLoading(false);
                return;
            }

            // Check if the order ID was sanitized (indicating potentially dangerous characters)
            if (rawOrderId && sanitizeOrderId(rawOrderId) !== rawOrderId) {
                console.warn("Order ID was sanitized:", { original: rawOrderId, sanitized: orderId });
            }

            if (!user || !sessionKey) {
                setError("Please log in to view order details");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Order Details Debug:", {
                    orderId,
                    rawOrderId,
                    sanitized: orderId,
                    user: user?.id,
                    sessionKey: sessionKey ? "Present" : "Missing",
                    sessionKeyLength: sessionKey?.length || 0,
                    timestamp: new Date().toISOString()
                });

                const response = await orderDetailsApi.getOrderDetails(orderId, user?.id?.toString() || '', sessionKey);
                console.log("Order details response:", response);

                if (response && response.status && response.data) {
                    const data = response.data;
                    setOrderDetails(data);

                    // Convert API order to local format for compatibility
                    const firstItem = data.item_list[0];
                    if (firstItem) {
                        // Handle image URL with proper fallback
                        const itemImage = getImageUrl(firstItem.image);

                        // Debug logging for image URLs
                        console.log("🖼️ Order Detail Image Processing:", {
                            orderId: data.order_details.id,
                            productName: firstItem.product_name,
                            originalImage: firstItem.image,
                            finalImage: itemImage
                        });

                        const localOrder: Order = {
                            id: data.order_details.id,
                            productName: firstItem.product_name,
                            productImage: itemImage,
                            shortdecs: `${firstItem.product_name} - ${firstItem.product_code}`,
                            quantity: parseInt(firstItem.qty),
                            status: data.order_details.status === "PENDING" ? "Processing" :
                                data.order_details.status === "DELIVERED" ? "Delivered" :
                                    data.order_details.status === "CANCELLED" ? "Cancelled" : "Processing",
                            address: `${data.address.address1}, ${data.address.address2}, ${data.address.city}, ${data.address.pincode}`,
                            bagPrice: parseFloat(data.order_details.paid_amount),
                            discount: parseFloat(data.order_details.discount_amount),
                            deliveryPrice: 0, // Not provided in API
                        };
                        setOrder(localOrder);
                    } else {
                        setError("No items found in this order");
                    }
                } else {
                    setError(response?.message || "Order not found");
                }
            } catch (err) {
                console.error("Error fetching order details:", err);

                // Try to provide a more helpful error message
                if (err instanceof Error) {
                    if (err.message.includes("Order not found") || err.message.includes("404")) {
                        setError(`Order not found. The order "${orderId}" may not exist or you may not have permission to view it.`);
                    } else if (err.message.includes("Authentication failed") || err.message.includes("401")) {
                        setError("Please log in to view order details.");
                    } else if (err.message.includes("Network error") || err.message.includes("Failed to fetch")) {
                        setError("Network error. Please check your connection and try again.");
                    } else if (err.message.includes("timeout")) {
                        setError("Request timeout. The server is taking too long to respond. Please try again.");
                    } else if (err.message.includes("HTML instead of JSON") || err.message.includes("server error")) {
                        setError("Server error: The backend is returning an error page instead of order data. Please try again later or contact support.");
                    } else if (err.message.includes("Expected JSON response")) {
                        setError("Server error: Invalid response format. Please try again later.");
                    } else {
                        setError(`Failed to load order details: ${err.message}`);
                    }
                } else {
                    setError("Failed to load order details. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, user, sessionKey, retryCount, rawOrderId]);


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-10">
                    <div className="text-gray-600">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-10">
                    <div className="text-center max-w-md">
                        <div className="text-red-600">
                            <p className="text-lg font-semibold mb-2">Error</p>
                            <p>{error}</p>
                            <div className="mt-4 space-x-2">
                                <Button
                                    onClick={() => router.back()}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Go Back
                                </Button>
                                {error.includes("log in") && (
                                    <Button
                                        onClick={() => router.push("/auth")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Login
                                    </Button>
                                )}
                                {!error.includes("log in") && retryCount < 3 && (
                                    <Button
                                        onClick={retryFetch}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Retry ({3 - retryCount} left)
                                    </Button>
                                )}
                                {retryCount >= 3 && (
                                    <Button
                                        onClick={() => router.push("/orders")}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        View All Orders
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-10">
                    <div className="text-center max-w-md">
                        <div className="text-red-600">
                            <p className="text-lg font-semibold mb-2">Order Not Found</p>
                            <p>The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
                            <Button
                                onClick={() => router.back()}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "arriving today":
                return "text-orange-500";
            case "cancelled":
                return "text-red-500";
            case "delivered":
                return "text-green-500";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-10">
            {/* Top Section: Back */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="default" onClick={() => router.back()} className="text-black font-normal hover:bg-gray-100 hover:text-black">
                    ← Back To Orders
                </Button>
            </div>

            {/* Product Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b md:pb-6 pb-4">
                <div className="flex gap-4 flex-1">
                    <div className="relative md:w-28 md:h-28 w-20 h-20">
                        <Image
                            src={getImageUrl(order.productImage)}
                            alt={order.productName}
                            width={120}
                            height={120}
                            className="rounded border"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/img/product-1.png";
                            }}
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-between md:text-[18px] text-[16px]">
                        <p className="text-[10px] text-[#F24E1E] mb-1">Order ID: #{order.id}</p>
                        <h2 className="font-[Grafiels] md:text-[18px] text-[13px] md:line-clamp-2 line-clamp-1 leading-tight md:mb-2 text-[#1A2819]">{order.productName}</h2>
                        <p className="text-gray-600 md:text-[15px] text-[12px] md:mb-1 mb-0">Quantity: {order.quantity}</p>
                        <p className="text-gray-600 md:text-[15px] text-[13px] md:max-w-[70%] md:line-clamp-2 line-clamp-1">{order.shortdecs}</p>
                    </div>
                </div>
                <div className="md:block hidden">
                    <p className={`font-semibold ${getStatusColor(order.status)}`}>{order.status}</p>
                    <div className="flex items-center gap-2 text-gray-700 md:text-[18px] text-[16px]">
                        <PiFilePdfBold size={22} />
                        <span className="text-sm">Invoice</span>
                    </div>
                </div>
            </div>

            {/* Product Review */}
            <div className="py-4">
                <ProductReview productId={orderDetails?.item_list[0]?.product_id || order.id} />
            </div>



            {/* Billing / Price Section */}
            <BillingPrice userName={userName} order={order} orderDetails={orderDetails || undefined} />

            <div className="mt-4 bg-[#F2F9F3] md:p-6 p-4 rounded-[20px] shadow-sm flex items-center justify-center">
                <Button variant="link" className="text-black underline hover:cursor-pointer border border-black px-16 py-4" onClick={() => router.push("/contact")}>
                    Need Help?
                </Button>
            </div>
        </div>
    );
};

export default OrderDetailPage;
