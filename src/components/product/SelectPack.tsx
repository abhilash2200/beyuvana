"use client";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { toast } from "react-toastify";
import { productsApi, type Product as ApiProduct, type PriceTier } from "@/lib/api";
import { designSlugToProductId } from "@/app/data/productConfigs";

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
    name: string;
    reviews: number;
    rating: number;
    packs: Pack[];
    image: string;
}

function formatINR(value: number): string {
    const rounded = Math.round(value || 0);
    return new Intl.NumberFormat("en-IN").format(rounded);
}

function getDefaultSachets(designType: "green" | "pink" | undefined, qty: number): number {
    if (designType === "green") {
        const base = 15;
        return qty * base;
    }
    if (designType === "pink") {
        const base = 20;
        return qty * base;
    }
    return qty;
}

function getPackTagline(
    designType: "green" | "pink" | undefined,
    qty: number
): string {
    if (designType === "green") {
        if (qty === 1) return "See first glow in 2 weeks";
        if (qty === 2) return "Best for visible results in 30 days";
        if (qty === 4) return "Transform your skin in 60 days";
    }
    if (designType === "pink") {
        if (qty === 1) return "See first glow in 2 weeks";
        if (qty === 2) return "Best for visible results in 30 days";
        if (qty === 4) return "Transform your skin in 60 days";
    }
    return "";
}

function buildPacksFromPrices(
    prices: PriceTier[] | undefined,
    designType: "green" | "pink" | undefined
): Pack[] {
    if (!Array.isArray(prices)) return [];
    return prices
        .map((tier) => {
            const qty = Number(tier.qty);
            const mrp = parseFloat(tier.mrp || "0");
            const final = parseFloat(tier.final_price || "0");
            const percent = tier.discount_off_inpercent || tier.discount || "";
            const discount = percent
                ? `${String(percent).replace(/%/g, "").trim()}% Off`
                : mrp > 0 && final > 0
                    ? `${Math.round(((mrp - final) / mrp) * 100)}% Off`
                    : "";

            return {
                qty,
                sachets: getDefaultSachets(designType, qty),
                price: Math.round(isNaN(final) ? 0 : final),
                originalPrice: Math.round(isNaN(mrp) ? 0 : mrp),
                discount,
                tagline: getPackTagline(designType, qty),
            } as Pack;
        })
        .sort((a, b) => a.qty - b.qty);
}

const SelectPack = ({ productId, designType }: { productId: string; designType?: "green" | "pink" }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

    // Load from API by matching design slug -> id, fall back by name contains
    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const numericId = designSlugToProductId[productId];
                const { data } = await productsApi.getList({
                    filter: { categorykey: ["hair-care"] },
                    sort: { product_name: "ASC" },
                    page: 1,
                    limit: 100,
                });
                if (!Array.isArray(data)) return;

                let apiProduct: ApiProduct | undefined;
                if (numericId) {
                    apiProduct = data.find((p) => String(p.id) === String(numericId));
                }
                // Prefer matching by design_type when provided
                if (!apiProduct && designType) {
                    const desired = designType.toLowerCase();
                    apiProduct = data.find((p) => {
                        const dt = (p.design_type || "").toString().toLowerCase();
                        return dt === desired;
                    });
                }
                if (!apiProduct) {
                    apiProduct = data.find((p) =>
                        String(p.product_name || "").toLowerCase().includes(productId.replace(/-/g, " "))
                    );
                }
                if (!apiProduct && designType) {
                    const kw = designType === "pink" ? "glow" : "collagen";
                    apiProduct = data.find((p) => String(p.product_name || "").toLowerCase().includes(kw));
                }
                if (!apiProduct) return;

                const image = apiProduct.image_single || apiProduct.image || (Array.isArray(apiProduct.image_all) && apiProduct.image_all[0]) || "/assets/img/green-product.png";
                const packs = buildPacksFromPrices(apiProduct.prices, designType);

                const hydrated: Product = {
                    id: String(apiProduct.id),
                    name: apiProduct.product_name,
                    reviews: designType === "pink" ? 42 : 60,
                    rating: designType === "pink" ? 4 : 4.5,
                    packs,
                    image,
                };

                if (!ignore) {
                    setProduct(hydrated);
                    setSelectedPack(packs[0] || null);
                }
            } catch (e) {
                console.error("Failed to load product packs:", e);
            }
        };

        load();
        return () => {
            ignore = true;
        };
    }, [productId, designType]);

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
                product_id: product.id, // Add product_id for API integration
            });
            toast.success(`${product.name} - Pack of ${selectedPack.qty} added to cart!`);
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
                <h3 className="md:text-[25px] text-[16px] font-[Grafiels] text-[#1A2819]">Select Pack</h3>
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
                                ₹{formatINR(pack.price)}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-[12px] text-[#747474] line-through">
                                    ₹{formatINR(pack.originalPrice)}
                                </p>
                                <p className="text-[12px] text-[#D31714]">{pack.discount}</p>
                            </div>
                        </div>
                    </div>
                    <p className="md:text-[16px] text-[16px] capitalize text-[#1A2819] text-center mt-5">
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