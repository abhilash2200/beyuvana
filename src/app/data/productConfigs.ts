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