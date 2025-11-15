"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#A9B528] opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#057A37] opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#057A37] opacity-3 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                <div className="mb-8">
                    <div className="mb-6">
                        <h1 className="font-[Grafiels] text-[#1A2819] md:text-[120px] text-[80px] leading-none mb-4">
                            404
                        </h1>
                    </div>

                    <div className="w-20 h-20 bg-[#F2F9F3] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#057A37] border-opacity-20">
                        <Leaf className="w-10 h-10 text-[#057A37]" />
                    </div>

                    <h2 className="font-[Grafiels] text-[#1A2819] md:text-[42px] text-[32px] mb-4 leading-tight">
                        Page Not Found
                    </h2>

                    <p className="text-[#3B3B3B] md:text-[18px] text-[16px] font-medium mb-2">
                        Oops! The page you&apos;re looking for seems to have grown roots elsewhere.
                    </p>
                    <p className="text-[#3B3B3B] md:text-[16px] text-[15px] font-light mb-8">
                        It might have been moved, deleted, or perhaps it never existed. Let&apos;s get you back on track!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={() => router.push("/")}
                        className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-8 py-4 rounded-full text-[16px] font-medium w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </Button>
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="border-2 border-[#057A37] text-[#057A37] hover:bg-[#057A37] hover:text-white px-8 py-4 rounded-full text-[16px] font-medium w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[#747474] text-[14px] font-light mb-3">
                        Popular pages you might be looking for:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/"
                            className="text-[#057A37] hover:underline text-[14px] font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/product"
                            className="text-[#057A37] hover:underline text-[14px] font-medium transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about-us"
                            className="text-[#057A37] hover:underline text-[14px] font-medium transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className="text-[#057A37] hover:underline text-[14px] font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

