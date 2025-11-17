"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
}

export function Skeleton({ 
    className, 
    variant = "rectangular",
    width,
    height,
    animation = "pulse"
}: SkeletonProps) {
    const baseClasses = "bg-gray-200";
    
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-md",
    };

    const animationClasses = {
        pulse: "animate-pulse",
        wave: "animate-[wave_1.6s_ease-in-out_infinite]",
        none: "",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height) style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={style}
        />
    );
}

interface SkeletonProductCardProps {
    count?: number;
}

export function SkeletonProductCard({ count = 1 }: SkeletonProductCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="py-10 border-b border-gray-200">
                    <div className="max-w-[1400px] mx-auto px-4">
                        <div className="flex flex-wrap justify-between items-center gap-6">
                            {/* Image Section */}
                            <div className="w-full md:w-[35%]">
                                <Skeleton variant="rectangular" height={382} className="w-full rounded-[10px]" />
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-[65%] space-y-4">
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="40%" height={24} />
                                <Skeleton variant="text" width="100%" height={16} />
                                <Skeleton variant="text" width="90%" height={16} />
                                <Skeleton variant="text" width="30%" height={32} />
                                <Skeleton variant="rectangular" width={120} height={40} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

interface SkeletonOrderCardProps {
    count?: number;
}

export function SkeletonOrderCard({ count = 1 }: SkeletonOrderCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="py-5 border-b border-gray-300 border-dashed">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="w-full md:w-[40%] flex gap-3">
                            <Skeleton variant="rectangular" width={112} height={112} className="rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton variant="text" width="40%" height={16} />
                                <Skeleton variant="text" width="80%" height={24} />
                                <Skeleton variant="text" width="100%" height={16} />
                            </div>
                        </div>
                        <div className="w-full md:w-[20%] hidden md:block">
                            <Skeleton variant="text" width="30%" height={20} />
                        </div>
                        <div className="w-full md:w-[20%] hidden md:block">
                            <Skeleton variant="text" width="50%" height={20} />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

