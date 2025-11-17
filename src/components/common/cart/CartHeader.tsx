"use client";

import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CartHeaderProps {
    loading: boolean;
    onRefresh: () => void;
    cartItemsCount: number;
}

export function CartHeader({ loading, onRefresh, cartItemsCount }: CartHeaderProps) {
    return (
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
                                    onClick={onRefresh}
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
                    </div>
                </div>
            </SheetHeader>

            {cartItemsCount > 0 && (
                <div className="bg-[#122014] p-3 text-sm text-center">
                    <p className="text-white">
                        Get freebies worth up to <span className="font-bold text-green-600">₹500</span> & up to{" "}
                        <span className="font-bold text-green-600">₹150</span> off on all prepaid orders
                    </p>
                </div>
            )}
        </div>
    );
}

