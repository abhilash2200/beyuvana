"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface LazySectionProps {
  children: ReactNode;
  /** Root margin for IntersectionObserver (default: "200px") */
  rootMargin?: string;
  /** Minimum height to reserve before content loads (reduces layout shift) */
  minHeight?: number | string;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional skeleton to render before the section becomes visible */
  skeleton?: ReactNode;
}

/**
 * Renders children only when the section enters the viewport.
 * Uses IntersectionObserver for efficient, low-overhead lazy loading.
 */
export function LazySection({
  children,
  rootMargin = "200px",
  minHeight,
  className,
  skeleton,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasObserved = useRef(false);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting || hasObserved.current) return;
      hasObserved.current = true;
      setIsVisible(true);
    },
    []
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

  const style =
    !isVisible && !skeleton && minHeight != null ? { minHeight } : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : skeleton ?? null}
    </div>
  );
}

export default LazySection;
