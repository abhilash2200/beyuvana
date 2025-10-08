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
import { productsApi, type Product as ApiProduct, type PriceTier } from "@/lib/api";
import { designSlugToProductId } from "@/app/data/productConfigs";

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

function formatINR(value: number): string {
    const rounded = Math.round(value || 0);
    return new Intl.NumberFormat("en-IN").format(rounded);
}

function getDefaultSachets(designType: "green" | "pink" | undefined, qty: number): number {
    if (designType === "green") {
        // Historically: 1->15, 2->30, 4->60
        const base = 15;
        return qty * base;
    }
    if (designType === "pink") {
        // Historically: 1->20, 3->60, 4->80 (fallback multiply by 20)
        const base = 20;
        return qty * base;
    }
    // Fallback if unknown
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
        if (qty === 1) return "Glow in just 10 days";
        if (qty === 2) return "Perfect for 2 months care";
        if (qty === 4) return "Perfect for 3 months care";
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

const ResSelectPack = ({ productId, designType }: { productId: string; designType?: "green" | "pink" }) => {
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

    useEffect(() => {
        let ignore = false;

        const loadProduct = async () => {
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
                // Prefer matching by design_type when provided, since backend IDs likely differ
                if (!apiProduct && designType) {
                    const desired = designType.toLowerCase();
                    apiProduct = data.find((p) => {
                        const dt = (p.design_type || "").toString().toLowerCase();
                        return dt === desired;
                    });
                }
                // Fallback: try to roughly match by name containing slug words
                if (!apiProduct) {
                    apiProduct = data.find((p) =>
                        String(p.product_name || "").toLowerCase().includes(productId.replace(/-/g, " "))
                    );
                }
                // Last resort: keyword-based guess by design type
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
                    // Defaults to keep UI consistent
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

        loadProduct();
        return () => {
            ignore = true;
        };
    }, [productId, designType]);

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
            product_id: product.id, // Add product_id for API integration
        });
        toast.success(`${product.name} - Pack of ${selectedPack.qty} added to cart!`);
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
                                        ₹{formatINR(pack.price)}
                                    </p>

                                    <div className="gap-2">
                                        <p className="text-xs text-gray-500 line-through">
                                            ₹{formatINR(pack.originalPrice)}
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