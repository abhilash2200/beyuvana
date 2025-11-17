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
            <div className="flex justify-center gap-4 mb-4">
                <button
                    className={`px-3 py-1 rounded-full border leading-tight text-[13px] ${
                        selectedPayment === "prepaid"
                            ? "border-green-600 bg-green-100"
                            : "border-gray-300"
                    }`}
                    onClick={onSelectPrepaid}
                    aria-label="Select prepaid payment"
                >
                    Prepaid
                </button>
                <button
                    className={`px-3 py-1 rounded-full border leading-tight text-[13px] ${
                        selectedPayment === "cod" ? "border-green-600 bg-green-100" : "border-gray-300"
                    }`}
                    onClick={onSelectCOD}
                    aria-label="Select cash on delivery"
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

