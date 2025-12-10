/**
 * Shared payment verification component
 * Used by both payment-initial and payment-initiate pages
 */

"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";

interface PaymentVerificationContentProps {
  /** Custom error message when no payment information is found */
  noPaymentInfoMessage?: string;
}

export function PaymentVerificationContent({
  noPaymentInfoMessage,
}: PaymentVerificationContentProps) {
  const router = useRouter();
  const { status, errorMessage } = usePaymentVerification({
    noPaymentInfoMessage,
  });

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="font-[Grafiels] text-[#1A2819] text-[28px] mb-2">
                Payment Verification Failed
              </h1>
              <p className="text-[#3B3B3B] text-[15px] mb-6">{errorMessage}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/")}
                className="bg-[#057A37] hover:bg-[#0C4B33] text-white px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300"
              >
                Go to Home
              </button>
              <button
                onClick={() => router.push("/orders")}
                className="border-2 border-[#057A37] text-[#057A37] hover:bg-[#057A37] hover:text-white px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300"
              >
                Check My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
          <Loader2 className="w-12 h-12 text-[#057A37] animate-spin mx-auto mb-4" />
          <h1 className="font-[Grafiels] text-[#1A2819] text-[28px] mb-2">
            Verifying Payment
          </h1>
          <p className="text-[#3B3B3B] text-[15px]">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    </div>
  );
}
