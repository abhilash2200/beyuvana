"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Product } from "../../data/productTypes";
import {
  designSlugToProductId,
  designSlugToDesignType,
} from "../../data/productConfigs";
import { slugify } from "@/lib/utils";
import { toast } from "react-toastify";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { productsApi } from "@/lib/api/products";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LazySection } from "@/components/common/LazySection";
import { SkeletonProductCard } from "@/components/common/SkeletonLoader";

const Product1Layout = dynamic(
  () => import("@/components/product/Product1Layout"),
  { ssr: false },
);

const Product2Layout = dynamic(
  () => import("@/components/product/Product2Layout"),
  { ssr: false },
);

const designTypeCache = new Map<string, "GREEN" | "PINK" | null>();

/**
 * Determines design type from URL slug. Uses lightweight config first;
 * loads fallbackProducts only when necessary (unknown slug or API fallback).
 */
const getDesignTypeFromSlug = async (
  slug: string,
): Promise<"GREEN" | "PINK" | null> => {
  if (designTypeCache.has(slug)) {
    return designTypeCache.get(slug)!;
  }

  const designType = designSlugToDesignType[slug];
  if (designType) {
    designTypeCache.set(slug, designType);
    return designType;
  }

  const lowerSlug = slug.toLowerCase();
  if (lowerSlug.includes("green") || lowerSlug.includes("collagen-green")) {
    designTypeCache.set(slug, "GREEN");
    return "GREEN";
  }
  if (
    lowerSlug.includes("pink") ||
    lowerSlug.includes("collagen-pink") ||
    lowerSlug.includes("glow")
  ) {
    designTypeCache.set(slug, "PINK");
    return "PINK";
  }

  if (
    lowerSlug.includes("collagen") ||
    lowerSlug.includes("builder") ||
    lowerSlug.includes("anti-aging")
  ) {
    designTypeCache.set(slug, "GREEN");
    return "GREEN";
  }
  if (lowerSlug.includes("essence") || lowerSlug.includes("radiance")) {
    designTypeCache.set(slug, "PINK");
    return "PINK";
  }

  try {
    const { fallbackProducts } = await import("../../data/fallbackProducts");
    const fallbackProduct = fallbackProducts.find(
      (p) => slugify(p.name) === slug,
    );
    if (fallbackProduct?.design_type) {
      designTypeCache.set(slug, fallbackProduct.design_type);
      return fallbackProduct.design_type;
    }

    const [greenResponse, pinkResponse] = await Promise.all([
      productsApi.getList({
        filter: { design_type: ["green", "GREEN"] },
        page: 1,
        limit: 20,
      }),
      productsApi.getList({
        filter: { design_type: ["pink", "PINK"] },
        page: 1,
        limit: 20,
      }),
    ]);

    const greenList =
      greenResponse.data && Array.isArray(greenResponse.data)
        ? greenResponse.data
        : [];
    const pinkList =
      pinkResponse.data && Array.isArray(pinkResponse.data)
        ? pinkResponse.data
        : [];

    const matchingProduct = [...greenList, ...pinkList].find((p) => {
      const productSlug = slugify(p.product_name || "");
      return (
        productSlug === slug ||
        productSlug.includes(slug) ||
        slug.includes(productSlug)
      );
    });

    if (matchingProduct?.design_type) {
      const dt = matchingProduct.design_type.toString().toUpperCase();
      const result =
        dt === "GREEN" || dt === "PINK" ? (dt as "GREEN" | "PINK") : null;
      if (result) designTypeCache.set(slug, result);
      return result;
    }

    if (greenList.some((p) => slugify(p.product_name || "") === slug)) {
      designTypeCache.set(slug, "GREEN");
      return "GREEN";
    }
    if (pinkList.some((p) => slugify(p.product_name || "") === slug)) {
      designTypeCache.set(slug, "PINK");
      return "PINK";
    }
  } catch {
    // Fall through to null
  }

  designTypeCache.set(slug, null);
  return null;
};

/**
 * Merges local fallback product (rich content) with API products (actual product data)
 * All products of the same design type share the same page with merged data
 * Priority: Local data > API data (for name, description, images)
 */
