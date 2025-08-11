/**
 * Lazy-loaded Chart Components for Performance Optimization
 * 
 * PERFORMANCE IMPROVEMENT:
 * - Recharts is a heavy library (~1.5MB), lazy load it
 * - Only load chart components when needed
 * - Provides skeleton loading states for better UX
 */

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback for charts
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
    <div className="flex justify-center space-x-4">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

// Recharts Components (lazy-loaded)
export const LineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: false,
  }
);

export const BarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart })),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: false,
  }
);

export const PieChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PieChart })),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: false,
  }
);

export const AreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart })),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: false,
  }
);

// Chart components
export const XAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.XAxis })),
  { ssr: false }
);

export const YAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.YAxis })),
  { ssr: false }
);

export const CartesianGrid = dynamic(
  () => import('recharts').then(mod => ({ default: mod.CartesianGrid })),
  { ssr: false }
);

export const Tooltip = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Tooltip })),
  { ssr: false }
);

export const Legend = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Legend })),
  { ssr: false }
);

export const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);

// Line chart specific
export const Line = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Line })),
  { ssr: false }
);

// Bar chart specific
export const Bar = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Bar })),
  { ssr: false }
);

// Pie chart specific
export const Pie = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Pie })),
  { ssr: false }
);

export const Cell = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Cell })),
  { ssr: false }
);

// Area chart specific
export const Area = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Area })),
  { ssr: false }
);

// Complete chart component wrapper
export const LazyChart = ({
  type = 'line',
  data,
  height = 300,
  className = '',
  ...props
}: {
  type?: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  height?: number;
  className?: string;
  [key: string]: any;
}) => {
  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    pie: PieChart,
    area: AreaChart,
  }[type];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data} {...props} />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  Cell,
  Area,
  LazyChart,
};