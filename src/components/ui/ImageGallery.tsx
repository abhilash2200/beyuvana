"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { FileText, ExternalLink } from "lucide-react"
import type { ImageGalleryProps, GalleryItem } from "./ImageGallery.types"

export default function ImageGallery({
    items,
    initialIndex = 0,
    className = "",
    onImageClick,
    onPdfOpen,
    mainImageAspect = "aspect-[4/3]",
    thumbnailSize = 80,
    showHoverEffects = true,
}: ImageGalleryProps) {
    // Validate and filter items
    const validItems = useMemo(() => {
        return Array.isArray(items)
            ? items.filter((item) => item?.image && item?.pdf)
            : []
    }, [items])

    // Initialize selected index with bounds checking
    const [selectedIndex, setSelectedIndex] = useState(() => {
        const valid = Array.isArray(items)
            ? items.filter((item) => item?.image && item?.pdf)
            : []
        if (valid.length === 0) return 0
        return Math.min(Math.max(initialIndex, 0), valid.length - 1)
    })

    // Get current selected item
    const currentItem: GalleryItem | null = validItems[selectedIndex] || null

    // Handle main image click - opens PDF in new tab
    const handleMainImageClick = useCallback(() => {
        if (!currentItem) return

        // Open PDF in new tab
        window.open(currentItem.pdf, "_blank", "noopener,noreferrer")

        // Trigger callbacks
        onImageClick?.(currentItem, selectedIndex)
        onPdfOpen?.(currentItem.pdf, selectedIndex)
    }, [currentItem, selectedIndex, onImageClick, onPdfOpen])

    // Handle thumbnail click - changes main image
    const handleThumbnailClick = useCallback(
        (index: number) => {
            if (index < 0 || index >= validItems.length) return
            setSelectedIndex(index)
        },
        [validItems.length]
    )

    // Early return if no valid items
    if (validItems.length === 0) {
        return (
            <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
                <p>No images available</p>
            </div>
        )
    }

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {/* Main Image Section */}
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                <div className={`${mainImageAspect} w-full flex items-center justify-center relative`}>
                    {currentItem && (
                        <>
                            <Image
                                src={currentItem.image}
                                alt={currentItem.alt || `Gallery image ${selectedIndex + 1}`}
                                width={1200}
                                height={900}
                                className={`object-contain w-full h-full transition-transform duration-300 ${
                                    showHoverEffects ? "hover:scale-105 cursor-pointer" : ""
                                }`}
                                priority={selectedIndex === 0}
                                quality={90}
                            />

                            {/* Click overlay with PDF indicator */}
                            <button
                                type="button"
                                onClick={handleMainImageClick}
                                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/0 hover:bg-black/10 transition-all duration-300 group"
                                aria-label={`Open PDF for image ${selectedIndex + 1}`}
                            >
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-[5px] hover:cursor-pointer hover:shadow-md">
                                    <FileText className="w-5 h-5 text-gray-700" />
                                    <span className="text-sm font-medium text-gray-700">View PDF</span>
                                    <ExternalLink className="w-4 h-4 text-gray-500" />
                                </div>
                            </button>
                        </>
                    )}
                </div>

                {/* PDF indicator badge (always visible) */}
                {currentItem && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-medium text-gray-700">
                        <FileText className="w-4 h-4" />
                        <span>PDF Available</span>
                    </div>
                )}
            </div>

            {/* Thumbnails Section */}
            {validItems.length > 1 && (
                <div className="w-full">
                    <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {validItems.map((item, index) => {
                            const isActive = index === selectedIndex

                            return (
                                <button
                                    key={item.id || index}
                                    type="button"
                                    onClick={() => handleThumbnailClick(index)}
                                    className={`flex-shrink-0 rounded-lg border-1 transition-all duration-200 overflow-hidden ${
                                        isActive
                                            ? "border-green-600 ring-2 ring-green-200 shadow-md scale-102"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                    } ${showHoverEffects ? "hover:scale-102" : ""}`}
                                    aria-label={`Select image ${index + 1}`}
                                    aria-pressed={isActive}
                                >
                                    <div className="relative">
                                        <Image
                                            src={item.image}
                                            alt={item.alt || `Thumbnail ${index + 1}`}
                                            width={thumbnailSize}
                                            height={thumbnailSize}
                                            className={`object-cover transition-opacity duration-200 ${
                                                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                                            }`}
                                            loading="lazy"
                                        />
                                        {/* Active indicator overlay */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-green-600/10 pointer-events-none" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Image counter */}
                    <div className="mt-2 text-center text-xs text-gray-500">
                        Image {selectedIndex + 1} of {validItems.length}
                    </div>
                </div>
            )}
        </div>
    )
}

