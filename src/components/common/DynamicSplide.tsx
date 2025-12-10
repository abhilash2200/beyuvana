/**
 * Dynamic Splide Components
 * Wraps Splide imports in dynamic imports to reduce initial bundle size
 */

"use client";

import dynamic from "next/dynamic";
import "@splidejs/react-splide/css";

// Dynamically import Splide components to reduce initial bundle size
export const Splide = dynamic(
  () => import("@splidejs/react-splide").then((mod) => mod.Splide),
  {
    ssr: false,
    loading: () => <div className="flex gap-4 overflow-x-auto pb-4" />,
  },
);

export const SplideSlide = dynamic(
  () => import("@splidejs/react-splide").then((mod) => mod.SplideSlide),
  {
    ssr: false,
  },
);
