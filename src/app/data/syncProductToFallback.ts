/**
 * Utility to help sync API products to local fallbackProducts
 * This can be used to generate fallback product data from API responses
 */

import type { ProductDetailsResponse } from "@/lib/api/types";
import type { Product } from "./fallbackProducts";

/**
 * Converts ProductDetailsResponse from API to a Product object that can be added to fallbackProducts
 * This creates a minimal product structure - you'll need to add rich content like actionItems, whyItems, etc.
 */
export const convertApiToFallbackProduct = (
    apiProduct: ProductDetailsResponse,
    options?: {
        // Override product ID if needed (useful when backend ID differs from frontend ID)
        overrideId?: number;
        // Add custom rich content
        actionItems?: Product["actionItems"];
        whyItems?: Product["whyItems"];
        compare?: Product["compare"];
        builder?: Product["builder"];
        plants?: Product["plants"];
        tabItems?: Product["tabItems"];
        faq?: Product["faq"];
        certificateImg?: string;
        certificateImages?: string[];
    }
): Product => {
    const normalizedDesign = (() => {
        const dt = apiProduct.design_type;
        if (!dt) return undefined;
        const upper = typeof dt === "string" ? dt.toUpperCase() : "";
        return upper === "GREEN" || upper === "PINK" ? (upper as "GREEN" | "PINK") : undefined;
    })();

    return {
        id: options?.overrideId ?? parseInt(apiProduct.id),
        name: apiProduct.product_name,
        tagline: apiProduct.short_description,
        description: apiProduct.product_description
            ? [apiProduct.product_description]
            : apiProduct.short_description
                ? [apiProduct.short_description]
                : [],
        images: Array.isArray(apiProduct.image) && apiProduct.image.length > 0
            ? apiProduct.image
            : ["/assets/img/green-product.png"],
        design_type: normalizedDesign,
        // Rich content from options or undefined
        actionItems: options?.actionItems,
        whyItems: options?.whyItems,
        compare: options?.compare,
        builder: options?.builder,
        plants: options?.plants,
        tabItems: options?.tabItems,
        faq: options?.faq,
        certificateImg: options?.certificateImg,
        certificateImages: options?.certificateImages,
    };
};

/**
 * Generates a TypeScript code snippet for adding a product to fallbackProducts array
 * Copy the output and paste it into fallbackProducts.ts
 */
export const generateFallbackProductCode = (product: Product): string => {
    return `
  {
    id: ${product.id},
    name: "${product.name}",
    design_type: "${product.design_type || "GREEN"}",
    tagline: ${product.tagline ? `"${product.tagline}"` : "undefined"},
    description: [${product.description?.map(d => `"${d}"`).join(", ") || ""}],
    images: [${product.images.map(img => `"${img}"`).join(", ")}],
    ${product.certificateImg ? `certificateImg: "${product.certificateImg}",` : ""}
    ${product.certificateImages ? `certificateImages: [${product.certificateImages.map(img => `"${img}"`).join(", ")}],` : ""}
    // Add actionItems, whyItems, compare, builder, plants, tabItems, faq as needed
  },
`;
};

