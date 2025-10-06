import Product1Layout from "@/components/product/Product1Layout";
import Product2Layout from "@/components/product/Product2Layout";

export const productConfigs = {
  1: { layout: Product1Layout },
  2: { layout: Product2Layout },
};

// Mapping between product ids and design type slugs
export const productDesignSlugs: Record<number, string> = {
  1: "collagen-green",
  2: "collagen-pink",
};

export const designSlugToProductId: Record<string, number> = {
  "collagen-green": 1,
  "collagen-pink": 2,
};

// Map frontend product ids to backend product ids for APIs like reviews/details.
// Adjust these values to match your backend. Example: API expects product_id 6 for green.
export const backendProductIdMap: Record<number, number> = {
  1: 6,
  2: 6,
};