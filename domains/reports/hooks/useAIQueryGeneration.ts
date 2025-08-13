"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface QueryGenerationResult {
  query: string;
  explanation: string;
  parameters?: Record<string, any>;
}

export function useAIQueryGeneration() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateQueryFromPrompt = async (
    prompt: string
  ): Promise<QueryGenerationResult> => {
    setLoading(true);
    setError(null);

    try {
      // Get the auth token for the API request
      const token = await getToken();

      // Make the API request to the AI service
      const response = await fetch("/api/reports/ai/generate-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate query: ${response.statusText}`);
      }

      const result = await response.json();

      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error ? err : new Error("Failed to generate query")
      );
      throw err;
    }
  };

  return {
    generateQueryFromPrompt,
    loading,
    error,
  };
}
