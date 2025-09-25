import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api";
import React from 'react'

// Server-side fetch function
async function fetchProducts() {
  try {
    const response = await productsApi.getList({ category: "Skin Care" });

    if (response.data && Array.isArray(response.data)) {
      // Convert API products to legacy format for backward compatibility
      return response.data.map(convertToLegacyProduct);
    }

    return [];
  } catch (err) {
    console.error("Fetch products error:", err);
    // fallback data if API fails
    return [
      {
        id: 1,
        name: "BEYUVANA™ Collagen Builder",
        tagline: "Aging is Natural — Radiance is a Choice",
        description: ["Crafted with 21 botanicals for youthful glow."],
        price: 5999,
        originalPrice: 10000,
        discount: "40% Off",
        image: "/assets/img/green-product.png",
        bgColor: "#FAFAFA",
      },
      {
        id: 2,
        name: "BEYUVANA™ Advanced Glow-Nourishing Formula",
        description: ["Glow Essence is advanced, 100% vegetarian formula."],
        price: 5999,
        originalPrice: 10000,
        discount: "40% Off",
        image: "/assets/img/pink-product.png",
        bgColor: "#fff",
      },
    ];
  }
}

const page = async () => {
  const products = await fetchProducts();

  return (
    <div>
      <ProductsLists products={products} />
    </div>
  )
}

export default page