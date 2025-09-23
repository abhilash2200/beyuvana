"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PiFilePdfBold } from "react-icons/pi";
import ProductReview from "@/components/common/product/ProductReview";
import BillingPrice from "@/components/common/product/BillingPrice";

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

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

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

    useEffect(() => {
        if (!orderId) return;

        // ======= Dummy Data =======
        const orders: Order[] = [
            {
                id: "78464748557",
                productName: "BEYUVANA™ Premium Collagen Builder",
                productImage: "/assets/img/product-1.png",
                shortdecs: "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.",
                quantity: 1,
                status: "Arriving Today",
                address: "234 Block, Pioneer Road, Tagore park Road, South Dumdum",
                bagPrice: 1565,
                discount: 100,
                deliveryPrice: 50,
            },
            {
                id: "78464748558",
                productName: "BEYUVANA™ Collagen & Hyaluronic Acid",
                productImage: "/assets/img/product-2.png",
                shortdecs: "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.",
                quantity: 2,
                status: "Cancelled",
                address: "56 Green Street, Kolkata",
                bagPrice: 2000,
                discount: 200,
                deliveryPrice: 60,
            },
            {
                id: "78464748559",
                productName: "BEYUVANA™ Collagen & Hyaluronic Acid",
                productImage: "/assets/img/product-2.png",
                shortdecs: "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid.",
                quantity: 3,
                status: "Delivered",
                address: "56 Green Street, Kolkata",
                bagPrice: 2000,
                discount: 200,
                deliveryPrice: 60,
            },
        ];

        const foundOrder = orders.find((o) => o.id === orderId) || null;
        setOrder(foundOrder);
        setLoading(false);
    }, [orderId]);

    if (loading) return <div className="p-6 text-center">Loading order details...</div>;
    if (!order) return <div className="p-6 text-center text-red-600">Order not found.</div>;

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
                            src={order.productImage}
                            alt={order.productName}
                            width={120}
                            height={120}
                            className="rounded border"
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
                <ProductReview productId={order.id} />
            </div>

            {/* Billing / Price Section */}
            <BillingPrice userName={userName} order={order} />
            
            <div className="mt-4 bg-[#F2F9F3] md:p-6 p-4 rounded-[20px] shadow-sm flex items-center justify-center">
                <Button variant="link" className="text-black underline hover:cursor-pointer border border-black px-16 py-4" onClick={() => router.push("/contact")}>
                    Need Help?
                </Button>
            </div>
        </div>
    );
};

export default OrderDetailPage;
