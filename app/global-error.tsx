// app/global-error.tsx
"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the global error for debugging
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="flex flex-1 items-center justify-center p-6 min-h-screen">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Error
            </h1>
            
            <p className="text-gray-600 mb-6">
              A critical error occurred that prevented the application from loading.
              This has been automatically reported to our team.
            </p>
            
            {process.env.NODE_ENV === "development" && (
              <details className="text-left mb-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Technical Details
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto text-left">
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
            
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}