"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartProvider"
import { toast } from "react-toastify"
import ProductRating from "./ProductRating"
import { useState, useEffect } from "react"
import { productsApi } from "@/lib/api/products"
import type { Product, PriceTier } from "@/lib/api/types"

interface ComboProductData {
  id: string;
  name: string;
  price: number;
  mrp_price: number;
  image: string;
  product_id: string;
  product_price_id: string;
  short_description: string;
  product_description: string;
}

const ComboProduct = () => {
  const { addToCart, loading, openCart } = useCart();
  const [comboProducts, setComboProducts] = useState<ComboProductData[]>([]);

  useEffect(() => {
    const fetchComboProducts = async () => {
      try {
        const response = await productsApi.getList({
          filter: { product_type: ["combo"] },
          sort: { id: "DESC" },
          page: 1,
          limit: 100,
        });

        const productsList = response.data && Array.isArray(response.data) ? response.data : [];

        if (productsList.length > 0) {
          // Fetch details for each combo product to get pricing information
          const detailedProducts = await Promise.all(
            productsList.map(async (apiProduct: Product) => {
              try {
                const detailsResponse = await productsApi.getDetails(apiProduct.id);
                if (!detailsResponse.data) return null;

                const productDetails = detailsResponse.data;
                const tiers: PriceTier[] = Array.isArray(productDetails.prices) ? productDetails.prices : [];

                // Get the first available tier (usually pack of 1)
                const firstTier = tiers.length > 0 ? tiers[0] : null;

                const mainImage = Array.isArray(productDetails.image) && productDetails.image.length > 0
                  ? productDetails.image[0]
                  : apiProduct.image_single || apiProduct.image || "/assets/img/collagen-green-product.png";

                const productData: ComboProductData = {
                  id: productDetails.id,
                  name: productDetails.product_name,
                  price: firstTier ? Math.round(parseFloat(firstTier.final_price) || 0) : Math.round(parseFloat(productDetails.discount_price || "0") || 0),
                  mrp_price: firstTier ? Math.round(parseFloat(firstTier.mrp) || 0) : Math.round(parseFloat(productDetails.product_price || "0") || 0),
                  image: mainImage,
                  product_id: productDetails.id,
                  product_price_id: firstTier ? firstTier.product_price_id : "",
                  short_description: productDetails.short_description || "",
                  product_description: productDetails.product_description || "",
                };

                return productData;
              } catch (error) {
                return null;
              }
            })
          );

          const validProducts = detailedProducts.filter((product): product is ComboProductData =>
            product !== null && product.product_price_id !== undefined && product.product_price_id !== ""
          );
          setComboProducts(validProducts);
        } else {
          setComboProducts([]);
        }
      } catch (error) {
        toast.error("Failed to load combo products. Please try again later.");
        setComboProducts([]);
      }
    };

    fetchComboProducts();
  }, []);

  const handleAddToCart = async (product: ComboProductData) => {
    if (!product.product_price_id) {
      toast.error("Unable to add to cart: Missing price information. Please try again.");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      image: product.image,
      product_id: product.product_id,
      mrp_price: product.mrp_price,
      pack_qty: 1,
      product_price_id: product.product_price_id,
      short_description: product.short_description,
    };

    await addToCart(cartItem);
  };

  const handleShopNow = async (product: ComboProductData) => {
    await handleAddToCart(product);
    openCart();
  };

  const formatINR = (value: number): string => {
    const rounded = Math.round(value || 0);
    return new Intl.NumberFormat("en-IN").format(rounded);
  };

  if (comboProducts.length === 0) {
    return null; // Don't render anything if there are no combo products
  }

  return (
    <>
      {comboProducts.map((product, index) => (
        <section key={product.id} className={`py-10 ${index % 2 === 1 ? "bg-[#F8F8F8]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">
              {/* Image Section */}
              <div className="w-full md:w-[35%]">
                <div className="p-6 flex items-center justify-center rounded-[10px] bg-[#FAFAFA]">
                  <Image
                    src={product.image || "/assets/img/collagen-green-product.png"}
                    width={332}
                    height={382}
                    alt={`${product.name} product image`}
                    className="object-contain"
                    loading={index > 1 ? "lazy" : "eager"}
                    priority={index <= 1}
                  />
                </div>
              </div>

              {/* Text Section */}
              <div className="w-full md:w-[65%]">
                <div className="flex flex-col">
                  <h2 className="text-[#1A2819] font-[Grafiels] text-[25px] leading-tight mb-4">{product.name}</h2>
                  <div>
                    <p className="inline-flex border border-black rounded-[5px] py-2 px-2 mb-3">{product.short_description}</p>
                  </div>
                  <div className="flex gap-x-4 items-center mb-3">
                    <ProductRating
                      productId={product.id}
                      className="text-[12px]"
                    />
                  </div>
                  {product.product_description && (
                    <p className="text-[15px] mb-3 font-light">{product.product_description}</p>
                  )}
                  <h3 className="text-[#1A2819] text-[25px] mb-3 font-semibold leading-tight">₹{formatINR(product.price)}</h3>
                  <p className="text-[15px] mb-4">
                    <span className="line-through text-gray-500 text-[12px]">₹{formatINR(product.mrp_price)}</span>
                    {product.mrp_price > product.price && (
                      <span className="text-[#057A37] font-semibold ml-2">
                        {Math.round(((product.mrp_price - product.price) / product.mrp_price) * 100)}% Off
                      </span>
                    )}
                  </p>

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
          </div>
        </section>
      ))}
    </>
  )
}

export default ComboProduct
