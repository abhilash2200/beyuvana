import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api";
import React from 'react'

// Server-side fetch function
async function fetchProducts() {
  try {
    const response = await productsApi.getList({
      filter: { categorykey: ["hair-care"] },
      sort: { product_name: "ASC" },
      page: 1,
      limit: 20,
    });

    if (response.data && Array.isArray(response.data)) {
      // Convert API products to legacy format for backward compatibility
      return response.data.map(convertToLegacyProduct);
    }

    return [];
  } catch (err) {
    console.error("Fetch products error:", err);
    return [];
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