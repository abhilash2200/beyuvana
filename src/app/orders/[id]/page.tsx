"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PiFilePdfBold } from "react-icons/pi";
import ProductReview from "@/components/common/product/ProductReview";
import BillingPrice from "@/components/common/product/BillingPrice";
import { orderDetailsApi, OrderDetailsData } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

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

const sanitizeOrderId = (id: string): string => {
    if (!id) return '';

    const decoded = decodeURIComponent(id).trim();

    const sanitized = decoded.replace(/[^a-zA-Z0-9\-_]/g, '');

    return sanitized;
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
    const [reviewStatus, setReviewStatus] = useState<"arriving" | "cancelled" | "delivered" | null>(null);

    const retryFetch = () => {
        if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setError(null);
            setLoading(true);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                setUserName(userObj.name || "User");
            } catch (err) {
                if (process.env.NODE_ENV === "development") {
                    console.warn("Failed to parse user from localStorage:", err);
                }
            }
        } else {
            setUserName("User");
        }
    }, []);


    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId || orderId === '') {
                setError("Invalid order ID provided");
                setLoading(false);
                return;
            }

            if (orderId.length < 1) {
                setError("Order ID is too short");
                setLoading(false);
                return;
            }

            if (rawOrderId && sanitizeOrderId(rawOrderId) !== rawOrderId && process.env.NODE_ENV === "development") {
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

                const response = await orderDetailsApi.getOrderDetails(orderId, user?.id?.toString() || '', sessionKey);

                if (response && response.status && response.data) {
                    const data = response.data;
                    setOrderDetails(data);

                    const firstItem = data.item_list[0];
                    if (firstItem) {
                        const backendStatus = String(data.order_details.status ?? "").toUpperCase();
                        const payStatus = String(data.order_details.pay_status ?? "").toUpperCase();
                        let mappedStatus: "arriving" | "cancelled" | "delivered" = "arriving";
                        let displayStatus = "Processing";

                        if (backendStatus === "DELIVERED" || backendStatus === "COMPLETED") {
                            mappedStatus = "delivered";
                            displayStatus = "Delivered";
                        } else if (backendStatus === "CANCELLED" || payStatus === "FAILED") {
                            mappedStatus = "cancelled";
                            displayStatus = "Cancelled";
                        } else if (backendStatus === "PENDING") {
                            mappedStatus = "arriving";
                            displayStatus = "Processing";
                        }

                        const localOrder: Order = {
                            id: data.order_details.id,
                            productName: firstItem.product_name,
                            productImage: data.order_details.thumbnail || firstItem.image || "",
                            shortdecs: `${firstItem.product_name} - ${firstItem.product_code}`,
                            quantity: parseInt(firstItem.qty),
                            status: displayStatus,
                            address: `${data.address.address1}, ${data.address.address2}, ${data.address.city}, ${data.address.pincode}`,
                            bagPrice: parseFloat(data.order_details.paid_amount),
                            discount: parseFloat(data.order_details.discount_amount),
                            deliveryPrice: 0,
                        };
                        setOrder(localOrder);
                        setReviewStatus(mappedStatus);
                    } else {
                        setError("No items found in this order");
                    }
                } else {
                    setError(response?.message || "Order not found");
                }
            } catch (err) {
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
            <div className="container mx-auto px-4 py-8 min-h-[400px]">
                <div className="flex justify-center items-center py-10">
                    <div className="text-gray-600">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-[400px]">
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
            <div className="container mx-auto px-4 py-8 min-h-[400px]">
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
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-8 space-y-10">
                <div className="flex items-center justify-between mb-4">
                    <Button variant="default" onClick={() => router.back()} className="text-black font-normal hover:underline hover:cursor-pointer">
                        ← Back To Orders
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 border-b md:pb-6 pb-4">
                    <div className="flex gap-4 flex-1">
                        <div className="relative md:w-28 md:h-28 w-20 h-20">
                            {order.productImage ? (
                                <Image
                                    src={order.productImage}
                                    alt={order.productName}
                                    width={120}
                                    height={120}
                                    className="rounded border"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 rounded border flex items-center justify-center">
                                    <div className="text-gray-400 text-xs text-center p-2">
                                        No Image
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col md:text-[18px] text-[16px]">
                            <p className="text-[10px] text-[#F24E1E] mb-1">Order ID: #{order.id}</p>
                            <h2 className="font-[Grafiels] md:text-[18px] text-[13px] md:line-clamp-2 line-clamp-1 leading-tight md:mb-1 text-[#1A2819]">{order.productName}</h2>
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

                <div className="py-4">
                    <ProductReview
                        productId={orderDetails?.item_list[0]?.product_id || order.id}
                        productName={order.productName}
                        orderStatus={reviewStatus || undefined}
                    />
                </div>



                <BillingPrice userName={userName} order={order} orderDetails={orderDetails || undefined} />

                <div className="mt-4 bg-[#F2F9F3] md:p-6 p-4 rounded-[20px] shadow-sm flex items-center justify-center">
                    <Button variant="link" className="text-black underline hover:cursor-pointer border border-black px-16 py-4" onClick={() => router.push("/contact")}>
                        Need Help?
                    </Button>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default OrderDetailPage;