"use client";

import Image from "next/image";
import { Rating } from "@mui/material";
import { Button } from "../ui/button";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";

// Product interface
export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description: string[];
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  bgColor: string;
}

interface ProductsListsProps {
  products: Product[];
}

export default function ProductsLists({ products }: ProductsListsProps) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (product: Product) => {
    await addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      product_id: product.id.toString(), // Use the same ID as product_id for API
    });
  };

  return (
    <>
      {products.map((product, index) => (
        <section key={product.id} className={`py-10 ${index % 2 === 1 ? "bg-[#F8F8F8]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">

              {/* Image Section */}
              <div className="w-full md:w-[35%]">
                <Link href={`/product/${product.id}`} className="flex items-center justify-center">
                  <div
                    className="p-6 flex items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    <Image
                      src={product.image || "/assets/img/green-product.png"}
                      width={332}
                      height={382}
                      alt={product.name}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              {/* Text Section */}
              <div className="w-full md:w-[65%]">
                <div className="flex flex-col">
                  <Link href={`/product/${product.id}`} className="flex items-center justify-start">
                    <h2 className="text-[#1A2819] font-[Grafiels] text-[25px] leading-tight mb-4">{product.name}</h2>
                  </Link>
                  {product.tagline && <p className="inline-flex border border-black rounded-[5px] py-2 px-2 mb-3">{product.tagline}</p>}
                  <div className="flex gap-x-4 items-center mb-3">
                    <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
                    <p className="text-[12px] text-[#747474]">60 reviews</p>
                  </div>
                  {product.description.map((desc, i) => (
                    <p key={i} className="text-[15px] mb-3">{desc}</p>
                  ))}
                  <h3 className="text-[#1A2819] text-[25px] mb-3 font-semibold leading-tight">₹{product.price.toLocaleString()}</h3>
                  <p className="text-[15px] mb-4">
                    <span className="line-through text-gray-500 text-[12px]">₹{product.originalPrice.toLocaleString()}</span>{" "}
                    <span className="text-[#057A37] font-semibold">{product.discount}</span>
                  </p>

                  <div className="flex gap-4">
                    <Button onClick={() => console.log("Shop now:", product.name)} className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal capitalize transition-colors bg-[#057A37] text-white border-[#057A37]">
                      <ShoppingBag size={16} /> shop now
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal capitalize transition-colors bg-white text-black border border-black hover:!border-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={16} />
                      {loading ? "Adding..." : "add to cart"}
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}
    </>
  );
}
