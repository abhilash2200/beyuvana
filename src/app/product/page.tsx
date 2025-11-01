import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api";
import React from 'react'

async function fetchProducts() {
  try {
    const [greenResponse, pinkResponse] = await Promise.all([
      productsApi.getList({
        filter: { design_type: ["green", "GREEN"] },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      }),
      productsApi.getList({
        filter: { design_type: ["pink", "PINK"] },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      })
    ]);

    const greenList = (greenResponse.data && Array.isArray(greenResponse.data)) ? greenResponse.data : [];
    const pinkList = (pinkResponse.data && Array.isArray(pinkResponse.data)) ? pinkResponse.data : [];

    const combinedList = [...greenList, ...pinkList];

    const all = combinedList.map(convertToLegacyProduct);

    return all.sort((a, b) => {
      if (a.design_type === "green" && b.design_type === "pink") return -1;
      if (a.design_type === "pink" && b.design_type === "green") return 1;

      return b.id - a.id;
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch products error:", err);
    }
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