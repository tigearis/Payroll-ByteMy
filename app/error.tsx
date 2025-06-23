// app/simple-error.tsx - Minimal error boundary to debug infinite loops
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SimpleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Simple Error Boundary:", error?.message || "Unknown error");
  }, [error]);

  return (
    <div style={{ 
      padding: "20px", 
      textAlign: "center", 
      fontFamily: "system-ui" 
    }}>
      <h1>Something went wrong</h1>
      <p>An error occurred in the application.</p>
      <button 
        onClick={reset}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Try Again
      </button>
      <button 
        onClick={() => window.location.href = "/dashboard"}
        style={{
          padding: "10px 20px",
          backgroundColor: "#666",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}