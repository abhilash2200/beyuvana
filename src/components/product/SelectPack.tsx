"use client"
import { Rating } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";


const SelectPack = () => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [selectedPack] = useState<1 | 2 | 4>(1);

    const prices: Record<1 | 2 | 4, number> = {
        1: 1499,
        2: 2029,
        4: 3519,
    };

    const handleAddToCart = () => {
        const pack = selectedPack;
        addToCart({
            id: `select-pack-${pack}`,
            name: `Pack of ${pack}`,
            quantity: 1,
            price: prices[pack],
            image: "/assets/img/product-details/collagen-green-product.png",
        });
    };

    const handleShopNow = () => {
        handleAddToCart();
        router.push("/checkout");
    };

    return (
        <div className="border border-gray-900 rounded-[20px] p-4">
            <div className="flex items-center justify-center gap-2">
                <h3 className="md:text-[25px] text-[16px] font-[Grafiels] text-[#1A2819]">Select Pack</h3>
                <span>|</span>
                <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
                <p className="text-[12px] text-[#747474]">60 reviews</p>
            </div>
            {/* data came form api */}
            <div className="p-4 border border-gray-900 rounded-[20px]">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-[40%]">
                        <div className="flex flex-col">
                            <p className="md:text-[25px] text-[16px] uppercase text-[#1A2819] leading-tight">1 pack</p>
                            <p className="md:text-[16px] text-[13px] capitalize text-[#1A2819]">15 sachets</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[40%]">
                        <p className="md:text-[30px] text-[16px] capitalize text-[#057A37] leading-tight font-bold">₹1499</p>
                        <div className="flex items-center gap-2">
                            <p className="text-[12px] text-[#747474] line-through">₹1999</p>
                            <p className="text-[12px] text-[#D31714]">20% Off</p>
                        </div>
                    </div>
                </div>
                <p className="md:text-[18px] text-[16px] capitalize text-[#1A2819] text-center mt-5">See first glow in 2 weeks</p>
            </div>
            <div className="p-4 border border-gray-900 rounded-[20px] my-5">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-[40%]">
                        <div className="flex flex-col">
                            <p className="md:text-[25px] text-[16px] uppercase text-[#1A2819] leading-tight">2 pack</p>
                            <p className="md:text-[16px] text-[13px] capitalize text-[#1A2819]">30 sachets</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[40%]">
                        <p className="md:text-[30px] text-[16px] capitalize text-[#057A37] leading-tight font-bold">₹2029</p>
                        <div className="flex items-center gap-2">
                            <p className="text-[12px] text-[#747474] line-through">₹2899</p>
                            <p className="text-[12px] text-[#D31714]">30% Off</p>
                        </div>
                    </div>
                </div>
                <p className="md:text-[18px] text-[16px] capitalize text-[#1A2819] text-center mt-5">Best for visible results in 30 days</p>
            </div>
            <div className="p-4 border border-gray-900 rounded-[20px]">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-[40%]">
                        <div className="flex flex-col">
                            <p className="md:text-[25px] text-[16px] uppercase text-[#1A2819] leading-tight">4 pack</p>
                            <p className="md:text-[16px] text-[13px] capitalize text-[#1A2819]">60 sachets</p>
                        </div>
                    </div>
                    <div className="w-full md:w-[40%]">
                        <p className="md:text-[30px] text-[16px] capitalize text-[#057A37] leading-tight font-bold">₹3519</p>
                        <div className="flex items-center gap-2">
                            <p className="text-[12px] text-[#747474] line-through">₹5499</p>
                            <p className="text-[12px] text-[#D31714]">36% Off</p>
                        </div>
                    </div>
                </div>
                <p className="md:text-[18px] text-[16px] capitalize text-[#1A2819] text-center mt-5">Transform your skin in 60 days</p>
            </div>
            <div className="bg-[#FFE2E2] px-4 py-2 mt-5">
                <div className="flex items-center gap-2">
                    <Image src="/assets/img/product-details/sale.png" alt="pack-icon" width={20} height={20} />
                    <p className="text-[12px] text-[#1A2819]">Get Extra 5% off on Prepaid orders</p>
                </div>
            </div>
            <div className="flex gap-2 mt-2 justify-center md:justify-start">
                <Button
                    onClick={handleShopNow}
                    disabled={selectedPack !== 1}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-[#057A37] text-white border-[#057A37] ${selectedPack !== 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <ShoppingBag size={16} />
                    Buy Now
                </Button>

                <Button
                    onClick={handleAddToCart}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-white text-black border border-black hover:!border-black`}
                >
                    <ShoppingCart size={16} />
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}

export default SelectPack