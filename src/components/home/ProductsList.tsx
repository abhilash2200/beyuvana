"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { useState, useEffect } from "react";
// Removed static products import; prices and data come from API
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { productsApi } from "@/lib/api";

const packs = [1, 2, 4] as const;

interface DisplayProduct {
  id: string;
  name: string;
  shortdescription: string;
  description: string;
  descriptiontext: string;
  price: { 1: number; 2: number; 4: number };
  mrp: { 1: number; 2: number; 4: number };
  discount: { 1: string; 2: string; 4: string };
  benefits: { img: string; text: string }[];
  mainImage: string;
  product_id?: string; // For API integration
}

const ProductsList = () => {
  const { addToCart, loading, openCart } = useCart();

  // State as a map where key is product id and value is selected pack
  const [selectedPacks, setSelectedPacks] = useState<Record<string, 1 | 2 | 4>>({});
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getList({
          filter: { categorykey: ["hair-care"] },
          sort: { product_name: "ASC" },
          searchTerms: "",
          page: 1,
          limit: 10,
        });

        if (response.data && Array.isArray(response.data)) {
          // Convert API products to display format (no hardcoded prices)
          const apiProducts: DisplayProduct[] = response.data.slice(0, 2).map((apiProduct) => {
            const tiers = Array.isArray(apiProduct.prices) ? apiProduct.prices : [];

            const getTierPrice = (qty: 1 | 2 | 4): number => {
              const tier = tiers.find((t) => Number(t.qty) === Number(qty));
              const price = tier ? parseFloat(tier.final_price) : NaN;
              return isNaN(price) ? 0 : price;
            };

            const getTierMRP = (qty: 1 | 2 | 4): number => {
              const tier = tiers.find((t) => Number(t.qty) === Number(qty));
              const mrp = tier ? parseFloat(tier.mrp) : NaN;
              return isNaN(mrp) ? 0 : mrp;
            };

            const getTierDiscount = (qty: 1 | 2 | 4): string => {
              const tier = tiers.find((t) => Number(t.qty) === Number(qty));
              return tier ? tier.discount_off_inpercent : "0%";
            };

            const mainImage =
              apiProduct.image_single ||
              apiProduct.image ||
              (Array.isArray(apiProduct.image_all) && apiProduct.image_all.length > 0
                ? apiProduct.image_all[0]
                : "/assets/img/green-product.png");

            return {
              id: apiProduct.id,
              name: apiProduct.product_name,
              shortdescription: apiProduct.short_description || "",
              description: apiProduct.product_description || apiProduct.short_description || "",
              descriptiontext: apiProduct.short_description || "",
              price: {
                1: getTierPrice(1),
                2: getTierPrice(2),
                4: getTierPrice(4),
              },
              mrp: {
                1: getTierMRP(1),
                2: getTierMRP(2),
                4: getTierMRP(4),
              },
              discount: {
                1: getTierDiscount(1),
                2: getTierDiscount(2),
                4: getTierDiscount(4),
              },
              benefits: [],
              mainImage,
              product_id: apiProduct.id,
            };
          });

          setDisplayProducts(apiProducts);
        } else {
          setDisplayProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setDisplayProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectPack = (productId: string, pack: 1 | 2 | 4) => {
    setSelectedPacks((prev) => ({
      ...prev,
      [productId]: pack,
    }));
  };

  const handleAddToCart = async (product: DisplayProduct) => {
    const selectedPack: 1 | 2 | 4 = selectedPacks[product.id] ?? 1;

    await addToCart({
      id: `${product.id}-${selectedPack}`,
      name: `${product.name} - Pack of ${selectedPack}`,
      quantity: 1,
      price: product.price[selectedPack],
      image: product.mainImage,
      product_id: product.product_id || product.id, // Use product_id for API integration
      // Pre-populate with correct MRP and discount data
      mrp_price: product.mrp[selectedPack],
      discount_percent: product.discount[selectedPack],
      short_description: product.shortdescription,
    });
  };

  const handleShopNow = async (product: DisplayProduct) => {
    await handleAddToCart(product);
    openCart();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {displayProducts.map((product: DisplayProduct, index: number) => {
        const isEven = index % 2 === 0;

        // Get the selected pack for this product or default to 1
        const selectedPack = selectedPacks[product.id] || 1;

        return (
          <div
            key={product.id}
            className={`px-4 md:px-0 ${index % 2 !== 0 ? "w-full bg-[#FAFAFA]" : ""}`}
          >
            <div
              className={`flex flex-wrap justify-between items-center gap-6 max-w-[1400px] mx-auto py-6 ${index % 2 !== 0 ? "flex-row-reverse" : ""
                }`}
            >
              {/* Product Image */}
              <div className="w-full md:w-[28%]">
                <div className="flex items-center justify-center">
                  <Image
                    src={product.mainImage}
                    width={418}
                    height={481}
                    alt={product.name}
                    className="w-[80%] md:w-full md:h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full md:w-[68%] flex flex-col gap-4">
                <h2 className="text-[#1A2819] font-[Grafiels] md:text-[30px] text-[20px] leading-tight mb-2">
                  {product.name}
                </h2>

                {index === 0 && (
                  <div>
                    <p className="inline-flex border border-black rounded-[5px] py-2 px-2 font-light">
                      {product.shortdescription}
                    </p>
                  </div>
                )}

                <p className="font-light">{product.description}</p>

                {index === 1 && (
                  <div className="mb-3">
                    <p className="font-light">{product.descriptiontext}</p>
                  </div>
                )}

                {/* Benefits */}
                <div className="flex flex-wrap justify-between gap-4 mb-3">
                  {product.benefits.map((b, i) => (
                    <div
                      key={i}
                      className={`w-[20%] ${i !== product.benefits.length - 1 ? "border-r border-black" : ""
                        } pr-2`}
                    >
                      <Image src={b.img} width={83} height={83} alt={`Benefit ${i + 1}`} />
                      <p className="hidden md:block">{b.text}</p>
                    </div>
                  ))}
                </div>

                {/* Pack Selection */}
                <div className="flex flex-wrap md:flex-row gap-2 items-center mt-2">
                  <p className="font-light">
                    Select
                    <br />
                    Pack:
                    <br />
                  </p>
                  {packs.map((pack) => {
                    const isSelected = selectedPack === pack;

                    // Product-specific colors
                    const colors = isEven
                      ? {
                        selected: "bg-[#057A37] text-white border-[#057A37]",
                        unselected: "bg-[#DFF5E6] text-[#057A37] border-[#057A37]",
                      }
                      : {
                        selected: "bg-[#B00404] text-white border-[#B00404]",
                        unselected: "bg-[#F5DADA] text-[#B00404] border-[#B00404]",
                      };

                    return (
                      <Button
                        key={pack}
                        onClick={() => handleSelectPack(product.id, pack)}
                        className={`rounded-[10px] py-2 px-4 border font-semibold transition-colors ${isSelected ? colors.selected : colors.unselected
                          }`}
                      >
                        <span className="text-[10px] pr-3">Pack {pack}</span> ₹
                        {Math.round(product.price[pack]).toLocaleString()}
                      </Button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2 justify-center md:justify-start">
                  <Button
                    onClick={() => handleShopNow(product)}
                    disabled={selectedPack !== 1 || loading}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-[#057A37] text-white border-[#057A37] ${selectedPack !== 1 || loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <ShoppingBag size={16} />
                    {loading ? "Processing..." : "Buy Now"}
                  </Button>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={loading}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-white text-black border border-black hover:!border-black disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ShoppingCart size={16} />
                    {loading ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
