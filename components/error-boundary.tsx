"use client";

import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    reset: () => void;
    errorId?: string;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
}

// Enhanced Error Boundary
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate a unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      hasError: true,
      _error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    console.error("ErrorBoundary caught an error:", _error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(_error, errorInfo);
    }

    // Show error toast notification
    toast.error("An unexpected error occurred", {
      description: error.message,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });

    // Report error to monitoring service (if available)
    this.reportError(_error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Here you could integrate with error monitoring services
    // like Sentry, LogRocket, or custom analytics
    if (process.env.NODE_ENV === "production") {
      try {
        // Example: Send to error monitoring service
        console.log("Reporting error to monitoring service:", {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      } catch (reportingError) {
        console.error("Failed to report error:", reportingError);
      }
    }
  };

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        const fallbackProps = {
          error: this.state.error!,
          reset: this.handleReset,
          ...(this.state.errorId && { errorId: this.state.errorId }),
        };
        return <FallbackComponent {...fallbackProps} />;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md border-red-200 shadow-lg">
            <CardHeader className="bg-red-50 text-red-900">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <p className="text-lg font-medium mb-2">
                  We encountered an unexpected error
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Our team has been notified and we&apos;re working to fix this
                  issue.
                </p>
                {this.state.error?.message && (
                  <div className="bg-gray-100 p-3 rounded border text-sm font-mono overflow-auto max-h-40">
                    {this.state.error.message}
                    {this.state.errorId && (
                      <div className="mt-2 text-xs text-gray-500">
                        Error ID: {this.state.errorId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end bg-gray-50">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={this.handleGoHome}
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={this.handleReload}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button
                variant="default"
                className="w-full sm:w-auto"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component for easier usage
export function ErrorBoundaryWrapper({
  children,
  fallback,
  onError,
  isolate = false,
}: ErrorBoundaryProps) {
  const errorBoundaryProps = {
    isolate,
    ...(fallback && { fallback }),
    ...(onError && { onError }),
  };

  return <ErrorBoundary {...errorBoundaryProps}>{children}</ErrorBoundary>;
}

// Specific error components for different scenarios
export function ApiErrorFallback({
  _error,
  reset,
  errorId,
}: {
  error: Error;
  reset: () => void;
  errorId?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">API Error</h3>
      <p className="text-gray-600 text-center mb-4 max-w-md">
        We encountered an error while communicating with our servers. This might
        be a temporary issue.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
      {errorId && (
        <p className="text-xs text-gray-500 mt-2">Error ID: {errorId}</p>
      )}
    </div>
  );
}

export function ComponentErrorFallback({
  _error,
  reset,
  componentName,
}: {
  error: Error;
  reset: () => void;
  componentName?: string;
}) {
  return (
    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
      <div className="flex items-center mb-4">
        <Bug className="h-5 w-5 text-red-600 mr-2" />
        <h4 className="text-red-800 font-medium">
          {componentName ? `${componentName} Error` : "Component Error"}
        </h4>
      </div>
      <p className="text-red-700 text-sm mb-4">
        This component failed to load properly.
      </p>
      <Button onClick={reset} size="sm" variant="outline">
        <RefreshCw className="mr-2 h-3 w-3" />
        Retry
      </Button>
    </div>
  );
}

// Hook for programmatic error handling
export function useErrorHandler() {
  return React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || "component"}:`, _error);

    toast.error("Something went wrong", {
      description: error.message,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
  }, []);
}
