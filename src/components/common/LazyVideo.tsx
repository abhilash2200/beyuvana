"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export interface LazyVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  /** Root margin for when to load (default: "100px") */
  rootMargin?: string;
}

/**
 * Video that only loads its source when the element is in (or near) the viewport.
 * Uses preload="metadata" and optional poster to avoid full download until visible.
 */
export function LazyVideo({
  src,
  poster,
  rootMargin = "100px",
  preload = "metadata",
  ...rest
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      if (entries[0]?.isIntersecting && !loadedSrc) {
        setLoadedSrc(src);
      }
    },
    [src, loadedSrc]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, handleIntersect]);

  return (
    <video
      ref={ref}
      src={loadedSrc ?? undefined}
      poster={poster}
      preload={loadedSrc ? preload : "none"}
      {...rest}
    />
  );
}

export default LazyVideo;
