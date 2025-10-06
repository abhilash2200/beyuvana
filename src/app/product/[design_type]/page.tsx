"use client";

import { useParams } from "next/navigation";
import { fallbackProducts } from "../../data/fallbackProducts";
import { designSlugToProductId } from "../../data/productConfigs";
import Product1Layout from "@/components/product/Product1Layout";
import Product2Layout from "@/components/product/Product2Layout";
import { slugify } from "@/lib/utils";
import { toast } from "react-toastify";

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

    return <LayoutComponent product={product} />;
};

export default ProductDetailPage;