const mergeProductData = (
  designType: "GREEN" | "PINK",
  localProduct: Product | null,
  apiProducts: Product[],
): Product => {
  // Priority: Use local product as base if available, otherwise use first API product
  const baseProduct =
    localProduct || (apiProducts.length > 0 ? apiProducts[0] : null);

  if (!baseProduct) {
    throw new Error(`No product data found for design type: ${designType}`);
  }

  // Merge strategy:
  // - Name, tagline, description: Prefer LOCAL (has rich content), fallback to API
  // - Images: Combine LOCAL + API (local first, then API)
  // - Rich content: Always from LOCAL (actionItems, whyItems, etc.)
  // - ID: Use from API if available (for cart/API operations), otherwise local

  // Images: from product list API image_all only (no local images)
  const apiImages =
    apiProducts.length > 0
      ? apiProducts
        .flatMap((p) => p.images || [])
        .filter((img, idx, arr) => arr.indexOf(img) === idx)
      : [];

  return {
    // ID: Use API product ID if available (for backend operations), otherwise local
    id:
      apiProducts.length > 0
        ? apiProducts[0].id
        : localProduct?.id || baseProduct.id,

    // Name: Prefer LOCAL (has proper formatting), fallback to API
    name:
      localProduct?.name ||
      apiProducts[0]?.name ||
      baseProduct.name ||
      `BEYUVANA™ ${designType === "GREEN" ? "Premium Collagen Builder" : "Glow Essence"}`,

    // Tagline: Prefer LOCAL, fallback to API
    tagline:
      localProduct?.tagline || apiProducts[0]?.tagline || baseProduct.tagline,

    // Description: Prefer LOCAL (has rich formatted content), fallback to API
    description: localProduct?.description?.length
      ? localProduct.description
      : apiProducts[0]?.description?.length
        ? apiProducts[0].description
        : baseProduct.description || [],

    // Images: from product list API image_all only
    images:
      apiImages.length > 0
        ? apiImages
        : designType === "GREEN"
          ? ["/assets/img/green-product.png"]
          : ["/assets/img/pink-product.png"],

    design_type: designType,

    // Rich content: ALWAYS from LOCAL (these are not in API)
    certificateImg: localProduct?.certificateImg,
    certificateImages: localProduct?.certificateImages,
    actionItems: localProduct?.actionItems,
    whyItems: localProduct?.whyItems,
    compare: localProduct?.compare,
    compareProduct: localProduct?.compareProduct,
    builder: localProduct?.builder,
    plants: localProduct?.plants,
    tabItems: localProduct?.tabItems,
    faq: localProduct?.faq,
    customFaq: localProduct?.customFaq,
  };
};

const ProductDetailPage = () => {
  const { design_type } = useParams() as { design_type?: string };
  const slug = String(design_type || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const designType = await getDesignTypeFromSlug(slug);

      if (!designType) {
        setError(`Unable to determine product design type for: ${slug}`);
        toast.error(`Product not found: ${slug}`);
        setLoading(false);
        return;
      }

      let layoutPromise: Promise<unknown> | undefined;
      if (designType === "GREEN") {
        layoutPromise = import("@/components/product/Product1Layout");
      } else if (designType === "PINK") {
        layoutPromise = import("@/components/product/Product2Layout");
      }

      const { fallbackProducts } = await import("../../data/fallbackProducts");
      const localProduct =
        fallbackProducts.find((p) => p.design_type === designType) || null;

      // Step 3: Fetch ALL products of this design type from API
      const apiResponse = await productsApi.getList({
        filter: {
          design_type:
            designType === "GREEN" ? ["green", "GREEN"] : ["pink", "PINK"],
        },
        sort: { id: "DESC" },
        page: 1,
        limit: 50, // Reduced from 100
      });

      const apiProductsList =
        apiResponse.data && Array.isArray(apiResponse.data)
          ? apiResponse.data
          : [];

      // Step 4: Convert API products to Product format
      const convertedApiProducts: Product[] = apiProductsList.map(
        (apiProduct) => {
          // Get images from API product
          const images =
            apiProduct.image_all &&
              Array.isArray(apiProduct.image_all) &&
              apiProduct.image_all.length > 0
              ? apiProduct.image_all
              : apiProduct.image_single
                ? [apiProduct.image_single]
                : apiProduct.image
                  ? Array.isArray(apiProduct.image)
                    ? apiProduct.image
                    : [apiProduct.image]
                  : [];

          return {
            id: parseInt(apiProduct.id),
            name: apiProduct.product_name,
            tagline: apiProduct.short_description,
            description: apiProduct.product_description
              ? [apiProduct.product_description]
              : apiProduct.short_description
                ? [apiProduct.short_description]
                : [],
            images:
              images.length > 0
                ? images
                : designType === "GREEN"
                  ? ["/assets/img/green-product.png"]
                  : ["/assets/img/pink-product.png"],
            design_type: designType,
            // Rich content comes from local fallback
            faq: undefined,
            customFaq: undefined,
            certificateImg: undefined,
            certificateImages: undefined,
            actionItems: undefined,
            whyItems: undefined,
            compare: undefined,
            builder: undefined,
            plants: undefined,
            tabItems: undefined,
          };
        },
      );

      // Step 5: Merge local (rich content) + API (product data) products
      const mergedProduct = mergeProductData(
        designType,
        localProduct,
        convertedApiProducts,
      );

      // Wait for layout component to load if it's still pending
      // This ensures we merge the data loading and code loading into a single spinner
      if (layoutPromise) {
        await layoutPromise;
      }

      setProduct(mergedProduct);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load product";
      setError(errorMessage);
      toast.error("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Memoize the layout component selection
  const LayoutComponent = useMemo(
    () => (product?.design_type === "GREEN" ? Product1Layout : Product2Layout),
    [product?.design_type],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner
          size="lg"
          color="#057A37"
          text="Loading product..."
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">
          {error || "Invalid product or design type"}
        </p>
        <p className="text-gray-600">
          Please try again or go back to the product list.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LazySection
        rootMargin="200px"
        skeleton={<SkeletonProductCard count={1} />}
        className="bg-white"
      >
        <LayoutComponent product={product} />
      </LazySection>
    </ErrorBoundary>
  );
};

export default ProductDetailPage;
