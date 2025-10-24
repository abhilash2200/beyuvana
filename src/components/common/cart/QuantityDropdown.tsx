"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { ChevronDown } from "lucide-react";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface QuantityDropdownProps {
    itemId: string;
    currentQuantity: number;
    loading: boolean;
}

export default function QuantityDropdown({ itemId, currentQuantity, loading }: QuantityDropdownProps) {
    const { updateItemQuantity } = useCart();
    const [localQuantity, setLocalQuantity] = React.useState(currentQuantity);
    const [isCustomDialogOpen, setIsCustomDialogOpen] = React.useState(false);
    const [customQuantity, setCustomQuantity] = React.useState("");

    // Sync local quantity with prop changes
    React.useEffect(() => {
        setLocalQuantity(currentQuantity);
    }, [currentQuantity]);

    const handleQuantityChange = async (newQuantity: number) => {
        const validQuantity = Math.max(1, Math.min(99, newQuantity)); // Allow up to 99
        setLocalQuantity(validQuantity);

        if (validQuantity !== currentQuantity) {
            try {
                await updateItemQuantity(itemId, validQuantity);
            } catch (error) {
                console.error("Failed to update quantity:", error);
                // Revert on error
                setLocalQuantity(currentQuantity);
            }
        }
    };

    const handlePresetQuantity = (quantity: number) => {
        handleQuantityChange(quantity);
    };

    const handleCustomQuantitySubmit = () => {
        const quantity = parseInt(customQuantity);
        if (quantity >= 1 && quantity <= 99) {
            handleQuantityChange(quantity);
            setIsCustomDialogOpen(false);
            setCustomQuantity("");
        }
    };

    const getDisplayText = () => {
        return localQuantity.toString();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={loading}
                        className="flex items-center gap-1 bg-white border border-[#057A37] text-[#057A37] hover:bg-green-50 px-2 py-1 h-7 text-[11px] font-medium min-w-[50px] justify-between"
                    >
                        {getDisplayText()}
                        <ChevronDown size={10} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    className="w-20"
                    style={{ zIndex: 10000 }}
                    side="bottom"
                    sideOffset={5}
                    avoidCollisions={true}
                >
                    <DropdownMenuItem
                        onClick={() => handlePresetQuantity(1)}
                        className="text-center justify-center cursor-pointer"
                    >
                        1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handlePresetQuantity(2)}
                        className="text-center justify-center cursor-pointer"
                    >
                        2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handlePresetQuantity(3)}
                        className="text-center justify-center cursor-pointer"
                    >
                        3
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsCustomDialogOpen(true)}
                        className="text-center justify-center cursor-pointer text-[#057A37] font-medium"
                    >
                        More
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                <DialogContent className="sm:max-w-[300px] bg-white" style={{ zIndex: 10001 }}>
                    <DialogHeader>
                        <DialogTitle className="text-[#057A37] text-center">Enter Quantity</DialogTitle>
                        <DialogDescription>
                            Enter a custom quantity (1-99)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            type="number"
                            min="1"
                            max="99"
                            value={customQuantity}
                            onChange={(e) => setCustomQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            className="text-center text-lg bg-white"
                            autoFocus
                        />
                    </div>
                    <DialogFooter className="flex flex-row justify-center gap-2">
                        <Button
                            variant="outline"
                            className="bg-white px-2 text-[12px] text-[#057A37] hover:bg-[#057A37] hover:text-white font-normal"
                            onClick={() => {
                                setIsCustomDialogOpen(false);
                                setCustomQuantity("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCustomQuantitySubmit}
                            disabled={!customQuantity || parseInt(customQuantity) < 1 || parseInt(customQuantity) > 99}
                            className="bg-[#057A37] hover:bg-[#0C4B33] px-2 text-[12px] text-white font-normal"
                        >
                            Set Quantity
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}