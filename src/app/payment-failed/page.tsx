"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ShoppingBag, RefreshCw } from "lucide-react";

export default function PaymentFailedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="font-[Grafiels] text-[#1A2819] md:text-[42px] text-[32px] mb-4 leading-tight">
                        Payment Failed
                    </h1>
                    <p className="text-[#3B3B3B] md:text-[20px] text-[17px] font-medium mb-3">
                        We couldn&apos;t process your payment at this time.
                    </p>
                </div>

                <div className="bg-white rounded-[20px] p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
                    <p className="text-[#222222] font-light md:text-[16px] text-[15px] mb-6 leading-relaxed">
                        Your payment could not be completed. This could be due to various reasons such as insufficient funds,
                        incorrect card details, or network issues. Please try again or use a different payment method.
                    </p>

                    <div className="space-y-4 text-left">
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-[10px] border border-red-100">
                            <div className="flex-shrink-0 mt-1">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[#1A2819] text-[15px] mb-1">What happened?</p>
                                <p className="text-[#3B3B3B] font-light text-[14px]">
                                    Your payment could not be completed. The order has been automatically cancelled and no amount has been deducted from your account. You can try placing the order again.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-[#F2F9F3] rounded-[10px]">
                            <div className="flex-shrink-0 mt-1">
                                <RefreshCw className="w-5 h-5 text-[#057A37]" />
                            </div>
                            <div>
                                <p className="font-medium text-[#1A2819] text-[15px] mb-1">What can you do?</p>
                                <ul className="text-[#3B3B3B] font-light text-[14px] space-y-1 list-disc list-inside">
                                    <li>Check your payment method details</li>
                                    <li>Ensure you have sufficient balance</li>
                                    <li>Try using a different payment method</li>
                                    <li>Contact your bank if the issue persists</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Button
                        onClick={() => router.push("/")}
                        className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-8 py-4 rounded-full text-[16px] font-medium w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go to Home
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

                <div className="pt-6 border-t border-gray-200">
                    <p className="text-[#747474] text-[14px] font-light mb-2">
                        Need help with your payment?
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

