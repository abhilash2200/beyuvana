"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { useState, useEffect } from "react";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { productsApi } from "@/lib/api";
import type { Product, PriceTier } from "@/lib/api";
import { products as staticProducts } from "@/app/data/products";
import { toast } from "react-toastify";

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
  product_id: string;
  product_price_ids: { 1: string; 2: string; 4: string };
}

const ProductsList = React.memo(() => {
  const { addToCart, loading, openCart } = useCart();

  const [selectedPacks, setSelectedPacks] = useState<Record<string, 1 | 2 | 4>>({});
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [greenResponse, pinkResponse] = await Promise.all([
          productsApi.getList({
            filter: { design_type: ["green", "GREEN"] },
            sort: { id: "DESC" },
            page: 1,
            limit: 1,
          }),
          productsApi.getList({
            filter: { design_type: ["pink", "PINK"] },
            sort: { id: "DESC" },
            page: 1,
            limit: 1,
          })
        ]);

        const greenList = greenResponse.data && Array.isArray(greenResponse.data) ? greenResponse.data : [];
        const pinkList = pinkResponse.data && Array.isArray(pinkResponse.data) ? pinkResponse.data : [];
        const combinedList = [...greenList, ...pinkList];

        if (combinedList.length > 0) {
          const detailedProducts = await Promise.all(
            combinedList.map(async (apiProduct: Product, idx: number) => {
              try {
                const detailsResponse = await productsApi.getDetails(apiProduct.id);
                if (!detailsResponse.data) return null;

                const productDetails = detailsResponse.data;
                const tiers: PriceTier[] = Array.isArray(productDetails.prices) ? productDetails.prices : [];

                const getTierData = (qty: 1 | 2 | 4) => {
                  const tier = tiers.find((t) => Number(t.qty) === Number(qty));
                  const result = {
                    price: tier ? Math.round(parseFloat(tier.final_price) || 0) : 0,
                    mrp: tier ? Math.round(parseFloat(tier.mrp) || 0) : 0,
                    discount: tier ? tier.discount_off_inpercent || "0%" : "0%",
                    product_price_id: tier ? tier.product_price_id : ""
                  };

                  return result;
                };

                const mainImage = Array.isArray(productDetails.image) && productDetails.image.length > 0
                  ? productDetails.image[0]
                  : "/assets/img/green-product.png";

                const productData = {
                  id: productDetails.id,
                  name: productDetails.product_name,
                  shortdescription: productDetails.short_description || "",
                  description: productDetails.product_description || productDetails.short_description || "",
                  descriptiontext: productDetails.short_description || "",
                  price: {
                    1: getTierData(1).price,
                    2: getTierData(2).price,
                    4: getTierData(4).price,
                  },
                  mrp: {
                    1: getTierData(1).mrp,
                    2: getTierData(2).mrp,
                    4: getTierData(4).mrp,
                  },
                  discount: {
                    1: getTierData(1).discount,
                    2: getTierData(2).discount,
                    4: getTierData(4).discount,
                  },
                  product_price_ids: {
                    1: getTierData(1).product_price_id,
                    2: getTierData(2).product_price_id,
                    4: getTierData(4).product_price_id,
                  },
                  benefits: staticProducts[idx]?.benefits || [],
                  mainImage,
                  product_id: productDetails.id,
                };

                return productData;
              } catch (error) {
                if (process.env.NODE_ENV === "development") {
                  console.error(`Failed to fetch details for product ${apiProduct.id}:`, error);
                }
                return null;
              }
            })
          );

          const validProducts = detailedProducts.filter((product): product is DisplayProduct =>
            product !== null && product.product_id !== undefined
          );
          setDisplayProducts(validProducts);
        } else {
          setDisplayProducts([]);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch products:", error);
        }
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


    if (!product.product_price_ids) {
      if (process.env.NODE_ENV === "development") {
        console.error("Product missing product_price_ids:", product);
      }
      toast.error("Unable to add to cart: Product data incomplete. Please refresh and try again.");
      return;
    }

    const productPriceId = product.product_price_ids[selectedPack];

    if (!productPriceId || productPriceId.trim() === "") {
      toast.error("Unable to add to cart: Missing price information. Please try again.");
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedPack}`,
      name: `${product.name} - Pack of ${selectedPack}`,
      quantity: 1,
      price: product.price[selectedPack],
      image: product.mainImage,
      product_id: product.product_id,
      mrp_price: product.mrp[selectedPack],
      discount_percent: product.discount[selectedPack],
      pack_qty: selectedPack,
      product_price_id: productPriceId,
      short_description: product.shortdescription,
    };


    await addToCart(cartItem);
    // Success toast is now handled by CartProvider
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

        const selectedPack = selectedPacks[product.id] || 1;

        return (
          <div
            key={product.id}
            className={`px-4 ${index % 2 !== 0 ? "w-full bg-[#FAFAFA]" : ""}`}
          >
            <div
              className={`flex flex-wrap justify-between items-center gap-6 max-w-[1400px] mx-auto py-6 ${index % 2 !== 0 ? "flex-row-reverse" : ""
                }`}
            >
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

                <div className="flex flex-wrap justify-between gap-4 mb-3">
                  {product.benefits.map((b, i) => (
                    <div
                      key={i}
                      className={`md:w-[20%] w-[45%] ${i !== product.benefits.length - 1
                        ? "md:border-r md:border-black"
                        : ""
                        } ${i !== product.benefits.length - 1 && !(i === 1 || i === 3)
                          ? "border-r border-black"
                          : ""
                        } pr-2`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Image src={b.img} width={83} height={83} alt={`Benefit ${i + 1}`} />
                        <p className="text-[12px]">{b.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 md:flex-row mt-2">
                  <div className="md:w-[10%] w-[20%]">
                    <p className="font-light">
                      Select
                      <br className="hidden md:block" />
                      Pack:
                      <br />
                    </p>
                  </div>
                  <div className="md:w-[90%] w-[80%] flex md:flex-wrap gap-2">
                    {packs.map((pack) => {
                      const isSelected = selectedPack === pack;

                      const colors = isEven
                        ? {
                          selected: "bg-[#057A37] text-white border-[#057A37] w-28 md:w-36",
                          unselected: "bg-[#DFF5E6] text-[#057A37] border-[#057A37] w-28 md:w-36",
                        }
                        : {
                          selected: "bg-[#B00404] text-white border-[#B00404] w-28 md:w-36",
                          unselected: "bg-[#F5DADA] text-[#B00404] border-[#B00404] w-28 md:w-36",
                        };

                      return (
                        <Button
                          key={pack}
                          onClick={() => handleSelectPack(product.id, pack)}
                          className={`rounded-[10px] py-2 px-4 border font-semibold transition-colors ${isSelected ? colors.selected : colors.unselected
                            }`}
                        >
                          <span className="text-[10px] md:pr-3 pr-2">Pack {pack}</span> ₹
                          <div className="text-center text-[13px] md:text-[16px]">
                            {Math.round(product.price[pack]).toLocaleString()}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 mt-2 justify-center md:justify-start">
                  <Button
                    onClick={() => handleShopNow(product)}
                    disabled={loading}
                    className={`flex items-center gap-2 rounded-[10px] w-40 py-2 px-4 font-semibold transition-colors bg-[#057A37] text-white border-[#057A37] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ShoppingBag size={16} />
                    {loading ? "Processing..." : "Buy Now"}
                  </Button>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={loading}
                    className={`flex items-center gap-2 rounded-[10px] w-40 py-2 px-4 font-semibold transition-colors bg-white text-black border border-black hover:!border-black disabled:opacity-50 disabled:cursor-not-allowed`}
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
});

ProductsList.displayName = "ProductsList";

export default ProductsList;
