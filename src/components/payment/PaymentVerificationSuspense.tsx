/**
 * Suspense wrapper for payment verification
 * Provides consistent loading fallback
 */

"use client";

import { Suspense } from "react";
import { PaymentVerificationContent } from "./PaymentVerificationContent";

interface PaymentVerificationSuspenseProps {
    /** Custom error message when no payment information is found */
    noPaymentInfoMessage?: string;
}

export function PaymentVerificationSuspense({
    noPaymentInfoMessage
}: PaymentVerificationSuspenseProps) {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-b from-[#F2F9F3] to-white flex items-center justify-center py-12 px-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057A37]"></div>
                </div>
            }
        >
            <PaymentVerificationContent noPaymentInfoMessage={noPaymentInfoMessage} />
        </Suspense>
    );
}

