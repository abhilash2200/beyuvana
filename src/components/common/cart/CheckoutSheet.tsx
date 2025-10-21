"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Wallet } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { checkoutApi, CheckoutRequest, CheckoutCartItem, SavedAddress } from "@/lib/api";
import Image from "next/image";
import React from "react";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import { toast } from "react-toastify";

export default function CheckoutSheet({ trigger }: { trigger?: React.ReactNode }) {
    const { cartItems, loading, clearCart } = useCart();
    const { user, sessionKey } = useAuth();
    const total = Math.round(cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0));
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
    const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);
    const [selectedAddress, setSelectedAddress] = React.useState<SavedAddress | null>(null);
    const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);

    // Calculate pricing details
    const calculatePricing = () => {
        const grossAmount = cartItems.reduce((acc, item) => {
            // Use actual MRP price from the matching price tier
            const originalPrice = item.mrp_price || item.price; // Use sale price as fallback only
            return acc + (originalPrice * item.quantity);
        }, 0);

        const paidAmount = total;
        const discountAmount = Math.max(0, grossAmount - paidAmount);
        const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

        return {
            grossAmount: Math.round(grossAmount * 100) / 100,
            paidAmount: Math.round(paidAmount * 100) / 100,
            discountAmount: Math.round(discountAmount * 100) / 100,
            totalQty
        };
    };

    // Process checkout
    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        if (!selectedPayment) {
            toast.warning("Please select a payment method!");
            return;
        }
        if (!selectedAddress) {
            toast.warning("Please select a delivery address!");
            return;
        }
        if (!user || !sessionKey) {
            toast.warning("Please login to place an order!");
            return;
        }

        setIsProcessingOrder(true);
        try {
            const pricing = calculatePricing();

            // Convert cart items to checkout format
            const checkoutCartItems: CheckoutCartItem[] = cartItems.map(item => {
                const originalPrice = item.mrp_price || item.price; // Use actual MRP from API only
                const totalMrpPrice = Math.round((originalPrice * item.quantity) * 100) / 100;
                const totalSalePrice = Math.round((item.price * item.quantity) * 100) / 100;
                const discountAmount = Math.round((totalMrpPrice - totalSalePrice) * 100) / 100;

                // Safely parse product_id, ensuring it's a valid number
                const productId = item.product_id || item.id;
                const parsedProductId = typeof productId === 'string' ? parseInt(productId, 10) : Number(productId);

                if (isNaN(parsedProductId)) {
                    throw new Error(`Invalid product ID: ${productId}`);
                }

                return {
                    product_id: parsedProductId,
                    sale_price: Math.round(item.price * 100) / 100,
                    mrp_price: Math.round(originalPrice * 100) / 100,
                    sale_unit: 1,
                    qty: item.quantity,
                    total_mrp_price: totalMrpPrice,
                    total_sale_price: totalSalePrice,
                    discount_amount: discountAmount
                };
            });

            const checkoutData: CheckoutRequest = {
                cart: checkoutCartItems,
                user_id: typeof user.id === 'string' ? parseInt(user.id, 10) : Number(user.id),
                qty: pricing.totalQty,
                paid_amount: pricing.paidAmount,
                discount_amount: pricing.discountAmount,
                gross_amount: pricing.grossAmount,
                promo_amount: 0,
                total_discount: pricing.discountAmount,
                promo_code: "",
                pay_mode: selectedPayment === "prepaid" ? "Online" : "COD",
                address_id: selectedAddress.id,
                gst_amount: "",
                payment_info: {
                    pay_gateway_name: selectedPayment === "prepaid" ? "instamojo" : "cod",
                    pay_status: "",
                    txn_id: ""
                }
            };

            // Debug: Processing checkout with data

            const response = await checkoutApi.processCheckout(checkoutData, sessionKey);

            if (response.status || response.success) {
                toast.success("🎉 Order placed successfully! You will receive a confirmation email shortly.");
                // Clear cart after successful order
                await clearCart();
                // Close the checkout sheet
                window.location.reload(); // Simple way to close the sheet
            } else {
                toast.error(response.message || "Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessingOrder(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger ?? (
                    <Button className="relative" aria-label="Open checkout">
                        <Wallet className="w-5 h-5 text-black" />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent
                side="right"
                aria-describedby={undefined}
                className="bg-white p-0 h-screen flex flex-col relative gap-0"
                style={{ zIndex: 1002, width: '450px', maxWidth: '90vw', right: '0', top: '0', bottom: '0', position: 'fixed', overflow: 'visible' }}
                onOpenAutoFocus={(e) => { e.preventDefault(); }}
            >
                <div className="shrink-0 border-b border-gray-200 bg-white">
                    <SheetHeader className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                                    Checkout
                                </SheetTitle>
                                <SheetDescription className="sr-only">Complete your order</SheetDescription>
                                <hr className="bg-[#057A37] w-28 h-0.5" />
                            </div>
                        </div>
                    </SheetHeader>

                    {cartItems.length > 0 && (
                        <div className="bg-[#122014] p-3 text-sm text-center">
                            <p className="text-white">
                                Free gifts + up to <span className="font-bold text-green-600">₹150</span> off on prepaid orders
                            </p>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-1 justify-center items-center">
                        <div className="text-center text-gray-500 text-lg">Loading checkout...</div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="flex flex-1 justify-center items-center">
                        <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                            {/* Order items summary */}
                            <div className="flex flex-col gap-4 bg-[#F2F9F3] rounded-[10px] px-2 py-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                        <div className="w-20 h-24 relative rounded-md overflow-hidden bg-gray-200">
                                            <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-[Grafiels] text-[14px] line-clamp-2">{item.name}</p>
                                                <p className="text-[13px] text-[#057A37]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                            </div>
                                            <p className="text-[11px] text-[#747474] mt-1">Qty: {item.quantity}</p>
                                            {item.short_description && (
                                                <p className="text-[10px] text-[#747474] mt-1 line-clamp-1">
                                                    {item.short_description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment method */}
                            <div className="rounded-md text-center">
                                <div className="flex justify-center gap-4 mb-4">
                                    <button
                                        className={`px-3 py-1.5 rounded-full border text-[15px] ${selectedPayment === "prepaid" ? "border-green-600 bg-green-100" : "border-gray-300"}`}
                                        onClick={() => setSelectedPayment("prepaid")}
                                    >
                                        Prepaid
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-full border text-[15px] ${selectedPayment === "cod" ? "border-green-600 bg-green-100" : "border-gray-300"}`}
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

                            {/* Delivery address */}
                            <DeliveryAddress
                                key={addressRefreshKey}
                                onAddAddress={() => setIsAddAddressOpen(true)}
                                onAddressSelect={setSelectedAddress}
                            />
                        </div>

                        {/* Footer */}
                        <div className="bg-[#122014] text-white px-4 py-4 w-full flex justify-between items-center shrink-0">
                            <div>
                                <p className="text-lg font-bold">₹{total.toLocaleString("en-IN")}</p>
                                {selectedPayment === "cod" && (
                                    <p className="text-[10px] text-gray-300">Delivery charges may apply on COD</p>
                                )}
                                {selectedPayment === "prepaid" && (
                                    <p className="text-[10px] text-gray-300">Free gifts added + upto ₹150 off</p>
                                )}
                                {!selectedPayment && (
                                    <p className="text-[10px] text-gray-300">Select a payment method to see offers</p>
                                )}
                            </div>
                            <div className="bg-[#FFF] px-3 py-1 rounded-full">
                                <Button
                                    className="text-[#122014] font-normal text-[15px]"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessingOrder}
                                >
                                    {isProcessingOrder ? "Processing..." : "Place Order"}
                                </Button>
                            </div>
                        </div>
                        <AddAddressSheet
                            open={isAddAddressOpen}
                            onOpenChange={setIsAddAddressOpen}
                            onAddressSaved={() => setAddressRefreshKey(prev => prev + 1)}
                        />
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}


