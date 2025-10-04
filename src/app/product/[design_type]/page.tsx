"use client";

import { useParams } from "next/navigation";
import { fallbackProducts } from "../../data/fallbackProducts";
import { productConfigs } from "../../data/productConfigs";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
    const { id } = useParams();
    const productId = Number(id);

    const product = fallbackProducts.find(p => p.id === productId);
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