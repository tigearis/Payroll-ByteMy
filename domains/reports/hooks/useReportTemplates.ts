import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ReportTemplate } from "../types/report.types";

export function useReportTemplates() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  const fetchTemplates = useCallback(
    async (options?: { isPublic?: boolean; tags?: string[] }) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const queryParams = new URLSearchParams();
        if (options?.isPublic !== undefined) {
          queryParams.set("isPublic", options.isPublic.toString());
        }
        if (options?.tags) {
          queryParams.set("tags", options.tags.join(","));
        }

        const response = await fetch(
          `/api/reports/templates?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        setTemplates(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const saveTemplate = useCallback(
    async (template: Omit<ReportTemplate, "id">) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch("/api/reports/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(template),
        });

        if (!response.ok) {
          throw new Error("Failed to save template");
        }

        const savedTemplate = await response.json();
        setTemplates(prev => [...prev, savedTemplate]);
        toast.success("Template saved successfully");
        return savedTemplate;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const updateTemplate = useCallback(
    async (id: string, updates: Partial<ReportTemplate>) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch(`/api/reports/templates/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Failed to update template");
        }

        const updatedTemplate = await response.json();
        setTemplates(prev =>
          prev.map(t => (t.id === id ? updatedTemplate : t))
        );
        toast.success("Template updated successfully");
        return updatedTemplate;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch(`/api/reports/templates/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete template");
        }

        setTemplates(prev => prev.filter(t => t.id !== id));
        toast.success("Template deleted successfully");
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
