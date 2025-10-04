"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { toast } from "react-toastify";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

type Pack = {
    qty: number;
    sachets: number;
    price: number;
    originalPrice: number;
    discount: string;
    tagline: string;
};

type Product = {
    id: string;
    name: string;
    reviews: number;
    rating: number;
    packs: Pack[];
    image: string;
};

const products: Record<string, Product> = {
    "collagen-green": {
        id: "collagen-green",
        name: "BEYUVANA™ Premium Collagen Builder— Complete Anti-Aging Solution",
        reviews: 60,
        rating: 4.5,
        packs: [
            {
                qty: 1,
                sachets: 15,
                price: 1499,
                originalPrice: 1999,
                discount: "20% Off",
                tagline: "See first glow in 2 weeks",
            },
            {
                qty: 2,
                sachets: 30,
                price: 2029,
                originalPrice: 2899,
                discount: "30% Off",
                tagline: "Best for visible results in 30 days",
            },
            {
                qty: 4,
                sachets: 60,
                price: 3519,
                originalPrice: 5499,
                discount: "36% Off",
                tagline: "Transform your skin in 60 days",
            },
        ],
        image: "/assets/img/product-details/collagen-green-product.png",
    },
    "collagen-pink": {
        id: "collagen-pink",
        name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
        reviews: 42,
        rating: 4,
        packs: [
            {
                qty: 1,
                sachets: 20,
                price: 1299,
                originalPrice: 1799,
                discount: "28% Off",
                tagline: "Glow in just 10 days",
            },
            {
                qty: 3,
                sachets: 60,
                price: 3299,
                originalPrice: 4999,
                discount: "34% Off",
                tagline: "Perfect for 2 months care",
            },
            {
                qty: 4,
                sachets: 80,
                price: 4299,
                originalPrice: 4999,
                discount: "34% Off",
                tagline: "Perfect for 3 months care",
            },
        ],
        image: "/assets/img/product-details/collagen-pink-product.png",
    },
};

const ResSelectPack = ({ productId }: { productId: string }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

    useEffect(() => {
        const prod = products[productId];
        setProduct(prod || null);
        setSelectedPack(prod ? prod.packs[0] : null);
    }, [productId]);

    const handleAddToCart = () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack first!");
            return;
        }
        addToCart({
            id: `${product.id}-${selectedPack.qty}`,
            name: `${product.name} - Pack of ${selectedPack.qty}`,
            quantity: 1,
            price: selectedPack.price,
            image: product.image,
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleShopNow = () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack first!");
            return;
        }
        handleAddToCart();
        router.push("/checkout");
    };

    if (!product) return <p>Product not found</p>;

    return (
        <div>
            <div className="md:hidden mt-4">
                <Splide
                    className="custom-splide"
                    options={{
                        perPage: 3,
                        gap: "0.75rem",
                        arrows: false,
                        pagination: false,
                        rewind: true,
                    }}
                >
                    {product.packs.map((pack: Pack) => {
                        const isSelected = selectedPack?.qty === pack.qty;
                        return (
                            <SplideSlide key={pack.qty}>
                                <div
                                    onClick={() => setSelectedPack(pack)}
                                    className={`p-3 rounded-md border cursor-pointer transition ${isSelected
                                        ? "border-2 border-[#057A37] bg-[#F0FFF5]"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <p className="text-sm font-normal text-[#1A2819] leading-tight">
                                        {pack.qty} Pack <br /> <span className="text-xs text-[#747474]">{pack.sachets} Sachets</span>
                                    </p>

                                    <p className="text-lg font-bold text-[#057A37] mt-1">
                                        ₹{pack.price}
                                    </p>

                                    <div className="gap-2">
                                        <p className="text-xs text-gray-500 line-through">
                                            ₹{pack.originalPrice}
                                        </p>
                                        
                                        <p className="text-xs text-[#D31714]">{pack.discount}</p>
                                    </div>

                                    <p className="text-xs text-green-600 mt-1">In stock</p>
                                </div>
                            </SplideSlide>
                        );
                    })}
                </Splide>
            </div>

            <div className="bg-[#FFE2E2] px-4 py-2 my-5 flex items-center justify-center gap-2">
                <Image
                    src="/assets/img/product-details/sale.png"
                    alt="pack-icon"
                    width={20}
                    height={20}
                />
                <p className="text-xs text-[#1A2819]">
                    Get Extra 5% off on Prepaid orders
                </p>
            </div>

            <div className="flex gap-4 items-center my-2 justify-center">
                <Button
                    onClick={handleShopNow}
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 bg-[#057A37] text-white"
                >
                    <ShoppingBag size={16} /> Buy Now
                </Button>
                <Button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 bg-white text-black border border-black"
                >
                    <ShoppingCart size={16} /> Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default ResSelectPack;
