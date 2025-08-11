"use client";

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface PayrollErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

/**
 * Error boundary component specifically for payroll detail pages
 * 
 * Features:
 * - Catches JavaScript errors in child components
 * - Provides user-friendly error messages
 * - Offers recovery actions (retry, navigate away)
 * - Logs errors for debugging (optional)
 * - Customizable fallback UI
 */
export class PayrollErrorBoundary extends Component<
  PayrollErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: PayrollErrorBoundaryProps) {
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
    console.error("PayrollErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold text-red-900">
                Something went wrong
              </CardTitle>
              
              <p className="text-gray-600 mt-2">
                We encountered an unexpected error while loading the payroll details. 
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error details (only show in development or if explicitly enabled) */}
              {(process.env.NODE_ENV === "development" || this.props.showDetails) && 
               this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Error Details</h4>
                  <div className="text-sm text-red-800 space-y-2">
                    <p><strong>Message:</strong> {this.state.error.message}</p>
                    <p><strong>Component Stack:</strong></p>
                    <pre className="bg-red-100 p-2 rounded text-xs overflow-auto max-h-32">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="min-w-32">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button variant="outline" asChild className="min-w-32">
                  <Link href="/payrolls">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Payrolls
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild className="min-w-32">
                  <Link href="/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
              
              {/* Help text */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  If this error continues to occur, please{" "}
                  <a 
                    href="mailto:support@bytemy.com.au" 
                    className="text-blue-600 hover:underline"
                  >
                    contact support
                  </a>{" "}
                  with the error details above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withPayrollErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<PayrollErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <PayrollErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </PayrollErrorBoundary>
  );

  WrappedComponent.displayName = `withPayrollErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Section-level error boundary for individual parts of the payroll page
interface PayrollSectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  onRetry?: () => void;
  fallback?: ReactNode;
}

export function PayrollSectionErrorBoundary({
  children,
  sectionName,
  onRetry,
  fallback,
}: PayrollSectionErrorBoundaryProps) {
  return (
    <PayrollErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`Error in ${sectionName}:`, error);
        console.error("Error info:", errorInfo);
      }}
      fallback={
        fallback || (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex items-center justify-center min-h-[200px] p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                <div>
                  <h3 className="text-lg font-medium text-destructive">
                    Failed to Load {sectionName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    An error occurred while loading this section
                  </p>
                </div>
                {onRetry && (
                  <Button onClick={onRetry} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      {children}
    </PayrollErrorBoundary>
  );
}

// Hook for handling async errors in components
export function useAsyncError() {
  const [, setError] = React.useState();
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}

export default PayrollErrorBoundary;