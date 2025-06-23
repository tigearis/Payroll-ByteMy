// app/error.tsx
"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Enhanced logging for debugging
    console.error("App Error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error digest:", error.digest);
    console.error("Error cause:", error.cause);
    
    // Log component stack if available
    if (error.stack) {
      try {
        const componentStackMatch = error.stack.match(/at\s+([^(]+)/g);
        if (componentStackMatch && Array.isArray(componentStackMatch)) {
          console.error("Potential component stack:", componentStackMatch.slice(0, 10));
        }
      } catch (stackError) {
        console.error("Error parsing stack trace:", stackError);
      }
    }

    // Show a toast notification
    toast.error("Application Error", {
      description:
        "An unexpected error occurred. Please try refreshing the page.",
      duration: 8000,
      action: {
        label: "Retry",
        onClick: () => reset(),
      },
    });
  }, [error, reset]);

  return (
    <main className="flex flex-1 items-center justify-center p-6 min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            An unexpected error has occurred. This has been automatically
            reported to our team.
          </p>

          {/* Show error details in production too for debugging */}
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error Details {error?.digest ? `(${error.digest})` : ''}
            </summary>
            <div className="mt-2 text-xs bg-muted p-3 rounded space-y-2">
              <div>
                <strong>Message:</strong> {error?.message || 'Unknown error'}
              </div>
              {error?.digest && (
                <div>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              <div>
                <strong>Timestamp:</strong> {new Date().toISOString()}
              </div>
            </div>
          </details>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                {error.message}
                {error.stack && (
                  <>
                    {"\n\nStack trace:\n"}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
