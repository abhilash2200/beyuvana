"use client"

import HeaderText from "@/components/common/HeaderText"
import Image from "next/image"
import { PiDotOutlineFill } from "react-icons/pi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";

interface Order {
  id: string;
  productName: string;
  description: string;
  price: number;
  status: "arriving" | "cancelled" | "delivered";
  date?: string; // cancelled/delivered date
  image: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 🔹 Replace with your actual API call
    const fetchOrders = async () => {
      // Example dummy data (replace with API response)
      const data: Order[] = [
        {
          id: "78464748557",
          productName: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
          description: "Crafted with 21 synergistic, clinically studied botanicals that work from within.",
          price: 1565,
          status: "arriving",
          image: "/assets/img/product-1.png"
        },
        {
          id: "78464748558",
          productName: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
          description: "Crafted with 21 synergistic, clinically studied botanicals that work from within.",
          price: 1565,
          status: "cancelled",
          date: "22-08-2025",
          image: "/assets/img/product-2.png"
        },
        {
          id: "78464748559",
          productName: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
          description: "Crafted with 21 synergistic, clinically studied botanicals that work from within.",
          price: 1565,
          status: "delivered",
          date: "21-08-2025",
          image: "/assets/img/product-1.png"
        }
      ];
      setOrders(data);
    };

    fetchOrders();
  }, []);

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

          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block py-5 border-b border-gray-300 border-dashed hover:bg-gray-50 transition"
            >
              <div className="flex flex-wrap justify-between items-center">
                {/* Left product info */}
                <div className="w-full md:w-[40%]">
                  <div className="flex gap-3">
                    {/* Placeholder with Image inside */}
                    <div className="md:w-28 md:h-28 w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                      <Image
                        src={order.image}
                        width={120}
                        height={120}
                        alt={order.productName}
                        className="object-contain max-h-full max-w-full"
                      />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
