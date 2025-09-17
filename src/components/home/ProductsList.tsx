"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { products, Product } from "@/app/data/products";
import { ShoppingCart, ShoppingBag } from "lucide-react"

const packs = [1, 2, 4] as const;

const ProductsList = () => {
  const { addToCart } = useCart();
  const router = useRouter();

  // State as a map where key is product id and value is selected pack
  const [selectedPacks, setSelectedPacks] = useState<Record<string, 1 | 2 | 4>>({});

  const handleSelectPack = (productId: string, pack: 1 | 2 | 4) => {
    setSelectedPacks((prev) => ({
      ...prev,
      [productId]: pack,
    }));
  };

  const handleAddToCart = (product: Product) => {
    const selectedPack: 1 | 2 | 4 = selectedPacks[product.id] ?? 1;
    addToCart({
      id: `${product.id}-${selectedPack}`,
      name: `${product.name} - Pack of ${selectedPack}`,
      quantity: 1,
      price: product.price[selectedPack],
      image: product.mainImage,
    });
  };

  const handleShopNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-12">
      {products.map((product: Product, index: number) => {
        const isEven = index % 2 === 0;
        const packColor = isEven ? "bg-[#057A37] text-white" : "bg-[#B00404] text-white";

        // Get the selected pack for this product or default to 1
        const selectedPack = selectedPacks[product.id] || 1;

        return (
          <div
            key={product.id}
            className={`${index % 2 !== 0 ? "w-full bg-[#FAFAFA]" : ""}`}
          >
            <div
              className={`flex flex-wrap justify-between items-center gap-6 max-w-[1400px] mx-auto py-6 ${index % 2 !== 0 ? "flex-row-reverse" : ""
                }`}
            >
              <div className="w-full md:w-[28%]">
                <Image
                  src={product.mainImage}
                  width={418}
                  height={481}
                  alt={product.name}
                />
              </div>
              <div className="w-full md:w-[68%] flex flex-col gap-4">
                <h2 className="text-[#1A2819] font-[Grafiels] text-[30px] leading-tight mb-2">{product.name}</h2>
                {index === 0 && <div><p className="inline-flex border border-black rounded-[5px] py-2 px-2">{product.shortdescription}</p></div>}
                <p>{product.description}</p>
                {index === 1 && <div className="mb-3"><p className="">{product.descriptiontext}</p></div>}

                <div className="flex flex-wrap justify-between gap-4 mb-3">
                  {product.benefits.map((b, i) => (
                    <div
                      key={i}
                      className={`w-[20%] ${i !== product.benefits.length - 1 ? "border-r border-black" : ""} pr-2`}
                    >
                      <Image src={b.img} width={83} height={83} alt={`Benefit ${i + 1}`} />
                      <p>{b.text}</p>
                    </div>
                  ))}
                </div>


                <div className="flex gap-2 items-center mt-2">
                  <p>Select<br />Pack:</p>
                  {packs.map((pack) => {
                    const isSelected = selectedPack === pack;

                    // Product-specific colors
                    const colors = isEven
                      ? { selected: "bg-[#057A37] text-white border-[#057A37]", unselected: "bg-[#DFF5E6] text-[#057A37] border-[#057A37]" }
                      : { selected: "bg-[#B00404] text-white border-[#B00404]", unselected: "bg-[#F5DADA] text-[#B00404] border-[#B00404]" };

                    return (
                      <Button
                        key={pack}
                        onClick={() => handleSelectPack(product.id, pack)}
                        className={`rounded-[10px] py-2 px-4 border font-semibold transition-colors ${isSelected ? colors.selected : colors.unselected}`}
                      >
                        <span className="text-[10px] pr-3">Pack {pack}</span> ₹{product.price[pack].toLocaleString()}
                      </Button>
                    );
                  })}


                </div>


                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => handleShopNow(product)}
                    disabled={selectedPack !== 1}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-[#057A37] text-white border-[#057A37] ${selectedPack !== 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ShoppingBag size={16} />
                    Buy Now
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-2 rounded-[10px] py-2 px-4 font-semibold transition-colors bg-white text-black border border-black hover:!border-black`}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
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
