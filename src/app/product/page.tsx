import { Suspense, lazy } from "react";
import ProductsLists from "@/components/product/ProductsLists";
import { productsApi, convertToLegacyProduct } from "@/lib/api/products";
import { handleError } from "@/lib/error-handling";
import type { ComboProductData } from "@/components/product/ComboProduct";
import type { Product, PriceTier } from "@/lib/api/types";

// Lazy load ComboProduct component (below the fold)
const ComboProduct = lazy(() => import("@/components/product/ComboProduct"));

// Loading skeleton components
const ProductsLoader = () => (
  <div className="animate-pulse space-y-8 py-10">
    {[1, 2, 3].map((i) => (
      <div key={i} className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-8">
          <div className="w-full md:w-[35%] h-96 bg-gray-200 rounded-lg"></div>
          <div className="w-full md:w-[60%] space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ComboLoader = () => (
  <div className="animate-pulse py-10">
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded w-64 mb-8 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

async function fetchProducts() {
  try {
    const [greenResponse, pinkResponse] = await Promise.all([
      productsApi.getList({
        filter: {
          design_type: ["green", "GREEN"],
        },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
      }),
      productsApi.getList({
        filter: {
          design_type: ["pink", "PINK"],
          // Exclude combo products - if product_type exists and is "combo", exclude it
        },
        sort: { id: "DESC" },
        page: 1,
        limit: 50,
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

    const combinedList = [...greenList, ...pinkList];

    // Filter out combo products before converting
    const filteredList = combinedList.filter((product: Product) => {
      // Check multiple possible field names and values for combo products
      const productType = product.product_type;
      const category = product.category || product.categorykey;
      const productName = product.product_name || "";

      // Check if it's a combo product by:
      // 1. product_type field equals "combo"
      // 2. category contains "combo"
      // 3. product name contains "combo" (case-insensitive)
      const isComboByType =
        productType &&
        typeof productType === "string" &&
        productType.toLowerCase() === "combo";
      const isComboByCategory =
        category &&
        typeof category === "string" &&
        category.toLowerCase().includes("combo");
      const isComboByName = productName.toLowerCase().includes("combo");

      const isCombo = isComboByType || isComboByCategory || isComboByName;

      return !isCombo;
    });

    const all = filteredList.map(convertToLegacyProduct);

    return all.sort((a, b) => {
      if (a.design_type === "green" && b.design_type === "pink") return -1;
      if (a.design_type === "pink" && b.design_type === "green") return 1;

      return b.id - a.id;
    });
  } catch (err) {
    handleError(err, {
      context: "product/page",
      userMessage: "Failed to fetch products. Please try again.",
      showToast: false, // Server component - can't show toast
      silent: false, // But still log it
    });
    return [];
  }
}

async function fetchComboProducts(): Promise<ComboProductData[]> {
  try {
    const response = await productsApi.getList({
      filter: { product_type: ["combo"] },
      sort: { id: "DESC" },
      page: 1,
      limit: 100,
    });

    const productsList =
      response.data && Array.isArray(response.data) ? response.data : [];

    if (productsList.length === 0) {
      return [];
    }

    // Fetch details for each combo product to get pricing information
    const detailedProducts = await Promise.all(
      productsList.map(async (apiProduct: Product) => {
        try {
          const detailsResponse = await productsApi.getDetails(apiProduct.id);
          if (!detailsResponse.data) return null;

          const productDetails = detailsResponse.data;
          const tiers: PriceTier[] = Array.isArray(productDetails.prices)
            ? productDetails.prices
            : [];

          // Get the first available tier (usually pack of 1)
          const firstTier = tiers.length > 0 ? tiers[0] : null;

          const mainImage =
            Array.isArray(productDetails.image) &&
              productDetails.image.length > 0
              ? productDetails.image[0]
              : apiProduct.image_single ||
              apiProduct.image ||
              "/assets/img/collagen-green-product.png";

          const productData: ComboProductData = {
            id: productDetails.id,
            name: productDetails.product_name,
            price: firstTier
              ? Math.round(parseFloat(firstTier.final_price) || 0)
              : Math.round(
                parseFloat(productDetails.discount_price || "0") || 0,
              ),
            mrp_price: firstTier
              ? Math.round(parseFloat(firstTier.mrp) || 0)
              : Math.round(
                parseFloat(productDetails.product_price || "0") || 0,
              ),
            image: mainImage,
            product_id: productDetails.id,
            product_price_id: firstTier ? firstTier.product_price_id : "",
            short_description: productDetails.short_description || "",
            product_description: productDetails.product_description || "",
          };

          return productData;
        } catch {
          return null;
        }
      }),
    );

    const validProducts = detailedProducts.filter(
      (product): product is ComboProductData =>
        product !== null &&
        product.product_price_id !== undefined &&
        product.product_price_id !== "",
    );

    return validProducts;
  } catch (err) {
    handleError(err, {
      context: "product/page - fetchComboProducts",
      userMessage: "Failed to fetch combo products. Please try again.",
      showToast: false,
      silent: false,
    });
    return [];
  }
}

// Separate component for products list with its own data fetching
async function ProductsSection() {
  const products = await fetchProducts();
  return <ProductsLists products={products} />;
}

// Separate component for combo products with its own data fetching
async function ComboSection() {
  const comboProducts = await fetchComboProducts();
  return <ComboProduct comboProducts={comboProducts} />;
}

const Page = () => {
  return (
    <div>
      {/* Products load independently with streaming */}
      <Suspense fallback={<ProductsLoader />}>
        <ProductsSection />
      </Suspense>

      {/* Combo products load independently (below the fold) */}
      <Suspense fallback={<ComboLoader />}>
        <ComboSection />
      </Suspense>
    </div>
  );
};

export default Page;
