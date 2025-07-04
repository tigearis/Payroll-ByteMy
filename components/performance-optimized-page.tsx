"use client";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";

// Directly import instead of lazy loading to avoid the missing modules error
import Chart from "./ui/chart";
import DataTable from "./ui/data-table";
import MetricsPanel from "./ui/metrics-panel";

// Placeholder loaders
const TableLoader = () => (
  <div className="w-full h-80 bg-neutral-100 animate-pulse rounded-md"></div>
);

const ChartLoader = () => (
  <div className="w-full h-64 bg-neutral-100 animate-pulse rounded-md"></div>
);

const MetricsLoader = () => (
  <div className="grid grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <div
        key={i}
        className="h-32 bg-neutral-100 animate-pulse rounded-md"
      ></div>
    ))}
  </div>
);

/**
 * Performance optimized page component with:
 * - Intersection Observer for lazy loading
 * - Suspense for loading states
 */
export default function PerformanceOptimizedPage() {
  // For metrics panel
  const [metricsRef, metricsInView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  // For data table
  const [tableRef, tableInView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  // For chart
  const [chartRef, chartInView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  // Sample data for the data table
  const data = React.useMemo(
    () => [
      { id: 1, name: "Client A", status: "Active", amount: "$1,200" },
      { id: 2, name: "Client B", status: "Inactive", amount: "$950" },
      { id: 3, name: "Client C", status: "Active", amount: "$3,200" },
      { id: 4, name: "Client D", status: "Pending", amount: "$750" },
      { id: 5, name: "Client E", status: "Active", amount: "$5,100" },
    ],
    []
  );

  // Sample columns for the data table
  const columns = React.useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "amount", header: "Amount" },
    ],
    []
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Performance Optimized Dashboard</h1>

      {/* Metrics Section - Load when in view */}
      <div ref={metricsRef}>
        {metricsInView ? <MetricsPanel /> : <MetricsLoader />}
      </div>

      {/* Data Table - Load when in view */}
      <div ref={tableRef}>
        {tableInView ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <TableLoader />
        )}
      </div>

      {/* Chart - Load when in view */}
      <div ref={chartRef}>
        {chartInView ? (
          <Chart type="area" title="Monthly Revenue" />
        ) : (
          <ChartLoader />
        )}
      </div>
    </div>
  );
}

// Image optimization
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  width: number;
  height: number;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className="relative" style={{ width, height }}>
      {/* Low quality placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-neutral-100 animate-pulse rounded-md"
          style={{ width, height }}
        />
      )}

      {/* Actual image */}
      <Image
        src={src as string}
        alt={alt as string}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}

// Deferred data fetching component
export function DeferredDataFetcher<T>({
  children,
  fetchFn,
}: {
  children: (data: T | null) => React.ReactNode;
  fetchFn: () => Promise<T>;
}) {
  const [data, setData] = React.useState<T | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  React.useEffect(() => {
    if (inView) {
      fetchFn().then(setData);
    }
  }, [inView, fetchFn]);

  return <div ref={ref}>{children(data)}</div>;
}
