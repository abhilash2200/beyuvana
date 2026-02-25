import Product1Layout from "@/components/product/Product1Layout";
import Product2Layout from "@/components/product/Product2Layout";
import { slugify } from "@/lib/utils";
import { fallbackProducts } from "@/app/data/fallbackProducts";

export const productConfigs = {
  1: { layout: Product1Layout },
  2: { layout: Product2Layout },
};

// Detail page slug = slugified product name (one source of truth from fallback product names)
const greenSlug = slugify(
  fallbackProducts.find((p) => p.design_type === "GREEN")?.name ?? "premium-collagen-builder",
);
const pinkSlug = slugify(
  fallbackProducts.find((p) => p.design_type === "PINK")?.name ?? "glow-essence",
);

// Mapping between product ids and detail slugs (slug = product name)
export const productDesignSlugs: Record<number, string> = {
  1: greenSlug,
  2: pinkSlug,
};

// Slug in URL -> product id (for detail page resolution)
export const designSlugToProductId: Record<string, number> = {
  [greenSlug]: 1,
  [pinkSlug]: 2,
};

export const designTypeToSlug: Record<string, string> = {
  GREEN: greenSlug,
  green: greenSlug,
  PINK: pinkSlug,
  pink: pinkSlug,
};

export const backendProductIdMap: Record<number, number> = {
  1: 6,
  2: 6,
};
