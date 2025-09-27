"use client";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { toast } from "react-toastify";

interface Pack {
    qty: number;
    sachets: number;
    price: number;
    originalPrice: number;
    discount: string;
    tagline: string;
}

interface Product {
    id: string;
    pack: string;
    name: string;
    reviews: number;
    rating: number;
    packs: Pack[];
    image: string;
}

// Dummy data outside component
const products: Record<string, Product> = {
    "collagen-green": {
        id: "collagen-green",
        pack: "Select Pack",
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
        pack: "Select Pack",
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

const SelectPack = ({ productId }: { productId: string }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

    // Simulate fetching by id
    useEffect(() => {
        const prod = products[productId];
        setProduct(prod || null);
        setSelectedPack(prod ? prod.packs[0] : null); // default pack
    }, [productId]);

    const handleAddToCart = () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack first!");
            return;
        }

        try {
            addToCart({
                id: `${product.id}-${selectedPack.qty}`,
                name: `${product.name} - Pack of ${selectedPack.qty}`,
                quantity: 1,
                price: selectedPack.price,
                image: product.image,
            });
            toast.success(`${product.name} added to cart!`);
        } catch {
            toast.error("Failed to add to cart. Please try again.");
        }
    };

    const handleShopNow = () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack first!");
            return;
        }

        try {
            handleAddToCart();
            toast.success("Redirecting to checkout...");
            router.push("/checkout");
        } catch {
            toast.error("Failed to proceed to checkout. Please try again.");
        }
    };

    if (!product) return <p>Product not found</p>;

    return (
        <div className="border border-gray-900 rounded-[20px] p-4">
            <div className="flex items-center justify-center gap-2">
                <h3 className="md:text-[25px] text-[16px] font-[Grafiels] text-[#1A2819]">
                    {product.pack}
                </h3>
                <span>|</span>
                <Rating
                    name="half-rating-read"
                    defaultValue={product.rating}
                    precision={0.5}
                    readOnly
                />
                <p className="text-[12px] text-[#747474]">{product.reviews} reviews</p>
            </div>

            {product.packs.map((pack, index) => (
                <div
                    key={pack.qty}
                    onClick={() => setSelectedPack(pack)}
                    className={`relative p-4 border rounded-[20px] my-4 cursor-pointer 
            ${selectedPack?.qty === pack.qty
                            ? "border-green-600 bg-green-100"
                            : "border-gray-900"} 
            ${index === 1 ? "border-2 border-[#057A37]" : ""} // special border for 2nd pack
        `}
                >
                    {/* Best Seller Label */}
                    {index === 1 && (
                        <p className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFAA00] text-black text-xs px-3 py-1 rounded-full shadow">
                            Best Seller
                        </p>
                    )}

                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-[40%]">
                            <p className="md:text-[25px] text-[16px] uppercase text-[#1A2819] leading-tight">
                                {pack.qty} pack
                            </p>
                            <p className="md:text-[16px] text-[13px] capitalize text-[#1A2819]">
                                {pack.sachets} sachets
                            </p>
                        </div>
                        <div className="w-full md:w-[40%]">
                            <p className="md:text-[30px] text-[16px] capitalize text-[#057A37] leading-tight font-bold">
                                ₹{pack.price}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-[12px] text-[#747474] line-through">
                                    ₹{pack.originalPrice}
                                </p>
                                <p className="text-[12px] text-[#D31714]">{pack.discount}</p>
                            </div>
                        </div>
                    </div>
                    <p className="md:text-[18px] text-[16px] capitalize text-[#1A2819] text-center mt-5">
                        {pack.tagline}
                    </p>
                </div>
            ))}


            <div className="bg-[#FFE2E2] px-4 py-2 my-5">
                <div className="flex items-center justify-center gap-2">
                    <Image
                        src="/assets/img/product-details/sale.png"
                        alt="pack-icon"
                        width={20}
                        height={20}
                    />
                    <p className="text-[12px] text-[#1A2819]">
                        Get Extra 5% off on Prepaid orders
                    </p>
                </div>
            </div>

            <div className="flex gap-4 items-center my-2 justify-center">
                <Button
                    onClick={handleShopNow}
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal bg-[#057A37] text-white"
                >
                    <ShoppingBag size={16} />
                    Buy Now
                </Button>

                <Button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal bg-white text-black border border-black"
                >
                    <ShoppingCart size={16} />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default SelectPack;
