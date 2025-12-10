"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageGallery from "./ImageGallery";
import type { GalleryItem } from "./ImageGallery.types";

interface ImageGalleryDialogWithPdfProps {
  items: GalleryItem[];
  trigger: React.ReactNode;
  title?: string;
  initialIndex?: number;
  onPdfOpen?: (pdfUrl: string, index: number) => void;
}

/**
 * ImageGalleryDialogWithPdf Component
 *
 * A dialog wrapper for ImageGallery component that displays images with PDF functionality.
 * Clicking on the main image opens its associated PDF in a new tab.
 *
 * @example
 * ```tsx
 * <ImageGalleryDialogWithPdf
 *   items={[
 *     { image: "/img1.jpg", pdf: "/pdf1.pdf" },
 *     { image: "/img2.jpg", pdf: "/pdf2.pdf" }
 *   ]}
 *   title="Lab Certificates"
 *   trigger={<button>View Certificates</button>}
 * />
 * ```
 */
export default function ImageGalleryDialogWithPdf({
  items,
  trigger,
  title,
  initialIndex = 0,
  onPdfOpen,
}: ImageGalleryDialogWithPdfProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-4 sm:p-6 bg-white">
        {title && (
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        <div className="p-4">
          <ImageGallery
            items={items}
            initialIndex={initialIndex}
            mainImageAspect="aspect-[4/3]"
            thumbnailSize={80}
            onPdfOpen={onPdfOpen}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
