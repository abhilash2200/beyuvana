"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { addressApi, SavedAddress } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { MapPin, Plus, User, Home, RefreshCw } from "lucide-react";

interface DeliveryAddressProps {
  onAddAddress: () => void;
  onAddressSelect?: (address: SavedAddress | null) => void;
}

export default function DeliveryAddress({ onAddAddress, onAddressSelect }: DeliveryAddressProps) {
  const { user, sessionKey } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if an address is primary
  const isPrimaryAddress = (address: SavedAddress): boolean => {
    const isPrimary = address.is_primary;
    // Convert to string and check for various representations of "true" or "1"
    const primaryStr = String(isPrimary).toLowerCase();
    return isPrimary === 1 ||
      primaryStr === "1" ||
      primaryStr === "true" ||
      (typeof isPrimary === 'boolean' && isPrimary);
  };

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    if (!sessionKey) {
      console.warn("No session key available for fetching addresses");
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching addresses with:", {
        userId: user.id,
        sessionKey: sessionKey ? "Present" : "Missing"
      });

      const response = await addressApi.getAddresses(parseInt(user.id), sessionKey);

      console.log("Address fetch response:", response);

      if (response.data && Array.isArray(response.data)) {
        // Log all addresses to see their structure
        console.log("DeliveryAddress: All addresses from API:", response.data);
        response.data.forEach((addr, index) => {
          console.log(`Address ${index + 1}:`, {
            id: addr.id,
            fullname: addr.fullname,
            is_primary: addr.is_primary,
            is_primary_type: typeof addr.is_primary
          });
        });

        // Only show the primary address - check for different possible values
        const primaryAddress = response.data.find(addr => isPrimaryAddress(addr));
        console.log("DeliveryAddress: Found addresses:", response.data.length, "Primary address:", primaryAddress);

        if (primaryAddress) {
          setAddresses([primaryAddress]); // Only set the primary address
          console.log("DeliveryAddress: Set primary address as selected:", primaryAddress.fullname);
        } else {
          // If no primary address is found, show the first address as a fallback
          // This handles cases where the API doesn't have any address marked as primary
          if (response.data.length > 0) {
            console.log("DeliveryAddress: No primary address found, using first address as fallback");
            setAddresses([response.data[0]]);
          } else {
            setAddresses([]);
            console.log("DeliveryAddress: No addresses found at all");
          }
        }
      } else if (response.code === 401) {
        setError("Authentication failed. Please login again.");
        setAddresses([]);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      if (err instanceof Error && err.message.includes("401")) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to load addresses");
      }
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, sessionKey]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Notify parent when primary address is loaded
  useEffect(() => {
    if (addresses.length > 0) {
      // Since we only show the primary address, notify parent with the first (and only) address
      onAddressSelect?.(addresses[0] || null);
    } else {
      onAddressSelect?.(null);
    }
  }, [addresses, onAddressSelect]);

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 mb-[100px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200 mb-[100px]">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <p className="mb-3 text-red-700 font-medium">{error}</p>
          <Button
            onClick={fetchAddresses}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-[100px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">Please login to view and manage your saved addresses</p>
          <p className="text-sm text-gray-500 mb-4">
            After login, you can save multiple addresses and select them for delivery
          </p>
          <Button
            onClick={onAddAddress}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Login & Add Address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-[100px] overflow-hidden bg-[#FAFAFA] rounded-[20px] px-4">
      {/* Header */}
      <div className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-[#057A37] font-normal text-[15px]">Select Delivery Address</h3>
          </div>
          <Button
            onClick={onAddAddress}
            className="bg-[#057A37] px-3 py-2 text-[10px] rounded-[20px] font-normal text-white border-white/30"
          >
            {addresses.length === 0 ? "Add Address" : "Manage Addresses"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="py-2">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Address Found</h4>
            <p className="text-gray-600 mb-6">You haven&apos;t saved any delivery addresses yet. Add your first address to get started!</p>
            <Button
              onClick={onAddAddress}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start gap-2 rounded-lg p-2"
              >
                <div className="flex items-center justify-center w-5 h-5 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-normal text-gray-800 capitalize text-[13px]">{address.fullname}</p>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Delivery Address
                    </span>
                  </div>

                  <div className="space-y-1 text-[12px] text-gray-600">
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="capitalize">{address.address1}<span>{address.address2 && <span>, {address.address2}</span>},</span>{address.city}, {address.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
