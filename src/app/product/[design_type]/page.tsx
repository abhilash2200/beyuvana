"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fallbackProducts, Product } from "../../data/fallbackProducts";
import { designSlugToProductId } from "../../data/productConfigs";
import { slugify } from "@/lib/utils";
import { toast } from "react-toastify";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { productsApi } from "@/lib/api/products";
import { useAuth } from "@/context/AuthProvider";

const Product1Layout = dynamic(
  () => import("@/components/product/Product1Layout"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        Loading product...
      </div>
    ),
  },
);

const Product2Layout = dynamic(
  () => import("@/components/product/Product2Layout"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        Loading product...
      </div>
    ),
  },
);

/**
 * Determines design type from URL slug
 * Returns "GREEN" or "PINK" based on slug or product mapping
 */
const getDesignTypeFromSlug = async (
  slug: string,
): Promise<"GREEN" | "PINK" | null> => {
  // Check if slug maps to a known product ID
  const mappedProductId = designSlugToProductId[slug];
  if (mappedProductId) {
    const fallbackProduct = fallbackProducts.find(
      (p) => p.id === mappedProductId,
    );
    if (fallbackProduct?.design_type) {
      return fallbackProduct.design_type;
    }
  }

  // Check if slug contains design type keywords
  const lowerSlug = slug.toLowerCase();
  if (lowerSlug.includes("green") || lowerSlug.includes("collagen-green")) {
    return "GREEN";
  }
  if (
    lowerSlug.includes("pink") ||
    lowerSlug.includes("collagen-pink") ||
    lowerSlug.includes("glow")
  ) {
    return "PINK";
  }

  // Try to find in fallbackProducts by slugified name
  const fallbackProduct = fallbackProducts.find(
    (p) => slugify(p.name) === slug,
  );
  if (fallbackProduct?.design_type) {
    return fallbackProduct.design_type;
  }

  // If still not found, try to fetch from API and check design_type
  try {
    // Fetch all products to find one matching the slug
    const [greenResponse, pinkResponse] = await Promise.all([
      productsApi.getList({
        filter: { design_type: ["green", "GREEN"] },
        page: 1,
        limit: 100,
      }),
      productsApi.getList({
        filter: { design_type: ["pink", "PINK"] },
        page: 1,
        limit: 100,
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
    const allProducts = [...greenList, ...pinkList];

    // Try to find product by slugified name
    const matchingProduct = allProducts.find((p) => {
      const productSlug = slugify(p.product_name || "");
      return (
        productSlug === slug ||
        productSlug.includes(slug) ||
        slug.includes(productSlug)
      );
    });

    if (matchingProduct?.design_type) {
      const dt = matchingProduct.design_type.toString().toUpperCase();
      return dt === "GREEN" || dt === "PINK" ? (dt as "GREEN" | "PINK") : null;
    }

    // If product found but no design_type, check which list it came from
    if (greenList.some((p) => slugify(p.product_name || "") === slug)) {
      return "GREEN";
    }
    if (pinkList.some((p) => slugify(p.product_name || "") === slug)) {
      return "PINK";
    }
  } catch (error) {
    // Error fetching products to determine design type
  }

  // Last resort: default to GREEN if slug suggests it, otherwise return null
  // This handles edge cases where we can't determine but want to show something
  if (lowerSlug.length > 0) {
    // If slug has any green-related terms, default to GREEN
    if (
      lowerSlug.includes("collagen") ||
      lowerSlug.includes("builder") ||
      lowerSlug.includes("anti-aging")
    ) {
      return "GREEN";
    }
    // If slug has pink-related terms, default to PINK
    if (lowerSlug.includes("essence") || lowerSlug.includes("radiance")) {
      return "PINK";
    }
  }

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

  // Combine images: Local images first, then API images (no duplicates)
  const localImages = localProduct?.images || [];
  const apiImages =
    apiProducts.length > 0
      ? apiProducts
          .flatMap((p) => p.images || [])
          .filter((img, idx, arr) => arr.indexOf(img) === idx)
      : [];
  const combinedImages = [
    ...localImages,
    ...apiImages.filter((img) => !localImages.includes(img)),
  ];

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

    // Images: Combined LOCAL + API (local first)
    images:
      combinedImages.length > 0
        ? combinedImages
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
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Determine design type from slug
        const designType = await getDesignTypeFromSlug(slug);

        if (!designType) {
          setError(`Unable to determine product design type for: ${slug}`);
          toast.error(`Product not found: ${slug}`);
          setLoading(false);
          return;
        }

        // Step 2: Get local fallback product for rich content (FAQs, action items, etc.)
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
          limit: 100,
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

        setProduct(mergedProduct);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load product";
        setError(errorMessage);
        toast.error("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#057A37] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
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

  const LayoutComponent =
    product.design_type === "GREEN" ? Product1Layout : Product2Layout;

  return (
    <ErrorBoundary>
      <LayoutComponent product={product} />
    </ErrorBoundary>
  );
};

export default ProductDetailPage;
