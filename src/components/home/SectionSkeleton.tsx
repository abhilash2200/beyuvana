"use client";

interface SectionSkeletonProps {
  className?: string;
  height?: number | string;
}

/** Lightweight skeleton to reserve space and avoid layout shift while sections load */
export function SectionSkeleton({ className = "", height = 320 }: SectionSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-100 ${className}`}
      style={typeof height === "number" ? { minHeight: `${height}px` } : { minHeight: height }}
    />
  );
}

export default SectionSkeleton;
