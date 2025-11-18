"use client";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { LoadingSpinner } from "../LoadingSpinner";

interface CartSummaryProps {
    total: number;
    selectedPayment: "prepaid" | "cod" | null;
    isProcessingCheckout: boolean;
    loading: boolean;
    onCheckout: () => void;
}

export function CartSummary({
    total,
    selectedPayment,
    isProcessingCheckout,
    loading,
    onCheckout,
}: CartSummaryProps) {
    return (
        <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
            <div>
                <p className="text-lg font-bold">{formatINR(total)}</p>
                {selectedPayment === "cod" && (
                    <p className="text-[10px] text-gray-300">Delivery charges may apply on COD</p>
                )}
                {selectedPayment === "prepaid" && (
                    <p className="text-[10px] text-gray-300">Free gifts added + ₹150 off</p>
                )}
                {!selectedPayment && (
                    <p className="text-[10px] text-gray-300">Select a payment method to see offers</p>
                )}
            </div>
            <div className="bg-[#FFF] px-3 py-1 rounded-full">
                <Button
                    className="text-[#122014] font-normal text-[15px] flex items-center gap-2"
                    onClick={onCheckout}
                    disabled={isProcessingCheckout || loading || !selectedPayment}
                    aria-label={selectedPayment ? "Proceed to checkout" : "Please select a payment method first"}
                >
                    {isProcessingCheckout && <LoadingSpinner size="sm" className="!flex-row" />}
                    {isProcessingCheckout ? "Processing..." : "Proceed to pay"}
                </Button>
            </div>
        </div>
    );
}

