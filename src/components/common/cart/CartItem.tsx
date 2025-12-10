"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import type { LocalCartItem } from "@/context/cart/types";

interface CartItemProps {
  item: LocalCartItem;
  index: number;
  loading: boolean;
  onRemove: (itemId: string) => void;
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function CartItem({
  item,
  index,
  loading,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div
      key={`${item.id}-${item.product_id || "no-product"}-${index}`}
      className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 relative"
    >
      <Button
        variant="ghost"
        onClick={() => onRemove(item.id)}
        disabled={loading}
        className="absolute -top-5 -right-5 border border-red-600 h-6 w-6 p-0 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed z-10 rounded-full transition-colors duration-200 cursor-pointer"
        aria-label="Remove item from cart"
      >
        <Trash2 size={14} />
      </Button>
      <div className="w-24 h-28 relative rounded-md overflow-hidden bg-gray-200">
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.name || "Product image"}
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
              {formatINR((item.price || 0) * item.quantity)}
            </p>
            <span className="text-[11px]">|</span>
            <p className="text-[#747474] text-[10px]">
              {item.mrp_price && item.discount_percent ? (
                <>
                  MRP {formatINR(item.mrp_price * item.quantity)}
                  <span className="text-[#057A37]">
                    {" "}
                    {item.discount_percent}% Off
                  </span>
                </>
              ) : (
                <span className="text-[#747474]">
                  {item.product_id ? "Loading pricing..." : "No product ID"}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 bg-white w-36 rounded-full border border-[#057A37] px-2 py-1 overflow-hidden">
            <Button
              variant="default"
              disabled={loading}
              className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#057A37] hover:text-white transition-colors duration-200"
              onClick={() => onDecreaseQuantity(item.id)}
              aria-label="Decrease quantity"
            >
              -
            </Button>

            <input
              type="number"
              min={1}
              max={10}
              value={item.quantity}
              onChange={(e) => {
                const newQuantity = Number(e.target.value) || 1;
                if (newQuantity >= 1 && newQuantity <= 10) {
                  onUpdateQuantity(item.id, newQuantity);
                }
              }}
              onBlur={(e) => {
                const newQuantity = Number(e.target.value) || 1;
                const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
                if (clampedQuantity !== item.quantity) {
                  onUpdateQuantity(item.id, clampedQuantity);
                }
              }}
              className="w-10 text-center outline-none text-[#057A37] bg-transparent focus:bg-gray-50 rounded transition-colors duration-200"
              aria-label="Item quantity"
            />

            <Button
              variant="default"
              disabled={loading}
              className="text-[#057A37] text-[18px] px-2 h-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#057A37] hover:text-white transition-colors duration-200"
              onClick={() => onIncreaseQuantity(item.id)}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-[10px] text-[#747474] line-clamp-1 w-3/4">
            {item.short_description ||
              item.product_description ||
              "Loading product details..."}
          </p>
          <p className="text-[14px] text-[#057A37]">
            ₹
            {Math.round((item.price || 0) * item.quantity).toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
