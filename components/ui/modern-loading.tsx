"use client";

import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const loadingVariants = cva("flex items-center justify-center", {
  variants: {
    variant: {
      default: "flex-col space-y-3",
      inline: "flex-row space-x-2",
      minimal: "flex-col",
      dots: "flex-row space-x-1",
      pulse: "flex-col space-y-4",
      gradient: "flex-col space-y-3",
    },
    size: {
      xs: "min-h-[100px]",
      sm: "min-h-[200px]",
      md: "min-h-[300px]",
      lg: "min-h-[400px]",
      xl: "min-h-[500px]",
      full: "min-h-screen",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface ModernLoadingProps extends VariantProps<typeof loadingVariants> {
  title?: string;
  description?: string;
  className?: string;
  showProgress?: boolean;
  progress?: number;
}

export function ModernLoading({
  variant = "default",
  size = "md",
  title = "Loading...",
  description,
  className,
  showProgress = false,
  progress = 0,
}: ModernLoadingProps) {
  const containerClasses = loadingVariants({ variant, size, className });

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner />;
      case "pulse":
        return <PulseSpinner />;
      case "gradient":
        return <GradientSpinner />;
      case "minimal":
        return <MinimalSpinner />;
      case "inline":
        return <InlineSpinner />;
      default:
        return <DefaultSpinner />;
    }
  };

  const renderContent = () => {
    if (variant === "inline") {
      return (
        <>
          {renderSpinner()}
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </>
      );
    }

    if (variant === "minimal") {
      return renderSpinner();
    }

    return (
      <>
        {renderSpinner()}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          )}
          {showProgress && (
            <div className="w-64 mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className={containerClasses}
      role="status"
      aria-label={`Loading: ${title}`}
    >
      {renderContent()}
    </div>
  );
}

// Individual spinner components
function DefaultSpinner() {
  return (
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
      <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-primary/30 animate-spin animation-delay-75" />
    </div>
  );
}

function DotsSpinner() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

function PulseSpinner() {
  return (
    <div className="relative">
      <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute inset-2 w-12 h-12 bg-primary/40 rounded-full animate-pulse animation-delay-75" />
      <div className="absolute inset-4 w-8 h-8 bg-primary rounded-full animate-pulse animation-delay-150" />
    </div>
  );
}

function GradientSpinner() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/50 to-transparent animate-spin" />
      <div className="absolute inset-1 rounded-full bg-background" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-l from-transparent via-primary/20 to-primary/60 animate-spin animation-delay-75" />
    </div>
  );
}

function MinimalSpinner() {
  return <Loader2 className="w-8 h-8 animate-spin text-primary" />;
}

function InlineSpinner() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-muted border-t-primary animate-spin" />
  );
}

// Skeleton-based loading components
export function SkeletonCard() {
  return (
    <div className="p-6 space-y-4 bg-card rounded-lg border animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="h-10 bg-muted rounded w-64" />
        <div className="h-10 bg-muted rounded w-32" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="h-12 bg-muted/50 border-b" />
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-16 px-4 flex items-center space-x-4 border-b last:border-b-0"
          >
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="flex-1">
                <div className="h-4 bg-muted rounded w-full max-w-32" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Specialized loading components for specific use cases
export function PayrollsTabLoading() {
  return (
    <ModernLoading
      variant="gradient"
      size="sm"
      title="Loading Payrolls"
      description="Fetching payroll data for this client..."
    />
  );
}

export function PayrollDetailsLoading() {
  return (
    <ModernLoading
      variant="pulse"
      size="md"
      title="Loading Payroll Details"
      description="Getting comprehensive payroll information..."
    />
  );
}

export function QuickLoading({ text }: { text?: string }) {
  return (
    <ModernLoading variant="inline" size="xs" title={text || "Loading..."} />
  );
}

// Button loading state
export function ButtonLoading({ children, isLoading, ...props }: any) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
