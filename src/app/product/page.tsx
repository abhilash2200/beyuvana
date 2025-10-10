import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api";
import React from 'react'

// Server-side fetch function
async function fetchProducts() {
  try {
    const limit = 50; // fetch in larger pages to minimize requests
    let pageNum = 1;
    const all: ReturnType<typeof convertToLegacyProduct>[] = [];

    while (true) {
      const response = await productsApi.getList({
        // no category filter: fetch all
        sort: { id: "DESC" },
        page: pageNum,
        limit,
      });

      const list = (response.data && Array.isArray(response.data)) ? response.data : [];
      if (list.length === 0) break;

      all.push(...list.map(convertToLegacyProduct));

      // If the page returned fewer than limit, we've reached the end
      if (list.length < limit) break;

      pageNum += 1;
      // Safety cap to avoid infinite loops if backend behaves unexpectedly
      if (pageNum > 50) break;
    }

    // Ensure latest-first on the client as well
    return all.sort((a, b) => b.id - a.id);
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