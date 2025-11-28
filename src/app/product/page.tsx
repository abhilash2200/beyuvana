import ProductsLists from '@/components/product/ProductsLists'
import { productsApi, convertToLegacyProduct } from "@/lib/api/products";
import React from 'react'
import { handleError } from "@/lib/error-handling";
import ComboProduct, { type ComboProductData } from '@/components/product/ComboProduct';
import type { Product, PriceTier } from "@/lib/api/types";

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

async function fetchComboProducts(): Promise<ComboProductData[]> {
  try {
    const response = await productsApi.getList({
      filter: { product_type: ["combo"] },
      sort: { id: "DESC" },
      page: 1,
      limit: 100,
    });

    const productsList = response.data && Array.isArray(response.data) ? response.data : [];

    if (productsList.length === 0) {
      return [];
    }

    // Fetch details for each combo product to get pricing information
    const detailedProducts = await Promise.all(
      productsList.map(async (apiProduct: Product) => {
        try {
          const detailsResponse = await productsApi.getDetails(apiProduct.id);
          if (!detailsResponse.data) return null;

          const productDetails = detailsResponse.data;
          const tiers: PriceTier[] = Array.isArray(productDetails.prices) ? productDetails.prices : [];

          // Get the first available tier (usually pack of 1)
          const firstTier = tiers.length > 0 ? tiers[0] : null;

          const mainImage = Array.isArray(productDetails.image) && productDetails.image.length > 0
            ? productDetails.image[0]
            : apiProduct.image_single || apiProduct.image || "/assets/img/collagen-green-product.png";

          const productData: ComboProductData = {
            id: productDetails.id,
            name: productDetails.product_name,
            price: firstTier ? Math.round(parseFloat(firstTier.final_price) || 0) : Math.round(parseFloat(productDetails.discount_price || "0") || 0),
            mrp_price: firstTier ? Math.round(parseFloat(firstTier.mrp) || 0) : Math.round(parseFloat(productDetails.product_price || "0") || 0),
            image: mainImage,
            product_id: productDetails.id,
            product_price_id: firstTier ? firstTier.product_price_id : "",
            short_description: productDetails.short_description || "",
            product_description: productDetails.product_description || "",
          };

          return productData;
        } catch {
          return null;
        }
      })
    );

    const validProducts = detailedProducts.filter((product): product is ComboProductData =>
      product !== null && product.product_price_id !== undefined && product.product_price_id !== ""
    );

    return validProducts;
  } catch (err) {
    handleError(err, {
      context: "product/page - fetchComboProducts",
      userMessage: "Failed to fetch combo products. Please try again.",
      showToast: false,
      silent: false,
    });
    return [];
  }
}

const Page = async () => {
  const [products, comboProducts] = await Promise.all([
    fetchProducts(),
    fetchComboProducts(),
  ]);

  return (
    <div>
      <ProductsLists products={products} />
      <ComboProduct comboProducts={comboProducts} />
    </div>
  )
}

export default Page;