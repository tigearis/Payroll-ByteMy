"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingErrorBoundaryState {
  hasError: boolean;
  error?: Error | undefined;
}

interface BillingErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error | undefined; retry?: () => void }> | undefined;
}

class BillingErrorBoundaryClass extends React.Component<
  BillingErrorBoundaryProps,
  BillingErrorBoundaryState
> {
  constructor(props: BillingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): BillingErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Billing Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return (
          <Fallback 
            {...(this.state.error && { error: this.state.error })} 
            retry={() => this.setState({ hasError: false })}
          />
        );
      }

      return (
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Billing Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {process.env.NODE_ENV === 'development' 
                  ? this.state.error?.message 
                  : 'An error occurred while loading the billing component.'
                }
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button 
                onClick={() => this.setState({ hasError: false })}
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function BillingErrorBoundary({ children, fallback }: BillingErrorBoundaryProps) {
  return (
    <BillingErrorBoundaryClass fallback={fallback}>
      {children}
    </BillingErrorBoundaryClass>
  );
}

// Section-level error boundary for individual components
export function BillingSectionErrorBoundary({ 
  children, 
  sectionName = "Section" 
}: { 
  children: React.ReactNode; 
  sectionName?: string; 
}) {
  return (
    <BillingErrorBoundary
      fallback={({ error, retry }) => (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{sectionName} Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {process.env.NODE_ENV === 'development' 
                ? error?.message 
                : `Failed to load ${sectionName.toLowerCase()}`
              }
            </span>
            <Button variant="outline" size="sm" onClick={retry} className="ml-2 gap-1">
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
    >
      {children}
    </BillingErrorBoundary>
  );
}