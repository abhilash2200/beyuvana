"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartProvider"
import { toast } from "react-toastify"
import ProductRating from "./ProductRating"

interface ComboProductData {
  id: string;
  name: string;
  price: number;
  mrp_price: number;
  image: string;
  product_id: string;
  product_price_id: string;
  short_description: string;
}

const ComboProduct = () => {
  const { addToCart, loading, openCart } = useCart();

  // Define the combo product data
  const product: ComboProductData = {
    id: "combo-product",
    name: "BEYUVANA™ Glow Essence + 18 Synergistic Ingredients",
    price: 2000,
    mrp_price: 2000,
    image: "/assets/img/collagen-green-product.png",
    product_id: "combo-product",
    product_price_id: "combo-product-price",
    short_description: "BEYUVANA™ Glow Essence is a daily skin supplement that helps improve skin glow, hydration, and overall skin health. It contains 18 synergistic ingredients that work together to improve skin health and appearance.",
  };

  const handleAddToCart = async () => {
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

  const handleShopNow = async () => {
    await handleAddToCart();
    openCart();
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-between gap-y-4">
          <div className="w-full md:w-[30%]">
            <Image src={product.image} width={418} height={382} alt={product.name} className="object-contain" />
          </div>
          <div className="w-full md:w-[68%]">
            <h2 className="text-[#1A2819] hover:text-[#057A37] hover:cursor-pointer font-[Grafiels] text-[25px] leading-tight mb-4">{product.name}</h2>
            <div className="flex gap-x-4 items-center mb-3">
              <ProductRating
                productId={product.id}
                className="text-[12px]"
              />
            </div>
            <div className="border border-black inline-flex rounded-[5px] py-2 px-2 mb-4">
              <p className="text-[15px] text-[#1A2819] leading-relaxed">Aging is Natural — Radiance is a Choice</p>
            </div>

            <p className="text-[15px] text-[#1A2819] leading-relaxed mb-4">{product.short_description}</p>

            <div className="my-4">
              <p className="text-[#1A2819] text-[25px] mb-3 font-semibold leading-tight">₹{product.price.toLocaleString()}</p>
            </div>

            <div className="flex gap-2 mt-2 justify-center md:justify-start">
              <Button
                onClick={handleShopNow}
                disabled={loading}
                className={`flex items-center gap-2 rounded-[10px] w-40 py-2 px-4 font-semibold transition-colors bg-[#057A37] text-white border-[#057A37] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ShoppingBag size={16} />
                {loading ? "Processing..." : "Buy Now"}
              </Button>

              <Button
                onClick={handleAddToCart}
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
    </>
  )
}

export default ComboProduct
