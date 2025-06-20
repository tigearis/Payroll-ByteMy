"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorDisplay({
  error,
  reset,
  title = "Something went wrong!",
  description = "We're sorry, but we encountered an unexpected problem. Our team has been notified.",
}: ErrorDisplayProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <Card className="w-full max-w-md border-red-200 shadow-lg">
      <CardHeader className="bg-red-50 text-red-900">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          <span>Error</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">{title}</p>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          {error.message && (
            <div className="bg-gray-100 p-3 rounded border text-sm font-mono overflow-auto max-h-40">
              {error.message}
              {error.digest && (
                <div className="mt-2 text-xs text-gray-500">
                  Error ID: {error.digest}
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
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload Page
        </Button>
        {reset && (
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={reset}
          >
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <ErrorDisplay error={error} reset={reset} />
    </div>
  );
}
