"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import type { ReportTemplate } from "../types/report.types";

// GraphQL queries
const GET_REPORT_TEMPLATES = gql`
  query GetReportTemplates {
    reportTemplates {
      id
      name
      description
      domains
      fields
      filters
      sorts
      limit
      createdBy
      createdAt
      updatedAt
      isPublic
      tags
    }
  }
`;

const SAVE_REPORT_TEMPLATE = gql`
  mutation SaveReportTemplate($template: ReportTemplateInput!) {
    saveReportTemplate(template: $template) {
      id
      name
    }
  }
`;

const DELETE_REPORT_TEMPLATE = gql`
  mutation DeleteReportTemplate($id: ID!) {
    deleteReportTemplate(id: $id) {
      success
    }
  }
`;

export function useReportTemplates() {
  const { user } = useUser();
  const userId = user?.id || "";

  // Query for report templates
  const { data, loading, error, refetch } = useQuery(GET_REPORT_TEMPLATES, {
    fetchPolicy: "cache-and-network",
  });

  // Mutations
  const [saveTemplateMutation] = useMutation(SAVE_REPORT_TEMPLATE);
  const [deleteTemplateMutation] = useMutation(DELETE_REPORT_TEMPLATE);

  // Process templates
  const templates: ReportTemplate[] = data?.reportTemplates || [];

  // Save a template
  const saveTemplate = async (template: Partial<ReportTemplate>) => {
    try {
      const result = await saveTemplateMutation({
        variables: {
          template: {
            ...template,
            createdBy: userId,
          },
        },
      });

      await refetch();
      return result.data.saveReportTemplate;
    } catch (err) {
      console.error("Error saving template:", err);
      throw err;
    }
  };

  // Delete a template
  const deleteTemplate = async (id: string) => {
    try {
      const result = await deleteTemplateMutation({
        variables: { id },
      });

      await refetch();
      return result.data.deleteReportTemplate;
    } catch (err) {
      console.error("Error deleting template:", err);
      throw err;
    }
  };

  return {
    templates,
    loading,
    error,
    saveTemplate,
    deleteTemplate,
    refetch,
  };
}
