"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import React, { Component, ReactNode, Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string | undefined;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined,
    });

    this.props.onError?.(error, errorInfo.componentStack || "");
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    }, 0);
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

// Standardized error fallback component
interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  showDetails?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  showDetails = false,
  actionText = "Try again",
  onAction,
}: ErrorFallbackProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      resetErrorBoundary?.();
    }
  };

  const isNetworkError = !!(
    error?.message?.includes("fetch") ||
    error?.message?.includes("network") ||
    error?.message?.includes("offline")
  );

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isNetworkError ? (
              <WifiOff className="h-12 w-12 text-red-500" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            )}
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {isNetworkError
              ? "Please check your internet connection and try again."
              : "An unexpected error occurred. Please try again."}
          </p>

          {showDetails && error && (
            <Alert className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2 text-sm font-mono">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleAction} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component variations
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      />
    </div>
  );
}

// Full page loading state
export interface PageLoadingProps {
  title?: string;
  description?: string;
  showLogo?: boolean;
}

export function PageLoading({
  title = "Loading...",
  description,
  showLogo = true,
}: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {showLogo && <ByteMyLoadingIcon className="h-12 w-12" />}
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// Card loading skeleton
export interface LoadingCardProps {
  rows?: number;
  showHeader?: boolean;
  showActions?: boolean;
  className?: string;
}

export function LoadingCard({
  rows = 3,
  showHeader = true,
  showActions = true,
  className,
}: LoadingCardProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
        {showActions && (
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Table loading skeleton
export interface LoadingTableProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function LoadingTable({
  columns = 4,
  rows = 5,
  showHeader = true,
  className,
}: LoadingTableProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-muted/50 p-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-t">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Combined wrapper that provides both error boundary and loading states
interface DataWrapperProps {
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  onRetry?: () => void;
  emptyState?: ReactNode;
  showEmpty?: boolean;
  resetKeys?: Array<string | number>;
}

export function DataWrapper({
  children,
  loading,
  error,
  loadingComponent,
  errorComponent,
  onRetry,
  emptyState,
  showEmpty,
  resetKeys,
}: DataWrapperProps) {
  if (loading) {
    return <>{loadingComponent || <PageLoading />}</>;
  }

  if (error) {
    return (
      <>
        {errorComponent || (
          <ErrorFallback
            error={error}
            onAction={onRetry}
            actionText={onRetry ? "Retry" : "Try again"}
          />
        )}
      </>
    );
  }

  if (showEmpty) {
    return <>{emptyState || <EmptyState />}</>;
  }

  return (
    <ErrorBoundary
      resetKeys={resetKeys}
      resetOnPropsChange={!!resetKeys?.length}
    >
      <Suspense fallback={loadingComponent || <PageLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Empty state component
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function EmptyState({
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

// Utility hooks for common loading/error patterns
export function useAsyncState<T>() {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = React.useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, loading: false, error: err }));
      throw err;
    }
  }, []);

  const reset = React.useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
