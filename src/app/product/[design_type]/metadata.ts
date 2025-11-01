import type { Metadata } from "next";
import { fallbackProducts } from "../../data/fallbackProducts";
import { designSlugToProductId } from "../../data/productConfigs";
import { slugify } from "@/lib/utils";

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(designType: string): Metadata {
  const slug = String(designType || "");
  const mappedProductId = designSlugToProductId[slug];
  const product = mappedProductId
    ? fallbackProducts.find((p) => p.id === mappedProductId)
    : fallbackProducts.find((p) => slugify(p.name) === slug);

  if (!product) {
    return {
      title: "Product Not Found | BEYUVANA™",
      description: "The requested product could not be found.",
    };
  }

  const productName = product.name;
  const description = product.tagline || (product.description && product.description[0]) || `${productName} - Premium plant-based wellness supplement from BEYUVANA™`;
  const image = product.images && product.images[0] ? product.images[0] : "/assets/img/logo.png";

  return {
    title: `${productName} | BEYUVANA™`,
    description,
    keywords: [
      productName.toLowerCase(),
      "plant collagen",
      "vegetarian collagen",
      "plant-based nutrition",
      "skin wellness",
      "collagen builder",
      "natural supplements",
      product.design_type?.toLowerCase() || "",
    ].filter(Boolean),
    openGraph: {
      title: `${productName} | BEYUVANA™`,
      description,
      type: "website",
      images: [
        {
          url: image,
          width: 600,
          height: 600,
          alt: `${productName} product image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | BEYUVANA™`,
      description,
      images: [image],
    },
  };
}

