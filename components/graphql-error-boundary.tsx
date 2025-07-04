"use client";

import { AlertTriangle, RefreshCw, Shield, HelpCircle } from "lucide-react";
import React, { Component, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isPermissionError } from "@/lib/apollo";
import { handleGraphQLError } from "@/lib/utils/handle-graphql-error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  isPermissionError: boolean;
}

export class GraphQLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isPermissionError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      isPermissionError: isPermissionError(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log the error
    console.error("GraphQL Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      isPermissionError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.state.isPermissionError) {
        return this.renderPermissionError();
      }

      return this.renderGenericError();
    }

    return this.props.children;
  }

  private renderPermissionError() {
    const permissionError = this.state.error
      ? handleGraphQLError(this.state.error)
      : null;

    return (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800 dark:text-amber-200">
              Access Restricted
            </CardTitle>
          </div>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            You don&apos;t have permission to view this content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {permissionError?.userMessage ||
                "You may need additional permissions to view this data."}
            </p>
            {permissionError?.requiredRole && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Required role:{" "}
                <Badge variant="outline" className="mx-1">
                  {permissionError.requiredRole}
                </Badge>
              </p>
            )}
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Contact your administrator to request the necessary permissions.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Could open a support modal or contact form
                alert(
                  "Please contact your system administrator for assistance with permissions."
                );
              }}
              className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
            >
              <HelpCircle className="mr-1 h-3 w-3" />
              Get Help
            </Button>
          </div>

          {this.props.showErrorDetails && this.state.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-amber-600 dark:text-amber-400">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 p-2 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  private renderGenericError() {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800 dark:text-red-200">
              Something went wrong
            </CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            There was an error loading this content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            An unexpected error occurred. This might be a temporary issue.
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-700 dark:text-red-200"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Try Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-700 dark:text-red-200"
            >
              Refresh Page
            </Button>
          </div>

          {this.props.showErrorDetails && this.state.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 p-2 rounded overflow-auto max-h-40">
                {this.state.error.message}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {"\n\nComponent Stack:"}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }
}

// HOC wrapper for easier usage
export function withGraphQLErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<Props, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <GraphQLErrorBoundary {...options}>
        <Component {...props} />
      </GraphQLErrorBoundary>
    );
  };
}
