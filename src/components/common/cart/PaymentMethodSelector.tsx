"use client";

import Image from "next/image";

interface PaymentMethodSelectorProps {
    selectedPayment: "prepaid" | "cod" | null;
    onSelectPrepaid: () => void;
    onSelectCOD: () => void;
}

export function PaymentMethodSelector({
    selectedPayment,
    onSelectPrepaid,
    onSelectCOD,
}: PaymentMethodSelectorProps) {
    return (
        <div className="rounded-md text-center">
            <div className="flex justify-center gap-4 mb-4" role="radiogroup" aria-label="Payment method">
                <button
                    type="button"
                    className={`px-3 py-1 rounded-full border leading-tight text-[13px] transition-colors focus:outline-none focus:ring-0 focus:ring-[#057A37] focus:ring-offset-0 ${selectedPayment === "prepaid"
                        ? "border-green-600 bg-green-100"
                        : "border-gray-300 hover:border-green-400"
                        }`}
                    onClick={onSelectPrepaid}
                    aria-label="Select prepaid payment"
                    aria-checked={selectedPayment === "prepaid"}
                    role="radio"
                >
                    Prepaid
                </button>
                <button
                    type="button"
                    className={`px-3 py-1 rounded-full border leading-tight text-[13px] transition-colors focus:outline-none focus:ring-0 focus:ring-[#057A37] focus:ring-offset-0 ${selectedPayment === "cod" ? "border-green-600 bg-green-100" : "border-gray-300 hover:border-green-400"
                        }`}
                    onClick={onSelectCOD}
                    aria-label="Select cash on delivery"
                    aria-checked={selectedPayment === "cod"}
                    role="radio"
                >
                    COD
                </button>
            </div>

            {selectedPayment === "prepaid" && (
                <div className="flex justify-center">
                    <Image src="/assets/img/prepaid-image.png" alt="Prepaid" width={500} height={100} />
                </div>
            )}
            {selectedPayment === "cod" && (
                <div className="flex justify-center">
                    <Image src="/assets/img/postpaid-image.png" alt="COD" width={500} height={100} />
                </div>
            )}
        </div>
    );
}

