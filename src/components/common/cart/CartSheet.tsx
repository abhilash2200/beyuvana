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
    const { cartItems, increaseItemQuantity, decreaseItemQuantity, clearCart, removeFromCart } = useCart();
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);

    return (
        <SheetContent side="right" aria-describedby={undefined} className="bg-white p-4 w-full sm:max-w-md h-screen inset-y-0 right-0">
            <SheetHeader>
                <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                    Cart Details
                </SheetTitle>
                <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
                <hr className="bg-[#057A37] w-28 h-0.5" />
            </SheetHeader>

            {cartItems.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {/* Discount Info */}
                    <div className="bg-[#122014] p-3 rounded-md text-sm text-center mb-4">
                        <p className="text-white">
                            Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                        </p>
                    </div>

                    {/* Cart Items */}
                    <div className="flex flex-col gap-4 bg-[#F2F9F3] rounded-[10px] p-2">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4">
                                <div className="w-24 h-24 relative rounded-md overflow-hidden bg-gray-200">
                                    <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover w-22 h-22" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-[Grafiels] font-normal text-[15px] line-clamp-2">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" onClick={() => decreaseItemQuantity(item.id)}>-</Button>
                                            <span>{item.quantity}</span>
                                            <Button variant="outline" onClick={() => increaseItemQuantity(item.id)}>+</Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" onClick={() => removeFromCart(item.id)} aria-label="Remove item">✕</Button>
                                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Mode Section */}
                    <div className="rounded-md text-center">
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                className={`px-3 py-1.5 rounded-full hover:cursor-pointer leading-none border text-[15px] ${selectedPayment === "prepaid" ? "border-green-600 bg-green-100" : "border-gray-300"}`}
                                onClick={() => setSelectedPayment("prepaid")}
                            >
                                Prepaid
                            </button>
                            <button
                                className={`px-3 py-1.5 leading-none rounded-full hover:cursor-pointer border text-[15px] ${selectedPayment === "cod" ? "border-green-600 bg-green-100" : "border-gray-300"}`}
                                onClick={() => setSelectedPayment("cod")}
                            >
                                COD
                            </button>
                        </div>

                        {selectedPayment === "prepaid" && (
                            <div className="flex justify-center">
                                <Image src="/assets/img/prepaid-image.png" alt="Prepaid Selected" width={500} height={100} />
                            </div>
                        )}
                        {selectedPayment === "cod" && (
                            <div className="flex justify-center">
                                <Image src="/assets/img/postpaid-image.png" alt="Postpaid Selected" width={500} height={100} />
                            </div>
                        )}
                    </div>

                    {/* Delivery Address */}
                    <DeliveryAddress onAddAddress={() => setIsAddAddressOpen(true)} />

                    {/* Footer */}
                    <div className="sticky bottom-0 right-0 bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center">
                        <div>
                            <p className="text-lg font-bold">₹{total.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] text-gray-300">Delivery charges may apply on COD</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="text-white border-white" onClick={clearCart}>Clear Cart</Button>
                            <Link href="/checkout">
                                <Button className="text-[#122014] bg-white hover:bg-gray-200">Proceed to pay</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Add Address Sheet (stacked over cart) */}
                    <AddAddressSheet open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen} />
                </div>
            )}
        </SheetContent>
    );
}
