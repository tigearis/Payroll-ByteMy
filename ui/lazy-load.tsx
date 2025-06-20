"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

// ================================
// LAZY LOADING COMPONENTS
// ================================

/**
 * Lazy load component with intersection observer
 * Only renders content when it enters the viewport
 */
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function LazyLoad({
  children,
  fallback = <div className="w-full h-64 bg-neutral-100 animate-pulse rounded-md" />,
  rootMargin = "200px 0px",
  threshold = 0,
  triggerOnce = true,
}: LazyLoadProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    rootMargin,
    threshold,
  });

  return <div ref={ref}>{inView ? children : fallback}</div>;
}

// ================================
// DEFERRED DATA FETCHING
// ================================

/**
 * Deferred data fetching - only fetch when component is in view
 */
interface DeferredDataFetcherProps<T> {
  children: (data: T | null, loading: boolean) => React.ReactNode;
  fetchFn: () => Promise<T>;
  rootMargin?: string;
}

export function DeferredDataFetcher<T>({
  children,
  fetchFn,
  rootMargin = "200px 0px",
}: DeferredDataFetcherProps<T>) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin,
  });

  React.useEffect(() => {
    if (inView && !data && !loading) {
      setLoading(true);
      fetchFn()
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [inView, fetchFn, data, loading]);

  return <div ref={ref}>{children(data, loading)}</div>;
}

// ================================
// OPTIMIZED IMAGE COMPONENT
// ================================

/**
 * Optimized image with lazy loading and progressive enhancement
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  alt: string;
  src: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Low quality placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-neutral-100 animate-pulse rounded-md"
          style={{ width, height }}
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}

// ================================
// COMMON LOADING SKELETONS
// ================================

export const LoadingSkeletons = {
  Table: () => (
    <div className="w-full space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-full h-12 bg-neutral-100 animate-pulse rounded-md" />
      ))}
    </div>
  ),
  
  Chart: () => (
    <div className="w-full h-64 bg-neutral-100 animate-pulse rounded-md" />
  ),
  
  Metrics: () => (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-md" />
      ))}
    </div>
  ),
  
  Card: () => (
    <div className="w-full h-48 bg-neutral-100 animate-pulse rounded-md" />
  ),
};