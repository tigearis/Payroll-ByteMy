import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export interface ReportMetadata {
  availableFields: Record<string, string[]>;
  relationships: Record<string, Record<string, string>>;
  domains: string[];
  fieldTypes: Record<string, string>;
}

export function useReportMetadata() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait for auth to be loaded
      if (!isLoaded) {
        console.log("Auth not yet loaded, waiting...");
        return;
      }

      // Check if user is signed in
      if (!isSignedIn) {
        console.log("User not signed in");
        setError("Authentication required");
        return;
      }

      console.log("Fetching auth token...");
      const token = await getToken();
      console.log("Token received:", token ? "Yes" : "No");

      console.log("Fetching metadata...");
      const response = await fetch("/api/reports/metadata", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Metadata response status:", response.status);
      const data = await response.json();
      console.log("Metadata response data:", data);

      if (!response.ok) {
        if (response.status === 403) {
          setError(
            "You don't have permission to access the reports system. Please contact your administrator."
          );
        } else {
          setError(data.error || "Failed to load report metadata");
        }
        return;
      }

      setMetadata(data);
    } catch (error) {
      console.error("Detailed metadata loading error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      loadMetadata();
    }
  }, [isLoaded]);

  const refresh = () => {
    loadMetadata();
  };

  return {
    metadata,
    error,
    loading,
    refresh,
  };
}
