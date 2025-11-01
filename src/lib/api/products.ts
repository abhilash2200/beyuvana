/**
 * Products API
 * Handles product listing and product details
 */

import { apiFetch, ApiResponse } from "./core";
import type {
  Product,
  ProductDetailsResponse,
  ProductsListRequest,
  LegacyProduct,
} from "./types";

export const productsApi = {
  getList: async (params: ProductsListRequest = {}): Promise<ApiResponse<Product[]>> => {
    try {
      return await apiFetch<Product[]>("/products/lists/v1/", {
        method: "POST",
        body: JSON.stringify({
          page: 1,
          limit: 10,
          filter: {},
          ...params,
        }),
      });
    } catch {
      throw new Error("Failed to fetch products. Please try again later.");
    }
  },
  
  getDetails: async (productId: string | number, userId?: string | number): Promise<ApiResponse<ProductDetailsResponse>> => {
    try {
      return await apiFetch<ProductDetailsResponse>("/products/details/v1/", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
        }),
      });
    } catch {
      throw new Error("Failed to fetch product details. Please try again later.");
    }
  },
};

// Utility function to convert API product to legacy format
export const convertToLegacyProduct = (apiProduct: Product): LegacyProduct => {
  const image =
    apiProduct.image_single ||
    apiProduct.image ||
    (Array.isArray(apiProduct.image_all) && apiProduct.image_all.length > 0
      ? apiProduct.image_all[0]
      : "/assets/img/green-product.png");

  const firstTier = Array.isArray(apiProduct.prices) && apiProduct.prices.length > 0
    ? apiProduct.prices[0]
    : undefined;

  const price = firstTier
    ? Math.round(parseFloat(firstTier.final_price))
    : Math.round(parseFloat(apiProduct.discount_price || "0") || 0);

  const originalPrice = firstTier
    ? Math.round(parseFloat(firstTier.mrp))
    : Math.round(parseFloat(apiProduct.product_price || "0") || 0);

  const discountPercent = firstTier
    ? firstTier.discount_off_inpercent
    : apiProduct.discount_off_inpercent || "0";

  const normalizedDesign = (() => {
    const dt = apiProduct.design_type;
    if (!dt) return undefined;
    const lower = (typeof dt === "string" ? dt.toLowerCase() : "") as "green" | "pink";
    return lower === "green" || lower === "pink" ? lower : undefined;
  })();

  return {
    id: parseInt(apiProduct.id),
    name: apiProduct.product_name,
    tagline: apiProduct.short_description,
    description: [apiProduct.product_description],
    price,
    originalPrice,
    discount: `${discountPercent}% Off`,
    image,
    bgColor: "#FAFAFA",
    design_type: normalizedDesign,
    category: apiProduct.category,
    categorykey: apiProduct.categorykey,
    brand: apiProduct.brand,
    brandkey: apiProduct.brandkey,
    product_code: apiProduct.product_code,
    sku_number: apiProduct.sku_number,
    short_description: apiProduct.short_description,
    product_description: apiProduct.product_description,
    in_stock: apiProduct.in_stock,
    image_single: apiProduct.image_single,
    image_all: apiProduct.image_all,
    prices: apiProduct.prices,
  };
};

