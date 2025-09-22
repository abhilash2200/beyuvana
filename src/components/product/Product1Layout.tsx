"use client";

import Image from "next/image";
import { Rating } from "@mui/material";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartProvider";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Product } from "@/app/data/fallbackProducts";

export const Product1Layout = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
      <div className="flex flex-col md:flex-row gap-10">
        {/* Main Image */}
        <div
          style={{ backgroundColor: product.themeColor ?? "#FAFAFA" }}
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
          {product.shortdescription && (
            <p className="italic text-gray-600">{product.shortdescription}</p>
          )}

          <div className="flex items-center gap-4">
            <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
            <p className="text-sm text-gray-500">60 reviews</p>
          </div>

          {product.description.map((desc, i) => (
            <p key={i}>{desc}</p>
          ))}

          {product.descriptiontext && <p>{product.descriptiontext}</p>}

          <div className="flex items-center gap-4 mt-2">
            <h2 className="text-2xl font-bold">₹{product.price?.[1]?.toLocaleString() ?? "0"}</h2>
            <span className="line-through text-gray-500">
              ₹{product.price?.[2]?.toLocaleString() ?? "0"}
            </span>
            {product.discount && <span className="text-[#057A37] font-semibold">{product.discount}</span>}
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={handleShopNow} className="flex items-center gap-2 py-2 px-4 bg-[#057A37] text-white rounded-[10px]">
              <ShoppingBag size={16} /> Shop Now
            </Button>
            <Button onClick={handleAddToCart} className="flex items-center gap-2 py-2 px-4 bg-white border border-black rounded-[10px]">
              <ShoppingCart size={16} /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      {product.benefits?.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 border rounded-lg">
              {b.img && <Image src={b.img} width={80} height={80} alt={b.text} />}
              <p className="mt-2">{b.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* FAQ */}
      {product.faq?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
          {product.faq.map((f, i) => (
            <div key={i} className="mb-2 border-b">
              <button
                className="w-full text-left py-2 font-medium"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                {f.question}
              </button>
              {activeFaq === i && <p className="p-2 text-gray-600">{f.answer}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
