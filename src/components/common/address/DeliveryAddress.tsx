"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Address {
    id: number;
    street: string;
    city: string;
    pin: string;
    landmark: string;
}

interface DeliveryAddressProps {
    onAddAddress: () => void;
}

export default function DeliveryAddress({ onAddAddress }: DeliveryAddressProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        setTimeout(() => {
            const stored = typeof window !== "undefined" ? localStorage.getItem("addresses") : null;
            const parsed: Address[] = stored ? JSON.parse(stored) : [
                {
                    id: 1,
                    street: "22/263, Jodhpur Park, Torge park Road",
                    city: "Kolkata",
                    pin: "700045",
                    landmark: "South City Mall"
                }
            ];
            setAddresses(parsed);
            setSelectedId(parsed[0]?.id ?? null);
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("addresses", JSON.stringify(addresses));
        }
    }, [addresses]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading address...</div>;
    }

    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-md mb-[100px]">
            {addresses.length === 0 ? (
                <div className="text-center">
                    <Button onClick={onAddAddress}>Add Address</Button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">Select Delivery Address</h4>
                        <Button onClick={onAddAddress}>Add New</Button>
                    </div>
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <label key={address.id} className="flex items-start gap-3 p-3 bg-white rounded border cursor-pointer">
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedId === address.id}
                                    onChange={() => setSelectedId(address.id)}
                                    className="mt-1"
                                />
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium">{address.street}</p>
                                    <p className="text-gray-600">{address.city}, {address.pin}</p>
                                    <p className="text-gray-500">Landmark: {address.landmark}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
