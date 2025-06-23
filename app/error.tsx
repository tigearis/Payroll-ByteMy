// app/error.tsx - Ultra-minimal error boundary
"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // No useEffect, no logging, no complex rendering to avoid loops
  return (
    <div style={{ 
      padding: "40px", 
      textAlign: "center", 
      fontFamily: "system-ui",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ color: "#dc2626", marginBottom: "16px" }}>Error Occurred</h1>
      <p style={{ marginBottom: "24px", color: "#6b7280" }}>
        Something went wrong. Please try again.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          onClick={reset}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = "/"}
          style={{
            padding: "12px 24px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}