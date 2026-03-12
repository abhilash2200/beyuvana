import type { Metadata } from "next";
import { designSlugToProductId } from "../../data/productConfigs";

/**
 * Generate metadata for product pages. Loads fallback product data only when
 * needed (dynamic import) to avoid pulling the full dataset into the initial bundle.
 */
export async function generateProductMetadata(designType: string): Promise<Metadata> {
  const slug = String(designType || "");
  const productId = designSlugToProductId[slug];

  if (productId == null) {
    return {
      title: "Product | BEYUVANA™",
      description: "Explore BEYUVANA™ plant-powered skin nutrition.",
    };
  }

  const { fallbackProducts } = await import("../../data/fallbackProducts");
  const product = fallbackProducts.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "Product Not Found | BEYUVANA™",
      description: "The requested product could not be found.",
    };
  }

  const productName = product.name;
  const description =
    product.tagline ||
    (product.description?.[0]) ||
    `${productName} - Premium plant-based wellness supplement from BEYUVANA™`;
  const image = product.images?.[0] ?? "/assets/img/logo.png";

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
      product.design_type?.toLowerCase() ?? "",
    ].filter(Boolean),
    openGraph: {
      title: `${productName} | BEYUVANA™`,
      description,
      type: "website",
      images: [
        { url: image, width: 600, height: 600, alt: `${productName} product image` },
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
