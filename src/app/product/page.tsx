import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api/products";
import React from 'react'
import { handleError } from "@/lib/error-handling";
import ComboProduct from '@/components/product/ComboProduct';
import type { Product } from "@/lib/api/types";

async function fetchProducts() {
  try {
    const [greenResponse, pinkResponse] = await Promise.all([
      productsApi.getList({
        filter: {
          design_type: ["green", "GREEN"],
          // Exclude combo products - if product_type exists and is "combo", exclude it
          // Note: This assumes the API supports filtering by product_type
        },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      }),
      productsApi.getList({
        filter: {
          design_type: ["pink", "PINK"],
          // Exclude combo products - if product_type exists and is "combo", exclude it
        },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      })
    ]);

    const greenList = (greenResponse.data && Array.isArray(greenResponse.data)) ? greenResponse.data : [];
    const pinkList = (pinkResponse.data && Array.isArray(pinkResponse.data)) ? pinkResponse.data : [];

    const combinedList = [...greenList, ...pinkList];

    // Filter out combo products before converting
    const filteredList = combinedList.filter((product: Product) => {
      // Check multiple possible field names and values for combo products
      const productType = product.product_type;
      const category = product.category || product.categorykey;
      const productName = product.product_name || "";

      // Check if it's a combo product by:
      // 1. product_type field equals "combo"
      // 2. category contains "combo"
      // 3. product name contains "combo" (case-insensitive)
      const isComboByType = productType && typeof productType === "string" && productType.toLowerCase() === "combo";
      const isComboByCategory = category && typeof category === "string" && category.toLowerCase().includes("combo");
      const isComboByName = productName.toLowerCase().includes("combo");

      const isCombo = isComboByType || isComboByCategory || isComboByName;

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        if (isCombo) {
          console.log("Filtering out combo product:", {
            id: product.id,
            name: product.product_name,
            product_type: productType,
            category: category,
            isComboByType,
            isComboByCategory,
            isComboByName,
          });
        }
      }

      return !isCombo;
    });

    const all = filteredList.map(convertToLegacyProduct);

    return all.sort((a, b) => {
      if (a.design_type === "green" && b.design_type === "pink") return -1;
      if (a.design_type === "pink" && b.design_type === "green") return 1;

      return b.id - a.id;
    });
  } catch (err) {
    handleError(err, {
      context: "product/page",
      userMessage: "Failed to fetch products. Please try again.",
      showToast: false, // Server component - can't show toast
      silent: false, // But still log it
    });
    return [];
  }
}

const Page = async () => {
  const products = await fetchProducts();

  return (
    <div>
      <ProductsLists products={products} />
      <ComboProduct />
    </div>
  )
}

export default Page;