"use client";

import { useState } from "react";
import type { ReportConfig } from "../types/report.types";

// Mock data generator for preview
const generateMockData = (config: ReportConfig) => {
  const domains = config.domains || [];
  const fields = config.fields || {};
  const limit = config.limit || 10;

  if (domains.length === 0 || Object.keys(fields).length === 0) {
    return [];
  }

  // Get the first domain and its fields
  const firstDomain = domains[0];
  const domainFields = fields[firstDomain] || [];

  if (domainFields.length === 0) {
    return [];
  }

  // Generate mock data rows
  return Array.from({ length: Math.min(limit, 5) }, (_, index) => {
    const row: Record<string, any> = {};

    // Add fields from the domain
    domainFields.forEach(field => {
      // Generate appropriate mock data based on field name patterns
      if (field.includes("id")) {
        row[field] = `ID-${index + 1000}`;
      } else if (field.includes("name")) {
        row[field] = `Sample ${field.replace("_", " ")} ${index + 1}`;
      } else if (
        field.includes("date") ||
        field.includes("start") ||
        field.includes("end")
      ) {
        // Generate a date in the past month
        const date = new Date();
        date.setDate(date.getDate() - index * 3 - 5);
        row[field] = date;
      } else if (field.includes("amount") || field.includes("total")) {
        row[field] = (1000 + index * 125.5).toFixed(2);
      } else if (field.includes("status")) {
        const statuses = ["Pending", "Approved", "Completed", "Rejected"];
        row[field] = statuses[index % statuses.length];
      } else if (field.includes("email")) {
        row[field] = `user${index + 1}@example.com`;
      } else if (field.includes("active") || field.includes("enabled")) {
        row[field] = index % 3 !== 0; // 2/3 will be true
      } else {
        row[field] = `Value ${index + 1} for ${field}`;
      }
    });

    return row;
  });
};

export function useReportPreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePreview = async (config: ReportConfig) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock data instead of making a real GraphQL query
      const mockData = generateMockData(config);

      setLoading(false);
      return {
        data: mockData,
        raw: { [config.domains[0]]: mockData },
      };
    } catch (err) {
      console.error("Error generating report preview:", err);
      setLoading(false);
      setError(
        err instanceof Error ? err : new Error("Failed to generate preview")
      );
      return {
        data: [],
        error: err,
      };
    }
  };

  return {
    generatePreview,
    loading,
    error,
  };
}
