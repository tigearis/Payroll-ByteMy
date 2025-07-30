// lib/charts/chart-lazy.tsx
"use client";

import { Suspense, lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// CODE SPLITTING: LAZY LOAD HEAVY CHART DEPENDENCIES
// ============================================================================

/**
 * Dynamically import Recharts library
 * This reduces initial bundle size by ~120KB
 */
const LazyBarChart = lazy(async () => {
  const recharts = await import("recharts");
  
  const BarChartComponent = ({ data, config, ...props }: {
    data: any[];
    config: {
      xKey: string;
      bars: Array<{
        key: string;
        color: string;
        name?: string;
      }>;
    };
    width?: number;
    height?: number;
  }) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = recharts;
    
    return (
      <ResponsiveContainer width="100%" height={props.height || 300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip />
          {config.bars.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return { default: BarChartComponent };
});

const LazyLineChart = lazy(async () => {
  const recharts = await import("recharts");
  
  const LineChartComponent = ({ data, config, ...props }: {
    data: any[];
    config: {
      xKey: string;
      lines: Array<{
        key: string;
        color: string;
        name?: string;
      }>;
    };
    width?: number;
    height?: number;
  }) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = recharts;
    
    return (
      <ResponsiveContainer width="100%" height={props.height || 300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip />
          {config.lines.map((line) => (
            <Line 
              key={line.key} 
              type="monotone" 
              dataKey={line.key} 
              stroke={line.color} 
              name={line.name || line.key} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return { default: LineChartComponent };
});

const LazyPieChart = lazy(async () => {
  const recharts = await import("recharts");
  
  const PieChartComponent = ({ data, config, ...props }: {
    data: any[];
    config: {
      dataKey: string;
      nameKey: string;
      colors: string[];
    };
    width?: number;
    height?: number;
  }) => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = recharts;
    
    return (
      <ResponsiveContainer width="100%" height={props.height || 300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={config.dataKey}
            nameKey={config.nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return { default: PieChartComponent };
});

// ============================================================================
// WRAPPER COMPONENTS WITH LOADING STATES
// ============================================================================

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="w-full" style={{ height }} />
    </CardContent>
  </Card>
);

interface LazyBarChartProps {
  data: any[];
  config: {
    xKey: string;
    bars: Array<{
      key: string;
      color: string;
      name?: string;
    }>;
  };
  width?: number;
  height?: number;
}

export function LazyBarChartWrapper(props: LazyBarChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <LazyBarChart {...props} />
    </Suspense>
  );
}

interface LazyLineChartProps {
  data: any[];
  config: {
    xKey: string;
    lines: Array<{
      key: string;
      color: string;
      name?: string;
    }>;
  };
  width?: number;
  height?: number;
}

export function LazyLineChartWrapper(props: LazyLineChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <LazyLineChart {...props} />
    </Suspense>
  );
}

interface LazyPieChartProps {
  data: any[];
  config: {
    dataKey: string;
    nameKey: string;
    colors: string[];
  };
  width?: number;
  height?: number;
}

export function LazyPieChartWrapper(props: LazyPieChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <LazyPieChart {...props} />
    </Suspense>
  );
}

// Export all chart types
export {
  LazyBarChartWrapper as LazyBarChart,
  LazyLineChartWrapper as LazyLineChart,
  LazyPieChartWrapper as LazyPieChart,
};