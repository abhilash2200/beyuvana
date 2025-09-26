"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { addressApi, SavedAddress } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

interface DeliveryAddressProps {
  onAddAddress: () => void;
}

export default function DeliveryAddress({ onAddAddress }: DeliveryAddressProps) {
  const { user, sessionKey } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await addressApi.getAddresses(parseInt(user.id), sessionKey || undefined);

      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
        // Select the primary address or first address
        const primaryAddress = response.data.find(addr => addr.is_primary === 1);
        setSelectedId(primaryAddress?.id || response.data[0]?.id || null);
      } else {
        setAddresses([]);
        setSelectedId(null);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError("Failed to load addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, sessionKey]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading addresses...</div>;
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 rounded-md mb-[100px]">
        <div className="text-center">
          <p className="mb-2 text-red-600">{error}</p>
          <Button onClick={fetchAddresses} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-md mb-[100px]">
        <div className="text-center">
          <p className="mb-2 text-gray-600">Please login to view saved addresses</p>
          <Button onClick={onAddAddress}>Add Address</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md mb-[100px]">
      {addresses.length === 0 ? (
        <div className="text-center">
          <p className="mb-2 text-gray-600">No saved address found</p>
          <Button onClick={onAddAddress}>Add Address</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">
              Select Delivery Address
            </h4>
            <Button onClick={onAddAddress}>Add New</Button>
          </div>
          <div className="space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex items-start gap-3 p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === address.id}
                  onChange={() => setSelectedId(address.id)}
                  className="mt-1"
                />
                <div className="text-sm text-gray-700 flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">{address.fullname}</p>
                    {address.is_primary === 1 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    {address.address1}
                    {address.address2 && `, ${address.address2}`}
                  </p>
                  <p className="text-gray-600 mb-1">
                    {address.city}, {address.pincode}
                  </p>
                  <p className="text-gray-500">
                    Mobile: {address.mobile}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
