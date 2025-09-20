"use client";

import Image from "next/image";
import { Rating } from "@mui/material";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";

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

// Static fallback data
export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "BEYUVANA™ Collagen Builder— India’s 1st Complete Plant-Based Premium",
    tagline: "Aging is Natural — Radiance is a Choice",
    description: [
      "Crafted with 21 synergistic, clinically studied botanicals that work from within. Each precision-dosed sachet supports skin elasticity, deep hydration, and youthful glow. Stimulates natural collagen with Amla, Bamboo Silica, L-Lysine, and Hyaluronic Acid."
    ],
    price: 5999,
    originalPrice: 10000,
    discount: "40% Off",
    image: "/assets/img/green-product.png",
    bgColor: "#FAFAFA",
  },
  {
    id: 2,
    name: "BEYUVANA™ Advanced Glow-Nourishing Formula for Radiant, Even-Toned Skin",
    description: [
      "Glow Essence is an advanced, 100% vegetarian, skin-nourishing formula enriched with 18 synergistic plant-based actives, designed to unlock visible clarity and radiance from within.",
      "Infused with 4X Liposomal Glutathione and clinically studied Vitamin C, it works deep at the cellular level to visibly reduce dark spots, pigmentation, and dullness — revealing a brighter, more even-toned complexion."
    ],
    price: 5999,
    originalPrice: 10000,
    discount: "40% Off",
    image: "/assets/img/pink-product.png",
    bgColor: "#fff",
  }
];

const ProductsLists = () => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(false);

  // Future API fetching logic (commented out for now)
  /*
  useEffect(() => {
    setLoading(true);
    fetch("/api/products") // replace with your real API endpoint
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);
  */

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      quantity: 1,
      price: product.price,
      image: product.image,
    });
  };

  const handleShopNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/checkout");
  };

  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  return (
    <>
      {products.map((product, index) => (
        <section key={product.id} className={`py-10 ${index % 2 === 1 ? "bg-[#F8F8F8]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">

              {/* Image Section */}
              <div className="w-full md:w-[35%]">
                <Link href={`/product/${product.id}`} className="flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <div
                      className="p-6 flex items-center justify-center rounded-[10px]"
                      style={{ backgroundColor: product.bgColor }}
                    >
                      <Image
                        src={product.image}
                        width={332}
                        height={382}
                        alt={product.name}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Text Section */}
              <div className="w-full md:w-[65%]">
                <div className="flex flex-col">
                  <Link href={`/product/${product.id}`} className="flex items-center justify-start">
                    <h2 className="text-[#1A2819] font-[Grafiels] text-[25px] leading-tight mb-4">{product.name}</h2>
                  </Link>
                  <div>{product.tagline && <p className="inline-flex border border-black rounded-[5px] py-2 px-2 mb-3">{product.tagline}</p>}</div>
                  <div className="flex gap-x-4 items-center mb-3">
                    <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
                    <p className="text-[12px] text-[#747474]">60 reviews</p>
                  </div>
                  {product.description.map((desc, i) => (
                    <p key={i} className="text-[15px] mb-3">{desc}</p>
                  ))}
                  <h3 className="text-[#1A2819] text-[25px] mb-3 font-semibold leading-tight">₹{product.price.toLocaleString()}</h3>
                  <p className="text-[15px] mb-4">
                    <span className="line-through text-gray-500 text-[12px]">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>{" "}
                    <span className="text-[#057A37] font-semibold">{product.discount}</span>
                  </p>

                  <div className="flex gap-4">
                    <Button onClick={() => handleShopNow(product)} className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal capitalize transition-colors bg-[#057A37] text-white border-[#057A37]">
                      <ShoppingBag size={16} /> shop now
                    </Button>
                    <Button onClick={() => handleAddToCart(product)} className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal capitalize transition-colors bg-white text-black border border-black hover:!border-black">
                      <ShoppingCart size={16} /> add to cart
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
};

export default ProductsLists;
