"use client"

import HeaderText from "@/components/common/HeaderText"
import Image from "next/image"
import { PiDotOutlineFill } from "react-icons/pi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ordersApi, Order } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, sessionKey } = useAuth();


  // Add test function for navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>).testOrderNavigation = (orderId?: string) => {
        const testId = orderId || (orders.length > 0 ? orders[0].id : '81');
        const encodedId = encodeURIComponent(testId);
        const url = `/orders/${encodedId}`;

        console.log("🧪 Testing Order Navigation:", {
          orderId: testId,
          encodedId,
          url,
          ordersCount: orders.length
        });

        // Navigate to the order detail page
        window.location.href = url;
        return { orderId: testId, url };
      };
    }
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !sessionKey) {
          setError("Please log in to view your orders");
          toast.warning("Please log in to view your orders");
          return;
        }

        const response = await ordersApi.getOrderList(sessionKey, user?.id, "Upcoming");

        console.log("Orders API response:", response);

        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);

          if (response.data.length === 0) {
            // Don't show toast for empty orders, just show the message
            console.log("No orders found");
          } else {
            toast.success(`Found ${response.data.length} orders`);
          }
        } else {
          setError(response.message || "Failed to fetch orders");
          // Only show toast for actual errors, not for "under development" messages
          if (response.message && !response.message.includes("under development")) {
            toast.error(response.message);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, sessionKey]);

  const getStatusUI = (status: Order["status"], date?: string) => {
    switch (status) {
      case "arriving":
        return (
          <p className="inline-flex items-center gap-x-1">
            <PiDotOutlineFill className="w-10 h-10 text-orange-500" /> Arriving Today
          </p>
        );
      case "cancelled":
        return (
          <p className="inline-flex items-center gap-x-1">
            <PiDotOutlineFill className="w-10 h-10 text-red-500" /> Cancelled {date}
          </p>
        );
      case "delivered":
        return (
          <p className="inline-flex items-center gap-x-1">
            <PiDotOutlineFill className="w-10 h-10 text-green-500" /> Delivered {date}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-y-3 mb-5">
          <HeaderText
            textalign="text-left"
            heading="My Orders"
            textcolor="text-[#1A2819]"
          />

          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-600">Loading your orders...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-10">
              <div className="text-center max-w-md">
                {error.includes("under development") ? (
                  <div className="text-orange-600">
                    <p className="text-lg font-semibold mb-2">🚧 Feature Coming Soon</p>
                    <p>{error}</p>
                    <Link href="/product" className="text-blue-600 underline mt-2 block">
                      Browse our products instead
                    </Link>
                  </div>
                ) : error.includes("log in") ? (
                  <div className="text-red-600">
                    <p>{error}</p>
                    <Link href="/auth" className="text-blue-600 underline mt-2 block">
                      Please log in to view your orders
                    </Link>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-blue-600 underline mt-2 block"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-600 text-center">
                <p>No orders found</p>
                <Link href="/product" className="text-blue-600 underline mt-2 block">
                  Browse our products
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && orders.map((order) => {
            // Validate order ID before creating link
            const orderId = order.id?.trim();
            if (!orderId) {
              console.warn("Order missing ID:", order);
              return null;
            }

            return (
              <Link
                key={order.id}
                href={`/orders/${encodeURIComponent(orderId)}`}
                className="block py-5 border-b border-gray-300 border-dashed hover:bg-gray-50 transition"
              >
                <div className="flex flex-wrap justify-between items-center">
                  {/* Left product info */}
                  <div className="w-full md:w-[40%]">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="md:w-28 md:h-28 w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                        {order.thumbnail ? (
                          <Image
                            src={order.thumbnail}
                            width={120}
                            height={120}
                            alt={order.productName}
                            className="object-contain max-h-full max-w-full"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center p-2">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <p className="text-[10px] text-[#F24E1E] mb-1">Order ID: #{order.id}</p>
                        <h2 className="font-[Grafiels] md:text-[18px] text-[16px] md:line-clamp-2 line-clamp-1 leading-tight mb-1 text-[#1A2819]">{order.productName}</h2>
                        <p className="text-gray-600 md:text-[15px] text-[13px] line-clamp-2">{order.description}</p>
                      </div>
                      <div className="flex items-center justify-center md:hidden">
                        <span><FaChevronRight className="text-black" /></span>
                      </div>
                    </div>

                  </div>

                  {/* Price */}
                  <div className="w-full md:w-[20%] hidden md:block">
                    <p className="font-semibold">₹{order.price.toFixed(2)}</p>
                  </div>

                  {/* Status */}
                  <div className="w-full md:w-[20%] hidden md:block">
                    {getStatusUI(order.status, order.date)}
                  </div>


                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;