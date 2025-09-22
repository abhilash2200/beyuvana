"use client";

import { useParams } from "next/navigation";
import { products } from "@/app/data/fallbackProducts";
import { Product1Layout } from "@/components/product/Product1Layout";
import { Product2Layout } from "@/components/product/Product2Layout";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;  // make sure id exists

  if (!id) return <p className="text-center py-10">Invalid Product</p>;

  const product = products.find(p => p.id === id);

  if (!product) return <p className="text-center py-10">Product not found</p>;

  if (product.id === "collagen-powder") return <Product1Layout product={product} />;
  if (product.id === "collagen-booster") return <Product2Layout product={product} />;

  return <Product1Layout product={product} />;
}
