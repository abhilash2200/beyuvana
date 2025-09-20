"use client";

import React from "react";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import Link from "next/link";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";

export default function CartSheet() {
    const { cartItems, increaseItemQuantity, decreaseItemQuantity, updateItemQuantity } = useCart();
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);

    return (
        <SheetContent
            side="right"
            aria-describedby={undefined}
            className="bg-white p-0 w-full sm:max-w-md h-screen flex flex-col"
        >
            {/* Header + Discount fixed */}
            <div className="shrink-0 border-b border-gray-200">
                <SheetHeader className="p-4">
                    <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                        Cart Details
                    </SheetTitle>
                    <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
                    <hr className="bg-[#057A37] w-28 h-0.5" />
                </SheetHeader>

                {/* Discount Info */}
                {cartItems.length > 0 && (
                    <div className="bg-[#122014] p-3 text-sm text-center">
                        <p className="text-white">
                            Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to{" "}
                            <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                        </p>
                    </div>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-1 justify-center items-center">
                    <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
                </div>
            ) : (
                <>
                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                        {/* Cart Items */}
                        <div className="flex flex-col gap-4 bg-[#F2F9F3] rounded-[10px] px-2 py-3">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                    <div className="w-24 h-28 relative rounded-md overflow-hidden bg-gray-200">
                                        <Image
                                            src={item.image || "/placeholder.png"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <h3 className="font-[Grafiels] font-normal text-[15px] line-clamp-2">
                                            {item.name}
                                        </h3>

                                        {/* Quantity + Price */}
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-2">
                                                <p className="font-normal text-[14px] text-[#057A37]">
                                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                </p>
                                                <span className="text-[11px]">|</span>
                                                <p className="text-[#747474] text-[10px]">
                                                    MRP ₹ 1,499.00 <span className="text-[#057A37]">20% Off</span>
                                                </p>
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center justify-between gap-2 bg-white w-36 rounded-full border border-[#057A37] px-2 py-1 overflow-hidden">
                                                {/* - button */}
                                                <Button
                                                    variant="default"
                                                    className="text-[#057A37] text-[18px] px-2 h-6"
                                                    onClick={() => decreaseItemQuantity(item.id)}
                                                >
                                                    -
                                                </Button>

                                                {/* Input box */}
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItemQuantity(item.id, Number(e.target.value) || 1)
                                                    }
                                                    className="w-10 text-center outline-none text-[#057A37] bg-transparent"
                                                />

                                                {/* + button */}
                                                <Button
                                                    variant="default"
                                                    className="text-[#057A37] text-[18px] px-2 h-6"
                                                    onClick={() => increaseItemQuantity(item.id)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[10px] text-[#747474]">
                                                Crafted with 21 synergistic, clinically studied botanicals that work from within.
                                            </p>
                                            <p className="text-[14px] text-[#057A37]">
                                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Mode Section */}
                        <div className="rounded-md text-center">
                            <div className="flex justify-center gap-4 mb-4">
                                <button
                                    className={`px-3 py-1.5 rounded-full border text-[15px] ${selectedPayment === "prepaid"
                                        ? "border-green-600 bg-green-100"
                                        : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedPayment("prepaid")}
                                >
                                    Prepaid
                                </button>
                                <button
                                    className={`px-3 py-1.5 rounded-full border text-[15px] ${selectedPayment === "cod"
                                        ? "border-green-600 bg-green-100"
                                        : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedPayment("cod")}
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

                        {/* Delivery Address */}
                        <DeliveryAddress onAddAddress={() => setIsAddAddressOpen(true)} />
                    </div>

                    {/* Footer fixed */}
                    <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
                        <div>
                            <p className="text-lg font-bold">₹{total.toLocaleString("en-IN")}</p>
                            {selectedPayment === "cod" && (
                                <p className="text-[10px] text-gray-300">
                                    Delivery charges may apply on COD
                                </p>
                            )}
                            {selectedPayment === "prepaid" && (
                                <p className="text-[10px] text-gray-300">
                                    Free gifts added + upto ₹150 off
                                </p>
                            )}
                            {!selectedPayment && (
                                <p className="text-[10px] text-gray-300">
                                    Select a payment method to see offers
                                </p>
                            )}
                        </div>
                        <div className="bg-[#FFF] px-3 py-1 rounded-full">
                            <Link href="/checkout">
                                <Button className="text-[#122014] font-normal text-[15px]">
                                    Proceed to pay
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Add Address Sheet */}
                    <AddAddressSheet open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen} />
                </>
            )}
        </SheetContent>
    );
}
