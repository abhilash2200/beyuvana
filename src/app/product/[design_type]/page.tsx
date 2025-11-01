"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { fallbackProducts } from "../../data/fallbackProducts";
import { designSlugToProductId } from "../../data/productConfigs";
import { slugify } from "@/lib/utils";
import { toast } from "react-toastify";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Lazy load heavy product layout components
const Product1Layout = dynamic(() => import("@/components/product/Product1Layout"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading product...</div>
});

const Product2Layout = dynamic(() => import("@/components/product/Product2Layout"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading product...</div>
});

const ProductDetailPage = () => {
  const { design_type } = useParams() as { design_type?: string };
  const slug = String(design_type || "");

  // 1) Try direct mapping like "collagen-green" | "collagen-pink"
  const mappedProductId = designSlugToProductId[slug];

  // 2) Find product either by mapped id or by matching the name slug
  const product = mappedProductId
    ? fallbackProducts.find((p) => p.id === mappedProductId)
    : fallbackProducts.find((p) => slugify(p.name) === slug);

  if (!product) {
    toast.error("Invalid product or design type!");
    return <p className="text-center py-10">Invalid product or design type</p>;
  }

  // Choose layout by design_type: GREEN -> Product1Layout, PINK -> Product2Layout
  const LayoutComponent = product.design_type === "GREEN" ? Product1Layout : Product2Layout;

  return (
    <ErrorBoundary>
      <LayoutComponent product={product} />
    </ErrorBoundary>
  );
};

export default ProductDetailPage;