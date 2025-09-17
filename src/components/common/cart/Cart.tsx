"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CartSheet from "./CartSheet";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";

export default function Cart() {
    const { cartItems } = useCart();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="relative" aria-label="Open cart">
                    <ShoppingCart className="w-6 h-6 text-black" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#057A37] rounded-full" />
                    )}
                </Button>
            </SheetTrigger>
            <CartSheet />
        </Sheet>
    );
}
