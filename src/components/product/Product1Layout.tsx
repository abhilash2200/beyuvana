"use client";

import Image from "next/image";
import { Rating } from "@mui/material";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartProvider";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Product } from "../../../app/data/fallbackProducts";

export const Product1Layout = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
        <div className="max-w-[1200px] mx-auto px-4 py-10">
            <div>
                {product.mainImage ? (
                    <Image src={product.mainImage} width={400} height={450} alt={product.name} />
                ) : (
                    <div className="w-[400px] h-[450px] bg-gray-200 flex items-center justify-center text-gray-500">
                        Image Not Available
                    </div>
                )}
            </div>

            {product.benefits?.length > 0 && product.benefits.map((b, i) => (
                <div key={i}>
                    {b.img && <Image src={b.img} width={80} height={80} alt={b.text} />}
                    <p>{b.text}</p>
                </div>
            ))}

            {product.faq?.length > 0 && product.faq.map((f, i) => (
                <div key={i}>
                    <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.question}</button>
                    {activeFaq === i && <p>{f.answer}</p>}
                </div>
            ))}

        </div>
    );
};
