"use client";

import { useParams } from "next/navigation";
import { fallbackProducts } from "../../data/fallbackProducts";
import { productConfigs, designSlugToProductId } from "../../data/productConfigs";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
    const { design_type } = useParams() as { design_type?: string };
    const slug = String(design_type || "");

    const productId = designSlugToProductId[slug];

    if (!productId) {
        toast.error("Invalid product design type!");
        return <p className="text-center py-10">Invalid product design type</p>;
    }

    const product = fallbackProducts.find((p) => p.id === productId);
    if (!product) {
        toast.error("Product not found!");
        return <p className="text-center py-10">Product not found!</p>;
    }

    const LayoutComponent = productConfigs[productId as keyof typeof productConfigs]?.layout;
    if (!LayoutComponent) {
        toast.error("Layout not available for this product!");
        return <p className="text-center py-10">No layout found for this product</p>;
    }

    return <LayoutComponent product={product} />;
};

export default ProductDetailPage;