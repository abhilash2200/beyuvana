import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api";
import React from 'react'

// Server-side fetch function
async function fetchProducts() {
  try {
    // Fetch products based on design type: first green, then pink
    const [greenResponse, pinkResponse] = await Promise.all([
      // Fetch green design products
      productsApi.getList({
        filter: { design_type: ["green", "GREEN"] },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      }),
      // Fetch pink design products
      productsApi.getList({
        filter: { design_type: ["pink", "PINK"] },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      })
    ]);

    const greenList = (greenResponse.data && Array.isArray(greenResponse.data)) ? greenResponse.data : [];
    const pinkList = (pinkResponse.data && Array.isArray(pinkResponse.data)) ? pinkResponse.data : [];

    // Combine products: green first, then pink
    const combinedList = [...greenList, ...pinkList];

    // Convert to legacy format and ensure proper ordering
    const all = combinedList.map(convertToLegacyProduct);

    // Ensure green products come first, then pink products
    return all.sort((a, b) => {
      // First sort by design type (green first, then pink)
      if (a.design_type === "green" && b.design_type === "pink") return -1;
      if (a.design_type === "pink" && b.design_type === "green") return 1;

      // Within same design type, sort by ID DESC (latest first)
      return b.id - a.id;
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch products error:", err);
    }
    // Return empty array on error - fallback products should be handled by client
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