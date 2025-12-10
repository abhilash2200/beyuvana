/**
 * Utility functions for mapping product images to PDFs
 *
 * Maps product images to their corresponding PDF certificates/lab reports
 */

import type { GalleryItem } from "@/components/ui/ImageGallery.types";

/**
 * PDF mapping for GREEN product (Collagen Builder)
 */
const GREEN_PDFS = [
  "/assets/pdf/BeyuvanaCollagenPowder_EQNX_001_FM_25_10_01675.pdf",
  "/assets/pdf/BeyuvanaCollagenPowder_EQNX_001_FT_25_10_01673.pdf",
  "/assets/pdf/BeyuvanaCollagenPower_EQNX_001_FT_25_10_01671.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FM_25_10_01674.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FT_25_10_01670.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FT_25_10_01672.pdf",
];

/**
 * PDF mapping for PINK product (Glow Essence)
 */
const PINK_PDFS = [
  "/assets/pdf/BeyuvanaCollagenPowder_EQNX_001_FM_25_10_01675.pdf",
  "/assets/pdf/BeyuvanaCollagenPowder_EQNX_001_FT_25_10_01673.pdf",
  "/assets/pdf/BeyuvanaCollagenPower_EQNX_001_FT_25_10_01671.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FM_25_10_01674.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FT_25_10_01670.pdf",
  "/assets/pdf/BeyuvanaSkinSupplementPowder_EQNX_001_FT_25_10_01672.pdf",
];

/**
 * Converts product images array to ImageGallery items with PDF mappings
 *
 * @param images - Array of image URLs
 * @param designType - Product design type (GREEN or PINK)
 * @param productName - Optional product name for alt text
 * @returns Array of GalleryItem objects ready for ImageGallery component
 */
export function mapProductImagesToGallery(
  images: string[],
  designType: "GREEN" | "PINK",
  productName?: string,
): GalleryItem[] {
  if (!images || images.length === 0) {
    return [];
  }

  const pdfArray = designType === "GREEN" ? GREEN_PDFS : PINK_PDFS;

  return images.map((image, index) => {
    // Map each image to a PDF (cycle through available PDFs if more images than PDFs)
    const pdfIndex = index % pdfArray.length;
    const pdf = pdfArray[pdfIndex];

    return {
      id: `product-${designType.toLowerCase()}-${index}`,
      image,
      pdf,
      alt: productName
        ? `${productName} - Image ${index + 1}`
        : `Product image ${index + 1}`,
    };
  });
}

/**
 * Gets the default PDF for a product design type
 *
 * @param designType - Product design type
 * @returns Default PDF URL
 */
export function getDefaultProductPdf(designType: "GREEN" | "PINK"): string {
  return designType === "GREEN" ? GREEN_PDFS[0] : PINK_PDFS[0];
}

/**
 * Converts certificate images array to ImageGallery items with PDF mappings
 *
 * @param certificateImages - Array of certificate image URLs
 * @param designType - Product design type (GREEN or PINK)
 * @param productName - Optional product name for alt text
 * @returns Array of GalleryItem objects ready for ImageGallery component
 */
export function mapCertificateImagesToGallery(
  certificateImages: string[],
  designType: "GREEN" | "PINK",
  productName?: string,
): GalleryItem[] {
  if (!certificateImages || certificateImages.length === 0) {
    return [];
  }

  const pdfArray = designType === "GREEN" ? GREEN_PDFS : PINK_PDFS;

  return certificateImages.map((image, index) => {
    // Map each certificate image to a PDF (cycle through available PDFs if more images than PDFs)
    const pdfIndex = index % pdfArray.length;
    const pdf = pdfArray[pdfIndex];

    return {
      id: `certificate-${designType.toLowerCase()}-${index}`,
      image,
      pdf,
      alt: productName
        ? `${productName} - Lab Certificate ${index + 1}`
        : `Lab Certificate ${index + 1}`,
    };
  });
}
