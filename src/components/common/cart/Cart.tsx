"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, RefreshCw, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import Link from "next/link";
import DeliveryAddress from "../address/DeliveryAddress";
import AddAddressSheet from "../address/AddAddressSheet";
import { toast } from "react-toastify";
import React from "react";
import Confetti from "react-confetti";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Cart() {
    const { cartItems, increaseItemQuantity, decreaseItemQuantity, updateItemQuantity, refreshCart, clearCart, loading } = useCart();
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const [selectedPayment, setSelectedPayment] = React.useState<"prepaid" | "cod" | null>(null);
    const [isAddAddressOpen, setIsAddAddressOpen] = React.useState(false);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [lastIncreaseTime, setLastIncreaseTime] = React.useState<number>(0);
    const [addressRefreshKey, setAddressRefreshKey] = React.useState(0);

    const handleSheetOpenChange = () => {
        // Handle sheet open/close if needed
    };
    React.useEffect(() => {
        if (lastIncreaseTime > 0) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                toast.success("🎉 Great choice! Adding more to your cart!", {
                    position: "bottom-center",
                    autoClose: 2000,
                });
                setTimeout(() => setShowConfetti(false), 5000);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [lastIncreaseTime]);

    const handleIncreaseQuantity = (itemId: string) => {
        increaseItemQuantity(itemId);
        setLastIncreaseTime(Date.now());
    };

    return (
        <Sheet onOpenChange={handleSheetOpenChange}>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            className="relative"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-black" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#057A37] rounded-full" />
                            )}
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-800 text-white text-[12px] px-3 py-2 rounded-md shadow-xl border-0" sideOffset={8}>Open cart</TooltipContent>
            </Tooltip>
            <SheetContent
                side="right"
                aria-describedby={undefined}
                className="bg-white p-0 h-screen flex flex-col relative gap-0"
                style={{
                    zIndex: 1002,
                    width: '450px',
                    maxWidth: '90vw',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    position: 'fixed',
                    overflow: 'visible'
                }}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
            >
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                        <Confetti
                            width={450}
                            height={window.innerHeight}
                            recycle={false}
                            numberOfPieces={150}
                            gravity={0.4}
                            initialVelocityY={20}
                            initialVelocityX={5}
                            colors={['#057A37', '#0C4B33', '#1A2819', '#FFD700', '#FF6B6B']}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </div>
                )}

                <div className="shrink-0 border-b border-gray-200 bg-white">
                    <SheetHeader className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                                    Cart Details
                                </SheetTitle>
                                <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
                                <hr className="bg-[#057A37] w-28 h-0.5" />
                            </div>
                            <div className="flex gap-1 pr-12">
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={refreshCart}
                                            disabled={loading}
                                            variant="default"
                                            className="flex items-center gap-2 px-3 py-1 text-sm"
                                        >
                                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        sideOffset={10}
                                        avoidCollisions={true}
                                        className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-xl border-0"
                                        style={{ zIndex: 99999 }}
                                    >
                                        Refresh Cart
                                    </TooltipContent>
                                </Tooltip>
                                {cartItems.length > 0 && (
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={clearCart}
                                                disabled={loading}
                                                variant="default"
                                                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            sideOffset={10}
                                            avoidCollisions={true}
                                            className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-xl border-0"
                                            style={{ zIndex: 99999 }}
                                        >
                                            Clear Cart
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </SheetHeader>

                    {cartItems.length > 0 && (
                        <div className="bg-[#122014] p-3 text-sm text-center">
                            <p className="text-white">
                                Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to{" "}
                                <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                            </p>
                        </div>
                    )}
                </div>

                {
                    loading ? (
                        <div className="flex flex-1 justify-center items-center">
                            <div className="text-center text-gray-500 text-lg">
                                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                                Loading cart items...
                            </div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-1 justify-center items-center">
                            <p className="text-center text-gray-500 text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
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

                                                    <div className="flex items-center justify-between gap-2 bg-white w-36 rounded-full border border-[#057A37] px-2 py-1 overflow-hidden">
                                                        <Button
                                                            variant="default"
                                                            disabled={loading}
                                                            className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => decreaseItemQuantity(item.id)}
                                                        >
                                                            -
                                                        </Button>

                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const newQuantity = Number(e.target.value) || 1;
                                                                updateItemQuantity(item.id, newQuantity);
                                                            }}
                                                            className="w-10 text-center outline-none text-[#057A37] bg-transparent"
                                                        />

                                                        <Button
                                                            variant="default"
                                                            disabled={loading}
                                                            className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => handleIncreaseQuantity(item.id)}
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

                                <DeliveryAddress
                                    key={addressRefreshKey}
                                    onAddAddress={() => setIsAddAddressOpen(true)}
                                />
                            </div>

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
                                        <Button
                                            className="text-[#122014] font-normal text-[15px]"
                                            onClick={() => {
                                                if (cartItems.length === 0) {
                                                    toast.warning("Your cart is empty!");
                                                    return;
                                                }
                                                if (!selectedPayment) {
                                                    toast.warning("Please select a payment method!");
                                                    return;
                                                }
                                                toast.success("Proceeding to checkout...");
                                            }}
                                        >
                                            Proceed to pay
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <AddAddressSheet
                                open={isAddAddressOpen}
                                onOpenChange={setIsAddAddressOpen}
                                onAddressSaved={() => {
                                    setAddressRefreshKey(prev => prev + 1);
                                }}
                            />
                        </>
                    )
                }
            </SheetContent >
        </Sheet >
    );
}
