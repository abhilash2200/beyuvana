"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface AddAddressSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddAddressSheet({ open, onOpenChange }: AddAddressSheetProps) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        pincode: "",
        landmark: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        console.log("Form Data:", form);

        // 🔹 Future API call (abhi ke liye comment kiya hai)
        /*
        try {
          const res = await fetch("/api/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
    
          if (!res.ok) throw new Error("Failed to save");
          const data = await res.json();
          console.log("Saved Address:", data);
          onOpenChange(false);
        } catch (err) {
          console.error(err);
        }
        */
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                aria-describedby={undefined}
                className="sm:max-w-md z-[1101] flex flex-col"
            >
                <SheetHeader>
                        <SheetTitle className="text-[25px] font-normal text-[#057A37] font-[Grafiels]">
                            Add New Address
                        </SheetTitle>
                        <SheetDescription className="sr-only">Add you address</SheetDescription>
                        <hr className="bg-[#057A37] w-28 h-0.5" />
                </SheetHeader>

                {/* Form fields */}
                <div className="p-4 space-y-3 overflow-y-auto">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="w-full border rounded p-2"
                        value={form.fullName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full border rounded p-2"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border rounded p-2"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address1"
                        placeholder="Address Line 1"
                        className="w-full border rounded p-2"
                        value={form.address1}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address2"
                        placeholder="Address Line 2"
                        className="w-full border rounded p-2"
                        value={form.address2}
                        onChange={handleChange}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="w-full border rounded p-2"
                            value={form.city}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            className="w-full border rounded p-2"
                            value={form.pincode}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        name="landmark"
                        placeholder="Landmark"
                        className="w-full border rounded p-2"
                        value={form.landmark}
                        onChange={handleChange}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t mt-auto">
                    <Button className="w-full" onClick={handleSave}>
                        Save Address
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
