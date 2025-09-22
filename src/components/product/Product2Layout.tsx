"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartProvider";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { Product } from "@/app/data/fallbackProducts";

export const Product2Layout = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price?.[1] ?? 0,
      image: product.mainImage ?? "",
    });
  };

  const handleShopNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row-reverse gap-10">
        {/* Main Image */}
        <div
          style={{ backgroundColor: product.themeColor ?? "#FFF0F5" }}
          className="p-6 rounded-lg flex justify-center items-center md:w-1/2"
        >
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              width={400}
              height={450}
              alt={product.name}
              className="object-contain"
            />
          ) : (
            <div className="w-[400px] h-[450px] bg-gray-200 flex items-center justify-center text-gray-500">
              Image Not Available
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 md:w-1/2">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {product.shortdescription && <p className="italic text-gray-600">{product.shortdescription}</p>}

          {product.description.map((d, i) => (
            <p key={i}>{d}</p>
          ))}

          {product.descriptiontext && <p>{product.descriptiontext}</p>}

          <div className="flex items-center gap-4 mt-2">
            <h2 className="text-2xl font-bold">
              ₹{product.price?.[1]?.toLocaleString() ?? "0"}
            </h2>
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={handleShopNow} className="flex items-center gap-2 py-2 px-4 bg-[#FF69B4] text-white rounded-[10px]">
              <ShoppingBag size={16} /> Shop Now
            </Button>
            <Button onClick={handleAddToCart} className="flex items-center gap-2 py-2 px-4 bg-white border border-black rounded-[10px]">
              <ShoppingCart size={16} /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
