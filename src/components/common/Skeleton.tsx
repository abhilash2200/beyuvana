/**
 * Reusable Skeleton Components
 * Provides loading states for various UI elements
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200", className)}
            aria-label="Loading"
            role="status"
        />
    );
}

/**
 * Product Card Skeleton
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full" />
        </div>
    );
}

/**
 * Cart Item Skeleton
 */
export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 border-b border-gray-200">
            <Skeleton className="h-20 w-20 rounded" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
            </div>
        </div>
    );
}

/**
 * Review Skeleton
 */
export function ReviewSkeleton() {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Order Item Skeleton
 */
export function OrderItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 border border-gray-200 rounded-lg">
            <Skeleton className="h-24 w-24 rounded" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/4" />
            </div>
        </div>
    );
}

