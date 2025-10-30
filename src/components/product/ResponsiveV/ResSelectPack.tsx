"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { toast } from "react-toastify";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { productsApi, type Product as ApiProduct, type PriceTier } from "@/lib/api";
import { designSlugToProductId } from "@/app/data/productConfigs";
import ProductRating from "../ProductRating";

type Pack = {
    qty: number;
    sachets: number;
    price: number;
    originalPrice: number;
    discount: string;
    tagline: string;
    product_price_id?: string;
    unit_name?: string; // Unit name from API (e.g., "Pc" for trial pack)
    isTrialPack?: boolean; // Flag to identify trial pack
};

type Product = {
    id: string;
    name: string;
    packs: Pack[];
    image: string;
    product_details?: ApiProduct; // Store the full product details from API
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
    if (!Array.isArray(prices) || prices.length === 0) return [];

    // Separate trial pack (unit_name === "Pc") from regular packs
    const trialPackTier = prices.find((tier) => tier.unit_name === "Pc");
    const regularPacksTiers = prices.filter((tier) => tier.unit_name !== "Pc");

    // Build trial pack if it exists
    const trialPack: Pack | null = trialPackTier
        ? (() => {
            const qty = Number(trialPackTier.qty);
            const mrp = parseFloat(trialPackTier.mrp || "0");
            const final = parseFloat(trialPackTier.final_price || "0");
            const discountPercent = parseFloat(trialPackTier.discount_off_inpercent || "0");

            return {
                qty,
                sachets: 5, // Trial pack always has 5 sachets
                price: Math.round(final),
                originalPrice: Math.round(mrp),
                discount: discountPercent > 0 ? `${discountPercent}% Off` : "",
                tagline: "Free Trial", // Special tagline for trial pack
                product_price_id: trialPackTier.product_price_id,
                unit_name: trialPackTier.unit_name,
                isTrialPack: true,
            } as Pack;
        })()
        : null;

    // Build regular packs
    const regularPacks = regularPacksTiers
        .map((tier) => {
            const qty = Number(tier.qty);
            const mrp = parseFloat(tier.mrp || "0");
            const final = parseFloat(tier.final_price || "0");
            const discountPercent = parseFloat(tier.discount_off_inpercent || "0");

            return {
                qty,
                sachets: getDefaultSachets(designType, qty),
                price: Math.round(final),
                originalPrice: Math.round(mrp),
                discount: discountPercent > 0 ? `${discountPercent}% Off` : "",
                tagline: getPackTagline(designType, qty),
                product_price_id: tier.product_price_id,
                unit_name: tier.unit_name,
                isTrialPack: false,
            } as Pack;
        })
        .sort((a, b) => a.qty - b.qty);

    // Return trial pack first, then regular packs sorted by quantity
    return trialPack ? [trialPack, ...regularPacks] : regularPacks;
}

const ResSelectPack = ({ productId, designType }: { productId: string; designType?: "green" | "pink" }) => {
    const { addToCart, openCart } = useCart();

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
                    packs,
                    image,
                    product_details: apiProduct, // Store the full API product details
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

    const handleAddToCart = async () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack size first!");
            return;
        }

        if (!selectedPack.product_price_id) {
            toast.error("Unable to add to cart: Missing price information. Please try again.");
            return;
        }

        const packName = selectedPack.isTrialPack
            ? `${product.name} - Trial Pack`
            : `${product.name} - Pack of ${selectedPack.qty}`;

        await addToCart({
            id: `${product.id}-${selectedPack.qty}`,
            name: packName,
            quantity: 1,
            price: selectedPack.price,
            image: product.image,
            product_id: product.id,
            mrp_price: selectedPack.originalPrice,
            discount_percent: selectedPack.discount.replace('% Off', ''),
            pack_qty: selectedPack.qty,
            product_price_id: selectedPack.product_price_id,
        });

        // Success toast is now handled by CartProvider
    };

    const handleShopNow = async () => {
        if (!product || !selectedPack) {
            toast.warning("Please select a pack size first!");
            return;
        }
        await handleAddToCart();
        openCart();
    };

    if (!product) return <p>Product not found</p>;

    return (
        <div>
            <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-[16px] font-[Grafiels] text-[#1A2819]">Select Pack</h3>
                <span>|</span>
                <ProductRating
                    productId={product.id}
                    className="text-[12px]"
                />
            </div>
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
                    {product.packs.map((pack: Pack, index) => {
                        // Check if this pack is selected (using product_price_id for accurate comparison, fallback to qty + isTrialPack)
                        const isSelected = selectedPack
                            ? (selectedPack.product_price_id && pack.product_price_id
                                ? selectedPack.product_price_id === pack.product_price_id
                                : selectedPack.qty === pack.qty && selectedPack.isTrialPack === pack.isTrialPack)
                            : false;

                        return (
                            <SplideSlide key={`${pack.qty}-${pack.isTrialPack ? 'trial' : 'regular'}-${pack.product_price_id || index}`}>
                                <div
                                    onClick={() => setSelectedPack(pack)}
                                    className={`p-3 rounded-md border cursor-pointer transition ${isSelected
                                        ? "border-2 border-[#057A37] bg-[#F0FFF5]"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <p className="text-sm font-normal text-[#1A2819] leading-tight">
                                        {pack.isTrialPack ? "Trial Pack" : `${pack.qty} Pack`} <br />
                                        <span className="text-xs text-[#747474]">
                                            {pack.sachets} Sachets
                                        </span>
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
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 bg-[#057A37] text-white w-42"
                >
                    <ShoppingBag size={16} /> Buy Now
                </Button>
                <Button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 rounded-[10px] py-2 px-4 bg-white text-black border border-black w-42"
                >
                    <ShoppingCart size={16} /> Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default ResSelectPack;