"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import type { PriceTier } from "@/lib/api";
import { productDesignSlugs } from "@/app/data/productConfigs";
import ProductRating from "./ProductRating";

// Product interface
export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description: string[];
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  bgColor: string;
  design_type?: "green" | "pink";
  category?: string;
  categorykey?: string;
  brand?: string;
  brandkey?: string;
  product_code?: string;
  sku_number?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  image_single?: string;
  image_all?: string[];
  prices?: PriceTier[];
}

interface ProductsListsProps {
  products: Product[];
}

const ProductsLists = React.memo(function ProductsLists({ products }: ProductsListsProps) {
  const formatINR = (value: number): string => {
    const rounded = Math.round(value || 0);
    return new Intl.NumberFormat("en-IN").format(rounded);
  };

  const getProductDetailUrl = (product: Product): string => {
    // Use design slug if available, otherwise fallback to slugified name
    const designSlug = productDesignSlugs[product.id];
    return designSlug ? `/product/${designSlug}` : `/product/${slugify(product.name)}`;
  };

  return (
    <>
      {products.map((product, index) => (
        <section key={product.id} className={`py-10 ${index % 2 === 1 ? "bg-[#F8F8F8]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">

              {/* Image Section */}
              <div className="w-full md:w-[35%]">
                <Link href={getProductDetailUrl(product)} className="flex items-center justify-center">
                  <div
                    className="p-6 flex items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    <Image
                      src={product.image || "/assets/img/green-product.png"}
                      width={332}
                      height={382}
                      alt={`${product.name} product image`}
                      className="object-contain"
                      loading={index > 1 ? "lazy" : "eager"}
                      priority={index <= 1}
                    />
                  </div>
                </Link>
                {Array.isArray(product.image_all) && product.image_all.length > 1 && (
                  <div className="mt-3 flex gap-2 flex-wrap items-center justify-center">
                    {product.image_all.slice(0, 5).map((img, idx) => (
                      <div key={idx} className="w-14 h-14 border rounded-md overflow-hidden bg-white flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`${product.name} additional view ${idx + 1}`}
                          width={56}
                          height={56}
                          className="object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="w-full md:w-[65%]">
                <div className="flex flex-col">
                  <Link href={getProductDetailUrl(product)} className="flex items-center justify-start">
                    <h2 className="text-[#1A2819] hover:text-[#057A37] hover:cursor-pointer font-[Grafiels] text-[25px] leading-tight mb-4">{product.name}</h2>
                  </Link>
                  <div>
                    {index === 0 && product.tagline && <p className="inline-flex border border-black rounded-[5px] py-2 px-2 mb-3">{product.tagline}</p>}
                  </div>
                  {/* <div className="flex flex-wrap gap-2 items-center mb-3 text-[12px] text-[#555]">
                    {product.brand && <span className="px-2 py-1 border rounded">Brand: {product.brand}</span>}
                    {product.category && <span className="px-2 py-1 border rounded">Category: {product.category}</span>}
                    {product.design_type && <span className="px-2 py-1 border rounded capitalize">Design: {product.design_type}</span>}
                    {product.in_stock && (
                      <span className={`px-2 py-1 border rounded ${product.in_stock === "INSTOCK" ? "border-green-600 text-green-700" : "border-red-600 text-red-700"}`}>
                        {product.in_stock === "INSTOCK" ? "In stock" : product.in_stock}
                      </span>
                    )}
                  </div> */}
                  <div className="flex gap-x-4 items-center mb-3">
                    <ProductRating
                      productId={product.id}
                      className="text-[12px]"
                    />
                  </div>
                  {index === 1 && (
                    <div>
                      <p className="mb-3 text-[15px]">{product.short_description}</p>
                    </div>
                  )}
                  {product.description.map((desc, i) => (
                    <p key={i} className="text-[15px] mb-3">{desc}</p>
                  ))}
                  <h3 className="text-[#1A2819] text-[25px] mb-3 font-semibold leading-tight">₹{formatINR(product.price)}</h3>
                  <p className="text-[15px] mb-4">
                    <span className="line-through text-gray-500 text-[12px]">₹{formatINR(product.originalPrice)}</span>{" "}
                    <span className="text-[#057A37] font-semibold">{product.discount}</span>
                  </p>

                  {(() => {
                    const packPrices = Array.isArray(product.prices)
                      ? product.prices.filter(tier => tier.unit_name === "Pack of")
                      : [];
                    return packPrices.length > 0 ? (
                      <div className="mb-4">
                        <div className="text-[13px] text-[#1A2819] font-semibold mb-2">Available options</div>
                        <div className="flex md:grid md:grid-cols-4 gap-2 md:w-[65%] w-[100%] overflow-x-auto md:overflow-x-visible">
                          {packPrices.slice(0, 6).map((tier, idx) => (
                            <div key={idx} className="border border-[#057A37] rounded-[15px] px-3 py-2 bg-[#EBF2EC] min-w-[130px] md:min-w-0">
                              <div className="flex items-center justify-between text-[13px] mb-1 md:mb-0">
                                <span>{tier.unit_name} {tier.qty}</span>
                                <span className="text-[#057A37] font-medium">₹{formatINR(Math.round(parseFloat(tier.final_price)))}</span>
                              </div>
                              <div className="text-[11px] text-[#777]">
                                <span className="line-through">₹{formatINR(Math.round(parseFloat(tier.mrp)))}</span>
                                {tier.discount_off_inpercent && parseFloat(tier.discount_off_inpercent) > 0 && (
                                  <span className="ml-2">{tier.discount_off_inpercent}% Off</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="flex gap-4">
                    <Link href={getProductDetailUrl(product)}>
                      <Button
                        className="flex items-center gap-2 rounded-[10px] py-2 px-4 font-normal capitalize transition-colors bg-[#057A37] text-white border-[#057A37] hover:bg-[#04662a]"
                        aria-label={`View more details about ${product.name}`}
                      >
                        view more
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}
    </>
  );
});

ProductsLists.displayName = "ProductsLists";

export default ProductsLists;
