"use client"
import { Product } from "@/app/data/fallbackProducts";
import ProductDetails from "./ProductDetails";
import SelectPack from "./SelectPack";
import ProductImg from "./ProductImg";

export default function Product2Layout({ product }: { product: Product }) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-between gap-x-2">
        <div className="w-full md:w-[30%]">
          <ProductImg images={product.images} />
        </div>
        <div className="w-full md:w-[30%]">
          <ProductDetails name={product.name} tagline={product.tagline} description={product.description} certificateImg={product.certificateImg} faq={product.faq} productId={product.id} />
        </div>
        <div className="w-full md:w-[30%]">
        <SelectPack productId="collagen-pink" />
        </div>
      </div>
    </div>
  );
}