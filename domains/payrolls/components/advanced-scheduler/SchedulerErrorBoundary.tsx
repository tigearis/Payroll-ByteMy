"use client";

import { RefreshCw, AlertTriangle } from "lucide-react";
import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logging/enterprise-logger";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface SchedulerErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export class SchedulerErrorBoundary extends Component<
  SchedulerErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: SchedulerErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to enterprise logger
    logger.error("❌ Advanced Scheduler Error Boundary caught error", {
      namespace: "payrolls_domain",
      component: "scheduler_error_boundary",
      error: error.message,
      metadata: {
        errorBoundary: "scheduler_error_boundary",
        protection: "error_boundary_protected",
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }

    logger.info("🔄 Scheduler error boundary reset", {
      namespace: "payrolls_domain",
      component: "scheduler_error_boundary",
      action: "error_boundary_reset",
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="w-full max-w-lg border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Advanced Scheduler Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  The advanced payroll scheduler encountered an unexpected error and needs to be reloaded.
                </p>
                
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4">
                    <summary className="text-xs font-mono cursor-pointer text-muted-foreground hover:text-foreground">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-muted rounded text-xs font-mono overflow-auto max-h-32">
                      <div className="text-destructive font-semibold">
                        {this.state.error.name}: {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <pre className="mt-1 text-muted-foreground">
                          {this.state.error.stack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
                <Button size="sm" onClick={this.handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for easier usage
export function withSchedulerErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <SchedulerErrorBoundary fallback={fallback}>
      <Component {...props} />
    </SchedulerErrorBoundary>
  );

  WrappedComponent.displayName = `withSchedulerErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}