"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageGalleryDialogProps {
    images: string[]
    trigger: React.ReactNode
    title?: string
    initialIndex?: number
}

export default function ImageGalleryDialog({ images, trigger, title, initialIndex = 0 }: ImageGalleryDialogProps) {
    const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images])
    const [selectedIndex, setSelectedIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(safeImages.length - 1, 0)))

    const goPrev = () => {
        if (!safeImages.length) return
        setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
    }

    const goNext = () => {
        if (!safeImages.length) return
        setSelectedIndex((prev) => (prev + 1) % safeImages.length)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-4 sm:p-6 bg-white">
                {title && (
                    <DialogHeader className="border-b border-gray-200 pb-4">
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                )}

                <div className="flex flex-col gap-4 p-4">
                    <div className="relative w-full rounded-lg overflow-hidden">
                        <div className="aspect-[4/3] w-full flex items-center justify-center bg-white">
                            {safeImages[selectedIndex] && (
                                <Image
                                    src={safeImages[selectedIndex]}
                                    alt={`Image ${selectedIndex + 1}`}
                                    width={1000}
                                    height={750}
                                    className="object-contain w-full h-full"
                                    priority
                                />
                            )}
                        </div>

                        {safeImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 border rounded-full p-2 shadow-md transition hover:cursor-pointer"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 border rounded-full p-2 shadow-md transition hover:cursor-pointer"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {safeImages.length > 1 && (
                        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-1">
                            {safeImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`rounded-md border p-1 transition ${selectedIndex === idx ? "border-green-600 ring-2 ring-green-200" : "border-transparent"}`}
                                    aria-label={`Select image ${idx + 1}`}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx + 1}`} width={96} height={96} className="object-contain w-24 h-24 rounded" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}


