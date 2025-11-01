"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Mail, Home, ShoppingBag } from "lucide-react";
import Confetti from "react-confetti";

function ThankYouContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showConfetti, setShowConfetti] = useState(true);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const orderIdParam = searchParams.get("orderId");
        if (orderIdParam) {
            setOrderId(orderIdParam);
        }

        let updateSize: (() => void) | null = null;
        if (typeof window !== "undefined") {
            updateSize = () => {
                setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            };
            updateSize();
            window.addEventListener("resize", updateSize);
        }

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined" && updateSize) {
                window.removeEventListener("resize", updateSize);
            }
        };
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {showConfetti && windowSize.width > 0 && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                />
            )}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#A9B528] opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#057A37] opacity-5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">

                <h1 className="font-[Grafiels] text-[#1A2819] md:text-[42px] text-[32px] mb-4 leading-tight">
                    Thank You for Your Order!
                </h1>

                <p className="text-[#3B3B3B] md:text-[20px] text-[17px] font-medium mb-3">
                    Your plant-powered wellness journey starts here.
                </p>

                {orderId && (
                    <div className="mb-6 inline-block bg-white border border-[#057A37] rounded-full px-6 py-2">
                        <p className="text-[#057A37] text-sm font-medium">
                            Order ID: <span className="font-semibold">#{orderId}</span>
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-[20px] p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
                    <p className="text-[#222222] font-light md:text-[16px] text-[15px] mb-6 leading-relaxed">
                        We&apos;re thrilled that you&apos;ve chosen BEYUVANA™ to support your wellness journey. Your order has been
                        successfully placed and will be processed shortly.
                    </p>

                    <div className="space-y-4 text-left">
                        <div className="flex items-start gap-4 p-4 bg-[#F2F9F3] rounded-[10px]">
                            <div className="flex-shrink-0 mt-1">
                                <Mail className="w-5 h-5 text-[#057A37]" />
                            </div>
                            <div>
                                <p className="font-medium text-[#1A2819] text-[15px] mb-1">Check Your Email</p>
                                <p className="text-[#3B3B3B] font-light text-[14px]">
                                    We&apos;ve sent a confirmation email with your order details and tracking information.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-[#F2F9F3] rounded-[10px]">
                            <div className="flex-shrink-0 mt-1">
                                <Package className="w-5 h-5 text-[#057A37]" />
                            </div>
                            <div>
                                <p className="font-medium text-[#1A2819] text-[15px] mb-1">Order Processing</p>
                                <p className="text-[#3B3B3B] font-light text-[14px]">
                                    Your order will be carefully packed and shipped within 2-3 business days. You&apos;ll receive tracking
                                    updates via email and SMS.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#F2F9F3] rounded-[15px] p-6 mb-8 border border-[#A9B528] border-opacity-20">
                    <p className="text-[#1A2819] font-[Grafiels] md:text-[22px] text-[18px] mb-2">
                        90-Day Money-Back Guarantee
                    </p>
                    <p className="text-[#222222] font-light md:text-[15px] text-[14px]">
                        We stand by the quality of our plant-powered formulations. If you&apos;re not completely satisfied, we offer
                        a full refund within 90 days of your first purchase.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={() => router.push("/")}
                        className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-8 py-4 rounded-full text-[16px] font-medium w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Continue Shopping
                    </Button>
                    <Button
                        onClick={() => router.push("/orders")}
                        variant="outline"
                        className="border-2 border-[#057A37] text-[#057A37] hover:bg-[#057A37] hover:text-white px-8 py-4 rounded-full text-[16px] font-medium w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        View My Orders
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[#747474] text-[14px] font-light mb-2">
                        Need help with your order?
                    </p>
                    <Link
                        href="/contact"
                        className="text-[#057A37] hover:underline text-[14px] font-medium transition-colors"
                    >
                        Contact Our Support Team
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057A37]"></div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
