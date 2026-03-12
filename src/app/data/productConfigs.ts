/**
 * Minimal product configuration: slug ↔ id and design type mappings.
 * No static import of fallbackProducts to keep initial bundle small.
 * Full fallback data is loaded dynamically when a product page is opened.
 */

// Slugified product names (source of truth for URLs)
const GREEN_SLUG = "beyuvana-premium-collagen-builder-complete-anti-aging-solution";
const PINK_SLUG = "beyuvana-advanced-glow-nourishing-formula-for-radiant-even-toned-skin";

// Short slugs used by generateStaticParams and some links
const GREEN_SLUG_SHORT = "collagen-green";
const PINK_SLUG_SHORT = "collagen-pink";

export const productDesignSlugs: Record<number, string> = {
  1: GREEN_SLUG,
  2: PINK_SLUG,
};

/** URL slug → product id (for detail page resolution) */
export const designSlugToProductId: Record<string, number> = {
  [GREEN_SLUG]: 1,
  [PINK_SLUG]: 2,
  [GREEN_SLUG_SHORT]: 1,
  [PINK_SLUG_SHORT]: 2,
};

/** URL slug → design type (avoids loading fallbackProducts for type detection) */
export const designSlugToDesignType: Record<string, "GREEN" | "PINK"> = {
  [GREEN_SLUG]: "GREEN",
  [PINK_SLUG]: "PINK",
  [GREEN_SLUG_SHORT]: "GREEN",
  [PINK_SLUG_SHORT]: "PINK",
};

export const designTypeToSlug: Record<string, string> = {
  GREEN: GREEN_SLUG,
  green: GREEN_SLUG,
  PINK: PINK_SLUG,
  pink: PINK_SLUG,
};

export const backendProductIdMap: Record<number, number> = {
  1: 6,
  2: 6,
};
