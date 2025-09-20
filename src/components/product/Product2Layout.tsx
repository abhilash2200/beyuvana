"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartProvider";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { Product } from "../../../app/data/fallbackProducts";

export const Product2Layout = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id.toString(),
            name: product.name,
            quantity: 1,
            price: product.price?.[1] ?? 0,
            image: product.mainImage,
        });
    };

    const handleShopNow = () => {
        handleAddToCart();
        window.location.href = "/checkout";
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 bg-[#FFEAEA] rounded-lg">
            <h1 className="text-3xl font-bold text-center">{product.name}</h1>

            <div className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="md:w-1/2 flex justify-center items-center p-4">
                    <Image src={product.mainImage} width={350} height={400} alt={product.name} className="object-contain" />
                </div>

                <div className="md:w-1/2 flex flex-col justify-between">
                    <p>{product.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <h2 className="text-2xl font-bold">
                            ₹{product.price?.[1]?.toLocaleString() ?? "0"}
                        </h2>
                        <span className="line-through text-gray-500">
                            ₹{product.price?.[2]?.toLocaleString() ?? "0"}
                        </span>
                        <span className="text-[#D7003A] font-semibold">{product.discount ?? ""}</span>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleShopNow} className="flex items-center gap-2 py-2 px-4 bg-[#D7003A] text-white rounded-[10px]">
                            <ShoppingBag size={16} /> Buy Now
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
