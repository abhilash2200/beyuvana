"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface AddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddAddressSheet({ open, onOpenChange }: AddAddressSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" aria-describedby={undefined} className="sm:max-w-md z-[1101]">
                <SheetHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} aria-label="Back to cart">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <SheetTitle className="text-lg font-semibold">Add New Address</SheetTitle>
                    </div>
                </SheetHeader>

                {/* Form fields */}
                <div className="p-4 space-y-3 overflow-y-auto">
                    <input type="text" placeholder="Street" className="w-full border rounded p-2" />
                    <input type="text" placeholder="City" className="w-full border rounded p-2" />
                    <input type="text" placeholder="Pin" className="w-full border rounded p-2" />
                    <input type="text" placeholder="Landmark" className="w-full border rounded p-2" />
                </div>

                {/* Footer */}
                <div className="p-4 border-t mt-auto">
                    <Button className="w-full" onClick={() => onOpenChange(false)}>
                        Save Address
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
