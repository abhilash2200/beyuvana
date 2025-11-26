/**
 * Image Gallery Component Types
 * 
 * Defines the data structure for the Image Gallery component
 * where each image has an associated PDF file.
 */

export interface GalleryItem {
    image: string
    pdf: string
    alt?: string
    id?: string | number
}

export interface ImageGalleryProps {
    items: GalleryItem[]
    initialIndex?: number
    className?: string
    onImageClick?: (item: GalleryItem, index: number) => void
    onPdfOpen?: (pdfUrl: string, index: number) => void
    mainImageAspect?: string
    thumbnailSize?: number
    showHoverEffects?: boolean
}

